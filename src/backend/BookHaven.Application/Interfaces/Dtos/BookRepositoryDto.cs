using BookHaven.Application.Interfaces.Enums;

namespace BookHaven.Application.Interfaces.Dtos;

public sealed record BookRepositoryDto(
    Guid Id,
    string Title,
    string ShortDescription,
    string LongDescription,
    AuthorRepositoryDto Author,
    string PictureUrl,
    IReadOnlyList<GenreRepositoryDto> Genres,
    int Pages,
    int PublishYear,
    decimal AverageStars,
    int RatingVotes,
    bool IsFeatured,
    bool IsFavourite,
    IReadOnlyList<ReviewRepositoryDto> Reviews);
