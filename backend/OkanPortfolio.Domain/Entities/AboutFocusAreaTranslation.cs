namespace OkanPortfolio.Domain.Entities;

public class AboutFocusAreaTranslation
{
    public int Id { get; set; }

    public int AboutFocusAreaId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public AboutFocusArea AboutFocusArea { get; set; } = null!;
}