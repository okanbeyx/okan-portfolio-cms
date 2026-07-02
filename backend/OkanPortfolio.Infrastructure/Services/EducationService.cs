using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Education;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class EducationService : IEducationService
{
    private readonly PortfolioDbContext _context;

    public EducationService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<List<EducationItemDto>> GetAllAsync()
    {
        var educationItems = await _context.EducationItems
            .Include(e => e.Translations)
            .OrderBy(e => e.DisplayOrder)
            .ThenBy(e => e.StartYear)
            .ToListAsync();

        return educationItems.Select(MapToDto).ToList();
    }

    public async Task<List<EducationItemDto>> GetActiveAsync()
    {
        var educationItems = await _context.EducationItems
            .Include(e => e.Translations)
            .Where(e => e.IsActive)
            .OrderBy(e => e.DisplayOrder)
            .ThenBy(e => e.StartYear)
            .ToListAsync();

        return educationItems.Select(MapToDto).ToList();
    }

    public async Task<EducationItemDto?> GetByIdAsync(int id)
    {
        var educationItem = await _context.EducationItems
            .Include(e => e.Translations)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (educationItem is null)
        {
            return null;
        }

        return MapToDto(educationItem);
    }

    public async Task<EducationItemDto> CreateAsync(CreateEducationItemDto dto)
    {
        var translations = NormalizeTranslations(dto.Translations);

        var educationItem = new EducationItem
        {
            StartYear = dto.StartYear,
            EndYear = dto.IsCurrent ? null : dto.EndYear,
            IsCurrent = dto.IsCurrent,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            Translations = translations.Select(t => new EducationTranslation
            {
                LanguageCode = t.LanguageCode,
                SchoolName = t.SchoolName,
                Department = t.Department,
                Description = t.Description
            }).ToList()
        };

        _context.EducationItems.Add(educationItem);
        await _context.SaveChangesAsync();

        return MapToDto(educationItem);
    }

    public async Task<bool> UpdateAsync(int id, UpdateEducationItemDto dto)
    {
        var educationItem = await _context.EducationItems
            .Include(e => e.Translations)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (educationItem is null)
        {
            return false;
        }

        var translations = NormalizeTranslations(dto.Translations);

        educationItem.StartYear = dto.StartYear;
        educationItem.EndYear = dto.IsCurrent ? null : dto.EndYear;
        educationItem.IsCurrent = dto.IsCurrent;
        educationItem.IsActive = dto.IsActive;
        educationItem.DisplayOrder = dto.DisplayOrder;
        educationItem.UpdatedAt = DateTime.UtcNow;

        _context.EducationTranslations.RemoveRange(educationItem.Translations);

        educationItem.Translations = translations.Select(t => new EducationTranslation
        {
            EducationItemId = educationItem.Id,
            LanguageCode = t.LanguageCode,
            SchoolName = t.SchoolName,
            Department = t.Department,
            Description = t.Description
        }).ToList();

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var educationItem = await _context.EducationItems.FindAsync(id);

        if (educationItem is null)
        {
            return false;
        }

        educationItem.IsActive = false;
        educationItem.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    private static EducationItemDto MapToDto(EducationItem educationItem)
    {
        return new EducationItemDto
        {
            Id = educationItem.Id,
            StartYear = educationItem.StartYear,
            EndYear = educationItem.EndYear,
            IsCurrent = educationItem.IsCurrent,
            IsActive = educationItem.IsActive,
            DisplayOrder = educationItem.DisplayOrder,
            CreatedAt = educationItem.CreatedAt,
            UpdatedAt = educationItem.UpdatedAt,
            Translations = educationItem.Translations
                .OrderBy(t => t.LanguageCode)
                .Select(t => new EducationTranslationDto
                {
                    LanguageCode = t.LanguageCode,
                    SchoolName = t.SchoolName,
                    Department = t.Department,
                    Description = t.Description
                })
                .ToList()
        };
    }

    private static List<EducationTranslationDto> NormalizeTranslations(List<EducationTranslationDto> translations)
    {
        return translations
            .Where(t => !string.IsNullOrWhiteSpace(t.LanguageCode))
            .GroupBy(t => t.LanguageCode.Trim().ToLowerInvariant())
            .Select(group =>
            {
                var t = group.First();

                return new EducationTranslationDto
                {
                    LanguageCode = t.LanguageCode.Trim().ToLowerInvariant(),
                    SchoolName = t.SchoolName.Trim(),
                    Department = t.Department?.Trim() ?? string.Empty,
                    Description = t.Description?.Trim() ?? string.Empty
                };
            })
            .Where(t => !string.IsNullOrWhiteSpace(t.SchoolName))
            .ToList();
    }
}