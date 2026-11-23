using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using BookHaven.Application.Security;
using Microsoft.IdentityModel.Tokens;

namespace BookHaven.Application.Services;

public sealed class JwtTokenService : ITokenService
{
    private readonly JwtTokenOptions options;

    public JwtTokenService(JwtTokenOptions options)
    {
        this.options = options;
    }

    public string CreateToken(UserDto user)
    {
        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Email, user.Email),
        ];

        SigningCredentials credentials = new(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)),
            SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            options.Issuer,
            options.Audience,
            claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
