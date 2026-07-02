using OkanPortfolio.Application.DTOs.Testimonials;

namespace OkanPortfolio.Application.Interfaces;

public interface ITestimonialService
{
    Task<List<TestimonialDto>> GetPublicAsync();

    Task<List<TestimonialDto>> GetAdminAsync();

    Task<TestimonialDto> CreatePublicAsync(CreatePublicTestimonialDto dto);

    Task<TestimonialDto> UpdateAsync(int id, UpdateTestimonialDto dto);

    Task DeleteAsync(int id);
}