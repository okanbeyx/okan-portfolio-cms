using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Projects;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly PortfolioDbContext _context;

    public ProjectService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProjectListDto>> GetAllAsync()
    {
        var projects = await _context.Projects
            .Include(p => p.Translations)
            .OrderBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();

        return projects.Select(MapToListDto).ToList();
    }

    public async Task<List<ProjectListDto>> GetFeaturedAsync()
    {
        var projects = await _context.Projects
            .Include(p => p.Translations)
            .Where(p => p.IsActive && p.IsFeatured)
            .OrderBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();

        return projects.Select(MapToListDto).ToList();
    }

    public async Task<ProjectDetailDto?> GetByIdAsync(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Translations)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project is null)
        {
            return null;
        }

        return MapToDetailDto(project);
    }

    public async Task<ProjectDetailDto> CreateAsync(CreateProjectDto dto)
    {
        var translations = NormalizeTranslations(dto.Translations);

        var tr = GetTranslationOrFallback(translations, "tr");
        var en = GetTranslationOrFallback(translations, "en", tr);

        var project = new Project
        {
            // Eski kolonlar şimdilik required olduğu için yeni translations verisinden dolduruyoruz.
            TitleTr = tr.Title,
            TitleEn = en.Title,
            DescriptionTr = tr.Description,
            DescriptionEn = en.Description,
            CategoryTr = tr.Category,
            CategoryEn = en.Category,
            StatusTr = tr.Status,
            StatusEn = en.Status,

            TechStack = JoinTechStack(dto.TechStack),
            GithubUrl = dto.GithubUrl?.Trim(),
            LiveUrl = dto.LiveUrl?.Trim(),
            ImageUrl = dto.ImageUrl?.Trim(),
            IsFeatured = dto.IsFeatured,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            Translations = translations.Select(t => new ProjectTranslation
            {
                LanguageCode = t.LanguageCode,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                Status = t.Status
            }).ToList()
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return MapToDetailDto(project);
    }

    public async Task<bool> UpdateAsync(int id, UpdateProjectDto dto)
    {
        var project = await _context.Projects
            .Include(p => p.Translations)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project is null)
        {
            return false;
        }

        var translations = NormalizeTranslations(dto.Translations);

        var tr = GetTranslationOrFallback(translations, "tr");
        var en = GetTranslationOrFallback(translations, "en", tr);

        // Eski kolonlar şimdilik uyumluluk için güncelleniyor.
        project.TitleTr = tr.Title;
        project.TitleEn = en.Title;
        project.DescriptionTr = tr.Description;
        project.DescriptionEn = en.Description;
        project.CategoryTr = tr.Category;
        project.CategoryEn = en.Category;
        project.StatusTr = tr.Status;
        project.StatusEn = en.Status;

        project.TechStack = JoinTechStack(dto.TechStack);
        project.GithubUrl = dto.GithubUrl?.Trim();
        project.LiveUrl = dto.LiveUrl?.Trim();
        project.ImageUrl = dto.ImageUrl?.Trim();
        project.IsFeatured = dto.IsFeatured;
        project.IsActive = dto.IsActive;
        project.DisplayOrder = dto.DisplayOrder;
        project.UpdatedAt = DateTime.UtcNow;

        _context.ProjectTranslations.RemoveRange(project.Translations);

        project.Translations = translations.Select(t => new ProjectTranslation
        {
            ProjectId = project.Id,
            LanguageCode = t.LanguageCode,
            Title = t.Title,
            Description = t.Description,
            Category = t.Category,
            Status = t.Status
        }).ToList();

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project is null)
        {
            return false;
        }

        project.IsActive = false;
        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    private static ProjectListDto MapToListDto(Project project)
    {
        return new ProjectListDto
        {
            Id = project.Id,

            TitleTr = project.TitleTr,
            TitleEn = project.TitleEn,
            DescriptionTr = project.DescriptionTr,
            DescriptionEn = project.DescriptionEn,
            CategoryTr = project.CategoryTr,
            CategoryEn = project.CategoryEn,
            StatusTr = project.StatusTr,
            StatusEn = project.StatusEn,

            Translations = MapTranslations(project.Translations),

            TechStack = SplitTechStack(project.TechStack),
            GithubUrl = project.GithubUrl,
            LiveUrl = project.LiveUrl,
            ImageUrl = project.ImageUrl,
            IsFeatured = project.IsFeatured,
            IsActive = project.IsActive,
            DisplayOrder = project.DisplayOrder
        };
    }

    private static ProjectDetailDto MapToDetailDto(Project project)
    {
        return new ProjectDetailDto
        {
            Id = project.Id,

            TitleTr = project.TitleTr,
            TitleEn = project.TitleEn,
            DescriptionTr = project.DescriptionTr,
            DescriptionEn = project.DescriptionEn,
            CategoryTr = project.CategoryTr,
            CategoryEn = project.CategoryEn,
            StatusTr = project.StatusTr,
            StatusEn = project.StatusEn,

            Translations = MapTranslations(project.Translations),

            TechStack = SplitTechStack(project.TechStack),
            GithubUrl = project.GithubUrl,
            LiveUrl = project.LiveUrl,
            ImageUrl = project.ImageUrl,
            IsFeatured = project.IsFeatured,
            IsActive = project.IsActive,
            DisplayOrder = project.DisplayOrder,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,

            Images = project.Images
                .OrderByDescending(i => i.IsCover)
                .ThenBy(i => i.DisplayOrder)
                .Select(i => new ProjectImageDto
                {
                    Id = i.Id,
                    ProjectId = i.ProjectId,
                    ImageUrl = i.ImageUrl,
                    FileName = i.FileName,
                    AltText = i.AltText,
                    IsCover = i.IsCover,
                    DisplayOrder = i.DisplayOrder,
                    CreatedAt = i.CreatedAt
                })
                .ToList()
        };
    }

    private static List<ProjectTranslationDto> MapTranslations(IEnumerable<ProjectTranslation> translations)
    {
        return translations
            .OrderBy(t => t.LanguageCode)
            .Select(t => new ProjectTranslationDto
            {
                LanguageCode = t.LanguageCode,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                Status = t.Status
            })
            .ToList();
    }

    private static List<ProjectTranslationDto> NormalizeTranslations(List<ProjectTranslationDto> translations)
    {
        return translations
            .Where(t => !string.IsNullOrWhiteSpace(t.LanguageCode))
            .GroupBy(t => t.LanguageCode.Trim().ToLowerInvariant())
            .Select(group =>
            {
                var t = group.First();

                return new ProjectTranslationDto
                {
                    LanguageCode = t.LanguageCode.Trim().ToLowerInvariant(),
                    Title = t.Title.Trim(),
                    Description = t.Description.Trim(),
                    Category = t.Category.Trim(),
                    Status = t.Status.Trim()
                };
            })
            .Where(t =>
                !string.IsNullOrWhiteSpace(t.Title) &&
                !string.IsNullOrWhiteSpace(t.Description) &&
                !string.IsNullOrWhiteSpace(t.Category) &&
                !string.IsNullOrWhiteSpace(t.Status))
            .ToList();
    }

    private static ProjectTranslationDto GetTranslationOrFallback(
        List<ProjectTranslationDto> translations,
        string languageCode,
        ProjectTranslationDto? fallback = null)
    {
        var translation = translations.FirstOrDefault(t => t.LanguageCode == languageCode);

        if (translation is not null)
        {
            return translation;
        }

        if (fallback is not null)
        {
            return fallback;
        }

        if (translations.Count > 0)
        {
            return translations[0];
        }

        return new ProjectTranslationDto
        {
            LanguageCode = languageCode,
            Title = "Untitled",
            Description = "No description",
            Category = "General",
            Status = "Draft"
        };
    }

    private static List<string> SplitTechStack(string techStack)
    {
        if (string.IsNullOrWhiteSpace(techStack))
        {
            return [];
        }

        return techStack
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();
    }

    private static string JoinTechStack(List<string> techStack)
    {
        return string.Join(", ", techStack
            .Where(tech => !string.IsNullOrWhiteSpace(tech))
            .Select(tech => tech.Trim()));
    }
}