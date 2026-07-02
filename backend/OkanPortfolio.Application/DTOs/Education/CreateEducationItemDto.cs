using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Education;

public class CreateEducationItemDto
{
    [MinLength(1, ErrorMessage = "En az bir dil içeriği girilmelidir.")]
    public List<EducationTranslationDto> Translations { get; set; } = [];

    [Range(1900, 2100, ErrorMessage = "Başlangıç yılı 1900 ile 2100 arasında olmalıdır.")]
    public int StartYear { get; set; }

    [Range(1900, 2100, ErrorMessage = "Bitiş yılı 1900 ile 2100 arasında olmalıdır.")]
    public int? EndYear { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsActive { get; set; } = true;

    [Range(0, 9999, ErrorMessage = "Sıralama değeri 0 ile 9999 arasında olmalıdır.")]
    public int DisplayOrder { get; set; }
}