using System.ComponentModel.DataAnnotations;

namespace BookHaven.Api.Dtos;

public enum GenreApiDto
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

public enum BookSortApiDto
{
    TitleAscending = 1,
    TitleDescending = 2,
    AuthorAscending = 3,
    Newest = 4,
    Oldest = 5,
}

public sealed class BookQueryApiDto
{
    public string? Search { get; init; }

    public GenreApiDto? Genre { get; init; }

    public BookSortApiDto Sort { get; init; } = BookSortApiDto.TitleAscending;

    public bool? IsFeatured { get; init; }

    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 20;
}

public sealed class SaveBookApiDto
{
    [Required, StringLength(300)]
    public required string Title { get; init; }

    [StringLength(5_000)]
    public string? Description { get; init; }

    public int? FirstPublishedYear { get; init; }

    [Url, StringLength(2_048)]
    public string? CoverUrl { get; init; }

    public GenreApiDto Genre { get; init; }

    public bool IsFeatured { get; init; }

    [Required, MinLength(1)]
    public IReadOnlyList<string> Authors { get; init; } = [];
}

public sealed class SaveReviewApiDto
{
    [Range(1, 5)]
    public byte Rating { get; init; }

    [Required, StringLength(2_000, MinimumLength = 1)]
    public required string Text { get; init; }
}

public sealed record ReviewApiDto(
    Guid Id,
    Guid BookId,
    Guid UserId,
    string Username,
    byte Rating,
    string Text,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record BookApiDto(
    Guid Id,
    string Title,
    string? Description,
    int? FirstPublishedYear,
    string? CoverUrl,
    GenreApiDto Genre,
    bool IsFeatured,
    IReadOnlyList<string> Authors,
    IReadOnlyList<ReviewApiDto> Reviews,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record PagedApiDto<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
