namespace OkanPortfolio.Application.DTOs.Translation;

public class HeroTranslationResponseDto
{
    public string LanguageCode { get; set; } = "en";

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Subtitle { get; set; } = string.Empty;

    public string PrimaryButtonText { get; set; } = string.Empty;

    public string SecondaryButtonText { get; set; } = string.Empty;
}