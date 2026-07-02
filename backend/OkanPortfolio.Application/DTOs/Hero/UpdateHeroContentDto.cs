using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Hero;

public class UpdateHeroContentDto
{
    [MinLength(1, ErrorMessage = "En az bir dil içeriği girilmelidir.")]
    public List<HeroTranslationDto> Translations { get; set; } = [];

    [Required(ErrorMessage = "Birincil buton linki zorunludur.")]
    [MaxLength(500, ErrorMessage = "Buton linki en fazla 500 karakter olabilir.")]
    public string PrimaryButtonUrl { get; set; } = "#projects";

    [Required(ErrorMessage = "İkincil buton linki zorunludur.")]
    [MaxLength(500, ErrorMessage = "Buton linki en fazla 500 karakter olabilir.")]
    public string SecondaryButtonUrl { get; set; } = "#";

    public bool IsActive { get; set; } = true;
}