using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Skills;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class SkillService : ISkillService
{
    private readonly PortfolioDbContext _context;

    private static readonly string[] SupportedLanguages = { "tr", "en" };

    public SkillService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<List<SkillGroupDto>> GetPublicAsync()
    {
        var groups = await _context.SkillGroups
            .AsNoTracking()
            .Include(s => s.Translations)
            .Include(s => s.Skills)
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        return groups.Select(MapToDto).ToList();
    }

    public async Task<List<SkillGroupDto>> GetAdminAsync()
    {
        var groups = await _context.SkillGroups
            .AsNoTracking()
            .Include(s => s.Translations)
            .Include(s => s.Skills)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        return groups.Select(MapToDto).ToList();
    }

    public async Task<SkillGroupDto> CreateAsync(CreateSkillGroupDto dto)
    {
        var group = new SkillGroup
        {
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            Translations = NormalizeTranslations(dto.Translations),
            Skills = NormalizeSkills(dto.Skills)
        };

        _context.SkillGroups.Add(group);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(group.Id);
    }

    public async Task<SkillGroupDto> UpdateAsync(int id, UpdateSkillGroupDto dto)
    {
        var group = await _context.SkillGroups
            .Include(s => s.Translations)
            .Include(s => s.Skills)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (group is null)
        {
            throw new KeyNotFoundException("Skill grubu bulunamadı.");
        }

        group.IsActive = dto.IsActive;
        group.DisplayOrder = dto.DisplayOrder;
        group.UpdatedAt = DateTime.UtcNow;

        _context.SkillGroupTranslations.RemoveRange(group.Translations);
        _context.SkillItems.RemoveRange(group.Skills);

        group.Translations = NormalizeTranslations(dto.Translations);
        group.Skills = NormalizeSkills(dto.Skills);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(group.Id);
    }

    public async Task DeleteAsync(int id)
    {
        var group = await _context.SkillGroups
            .FirstOrDefaultAsync(s => s.Id == id);

        if (group is null)
        {
            throw new KeyNotFoundException("Skill grubu bulunamadı.");
        }

        _context.SkillGroups.Remove(group);
        await _context.SaveChangesAsync();
    }

    private async Task<SkillGroupDto> GetByIdAsync(int id)
    {
        var group = await _context.SkillGroups
            .AsNoTracking()
            .Include(s => s.Translations)
            .Include(s => s.Skills)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (group is null)
        {
            throw new KeyNotFoundException("Skill grubu bulunamadı.");
        }

        return MapToDto(group);
    }

    private static List<SkillGroupTranslation> NormalizeTranslations(
        List<SkillGroupTranslationDto> translations)
    {
        return SupportedLanguages.Select(languageCode =>
        {
            var translation = translations
                .LastOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));

            return new SkillGroupTranslation
            {
                LanguageCode = languageCode,
                Title = translation?.Title.Trim() ?? string.Empty,
                Description = translation?.Description.Trim() ?? string.Empty
            };
        }).ToList();
    }

    private static List<SkillItem> NormalizeSkills(List<SkillItemDto> skills)
    {
        return skills
            .OrderBy(s => s.DisplayOrder)
            .Select((skill, index) => new SkillItem
            {
                Name = skill.Name.Trim(),
                IsActive = skill.IsActive,
                DisplayOrder = skill.DisplayOrder > 0 ? skill.DisplayOrder : index + 1,
                CreatedAt = DateTime.UtcNow
            })
            .Where(skill => !string.IsNullOrWhiteSpace(skill.Name))
            .ToList();
    }

    private static SkillGroupDto MapToDto(SkillGroup group)
    {
        return new SkillGroupDto
        {
            Id = group.Id,
            IsActive = group.IsActive,
            DisplayOrder = group.DisplayOrder,
            Translations = group.Translations
                .OrderBy(t => t.LanguageCode == "tr" ? 0 : 1)
                .Select(t => new SkillGroupTranslationDto
                {
                    LanguageCode = t.LanguageCode,
                    Title = t.Title,
                    Description = t.Description
                })
                .ToList(),
            Skills = group.Skills
                .OrderBy(s => s.DisplayOrder)
                .Select(s => new SkillItemDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    IsActive = s.IsActive,
                    DisplayOrder = s.DisplayOrder
                })
                .ToList()
        };
    }
}