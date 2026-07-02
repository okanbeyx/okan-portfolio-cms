namespace OkanPortfolio.Domain.Entities;

public class Project
{
    public int Id { get; set; }

    public string TitleTr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;

    public string DescriptionTr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;

    public string CategoryTr { get; set; } = string.Empty;
    public string CategoryEn { get; set; } = string.Empty;

    public string StatusTr { get; set; } = string.Empty;
    public string StatusEn { get; set; } = string.Empty;

    public string TechStack { get; set; } = string.Empty;

    public string? GithubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string? ImageUrl { get; set; }

    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<ProjectTranslation> Translations { get; set; } = [];
    public ICollection<ProjectImage> Images { get; set; } = [];
}