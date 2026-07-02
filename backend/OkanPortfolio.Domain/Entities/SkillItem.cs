namespace OkanPortfolio.Domain.Entities;

public class SkillItem
{
    public int Id { get; set; }

    public int SkillGroupId { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public SkillGroup SkillGroup { get; set; } = null!;
}