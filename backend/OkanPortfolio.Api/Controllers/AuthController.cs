using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Auth;
using OkanPortfolio.Application.Interfaces;
using Microsoft.AspNetCore.RateLimiting;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth-login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(request);

        if (result is null)
        {
            return Unauthorized(new
            {
                message = "Kullanıcı adı/e-posta veya şifre hatalı."
            });
        }

        return Ok(result);
    }
}