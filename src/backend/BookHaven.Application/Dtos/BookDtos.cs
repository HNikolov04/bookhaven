namespace BookHaven.Application.Dtos;

public enum GenreDto
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

public enum BookSortDto
{
    TitleAscending = 1,
    TitleDescending = 2,
    AuthorAscending = 3,
    Newest = 4,
    Oldest = 5,
}

public sealed record BookQueryDto(
    string? Search,
    GenreDto? Genre,
    BookSortDto Sort,
    bool? IsFeatured,
    int Page,
    int PageSize);

public sealed record BookCommandDto(
    string Title,
    string? Description,
    int? FirstPublishedYear,
    string? CoverUrl,
    GenreDto Genre,
    bool IsFeatured,
    IReadOnlyList<string> Authors);

public sealed record ReviewCommandDto(byte Rating, string Text);

public sealed record ReviewDto(
    Guid Id,
    Guid BookId,
    Guid UserId,
    string Username,
    byte Rating,
    string Text,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record BookDto(
    Guid Id,
    string Title,
    string? Description,
    int? FirstPublishedYear,
    string? CoverUrl,
    GenreDto Genre,
    bool IsFeatured,
    IReadOnlyList<string> Authors,
    IReadOnlyList<ReviewDto> Reviews,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record PagedDto<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount)
{
    public int TotalPages => TotalCount == 0
        ? 0
        : (int)Math.Ceiling(TotalCount / (double)PageSize);
}
