using System.Security.Claims;
using BookHaven.Api.Dtos;
using BookHaven.Api.Mappings;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookHaven.Api.Controllers;

[ApiController]
[Route("api")]
public sealed class BookHavenController : ControllerBase
{
    private readonly IBookHavenService service;

    public BookHavenController(IBookHavenService service)
    {
        this.service = service;
    }

    [HttpGet("books")]
    public async Task<ActionResult<PagedApiDto<BookApiDto>>> GetBooks(
        [FromQuery] BookQueryApiDto query,
        CancellationToken cancellationToken)
    {
        PagedDto<BookDto> result = await service.GetBooksAsync(
            query.ToApplicationDto(),
            cancellationToken);
        return Ok(new PagedApiDto<BookApiDto>(
            result.Items.Select(book => book.ToApiDto()).ToArray(),
            result.Page,
            result.PageSize,
            result.TotalCount,
            result.TotalPages));
    }

    [HttpGet("books/{id:guid}")]
    public async Task<ActionResult<BookApiDto>> GetBook(
        Guid id,
        CancellationToken cancellationToken)
    {
        BookDto? book = await service.GetBookByIdAsync(id, cancellationToken);
        return book is null ? NotFound() : Ok(book.ToApiDto());
    }

    [Authorize]
    [HttpPost("books")]
    public async Task<ActionResult<BookApiDto>> AddBook(
        SaveBookApiDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            BookDto book = await service.AddBookAsync(
                request.ToApplicationDto(),
                cancellationToken);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book.ToApiDto());
        }
        catch (ArgumentException exception)
        {
            return ValidationProblem(detail: exception.Message);
        }
    }

    [Authorize]
    [HttpPut("books/{id:guid}")]
    public async Task<ActionResult<BookApiDto>> UpdateBook(
        Guid id,
        SaveBookApiDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            BookDto? book = await service.UpdateBookAsync(
                id,
                request.ToApplicationDto(),
                cancellationToken);
            return book is null ? NotFound() : Ok(book.ToApiDto());
        }
        catch (ArgumentException exception)
        {
            return ValidationProblem(detail: exception.Message);
        }
    }

    [Authorize]
    [HttpDelete("books/{id:guid}")]
    public async Task<IActionResult> DeleteBook(
        Guid id,
        CancellationToken cancellationToken)
    {
        bool deleted = await service.DeleteBookAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [Authorize]
    [HttpPost("books/{bookId:guid}/reviews")]
    public async Task<ActionResult<ReviewApiDto>> AddReview(
        Guid bookId,
        SaveReviewApiDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            ReviewDto? review = await service.AddReviewAsync(
                bookId,
                GetUserId(),
                request.ToApplicationDto(),
                cancellationToken);
            return review is null
                ? Conflict(new ProblemDetails { Detail = "The book is missing or you already reviewed it." })
                : Created($"/api/reviews/{review.Id}", review.ToApiDto());
        }
        catch (ArgumentException exception)
        {
            return ValidationProblem(detail: exception.Message);
        }
    }

    [Authorize]
    [HttpPut("reviews/{reviewId:guid}")]
    public async Task<ActionResult<ReviewApiDto>> UpdateReview(
        Guid reviewId,
        SaveReviewApiDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            ReviewDto? review = await service.UpdateReviewAsync(
                reviewId,
                GetUserId(),
                request.ToApplicationDto(),
                cancellationToken);
            return review is null ? NotFound() : Ok(review.ToApiDto());
        }
        catch (ArgumentException exception)
        {
            return ValidationProblem(detail: exception.Message);
        }
    }

    [Authorize]
    [HttpDelete("reviews/{reviewId:guid}")]
    public async Task<IActionResult> DeleteReview(
        Guid reviewId,
        CancellationToken cancellationToken)
    {
        bool deleted = await service.DeleteReviewAsync(
            reviewId,
            GetUserId(),
            cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [AllowAnonymous]
    [HttpPost("auth/register")]
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
    [HttpPost("auth/login")]
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

    private Guid GetUserId()
    {
        string? value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out Guid userId)
            ? userId
            : throw new UnauthorizedAccessException("The token user identifier is invalid.");
    }
}
