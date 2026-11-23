using System.ComponentModel.DataAnnotations;

namespace BookHaven.Api.Dtos;

public sealed class SaveReviewApiDto
{
    [Required, StringLength(2_000, MinimumLength = 1)]
    public required string Text { get; init; }

    [Range(1, 5)]
    public byte Stars { get; init; }
}
