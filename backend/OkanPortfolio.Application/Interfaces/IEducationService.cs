using OkanPortfolio.Application.DTOs.Education;

namespace OkanPortfolio.Application.Interfaces;

public interface IEducationService
{
    Task<List<EducationItemDto>> GetAllAsync();

    Task<List<EducationItemDto>> GetActiveAsync();

    Task<EducationItemDto?> GetByIdAsync(int id);

    Task<EducationItemDto> CreateAsync(CreateEducationItemDto dto);

    Task<bool> UpdateAsync(int id, UpdateEducationItemDto dto);

    Task<bool> DeleteAsync(int id);
}