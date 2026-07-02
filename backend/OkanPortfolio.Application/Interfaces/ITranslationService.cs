using OkanPortfolio.Application.DTOs.Translation;

namespace OkanPortfolio.Application.Interfaces;

public interface ITranslationService
{
    Task<TranslationResponseDto> TranslateProjectToEnglishAsync(TranslationRequestDto dto);

    Task<HeroTranslationResponseDto> TranslateHeroToEnglishAsync(HeroTranslationRequestDto dto);

    Task<AboutTranslationResponseDto> TranslateAboutToEnglishAsync(AboutTranslationRequestDto dto);
    Task<SkillTranslationResponseDto> TranslateSkillToEnglishAsync(SkillTranslationRequestDto dto);
    Task<EducationTranslationResponseDto> TranslateEducationToEnglishAsync(EducationTranslationRequestDto dto);
    Task<SiteTextTranslationResponseDto> TranslateSiteTextToEnglishAsync(SiteTextTranslationRequestDto dto);
    Task<TestimonialTranslationResponseDto> TranslateTestimonialToEnglishAsync(TestimonialTranslationRequestDto dto);
}