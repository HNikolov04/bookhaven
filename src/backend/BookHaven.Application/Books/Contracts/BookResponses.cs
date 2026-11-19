namespace BookHaven.Application.Books.Contracts;

public sealed record BookSummaryResponse(
    Guid Id,
    string Title,
    IReadOnlyList<string> Authors,
    IReadOnlyList<string> Genres,
    int? FirstPublishedYear,
    string? CoverUrl,
    bool IsFeatured);

public sealed record BookDetailsResponse(
    Guid Id,
    string? OpenLibraryWorkId,
    string Title,
    string? Description,
    IReadOnlyList<string> Authors,
    IReadOnlyList<string> Genres,
    int? FirstPublishedYear,
    string? CoverUrl,
    bool IsFeatured,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);
