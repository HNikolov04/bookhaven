# BookHaven Frontend Conventions

## Structure and HTTP

- Keep feature code under `features/auth`, `features/books`, and
  `features/library`.
- Components never call Axios directly.
- HTTP flow is component -> custom React Query hook -> API function -> shared
  Axios client.
- Keep React Query keys in the feature-level `bookQueryKeys` factory. Mutations
  invalidate through that factory rather than repeating string arrays.
- The Axios interceptor attaches JWT and clears auth after `401`.
- Server data belongs to React Query, not LocalStorage.
- Consume an API DTO directly when it already matches the view model. Add a
  mapper only when it performs a real boundary transformation.
- Every mutation exposes a pending state and a visible, user-friendly failure
  message; logging alone is not error handling.

## Authentication and routing

- `/login` and `/register` are the only public routes.
- Public auth pages do not render the application header or footer.
- Auth body is centered and shows `Powered by BookHaven` at the page bottom.
- `ProtectedRoute` guards the entire application layout.
- Store JWT and email-only user under `bookhaven.auth.v1`.
- The header shows a neutral default-person avatar at the top right.
- The profile control does not move on hover.
- The clean profile dropdown displays email and a spaced Logout action.
- Desktop and mobile navigation use underline-only hover and active states.
- Never store passwords.

## Books and favourites

- Book cards use the API's picture URL, author, publish year, and favourite flag.
- Adding a favourite uses `POST /api/books/{id}/favourites`.
- My Library queries `GET /api/books?favouritesOnly=true` with URL-backed
  server pagination.
- Favourite and review mutations invalidate the relevant entries through
  `bookQueryKeys`.
- The catalogue uses one responsive card grid; do not add a list-view toggle.
- Reviews are server-backed and displayed below the full book summary.
- Review forms contain only rating and text; identity comes from the JWT user.
- The reviews-section action always starts a blank new review. Edit/Delete
  actions target the individual review card, and a user may add multiple
  reviews for the same book.
- Display `0.0 / 5` and `0 ratings` until a BookHaven user submits a review;
  never substitute ratings from an external catalogue.
- Treat API `Guid` identifiers as opaque strings in TypeScript and URLs.

## TypeScript and UI

- Strict TypeScript, no `any`, and named exports.
- Extract a feature component when it owns a cohesive responsibility or
  substantially simplifies a route. Do not create one-file abstractions for
  fragments that have no reuse, state, or independent responsibility.
- One clear `h1` per page and labelled controls.
- Use MUI as the only component library. Use Tailwind/CSS for responsive layout
  and project-specific styling.
- Every CSS color custom property begins with `--ink-`.
- Use the default MUI/system typography stack. Do not install or import custom
  web fonts.
- Keep white and neutral gray as the foundation, with black interaction states,
  red favourite hearts, and gold rating stars.
- Regular action buttons use a black background and retain the same color on
  hover; hover feedback is limited to a small upward movement. Text-only
  secondary actions such as Cancel are the explicit exception.
- Keep restrained 5 px corners and do not use gradients.
- Center desktop navigation within the full-width header independently of the
  brand and profile controls.
- Keep filters in a white panel aligned with the catalogue card results.
- Prefer responsive color image assets for editorial illustrations; do not
  construct detailed artwork from nested HTML or inline SVG shapes.
- Use the supplied coffee artwork as the home hero background and the supplied
  cat artwork as the 404 background rather than separate foreground images.
- Let filter panels size to their content instead of stretching to match result
  columns.
- Keep editorial-image motion subtle and disable it for reduced-motion users.
- Make the entire book card the details link while keeping its favourite button
  as a separate action above the link layer.
- Keep details breadcrumbs keyboard accessible and include a back-to-catalogue
  control before the breadcrumb trail.
- The details favourite control is a large standalone red heart, not an
  "Add to My Library" text button.
- Keep the catalogue search field text-only; do not add a magnifying-glass
  adornment.

## Verification

```powershell
npm run lint
npm run build
```
