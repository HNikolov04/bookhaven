using BookHaven.Api.Dtos;
using BookHaven.Api.Mappings;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookHaven.Api.Controllers;

[Authorize]
[Route("api/books")]
public sealed class BooksController : BaseController
{
    private readonly IBookService service;

    public BooksController(IBookService service)
    {
        this.service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedApiDto<BookApiDto>>> GetAllBooks(
        [FromQuery] BookQueryApiDto query,
        CancellationToken cancellationToken)
    {
        PagedDto<BookDto> result = await service.GetBooksAsync(
            GetUserId(),
            query.ToApplicationDto(),
            cancellationToken);
        return Ok(new PagedApiDto<BookApiDto>(
            result.Items.Select(book => book.ToApiDto()).ToArray(),
            result.Page,
            result.PageSize,
            result.TotalCount,
            result.TotalPages));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookApiDto>> GetBook(
        Guid id,
        CancellationToken cancellationToken)
    {
        BookDto? book = await service.GetBookByIdAsync(
            id,
            GetUserId(),
            cancellationToken);
        return book is null ? NotFound() : Ok(book.ToApiDto());
    }

    [HttpPost("{bookId:guid}/favourites")]
    public async Task<IActionResult> AddBookToFavourites(
        Guid bookId,
        CancellationToken cancellationToken)
    {
        bool added = await service.AddBookToFavouritesAsync(
            bookId,
            GetUserId(),
            cancellationToken);
        return added ? NoContent() : NotFound();
    }

    [HttpDelete("{bookId:guid}/favourites")]
    public async Task<IActionResult> RemoveBookFromFavourites(
        Guid bookId,
        CancellationToken cancellationToken)
    {
        bool removed = await service.RemoveBookFromFavouritesAsync(
            bookId,
            GetUserId(),
            cancellationToken);
        return removed ? NoContent() : NotFound();
    }

    [HttpPost("{bookId:guid}/reviews")]
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
                : Created($"/api/books/{bookId}", review.ToApiDto());
        }
        catch (ArgumentException exception)
        {
            return ValidationProblem(detail: exception.Message);
        }
    }

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
}
