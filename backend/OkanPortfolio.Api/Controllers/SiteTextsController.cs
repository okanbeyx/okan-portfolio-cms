using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.SiteTexts;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/site-texts")]
public class SiteTextsController : ControllerBase
{
    private readonly ISiteTextService _siteTextService;

    public SiteTextsController(ISiteTextService siteTextService)
    {
        _siteTextService = siteTextService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<SiteTextItemDto>>> GetPublic()
    {
        var items = await _siteTextService.GetPublicAsync();

        return Ok(items);
    }

    [HttpGet("admin")]
    [Authorize]
    public async Task<ActionResult<List<SiteTextItemDto>>> GetAdmin()
    {
        var items = await _siteTextService.GetAdminAsync();

        return Ok(items);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<List<SiteTextItemDto>>> UpdateAll(UpdateSiteTextsDto dto)
    {
        var items = await _siteTextService.UpdateAllAsync(dto);

        return Ok(items);
    }
}