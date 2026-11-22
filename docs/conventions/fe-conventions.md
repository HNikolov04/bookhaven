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
- The header shows a neutral default-person avatar at the top right.
- The clean profile dropdown displays email and a spaced Logout action.
- Desktop and mobile navigation use underline-only hover and active states.
- Never store passwords.

## Books and favourites

- Book cards use the API's picture URL, author, publish year, and favourite flag.
- Adding a favourite uses `POST /api/books/{id}/favourites`.
- My Library queries `GET /api/books?favouritesOnly=true`.
- Favourite and book mutations invalidate `['books']` query keys.
- The catalogue uses one responsive card grid; do not add a list-view toggle.
- Reviews are server-backed and displayed below the full book summary.
- Review forms contain only rating and text; identity comes from the JWT user.

## TypeScript and UI

- Strict TypeScript, no `any`, and named exports.
- One clear `h1` per page and labelled controls.
- Use MUI for controls/feedback and CSS/Tailwind for layout.
- Every CSS color custom property begins with `--ink-`.
- Keep the interface monochrome: white and neutral grays only, with restrained
  5 px corners. Do not use gradients or decorative accent colors.
- Center desktop navigation within the full-width header independently of the
  brand and profile controls.
- Keep filters in a white panel aligned with the catalogue card results.
- Prefer responsive image assets for editorial illustrations; do not construct
  detailed artwork from nested HTML or inline SVG shapes.
- Let filter panels size to their content instead of stretching to match result
  columns.

## Verification

```powershell
npm run lint
npm run build
```
