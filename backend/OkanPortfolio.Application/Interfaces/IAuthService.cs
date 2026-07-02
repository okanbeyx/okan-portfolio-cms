using OkanPortfolio.Application.DTOs.Auth;

namespace OkanPortfolio.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
}