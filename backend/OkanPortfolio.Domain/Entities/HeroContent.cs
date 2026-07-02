namespace OkanPortfolio.Domain.Entities;

public class HeroContent
{
    public int Id { get; set; }

    public string PrimaryButtonUrl { get; set; } = "#projects";

    public string SecondaryButtonUrl { get; set; } = "#";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<HeroTranslation> Translations { get; set; } = [];
}