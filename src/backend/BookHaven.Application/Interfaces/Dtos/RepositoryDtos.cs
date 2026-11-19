namespace BookHaven.Application.Interfaces.Dtos;

public enum GenreRepositoryDto
{
    Unknown = 0,
    Fiction = 1,
    ScienceFiction = 2,
    Fantasy = 3,
    Mystery = 4,
    NonFiction = 5,
    History = 6,
    Biography = 7,
    Romance = 8,
}

public enum BookSortRepositoryDto
{
    TitleAscending = 1,
    TitleDescending = 2,
    AuthorAscending = 3,
    Newest = 4,
    Oldest = 5,
}

public sealed record BookQueryRepositoryDto(
    string? Search,
    GenreRepositoryDto? Genre,
    BookSortRepositoryDto Sort,
    bool? IsFeatured,
    int Page,
    int PageSize);

public sealed record BookCommandRepositoryDto(
    string Title,
    string? Description,
    int? FirstPublishedYear,
    string? CoverUrl,
    GenreRepositoryDto Genre,
    bool IsFeatured,
    IReadOnlyList<string> Authors);

public sealed record ReviewCommandRepositoryDto(byte Rating, string Text);

public sealed record ReviewRepositoryDto(
    Guid Id,
    Guid BookId,
    Guid UserId,
    string Username,
    byte Rating,
    string Text,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record BookRepositoryDto(
    Guid Id,
    string Title,
    string? Description,
    int? FirstPublishedYear,
    string? CoverUrl,
    GenreRepositoryDto Genre,
    bool IsFeatured,
    IReadOnlyList<string> Authors,
    IReadOnlyList<ReviewRepositoryDto> Reviews,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record PagedRepositoryDto<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record UserRepositoryDto(
    Guid Id,
    string Username,
    string Email,
    string PasswordHash,
    DateTimeOffset CreatedAtUtc);
