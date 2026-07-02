using OkanPortfolio.Application.DTOs.About;

namespace OkanPortfolio.Application.Interfaces;

public interface IAboutService
{
    Task<AboutContentDto> GetPublicAsync();

    Task<AboutContentDto> GetAdminAsync();

    Task<AboutContentDto> UpdateAsync(UpdateAboutContentDto dto);
}