using BookHaven.Application.Interfaces.Dtos;

namespace BookHaven.Application.Interfaces;

public interface IUserRepository
{
    Task<bool> ExistsAsync(
        string username,
        string email,
        CancellationToken cancellationToken);

    Task<UserRepositoryDto?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken);

    Task<UserRepositoryDto> AddAsync(
        UserRepositoryDto user,
        CancellationToken cancellationToken);
}
