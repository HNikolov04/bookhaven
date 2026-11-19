using BookHaven.Domain.Users;

namespace BookHaven.Domain.Books;

public sealed class Review
{
    public Guid Id { get; set; }

    public Guid BookId { get; set; }

    public Guid UserId { get; set; }

    public byte Rating { get; set; }

    public required string Text { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }

    public required Book Book { get; set; }

    public required User User { get; set; }
}
