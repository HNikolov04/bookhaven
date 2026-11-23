using System.ComponentModel.DataAnnotations;
using BookHaven.Api.Enums;

namespace BookHaven.Api.Dtos;

public sealed class BookQueryApiDto
{
    public string? Search { get; init; }

    public GenreApiDto? Genre { get; init; }

    public BookSortApiDto Sort { get; init; } = BookSortApiDto.TitleAscending;

    public bool? IsFeatured { get; init; }

    public bool FavouritesOnly { get; init; }

    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 20;
}
