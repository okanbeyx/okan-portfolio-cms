namespace OkanPortfolio.Application.DTOs.Translation;

public class AboutTranslationResponseDto
{
    public string LanguageCode { get; set; } = "en";

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Intro { get; set; } = string.Empty;

    public List<AboutFocusAreaTranslationResponseDto> FocusAreas { get; set; } = new();
}

public class AboutFocusAreaTranslationResponseDto
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}