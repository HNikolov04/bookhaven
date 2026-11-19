using BookHaven.Persistence;

namespace BookHaven.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseBookHaven(this WebApplication app)
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

        using (IServiceScope scope = app.Services.CreateScope())
        {
            BookHavenDbContext dbContext =
                scope.ServiceProvider.GetRequiredService<BookHavenDbContext>();
            dbContext.Database.EnsureCreated();
        }

        app.UseCors("Frontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}
