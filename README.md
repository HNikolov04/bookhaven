# BookHaven

BookHaven is a responsive, authenticated digital-library application created
for university Web Design coursework. It has a React frontend and a .NET 10
Web API backed by PostgreSQL. Users can browse and filter a seeded catalogue,
save books to My Library, and add, edit, or delete their own reviews.

## Features

- Login and registration with password confirmation
- Protected home, catalogue, book-details, and My Library routes
- Title/author search, genre filtering, sorting, and server pagination
- GUID-based dynamic book routes at `/books/:id`
- Server-backed favourites and user-owned reviews
- Rating summaries calculated only from BookHaven reviews
- Responsive loading, error, empty, and 404 states
- Swagger UI for local API discovery

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, React Router |
| Data access | TanStack React Query, Axios |
| UI | Material UI, Tailwind CSS pipeline, project CSS |
| Backend | ASP.NET Core 10, EF Core 10 |
| Database | PostgreSQL through Npgsql |
| Authentication | JWT bearer tokens, PBKDF2 password hashes |
| Tests | xUnit |

## Architecture

```text
bookhaven/
|-- .vscode/                 Full-stack tasks and API debugging
|-- docs/
|   |-- adr/                 Accepted architecture decisions
|   `-- conventions/         Frontend and backend working rules
|-- src/
|   |-- frontend/
|   |   `-- src/
|   |       |-- app/         Application composition and router
|   |       |-- features/    Auth, books, home, and library features
|   |       `-- shared/      API client, reusable UI, layout, and styles
|   `-- backend/
|       |-- BookHaven.Api/          HTTP boundary and composition root
|       |-- BookHaven.Application/  Use cases, DTOs, mapping, contracts
|       |-- BookHaven.Domain/       Entities and domain enums
|       |-- BookHaven.Persistence/  EF Core, repositories, configuration
|       |-- BookHaven.Tests/        Application-service unit tests
|       `-- BookHaven.slnx
`-- implementation.md        Current implementation status
```

Backend project dependencies point inward:

```text
Api ------------> Application -> Domain
  `-> Persistence -----^--------> Domain
```

The frontend HTTP path is:

```text
Component -> React Query hook -> API function -> shared Axios client -> API
```

The design intentionally avoids an Infrastructure project, generic repository,
AutoMapper, MediatR, ASP.NET Core Identity, and runtime catalogue API calls to
Open Library.
DTO mapping at backend boundaries is handwritten. Catalogue records and cover
URLs are seeded locally; the API does not fetch catalogue data from Open
Library. Cover images are still hosted by Open Library and require network
access to render.

## Prerequisites

- Node.js with npm
- .NET 10 SDK
- PostgreSQL running locally or reachable over the network
- Network access when externally hosted book covers should be displayed
- Optional: VS Code with the C# debugger

## Local configuration

Create an empty PostgreSQL database named `bookhaven`, then store its connection
string outside source control with .NET user secrets:

```powershell
cd src/backend
dotnet user-secrets set --project BookHaven.Api `
  "ConnectionStrings:BookHaven" `
  "Host=localhost;Port=5432;Database=bookhaven;Username=postgres;Password=YOUR_PASSWORD"
```

Development JWT configuration is in `appsettings.Development.json`. Use secret
or environment configuration for any deployed signing key. The database
connection can alternatively be supplied as:

```text
ConnectionStrings__BookHaven=Host=...;Port=5432;Database=bookhaven;Username=...;Password=...
```

The frontend uses `http://localhost:5000/api` by default. Override it with
`VITE_API_BASE_URL` when the API is hosted elsewhere.

## Run

The easiest option is the VS Code task `BookHaven: Start Full Stack`. It starts
both applications and opens Swagger when the API is ready.

Run the applications separately when needed:

```powershell
# API
cd src/backend
dotnet restore BookHaven.slnx
dotnet run --project BookHaven.Api/BookHaven.Api.csproj --launch-profile https

# Frontend (from another terminal)
cd src/frontend
npm install
npm run dev
```

Local addresses:

| Service | Address |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API HTTP | `http://localhost:5000` |
| API HTTPS | `https://localhost:7000` |
| Swagger | `http://localhost:5000/swagger` |
| IIS Express HTTPS | `https://localhost:44300` |

On first API startup, EF Core creates the schema and the deterministic catalogue
seed is applied. Existing user data is preserved on later starts.

## API surface

All book routes require a bearer token. Registration and login are public.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/books` | Search, filter, sort, and page books |
| `GET` | `/api/books/{id}` | Get one book |
| `POST` | `/api/books/{id}/favourites` | Add a book to My Library |
| `DELETE` | `/api/books/{id}/favourites` | Remove a book from My Library |
| `POST` | `/api/books/{id}/reviews` | Add a review |
| `PUT` | `/api/books/reviews/{reviewId}` | Edit an owned review |
| `DELETE` | `/api/books/reviews/{reviewId}` | Delete an owned review |
| `POST` | `/api/users/register` | Create an account |
| `POST` | `/api/users/login` | Receive a JWT |

`GET /api/books` accepts `search`, `genre`, `sort`, `isFeatured`,
`favouritesOnly`, `page`, and `pageSize`. The API intentionally has no book
create, update, or delete endpoints.

## Verify

```powershell
# Backend
cd src/backend
dotnet build BookHaven.slnx
dotnet test BookHaven.slnx --no-build

# Frontend
cd ../frontend
npm run lint
npm run build
```

## Project documentation

- [Architecture decision](docs/adr/0000-project-structure.md)
- [Backend conventions](docs/conventions/be-conventions.md)
- [Frontend conventions](docs/conventions/fe-conventions.md)
- [Implementation status](implementation.md)
