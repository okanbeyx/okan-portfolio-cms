using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.About;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/about")]
public class AboutController : ControllerBase
{
    private readonly IAboutService _aboutService;

    public AboutController(IAboutService aboutService)
    {
        _aboutService = aboutService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AboutContentDto>> GetPublic()
    {
        var about = await _aboutService.GetPublicAsync();

        return Ok(about);
    }

    [HttpGet("admin")]
    [Authorize]
    public async Task<ActionResult<AboutContentDto>> GetAdmin()
    {
        var about = await _aboutService.GetAdminAsync();

        return Ok(about);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<AboutContentDto>> Update(UpdateAboutContentDto dto)
    {
        var about = await _aboutService.UpdateAsync(dto);

        return Ok(about);
    }
}