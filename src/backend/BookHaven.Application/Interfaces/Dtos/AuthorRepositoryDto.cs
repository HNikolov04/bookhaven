namespace BookHaven.Application.Interfaces.Dtos;

public sealed record AuthorRepositoryDto(Guid Id, string Name, string? Description);
