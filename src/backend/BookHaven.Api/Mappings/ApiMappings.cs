using BookHaven.Api.Dtos;
using BookHaven.Application.Dtos;

namespace BookHaven.Api.Mappings;

internal static class ApiMappings
{
    internal static BookQueryDto ToApplicationDto(this BookQueryApiDto dto)
    {
        return new BookQueryDto(
            dto.Search,
            dto.Genre is null ? null : (GenreDto)dto.Genre.Value,
            (BookSortDto)dto.Sort,
            dto.IsFeatured,
            dto.Page,
            dto.PageSize);
    }

    internal static BookCommandDto ToApplicationDto(this SaveBookApiDto dto)
    {
        return new BookCommandDto(
            dto.Title,
            dto.Description,
            dto.FirstPublishedYear,
            dto.CoverUrl,
            (GenreDto)dto.Genre,
            dto.IsFeatured,
            dto.Authors);
    }

    internal static ReviewCommandDto ToApplicationDto(this SaveReviewApiDto dto)
    {
        return new ReviewCommandDto(dto.Rating, dto.Text);
    }

    internal static RegisterDto ToApplicationDto(this RegisterApiDto dto)
    {
        return new RegisterDto(dto.Username, dto.Email, dto.Password);
    }

    internal static LoginDto ToApplicationDto(this LoginApiDto dto)
    {
        return new LoginDto(dto.Email, dto.Password);
    }

    internal static BookApiDto ToApiDto(this BookDto dto)
    {
        return new BookApiDto(
            dto.Id,
            dto.Title,
            dto.Description,
            dto.FirstPublishedYear,
            dto.CoverUrl,
            (GenreApiDto)dto.Genre,
            dto.IsFeatured,
            dto.Authors,
            dto.Reviews.Select(ToApiDto).ToArray(),
            dto.CreatedAtUtc,
            dto.UpdatedAtUtc);
    }

    internal static ReviewApiDto ToApiDto(this ReviewDto dto)
    {
        return new ReviewApiDto(
            dto.Id,
            dto.BookId,
            dto.UserId,
            dto.Username,
            dto.Rating,
            dto.Text,
            dto.CreatedAtUtc,
            dto.UpdatedAtUtc);
    }

    internal static AuthApiDto ToApiDto(this AuthDto dto)
    {
        return new AuthApiDto(
            dto.Token,
            new UserApiDto(dto.User.Id, dto.User.Username, dto.User.Email));
    }
}
