namespace OkanPortfolio.Domain.Entities;

public class TestimonialTranslation
{
    public int Id { get; set; }

    public int TestimonialId { get; set; }

    public string LanguageCode { get; set; } = string.Empty;

    public string Comment { get; set; } = string.Empty;

    public Testimonial Testimonial { get; set; } = null!;
}