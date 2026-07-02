using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Projects;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    // PUBLIC - Ana sayfada öne çıkan projeler gösterilecek
    [HttpGet]
    public async Task<IActionResult> GetFeatured()
    {
        var projects = await _projectService.GetFeaturedAsync();

        return Ok(projects);
    }

    // ADMIN - Aktif/pasif tüm projeler listelenir
    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var projects = await _projectService.GetAllAsync();

        return Ok(projects);
    }

    // PUBLIC - Proje detay sayfası için kullanılabilir
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _projectService.GetByIdAsync(id);

        if (project is null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    // ADMIN - Yeni proje ekleme
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateProjectDto dto)
    {
        var createdProject = await _projectService.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = createdProject.Id }, createdProject);
    }

    // ADMIN - Proje güncelleme
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
    {
        var updated = await _projectService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    // ADMIN - Proje silme / soft delete
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _projectService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}