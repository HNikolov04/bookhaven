using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces.Dtos;

namespace BookHaven.Application.Mappings;

internal static class ApplicationMappings
{
    internal static BookQueryRepositoryDto ToRepositoryDto(this BookQueryDto dto)
    {
        return new BookQueryRepositoryDto(
            dto.Search,
            dto.Genre is null ? null : (GenreRepositoryDto)dto.Genre.Value,
            (BookSortRepositoryDto)dto.Sort,
            dto.IsFeatured,
            dto.Page,
            dto.PageSize);
    }

    internal static BookCommandRepositoryDto ToRepositoryDto(this BookCommandDto dto)
    {
        return new BookCommandRepositoryDto(
            dto.Title,
            dto.Description,
            dto.FirstPublishedYear,
            dto.CoverUrl,
            (GenreRepositoryDto)dto.Genre,
            dto.IsFeatured,
            dto.Authors);
    }

    internal static ReviewCommandRepositoryDto ToRepositoryDto(this ReviewCommandDto dto)
    {
        return new ReviewCommandRepositoryDto(dto.Rating, dto.Text);
    }

    internal static BookDto ToDto(this BookRepositoryDto dto)
    {
        return new BookDto(
            dto.Id,
            dto.Title,
            dto.Description,
            dto.FirstPublishedYear,
            dto.CoverUrl,
            (GenreDto)dto.Genre,
            dto.IsFeatured,
            dto.Authors,
            dto.Reviews.Select(ToDto).ToArray(),
            dto.CreatedAtUtc,
            dto.UpdatedAtUtc);
    }

    internal static ReviewDto ToDto(this ReviewRepositoryDto dto)
    {
        return new ReviewDto(
            dto.Id,
            dto.BookId,
            dto.UserId,
            dto.Username,
            dto.Rating,
            dto.Text,
            dto.CreatedAtUtc,
            dto.UpdatedAtUtc);
    }

    internal static UserDto ToDto(this UserRepositoryDto dto)
    {
        return new UserDto(dto.Id, dto.Username, dto.Email);
    }
}
