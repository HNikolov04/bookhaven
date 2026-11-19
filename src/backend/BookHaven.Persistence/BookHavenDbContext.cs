using BookHaven.Domain.Books;
using BookHaven.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace BookHaven.Persistence;

public sealed class BookHavenDbContext(DbContextOptions<BookHavenDbContext> options)
    : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();

    public DbSet<Author> Authors => Set<Author>();

    public DbSet<BookAuthor> BookAuthors => Set<BookAuthor>();

    public DbSet<Review> Reviews => Set<Review>();

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BookHavenDbContext).Assembly);
    }
}
