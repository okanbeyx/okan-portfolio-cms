namespace OkanPortfolio.Application.DTOs.Projects;

public class ProjectDetailDto
{
    public int Id { get; set; }

    // Geçici uyumluluk için duruyor
    public string TitleTr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;

    public string DescriptionTr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;

    public string CategoryTr { get; set; } = string.Empty;
    public string CategoryEn { get; set; } = string.Empty;

    public string StatusTr { get; set; } = string.Empty;
    public string StatusEn { get; set; } = string.Empty;

    public List<ProjectTranslationDto> Translations { get; set; } = [];
    public List<ProjectImageDto> Images { get; set; } = [];

    public List<string> TechStack { get; set; } = [];

    public string? GithubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string? ImageUrl { get; set; }

    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}