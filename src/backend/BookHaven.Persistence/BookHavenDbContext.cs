using BookHaven.Domain.Books;
using BookHaven.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace BookHaven.Persistence;

public sealed class BookHavenDbContext(DbContextOptions<BookHavenDbContext> options)
    : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();

    public DbSet<Author> Authors => Set<Author>();

    public DbSet<BookGenre> BookGenres => Set<BookGenre>();

    public DbSet<Review> Reviews => Set<Review>();

    public DbSet<User> Users => Set<User>();

    public DbSet<UserFavouriteBook> UserFavouriteBooks => Set<UserFavouriteBook>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BookHavenDbContext).Assembly);
    }
}
