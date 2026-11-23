using BookHaven.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookHaven.Persistence.Configurations;

public sealed class UserFavouriteBookConfiguration
    : IEntityTypeConfiguration<UserFavouriteBook>
{
    public void Configure(EntityTypeBuilder<UserFavouriteBook> builder)
    {
        builder.ToTable("UserFavouriteBooks");
        builder.HasKey(favourite => new { favourite.UserId, favourite.BookId });
        builder.HasOne(favourite => favourite.User)
            .WithMany(user => user.FavouriteBooks)
            .HasForeignKey(favourite => favourite.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(favourite => favourite.Book)
            .WithMany(book => book.FavouritedBy)
            .HasForeignKey(favourite => favourite.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
