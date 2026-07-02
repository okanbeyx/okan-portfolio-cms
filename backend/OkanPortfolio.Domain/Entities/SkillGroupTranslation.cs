namespace OkanPortfolio.Domain.Entities;

public class SkillGroupTranslation
{
    public int Id { get; set; }

    public int SkillGroupId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public SkillGroup SkillGroup { get; set; } = null!;
}