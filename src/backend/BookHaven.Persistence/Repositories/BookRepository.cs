using BookHaven.Application.Interfaces;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Application.Interfaces.Enums;
using BookHaven.Domain.Books;
using BookHaven.Domain.Enums;
using BookHaven.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace BookHaven.Persistence.Repositories;

public sealed class BookRepository : IBookRepository
{
    private readonly BookHavenDbContext dbContext;

    public BookRepository(BookHavenDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<PagedRepositoryDto<BookRepositoryDto>> GetBooksAsync(
        Guid userId,
        BookQueryRepositoryDto query,
        CancellationToken cancellationToken)
    {
        IQueryable<Book> books = CreateBookQuery();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            string search = query.Search.Trim();
            books = books.Where(book =>
                book.Title.Contains(search) || book.Author.Name.Contains(search));
        }

        if (query.Genre is not null)
        {
            Genre genre = (Genre)query.Genre.Value;
            books = books.Where(book =>
                book.BookGenres.Any(bookGenre => bookGenre.Genre == genre));
        }

        if (query.IsFeatured is not null)
        {
            books = books.Where(book => book.IsFeatured == query.IsFeatured.Value);
        }

        if (query.FavouritesOnly)
        {
            books = books.Where(book =>
                book.FavouritedBy.Any(favourite => favourite.UserId == userId));
        }

        books = query.Sort switch
        {
            BookSortRepositoryDto.TitleDescending => books.OrderByDescending(book => book.Title),
            BookSortRepositoryDto.AuthorAscending => books.OrderBy(book => book.Author.Name),
            BookSortRepositoryDto.Newest => books.OrderByDescending(book => book.PublishYear),
            BookSortRepositoryDto.Oldest => books.OrderBy(book => book.PublishYear),
            _ => books.OrderBy(book => book.Title),
        };

        int totalCount = await books.CountAsync(cancellationToken);
        List<Book> items = await books
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedRepositoryDto<BookRepositoryDto>(
            items.Select(book => ToRepositoryDto(book, userId)).ToArray(),
            query.Page,
            query.PageSize,
            totalCount);
    }

