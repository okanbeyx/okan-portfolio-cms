using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Skills;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/skills")]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<SkillGroupDto>>> GetPublic()
    {
        var skills = await _skillService.GetPublicAsync();

        return Ok(skills);
    }

    [HttpGet("admin")]
    [Authorize]
    public async Task<ActionResult<List<SkillGroupDto>>> GetAdmin()
    {
        var skills = await _skillService.GetAdminAsync();

        return Ok(skills);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<SkillGroupDto>> Create(CreateSkillGroupDto dto)
    {
        var skillGroup = await _skillService.CreateAsync(dto);

        return Ok(skillGroup);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<SkillGroupDto>> Update(int id, UpdateSkillGroupDto dto)
    {
        var skillGroup = await _skillService.UpdateAsync(id, dto);

        return Ok(skillGroup);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await _skillService.DeleteAsync(id);

        return NoContent();
    }
}