using BookHaven.Domain.Books;

namespace BookHaven.Domain.Users;

public sealed class UserFavouriteBook
{
    public Guid UserId { get; set; }

    public Guid BookId { get; set; }

    public required User User { get; set; }

    public required Book Book { get; set; }
}
