namespace BookHaven.Api.Dtos;

public sealed record ReviewApiDto(
    Guid Id,
    Guid BookId,
    Guid UserId,
    string UserEmail,
    string Text,
    byte Stars,
    DateTimeOffset CreatedAtUtc);
