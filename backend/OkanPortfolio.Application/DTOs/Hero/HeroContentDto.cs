namespace OkanPortfolio.Application.DTOs.Hero;

public class HeroContentDto
{
    public int Id { get; set; }

    public List<HeroTranslationDto> Translations { get; set; } = [];

    public string PrimaryButtonUrl { get; set; } = string.Empty;

    public string SecondaryButtonUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}