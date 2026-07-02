using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Education;

public class EducationTranslationDto
{
    [Required(ErrorMessage = "Dil kodu zorunludur.")]
    [MaxLength(10, ErrorMessage = "Dil kodu en fazla 10 karakter olabilir.")]
    public string LanguageCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Okul adı zorunludur.")]
    [MaxLength(150, ErrorMessage = "Okul adı en fazla 150 karakter olabilir.")]
    public string SchoolName { get; set; } = string.Empty;

    [MaxLength(150, ErrorMessage = "Bölüm adı en fazla 150 karakter olabilir.")]
    public string Department { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir.")]
    public string Description { get; set; } = string.Empty;
}