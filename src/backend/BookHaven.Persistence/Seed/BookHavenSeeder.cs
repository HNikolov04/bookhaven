using BookHaven.Domain.Books;
using BookHaven.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BookHaven.Persistence.Seed;

public static class BookHavenSeeder
{
    public static async Task SeedAsync(
        BookHavenDbContext dbContext,
        CancellationToken cancellationToken = default)
    {
        if (await dbContext.Books.AnyAsync(cancellationToken))
        {
            return;
        }

        Book[] books =
        [
            CreateBook(
                "11111111-1111-1111-1111-111111111111",
                "Dune",
                "Frank Herbert",
                "A young heir confronts destiny on the desert planet Arrakis.",
                "Set on the desert planet Arrakis, Dune follows Paul Atreides as his family accepts stewardship of the universe's most valuable world. Politics, ecology, faith, and power collide in a sweeping science-fiction epic.",
                "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
                412,
                1965,
                4.7m,
                12_430,
                true,
                Genre.ScienceFiction,
                Genre.Fiction),
            CreateBook(
                "22222222-2222-2222-2222-222222222222",
                "1984",
                "George Orwell",
                "A chilling portrait of surveillance, truth, and resistance.",
                "Winston Smith lives under the constant gaze of Big Brother. His quiet rebellion against a regime that controls language, memory, and truth becomes a timeless warning about authoritarian power.",
                "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
                328,
                1949,
                4.6m,
                18_205,
                true,
                Genre.Fiction,
                Genre.ScienceFiction),
            CreateBook(
                "33333333-3333-3333-3333-333333333333",
                "The Hobbit",
                "J.R.R. Tolkien",
                "An unexpected journey beyond the comforts of home.",
                "Bilbo Baggins is swept from his peaceful home into an adventure with dwarves, a wizard, and a dragon. Along the way he discovers courage, friendship, and a mysterious ring.",
                "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
                310,
                1937,
                4.8m,
                21_780,
                true,
                Genre.Fantasy,
                Genre.Fiction),
            CreateBook(
                "44444444-4444-4444-4444-444444444444",
                "Sapiens",
                "Yuval Noah Harari",
                "A concise exploration of how humankind came to shape the world.",
                "From the emergence of Homo sapiens to modern societies, Sapiens surveys the shared stories, inventions, and revolutions that transformed a species into a global force.",
                "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
                464,
                2011,
                4.5m,
                9_620,
                true,
                Genre.NonFiction,
                Genre.History),
            CreateBook(
                "55555555-5555-5555-5555-555555555555",
                "Atomic Habits",
                "James Clear",
                "Practical ideas for building good habits and breaking bad ones.",
                "Atomic Habits explains how small, repeatable improvements compound into meaningful change. Its clear systems help readers reshape their environment, identity, and daily routines.",
                "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
                320,
                2018,
                4.7m,
                16_340,
                false,
                Genre.NonFiction),
            CreateBook(
                "66666666-6666-6666-6666-666666666666",
                "Project Hail Mary",
                "Andy Weir",
                "One astronaut wakes up to an impossible mission among the stars.",
                "Ryland Grace wakes alone on a spacecraft with no memory of his mission. Science, ingenuity, and an unexpected friendship may be the only things standing between Earth and extinction.",
                "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
                496,
                2021,
                4.8m,
                14_112,
                false,
                Genre.ScienceFiction,
                Genre.Fiction),
            CreateBook(
                "77777777-7777-7777-7777-777777777777",
                "The Alchemist",
                "Paulo Coelho",
                "A shepherd follows a dream toward treasure and self-discovery.",
                "Santiago leaves familiar fields to pursue a recurring dream. His journey across the desert becomes a fable about purpose, courage, and listening to the language of the world.",
                "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
                208,
                1988,
                4.3m,
                10_784,
                false,
                Genre.Fiction),
            CreateBook(
                "88888888-8888-8888-8888-888888888888",
                "Circe",
                "Madeline Miller",
                "A mythic witch claims her power and tells her own story.",
                "Banished to a remote island, Circe crosses paths with gods and mortals while learning the reach of her own magic. The familiar myth becomes an intimate story of identity and independence.",
                "https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg",
                400,
                2018,
                4.6m,
                8_912,
                false,
                Genre.Fantasy,
                Genre.Fiction),
            CreateBook(
                "99999999-9999-9999-9999-999999999999",
                "Educated",
                "Tara Westover",
                "A memoir about education, family, and finding an independent voice.",
                "Raised in an isolated household, Tara Westover enters a classroom for the first time as a teenager. Education opens a difficult path toward knowledge, self-invention, and a life of her own.",
                "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
                352,
                2018,
                4.7m,
                13_105,
                false,
                Genre.NonFiction,
                Genre.Biography),
            CreateBook(
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                "A Game of Thrones",
                "George R. R. Martin",
                "Noble families contend for power as an ancient threat returns.",
                "In a realm where seasons last for years, competing houses struggle for the Iron Throne. Beyond the political intrigue, an old danger gathers in the frozen north.",
                "https://covers.openlibrary.org/b/isbn/9780553593716-L.jpg",
                835,
                1996,
                4.7m,
                17_806,
                false,
                Genre.Fantasy,
                Genre.Fiction),
            CreateBook(
                "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "Pride and Prejudice",
                "Jane Austen",
                "Elizabeth Bennet meets her match in the reserved Mr Darcy.",
                "Sharp observation and lively dialogue shape this enduring comedy of manners. Elizabeth Bennet and Fitzwilliam Darcy must look beyond first impressions, pride, and social expectation.",
                "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                480,
                1813,
                4.6m,
                19_440,
                false,
                Genre.Fiction,
                Genre.Romance),
            CreateBook(
                "cccccccc-cccc-cccc-cccc-cccccccccccc",
                "The Silent Patient",
                "Alex Michaelides",
                "A psychotherapist searches for the truth behind a woman's silence.",
                "After a celebrated painter is accused of shooting her husband, she never speaks again. A determined therapist becomes obsessed with uncovering the motive behind the crime.",
                "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
                336,
                2019,
                4.2m,
                7_604,
                false,
                Genre.Mystery,
                Genre.Fiction),
        ];

        dbContext.Books.AddRange(books);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static Book CreateBook(
        string id,
        string title,
        string authorName,
        string shortDescription,
        string longDescription,
        string pictureUrl,
        int pages,
        int publishYear,
        decimal averageStars,
        int ratingVotes,
        bool isFeatured,
        params Genre[] genres)
    {
        Guid bookId = Guid.Parse(id);
        Author author = new()
        {
            Id = bookId,
            Name = authorName,
            Description = $"{authorName} is the author of {title}.",
        };
        Book book = new()
        {
            Id = bookId,
            Title = title,
            ShortDescription = shortDescription,
            LongDescription = longDescription,
            PictureUrl = pictureUrl,
            Pages = pages,
            PublishYear = publishYear,
            AverageStars = averageStars,
            RatingVotes = ratingVotes,
            IsFeatured = isFeatured,
            AuthorId = author.Id,
            Author = author,
        };
        book.BookGenres = genres
            .Select(genre => new BookGenre
            {
                BookId = bookId,
                Genre = genre,
                Book = book,
            })
            .ToArray();
        return book;
    }
}
