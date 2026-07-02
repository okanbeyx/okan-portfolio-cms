namespace OkanPortfolio.Domain.Entities;

public class EducationItem
{
    public int Id { get; set; }

    public int StartYear { get; set; }

    public int? EndYear { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<EducationTranslation> Translations { get; set; } = [];
}