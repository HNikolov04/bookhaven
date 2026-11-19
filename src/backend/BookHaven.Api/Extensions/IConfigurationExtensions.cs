using BookHaven.Api.Configuration;

namespace BookHaven.Api.Extensions;

public static class IConfigurationExtensions
{
    public static string GetBookHavenConnectionString(this IConfiguration configuration)
    {
        return configuration.GetConnectionString("BookHaven")
            ?? "Data Source=bookhaven.db";
    }

    public static JwtSettings GetJwtSettings(this IConfiguration configuration)
    {
        string key = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key is required.");
        if (System.Text.Encoding.UTF8.GetByteCount(key) < 32)
        {
            throw new InvalidOperationException("Jwt:Key must contain at least 32 bytes.");
        }

        return new JwtSettings(
            key,
            configuration["Jwt:Issuer"] ?? "BookHaven.Api",
            configuration["Jwt:Audience"] ?? "BookHaven.Frontend");
    }
}
