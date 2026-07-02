using System.ComponentModel.DataAnnotations;

namespace OkanPortfolio.Application.DTOs.Auth;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Kullanıcı adı veya e-posta zorunludur.")]
    [MaxLength(150, ErrorMessage = "Kullanıcı adı veya e-posta en fazla 150 karakter olabilir.")]
    public string UserNameOrEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur.")]
    [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
    [MaxLength(100, ErrorMessage = "Şifre en fazla 100 karakter olabilir.")]
    public string Password { get; set; } = string.Empty;
}