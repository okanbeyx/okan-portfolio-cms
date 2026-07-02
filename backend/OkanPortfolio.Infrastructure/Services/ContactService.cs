using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Contacts;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class ContactService : IContactService
{
    private readonly PortfolioDbContext _context;

    public ContactService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContactItemDto>> GetPublicAsync()
    {
        return await _context.ContactItems
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Id)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<List<ContactItemDto>> GetAdminAsync()
    {
        return await _context.ContactItems
            .AsNoTracking()
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Id)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<ContactItemDto> CreateAsync(CreateContactItemDto dto)
    {
        ValidateContactItem(dto.Type, dto.Label, dto.Value, dto.Url);

        var contactItem = new ContactItem
        {
            Type = dto.Type.Trim(),
            Label = dto.Label.Trim(),
            Value = dto.Value.Trim(),
            Url = dto.Url.Trim(),
            IconKey = dto.IconKey.Trim(),
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
        };

        _context.ContactItems.Add(contactItem);
        await _context.SaveChangesAsync();

        return MapToDto(contactItem);
    }

    public async Task<ContactItemDto> UpdateAsync(int id, UpdateContactItemDto dto)
    {
        ValidateContactItem(dto.Type, dto.Label, dto.Value, dto.Url);

        var contactItem = await _context.ContactItems
            .FirstOrDefaultAsync(c => c.Id == id);

        if (contactItem is null)
        {
            throw new InvalidOperationException("İletişim bilgisi bulunamadı.");
        }

        contactItem.Type = dto.Type.Trim();
        contactItem.Label = dto.Label.Trim();
        contactItem.Value = dto.Value.Trim();
        contactItem.Url = dto.Url.Trim();
        contactItem.IconKey = dto.IconKey.Trim();
        contactItem.IsActive = dto.IsActive;
        contactItem.DisplayOrder = dto.DisplayOrder;
        contactItem.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(contactItem);
    }

    public async Task DeleteAsync(int id)
    {
        var contactItem = await _context.ContactItems
            .FirstOrDefaultAsync(c => c.Id == id);

        if (contactItem is null)
        {
            throw new InvalidOperationException("İletişim bilgisi bulunamadı.");
        }

        _context.ContactItems.Remove(contactItem);
        await _context.SaveChangesAsync();
    }

    private static void ValidateContactItem(string type, string label, string value, string url)
    {
        if (string.IsNullOrWhiteSpace(type))
        {
            throw new InvalidOperationException("İletişim türü zorunludur.");
        }

        if (string.IsNullOrWhiteSpace(label))
        {
            throw new InvalidOperationException("İletişim etiketi zorunludur.");
        }

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException("İletişim değeri zorunludur.");
        }

        if (!string.IsNullOrWhiteSpace(url))
        {
            var normalizedUrl = url.Trim();

            var isValid =
                normalizedUrl == "#" ||
                normalizedUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
                normalizedUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                normalizedUrl.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase) ||
                normalizedUrl.StartsWith("tel:", StringComparison.OrdinalIgnoreCase);

            if (!isValid)
            {
                throw new InvalidOperationException("Link alanı https://, http://, mailto:, tel: veya # ile başlamalıdır.");
            }
        }
    }

    private static ContactItemDto MapToDto(ContactItem contactItem)
    {
        return new ContactItemDto
        {
            Id = contactItem.Id,
            Type = contactItem.Type,
            Label = contactItem.Label,
            Value = contactItem.Value,
            Url = contactItem.Url,
            IconKey = contactItem.IconKey,
            IsActive = contactItem.IsActive,
            DisplayOrder = contactItem.DisplayOrder,
        };
    }
}