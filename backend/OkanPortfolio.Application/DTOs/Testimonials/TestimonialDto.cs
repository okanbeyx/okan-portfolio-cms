namespace OkanPortfolio.Application.DTOs.Testimonials;

public class TestimonialDto
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Company { get; set; } = string.Empty;

    public decimal Rating { get; set; }

    public bool IsApproved { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<TestimonialTranslationDto> Translations { get; set; } = new();
}

public class TestimonialTranslationDto
{
    public string LanguageCode { get; set; } = string.Empty;

    public string Comment { get; set; } = string.Empty;
}

public class CreatePublicTestimonialDto
{
    public string FullName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Company { get; set; } = string.Empty;

    public decimal Rating { get; set; } = 5;

    public string Comment { get; set; } = string.Empty;
}

public class UpdateTestimonialDto
{
    public string FullName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Company { get; set; } = string.Empty;

    public decimal Rating { get; set; }

    public bool IsApproved { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public List<TestimonialTranslationDto> Translations { get; set; } = new();
}