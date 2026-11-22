using BookHaven.Application.Interfaces.Dtos;

namespace BookHaven.Application.Interfaces;

public interface IBookRepository
{
    Task<PagedRepositoryDto<BookRepositoryDto>> GetBooksAsync(
        Guid userId,
        BookQueryRepositoryDto query,
        CancellationToken cancellationToken);

    Task<BookRepositoryDto?> GetBookByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken);

    Task<bool> AddBookToFavouritesAsync(
        Guid bookId,
        Guid userId,
        CancellationToken cancellationToken);

    Task<bool> RemoveBookFromFavouritesAsync(
        Guid bookId,
        Guid userId,
        CancellationToken cancellationToken);

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
