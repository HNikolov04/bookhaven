using BookHaven.Application.Dtos;

namespace BookHaven.Application.Interfaces;

public interface IBookHavenService
{
    Task<PagedDto<BookDto>> GetBooksAsync(
        BookQueryDto query,
        CancellationToken cancellationToken);

    Task<BookDto?> GetBookByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<BookDto> AddBookAsync(
        BookCommandDto command,
        CancellationToken cancellationToken);

    Task<BookDto?> UpdateBookAsync(
        Guid id,
        BookCommandDto command,
        CancellationToken cancellationToken);

    Task<bool> DeleteBookAsync(Guid id, CancellationToken cancellationToken);

    Task<ReviewDto?> AddReviewAsync(
        Guid bookId,
        Guid userId,
        ReviewCommandDto command,
        CancellationToken cancellationToken);

    Task<ReviewDto?> UpdateReviewAsync(
        Guid reviewId,
        Guid userId,
        ReviewCommandDto command,
        CancellationToken cancellationToken);

    Task<bool> DeleteReviewAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken);

    Task<AuthDto> RegisterAsync(
        RegisterDto register,
        CancellationToken cancellationToken);

    Task<AuthDto> LoginAsync(LoginDto login, CancellationToken cancellationToken);
}
