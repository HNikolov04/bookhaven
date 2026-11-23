# ADR-0000: Authenticated read-only catalogue architecture

- **Status:** Accepted
- **Date:** 2026-11-19

## Context

BookHaven must demonstrate layered DTO transfer, manual mapping, EF Core
relationships, favourites, reviews, and simple JWT authentication while staying
small enough for coursework defense.

## Decision

Use Domain, Application, Persistence, and Api runtime projects. Keep one
application service, one book repository, a minimal user repository, and two API
controllers: `BooksController` and `UsersController`. Shared JWT user extraction
lives in `BaseController`.

The catalogue is read-only through HTTP. The only book-related writes are adding
a favourite and creating/editing/deleting the current user's review.

Domain relationships:

```text
Author 1 -> many Books
Book 1 -> many BookGenres (Genre enum values)
Book 1 -> many Reviews <- 1 User
Book many <-> many Users through UserFavouriteBook
```

Books persist average stars and rating vote count. Repository review operations
recalculate both values.

Users contain email and password hash only. Registration/login use PBKDF2 and a
two-hour JWT. All book routes require authentication; only register/login are
anonymous.

PostgreSQL is the sole persistence provider through Npgsql. JWT creation and
its typed configuration model live in Application; Api remains responsible for
reading configuration and configuring bearer-token validation.

DTO transfer remains explicit:

```text
ApiDto <-> Application DTO <-> Repository DTO <-> Entity
```

Every DTO and enum has its own file. Mapping is handwritten. `Program.cs` stays
minimal through `IServiceCollectionExtensions`, `IConfigurationExtensions`, and
`WebApplicationExtensions`.

The frontend places login/register outside `MainLayout`, guards every other
route, clears auth after `401`, and exposes email/logout through a profile-avatar
menu. Favourites are server state queried with React Query.

## Consequences

- Catalogue content is seeded through persistence because the API has no
  book-write endpoints. A later import can replace the deterministic seed.
- Email is the only displayed user identity.
- Multiple genres remain strongly typed without a Genre lookup table.
- Persisted rating summaries require recalculation after review writes.
- Local development requires a PostgreSQL connection string supplied outside
  source control.
- LocalStorage JWT is intentionally simple but less hardened than HttpOnly
  cookies; production keys must not be committed.
- The explicit DTO-per-boundary approach is repetitive but easy to explain.

## Revisit when

Add migrations, refresh tokens, roles, or split services/controllers only if the
coursework scope grows and provides a concrete need.
