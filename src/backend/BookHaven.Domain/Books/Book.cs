using BookHaven.Domain.Users;

namespace BookHaven.Domain.Books;

public sealed class Book
{
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public required string ShortDescription { get; set; }

    public required string LongDescription { get; set; }

    public required string PictureUrl { get; set; }

    public int Pages { get; set; }

    public int PublishYear { get; set; }

    public decimal AverageStars { get; set; }

    public int RatingVotes { get; set; }

    public bool IsFeatured { get; set; }

    public Guid AuthorId { get; set; }

    public required Author Author { get; set; }

    public ICollection<BookGenre> BookGenres { get; set; } = [];

    public ICollection<Review> Reviews { get; set; } = [];

    public ICollection<UserFavouriteBook> FavouritedBy { get; set; } = [];
}
