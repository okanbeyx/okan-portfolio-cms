namespace OkanPortfolio.Domain.Entities;

public class SiteTextItem
{
    public int Id { get; set; }

    public string Key { get; set; } = string.Empty;

    public string GroupKey { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<SiteTextTranslation> Translations { get; set; } = new List<SiteTextTranslation>();
}