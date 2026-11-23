using BookHaven.Domain.Books;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookHaven.Persistence.Configurations;

public sealed class AuthorConfiguration : IEntityTypeConfiguration<Author>
{
    public void Configure(EntityTypeBuilder<Author> builder)
    {
        builder.ToTable("Authors");
        builder.HasKey(author => author.Id);
        builder.Property(author => author.Name).HasMaxLength(200).IsRequired();
        builder.Property(author => author.Description).HasMaxLength(2_000);
        builder.HasIndex(author => author.Name);
    }
}
