namespace BookHaven.Application.Dtos;

public sealed record RegisterDto(string Username, string Email, string Password);

public sealed record LoginDto(string Email, string Password);

public sealed record UserDto(Guid Id, string Username, string Email);

public sealed record AuthDto(string Token, UserDto User);
