using BookHaven.Application.Interfaces.Enums;

namespace BookHaven.Application.Interfaces.Dtos;

public sealed record BookQueryRepositoryDto(
    string? Search,
    GenreRepositoryDto? Genre,
    BookSortRepositoryDto Sort,
    bool? IsFeatured,
    bool FavouritesOnly,
    int Page,
    int PageSize);
