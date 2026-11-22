using System.ComponentModel.DataAnnotations;

namespace BookHaven.Api.Dtos;

public sealed class RegisterApiDto
{
    [Required, EmailAddress, StringLength(254)]
    public required string Email { get; init; }

    [Required, StringLength(100, MinimumLength = 6)]
    public required string Password { get; init; }

    [Required, StringLength(100, MinimumLength = 6)]
    [Compare(nameof(Password), ErrorMessage = "Passwords do not match.")]
    public required string ConfirmPassword { get; init; }
}
