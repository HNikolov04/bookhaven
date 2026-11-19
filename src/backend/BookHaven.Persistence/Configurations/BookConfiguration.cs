using BookHaven.Domain.Books;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookHaven.Persistence.Configurations;

public sealed class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable("Books");
        builder.HasKey(book => book.Id);
        builder.Property(book => book.Title).HasMaxLength(300).IsRequired();
        builder.Property(book => book.ShortDescription).HasMaxLength(500).IsRequired();
        builder.Property(book => book.LongDescription).HasMaxLength(5_000).IsRequired();
        builder.Property(book => book.PictureUrl).HasMaxLength(2_048).IsRequired();
        builder.Property(book => book.AverageStars).HasPrecision(3, 2);
        builder.HasOne(book => book.Author)
            .WithMany(author => author.Books)
            .HasForeignKey(book => book.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(book => book.Title);
        builder.HasIndex(book => book.AuthorId);
    }
}
