using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.About;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class AboutService : IAboutService
{
    private readonly PortfolioDbContext _context;

    private static readonly string[] SupportedLanguages = { "tr", "en" };

    public AboutService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<AboutContentDto> GetPublicAsync()
    {
        var content = await GetOrCreateAboutContentAsync(asNoTracking: true);

        return MapToDto(content);
    }

    public async Task<AboutContentDto> GetAdminAsync()
    {
        var content = await GetOrCreateAboutContentAsync(asNoTracking: true);

        return MapToDto(content);
    }

    public async Task<AboutContentDto> UpdateAsync(UpdateAboutContentDto dto)
    {
        var content = await GetOrCreateAboutContentAsync(asNoTracking: false);

        content.IsActive = dto.IsActive;
        content.UpdatedAt = DateTime.UtcNow;

        UpdateContentTranslations(content, dto.Translations);
        UpdateFocusAreas(content, dto.FocusAreas);

        await _context.SaveChangesAsync();

        var updatedContent = await GetOrCreateAboutContentAsync(asNoTracking: true);

        return MapToDto(updatedContent);
    }

    private async Task<AboutContent> GetOrCreateAboutContentAsync(bool asNoTracking)
    {
        var query = _context.AboutContents
            .Include(a => a.Translations)
            .Include(a => a.FocusAreas)
                .ThenInclude(f => f.Translations)
            .AsQueryable();

        if (asNoTracking)
        {
            query = query.AsNoTracking();
        }

        var content = await query
            .OrderBy(a => a.Id)
            .FirstOrDefaultAsync();

        if (content is not null)
        {
            return content;
        }

        var defaultContent = CreateDefaultContent();

        _context.AboutContents.Add(defaultContent);
        await _context.SaveChangesAsync();

        return await GetOrCreateAboutContentAsync(asNoTracking);
    }

    private static AboutContent CreateDefaultContent()
    {
        return new AboutContent
        {
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Translations = new List<AboutTranslation>
            {
                new()
                {
                    LanguageCode = "tr",
                    Label = "Hakkımda",
                    Title = "Sadece kod yazmıyor, ürün mantığıyla geliştiriyorum.",
                    Description = "Modern, güvenli ve sürdürülebilir yazılım ürünleri geliştirmeye odaklanıyorum.",
                    Intro = "Bilgisayar Mühendisliği mezunu olarak full-stack web geliştirme, yapay zeka destekli uygulamalar ve Unity tabanlı interaktif projeler üzerine çalışıyorum. Amacım sadece çalışan ekranlar yapmak değil; güvenli, sürdürülebilir ve kullanıcı odaklı yazılım ürünleri geliştirmek."
                },
                new()
                {
                    LanguageCode = "en",
                    Label = "About",
                    Title = "I do not just write code, I build with product thinking.",
                    Description = "I focus on building modern, secure and maintainable software products.",
                    Intro = "As a Computer Engineering graduate, I focus on full-stack web development, AI-assisted applications and Unity-based interactive projects. My goal is not only to build working screens, but to develop secure, maintainable and user-focused software products."
                }
            },
            FocusAreas = new List<AboutFocusArea>
            {
                new()
                {
                    IsActive = true,
                    DisplayOrder = 1,
                    CreatedAt = DateTime.UtcNow,
                    Translations = new List<AboutFocusAreaTranslation>
                    {
                        new()
                        {
                            LanguageCode = "tr",
                            Title = "Full-Stack Geliştirme",
                            Description = "Frontend, backend, veritabanı ve API katmanlarını bir bütün olarak ele alarak uçtan uca uygulama geliştirme."
                        },
                        new()
                        {
                            LanguageCode = "en",
                            Title = "Full-Stack Development",
                            Description = "Building end-to-end applications by combining frontend, backend, database and API layers."
                        }
                    }
                },
                new()
                {
                    IsActive = true,
                    DisplayOrder = 2,
                    CreatedAt = DateTime.UtcNow,
                    Translations = new List<AboutFocusAreaTranslation>
                    {
                        new()
                        {
                            LanguageCode = "tr",
                            Title = "Güvenlik Odaklı Yaklaşım",
                            Description = "Admin panel, veri doğrulama, yetkilendirme, güvenli API tasarımı ve temel güvenlik kontrollerini geliştirme sürecinin parçası olarak ele alma."
                        },
                        new()
                        {
                            LanguageCode = "en",
                            Title = "Security-Minded Approach",
                            Description = "Considering admin panels, validation, authorization, secure API design and basic security controls as part of the development process."
                        }
                    }
                },
                new()
                {
                    IsActive = true,
                    DisplayOrder = 3,
                    CreatedAt = DateTime.UtcNow,
                    Translations = new List<AboutFocusAreaTranslation>
                    {
                        new()
                        {
                            LanguageCode = "tr",
                            Title = "AI Destekli Ürünler",
                            Description = "Yapay zeka servislerini kullanıcı deneyimini iyileştiren gerçek ürün akışlarına entegre etme."
                        },
                        new()
                        {
                            LanguageCode = "en",
                            Title = "AI-Assisted Products",
                            Description = "Integrating AI services into real product flows that improve user experience."
                        }
                    }
                }
            }
        };
    }

    private static void UpdateContentTranslations(
        AboutContent content,
        List<AboutTranslationDto> translations)
    {
        foreach (var languageCode in SupportedLanguages)
        {
            var dto = translations
                .LastOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));

            var existing = content.Translations
                .FirstOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));

            if (existing is null)
            {
                existing = new AboutTranslation
                {
                    LanguageCode = languageCode
                };

                content.Translations.Add(existing);
            }

            if (dto is null)
            {
                continue;
            }

            existing.Label = dto.Label.Trim();
            existing.Title = dto.Title.Trim();
            existing.Description = dto.Description.Trim();
            existing.Intro = dto.Intro.Trim();
        }
    }

    private void UpdateFocusAreas(
        AboutContent content,
        List<AboutFocusAreaDto> focusAreas)
    {
        _context.AboutFocusAreas.RemoveRange(content.FocusAreas);

        content.FocusAreas = focusAreas
            .OrderBy(f => f.DisplayOrder)
            .Select(f => new AboutFocusArea
            {
                AboutContentId = content.Id,
                IsActive = f.IsActive,
                DisplayOrder = f.DisplayOrder,
                CreatedAt = DateTime.UtcNow,
                Translations = SupportedLanguages.Select(languageCode =>
                {
                    var translation = f.Translations
                        .LastOrDefault(t => t.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));

                    return new AboutFocusAreaTranslation
                    {
                        LanguageCode = languageCode,
                        Title = translation?.Title.Trim() ?? string.Empty,
                        Description = translation?.Description.Trim() ?? string.Empty
                    };
                }).ToList()
            })
            .ToList();
    }

    private static AboutContentDto MapToDto(AboutContent content)
    {
        return new AboutContentDto
        {
            Id = content.Id,
            IsActive = content.IsActive,
            Translations = content.Translations
                .OrderBy(t => t.LanguageCode == "tr" ? 0 : 1)
                .Select(t => new AboutTranslationDto
                {
                    LanguageCode = t.LanguageCode,
                    Label = t.Label,
                    Title = t.Title,
                    Description = t.Description,
                    Intro = t.Intro
                })
                .ToList(),
            FocusAreas = content.FocusAreas
                .OrderBy(f => f.DisplayOrder)
                .Select(f => new AboutFocusAreaDto
                {
                    Id = f.Id,
                    IsActive = f.IsActive,
                    DisplayOrder = f.DisplayOrder,
                    Translations = f.Translations
                        .OrderBy(t => t.LanguageCode == "tr" ? 0 : 1)
                        .Select(t => new AboutFocusAreaTranslationDto
                        {
                            LanguageCode = t.LanguageCode,
                            Title = t.Title,
                            Description = t.Description
                        })
                        .ToList()
                })
                .ToList()
        };
    }
}