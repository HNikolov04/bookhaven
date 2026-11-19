using BookHaven.Api.Dtos;
using BookHaven.Api.Enums;
using BookHaven.Application.Dtos;
using BookHaven.Application.Enums;

namespace BookHaven.Api.Mappings;

internal static class BookApiMappings
{
    internal static BookQueryDto ToApplicationDto(this BookQueryApiDto dto)
    {
        return new BookQueryDto(
            dto.Search,
            dto.Genre is null ? null : (GenreDto)dto.Genre.Value,
            (BookSortDto)dto.Sort,
            dto.IsFeatured,
            dto.FavouritesOnly,
            dto.Page,
            dto.PageSize);
    }

    internal static ReviewCommandDto ToApplicationDto(this SaveReviewApiDto dto)
    {
        return new ReviewCommandDto(dto.Text, dto.Stars);
    }

    internal static BookApiDto ToApiDto(this BookDto dto)
    {
        return new BookApiDto(
            dto.Id,
            dto.Title,
            dto.ShortDescription,
            dto.LongDescription,
            new AuthorApiDto(dto.Author.Id, dto.Author.Name, dto.Author.Description),
            dto.PictureUrl,
            dto.Genres.Select(genre => (GenreApiDto)genre).ToArray(),
            dto.Pages,
            dto.PublishYear,
            dto.AverageStars,
            dto.RatingVotes,
            dto.IsFeatured,
            dto.IsFavourite,
            dto.Reviews.Select(review => review.ToApiDto()).ToArray());
    }

    internal static ReviewApiDto ToApiDto(this ReviewDto dto)
    {
        return new ReviewApiDto(
            dto.Id,
            dto.BookId,
            dto.UserId,
            dto.UserEmail,
            dto.Text,
            dto.Stars,
            dto.CreatedAtUtc);
    }
}
