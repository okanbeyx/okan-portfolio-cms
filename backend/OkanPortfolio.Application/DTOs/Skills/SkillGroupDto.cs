namespace OkanPortfolio.Application.DTOs.Skills;

public class SkillGroupDto
{
    public int Id { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public List<SkillGroupTranslationDto> Translations { get; set; } = new();

    public List<SkillItemDto> Skills { get; set; } = new();
}

public class SkillGroupTranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}

public class SkillItemDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }
}

public class CreateSkillGroupDto
{
    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public List<SkillGroupTranslationDto> Translations { get; set; } = new();

    public List<SkillItemDto> Skills { get; set; } = new();
}

public class UpdateSkillGroupDto
{
    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public List<SkillGroupTranslationDto> Translations { get; set; } = new();

    public List<SkillItemDto> Skills { get; set; } = new();
}