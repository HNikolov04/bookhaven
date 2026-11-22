# BookHaven Backend Conventions

## Layers

| Project | Responsibility |
| --- | --- |
| Domain | Entities, navigation properties, and domain enums |
| Application | DTOs, repository interfaces, mapping, validation, and service |
| Persistence | DbContext, repositories, and one configuration per entity |
| Api | Controllers, ApiDtos, API enums, JWT, extensions, and composition root |
| Tests | Small deterministic unit tests |

- There is no Infrastructure project.
- `BookService` is the single application service.
- `BooksController` owns authenticated book/favourite/review endpoints.
- `UsersController` owns register/login.
- `BaseController` exposes shared authenticated-user helpers.

## Files and naming

- One DTO per file.
- One enum per file under an `Enums` folder.
- Mapping types are separated by feature/boundary.
- Use `Api`, `Dto`, `Id`, and `Url` casing.
- Async methods end in `Async` and accept `CancellationToken` last.
- Use file-scoped namespaces, nullable references, and warnings as errors.

## Domain

- Book, author, review, and user identifiers use `Guid` end to end.
- One book has one author.
- One book has multiple `Genre` enum values through `BookGenre`.
- Book ratings persist `AverageStars` and `RatingVotes`, calculated only from
  BookHaven reviews. External catalogue ratings are never imported.
- A book without BookHaven reviews has `AverageStars = 0` and
  `RatingVotes = 0`.
- Each review has `BookId`, `UserId`, text, stars, and `CreatedAtUtc`.
- One user can review a given book once.
- Users have email and password hash only; there is no username.
- Favourites use `UserFavouriteBook` with `(UserId, BookId)` as the key.

## DTO flow

```text
ApiDto <-> Application DTO <-> Repository DTO <-> Entity
```

- All mapping is handwritten.
- Controllers never return entities or repository DTOs.
- Persistence never exposes tracked entities.
- Do not add AutoMapper.

## Repositories and service

- Interfaces live in `Application/Interfaces`.
- `BookRepository` supports reads, favourites, and reviews; it does not expose
  book create/update/delete.
- `UserRepository` supports email lookup and registration persistence.
- Read queries use `AsNoTracking` and `AsSplitQuery` when loading collections.
- `BookService` owns paging normalization, review validation, email
  normalization, password hashing, login, and orchestration.

## EF Core

- SQLite is the development provider.
- Every entity has an `IEntityTypeConfiguration<T>` file.
- Configure keys, indexes, lengths, relationships, conversions, and delete
  behavior explicitly.
- Genre values are stored as strings in `BookGenres`.
- Review changes recalculate book average stars and vote count.
- Startup seeding normalizes existing rating summaries from stored reviews
  without deleting user data.
- The coursework setup uses `EnsureCreated`; use migrations when schema history
  becomes a deployment requirement.

## HTTP and authentication

- `/api/books` and all nested endpoints require JWT.
- `/api/users/register` and `/api/users/login` are anonymous.
- Book catalogue data is read-only through the API.
- Review mutations use the token user and cannot edit another user's review.
- JWT expiry is two hours.
- Production signing keys come from environment configuration/secret storage.
- Use Problem Details for validation and authentication errors.

## Program and extensions

- `Program.cs` stays minimal.
- Service registration belongs in `IServiceCollectionExtensions`.
- Required configuration parsing belongs in `IConfigurationExtensions`.
- Pipeline/database startup belongs in `WebApplicationExtensions`.

## Verification

```powershell
dotnet build BookHaven.slnx --no-restore
dotnet test BookHaven.slnx --no-build
```
