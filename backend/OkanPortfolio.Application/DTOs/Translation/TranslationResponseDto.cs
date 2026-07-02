namespace OkanPortfolio.Application.DTOs.Translation;

public class TranslationResponseDto
{
    public string LanguageCode { get; set; } = "en";

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;
}