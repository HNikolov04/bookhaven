namespace BookHaven.Application.Dtos;

public sealed record ReviewDto(
    Guid Id,
    Guid BookId,
    Guid UserId,
    string UserEmail,
    string Text,
    byte Stars,
    DateTimeOffset CreatedAtUtc);
