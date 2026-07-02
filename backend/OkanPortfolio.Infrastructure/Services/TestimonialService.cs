using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Testimonials;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class TestimonialService : ITestimonialService
{
    private readonly PortfolioDbContext _context;

    public TestimonialService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<List<TestimonialDto>> GetPublicAsync()
    {
        return await _context.Testimonials
            .AsNoTracking()
            .Include(t => t.Translations)
            .Where(t => t.IsActive && t.IsApproved)
            .OrderBy(t => t.DisplayOrder)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => MapToDto(t))
            .ToListAsync();
    }

    public async Task<List<TestimonialDto>> GetAdminAsync()
    {
        return await _context.Testimonials
            .AsNoTracking()
            .Include(t => t.Translations)
            .OrderBy(t => t.IsApproved)
            .ThenBy(t => t.DisplayOrder)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => MapToDto(t))
            .ToListAsync();
    }

    public async Task<TestimonialDto> CreatePublicAsync(CreatePublicTestimonialDto dto)
    {
        ValidatePublicCreate(dto);

        var nextDisplayOrder = await GetNextDisplayOrderAsync();

        var testimonial = new Testimonial
        {
            FullName = dto.FullName.Trim(),
            Title = dto.Title.Trim(),
            Company = dto.Company.Trim(),
            Rating = NormalizeRating(dto.Rating),
            IsApproved = false,
            IsActive = true,
            DisplayOrder = nextDisplayOrder,
            CreatedAt = DateTime.UtcNow,
            Translations = new List<TestimonialTranslation>
            {
                new TestimonialTranslation
                {
                    LanguageCode = "tr",
                    Comment = dto.Comment.Trim(),
                },
            },
        };

        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync();

        return MapToDto(testimonial);
    }

    public async Task<TestimonialDto> UpdateAsync(int id, UpdateTestimonialDto dto)
    {
        ValidateUpdate(dto);

        var testimonial = await _context.Testimonials
            .Include(t => t.Translations)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (testimonial is null)
        {
            throw new InvalidOperationException("Yorum bulunamadı.");
        }

        var wasApproved = testimonial.IsApproved;

        testimonial.FullName = dto.FullName.Trim();
        testimonial.Title = dto.Title.Trim();
        testimonial.Company = dto.Company.Trim();
        testimonial.Rating = NormalizeRating(dto.Rating);
        testimonial.IsApproved = dto.IsApproved;
        testimonial.IsActive = dto.IsActive;
        testimonial.DisplayOrder = dto.DisplayOrder;
        testimonial.UpdatedAt = DateTime.UtcNow;

        if (!wasApproved && dto.IsApproved)
        {
            testimonial.ApprovedAt = DateTime.UtcNow;
        }

        testimonial.Translations.Clear();

        foreach (var translation in dto.Translations)
        {
            if (string.IsNullOrWhiteSpace(translation.LanguageCode) ||
                string.IsNullOrWhiteSpace(translation.Comment))
            {
                continue;
            }

            testimonial.Translations.Add(new TestimonialTranslation
            {
                LanguageCode = translation.LanguageCode.Trim().ToLower(),
                Comment = translation.Comment.Trim(),
            });
        }

        await _context.SaveChangesAsync();

        return MapToDto(testimonial);
    }

    public async Task DeleteAsync(int id)
    {
        var testimonial = await _context.Testimonials
            .FirstOrDefaultAsync(t => t.Id == id);

        if (testimonial is null)
        {
            throw new InvalidOperationException("Yorum bulunamadı.");
        }

        _context.Testimonials.Remove(testimonial);
        await _context.SaveChangesAsync();
    }

    private async Task<int> GetNextDisplayOrderAsync()
    {
        var maxOrder = await _context.Testimonials
            .Select(t => (int?)t.DisplayOrder)
            .MaxAsync();

        return (maxOrder ?? 0) + 1;
    }

    private static void ValidatePublicCreate(CreatePublicTestimonialDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            throw new InvalidOperationException("Ad soyad alanı zorunludur.");
        }

        if (dto.FullName.Trim().Length > 120)
        {
            throw new InvalidOperationException("Ad soyad en fazla 120 karakter olabilir.");
        }

        if (!string.IsNullOrWhiteSpace(dto.Title) && dto.Title.Trim().Length > 120)
        {
            throw new InvalidOperationException("Ünvan en fazla 120 karakter olabilir.");
        }

        if (!string.IsNullOrWhiteSpace(dto.Company) && dto.Company.Trim().Length > 120)
        {
            throw new InvalidOperationException("Şirket adı en fazla 120 karakter olabilir.");
        }

        if (string.IsNullOrWhiteSpace(dto.Comment))
        {
            throw new InvalidOperationException("Yorum alanı zorunludur.");
        }

        if (dto.Comment.Trim().Length < 10)
        {
            throw new InvalidOperationException("Yorum en az 10 karakter olmalıdır.");
        }

        if (dto.Comment.Trim().Length > 1000)
        {
            throw new InvalidOperationException("Yorum en fazla 1000 karakter olabilir.");
        }

        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new InvalidOperationException("Puan 1 ile 5 arasında olmalıdır.");
        }
    }

    private static void ValidateUpdate(UpdateTestimonialDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            throw new InvalidOperationException("Ad soyad alanı zorunludur.");
        }

        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new InvalidOperationException("Puan 1 ile 5 arasında olmalıdır.");
        }

        if (dto.Translations.Count == 0)
        {
            throw new InvalidOperationException("En az bir yorum çevirisi bulunmalıdır.");
        }

        foreach (var translation in dto.Translations)
        {
            if (string.IsNullOrWhiteSpace(translation.LanguageCode))
            {
                throw new InvalidOperationException("Dil kodu zorunludur.");
            }

            if (string.IsNullOrWhiteSpace(translation.Comment))
            {
                throw new InvalidOperationException("Yorum metni zorunludur.");
            }

            if (translation.Comment.Trim().Length > 1000)
            {
                throw new InvalidOperationException("Yorum en fazla 1000 karakter olabilir.");
            }
        }
    }

    private static decimal NormalizeRating(decimal rating)
    {
        if (rating < 1)
        {
            return 1;
        }

        if (rating > 5)
        {
            return 5;
        }

        return Math.Round(rating * 2, MidpointRounding.AwayFromZero) / 2;
    }

    private static TestimonialDto MapToDto(Testimonial testimonial)
    {
        return new TestimonialDto
        {
            Id = testimonial.Id,
            FullName = testimonial.FullName,
            Title = testimonial.Title,
            Company = testimonial.Company,
            Rating = testimonial.Rating,
            IsApproved = testimonial.IsApproved,
            IsActive = testimonial.IsActive,
            DisplayOrder = testimonial.DisplayOrder,
            CreatedAt = testimonial.CreatedAt,
            Translations = testimonial.Translations
                .OrderBy(t => t.LanguageCode)
                .Select(t => new TestimonialTranslationDto
                {
                    LanguageCode = t.LanguageCode,
                    Comment = t.Comment,
                })
                .ToList(),
        };
    }
}