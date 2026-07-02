using OkanPortfolio.Application.DTOs.Projects;

namespace OkanPortfolio.Application.Interfaces;

public interface IProjectService
{
    Task<List<ProjectListDto>> GetAllAsync();

    Task<List<ProjectListDto>> GetFeaturedAsync();

    Task<ProjectDetailDto?> GetByIdAsync(int id);

    Task<ProjectDetailDto> CreateAsync(CreateProjectDto dto);

    Task<bool> UpdateAsync(int id, UpdateProjectDto dto);

    Task<bool> DeleteAsync(int id);
}