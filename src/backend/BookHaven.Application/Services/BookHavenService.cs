using System.Net.Mail;
using BookHaven.Application.Dtos;
using BookHaven.Application.Interfaces;
using BookHaven.Application.Interfaces.Dtos;
using BookHaven.Application.Mappings;
using BookHaven.Application.Security;

namespace BookHaven.Application.Services;

public sealed class BookHavenService : IBookHavenService
{
    private readonly IBookRepository bookRepository;
    private readonly IUserRepository userRepository;
    private readonly ITokenService tokenService;

    public BookHavenService(
        IBookRepository bookRepository,
        IUserRepository userRepository,
        ITokenService tokenService)
    {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    public async Task<PagedDto<BookDto>> GetBooksAsync(
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
                normalizedQuery.ToRepositoryDto(),
                cancellationToken);

        return new PagedDto<BookDto>(
            result.Items.Select(item => item.ToDto()).ToArray(),
            result.Page,
            result.PageSize,
            result.TotalCount);
    }

    public async Task<BookDto?> GetBookByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        BookRepositoryDto? book =
            await bookRepository.GetBookByIdAsync(id, cancellationToken);
        return book?.ToDto();
    }

    public async Task<BookDto> AddBookAsync(
        BookCommandDto command,
        CancellationToken cancellationToken)
    {
        BookCommandDto normalizedCommand = NormalizeAndValidateBook(command);
        BookRepositoryDto book = await bookRepository.AddBookAsync(
            normalizedCommand.ToRepositoryDto(),
            cancellationToken);
        return book.ToDto();
    }

    public async Task<BookDto?> UpdateBookAsync(
        Guid id,
        BookCommandDto command,
        CancellationToken cancellationToken)
    {
        BookCommandDto normalizedCommand = NormalizeAndValidateBook(command);
        BookRepositoryDto? book = await bookRepository.UpdateBookAsync(
            id,
            normalizedCommand.ToRepositoryDto(),
            cancellationToken);
        return book?.ToDto();
    }

    public Task<bool> DeleteBookAsync(Guid id, CancellationToken cancellationToken)
    {
        return bookRepository.DeleteBookAsync(id, cancellationToken);
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
        return review?.ToDto();
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
        return review?.ToDto();
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
        string username = register.Username.Trim();
        string email = register.Email.Trim().ToLowerInvariant();

        ValidateRegistration(username, email, register.Password);

        if (await userRepository.ExistsAsync(username, email, cancellationToken))
        {
            throw new InvalidOperationException("A user with that username or email already exists.");
        }

        UserRepositoryDto user = new(
            Guid.NewGuid(),
            username,
            email,
            PasswordHashing.Hash(register.Password),
            DateTimeOffset.UtcNow);

        UserRepositoryDto createdUser =
            await userRepository.AddAsync(user, cancellationToken);
        UserDto userDto = createdUser.ToDto();
        return new AuthDto(tokenService.CreateToken(userDto), userDto);
    }

    public async Task<AuthDto> LoginAsync(
        LoginDto login,
        CancellationToken cancellationToken)
    {
        string email = login.Email.Trim().ToLowerInvariant();
        UserRepositoryDto? user =
            await userRepository.GetByEmailAsync(email, cancellationToken);

        if (user is null || !PasswordHashing.Verify(login.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        UserDto userDto = user.ToDto();
        return new AuthDto(tokenService.CreateToken(userDto), userDto);
    }

    private static BookCommandDto NormalizeAndValidateBook(BookCommandDto command)
    {
        string title = command.Title.Trim();
        string? description = NormalizeOptional(command.Description);
        string? coverUrl = NormalizeOptional(command.CoverUrl);
        string[] authors = command.Authors
            .Select(author => author.Trim())
            .Where(author => author.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        if (title.Length is 0 or > 300)
        {
            throw new ArgumentException("Title is required and cannot exceed 300 characters.");
        }

        if (description?.Length > 5_000)
        {
            throw new ArgumentException("Description cannot exceed 5,000 characters.");
        }

        if (authors.Length == 0 || authors.Any(author => author.Length > 200))
        {
            throw new ArgumentException("At least one author is required and names cannot exceed 200 characters.");
        }

        if (command.Genre == GenreDto.Unknown || !Enum.IsDefined(command.Genre))
        {
            throw new ArgumentException("A valid genre is required.");
        }

        int maximumYear = DateTime.UtcNow.Year + 1;
        if (command.FirstPublishedYear is < 1 || command.FirstPublishedYear > maximumYear)
        {
            throw new ArgumentException($"Publication year must be between 1 and {maximumYear}.");
        }

        if (coverUrl is not null &&
            (!Uri.TryCreate(coverUrl, UriKind.Absolute, out Uri? uri) ||
             (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)))
        {
            throw new ArgumentException("Cover URL must be an absolute HTTP or HTTPS URL.");
        }

        return command with
        {
            Title = title,
            Description = description,
            CoverUrl = coverUrl,
            Authors = authors,
        };
    }

    private static ReviewCommandDto NormalizeAndValidateReview(ReviewCommandDto command)
    {
        string text = command.Text.Trim();
        if (command.Rating is < 1 or > 5)
        {
            throw new ArgumentException("Rating must be between 1 and 5.");
        }

        if (text.Length is 0 or > 2_000)
        {
            throw new ArgumentException("Review text is required and cannot exceed 2,000 characters.");
        }

        return command with { Text = text };
    }

    private static void ValidateRegistration(
        string username,
        string email,
        string password)
    {
        if (username.Length is < 3 or > 50)
        {
            throw new ArgumentException("Username must contain between 3 and 50 characters.");
        }

        if (!MailAddress.TryCreate(email, out _) || email.Length > 254)
        {
            throw new ArgumentException("A valid email address is required.");
        }

        if (password.Length is < 6 or > 100)
        {
            throw new ArgumentException("Password must contain between 6 and 100 characters.");
        }
    }

    private static string? NormalizeOptional(string? value)
    {
        string? normalized = value?.Trim();
        return string.IsNullOrEmpty(normalized) ? null : normalized;
    }
}
