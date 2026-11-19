namespace BookHaven.Application.Books.Contracts;

public sealed record CreateBookRequest(
    string Title,
    string? Description,
    IReadOnlyList<string> Authors,
    IReadOnlyList<string> Genres,
    int? FirstPublishedYear,
    string? CoverUrl,
    string? OpenLibraryWorkId,
    bool IsFeatured);

public sealed record UpdateBookRequest(
    string Title,
    string? Description,
    IReadOnlyList<string> Authors,
    IReadOnlyList<string> Genres,
    int? FirstPublishedYear,
    string? CoverUrl,
    string? OpenLibraryWorkId,
    bool IsFeatured);
