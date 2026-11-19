using System.ComponentModel.DataAnnotations;

namespace BookHaven.Api.Dtos;

public sealed class RegisterApiDto
{
    [Required, StringLength(50, MinimumLength = 3)]
    public required string Username { get; init; }

    [Required, EmailAddress, StringLength(254)]
    public required string Email { get; init; }

    [Required, StringLength(100, MinimumLength = 6)]
    public required string Password { get; init; }
}

public sealed class LoginApiDto
{
    [Required, EmailAddress]
    public required string Email { get; init; }

    [Required]
    public required string Password { get; init; }
}

public sealed record UserApiDto(Guid Id, string Username, string Email);

public sealed record AuthApiDto(string Token, UserApiDto User);
