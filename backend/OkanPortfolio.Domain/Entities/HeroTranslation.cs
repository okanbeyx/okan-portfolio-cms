namespace OkanPortfolio.Domain.Entities;

public class HeroTranslation
{
    public int Id { get; set; }

    public int HeroContentId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Subtitle { get; set; } = string.Empty;

    public string PrimaryButtonText { get; set; } = string.Empty;

    public string SecondaryButtonText { get; set; } = string.Empty;

    public HeroContent HeroContent { get; set; } = null!;
}