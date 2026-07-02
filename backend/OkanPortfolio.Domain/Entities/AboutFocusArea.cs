namespace OkanPortfolio.Domain.Entities;

public class AboutFocusArea
{
    public int Id { get; set; }

    public int AboutContentId { get; set; }

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public AboutContent AboutContent { get; set; } = null!;

    public ICollection<AboutFocusAreaTranslation> Translations { get; set; } = new List<AboutFocusAreaTranslation>();
}