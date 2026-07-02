namespace OkanPortfolio.Application.DTOs.Translation;

public class EducationTranslationResponseDto
{
    public string LanguageCode { get; set; } = "en";

    public string SchoolName { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}