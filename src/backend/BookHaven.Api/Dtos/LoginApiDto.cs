using System.ComponentModel.DataAnnotations;

namespace BookHaven.Api.Dtos;

public sealed class LoginApiDto
{
    [Required, EmailAddress]
    public required string Email { get; init; }

    [Required]
    public required string Password { get; init; }
}
