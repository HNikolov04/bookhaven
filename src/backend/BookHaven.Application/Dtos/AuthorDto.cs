namespace BookHaven.Application.Dtos;

public sealed record AuthorDto(Guid Id, string Name, string? Description);
