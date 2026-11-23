using BookHaven.Api.Dtos;
using BookHaven.Api.Mappings;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookHaven.Api.Controllers;

[Authorize]
[Route("api/users")]
public sealed class UsersController : BaseController
{
    private readonly IBookService service;

    public UsersController(IBookService service)
    {
        this.service = service;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthApiDto>> Register(
        RegisterApiDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            AuthDto auth = await service.RegisterAsync(
                request.ToApplicationDto(),
                cancellationToken);
            return Ok(auth.ToApiDto());
        }
        catch (ArgumentException exception)
        {
            return ValidationProblem(detail: exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new ProblemDetails { Detail = exception.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthApiDto>> Login(
        LoginApiDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            AuthDto auth = await service.LoginAsync(
                request.ToApplicationDto(),
                cancellationToken);
            return Ok(auth.ToApiDto());
        }
        catch (UnauthorizedAccessException exception)
        {
            return Unauthorized(new ProblemDetails { Detail = exception.Message });
        }
    }
}
