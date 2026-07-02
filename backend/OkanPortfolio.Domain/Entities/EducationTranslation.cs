namespace OkanPortfolio.Domain.Entities;

public class EducationTranslation
{
    public int Id { get; set; }

    public int EducationItemId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string SchoolName { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public EducationItem EducationItem { get; set; } = null!;
}