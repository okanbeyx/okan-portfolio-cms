namespace OkanPortfolio.Domain.Entities;

public class ContactItem
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public string IconKey { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}