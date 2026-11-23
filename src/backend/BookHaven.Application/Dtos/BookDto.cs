using BookHaven.Application.Enums;

namespace BookHaven.Application.Dtos;

public sealed record BookDto(
    Guid Id,
    string Title,
    string ShortDescription,
    string LongDescription,
    AuthorDto Author,
    string PictureUrl,
    IReadOnlyList<GenreDto> Genres,
    int Pages,
    int PublishYear,
    decimal AverageStars,
    int RatingVotes,
    bool IsFeatured,
    bool IsFavourite,
    IReadOnlyList<ReviewDto> Reviews);