    public async Task<BookRepositoryDto?> GetBookByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken)
    {
        Book? book = await CreateBookQuery()
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        return book is null ? null : ToRepositoryDto(book, userId);
    }

    public async Task<bool> AddBookToFavouritesAsync(
        Guid bookId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        Book? book = await dbContext.Books.FindAsync([bookId], cancellationToken);
        User? user = await dbContext.Users.FindAsync([userId], cancellationToken);
        if (book is null || user is null)
        {
            return false;
        }

        bool alreadyFavourite = await dbContext.UserFavouriteBooks.AnyAsync(
            favourite => favourite.BookId == bookId && favourite.UserId == userId,
            cancellationToken);
        if (alreadyFavourite)
        {
            return true;
        }

        dbContext.UserFavouriteBooks.Add(new UserFavouriteBook
        {
            BookId = bookId,
            UserId = userId,
            Book = book,
            User = user,
        });
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> RemoveBookFromFavouritesAsync(
        Guid bookId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        UserFavouriteBook? favourite = await dbContext.UserFavouriteBooks
            .SingleOrDefaultAsync(
                item => item.BookId == bookId && item.UserId == userId,
                cancellationToken);
        if (favourite is null)
        {
            return false;
        }

        dbContext.UserFavouriteBooks.Remove(favourite);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<ReviewRepositoryDto?> AddReviewAsync(
        Guid bookId,
        Guid userId,
        ReviewCommandRepositoryDto command,
        CancellationToken cancellationToken)
    {
        Book? book = await dbContext.Books.FindAsync([bookId], cancellationToken);
        User? user = await dbContext.Users.FindAsync([userId], cancellationToken);
        bool alreadyReviewed = await dbContext.Reviews.AnyAsync(
            review => review.BookId == bookId && review.UserId == userId,
            cancellationToken);
        if (book is null || user is null || alreadyReviewed)
        {
            return null;
        }

        Review review = new()
        {
            Id = Guid.NewGuid(),
            BookId = bookId,
            UserId = userId,
            Text = command.Text,
            Stars = command.Stars,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            Book = book,
            User = user,
        };

        dbContext.Reviews.Add(review);
        await dbContext.SaveChangesAsync(cancellationToken);
        await ApplyRatingChangeAsync(
            bookId,
            voteChange: 1,
            starsChange: command.Stars,
            cancellationToken: cancellationToken);
        return ToRepositoryDto(review);
    }

    public async Task<ReviewRepositoryDto?> UpdateReviewAsync(
        Guid reviewId,
        Guid userId,
        ReviewCommandRepositoryDto command,
        CancellationToken cancellationToken)
    {
        Review? review = await dbContext.Reviews
            .Include(item => item.User)
            .SingleOrDefaultAsync(
                item => item.Id == reviewId && item.UserId == userId,
                cancellationToken);
        if (review is null)
        {
            return null;
        }

        int previousStars = review.Stars;
        review.Text = command.Text;
        review.Stars = command.Stars;
        await dbContext.SaveChangesAsync(cancellationToken);
        await ApplyRatingChangeAsync(
            review.BookId,
            voteChange: 0,
            starsChange: command.Stars - previousStars,
            cancellationToken: cancellationToken);
        return ToRepositoryDto(review);
    }

    public async Task<bool> DeleteReviewAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        Review? review = await dbContext.Reviews.SingleOrDefaultAsync(
            item => item.Id == reviewId && item.UserId == userId,
            cancellationToken);
        if (review is null)
        {
            return false;
        }

        Guid bookId = review.BookId;
        int removedStars = review.Stars;
        dbContext.Reviews.Remove(review);
        await dbContext.SaveChangesAsync(cancellationToken);
        await ApplyRatingChangeAsync(
            bookId,
            voteChange: -1,
            starsChange: -removedStars,
            cancellationToken: cancellationToken);
        return true;
    }

    private IQueryable<Book> CreateBookQuery()
    {
        return dbContext.Books
            .AsNoTracking()
            .AsSplitQuery()
            .Include(book => book.Author)
            .Include(book => book.BookGenres)
            .Include(book => book.Reviews)
                .ThenInclude(review => review.User)
            .Include(book => book.FavouritedBy);
    }

    private async Task ApplyRatingChangeAsync(
        Guid bookId,
        int voteChange,
        int starsChange,
        CancellationToken cancellationToken)
    {
        Book? book = await dbContext.Books.FindAsync([bookId], cancellationToken);
        if (book is null)
        {
            return;
        }

        decimal totalStars = (book.AverageStars * book.RatingVotes) + starsChange;
        book.RatingVotes = Math.Max(0, book.RatingVotes + voteChange);
        book.AverageStars = book.RatingVotes == 0
            ? 0
            : Math.Clamp(
                Math.Round(totalStars / book.RatingVotes, 2),
                0,
                5);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static BookRepositoryDto ToRepositoryDto(Book book, Guid userId)
    {
        return new BookRepositoryDto(
            book.Id,
            book.Title,
            book.ShortDescription,
            book.LongDescription,
            new AuthorRepositoryDto(book.Author.Id, book.Author.Name, book.Author.Description),
            book.PictureUrl,
            book.BookGenres
                .Select(item => (GenreRepositoryDto)item.Genre)
                .OrderBy(genre => genre)
                .ToArray(),
            book.Pages,
            book.PublishYear,
            book.AverageStars,
            book.RatingVotes,
            book.IsFeatured,
            book.FavouritedBy.Any(favourite => favourite.UserId == userId),
            book.Reviews
                .OrderByDescending(review => review.CreatedAtUtc)
                .Select(ToRepositoryDto)
                .ToArray());
    }

    private static ReviewRepositoryDto ToRepositoryDto(Review review)
    {
        return new ReviewRepositoryDto(
            review.Id,
            review.BookId,
            review.UserId,
            review.User.Email,
            review.Text,
            review.Stars,
            review.CreatedAtUtc);
    }
}
