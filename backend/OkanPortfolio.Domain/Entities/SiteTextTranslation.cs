namespace OkanPortfolio.Domain.Entities;

public class SiteTextTranslation
{
    public int Id { get; set; }

    public int SiteTextItemId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public SiteTextItem SiteTextItem { get; set; } = null!;
}