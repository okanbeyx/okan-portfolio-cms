using Microsoft.AspNetCore.Mvc;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new
        {
            status = "Healthy",
            project = "Okan Portfolio CMS API",
            version = "1.0.0"
        });
    }
}