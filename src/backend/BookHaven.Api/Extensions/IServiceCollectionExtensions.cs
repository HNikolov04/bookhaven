using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using BookHaven.Application.Interfaces;
using BookHaven.Application.Security;
using BookHaven.Application.Services;
using BookHaven.Persistence;
using BookHaven.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BookHaven.Api.Extensions;

public static class IServiceCollectionExtensions
{
    public static IServiceCollection AddBookHaven(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        JwtTokenOptions jwt = configuration.GetJwtTokenOptions();

        services.AddDbContext<BookHavenDbContext>(options =>
            options.UseNpgsql(configuration.GetBookHavenConnectionString()));
        services.AddScoped<IBookRepository, BookRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddSingleton(jwt);
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddScoped<IBookService, BookService>();

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwt.Key)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                };
            });
        services.AddAuthorization();
        services.AddCors(options => options.AddPolicy("Frontend", policy =>
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()));
        services.AddControllers().AddJsonOptions(options =>
            options.JsonSerializerOptions.Converters.Add(
                new JsonStringEnumConverter(
                    JsonNamingPolicy.CamelCase,
                    allowIntegerValues: false)));
        services.AddSwaggerGen();

        return services;
    }
}
