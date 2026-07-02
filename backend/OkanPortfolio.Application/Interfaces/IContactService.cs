using OkanPortfolio.Application.DTOs.Contacts;

namespace OkanPortfolio.Application.Interfaces;

public interface IContactService
{
    Task<List<ContactItemDto>> GetPublicAsync();

    Task<List<ContactItemDto>> GetAdminAsync();

    Task<ContactItemDto> CreateAsync(CreateContactItemDto dto);

    Task<ContactItemDto> UpdateAsync(int id, UpdateContactItemDto dto);

    Task DeleteAsync(int id);
}