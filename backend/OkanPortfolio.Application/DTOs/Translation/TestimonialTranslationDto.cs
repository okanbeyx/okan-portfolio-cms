using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Translation;

public class TestimonialTranslationRequestDto
{
    [Required(ErrorMessage = "Yorum metni zorunludur.")]
    [MaxLength(1000, ErrorMessage = "Yorum en fazla 1000 karakter olabilir.")]
    public string Comment { get; set; } = string.Empty;

    [MaxLength(120, ErrorMessage = "Ünvan en fazla 120 karakter olabilir.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(120, ErrorMessage = "Şirket en fazla 120 karakter olabilir.")]
    public string Company { get; set; } = string.Empty;
}

public class TestimonialTranslationResponseDto
{
    public string LanguageCode { get; set; } = "en";

    public string Comment { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Company { get; set; } = string.Empty;
}