using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Projects;

public class CreateProjectDto
{
    [MinLength(1, ErrorMessage = "En az bir dil içeriği girilmelidir.")]
    public List<ProjectTranslationDto> Translations { get; set; } = [];

    [MinLength(1, ErrorMessage = "En az bir teknoloji girilmelidir.")]
    public List<string> TechStack { get; set; } = [];

    [MaxLength(500, ErrorMessage = "GitHub bağlantısı en fazla 500 karakter olabilir.")]
    public string? GithubUrl { get; set; }

    [MaxLength(500, ErrorMessage = "Canlı demo bağlantısı en fazla 500 karakter olabilir.")]
    public string? LiveUrl { get; set; }

    [MaxLength(500, ErrorMessage = "Görsel bağlantısı en fazla 500 karakter olabilir.")]
    public string? ImageUrl { get; set; }

    public bool IsFeatured { get; set; }

    public bool IsActive { get; set; } = true;

    [Range(0, 9999, ErrorMessage = "Sıralama değeri 0 ile 9999 arasında olmalıdır.")]
    public int DisplayOrder { get; set; }
}