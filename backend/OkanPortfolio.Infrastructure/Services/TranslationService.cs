using System.Text.Json;
using Microsoft.Extensions.Configuration;
using OpenAI.Chat;
using OkanPortfolio.Application.DTOs.Translation;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Infrastructure.Services;

public class TranslationService : ITranslationService
{
    private readonly ChatClient _chatClient;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public TranslationService(IConfiguration configuration)
    {
        var apiKey = configuration["OpenAI:ApiKey"];
        var model = configuration["OpenAI:Model"] ?? "gpt-4o-mini";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "OpenAI API key bulunamadı. User-secrets içine OpenAI:ApiKey eklenmeli."
            );
        }

        _chatClient = new ChatClient(model: model, apiKey: apiKey);
    }

    public async Task<TranslationResponseDto> TranslateProjectToEnglishAsync(TranslationRequestDto dto)
    {
        var userPrompt = $$"""
        Aşağıdaki Türkçe portföy projesi içeriğini doğal, profesyonel ve kısa İngilizceye çevir.

        Kurallar:
        - Sadece JSON döndür.
        - Markdown kullanma.
        - Açıklamayı birebir kelime kelime değil, portföye uygun doğal İngilizce yap.
        - Teknik terimleri koru: 2D, 3D, Unity, React, ASP.NET Core, API, CMS gibi.
        - title, description ve category alanları boş olmamalı.

        Türkçe içerik:
        Title: {{dto.Title}}
        Description: {{dto.Description}}
        Category: {{dto.Category}}

        Döndürmen gereken JSON formatı:
        {
          "languageCode": "en",
          "title": "...",
          "description": "...",
          "category": "..."
        }
        """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a professional Turkish to English translator for a software developer portfolio."
            ),
            new UserChatMessage(userPrompt)
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

        var content = completion.Content[0].Text;
        var cleanJson = ExtractJson(content);

        var result = JsonSerializer.Deserialize<TranslationResponseDto>(cleanJson, JsonOptions);

        if (result is null)
        {
            throw new InvalidOperationException("Çeviri cevabı okunamadı.");
        }

        return new TranslationResponseDto
        {
            LanguageCode = "en",
            Title = result.Title.Trim(),
            Description = result.Description.Trim(),
            Category = result.Category.Trim()
        };
    }

    public async Task<HeroTranslationResponseDto> TranslateHeroToEnglishAsync(HeroTranslationRequestDto dto)
    {
        var userPrompt = $$"""
        Aşağıdaki Türkçe hero/anasayfa giriş alanı metinlerini doğal, profesyonel ve kısa İngilizceye çevir.

        Kurallar:
        - Sadece JSON döndür.
        - Markdown kullanma.
        - Portföy sitesine uygun profesyonel İngilizce kullan.
        - "Full-Stack Developer", "AI", "Unity", "Web" gibi teknik terimleri koru.
        - title alanında kişi adı varsa çevirmeden aynen bırak.
        - primaryButtonText ve secondaryButtonText kısa buton metni olmalı.

        Türkçe içerik:
        Label: {{dto.Label}}
        Title: {{dto.Title}}
        Subtitle: {{dto.Subtitle}}
        PrimaryButtonText: {{dto.PrimaryButtonText}}
        SecondaryButtonText: {{dto.SecondaryButtonText}}

        Döndürmen gereken JSON formatı:
        {
        "languageCode": "en",
        "label": "...",
        "title": "...",
        "subtitle": "...",
        "primaryButtonText": "...",
        "secondaryButtonText": "..."
        }
        """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a professional Turkish to English translator for a software developer portfolio website."
            ),
            new UserChatMessage(userPrompt)
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

        var content = completion.Content[0].Text;
        var cleanJson = ExtractJson(content);

        var result = JsonSerializer.Deserialize<HeroTranslationResponseDto>(cleanJson, JsonOptions);

        if (result is null)
        {
            throw new InvalidOperationException("Hero çeviri cevabı okunamadı.");
        }

        return new HeroTranslationResponseDto
        {
            LanguageCode = "en",
            Label = result.Label.Trim(),
            Title = result.Title.Trim(),
            Subtitle = result.Subtitle.Trim(),
            PrimaryButtonText = result.PrimaryButtonText.Trim(),
            SecondaryButtonText = result.SecondaryButtonText.Trim()
        };
    }

    public async Task<AboutTranslationResponseDto> TranslateAboutToEnglishAsync(AboutTranslationRequestDto dto)
    {
        var focusAreasText = string.Join("\n", dto.FocusAreas.Select((area, index) =>
            $"""
            FocusArea {index + 1}:
            Title: {area.Title}
            Description: {area.Description}
            """
        ));

        var userPrompt = $$"""
        Aşağıdaki Türkçe hakkımda bölümü metinlerini doğal, profesyonel ve kısa İngilizceye çevir.

        Kurallar:
        - Sadece JSON döndür.
        - Markdown kullanma.
        - Portföy sitesine uygun profesyonel İngilizce kullan.
        - Yazılım, full-stack, AI, Unity, API, CMS gibi teknik terimleri koru.
        - Kişi adı varsa çevirmeden aynen bırak.
        - label kısa bölüm etiketi olmalı.
        - title profesyonel ama doğal bir portföy başlığı olmalı.
        - description kısa açıklama olarak kalmalı.
        - intro daha doğal ve akıcı portföy metni olmalı.
        - focusAreas dizisindeki eleman sayısı Türkçe focusAreas sayısıyla aynı olmalı.
        - focusAreas sırasını değiştirme.

        Türkçe içerik:
        Label: {{dto.Label}}
        Title: {{dto.Title}}
        Description: {{dto.Description}}
        Intro: {{dto.Intro}}

        Türkçe odak alanları:
        {{focusAreasText}}

        Döndürmen gereken JSON formatı:
        {
        "languageCode": "en",
        "label": "...",
        "title": "...",
        "description": "...",
        "intro": "...",
        "focusAreas": [
            {
            "title": "...",
            "description": "..."
            }
        ]
        }
        """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a professional Turkish to English translator for a software developer portfolio website."
            ),
            new UserChatMessage(userPrompt)
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

        var content = completion.Content[0].Text;
        var cleanJson = ExtractJson(content);

        var result = JsonSerializer.Deserialize<AboutTranslationResponseDto>(cleanJson, JsonOptions);

        if (result is null)
        {
            throw new InvalidOperationException("Hakkımda çeviri cevabı okunamadı.");
        }

        return new AboutTranslationResponseDto
        {
            LanguageCode = "en",
            Label = result.Label?.Trim() ?? string.Empty,
            Title = result.Title?.Trim() ?? string.Empty,
            Description = result.Description?.Trim() ?? string.Empty,
            Intro = result.Intro?.Trim() ?? string.Empty,
            FocusAreas = result.FocusAreas
                .Select(area => new AboutFocusAreaTranslationResponseDto
                {
                    Title = area.Title?.Trim() ?? string.Empty,
                    Description = area.Description?.Trim() ?? string.Empty
                })
                .ToList()
        };
    }

    public async Task<SkillTranslationResponseDto> TranslateSkillToEnglishAsync(SkillTranslationRequestDto dto)
{
    var userPrompt = $$"""
    Aşağıdaki Türkçe teknik yetenek/skill grubu içeriğini doğal, profesyonel ve kısa İngilizceye çevir.

    Kurallar:
    - Sadece JSON döndür.
    - Markdown kullanma.
    - Portföy sitesine uygun profesyonel İngilizce kullan.
    - Frontend, Backend, Database, AI, Machine Learning, Unity gibi teknik terimleri doğru kullan.
    - title kısa ve net olmalı.
    - description doğal, kısa ve portföye uygun olmalı.

    Türkçe içerik:
    Title: {{dto.Title}}
    Description: {{dto.Description}}

    Döndürmen gereken JSON formatı:
    {
      "languageCode": "en",
      "title": "...",
      "description": "..."
    }
    """;

    var messages = new List<ChatMessage>
    {
        new SystemChatMessage(
            "You are a professional Turkish to English translator for a software developer portfolio website."
        ),
        new UserChatMessage(userPrompt)
    };

    ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

    var content = completion.Content[0].Text;
    var cleanJson = ExtractJson(content);

    var result = JsonSerializer.Deserialize<SkillTranslationResponseDto>(cleanJson, JsonOptions);

    if (result is null)
    {
        throw new InvalidOperationException("Skill çeviri cevabı okunamadı.");
    }

    return new SkillTranslationResponseDto
    {
        LanguageCode = "en",
        Title = result.Title?.Trim() ?? string.Empty,
        Description = result.Description?.Trim() ?? string.Empty
    };
   } 

    public async Task<EducationTranslationResponseDto> TranslateEducationToEnglishAsync(EducationTranslationRequestDto dto)
    {
        var userPrompt = $$"""
        Aşağıdaki Türkçe eğitim geçmişi kaydını doğal ve profesyonel İngilizceye çevir.

        Kurallar:
        - Sadece JSON döndür.
        - Markdown kullanma.
        - Okulun özel adını mümkün olduğunca koru.
        - Okul türünü İngilizceye çevir:
        İlkokulu -> Primary School
        Ortaokulu -> Middle School
        Anadolu Lisesi -> Anatolian High School
        Lise -> High School
        Üniversitesi -> University
        Fakültesi -> Faculty
        Bölümü -> Department
        - department boşsa boş bırak.
        - description boşsa boş bırak.
        - schoolName, department ve description alanlarını JSON olarak döndür.

        Türkçe içerik:
        SchoolName: {{dto.SchoolName}}
        Department: {{dto.Department}}
        Description: {{dto.Description}}

        Döndürmen gereken JSON formatı:
        {
        "languageCode": "en",
        "schoolName": "...",
        "department": "...",
        "description": "..."
        }
        """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a professional Turkish to English translator for an education timeline on a software developer portfolio website."
            ),
            new UserChatMessage(userPrompt)
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

        var content = completion.Content[0].Text;
        var cleanJson = ExtractJson(content);

        var result = JsonSerializer.Deserialize<EducationTranslationResponseDto>(cleanJson, JsonOptions);

        if (result is null)
        {
            throw new InvalidOperationException("Eğitim çeviri cevabı okunamadı.");
        }

        return new EducationTranslationResponseDto
        {
            LanguageCode = "en",
            SchoolName = result.SchoolName?.Trim() ?? string.Empty,
            Department = result.Department?.Trim() ?? string.Empty,
            Description = result.Description?.Trim() ?? string.Empty
        };
    }

    public async Task<SiteTextTranslationResponseDto> TranslateSiteTextToEnglishAsync(SiteTextTranslationRequestDto dto)
    {
        var userPrompt = $$"""
        Aşağıdaki Türkçe portföy sitesi arayüz metnini doğal, profesyonel ve kısa İngilizceye çevir.

        Kurallar:
        - Sadece JSON döndür.
        - Markdown kullanma.
        - Metnin amacı: portföy sitesi UI metni.
        - Çok uzatma.
        - Buton metniyse kısa tut.
        - Navbar metniyse tek veya iki kelime olsun.
        - Teknik terimleri koru: React, ASP.NET Core, MSSQL, AI, Unity, Full-Stack, GitHub gibi.
        - Kişi adı varsa çevirmeden bırak.

        Metin bilgisi:
        Key: {{dto.Key}}
        Label: {{dto.Label}}
        Turkish Value: {{dto.Value}}

        Döndürmen gereken JSON formatı:
        {
        "languageCode": "en",
        "value": "..."
        }
        """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a professional Turkish to English translator for a software developer portfolio website UI."
            ),
            new UserChatMessage(userPrompt)
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

        var content = completion.Content[0].Text;
        var cleanJson = ExtractJson(content);

        var result = JsonSerializer.Deserialize<SiteTextTranslationResponseDto>(cleanJson, JsonOptions);

        if (result is null)
        {
            throw new InvalidOperationException("Site metni çeviri cevabı okunamadı.");
        }

        return new SiteTextTranslationResponseDto
        {
            LanguageCode = "en",
            Value = result.Value?.Trim() ?? string.Empty
        };
    }

    public async Task<TestimonialTranslationResponseDto> TranslateTestimonialToEnglishAsync(TestimonialTranslationRequestDto dto)
    {
        var userPrompt = $$"""
        Aşağıdaki Türkçe portföy yorumunu doğal, profesyonel ve kısa İngilizceye çevir.

        Kurallar:
        - Sadece JSON döndür.
        - Markdown kullanma.
        - Yorumun anlamını koru ama İngilizcede doğal ifade et.
        - Çok resmi ya da yapay çeviri gibi olmasın.
        - Yazılım, proje, iletişim, geliştirme süreci gibi ifadeleri portföye uygun çevir.
        - Kişi adı varsa çevirmeden bırak.
        - title ve company boşsa boş döndür.
        - comment alanı boş olmamalı.

        Türkçe içerik:
        Title: {{dto.Title}}
        Company: {{dto.Company}}
        Comment: {{dto.Comment}}

        Döndürmen gereken JSON formatı:
        {
        "languageCode": "en",
        "title": "...",
        "company": "...",
        "comment": "..."
        }
        """;

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                "You are a professional Turkish to English translator for testimonials on a software developer portfolio website."
            ),
            new UserChatMessage(userPrompt)
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages);

        var content = completion.Content[0].Text;
        var cleanJson = ExtractJson(content);

        var result = JsonSerializer.Deserialize<TestimonialTranslationResponseDto>(cleanJson, JsonOptions);

        if (result is null)
        {
            throw new InvalidOperationException("Yorum çeviri cevabı okunamadı.");
        }

        return new TestimonialTranslationResponseDto
        {
            LanguageCode = "en",
            Title = result.Title?.Trim() ?? string.Empty,
            Company = result.Company?.Trim() ?? string.Empty,
            Comment = result.Comment?.Trim() ?? string.Empty
        };
    }

    private static string ExtractJson(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return "{}";
        }

        var cleaned = value.Trim();

        cleaned = cleaned
            .Replace("```json", "", StringComparison.OrdinalIgnoreCase)
            .Replace("```", "")
            .Trim();

        var startIndex = cleaned.IndexOf('{');
        var endIndex = cleaned.LastIndexOf('}');

        if (startIndex >= 0 && endIndex > startIndex)
        {
            return cleaned[startIndex..(endIndex + 1)];
        }

        return cleaned;
    }
}