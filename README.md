# BookHaven

BookHaven is a university digital-library application built with React and a
.NET 10 Web API. Users can browse books, register or sign in, and write personal
reviews. The project intentionally uses a small layered architecture that is
easy to explain during coursework defense.

## Stack

- React, Vite, and TypeScript
- React Router, TanStack React Query, and Axios
- Material UI and Tailwind CSS
- ASP.NET Core 10 controller API
- Entity Framework Core with SQLite
- JWT bearer authentication

## Structure

```text
bookhaven/
├── docs/
│   ├── adr/0000-project-structure.md
│   └── conventions/
│       ├── be-conventions.md
│       └── fe-conventions.md
├── src/
│   ├── frontend/
│   │   └── src/
│   │       ├── app/
│   │       ├── features/
│   │       └── shared/
│   └── backend/
│       ├── BookHaven.Api/          Controller, ApiDtos, JWT, Program.cs
│       ├── BookHaven.Application/  Service, interfaces, DTOs, mapping
│       ├── BookHaven.Domain/       Entities, navigation properties, enums
│       ├── BookHaven.Persistence/  DbContext, repositories, EF configurations
│       ├── BookHaven.Tests/
│       └── BookHaven.slnx
└── implementation.md
```

The backend dependency flow is deliberately simple:

```text
Api -> Application -> Domain
Api -> Persistence -> Application -> Domain
```

There is no Infrastructure project, AutoMapper, MediatR, ASP.NET Identity, or
generic repository. `BookHavenService` contains the application behavior and
`BookHavenController` contains all HTTP endpoints.

## Data model

- `Book` has one `Genre` enum value, many authors through `BookAuthor`, and many
  reviews.
- `Author` has navigation properties back to its book joins.
- `User` has a password hash and reviews.
- `Review` belongs to one book and one user.
- A user can write only one review for a book.

DTOs are explicit at each boundary:

```text
ApiDto -> Application DTO -> Repository DTO -> Entity
Entity -> Repository DTO -> Application DTO -> ApiDto
```

All mapping is handwritten.

## API

| Method | Route | Authentication |
| --- | --- | --- |
| `GET` | `/api/books` | Public |
| `GET` | `/api/books/{id}` | Public |
| `POST` | `/api/books` | JWT |
| `PUT` | `/api/books/{id}` | JWT |
| `DELETE` | `/api/books/{id}` | JWT |
| `POST` | `/api/books/{bookId}/reviews` | JWT |
| `PUT` | `/api/reviews/{reviewId}` | JWT owner |
| `DELETE` | `/api/reviews/{reviewId}` | JWT owner |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |

The catalog accepts `search`, `genre`, `sort`, `isFeatured`, `page`, and
`pageSize` query parameters.

## Run locally

### Backend

```powershell
cd src/backend
dotnet restore BookHaven.slnx
dotnet run --project BookHaven.Api/BookHaven.Api.csproj
```

The development API runs at `http://localhost:5261`. SQLite creates the ignored
`bookhaven.db` file automatically. The JWT key in `appsettings.Development.json` is a
development-only value and must be replaced by environment configuration for a
real deployment.

### Frontend

```powershell
cd src/frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:5173` and calls
`http://localhost:5261/api`. Override the API with `VITE_API_BASE_URL`.

### Checks

```powershell
cd src/backend
dotnet build BookHaven.slnx --no-restore

cd ../frontend
npm run lint
npm run build
```

## Documentation

- [Implementation status](implementation.md)
- [Backend conventions](docs/conventions/be-conventions.md)
- [Frontend conventions](docs/conventions/fe-conventions.md)
- [Combined architecture decision](docs/adr/0000-project-structure.md)
