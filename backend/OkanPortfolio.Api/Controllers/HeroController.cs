using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Hero;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HeroController : ControllerBase
{
    private readonly IHeroContentService _heroContentService;

    public HeroController(IHeroContentService heroContentService)
    {
        _heroContentService = heroContentService;
    }

    // PUBLIC - Ana sayfa hero alanı
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetActive()
    {
        var heroContent = await _heroContentService.GetActiveAsync();

        return Ok(heroContent);
    }

    // ADMIN - Hero alanını düzenlemek için mevcut veriyi getir
    [HttpGet("admin")]
    [Authorize]
    public async Task<IActionResult> GetAdmin()
    {
        var heroContent = await _heroContentService.GetAdminAsync();

        return Ok(heroContent);
    }

    // ADMIN - Hero alanını güncelle
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update(UpdateHeroContentDto dto)
    {
        var updatedHeroContent = await _heroContentService.UpdateAsync(dto);

        return Ok(updatedHeroContent);
    }
}