using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace BookHaven.Api.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected Guid GetUserId()
    {
        string? value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out Guid userId)
            ? userId
            : throw new UnauthorizedAccessException("The token user identifier is invalid.");
    }
}
