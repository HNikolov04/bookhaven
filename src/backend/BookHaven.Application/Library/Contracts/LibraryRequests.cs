using BookHaven.Domain.Library;

namespace BookHaven.Application.Library.Contracts;

public sealed record AddBookToLibraryRequest(Guid BookId, ReadingStatus Status);

public sealed record UpdateReadingStatusRequest(ReadingStatus Status);

public sealed record CreateReviewRequest(byte Rating, string Text);

public sealed record UpdateReviewRequest(byte Rating, string Text);
