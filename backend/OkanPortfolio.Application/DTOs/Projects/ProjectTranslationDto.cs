using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Projects;

public class ProjectTranslationDto
{
    [Required(ErrorMessage = "Dil kodu zorunludur.")]
    [MaxLength(10, ErrorMessage = "Dil kodu en fazla 10 karakter olabilir.")]
    public string LanguageCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Başlık zorunludur.")]
    [MaxLength(150, ErrorMessage = "Başlık en fazla 150 karakter olabilir.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Açıklama zorunludur.")]
    [MaxLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kategori zorunludur.")]
    [MaxLength(120, ErrorMessage = "Kategori en fazla 120 karakter olabilir.")]
    public string Category { get; set; } = string.Empty;

    [Required(ErrorMessage = "Durum zorunludur.")]
    [MaxLength(80, ErrorMessage = "Durum en fazla 80 karakter olabilir.")]
    public string Status { get; set; } = string.Empty;
}