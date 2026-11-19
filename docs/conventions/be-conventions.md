# BookHaven Backend Conventions

This file contains reusable backend rules. Keep delivery status in the root
`implementation.md` and cross-stack decisions in the single ADR.

## Projects

| Project | Responsibility |
| --- | --- |
| `BookHaven.Domain` | Entities, navigation properties, and enums |
| `BookHaven.Application` | Interfaces, DTOs, mappings, validation, and one service |
| `BookHaven.Persistence` | EF Core DbContext, repositories, and configurations |
| `BookHaven.Api` | ApiDtos, manual mapping, JWT, one controller, and composition root |
| `BookHaven.Tests` | Simple unit tests added after behavior stabilizes |

- Dependencies point toward Domain.
- There is no Infrastructure layer.
- Do not add MediatR, AutoMapper, ASP.NET Identity, or a generic repository.
- `BookHavenService` is the single application service.
- `BookHavenController` contains all endpoints.

## Naming

- Use `Api`, `Dto`, `Id`, and `Url` casing.
- Async methods end with `Async` and accept `CancellationToken` last.
- Namespaces mirror folders.
- Use file-scoped namespaces, nullable reference types, and warnings as errors.
- Concrete types are `sealed` unless inheritance is intentional.

## Entities

- Entities live only in Domain and contain navigation properties.
- `Book.Genre` uses the `Genre` enum; there is no Genre table or `BookGenre`.
- Books and authors use the explicit `BookAuthor` join entity.
- Reviews reference both `Book` and `User`.
- A unique `(BookId, UserId)` index enforces one review per user per book.
- Timestamps use `DateTimeOffset` and the `Utc` suffix.
- Passwords are never stored directly; the service stores PBKDF2 hashes.

## DTO and mapping flow

Every boundary owns a DTO:

```text
ApiDto <-> Application DTO <-> Repository DTO <-> Domain entity
```

- Mapping is handwritten in the owning layer.
- API controllers never return entities or repository DTOs.
- Persistence never returns tracked entities outside the project.
- Do not introduce AutoMapper.

## Repositories

- Interfaces live in `BookHaven.Application/Interfaces`.
- Repository boundary DTOs live in `Application/Interfaces/Dtos`.
- Implementations live in `BookHaven.Persistence/Repositories`.
- `BookRepository` owns book queries, CRUD, and book-review persistence.
- `UserRepository` contains only the persistence required by register/login.
- Use `AsNoTracking` for reads and `AsSplitQuery` for multiple collections.
- Do not expose `IQueryable` outside Persistence.

## Service

`BookHavenService` owns:

- query normalization and paging bounds;
- book and review validation;
- registration and login behavior;
- password hashing/verification;
- orchestration between repositories and token generation.

Controllers stay thin and translate HTTP input/output only.

## Entity Framework Core

- SQLite is the development provider.
- Every entity has its own `IEntityTypeConfiguration<T>` file.
- Configure keys, lengths, relationships, conversions, indexes, and delete
  behavior explicitly.
- Store `Genre` as its string name.
- Keep package versions in `Directory.Packages.props`.
- The current coursework setup uses `EnsureCreated`; introduce migrations only
  if deployment or schema evolution requires them.

## HTTP and JWT

- Routes start with `/api`.
- Reads are public; book writes and review writes require JWT.
- Review update/delete operations use the authenticated user ID.
- Registration/login return an `AuthApiDto` containing token and user.
- JWT expiry is two hours.
- Keep the development signing key out of real deployments. Production keys
  must come from environment configuration or secret storage.
- Return `201` for creates, `204` for deletes, `404` for missing resources,
  `409` for duplicates, and validation Problem Details for invalid input.

## Validation

- Trim all user text before persistence.
- Title: required, maximum 300 characters.
- Description: maximum 5,000 characters.
- Author: at least one, maximum 200 characters each.
- Review: rating 1-5 and non-empty text up to 2,000 characters.
- Username: 3-50 characters.
- Password: 6-100 characters for coursework scope.
- Email must have a valid shape and is normalized to lowercase.

## Quality checks

```powershell
dotnet restore BookHaven.slnx
dotnet build BookHaven.slnx --no-restore
dotnet test BookHaven.slnx --no-build
```

Unit tests remain small and target service validation, mapping, password
verification, and repository-independent behavior.
