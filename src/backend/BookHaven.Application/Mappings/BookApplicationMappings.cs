using BookHaven.Application.Dtos;
using BookHaven.Application.Enums;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Application.Interfaces.Enums;

namespace BookHaven.Application.Mappings;

internal static class BookApplicationMappings
{
    internal static BookQueryRepositoryDto ToRepositoryDto(this BookQueryDto dto)
    {
        return new BookQueryRepositoryDto(
            dto.Search,
            dto.Genre is null ? null : (GenreRepositoryDto)dto.Genre.Value,
            (BookSortRepositoryDto)dto.Sort,
            dto.IsFeatured,
            dto.FavouritesOnly,
            dto.Page,
            dto.PageSize);
    }

    internal static ReviewCommandRepositoryDto ToRepositoryDto(this ReviewCommandDto dto)
    {
        return new ReviewCommandRepositoryDto(dto.Text, dto.Stars);
    }

    internal static BookDto ToApplicationDto(this BookRepositoryDto dto)
    {
        return new BookDto(
            dto.Id,
            dto.Title,
            dto.ShortDescription,
            dto.LongDescription,
            new AuthorDto(dto.Author.Id, dto.Author.Name, dto.Author.Description),
            dto.PictureUrl,
            dto.Genres.Select(genre => (GenreDto)genre).ToArray(),
            dto.Pages,
            dto.PublishYear,
            dto.AverageStars,
            dto.RatingVotes,
            dto.IsFeatured,
            dto.IsFavourite,
            dto.Reviews.Select(review => review.ToApplicationDto()).ToArray());
    }

    internal static ReviewDto ToApplicationDto(this ReviewRepositoryDto dto)
    {
        return new ReviewDto(
            dto.Id,
            dto.BookId,
            dto.UserId,
            dto.UserEmail,
            dto.Text,
            dto.Stars,
            dto.CreatedAtUtc);
    }
}
