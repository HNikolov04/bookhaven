using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces.Dtos;

namespace BookHaven.Application.Mappings;

internal static class AuthApplicationMappings
{
    internal static UserDto ToApplicationDto(this UserRepositoryDto dto)
    {
        return new UserDto(dto.Id, dto.Email);
    }
}
