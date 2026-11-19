namespace BookHaven.Domain.Books;

public sealed class Author
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public ICollection<BookAuthor> BookAuthors { get; set; } = [];
}
