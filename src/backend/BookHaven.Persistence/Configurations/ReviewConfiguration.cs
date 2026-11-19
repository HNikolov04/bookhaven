using BookHaven.Domain.Books;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookHaven.Persistence.Configurations;

public sealed class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");
        builder.HasKey(review => review.Id);
        builder.Property(review => review.Text).HasMaxLength(2_000).IsRequired();
        builder.Property(review => review.Rating).IsRequired();
        builder.Property(review => review.CreatedAtUtc).IsRequired();
        builder.Property(review => review.UpdatedAtUtc).IsRequired();
        builder.HasIndex(review => new { review.BookId, review.UserId }).IsUnique();
        builder.HasOne(review => review.Book)
            .WithMany(book => book.Reviews)
            .HasForeignKey(review => review.BookId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(review => review.User)
            .WithMany(user => user.Reviews)
            .HasForeignKey(review => review.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
