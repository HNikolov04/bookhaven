# BookHaven Frontend Conventions

This document is the shared source of truth for implementation conventions in
BookHaven. Update it when the team adopts a repeatable rule. Record one-off or
architecturally significant frontend/backend decisions together in
`docs/adr/0000-project-structure.md` instead.

## 1. Product boundaries

- BookHaven is the React client of the BookHaven ASP.NET Core API.
- The BookHaven API is the frontend's only remote data source. Open Library is
  accessed by the backend when external data is needed.
- My Library membership, reading status, and personal reviews are server state
  scoped by an anonymous browser client ID.
- There is no login or authentication flow. LocalStorage persists only the
  generated client ID and explicitly approved UI preferences.
- Prefer code that is easy to demonstrate and explain over abstractions that are
  only justified by hypothetical future requirements.
- Every page must handle loading, error, empty, and populated states where those
  states apply.

## 2. Source layout

Use a feature-first structure with a small shared application layer:

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  features/
    home/
      HomePage.tsx
      HeroSection.tsx
      FeaturedBooks.tsx
    books/
      CatalogPage.tsx
      BookDetailsPage.tsx
      BookFilters.tsx
      api/
      hooks/
      types.ts
    library/
      MyLibraryPage.tsx
      ReviewForm.tsx
      ReadingStatus.tsx
      useMyLibrary.ts
  shared/
    components/
    layouts/
    hooks/
    api/
    styles/
      globals.css
      theme.ts
    utils/
  main.tsx
```

Rules:

- Keep feature-specific code inside its feature.
- Move code to `shared/` only after it is genuinely shared by at least two
  features or is application-wide infrastructure.
- Pages compose features and layout; they do not contain HTTP or storage logic.
- Do not create barrel `index.ts` files unless they provide a deliberate public
  API for a feature. Importing directly keeps dependencies visible.
- Avoid catch-all files such as `utils.ts`, `helpers.ts`, and `types.ts` when a
  more specific name is possible.

## 3. Naming and files

| Item | Convention | Example |
| --- | --- | --- |
| React component/page | PascalCase file and export | `BookCard.tsx` |
| Hook | camelCase beginning with `use` | `useBooksQuery.ts` |
| Non-React module | camelCase | `bookMapper.ts` |
| Type/interface | PascalCase | `BookSummary` |
| Constant | `UPPER_SNAKE_CASE` | `BOOKS_PAGE_SIZE` |
| Boolean | `is`, `has`, `can`, or `should` prefix | `isInLibrary` |
| Event handler prop | `on...` | `onStatusChange` |
| Internal event handler | `handle...` | `handleStatusChange` |
| CSS class | Tailwind utility or kebab-case custom class | `book-card` |

- Use named exports for application modules. A route lazy-loading constraint is
  an acceptable reason for a default export.
- Name query hooks with the `Query` suffix and local data hooks after the user
  action/domain, for example `useBookDetailsQuery` and `useMyLibrary`.
- Use the API's `Guid` book ID as the canonical `bookId`. Treat an Open Library
  work ID as optional metadata, never as the application route key.

## 4. TypeScript

- Keep TypeScript strict; do not weaken compiler settings to make an error pass.
- Do not use `any`. Use `unknown` at untrusted boundaries and narrow it.
- API transport types and UI domain types are different types.
- Validate and normalize API responses at the feature boundary when needed.
  Components consume predictable frontend models and must not depend on
  database entities or upstream Open Library field names.
- Prefer unions for finite states:

```ts
export type ReadingStatus = 'want-to-read' | 'reading' | 'completed';
```

- Prefer `type` for unions and composed shapes. Use `interface` when extension
  or declaration merging is intentional.
- Use `satisfies` for configuration objects when it preserves useful inference.
- Avoid non-null assertions. Handle missing remote data with an explicit
  fallback or state.
- API dates use ISO 8601 strings. Display dates through a formatter; do not
  format them at transport boundaries.

## 5. React

- Components are functions and should stay focused on rendering and interaction.
- Keep derived values derived; do not mirror props or query data in state.
- Use controlled inputs for forms and filters.
- Prefer composition over large components with many conditional branches.
- Custom hooks own reusable behavior. They must not hide unrelated UI markup.
- Do not call hooks conditionally.
- Do not use an effect to compute values that can be computed during render.
- Effects are reserved for synchronization with systems outside React.
- Use stable API book IDs as list keys; never use an array index for a list that
  can change order.
- Show destructive actions such as deleting a review with a confirmation step.

## 6. Routing and URL state

Routes:

| Path | Page |
| --- | --- |
| `/` | Home |
| `/books` | Catalog |
| `/books/:id` | Book details |
| `/my-library` | My Library |
| `*` | Not found |

- Define route paths in one router module.
- Navigation uses React Router links, never plain anchors for internal routes.
- The catalog's shareable state belongs in search parameters: `q`, `searchBy`,
  `genre`, `sort`, and `page`.
- Omit search parameters that have their default value.
- Parse and validate all search parameters. Invalid values fall back to defaults.
- A change to query, search field, genre, or sort resets `page` to `1`.
- Debounce only the text search value (target: 300-400 ms), not selects or
  pagination.
- The details route receives the API book GUID. Validate its shape before
  requesting data; invalid or missing books render a useful not-found state.
- Restore focus or move focus to the main heading after route changes where
  needed for keyboard and screen-reader users.

## 7. Remote data: Axios and React Query

### Boundary

All HTTP requests must be made by the configured Axios client through feature
API functions called by custom React Query hooks. Components must never import
Axios, call `fetch`, or assemble API URLs.

```text
component -> custom query hook -> feature API function -> Axios client -> API
                                      |
                                      +-> transport type -> mapper -> domain type
