namespace BookHaven.Application.Interfaces.Dtos;

public sealed record ReviewRepositoryDto(
    Guid Id,
    Guid BookId,
    Guid UserId,
    string UserEmail,
    string Text,
    byte Stars,
    DateTimeOffset CreatedAtUtc);
