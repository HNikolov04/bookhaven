using BookHaven.Application.Interfaces;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace BookHaven.Persistence.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly BookHavenDbContext dbContext;

    public UserRepository(BookHavenDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public Task<bool> ExistsAsync(string email, CancellationToken cancellationToken)
    {
        return dbContext.Users.AnyAsync(
            user => user.Email == email,
            cancellationToken);
    }

    public async Task<UserRepositoryDto?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken)
    {
        User? user = await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Email == email, cancellationToken);
        return user is null ? null : ToRepositoryDto(user);
    }

    public async Task<UserRepositoryDto> AddAsync(
        UserRepositoryDto user,
        CancellationToken cancellationToken)
    {
        User entity = new()
        {
            Id = user.Id,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
        };

        dbContext.Users.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return ToRepositoryDto(entity);
    }

    private static UserRepositoryDto ToRepositoryDto(User user)
    {
        return new UserRepositoryDto(user.Id, user.Email, user.PasswordHash);
    }
}