```

- Development base URL: `http://localhost:5261/api`, supplied through a
  `VITE_API_BASE_URL` environment variable or Vite proxy configuration.
- The API returns a complete optional `coverUrl`; components never assemble an
  Open Library cover URL.
- Use HTTPS outside local development.
- The Axios client owns base configuration and response/error normalization.
- API modules own endpoint paths and request/response transport types.
- Query hooks own query keys, enablement, stale time, and calls to API modules.
- Mapper modules convert API responses into frontend models when the shapes
  intentionally differ.
- Send only supported query parameters; never mirror the whole filter object
  blindly into an Axios request.
- Do not retry a confirmed `404`. Keep retries low for other failures.
- React Query caching and debounced searches reduce unnecessary API work and
  keep the interface responsive.

### Planned API usage

| Use case | Endpoint/strategy |
| --- | --- |
| Catalog search | `GET /api/books` with search, author, genre, sort, page, and page size |
| Featured books | `GET /api/books?isFeatured=true` with a small page size |
| Book details | `GET /api/books/{bookId}` |
| Book form | `POST /api/books` and `PUT /api/books/{bookId}` |
| My Library | `GET`, `POST`, `PUT`, and `DELETE` under `/api/library` |
| Personal review | `POST`, `PUT`, and `DELETE` under `/api/library/{bookId}/review` |

The BookHaven API uses one-based pages. Store the UI page as one-based too, so
no conversion is scattered across components.

### Query keys

Query keys are created by feature key factories and include every value that
changes the response:

```ts
export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (params: BookSearchParams) => [...bookKeys.lists(), params] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (bookId: string) => [...bookKeys.details(), bookId] as const,
};
```

- Query parameter objects must contain normalized primitives with stable values.
- Use `enabled` for queries that require a validated ID or non-empty input.
- Use `placeholderData` intentionally when retaining the previous catalog page
  improves pagination; expose that transitional state in the UI.
- Mutations invalidate only affected remote query keys. For example, updating a
  review invalidates that library entry and the library list, not every book.

### Remote errors

- Convert Axios errors into a small application error shape with a user-safe
  message and optional status code.
- User messages state what failed and offer a retry where retrying can help.
- Log diagnostic detail only in development; do not expose raw response objects.
- A missing cover, author, year, or description is incomplete data, not a failed
  page. Render the agreed fallback text or artwork.

### Anonymous client header

- Generate one GUID on first use and persist it under
  `bookhaven.client-id.v1`.
- Send it as `X-BookHaven-Client-Id` for My Library and review requests.
- Treat it as a scope key, not a credential. Never display it or claim that it
  provides authentication.
- Keep header attachment in the configured Axios client/interceptor, not in
  individual components.

## 8. Local user data

LocalStorage is used for the anonymous client ID and approved presentation
preferences only. Books, library entries, statuses, and reviews are server
state handled by React Query mutations and queries.

Storage keys are versioned and namespaced:

```text
bookhaven.client-id.v1
```

- Generate the ID once with `crypto.randomUUID()` and validate a stored value
  before reusing it.
- If the stored ID is missing or malformed, replace it with a new one.
- Storage writes are immutable and centralized.
- Keep state synchronized across tabs using the browser `storage` event.
- Do not persist transient UI state such as dialogs, search input, or loading.
- Do not cache API response objects in LocalStorage. React Query owns the
  in-memory server-state cache.

## 9. Styling and design system

### Responsibility split

- Material UI supplies accessible interactive primitives and complex controls.
- Tailwind supplies page layout, spacing, responsive composition, and small
  utility styling.
- Shared CSS files define fonts, reset/base rules, gradients, and design tokens.
- Do not build the same element half in `sx` and half in Tailwind without a clear
  reason. Prefer Tailwind for layout and the MUI theme/component variants for
  MUI internals.
