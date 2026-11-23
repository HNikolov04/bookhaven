namespace BookHaven.Api.Dtos;

public sealed record AuthApiDto(string Token, UserApiDto User);
