# ADR-0000: Simplified layered API and JWT authentication

- **Status:** Accepted
- **Date:** 2026-11-19

## Context

The earlier design introduced an Infrastructure project, anonymous client IDs,
separate genre entities, and more layers than this coursework needs. The project
must remain understandable while still demonstrating controllers, services,
repositories, EF Core relationships, DTO transfer, manual mapping, and basic
authentication.

## Decision

### Backend

Use four runtime projects:

```text
BookHaven.Api
BookHaven.Application
BookHaven.Domain
BookHaven.Persistence
```

Remove `BookHaven.Infrastructure`. Keep one application service
(`BookHavenService`) and one controller (`BookHavenController`). Use a concrete
book repository plus a minimal user repository required for authentication.

Use SQLite and EF Core. Each entity has its own configuration file. Entity
relationships use explicit navigation properties:

```text
Book <- BookAuthor -> Author
Book <- Review -> User
```

`Genre` is a domain enum stored as text on `Book`; there is no Genre table or
book-genre join.

### DTO boundaries

Use separate DTOs at each transfer boundary:

```text
ApiDto <-> Application DTO <-> Repository DTO <-> Entity
```

Every conversion is handwritten. AutoMapper is deliberately excluded so the
coursework can demonstrate exactly how data moves between layers.

### API

All routes live in one controller under `/api`:

- public book list/details;
- authenticated book create/update/delete;
- authenticated review create/update/delete;
- public register/login.

The service performs validation and orchestration. The controller maps ApiDtos,
HTTP status codes, and the authenticated user ID.

### Authentication

Use a small custom user model and JWT bearer authentication rather than
ASP.NET Identity. Registration stores a PBKDF2 password hash. Login verifies the
hash and returns a two-hour JWT. The frontend stores token plus user in
LocalStorage and attaches the token through the Axios interceptor.

This is intentionally coursework-level authentication. It does not implement
refresh tokens, roles, password recovery, email confirmation, account lockout,
or external providers.

### Frontend

Add `/login` and `/register`, an `AuthProvider`, React Query login/register
mutations, and header sign-in/sign-out controls. The frontend calls BookHaven's
API instead of Open Library directly.

Keep the current My Library LocalStorage prototype separate until authenticated
library persistence is deliberately added.

## Consequences

### Benefits

- Fewer projects and abstractions.
- DTO movement and mapping are visible and defendable.
- Real EF relationships and configurations remain demonstrated.
- JWT protects write endpoints without the weight of Identity.
- Frontend and backend share one API contract.

### Trade-offs

- One service and one controller will become large if scope grows.
- Repository DTOs add repetitive mapping by design.
- The development JWT key must be replaced for deployment.
- `EnsureCreated` is simple but does not provide migration history.
- LocalStorage JWT storage is simple but less hardened than an HttpOnly cookie
  architecture.

## Revisit when

Split the controller/service or add migrations only when the coursework scope
actually grows enough to justify them. Do not add architectural patterns merely
for hypothetical future use.