- Use at least three visibly distinct MUI component types. The expected baseline
  is `Button`, `TextField`, `Select`, `Pagination`, `Chip`, `Dialog`, and
  `Skeleton` as appropriate.

### Brand tokens

Every CSS custom property whose value is a color must start with `--ink-`.
Spacing, radius, and other non-color properties do not use the `--ink-` prefix.

```css
:root {
  --ink-primary: #454545;
  --ink-accent: #ed6b3a;
  --ink-background: #ffffff;
  --ink-background-soft: #f4f4f4;
  --ink-surface: #ffffff;
  --ink-text: #252525;
  --ink-text-muted: #6a6a6a;
  --ink-border: #c7c7c7;
  --ink-focus: #454545;
  --card-radius: 5px;
}
```

- Do not introduce color literals inside components. Add a semantic token first.
- The application background is a white-to-light-blue linear gradient.
- Headings `h1`-`h3` use Fraunces; body copy and controls use Inter.
- Prefer self-hosted `@fontsource` packages so typography does not depend on a
  runtime font request.
- Cards and controls use a restrained `5px` radius; large pill-shaped containers
  are avoided unless the element is inherently circular.
- Primary actions use orange; navigation, borders, and strong text use neutral
  charcoal and gray.
- A component may use the accent as a highlight, but never rely on color alone to
  communicate status or selection.
- Reuse existing BookHaven logo assets when present. Do not redraw or replace a
  supplied brand asset without a recorded decision.

### Responsive conventions

- Design mobile first.
- Align Tailwind and MUI breakpoints to one scale: `sm 600`, `md 900`, `lg 1200`,
  `xl 1536` pixels.
- Test at representative widths around 375, 768, 1024, and 1440 pixels.
- No horizontal page scrolling at supported widths.
- Touch targets should be at least 44 by 44 CSS pixels.
- Catalog filters collapse into a mobile-friendly layout without hiding core
  functionality.

## 10. Accessibility and content

- Use semantic landmarks: `header`, `nav`, `main`, `section`, and `footer`.
- Every page has one clear `h1`; headings do not skip levels for visual reasons.
- All controls have programmatic labels. Placeholder text is not a label.
- Every meaningful image has descriptive alt text; decorative images have an
  empty alt attribute.
- Use visible focus styles and preserve keyboard operation for all interactions.
- Announce significant async results/errors with an appropriate live region.
- Loading skeletons do not replace the page heading or trap focus.
- Honor `prefers-reduced-motion` for non-essential animation.
- Meet WCAG AA contrast for normal text and controls.
- Empty states explain the next useful action, such as browsing the catalog.
- Use the product name `BookHaven` and tagline
  `Your digital library for every reader.` exactly.

## 11. Forms and validation

- Trim user-entered review text before validation and persistence.
- Reviews require a rating and non-empty text; define a modest maximum length and
  display the remaining/used character count.
- Validation messages appear next to the relevant input and are understandable
  without technical knowledge.
- Disable only the action that cannot currently proceed; do not unnecessarily
  disable the entire page.
- A form submit works from the keyboard and does not rely on a click handler.

## 12. Testing and quality gates

Testing should prioritize behavior that carries product risk:

- API response mapping with missing optional book fields.
- Catalog URL parameter parsing and query construction.
- Query hooks with mocked HTTP responses.
- Anonymous client ID creation, validation, and header attachment.
- My Library queries/mutations, reading-status transitions, and review CRUD.
- Route rendering, including invalid detail IDs and the wildcard 404.
- A representative responsive and keyboard-accessibility pass.

Before considering a change complete:

1. Type checking passes.
2. Linting passes.
3. Relevant tests pass.
4. Production build passes.
5. The changed UI is checked at mobile and desktop widths.
6. Loading, error, empty, and keyboard states have been considered.

Do not suppress a lint or type error without a short code comment explaining why
the exception is safe and necessary.

## 13. Git and documentation

- Keep commits focused and describe intent, not file operations.
- Do not commit `.env` files, generated build output, or local editor state.
- Public environment variables use Vite's `VITE_` prefix and contain no secrets.
  A frontend application cannot keep secrets.
- Update the root `implementation.md` as work moves between planned, in progress,
  blocked, and complete.
- Update this file only for a reusable convention.
- Add an ADR when a decision has meaningful alternatives or long-term
  consequences. Use the next numeric filename in `docs/adr/`.

## 14. Updating this document

When adding a convention:

1. State the rule in testable language.
2. Include a brief example when the rule is easy to misread.
3. Avoid duplicating tool documentation.
4. Note exceptions explicitly.
5. Change existing code or create a follow-up item in
   `implementation.md` so the documentation and code do not drift.
