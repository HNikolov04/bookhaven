using BookHaven.Application.Books.Contracts;
using BookHaven.Domain.Library;

namespace BookHaven.Application.Library.Contracts;

public sealed record ReviewResponse(
    Guid Id,
    byte Rating,
    string Text,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);

public sealed record LibraryEntryResponse(
    Guid Id,
    BookSummaryResponse Book,
    ReadingStatus Status,
    ReviewResponse? Review,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);
