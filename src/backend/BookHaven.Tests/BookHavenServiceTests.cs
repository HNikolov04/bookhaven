using BookHaven.Application.Dtos;
using BookHaven.Application.Enums;
using BookHaven.Application.Interfaces;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Application.Services;

namespace BookHaven.Tests;

public sealed class BookHavenServiceTests
{
    [Fact]
    public async Task RegisterAndLogin_ValidCredentials_NormalizesEmailAndReturnsToken()
    {
        FakeBookRepository books = new();
        FakeUserRepository users = new();
        BookHavenService service = new(books, users, new FakeTokenService());

        AuthDto registration = await service.RegisterAsync(
            new RegisterDto("  Reader@BookHaven.Test ", "secret12"),
            CancellationToken.None);
        AuthDto login = await service.LoginAsync(
            new LoginDto("reader@bookhaven.test", "secret12"),
            CancellationToken.None);

        Assert.Equal("reader@bookhaven.test", registration.User.Email);
        Assert.Equal("token:reader@bookhaven.test", registration.Token);
        Assert.Equal(registration.User, login.User);
        Assert.NotNull(users.User);
        Assert.NotEqual("secret12", users.User.PasswordHash);
    }

    [Fact]
    public async Task Register_ExistingEmail_ThrowsConflictException()
    {
        FakeUserRepository users = new()
        {
            User = new UserRepositoryDto(Guid.NewGuid(), "reader@bookhaven.test", "hash"),
        };
        BookHavenService service = new(
            new FakeBookRepository(),
            users,
            new FakeTokenService());

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterAsync(
            new RegisterDto("reader@bookhaven.test", "secret12"),
            CancellationToken.None));
    }

    [Fact]
    public async Task GetBooks_InvalidPaging_NormalizesQuery()
    {
        FakeBookRepository books = new();
        BookHavenService service = new(
            books,
            new FakeUserRepository(),
            new FakeTokenService());

        await service.GetBooksAsync(
            Guid.NewGuid(),
            new BookQueryDto(
                "   ",
                null,
                BookSortDto.TitleAscending,
                null,
                false,
                0,
                500),
            CancellationToken.None);

        Assert.NotNull(books.LastQuery);
        Assert.Null(books.LastQuery.Search);
        Assert.Equal(1, books.LastQuery.Page);
        Assert.Equal(100, books.LastQuery.PageSize);
    }

    [Fact]
    public async Task AddBookToFavourites_ExistingBook_ForwardsUserAndBookIds()
    {
        FakeBookRepository books = new();
        BookHavenService service = new(
            books,
            new FakeUserRepository(),
            new FakeTokenService());
        Guid bookId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();

        bool result = await service.AddBookToFavouritesAsync(
            bookId,
            userId,
            CancellationToken.None);

        Assert.True(result);
        Assert.Equal(bookId, books.FavouriteBookId);
        Assert.Equal(userId, books.FavouriteUserId);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public async Task AddReview_InvalidStars_ThrowsValidationException(byte stars)
    {
        BookHavenService service = new(
            new FakeBookRepository(),
            new FakeUserRepository(),
            new FakeTokenService());

        await Assert.ThrowsAsync<ArgumentException>(() => service.AddReviewAsync(
            Guid.NewGuid(),
            Guid.NewGuid(),
            new ReviewCommandDto("Useful review", stars),
            CancellationToken.None));
    }

    private sealed class FakeTokenService : ITokenService
    {
        public string CreateToken(UserDto user)
        {
            return $"token:{user.Email}";
        }
    }

    private sealed class FakeUserRepository : IUserRepository
    {
        public UserRepositoryDto? User { get; set; }

        public Task<bool> ExistsAsync(string email, CancellationToken cancellationToken)
        {
            return Task.FromResult(User?.Email == email);
        }

        public Task<UserRepositoryDto?> GetByEmailAsync(
            string email,
            CancellationToken cancellationToken)
        {
            return Task.FromResult(User?.Email == email ? User : null);
        }

        public Task<UserRepositoryDto> AddAsync(
            UserRepositoryDto user,
            CancellationToken cancellationToken)
        {
            User = user;
            return Task.FromResult(user);
        }
    }

    private sealed class FakeBookRepository : IBookRepository
    {
        public BookQueryRepositoryDto? LastQuery { get; private set; }

        public Guid? FavouriteBookId { get; private set; }

        public Guid? FavouriteUserId { get; private set; }

        public Task<PagedRepositoryDto<BookRepositoryDto>> GetBooksAsync(
            Guid userId,
            BookQueryRepositoryDto query,
            CancellationToken cancellationToken)
        {
            LastQuery = query;
            return Task.FromResult(new PagedRepositoryDto<BookRepositoryDto>(
                [],
                query.Page,
                query.PageSize,
                0));
        }

        public Task<BookRepositoryDto?> GetBookByIdAsync(
            Guid id,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return Task.FromResult<BookRepositoryDto?>(null);
        }

        public Task<bool> AddBookToFavouritesAsync(
            Guid bookId,
            Guid userId,
            CancellationToken cancellationToken)
        {
            FavouriteBookId = bookId;
            FavouriteUserId = userId;
            return Task.FromResult(true);
        }

        public Task<ReviewRepositoryDto?> AddReviewAsync(
            Guid bookId,
            Guid userId,
            ReviewCommandRepositoryDto command,
            CancellationToken cancellationToken)
        {
            return Task.FromResult<ReviewRepositoryDto?>(null);
        }

        public Task<ReviewRepositoryDto?> UpdateReviewAsync(
            Guid reviewId,
            Guid userId,
            ReviewCommandRepositoryDto command,
            CancellationToken cancellationToken)
        {
            return Task.FromResult<ReviewRepositoryDto?>(null);
        }

        public Task<bool> DeleteReviewAsync(
            Guid reviewId,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return Task.FromResult(false);
        }
    }
}
