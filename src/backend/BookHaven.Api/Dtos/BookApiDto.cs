using BookHaven.Api.Enums;

namespace BookHaven.Api.Dtos;

public sealed record BookApiDto(
    Guid Id,
    string Title,
    string ShortDescription,
    string LongDescription,
    AuthorApiDto Author,
    string PictureUrl,
    IReadOnlyList<GenreApiDto> Genres,
    int Pages,
    int PublishYear,
    decimal AverageStars,
    int RatingVotes,
    bool IsFeatured,
    bool IsFavourite,
    IReadOnlyList<ReviewApiDto> Reviews);
