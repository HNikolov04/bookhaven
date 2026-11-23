namespace BookHaven.Application.Interfaces.Dtos;

public sealed record UserRepositoryDto(Guid Id, string Email, string PasswordHash);
