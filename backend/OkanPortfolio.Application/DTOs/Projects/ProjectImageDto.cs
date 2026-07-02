namespace OkanPortfolio.Application.DTOs.Projects;

public class ProjectImageDto
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public string? AltText { get; set; }

    public bool IsCover { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }
}