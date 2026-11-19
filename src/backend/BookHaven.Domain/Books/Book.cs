namespace BookHaven.Domain.Books;

public sealed class Book
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public int? FirstPublishedYear { get; set; }

    public string? CoverUrl { get; set; }

    public bool IsFeatured { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }
}
