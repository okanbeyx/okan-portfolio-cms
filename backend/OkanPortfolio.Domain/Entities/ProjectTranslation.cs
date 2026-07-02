namespace OkanPortfolio.Domain.Entities;

public class ProjectTranslation
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public Project Project { get; set; } = null!;
}