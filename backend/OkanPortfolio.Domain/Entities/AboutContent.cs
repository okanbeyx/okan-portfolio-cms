namespace OkanPortfolio.Domain.Entities;

public class AboutContent
{
    public int Id { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<AboutTranslation> Translations { get; set; } = new List<AboutTranslation>();

    public ICollection<AboutFocusArea> FocusAreas { get; set; } = new List<AboutFocusArea>();
}