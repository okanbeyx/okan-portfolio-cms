namespace OkanPortfolio.Application.DTOs.Contacts;

public class ContactItemDto
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public string IconKey { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }
}

public class CreateContactItemDto
{
    public string Type { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public string IconKey { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }
}

public class UpdateContactItemDto
{
    public string Type { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public string Url { get; set; } = string.Empty;

    public string IconKey { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }
}