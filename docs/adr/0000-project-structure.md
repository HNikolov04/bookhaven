# ADR-0000: BookHaven application architecture

- **Status:** Accepted
- **Date:** 2026-11-19
- **Last reviewed:** 2026-11-23
- **Scope:** Frontend and backend

## Context

BookHaven is a frontend-focused university project, but it also needs a small
API to demonstrate authentication, persistence, DTO transfer, HTTP data
operations, and user-owned data. The implementation must remain understandable
during a coursework defense and must not require paid services or unnecessary
infrastructure.

The current product scope is an authenticated, read-only book catalogue. Users
may write only their account data, favourites, and reviews. Administrative book
management, roles, refresh tokens, and external identity providers are outside
scope.

## Decision drivers

- Keep the frontend responsive, typed, and easy to navigate.
- Keep all HTTP concerns outside React components.
- Make API and persistence boundaries visible through explicit DTOs.
- Protect user-specific operations on both frontend and backend.
- Use real relational persistence without adding deployment infrastructure.
- Prefer a small number of direct abstractions over framework-heavy patterns.
- Keep the project deterministic and demonstrable without a third-party API.

## Decision

### Frontend

Use React, Vite, and strict TypeScript with React Router for routing. Login and
registration are public routes; `ProtectedRoute` guards `MainLayout` and every
application page. `/books/:id` is the dynamic details route and `*` renders the
custom 404 page.

Use Material UI for accessible controls and UI primitives. Tailwind remains in
the styling pipeline, while project CSS owns the current responsive visual
system. Organize code by feature and keep only genuinely shared UI under
`shared`.

Use TanStack React Query for server state and Axios for HTTP. Components call
custom query or mutation hooks, hooks call feature API functions, and those
functions use one configured Axios client. Query keys are centralized per
feature. Loading, failure, empty, and mutation-pending states are visible in the
UI.

Keep only the JWT and minimal email/id user record in LocalStorage under the
versioned key `bookhaven.auth.v1`. Favourites, catalogue data, and reviews are
server state and are never duplicated into LocalStorage. A `401` response clears
the stored session.

### Backend

Use four runtime projects plus tests:

```text
Api -> Application -> Domain
Api -> Persistence -> Application -> Domain
```

- **Domain** owns entities, navigation properties, and `Genre`.
- **Application** owns use cases, validation, service DTOs, repository
  contracts/DTOs, manual mapping, password hashing, and JWT creation.
- **Persistence** owns EF Core, PostgreSQL repositories, entity configuration,
  and deterministic seed data.
- **Api** owns controllers, API DTOs/enums, API mapping, bearer validation,
  CORS, Swagger, and the composition root.

Use `BookService` as the single application service, `BookRepository` for book,
favourite, and review persistence, and `UserRepository` for registration and
login lookup. Do not add a generic repository because the two aggregates need
different queries and commands.

Use `BooksController` and `UsersController`. `BaseController` extracts the
authenticated user identifier shared by protected actions. The catalogue has no
HTTP create/update/delete operations; its only writes are favourite and review
commands.

Keep DTO transfer explicit:

```text
ApiDto <-> Application DTO <-> Repository DTO <-> Entity
```

Each DTO and enum lives in its own file. Mapping is handwritten so the layer
boundaries are visible and explainable. No entity or tracked query escapes the
persistence boundary.

### Data and authentication

Use PostgreSQL through Npgsql as the only database provider. Every entity has a
separate EF Core configuration. The current coursework setup uses
`EnsureCreated` and idempotent deterministic seeding; migrations are deferred
until schema history or deployment requires them.

Use GUID identifiers. A book has one author, multiple enum genres, reviews, and
favouriting users through explicit join entities. A user has email and password
hash only. Users may create multiple independent reviews for the same book.
Rating totals are recalculated exclusively from persisted BookHaven reviews;
unreviewed books start at `0.0 / 5` and `0 ratings`.

Use PBKDF2 password hashes and two-hour signed JWT bearer tokens. JWT creation
and typed options live in Application; Api reads configuration and validates
tokens. Only registration and login allow anonymous access. Signing keys and
database credentials remain outside committed production configuration.

## Alternatives considered

### Runtime Open Library catalogue API requests

Rejected. They would make normal use depend on an external service and would
split ownership of ratings and availability. The seed keeps catalogue behavior
deterministic. Seeded cover URLs remain externally hosted, so a missing image
host can affect artwork but not catalogue data or application operations.

### LocalStorage for favourites and reviews

Rejected after the backend was introduced. These are user-owned domain records
that must be consistent across sessions and protected by server authorization.

### ASP.NET Core Identity or hosted OAuth

Deferred. Either is appropriate for a production system, but both introduce
flows and schema beyond the coursework's email/password JWT requirement. The
current auth boundary can be replaced later without changing feature pages.

### AutoMapper, MediatR, generic repositories, and an Infrastructure project

Rejected. They add indirection without enough use cases to justify it. Direct
mapping and focused interfaces make control flow clearer at this scale.

### HttpOnly authentication cookies

Deferred. Cookies improve token isolation but require a deliberate same-site,
CORS, and CSRF design. LocalStorage JWT is an accepted coursework tradeoff, not
a production security recommendation.

## Consequences

- The application runs locally with only Node.js, .NET, and PostgreSQL.
- Catalogue reads, favourites, and reviews have one authoritative data source.
- The layered backend contains repetitive DTOs, accepted in exchange for clear
  boundaries and manual mapping evidence.
- Broad book-query invalidation is simple and correct for the current catalogue
  size; targeted cache updates can be introduced only if needed.
- Database startup requires a valid external connection string.
- Production deployment must replace the development JWT key and should adopt
  migrations and stronger session storage.
- Frontend component tests remain the principal unfinished quality safeguard.

## Revisit when

Revisit this decision only when requirements add administrative book editing,
roles, password recovery, third-party login, refresh tokens, deployment schema
history, substantially larger catalogue traffic, or multiple application
services with genuinely independent use cases.
