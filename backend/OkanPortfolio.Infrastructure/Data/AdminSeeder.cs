using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OkanPortfolio.Application.Interfaces;
using OkanPortfolio.Domain.Entities;

namespace OkanPortfolio.Infrastructure.Data;

public static class AdminSeeder
{
    public static async Task SeedAdminAsync(
        PortfolioDbContext context,
        IPasswordHasherService passwordHasher,
        IConfiguration configuration)
    {
        var userName = configuration["AdminSeed:UserName"]?.Trim() ?? "admin";
        var email = configuration["AdminSeed:Email"]?.Trim() ?? "admin@okanportfolio.com";
        var fullName = configuration["AdminSeed:FullName"]?.Trim() ?? "Okan Çelikcan";
        var password = configuration["AdminSeed:Password"];
        var resetExistingPasswordText = configuration["AdminSeed:ResetExistingPassword"];

        var resetExistingPassword =
            bool.TryParse(resetExistingPasswordText, out var parsedResetValue) && parsedResetValue;

        var existingAdmin = await context.AdminUsers
            .FirstOrDefaultAsync(x => x.UserName == userName || x.Email == email);

        if (existingAdmin is not null)
        {
            existingAdmin.FullName = fullName;
            existingAdmin.UserName = userName;
            existingAdmin.Email = email;
            existingAdmin.IsActive = true;

            if (resetExistingPassword)
            {
                ValidateStrongPassword(password);

                existingAdmin.PasswordHash = passwordHasher.HashPassword(password!);
            }

            await context.SaveChangesAsync();
            return;
        }

        ValidateStrongPassword(password);

        var adminUser = new AdminUser
        {
            FullName = fullName,
            UserName = userName,
            Email = email,
            PasswordHash = passwordHasher.HashPassword(password!),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await context.AdminUsers.AddAsync(adminUser);
        await context.SaveChangesAsync();
    }

    private static void ValidateStrongPassword(string? password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException("AdminSeed:Password zorunludur.");
        }

        if (password.Length < 16)
        {
            throw new InvalidOperationException("Admin şifresi en az 16 karakter olmalıdır.");
        }

        if (!password.Any(char.IsUpper))
        {
            throw new InvalidOperationException("Admin şifresi en az 1 büyük harf içermelidir.");
        }

        if (!password.Any(char.IsLower))
        {
            throw new InvalidOperationException("Admin şifresi en az 1 küçük harf içermelidir.");
        }

        if (!password.Any(char.IsDigit))
        {
            throw new InvalidOperationException("Admin şifresi en az 1 rakam içermelidir.");
        }

        if (!password.Any(character => !char.IsLetterOrDigit(character)))
        {
            throw new InvalidOperationException("Admin şifresi en az 1 özel karakter içermelidir.");
        }

        var lowerPassword = password.ToLowerInvariant();

        string[] forbiddenWords =
        {
            "admin",
            "okan",
            "portfolio",
            "password",
            "sifre",
            "şifre",
            "123",
            "qwerty"
        };

        if (forbiddenWords.Any(lowerPassword.Contains))
        {
            throw new InvalidOperationException("Admin şifresi tahmin edilebilir kelimeler içermemelidir.");
        }
    }
}