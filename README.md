# BookHaven

BookHaven is a university digital-library application for discovering books,
managing a personal reading list, tracking reading progress, and writing a
personal review. The repository contains a React frontend and an ASP.NET Core
Web API in one solution.

> **Status:** foundation work is in progress. The frontend Home page and shared
> shell exist; the backend domain schema and API contracts are defined, while
> persistence and controllers are still planned.

## Architecture

The backend follows Microsoft's guidance for a small, non-trivial monolithic
web application: separate business rules from presentation and infrastructure,
keep dependencies pointing inward, and use the API project as the composition
root. This is a pragmatic layered architecture, not a microservice system and
not a full DDD implementation.

- [Common web application architectures — Microsoft Learn](https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
- [Architectural principles — Microsoft Learn](https://learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/architectural-principles)
- [Create web APIs with ASP.NET Core — Microsoft Learn](https://learn.microsoft.com/aspnet/core/web-api)

```text
Browser
  -> React feature/query hook
  -> BookHaven HTTP API
  -> Application contract/use case
  -> Domain model
  -> Persistence or external-service implementation
```

The API is a single deployable application. `BookHaven.Api` references the
implementation projects only to register them at startup; feature code should
depend on Application abstractions instead of constructing infrastructure
types directly.

## Repository structure

```text
bookhaven/
├── docs/
│   ├── adr/
│   │   └── 0000-project-structure.md
│   └── conventions/
│       ├── be-conventions.md
│       └── fe-conventions.md
├── src/
│   ├── frontend/                    React + Vite application
│   │   └── src/
│   │       ├── app/                 Providers, router, app entry
│   │       ├── features/            Home, books, and My Library
│   │       └── shared/              Shared UI and client infrastructure
│   └── backend/
│       ├── BookHaven.Api/           Controllers, middleware, composition root
│       ├── BookHaven.Application/   Use cases, ports, request/response contracts
│       ├── BookHaven.Domain/        Entities, enums, and business rules
│       ├── BookHaven.Persistence/   Database context, mappings, repositories
│       ├── BookHaven.Infrastructure/ External API and technical services
│       ├── BookHaven.Tests/         Focused unit tests; integration tests later
│       ├── BookHaven.slnx
│       ├── Directory.Build.props
│       ├── Directory.Packages.props
│       └── NuGet.Config
├── implementation.md               Living delivery plan and schema
└── README.md
```

### Backend dependency rules

```text
BookHaven.Domain       -> no project references
BookHaven.Application -> Domain
BookHaven.Persistence -> Application (and Domain transitively)
BookHaven.Infrastructure -> Application (and Domain transitively)
BookHaven.Api          -> Application + Persistence + Infrastructure
BookHaven.Tests        -> Application + Domain
```

## Technology

### Frontend

- React 19, Vite, and TypeScript
- React Router
- TanStack React Query and Axios
- Material UI and Tailwind CSS
- Fraunces headings and Inter body text

### Backend

- .NET 10 and ASP.NET Core controller-based Web API
- Central Package Management
- Nullable reference types and warnings as errors
- xUnit and coverlet for the later focused test suite
- Relational persistence through EF Core is planned; the provider is not yet
  selected

## Product scope

- Home page with library introduction and featured books
- Catalog with search, author/genre filtering, sorting, and pagination
- Dynamic book details at `/books/:id`
- My Library as the only saved-book collection
- `WantToRead`, `Reading`, and `Completed` statuses
- One personal review per saved book, with add/edit/delete operations
- Book add/edit forms for demonstrating `POST` and `PUT`
- About content and a custom 404 page

There is no separate Favorites model. Adding a book to My Library is the saved
book action. Authentication is intentionally out of scope; the browser keeps a
generated anonymous client ID in LocalStorage and sends it to the API.

## Getting started

### Prerequisites

- Node.js compatible with Vite 8
- npm
- .NET 10 SDK

### Frontend

```powershell
cd src/frontend
npm install
npm run dev
```

The Vite development server defaults to `http://localhost:5173`.

Useful checks:

```powershell
npm run lint
npm run build
```

### Backend

```powershell
cd src/backend
dotnet restore BookHaven.slnx
dotnet run --project BookHaven.Api/BookHaven.Api.csproj
```

The development profiles use `http://localhost:5261` and
`https://localhost:7070`.

Useful checks:

```powershell
dotnet build BookHaven.slnx --no-restore
dotnet test BookHaven.slnx --no-build
```

## Documentation

- [Implementation plan and proposed schema](implementation.md)
- [Frontend conventions](docs/conventions/fe-conventions.md)
- [Backend conventions](docs/conventions/be-conventions.md)
- [Combined frontend/backend architecture decision](docs/adr/0000-project-structure.md)

Update the implementation plan when work changes state, update a convention
when a repeatable rule changes, and update the ADR when an architectural choice
or its consequences change.
