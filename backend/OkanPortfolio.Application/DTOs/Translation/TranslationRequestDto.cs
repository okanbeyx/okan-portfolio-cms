using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Translation;

public class TranslationRequestDto
{
    [Required(ErrorMessage = "Başlık zorunludur.")]
    [MaxLength(150, ErrorMessage = "Başlık en fazla 150 karakter olabilir.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Açıklama zorunludur.")]
    [MaxLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kategori zorunludur.")]
    [MaxLength(120, ErrorMessage = "Kategori en fazla 120 karakter olabilir.")]
    public string Category { get; set; } = string.Empty;
}