namespace OkanPortfolio.Application.DTOs.About;

public class AboutContentDto
{
    public int Id { get; set; }

    public bool IsActive { get; set; }

    public List<AboutTranslationDto> Translations { get; set; } = new();

    public List<AboutFocusAreaDto> FocusAreas { get; set; } = new();
}

public class AboutTranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Intro { get; set; } = string.Empty;
}

public class AboutFocusAreaDto
{
    public int Id { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public List<AboutFocusAreaTranslationDto> Translations { get; set; } = new();
}

public class AboutFocusAreaTranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}

public class UpdateAboutContentDto
{
    public bool IsActive { get; set; }

    public List<AboutTranslationDto> Translations { get; set; } = new();

    public List<AboutFocusAreaDto> FocusAreas { get; set; } = new();
}