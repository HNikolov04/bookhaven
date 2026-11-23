using BookHaven.Domain.Enums;

namespace BookHaven.Domain.Books;

public sealed class BookGenre
{
    public Guid BookId { get; set; }

    public Genre Genre { get; set; }

    public required Book Book { get; set; }
}
