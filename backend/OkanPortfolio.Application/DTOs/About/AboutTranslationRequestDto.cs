namespace OkanPortfolio.Application.DTOs.Translation;

public class AboutTranslationRequestDto
{
    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Intro { get; set; } = string.Empty;

    public List<AboutFocusAreaTranslationRequestDto> FocusAreas { get; set; } = new();
}

public class AboutFocusAreaTranslationRequestDto
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}