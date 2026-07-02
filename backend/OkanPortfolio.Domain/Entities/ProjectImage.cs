namespace OkanPortfolio.Domain.Entities;

public class ProjectImage
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public string? AltText { get; set; }

    public bool IsCover { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Project Project { get; set; } = null!;
}