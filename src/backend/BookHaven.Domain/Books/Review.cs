namespace BookHaven.Domain.Library;

public sealed class Review
{
    public Guid Id { get; set; }

    public Guid LibraryEntryId { get; set; }

    public byte Rating { get; set; }

    public required string Text { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }
}
