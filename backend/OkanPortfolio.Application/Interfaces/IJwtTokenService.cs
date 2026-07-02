using OkanPortfolio.Domain.Entities;

namespace OkanPortfolio.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(AdminUser adminUser);
}