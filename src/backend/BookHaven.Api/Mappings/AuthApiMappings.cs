using BookHaven.Api.Dtos;
using BookHaven.Application.Dtos;

namespace BookHaven.Api.Mappings;

internal static class AuthApiMappings
{
    internal static RegisterDto ToApplicationDto(this RegisterApiDto dto)
    {
        return new RegisterDto(dto.Email, dto.Password);
    }

    internal static LoginDto ToApplicationDto(this LoginApiDto dto)
    {
        return new LoginDto(dto.Email, dto.Password);
    }

    internal static AuthApiDto ToApiDto(this AuthDto dto)
    {
        return new AuthApiDto(dto.Token, new UserApiDto(dto.User.Id, dto.User.Email));
    }
}
