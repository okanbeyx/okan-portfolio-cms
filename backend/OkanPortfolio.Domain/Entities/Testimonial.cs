namespace OkanPortfolio.Domain.Entities;

public class Testimonial
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Company { get; set; } = string.Empty;

    public decimal Rating { get; set; } = 5;

    public bool IsApproved { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ApprovedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public ICollection<TestimonialTranslation> Translations { get; set; } = new List<TestimonialTranslation>();
}