using BookHaven.Domain.Books;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookHaven.Persistence.Configurations;

public sealed class BookAuthorConfiguration : IEntityTypeConfiguration<BookAuthor>
{
    public void Configure(EntityTypeBuilder<BookAuthor> builder)
    {
        builder.ToTable("BookAuthors");
        builder.HasKey(bookAuthor => new { bookAuthor.BookId, bookAuthor.AuthorId });
        builder.HasOne(bookAuthor => bookAuthor.Book)
            .WithMany(book => book.BookAuthors)
            .HasForeignKey(bookAuthor => bookAuthor.BookId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(bookAuthor => bookAuthor.Author)
            .WithMany(author => author.BookAuthors)
            .HasForeignKey(bookAuthor => bookAuthor.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
