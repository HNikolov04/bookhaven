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
        builder.Property(book => book.Description).HasMaxLength(5_000);
        builder.Property(book => book.CoverUrl).HasMaxLength(2_048);
        builder.Property(book => book.Genre)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();
        builder.Property(book => book.CreatedAtUtc).IsRequired();
        builder.Property(book => book.UpdatedAtUtc).IsRequired();
        builder.HasIndex(book => book.Title);
        builder.HasIndex(book => book.Genre);
    }
}
