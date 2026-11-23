namespace BookHaven.Application.Security;

public sealed record JwtTokenOptions(string Key, string Issuer, string Audience);
