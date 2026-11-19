# ADR-0000: Full-stack structure, data ownership, and API boundary

- **Status:** Accepted
- **Date:** 2026-11-18
- **Owners:** BookHaven team

## Context

BookHaven began as a frontend-only coursework concept using Open Library and
LocalStorage. The repository now contains a .NET 10 API and the coursework page
examples explicitly require read operations plus `POST`, `PUT`, and `DELETE`
flows. We need one architecture that remains small enough to explain during a
defense while giving frontend and backend clear responsibilities.

The required product flows are:

- Home page with featured books;
- searchable, filterable, sortable, paged catalog;
- dynamic `/books/:id` details page;
- one saved-book area with add/remove actions;
- reading progress and personal review create/edit/delete;
- book create/edit forms;
- About content and a custom 404 page.

Microsoft's guidance for non-trivial ASP.NET Core monoliths recommends
separating the core model from presentation and infrastructure and directing
dependencies inward. It also notes that full DDD is often unnecessary for
primarily CRUD applications. BookHaven therefore needs pragmatic separation,
not enterprise ceremony.

References:

- [Common web application architectures](https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
- [Architectural principles](https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/architectural-principles)
- [Developing ASP.NET Core MVC apps](https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/develop-asp-net-core-mvc-apps)
- [Create web APIs with ASP.NET Core](https://learn.microsoft.com/aspnet/core/web-api)

## Decision

### Repository and deployment

Keep frontend, backend, documentation, and tests in one repository. Deploy the
backend as one ASP.NET Core application and the frontend as one static web
application. Do not split either side into microservices or independently
versioned packages.

### Backend decision

Use a pragmatic Clean Architecture-inspired layered monolith:

```text
BookHaven.Api
  -> BookHaven.Application
  -> BookHaven.Domain

BookHaven.Api (composition root only)
  -> BookHaven.Persistence -> BookHaven.Application
  -> BookHaven.Infrastructure -> BookHaven.Application
```

- `Domain` contains dependency-free entities, enums, and invariant constants.
- `Application` contains use cases, ports, paging models, and request/response
  contracts.
- `Persistence` contains EF Core and relational data-access implementations.
- `Infrastructure` contains the Open Library client and other external
  technical services.
- `Api` contains controllers, middleware, HTTP mapping, and dependency
  registration.
- Controllers are thin and never query EF Core directly.
- Use controller-based APIs and Problem Details because the routes include
  several related CRUD resources and should be easy to demonstrate.
- Do not add MediatR, a generic repository, an event bus, or domain events until
  a concrete requirement makes one useful.

The relational persistence provider is deliberately deferred. Domain and
Application objects do not depend on provider-specific APIs, so SQLite or SQL
Server can be selected during the persistence phase without changing HTTP
contracts.

### Frontend decision

Use a feature-first React structure:

```text
src/
  app/
  features/
    home/
    books/
    library/
  shared/
```

- React Router owns routes and URL search parameters.
- TanStack React Query owns all API server state.
- Axios is used only in feature API modules reached through custom query or
  mutation hooks. Components never perform HTTP calls.
- Material UI supplies accessible interactive primitives. Tailwind CSS supplies
  layout and responsive composition.
- API responses are mapped to stable frontend models where necessary.
- Loading, error, empty, and populated states are explicit.
- The existing direct Open Library featured-books request is transitional and
  will be replaced after the backend catalog endpoint is implemented.

### Data ownership and anonymous identity

The backend becomes the source of truth for books, My Library entries, reading
statuses, and reviews. This supersedes the earlier plan to persist those records
entirely in LocalStorage.

Authentication remains out of scope. The browser generates one random GUID,
stores it as `bookhaven.client-id.v1`, and sends it in the
`X-BookHaven-Client-Id` header for library/review requests. This value separates
anonymous coursework data but is not a credential and provides no security
guarantee.

### Saved-book model

Use **My Library** as the only saved-book concept. Do not create a separate
Favorites page, entity, endpoint, hook, or storage key. Adding a book creates a
library entry with one of these statuses:

- `WantToRead`
- `Reading`
- `Completed`

Each library entry can own zero or one review. This keeps review ownership and
the one-review-per-book rule straightforward.

### Book model

Use internal GUIDs for routes and relationships. Keep optional Open Library IDs
as integration metadata, not primary keys. Model authors and genres separately
with explicit many-to-many join entities so catalog filtering and sorting are
relational and predictable.

The initial aggregate/schema is:

```text
Book <- BookAuthor -> Author
Book <- BookGenre  -> Genre
Book <- LibraryEntry -> Review (zero or one)
          |
          +-- scoped by anonymous ClientId
```

`Book.IsFeatured` supports the Home shelf without hard-coding book IDs in the
frontend. Book create/update requests accept author and genre names so the
coursework form does not require separate admin screens for those lookup tables.

### HTTP contract

Use resource routes under `/api`:

```text
GET/POST               /api/books
GET/PUT/DELETE         /api/books/{bookId}
GET/POST               /api/library
PUT/DELETE             /api/library/{bookId}
POST/PUT/DELETE        /api/library/{bookId}/review
```

Catalog filters are query parameters. Pages are one-based. Creates return
`201 Created`, deletes return `204 No Content`, validation returns Problem
Details, missing resources return `404`, and duplicate saved books/reviews
return `409 Conflict`.

### Testing decision

Do not generate broad placeholder tests now. After validation and use cases
exist, add a small deterministic unit suite for domain/application behavior.
Add persistence and HTTP integration tests only after EF Core and controllers
exist. Automated tests never call the live Open Library service.

## Alternatives considered

### Keep the project frontend-only

Rejected because the repository now includes a backend and the coursework flow
needs demonstrable HTTP write methods. It would also make the new backend
projects architectural noise.

### Let the frontend call Open Library and BookHaven API independently

Rejected as the steady state because it creates two transport models, splits
error handling, and makes saved records harder to keep consistent. A temporary
direct call may remain only until the backend catalog endpoint replaces it.

### Store My Library only in LocalStorage

Rejected as the target because it cannot demonstrate the requested write API
operations. LocalStorage remains appropriate for the anonymous client ID.

### Use a separate Favorites model

Rejected by product direction. My Library already represents saved books and
adds useful reading statuses without duplicating state.

### Adopt full DDD/CQRS and MediatR

Rejected for now. The domain is primarily CRUD and the extra abstractions would
make the coursework harder to explain without solving a present problem.

## Consequences

### Positive

- Frontend components depend on one stable API rather than upstream field
  shapes.
- Domain and Application remain easy to unit test.
- The solution demonstrates all required HTTP verbs with real behavior.
- A relational schema supports author/genre filtering and future data imports.
- One ADR keeps cross-stack assumptions synchronized.

### Costs and risks

- The API and database must run for full My Library functionality.
- Anonymous client IDs are convenient but not secure identity; clearing browser
  storage creates a new library scope.
- The current frontend Open Library hook must be migrated.
- EF Core provider, migrations, CORS/proxy setup, and import strategy remain
  implementation work.

## Follow-up work

1. Add Application service interfaces and validation.
2. Select the EF Core provider and configure the schema constraints.
3. Implement book and library controllers.
4. Configure frontend API base URL/proxy and anonymous client header.
5. Replace direct Open Library frontend requests.
6. Add the focused unit tests listed in the implementation plan.
