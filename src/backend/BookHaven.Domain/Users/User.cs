using BookHaven.Domain.Books;

namespace BookHaven.Domain.Users;

public sealed class User
{
    public Guid Id { get; set; }

    public required string Username { get; set; }

    public required string Email { get; set; }

    public required string PasswordHash { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public ICollection<Review> Reviews { get; set; } = [];
}
