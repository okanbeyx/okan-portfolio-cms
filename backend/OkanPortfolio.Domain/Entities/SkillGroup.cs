namespace OkanPortfolio.Domain.Entities;

public class SkillGroup
{
    public int Id { get; set; }

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<SkillGroupTranslation> Translations { get; set; } = new List<SkillGroupTranslation>();

    public ICollection<SkillItem> Skills { get; set; } = new List<SkillItem>();
}