using System.Net.Mail;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Application.Mappings;
using BookHaven.Application.Security;

namespace BookHaven.Application.Services;

public sealed class BookService : IBookService
{
    private readonly IBookRepository bookRepository;
    private readonly IUserRepository userRepository;
    private readonly ITokenService tokenService;

    public BookService(
        IBookRepository bookRepository,
        IUserRepository userRepository,
        ITokenService tokenService)
    {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    public async Task<PagedDto<BookDto>> GetBooksAsync(
        Guid userId,
        BookQueryDto query,
        CancellationToken cancellationToken)
    {
        BookQueryDto normalizedQuery = query with
        {
            Search = NormalizeOptional(query.Search),
            Page = Math.Max(query.Page, 1),
            PageSize = Math.Clamp(query.PageSize, 1, 100),
        };

        PagedRepositoryDto<BookRepositoryDto> result =
            await bookRepository.GetBooksAsync(
                userId,
                normalizedQuery.ToRepositoryDto(),
                cancellationToken);

        return new PagedDto<BookDto>(
            result.Items.Select(book => book.ToApplicationDto()).ToArray(),
            result.Page,
            result.PageSize,
            result.TotalCount);
    }

    public async Task<BookDto?> GetBookByIdAsync(
        Guid id,
        Guid userId,
        CancellationToken cancellationToken)
    {
        BookRepositoryDto? book = await bookRepository.GetBookByIdAsync(
            id,
            userId,
            cancellationToken);
        return book?.ToApplicationDto();
    }

    public Task<bool> AddBookToFavouritesAsync(
        Guid bookId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return bookRepository.AddBookToFavouritesAsync(
            bookId,
            userId,
            cancellationToken);
    }

    public Task<bool> RemoveBookFromFavouritesAsync(
        Guid bookId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return bookRepository.RemoveBookFromFavouritesAsync(
            bookId,
            userId,
            cancellationToken);
    }

    public async Task<ReviewDto?> AddReviewAsync(
        Guid bookId,
        Guid userId,
        ReviewCommandDto command,
        CancellationToken cancellationToken)
    {
        ReviewCommandDto normalizedCommand = NormalizeAndValidateReview(command);
        ReviewRepositoryDto? review = await bookRepository.AddReviewAsync(
            bookId,
            userId,
            normalizedCommand.ToRepositoryDto(),
            cancellationToken);
        return review?.ToApplicationDto();
    }

    public async Task<ReviewDto?> UpdateReviewAsync(
        Guid reviewId,
        Guid userId,
        ReviewCommandDto command,
        CancellationToken cancellationToken)
    {
        ReviewCommandDto normalizedCommand = NormalizeAndValidateReview(command);
        ReviewRepositoryDto? review = await bookRepository.UpdateReviewAsync(
            reviewId,
            userId,
            normalizedCommand.ToRepositoryDto(),
            cancellationToken);
        return review?.ToApplicationDto();
    }

    public Task<bool> DeleteReviewAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return bookRepository.DeleteReviewAsync(reviewId, userId, cancellationToken);
    }

    public async Task<AuthDto> RegisterAsync(
        RegisterDto register,
        CancellationToken cancellationToken)
    {
        string email = NormalizeEmail(register.Email);
        ValidateCredentials(email, register.Password);
        if (!string.Equals(
            register.Password,
            register.ConfirmPassword,
            StringComparison.Ordinal))
        {
            throw new ArgumentException("Passwords do not match.");
        }

        if (await userRepository.ExistsAsync(email, cancellationToken))
        {
            throw new InvalidOperationException("A user with that email already exists.");
        }

        UserRepositoryDto createdUser = await userRepository.AddAsync(
            new UserRepositoryDto(
                Guid.NewGuid(),
                email,
                PasswordHashing.Hash(register.Password)),
            cancellationToken);
        UserDto user = createdUser.ToApplicationDto();
        return new AuthDto(tokenService.CreateToken(user), user);
    }

    public async Task<AuthDto> LoginAsync(
        LoginDto login,
        CancellationToken cancellationToken)
    {
        string email = NormalizeEmail(login.Email);
        UserRepositoryDto? user =
            await userRepository.GetByEmailAsync(email, cancellationToken);

        if (user is null || !PasswordHashing.Verify(login.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        UserDto userDto = user.ToApplicationDto();
        return new AuthDto(tokenService.CreateToken(userDto), userDto);
    }

    private static ReviewCommandDto NormalizeAndValidateReview(ReviewCommandDto command)
    {
        string text = command.Text.Trim();
        if (command.Stars is < 1 or > 5)
        {
            throw new ArgumentException("Stars must be between 1 and 5.");
        }

        if (text.Length is 0 or > 2_000)
        {
            throw new ArgumentException("Review text is required and cannot exceed 2,000 characters.");
        }

        return command with { Text = text };
    }

    private static void ValidateCredentials(string email, string password)
    {
        if (!MailAddress.TryCreate(email, out _) || email.Length > 254)
        {
            throw new ArgumentException("A valid email address is required.");
        }

        if (password.Length is < 6 or > 100)
        {
            throw new ArgumentException("Password must contain between 6 and 100 characters.");
        }
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static string? NormalizeOptional(string? value)
    {
        string? normalized = value?.Trim();
        return string.IsNullOrEmpty(normalized) ? null : normalized;
    }
}
