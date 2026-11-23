using BookHaven.Application.Enums;

namespace BookHaven.Application.Dtos;

public sealed record BookQueryDto(
    string? Search,
    GenreDto? Genre,
    BookSortDto Sort,
    bool? IsFeatured,
    bool FavouritesOnly,
    int Page,
    int PageSize);
