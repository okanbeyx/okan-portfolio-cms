namespace OkanPortfolio.Application.DTOs.Education;

public class EducationItemDto
{
    public int Id { get; set; }

    public List<EducationTranslationDto> Translations { get; set; } = [];

    public int StartYear { get; set; }

    public int? EndYear { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}