using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.SiteTexts;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class SiteTextService : ISiteTextService
{
    private readonly PortfolioDbContext _context;

    private static readonly string[] SupportedLanguages = { "tr", "en" };

    public SiteTextService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<List<SiteTextItemDto>> GetPublicAsync()
    {
        await EnsureDefaultTextsAsync();

        var items = await _context.SiteTextItems
            .AsNoTracking()
            .Include(x => x.Translations)
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<List<SiteTextItemDto>> GetAdminAsync()
    {
        await EnsureDefaultTextsAsync();

        var items = await _context.SiteTextItems
            .AsNoTracking()
            .Include(x => x.Translations)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<List<SiteTextItemDto>> UpdateAllAsync(UpdateSiteTextsDto dto)
    {
        await EnsureDefaultTextsAsync();

        var existingItems = await _context.SiteTextItems
            .Include(x => x.Translations)
            .ToListAsync();

        foreach (var itemDto in dto.Items)
        {
            var item = existingItems.FirstOrDefault(x => x.Key == itemDto.Key);

            if (item is null)
            {
                continue;
            }

            item.Label = itemDto.Label.Trim();
            item.GroupKey = itemDto.GroupKey.Trim();
            item.IsActive = itemDto.IsActive;
            item.DisplayOrder = itemDto.DisplayOrder;
            item.UpdatedAt = DateTime.UtcNow;

            foreach (var languageCode in SupportedLanguages)
            {
                var translationDto = itemDto.Translations
                    .LastOrDefault(x => x.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));

                var translation = item.Translations
                    .FirstOrDefault(x => x.LanguageCode.Equals(languageCode, StringComparison.OrdinalIgnoreCase));

                if (translation is null)
                {
                    translation = new SiteTextTranslation
                    {
                        LanguageCode = languageCode
                    };

                    item.Translations.Add(translation);
                }

                translation.Value = translationDto?.Value.Trim() ?? string.Empty;
            }
        }

        await _context.SaveChangesAsync();

        return await GetAdminAsync();
    }

    private async Task EnsureDefaultTextsAsync()
    {
        var defaults = GetDefaultItems();

        var existingKeys = await _context.SiteTextItems
            .Select(x => x.Key)
            .ToListAsync();

        var existingKeySet = existingKeys.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var missingItems = defaults
            .Where(item => !existingKeySet.Contains(item.Key))
            .ToList();

        if (missingItems.Count == 0)
        {
            return;
        }

        var maxOrder = await _context.SiteTextItems
            .Select(x => (int?)x.DisplayOrder)
            .MaxAsync() ?? 0;

        foreach (var item in missingItems)
        {
            maxOrder++;
            item.DisplayOrder = maxOrder;
            item.CreatedAt = DateTime.UtcNow;
        }

        _context.SiteTextItems.AddRange(missingItems);
        await _context.SaveChangesAsync();
    }

    private static List<SiteTextItem> GetDefaultItems()
    {
        var order = 1;

        return new List<SiteTextItem>
        {
            Create("nav.projects", "nav", "Navbar - Projeler", "Projeler", "Projects", order++),
            Create("nav.skills", "nav", "Navbar - Yetenekler", "Yetenekler", "Skills", order++),
            Create("nav.about", "nav", "Navbar - Hakkımda", "Hakkımda", "About", order++),
            Create("nav.contact", "nav", "Navbar - İletişim", "İletişim", "Contact", order++),

            Create("projects.label", "projects", "Projeler - Küçük Başlık", "Öne Çıkan İşler", "Featured Work", order++),
            Create("projects.title", "projects", "Projeler - Başlık", "Nasıl geliştirdiğimi gösteren projeler.", "Projects that show how I build.", order++),
            Create("projects.description", "projects", "Projeler - Açıklama", "Full-stack, yapay zeka destekli ve ürün odaklı projelerden seçilmiş çalışmalar. Her proje; pratik mühendislik, temiz yapı ve gerçek problem çözme yaklaşımını göstermek için tasarlandı.", "A selection of full-stack, AI-assisted and product-focused projects. Each project is designed to show practical engineering, clean structure and real-world problem solving.", order++),
            Create("projects.liveDemo", "projects", "Projeler - Canlı Demo Butonu", "Canlı Demo", "Live Demo", order++),
            Create("projects.github", "projects", "Projeler - GitHub Butonu", "GitHub", "GitHub", order++),

            Create("skills.label", "skills", "Yetenekler - Küçük Başlık", "Teknik Yetenekler", "Technical Skills", order++),
            Create("skills.title", "skills", "Yetenekler - Başlık", "Kullandığım teknolojiler ve odak alanlarım.", "Technologies and focus areas I work with.", order++),
            Create("skills.description", "skills", "Yetenekler - Açıklama", "Frontend, backend, veritabanı, yapay zeka ve Unity tarafında geliştirdiğim projelerde kullandığım temel teknolojiler.", "Core technologies I use across frontend, backend, database, AI-assisted applications and Unity-based projects.", order++),

            Create("education.label", "education", "Eğitim - Küçük Başlık", "Eğitim Geçmişi", "Education", order++),
            Create("education.title", "education", "Eğitim - Başlık", "Akademik yolculuğum.", "My academic journey.", order++),
            Create("education.description", "education", "Eğitim - Açıklama", "Eğitim sürecimi kronolojik olarak sade bir zaman çizelgesiyle görebilirsin.", "A clean chronological timeline of my education path.", order++),

            Create("about.label", "about", "Hakkımda - Küçük Başlık", "Hakkımda", "About Me", order++),
            Create("about.title", "about", "Hakkımda - Başlık", "Yazılımı sadece ekran değil, sistem olarak düşünüyorum.", "I think of software as a system, not just a screen.", order++),
            Create("about.description", "about", "Hakkımda - Açıklama", "Projelerimde temiz mimari, güvenli yapı, kullanıcı deneyimi ve gerçek ihtiyaçlara çözüm üretme yaklaşımına odaklanıyorum.", "In my projects, I focus on clean architecture, secure structure, user experience and solving real needs.", order++),

            Create("testimonials.label", "testimonials", "Yorumlar - Küçük Başlık", "Yorumlar", "Testimonials", order++),
            Create("testimonials.title", "testimonials", "Yorumlar - Başlık", "Birlikte çalışılan kişilerden geri bildirimler.", "Feedback from people I worked with.", order++),
            Create("testimonials.description", "testimonials", "Yorumlar - Açıklama", "Projeler, iletişim ve çalışma süreci hakkında bırakılan yorumlar. Yorumlar admin onayından sonra sitede yayınlanır.", "Comments about projects, communication and collaboration process. Testimonials are published after admin approval.", order++),
            Create("testimonials.formTitle", "testimonials", "Yorumlar - Form Başlığı", "Deneyimini Paylaş", "Share Your Experience", order++),
            Create("testimonials.formDescription", "testimonials", "Yorumlar - Form Açıklaması", "Yorumun incelendikten sonra portföy sayfasında yayınlanacaktır.", "Your testimonial will be reviewed before it appears on the portfolio page.", order++),
            Create("testimonials.fullName", "testimonials", "Yorumlar - Ad Soyad", "Ad Soyad", "Full Name", order++),
            Create("testimonials.userTitle", "testimonials", "Yorumlar - Ünvan", "Ünvan", "Title", order++),
            Create("testimonials.company", "testimonials", "Yorumlar - Şirket", "Şirket", "Company", order++),
            Create("testimonials.rating", "testimonials", "Yorumlar - Puan", "Puan", "Rating", order++),
            Create("testimonials.comment", "testimonials", "Yorumlar - Yorum", "Yorum", "Comment", order++),
            Create("testimonials.submit", "testimonials", "Yorumlar - Gönder Butonu", "Yorumu Gönder", "Submit Testimonial", order++),
            Create("testimonials.sending", "testimonials", "Yorumlar - Gönderiliyor", "Gönderiliyor...", "Sending...", order++),

            Create("contact.label", "contact", "İletişim - Küçük Başlık", "İletişim", "Contact", order++),
            Create("contact.title", "contact", "İletişim - Başlık", "Birlikte proje geliştirelim.", "Let's build something together.", order++),
            Create("contact.description", "contact", "İletişim - Açıklama", "Junior software developer, full-stack developer, AI destekli uygulama geliştirme ve Unity projeleri için iletişime açığım.", "I am open to junior software developer, full-stack developer, AI-assisted application developer and Unity developer opportunities.", order++),
            Create("contact.note", "contact", "İletişim - Not", "İlk sürümde güvenlik için iletişim formu yerine doğrudan bağlantılar kullanıyorum. Mesaj formu backend ve güvenlik kontrolleriyle birlikte eklenecek.", "For the first version, I use direct contact links instead of a contact form for security reasons. A message form will be added later with backend validation and security controls.", order++),

            Create("footer.builtWith", "footer", "Footer - Teknoloji", "React, ASP.NET Core ve MSSQL ile geliştiriliyor.", "Built with React, ASP.NET Core and MSSQL.", order++),
            Create("footer.rights", "footer", "Footer - Haklar", "Tüm hakları saklıdır.", "All rights reserved.", order++)
        };
    }

    private static SiteTextItem Create(
        string key,
        string groupKey,
        string label,
        string trValue,
        string enValue,
        int displayOrder)
    {
        return new SiteTextItem
        {
            Key = key,
            GroupKey = groupKey,
            Label = label,
            IsActive = true,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow,
            Translations = new List<SiteTextTranslation>
            {
                new()
                {
                    LanguageCode = "tr",
                    Value = trValue
                },
                new()
                {
                    LanguageCode = "en",
                    Value = enValue
                }
            }
        };
    }

    private static SiteTextItemDto MapToDto(SiteTextItem item)
    {
        return new SiteTextItemDto
        {
            Id = item.Id,
            Key = item.Key,
            GroupKey = item.GroupKey,
            Label = item.Label,
            IsActive = item.IsActive,
            DisplayOrder = item.DisplayOrder,
            Translations = item.Translations
                .OrderBy(x => x.LanguageCode == "tr" ? 0 : 1)
                .Select(x => new SiteTextTranslationDto
                {
                    LanguageCode = x.LanguageCode,
                    Value = x.Value
                })
                .ToList()
        };
    }
}