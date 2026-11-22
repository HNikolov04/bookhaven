# BookHaven

BookHaven is a university digital-library application built with React and a
.NET 10 Web API. The entire application requires an authenticated user. Users
can browse books, view reviews, save favourite books, and write one review per
book.

## Stack

- React, Vite, TypeScript, React Router, React Query, and Axios
- Material UI and Tailwind CSS
- ASP.NET Core 10, EF Core, and SQLite
- JWT bearer authentication with PBKDF2 password hashes
- xUnit unit tests

Registration requires the password twice. Matching is validated by both the
frontend and API before a user is created.

## Structure

```text
bookhaven/
|-- docs/
|   |-- adr/0000-project-structure.md
|   `-- conventions/
|       |-- be-conventions.md
|       `-- fe-conventions.md
|-- src/
|   |-- frontend/src/
|   |   |-- app/
|   |   |-- features/
|   |   `-- shared/
|   `-- backend/
|       |-- BookHaven.Api/
|       |-- BookHaven.Application/
|       |-- BookHaven.Domain/
|       |-- BookHaven.Persistence/
|       |-- BookHaven.Tests/
|       `-- BookHaven.slnx
`-- implementation.md
```

Backend dependencies point inward:

```text
Api -> Application -> Domain
Api -> Persistence -> Application -> Domain
```

There is no Infrastructure project, AutoMapper, MediatR, ASP.NET Identity, or
generic repository. DTOs and enums each have their own files. Mapping is manual
at every boundary. `BookService` is the single application service.

## Domain model

- A `Book` contains title, short and long descriptions, picture URL, pages,
  publish year, average stars, rating vote count, and featured state.
- A book has one `Author` and multiple enum genres through `BookGenre`.
- An author has a name and description.
- A review contains user, book, text, stars, and creation time.
- A user contains email and password hash; there is no username.
- Users and favourite books use the explicit `UserFavouriteBook` join entity.

## API

Book endpoints are protected by JWT.

| Method | Route | Action |
| --- | --- | --- |
| `GET` | `/api/books` | `GetAllBooks` |
| `GET` | `/api/books/{id}` | `GetBook` |
| `POST` | `/api/books/{id}/favourites` | Add favourite |
| `DELETE` | `/api/books/{id}/favourites` | Remove favourite |
| `POST` | `/api/books/{id}/reviews` | Add review |
| `PUT` | `/api/books/reviews/{reviewId}` | Edit own review |
| `DELETE` | `/api/books/reviews/{reviewId}` | Delete own review |
| `POST` | `/api/users/register` | Register |
| `POST` | `/api/users/login` | Login |

There are no add, update, or delete book endpoints.

The persistence layer seeds twelve catalogue books with Open Library cover URLs
when a new database is created. The catalogue UI supports title/author search,
genre filtering, sorting, a responsive card grid, and pagination. Book details include
ratings, metadata, favourites, and user-owned review management.

The catalog accepts `search`, `genre`, `sort`, `isFeatured`, `favouritesOnly`,
`page`, and `pageSize`.

## Run locally

From VS Code, run the `BookHaven: Start Full Stack` task. It starts the React
frontend and ASP.NET Core API in parallel, then opens Swagger UI.

Backend:

```powershell
cd src/backend
dotnet restore BookHaven.slnx
dotnet run --project BookHaven.Api/BookHaven.Api.csproj --launch-profile https
```

Frontend:

```powershell
cd src/frontend
npm install
npm run dev
```

The API listens on `http://localhost:5000` and `https://localhost:7000`.
IIS Express uses HTTPS port `44300`. Swagger UI is available at `/swagger`, and
the frontend defaults to `http://localhost:5173`. Override the frontend API URL
with `VITE_API_BASE_URL`.

## Verification

```powershell
cd src/backend
dotnet build BookHaven.slnx --no-restore
dotnet test BookHaven.slnx --no-build

cd ../frontend
npm run lint
npm run build
```

## Documentation

- [Implementation status](implementation.md)
- [Backend conventions](docs/conventions/be-conventions.md)
- [Frontend conventions](docs/conventions/fe-conventions.md)
- [Architecture decision](docs/adr/0000-project-structure.md)
