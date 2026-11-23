using BookHaven.Persistence;
using BookHaven.Persistence.Seed;
using Microsoft.EntityFrameworkCore;

namespace BookHaven.Api.Extensions;

public static class WebApplicationExtensions
{
    public static async Task<WebApplication> UseBookHavenAsync(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseHttpsRedirection();
        }

        await using (AsyncServiceScope scope = app.Services.CreateAsyncScope())
        {
            BookHavenDbContext dbContext =
                scope.ServiceProvider.GetRequiredService<BookHavenDbContext>();
            await dbContext.Database.EnsureCreatedAsync();
            await BookHavenSeeder.SeedAsync(dbContext);
        }

        app.UseCors("Frontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}
