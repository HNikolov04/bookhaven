# BookHaven Implementation Status

- **Last updated:** 2026-11-23
- **Phase:** Functional polish and code-quality hardening

This file tracks current implementation state. Architecture rationale belongs
in the ADR, and coding rules belong in the convention documents.

## Frontend

- [x] Public login and registration with matching-password validation
- [x] JWT session provider, versioned storage, automatic `401` sign-out
- [x] Protected application layout with responsive header, profile menu, footer
- [x] Home page with responsive supplied artwork and featured books
- [x] Catalogue search, genre filter, sorting, and URL-backed pagination
- [x] Responsive book cards with whole-card details navigation
- [x] Dynamic `/books/:id` details page with back navigation and breadcrumbs
- [x] Red favourite controls backed by authenticated API mutations
- [x] Paginated My Library page backed by server favourites
- [x] Review summary, distribution, list, and add/edit/delete dialog
- [x] Multiple independently editable reviews per user and book
- [x] Loading, error, empty, pending-mutation, and custom 404 states
- [x] MUI controls, Tailwind build pipeline, responsive project styling
- [x] Centralized book query keys, genres, labels, and sort options
- [x] HTTP isolated behind Axios API functions and React Query hooks
- [x] Removed unused LocalStorage abstraction, identity mapper/API alias,
  duplicate artwork, dead CSS, and starter configuration comments

## Backend

- [x] Domain, Application, Persistence, Api, and Tests projects
- [x] GUID entities for books, authors, users, and reviews
- [x] Multiple enum genres through `BookGenre`
- [x] Explicit favourite join entity and review ownership
- [x] One EF Core configuration file per entity
- [x] PostgreSQL-only persistence through Npgsql
- [x] Deterministic twelve-book seed with BookHaven-only rating totals
- [x] Read-only book catalogue with search, filter, sort, and pagination
- [x] Favourite and review commands with authorization checks
- [x] PBKDF2 registration/login and two-hour JWT issuance
- [x] JWT service and typed options in Application
- [x] Manual Api/Application/Repository/Entity DTO mapping
- [x] Minimal `Program.cs` with focused registration/configuration extensions
- [x] Swagger and configured HTTP, HTTPS, and IIS Express launch profiles
- [x] Central package management and warnings-as-errors builds
- [x] Removed SQLite and unused EF Core design-time dependency

## Verification

- [x] Backend Release build: 0 warnings, 0 errors
- [x] Backend unit tests: 8 passed, 0 failed
- [x] Frontend ESLint: passed
- [x] Frontend production build: passed
- [x] Static audit found no unused custom CSS selectors or stale imports

## Remaining work

- [ ] Add focused frontend component tests at the end of the project
- [ ] Replace the development JWT signing key for deployment
- [ ] Introduce EF Core migrations when deployment needs schema history
- [ ] Split the global stylesheet by feature if its size begins to slow changes
