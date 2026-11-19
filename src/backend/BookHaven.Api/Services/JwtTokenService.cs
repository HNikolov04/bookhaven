using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace BookHaven.Api.Services;

public sealed class JwtTokenService : ITokenService
{
    private readonly IConfiguration configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public string CreateToken(UserDto user)
    {
        string key = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is not configured.");
        string issuer = configuration["Jwt:Issuer"] ?? "BookHaven.Api";
        string audience = configuration["Jwt:Audience"] ?? "BookHaven.Frontend";

        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
        ];

        SigningCredentials credentials = new(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
