using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Education;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController : ControllerBase
{
    private readonly IEducationService _educationService;

    public EducationController(IEducationService educationService)
    {
        _educationService = educationService;
    }

    // PUBLIC - Ana sitede aktif eğitim geçmişi gösterilecek
    [HttpGet]
    public async Task<IActionResult> GetActive()
    {
        var educationItems = await _educationService.GetActiveAsync();

        return Ok(educationItems);
    }

    // ADMIN - Aktif/pasif tüm eğitim kayıtları
    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var educationItems = await _educationService.GetAllAsync();

        return Ok(educationItems);
    }

    // ADMIN - Tek eğitim kaydı
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var educationItem = await _educationService.GetByIdAsync(id);

        if (educationItem is null)
        {
            return NotFound();
        }

        return Ok(educationItem);
    }

    // ADMIN - Yeni eğitim kaydı ekle
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateEducationItemDto dto)
    {
        var createdEducationItem = await _educationService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdEducationItem.Id },
            createdEducationItem
        );
    }

    // ADMIN - Eğitim kaydı güncelle
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateEducationItemDto dto)
    {
        var updated = await _educationService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    // ADMIN - Soft delete / pasif yap
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _educationService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}