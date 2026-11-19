# BookHaven Frontend Conventions

This file contains reusable React rules. Keep progress in `implementation.md`
and architecture decisions in the combined ADR.

## Structure

Use feature-first folders:

```text
src/
  app/
  features/
    auth/
    books/
    home/
    library/
  shared/
```

- Feature-specific components, API functions, types, and hooks stay together.
- Move code to `shared` only when it is application-wide or used by multiple
  features.
- Pages compose hooks and components; they do not call Axios directly.

## HTTP and React Query

The frontend calls only the BookHaven API.

```text
component -> custom React Query hook -> feature API function -> Axios client
```

- Axios base URL comes from `VITE_API_BASE_URL`, with the local API as fallback.
- All HTTP calls use Axios and custom React Query hooks.
- Components never use `fetch` or import Axios.
- API response types use the `ApiDto` suffix where useful.
- Map API data into stable UI models before rendering.
- Query keys include all search, genre, sort, page, and page-size values.
- Mutations invalidate only affected keys.
- Loading, error, empty, and populated states are explicit.

## Authentication

- `/login` and `/register` are public routes.
- Store the returned JWT and user together under `bookhaven.auth.v1`.
- Attach the bearer token in the shared Axios request interceptor.
- `AuthProvider` owns current user, sign-in, and sign-out behavior.
- Do not decode the token for authorization decisions in the client; the API is
  authoritative.
- When global `401` handling is added, an expired or rejected token must clear
  the stored session and return the user to sign-in.
- Never store passwords.

## TypeScript and React

- Keep strict TypeScript enabled and do not use `any`.
- Use named exports.
- Components are functions and hooks start with `use`.
- Do not mirror props/query data into local state without a real editing need.
- Use controlled fields for login, registration, filters, and review forms.
- Use stable API GUIDs as list keys.
- Confirm destructive actions where accidental loss matters.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/books` | Catalog |
| `/books/:id` | Details |
| `/my-library` | Existing local library prototype |
| `/login` | Sign in |
| `/register` | Registration |
| `*` | Branded 404 |

The My Library prototype remains local until its final authenticated API model
is explicitly designed. Do not mix that prototype with book/review API DTOs.

## Styling

- Material UI supplies accessible controls and feedback.
- Tailwind/CSS supplies layout and responsive composition.
- Every CSS color variable starts with `--ink-`.
- Use orange, gray, white, and the existing light-blue background gradient.
- Use Fraunces for headings and Inter for body text.
- Keep corners restrained at approximately 5 px.
- Maintain the full-width header and centered copyright-only footer.

## Accessibility

- One `h1` per page and semantic landmarks.
- Inputs need visible labels; placeholders are not labels.
- Keep visible focus and keyboard submission.
- Error messages must be associated with the failed form/request.
- Touch targets should be at least 44 by 44 CSS pixels.
- Test representative 375, 768, 1024, and 1440 px widths.

## Quality checks

```powershell
npm run lint
npm run build
```

Later tests should focus on auth storage, bearer header attachment, form error
states, query parameter parsing, and API hook behavior with mocked responses.
