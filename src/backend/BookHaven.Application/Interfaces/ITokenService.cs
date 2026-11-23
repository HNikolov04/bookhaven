using BookHaven.Application.Dtos;

namespace BookHaven.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(UserDto user);
}
