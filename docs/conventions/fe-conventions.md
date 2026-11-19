# BookHaven Frontend Conventions

## Structure and HTTP

- Keep feature code under `features/auth`, `features/books`, and
  `features/library`.
- Components never call Axios directly.
- HTTP flow is component -> custom React Query hook -> API function -> shared
  Axios client.
- The Axios interceptor attaches JWT and clears auth after `401`.
- Server data belongs to React Query, not LocalStorage.

## Authentication and routing

- `/login` and `/register` are the only public routes.
- Public auth pages do not render the application header or footer.
- Auth body is centered and shows `Powered by BookHaven` at the page bottom.
- `ProtectedRoute` guards the entire application layout.
- Store JWT and email-only user under `bookhaven.auth.v1`.
- The header shows a small profile avatar at the top right.
- The profile dropdown displays email and a Logout action.
- Never store passwords.

## Books and favourites

- Book cards use the API's picture URL, author, publish year, and favourite flag.
- Adding a favourite uses `POST /api/books/{id}/favourites`.
- My Library queries `GET /api/books?favouritesOnly=true`.
- Favourite and book mutations invalidate `['books']` query keys.

## TypeScript and UI

- Strict TypeScript, no `any`, and named exports.
- One clear `h1` per page and labelled controls.
- Use MUI for controls/feedback and CSS/Tailwind for layout.
- Every CSS color custom property begins with `--ink-`.
- Keep orange, gray, white, the light-blue gradient, and restrained 5 px corners.

## Verification

```powershell
npm run lint
npm run build
```
