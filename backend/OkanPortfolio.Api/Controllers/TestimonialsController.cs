using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Testimonials;
using OkanPortfolio.Application.Interfaces;
using Microsoft.AspNetCore.RateLimiting;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/testimonials")]
public class TestimonialsController : ControllerBase
{
    private readonly ITestimonialService _testimonialService;

    public TestimonialsController(ITestimonialService testimonialService)
    {
        _testimonialService = testimonialService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<TestimonialDto>>> GetPublic()
    {
        var testimonials = await _testimonialService.GetPublicAsync();

        return Ok(testimonials);
    }

    [HttpGet("admin")]
    [Authorize]
    public async Task<ActionResult<List<TestimonialDto>>> GetAdmin()
    {
        var testimonials = await _testimonialService.GetAdminAsync();

        return Ok(testimonials);
    }

    [HttpPost]
    [AllowAnonymous]
    [EnableRateLimiting("testimonial-submit")]
    public async Task<ActionResult<TestimonialDto>> CreatePublic(CreatePublicTestimonialDto dto)
    {
        var testimonial = await _testimonialService.CreatePublicAsync(dto);

        return Ok(testimonial);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<TestimonialDto>> Update(int id, UpdateTestimonialDto dto)
    {
        var testimonial = await _testimonialService.UpdateAsync(id, dto);

        return Ok(testimonial);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await _testimonialService.DeleteAsync(id);

        return NoContent();
    }
}