using BookHaven.Application.Interfaces;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Domain.Books;
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
        BookQueryRepositoryDto query,
        CancellationToken cancellationToken)
    {
        IQueryable<Book> books = dbContext.Books
            .AsNoTracking()
            .AsSplitQuery()
            .Include(book => book.BookAuthors)
                .ThenInclude(bookAuthor => bookAuthor.Author)
            .Include(book => book.Reviews)
                .ThenInclude(review => review.User);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            string search = query.Search.Trim();
            books = books.Where(book =>
                book.Title.Contains(search) ||
                book.BookAuthors.Any(bookAuthor => bookAuthor.Author.Name.Contains(search)));
        }

        if (query.Genre is not null)
        {
            Genre genre = (Genre)query.Genre.Value;
            books = books.Where(book => book.Genre == genre);
        }

        if (query.IsFeatured is not null)
        {
            books = books.Where(book => book.IsFeatured == query.IsFeatured.Value);
        }

        books = query.Sort switch
        {
            BookSortRepositoryDto.TitleDescending => books.OrderByDescending(book => book.Title),
            BookSortRepositoryDto.AuthorAscending => books
                .OrderBy(book => book.BookAuthors
                    .OrderBy(bookAuthor => bookAuthor.Author.Name)
                    .Select(bookAuthor => bookAuthor.Author.Name)
                    .FirstOrDefault()),
            BookSortRepositoryDto.Newest => books
                .OrderByDescending(book => book.FirstPublishedYear),
            BookSortRepositoryDto.Oldest => books
                .OrderBy(book => book.FirstPublishedYear),
            _ => books.OrderBy(book => book.Title),
        };

        int totalCount = await books.CountAsync(cancellationToken);
        List<Book> items = await books
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedRepositoryDto<BookRepositoryDto>(
            items.Select(ToRepositoryDto).ToArray(),
            query.Page,
            query.PageSize,
            totalCount);
    }

    public async Task<BookRepositoryDto?> GetBookByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        Book? book = await dbContext.Books
            .AsNoTracking()
            .AsSplitQuery()
            .Include(item => item.BookAuthors)
                .ThenInclude(bookAuthor => bookAuthor.Author)
            .Include(item => item.Reviews)
                .ThenInclude(review => review.User)
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);

        return book is null ? null : ToRepositoryDto(book);
    }

    public async Task<BookRepositoryDto> AddBookAsync(
        BookCommandRepositoryDto command,
        CancellationToken cancellationToken)
    {
        DateTimeOffset now = DateTimeOffset.UtcNow;
        Book book = new()
        {
            Id = Guid.NewGuid(),
            Title = command.Title,
            Description = command.Description,
            FirstPublishedYear = command.FirstPublishedYear,
            CoverUrl = command.CoverUrl,
            Genre = (Genre)command.Genre,
            IsFeatured = command.IsFeatured,
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        };

        await AddAuthorsAsync(book, command.Authors, cancellationToken);
        dbContext.Books.Add(book);
        await dbContext.SaveChangesAsync(cancellationToken);

        return (await GetBookByIdAsync(book.Id, cancellationToken))!;
    }

    public async Task<BookRepositoryDto?> UpdateBookAsync(
        Guid id,
        BookCommandRepositoryDto command,
        CancellationToken cancellationToken)
    {
        Book? book = await dbContext.Books
            .Include(item => item.BookAuthors)
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (book is null)
        {
            return null;
        }

        book.Title = command.Title;
        book.Description = command.Description;
        book.FirstPublishedYear = command.FirstPublishedYear;
        book.CoverUrl = command.CoverUrl;
        book.Genre = (Genre)command.Genre;
        book.IsFeatured = command.IsFeatured;
        book.UpdatedAtUtc = DateTimeOffset.UtcNow;

        dbContext.BookAuthors.RemoveRange(book.BookAuthors);
        book.BookAuthors.Clear();
        await AddAuthorsAsync(book, command.Authors, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return await GetBookByIdAsync(book.Id, cancellationToken);
    }

    public async Task<bool> DeleteBookAsync(Guid id, CancellationToken cancellationToken)
    {
        Book? book = await dbContext.Books.FindAsync([id], cancellationToken);
        if (book is null)
        {
            return false;
        }

        dbContext.Books.Remove(book);
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

        DateTimeOffset now = DateTimeOffset.UtcNow;
        Review review = new()
        {
            Id = Guid.NewGuid(),
            BookId = bookId,
            UserId = userId,
            Rating = command.Rating,
            Text = command.Text,
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
            Book = book,
            User = user,
        };

        dbContext.Reviews.Add(review);
        await dbContext.SaveChangesAsync(cancellationToken);
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

        review.Rating = command.Rating;
        review.Text = command.Text;
        review.UpdatedAtUtc = DateTimeOffset.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
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

        dbContext.Reviews.Remove(review);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task AddAuthorsAsync(
        Book book,
        IEnumerable<string> authorNames,
        CancellationToken cancellationToken)
    {
        foreach (string authorName in authorNames)
        {
            string normalizedName = authorName.Trim();
            string lowercaseName = normalizedName.ToLowerInvariant();
            Author? author = await dbContext.Authors.FirstOrDefaultAsync(
                item => item.Name.ToLower() == lowercaseName,
                cancellationToken);

            author ??= new Author { Id = Guid.NewGuid(), Name = normalizedName };
            book.BookAuthors.Add(new BookAuthor
            {
                BookId = book.Id,
                AuthorId = author.Id,
                Book = book,
                Author = author,
            });
        }
    }

    private static BookRepositoryDto ToRepositoryDto(Book book)
    {
        return new BookRepositoryDto(
            book.Id,
            book.Title,
            book.Description,
            book.FirstPublishedYear,
            book.CoverUrl,
            (GenreRepositoryDto)book.Genre,
            book.IsFeatured,
            book.BookAuthors.Select(item => item.Author.Name).ToArray(),
            book.Reviews.Select(ToRepositoryDto).ToArray(),
            book.CreatedAtUtc,
            book.UpdatedAtUtc);
    }

    private static ReviewRepositoryDto ToRepositoryDto(Review review)
    {
        return new ReviewRepositoryDto(
            review.Id,
            review.BookId,
            review.UserId,
            review.User.Username,
            review.Rating,
            review.Text,
            review.CreatedAtUtc,
            review.UpdatedAtUtc);
    }
}
