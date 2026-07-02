using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OkanPortfolio.Application.DTOs.Contacts;
using OkanPortfolio.Application.Interfaces;

namespace OkanPortfolio.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ContactItemDto>>> GetPublic()
    {
        var contactItems = await _contactService.GetPublicAsync();

        return Ok(contactItems);
    }

    [HttpGet("admin")]
    [Authorize]
    public async Task<ActionResult<List<ContactItemDto>>> GetAdmin()
    {
        var contactItems = await _contactService.GetAdminAsync();

        return Ok(contactItems);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ContactItemDto>> Create(CreateContactItemDto dto)
    {
        var contactItem = await _contactService.CreateAsync(dto);

        return Ok(contactItem);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ContactItemDto>> Update(int id, UpdateContactItemDto dto)
    {
        var contactItem = await _contactService.UpdateAsync(id, dto);

        return Ok(contactItem);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        await _contactService.DeleteAsync(id);

        return NoContent();
    }
}