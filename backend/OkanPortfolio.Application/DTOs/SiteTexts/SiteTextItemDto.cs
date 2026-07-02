namespace OkanPortfolio.Application.DTOs.SiteTexts;

public class SiteTextItemDto
{
    public int Id { get; set; }

    public string Key { get; set; } = string.Empty;

    public string GroupKey { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public List<SiteTextTranslationDto> Translations { get; set; } = new();
}

public class SiteTextTranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;
}

public class UpdateSiteTextsDto
{
    public List<SiteTextItemDto> Items { get; set; } = new();
}