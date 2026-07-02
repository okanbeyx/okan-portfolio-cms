using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Hero;

public class HeroTranslationDto
{
    [Required(ErrorMessage = "Dil kodu zorunludur.")]
    [MaxLength(10, ErrorMessage = "Dil kodu en fazla 10 karakter olabilir.")]
    public string LanguageCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Etiket zorunludur.")]
    [MaxLength(80, ErrorMessage = "Etiket en fazla 80 karakter olabilir.")]
    public string Label { get; set; } = string.Empty;

    [Required(ErrorMessage = "Başlık zorunludur.")]
    [MaxLength(150, ErrorMessage = "Başlık en fazla 150 karakter olabilir.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Alt başlık zorunludur.")]
    [MaxLength(500, ErrorMessage = "Alt başlık en fazla 500 karakter olabilir.")]
    public string Subtitle { get; set; } = string.Empty;

    [Required(ErrorMessage = "Birincil buton metni zorunludur.")]
    [MaxLength(80, ErrorMessage = "Buton metni en fazla 80 karakter olabilir.")]
    public string PrimaryButtonText { get; set; } = string.Empty;

    [Required(ErrorMessage = "İkincil buton metni zorunludur.")]
    [MaxLength(80, ErrorMessage = "Buton metni en fazla 80 karakter olabilir.")]
    public string SecondaryButtonText { get; set; } = string.Empty;
}