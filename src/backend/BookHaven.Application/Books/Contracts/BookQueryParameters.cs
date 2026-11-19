namespace BookHaven.Application.Books.Contracts;

public sealed record BookQueryParameters
{
    public string? Search { get; init; }

    public string? Author { get; init; }

    public string? Genre { get; init; }

    public bool? IsFeatured { get; init; }

    public BookSort Sort { get; init; } = BookSort.TitleAscending;

    public int Page { get; init; } = 1;

    public int PageSize { get; init; } = 20;
}
