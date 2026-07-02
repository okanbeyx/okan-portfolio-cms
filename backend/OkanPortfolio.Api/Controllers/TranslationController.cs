using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Translation;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TranslationController : ControllerBase
{
    private readonly ITranslationService _translationService;

    public TranslationController(ITranslationService translationService)
    {
        _translationService = translationService;
    }

    [HttpPost("project-to-en")]
    public async Task<IActionResult> TranslateProjectToEnglish(TranslationRequestDto dto)
    {
        var result = await _translationService.TranslateProjectToEnglishAsync(dto);

        return Ok(result);
    }
    [HttpPost("hero-to-en")]
    public async Task<IActionResult> TranslateHeroToEnglish(HeroTranslationRequestDto dto)
    {
        var result = await _translationService.TranslateHeroToEnglishAsync(dto);

        return Ok(result);
    }

    [HttpPost("about-to-en")]
    public async Task<IActionResult> TranslateAboutToEnglish(AboutTranslationRequestDto dto)
    {
        var result = await _translationService.TranslateAboutToEnglishAsync(dto);

        return Ok(result);
    }
    
    [HttpPost("skill-to-en")]
    public async Task<IActionResult> TranslateSkillToEnglish(SkillTranslationRequestDto dto)
    {
        var result = await _translationService.TranslateSkillToEnglishAsync(dto);

        return Ok(result);
    }

    [HttpPost("education-to-en")]
    public async Task<IActionResult> TranslateEducationToEnglish(EducationTranslationRequestDto dto)
    {
        var result = await _translationService.TranslateEducationToEnglishAsync(dto);

        return Ok(result);
    }
    
    [HttpPost("site-text-to-en")]
    public async Task<IActionResult> TranslateSiteTextToEnglish(SiteTextTranslationRequestDto dto)
    {
        var result = await _translationService.TranslateSiteTextToEnglishAsync(dto);

        return Ok(result);
    }

    [HttpPost("testimonial-to-en")]
    public async Task<IActionResult> TranslateTestimonialToEnglish(TestimonialTranslationRequestDto dto)
    {
        var result = await _translationService.TranslateTestimonialToEnglishAsync(dto);

        return Ok(result);
    }
}