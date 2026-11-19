using BookHaven.Application.Interfaces.Dtos;

namespace BookHaven.Application.Interfaces;

public interface IBookRepository
{
    Task<PagedRepositoryDto<BookRepositoryDto>> GetBooksAsync(
        BookQueryRepositoryDto query,
        CancellationToken cancellationToken);

    Task<BookRepositoryDto?> GetBookByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    Task<BookRepositoryDto> AddBookAsync(
        BookCommandRepositoryDto command,
        CancellationToken cancellationToken);

    Task<BookRepositoryDto?> UpdateBookAsync(
        Guid id,
        BookCommandRepositoryDto command,
        CancellationToken cancellationToken);

    Task<bool> DeleteBookAsync(Guid id, CancellationToken cancellationToken);

    Task<ReviewRepositoryDto?> AddReviewAsync(
        Guid bookId,
        Guid userId,
        ReviewCommandRepositoryDto command,
        CancellationToken cancellationToken);

    Task<ReviewRepositoryDto?> UpdateReviewAsync(
        Guid reviewId,
        Guid userId,
        ReviewCommandRepositoryDto command,
        CancellationToken cancellationToken);

    Task<bool> DeleteReviewAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken);
}
