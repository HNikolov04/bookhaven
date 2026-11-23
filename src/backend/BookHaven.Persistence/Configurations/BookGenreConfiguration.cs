using BookHaven.Domain.Books;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookHaven.Persistence.Configurations;

public sealed class BookGenreConfiguration : IEntityTypeConfiguration<BookGenre>
{
    public void Configure(EntityTypeBuilder<BookGenre> builder)
    {
        builder.ToTable("BookGenres");
        builder.HasKey(bookGenre => new { bookGenre.BookId, bookGenre.Genre });
        builder.Property(bookGenre => bookGenre.Genre)
            .HasConversion<string>()
            .HasMaxLength(32);
        builder.HasOne(bookGenre => bookGenre.Book)
            .WithMany(book => book.BookGenres)
            .HasForeignKey(bookGenre => bookGenre.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
