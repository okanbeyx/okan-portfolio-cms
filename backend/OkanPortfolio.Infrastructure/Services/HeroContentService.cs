using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Hero;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class HeroContentService : IHeroContentService
{
    private readonly PortfolioDbContext _context;

    public HeroContentService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<HeroContentDto> GetActiveAsync()
    {
        var heroContent = await _context.HeroContents
            .Include(h => h.Translations)
            .FirstOrDefaultAsync(h => h.IsActive);

        if (heroContent is null)
        {
            heroContent = await CreateDefaultHeroContentAsync();
        }

        return MapToDto(heroContent);
    }

    public async Task<HeroContentDto> GetAdminAsync()
    {
        var heroContent = await _context.HeroContents
            .Include(h => h.Translations)
            .OrderBy(h => h.Id)
            .FirstOrDefaultAsync();

        if (heroContent is null)
        {
            heroContent = await CreateDefaultHeroContentAsync();
        }

        return MapToDto(heroContent);
    }

    public async Task<HeroContentDto> UpdateAsync(UpdateHeroContentDto dto)
    {
        var heroContent = await _context.HeroContents
            .Include(h => h.Translations)
            .OrderBy(h => h.Id)
            .FirstOrDefaultAsync();

        if (heroContent is null)
        {
            heroContent = await CreateDefaultHeroContentAsync();
        }

        var translations = NormalizeTranslations(dto.Translations);

        heroContent.PrimaryButtonUrl = dto.PrimaryButtonUrl.Trim();
        heroContent.SecondaryButtonUrl = dto.SecondaryButtonUrl.Trim();
        heroContent.IsActive = dto.IsActive;
        heroContent.UpdatedAt = DateTime.UtcNow;

        _context.HeroTranslations.RemoveRange(heroContent.Translations);

        heroContent.Translations = translations.Select(t => new HeroTranslation
        {
            HeroContentId = heroContent.Id,
            LanguageCode = t.LanguageCode,
            Label = t.Label,
            Title = t.Title,
            Subtitle = t.Subtitle,
            PrimaryButtonText = t.PrimaryButtonText,
            SecondaryButtonText = t.SecondaryButtonText
        }).ToList();

        await _context.SaveChangesAsync();

        return MapToDto(heroContent);
    }

    private async Task<HeroContent> CreateDefaultHeroContentAsync()
    {
        var heroContent = new HeroContent
        {
            PrimaryButtonUrl = "#projects",
            SecondaryButtonUrl = "#",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Translations = new List<HeroTranslation>
            {
                new()
                {
                    LanguageCode = "tr",
                    Label = "Portföy CMS",
                    Title = "Okan Çelikcan",
                    Subtitle = "Bilgisayar Mühendisi | Full-Stack Developer | AI Destekli Web ve Unity Projeleri",
                    PrimaryButtonText = "Projeleri Gör",
                    SecondaryButtonText = "GitHub"
                },
                new()
                {
                    LanguageCode = "en",
                    Label = "Portfolio CMS",
                    Title = "Okan Çelikcan",
                    Subtitle = "Computer Engineer | Full-Stack Developer | AI-Assisted Web & Unity Projects",
                    PrimaryButtonText = "View Projects",
                    SecondaryButtonText = "GitHub"
                }
            }
        };

        _context.HeroContents.Add(heroContent);
        await _context.SaveChangesAsync();

        return heroContent;
    }

    private static HeroContentDto MapToDto(HeroContent heroContent)
    {
        return new HeroContentDto
        {
            Id = heroContent.Id,
            PrimaryButtonUrl = heroContent.PrimaryButtonUrl,
            SecondaryButtonUrl = heroContent.SecondaryButtonUrl,
            IsActive = heroContent.IsActive,
            CreatedAt = heroContent.CreatedAt,
            UpdatedAt = heroContent.UpdatedAt,
            Translations = heroContent.Translations
                .OrderBy(t => t.LanguageCode)
                .Select(t => new HeroTranslationDto
                {
                    LanguageCode = t.LanguageCode,
                    Label = t.Label,
                    Title = t.Title,
                    Subtitle = t.Subtitle,
                    PrimaryButtonText = t.PrimaryButtonText,
                    SecondaryButtonText = t.SecondaryButtonText
                })
                .ToList()
        };
    }

    private static List<HeroTranslationDto> NormalizeTranslations(List<HeroTranslationDto> translations)
    {
        return translations
            .Where(t => !string.IsNullOrWhiteSpace(t.LanguageCode))
            .GroupBy(t => t.LanguageCode.Trim().ToLowerInvariant())
            .Select(group =>
            {
                var t = group.First();

                return new HeroTranslationDto
                {
                    LanguageCode = t.LanguageCode.Trim().ToLowerInvariant(),
                    Label = t.Label.Trim(),
                    Title = t.Title.Trim(),
                    Subtitle = t.Subtitle.Trim(),
                    PrimaryButtonText = t.PrimaryButtonText.Trim(),
                    SecondaryButtonText = t.SecondaryButtonText.Trim()
                };
            })
            .Where(t =>
                !string.IsNullOrWhiteSpace(t.Label) &&
                !string.IsNullOrWhiteSpace(t.Title) &&
                !string.IsNullOrWhiteSpace(t.Subtitle) &&
                !string.IsNullOrWhiteSpace(t.PrimaryButtonText) &&
                !string.IsNullOrWhiteSpace(t.SecondaryButtonText)
            )
            .ToList();
    }
}