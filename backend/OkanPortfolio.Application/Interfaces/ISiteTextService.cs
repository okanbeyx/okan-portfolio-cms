using OkanPortfolio.Application.DTOs.SiteTexts;

namespace OkanPortfolio.Application.Interfaces;

public interface ISiteTextService
{
    Task<List<SiteTextItemDto>> GetPublicAsync();

    Task<List<SiteTextItemDto>> GetAdminAsync();

    Task<List<SiteTextItemDto>> UpdateAllAsync(UpdateSiteTextsDto dto);
}