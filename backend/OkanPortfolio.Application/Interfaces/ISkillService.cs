using OkanPortfolio.Application.DTOs.Skills;

namespace OkanPortfolio.Application.Interfaces;

public interface ISkillService
{
    Task<List<SkillGroupDto>> GetPublicAsync();

    Task<List<SkillGroupDto>> GetAdminAsync();

    Task<SkillGroupDto> CreateAsync(CreateSkillGroupDto dto);

    Task<SkillGroupDto> UpdateAsync(int id, UpdateSkillGroupDto dto);

    Task DeleteAsync(int id);
}