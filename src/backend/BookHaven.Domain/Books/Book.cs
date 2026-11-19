namespace BookHaven.Domain.Books;

public sealed class Book
{
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public int? FirstPublishedYear { get; set; }

    public string? CoverUrl { get; set; }

    public Genre Genre { get; set; }

    public bool IsFeatured { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }

    public ICollection<BookAuthor> BookAuthors { get; set; } = [];

    public ICollection<Review> Reviews { get; set; } = [];
}
