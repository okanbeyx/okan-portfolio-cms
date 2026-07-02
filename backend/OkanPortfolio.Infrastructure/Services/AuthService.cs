using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OkanPortfolio.Application.DTOs.Auth;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Infrastructure.Data;

namespace OkanPortfolio.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly PortfolioDbContext _context;
    private readonly IPasswordHasherService _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;

    public AuthService(
        PortfolioDbContext context,
        IPasswordHasherService passwordHasher,
        IJwtTokenService jwtTokenService,
        IConfiguration configuration)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var adminUser = await _context.AdminUsers
            .FirstOrDefaultAsync(x =>
                x.IsActive &&
                (x.UserName == request.UserNameOrEmail || x.Email == request.UserNameOrEmail));

        if (adminUser is null)
        {
            return null;
        }

        var passwordIsValid = _passwordHasher.VerifyPassword(
            request.Password,
            adminUser.PasswordHash);

        if (!passwordIsValid)
        {
            return null;
        }

        adminUser.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = _jwtTokenService.GenerateToken(adminUser);

        var expireMinutes = Convert.ToDouble(_configuration["Jwt:ExpireMinutes"]);

        return new AuthResponseDto
        {
            AdminId = adminUser.Id,
            FullName = adminUser.FullName,
            UserName = adminUser.UserName,
            Email = adminUser.Email,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expireMinutes)
        };
    }
}