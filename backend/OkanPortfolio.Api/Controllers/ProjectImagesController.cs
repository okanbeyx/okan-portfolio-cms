using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Application.DTOs.Projects;
using OkanPortfolio.Domain.Entities;
using OkanPortfolio.Infrastructure.Data;
using System.Text;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId:int}/images")]
[Authorize]
public class ProjectImagesController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ProjectImagesController(
        PortfolioDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ProjectImageDto>>> GetImages(int projectId)
    {
        var isAdminRequest = User.Identity?.IsAuthenticated == true;

        var projectExists = await _context.Projects.AnyAsync(p =>
            p.Id == projectId &&
            (isAdminRequest || p.IsActive));

        if (!projectExists)
        {
            return NotFound("Proje bulunamadı.");
        }

        var images = await _context.ProjectImages
            .Where(i => i.ProjectId == projectId)
            .OrderByDescending(i => i.IsCover)
            .ThenBy(i => i.DisplayOrder)
            .ThenByDescending(i => i.CreatedAt)
            .Select(i => new ProjectImageDto
            {
                Id = i.Id,
                ProjectId = i.ProjectId,
                ImageUrl = i.ImageUrl,
                FileName = i.FileName,
                AltText = i.AltText,
                IsCover = i.IsCover,
                DisplayOrder = i.DisplayOrder,
                CreatedAt = i.CreatedAt
            })
            .ToListAsync();

        return Ok(images);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectImageDto>> UploadImage(
        int projectId,
        IFormFile file,
        [FromForm] string? altText,
        [FromForm] bool isCover = false)
    {
        var project = await _context.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound("Proje bulunamadı.");
        }

        if (file is null || file.Length == 0)
        {
            return BadRequest("Görsel dosyası seçilmelidir.");
        }

        const long maxFileSize = 5 * 1024 * 1024;

        if (file.Length > maxFileSize)
        {
            return BadRequest("Görsel boyutu en fazla 5 MB olabilir.");
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest("Sadece jpg, jpeg, png veya webp formatı desteklenir.");
        }

        var allowedContentTypes = new[]
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        if (!allowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            return BadRequest("Geçersiz görsel türü.");
        }

        await using (var validationStream = file.OpenReadStream())
        {
            var hasValidSignature = await HasValidImageSignatureAsync(validationStream, extension);

            if (!hasValidSignature)
            {
                return BadRequest("Dosya içeriği desteklenen bir görsel formatıyla eşleşmiyor.");
            }
        }

        if (!string.IsNullOrWhiteSpace(altText) && altText.Length > 150)
        {
            return BadRequest("Alternatif metin en fazla 150 karakter olabilir.");
        }

        var webRootPath = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var uploadFolder = Path.Combine(
            webRootPath,
            "uploads",
            "projects",
            projectId.ToString());

        Directory.CreateDirectory(uploadFolder);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadFolder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var request = HttpContext.Request;
        var imageUrl = $"{request.Scheme}://{request.Host}/uploads/projects/{projectId}/{fileName}";

        var hasCoverImage = project.Images.Any(i => i.IsCover);
        var shouldBeCover = isCover || !hasCoverImage;

        if (shouldBeCover)
        {
            foreach (var image in project.Images)
            {
                image.IsCover = false;
            }

            project.ImageUrl = imageUrl;
        }

        var nextDisplayOrder = project.Images.Count + 1;

        var projectImage = new ProjectImage
        {
            ProjectId = projectId,
            ImageUrl = imageUrl,
            FileName = fileName,
            AltText = string.IsNullOrWhiteSpace(altText) ? null : altText.Trim(),
            IsCover = shouldBeCover,
            DisplayOrder = nextDisplayOrder,
            CreatedAt = DateTime.UtcNow
        };

        _context.ProjectImages.Add(projectImage);
        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetImages),
            new { projectId },
            new ProjectImageDto
            {
                Id = projectImage.Id,
                ProjectId = projectImage.ProjectId,
                ImageUrl = projectImage.ImageUrl,
                FileName = projectImage.FileName,
                AltText = projectImage.AltText,
                IsCover = projectImage.IsCover,
                DisplayOrder = projectImage.DisplayOrder,
                CreatedAt = projectImage.CreatedAt
            });
    }

    [HttpPut("{imageId:int}/cover")]
    public async Task<IActionResult> SetCoverImage(int projectId, int imageId)
    {
        var project = await _context.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound("Proje bulunamadı.");
        }

        var selectedImage = project.Images.FirstOrDefault(i => i.Id == imageId);

        if (selectedImage is null)
        {
            return NotFound("Görsel bulunamadı.");
        }

        foreach (var image in project.Images)
        {
            image.IsCover = image.Id == imageId;
        }

        project.ImageUrl = selectedImage.ImageUrl;
        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{imageId:int}")]
    public async Task<IActionResult> DeleteImage(int projectId, int imageId)
    {
        var project = await _context.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound("Proje bulunamadı.");
        }

        var image = project.Images.FirstOrDefault(i => i.Id == imageId);

        if (image is null)
        {
            return NotFound("Görsel bulunamadı.");
        }

        var wasCover = image.IsCover;

        DeletePhysicalFile(projectId, image.FileName);

        _context.ProjectImages.Remove(image);

        if (wasCover)
        {
            var nextCover = project.Images
                .Where(i => i.Id != imageId)
                .OrderBy(i => i.DisplayOrder)
                .FirstOrDefault();

            if (nextCover is not null)
            {
                nextCover.IsCover = true;
                project.ImageUrl = nextCover.ImageUrl;
            }
            else
            {
                project.ImageUrl = null;
            }
        }

        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private void DeletePhysicalFile(int projectId, string fileName)
    {
        var webRootPath = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var filePath = Path.Combine(
            webRootPath,
            "uploads",
            "projects",
            projectId.ToString(),
            fileName);

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }

    private static async Task<bool> HasValidImageSignatureAsync(Stream stream, string extension)
    {
        var buffer = new byte[12];

        var read = await stream.ReadAsync(buffer.AsMemory(0, buffer.Length));

        return extension switch
        {
            ".jpg" or ".jpeg" =>
                read >= 3 &&
                buffer[0] == 0xFF &&
                buffer[1] == 0xD8 &&
                buffer[2] == 0xFF,

            ".png" =>
                read >= 8 &&
                buffer[0] == 0x89 &&
                buffer[1] == 0x50 &&
                buffer[2] == 0x4E &&
                buffer[3] == 0x47 &&
                buffer[4] == 0x0D &&
                buffer[5] == 0x0A &&
                buffer[6] == 0x1A &&
                buffer[7] == 0x0A,

            ".webp" =>
                read >= 12 &&
                Encoding.ASCII.GetString(buffer, 0, 4) == "RIFF" &&
                Encoding.ASCII.GetString(buffer, 8, 4) == "WEBP",

            _ => false
        };
    }
}