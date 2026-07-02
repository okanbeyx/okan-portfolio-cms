namespace OkanPortfolio.Domain.Entities;

public class AboutTranslation
{
    public int Id { get; set; }

    public int AboutContentId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Intro { get; set; } = string.Empty;

    public AboutContent AboutContent { get; set; } = null!;
}