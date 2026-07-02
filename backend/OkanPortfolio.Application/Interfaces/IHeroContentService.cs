using OkanPortfolio.Application.DTOs.Hero;

namespace OkanPortfolio.Application.Interfaces;

public interface IHeroContentService
{
    Task<HeroContentDto> GetActiveAsync();

    Task<HeroContentDto> GetAdminAsync();

    Task<HeroContentDto> UpdateAsync(UpdateHeroContentDto dto);
}