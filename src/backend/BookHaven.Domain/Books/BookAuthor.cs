namespace BookHaven.Domain.Books;

public sealed class BookAuthor
{
    public Guid BookId { get; set; }

    public Guid AuthorId { get; set; }
}
