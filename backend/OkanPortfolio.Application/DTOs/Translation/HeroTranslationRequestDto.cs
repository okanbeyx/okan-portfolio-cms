using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Translation;

public class HeroTranslationRequestDto
{
    [Required]
    [MaxLength(80)]
    public string Label { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Subtitle { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string PrimaryButtonText { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string SecondaryButtonText { get; set; } = string.Empty;
}