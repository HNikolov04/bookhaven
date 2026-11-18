# BookHaven Engineering Conventions

This document is the shared source of truth for implementation conventions in
BookHaven. Update it when the team adopts a repeatable rule. Record one-off or
architecturally significant decisions in `docs/adr/` instead.

## 1. Product boundaries

- BookHaven is a frontend-only university coursework application.
- Open Library is the only remote book-data source.
- Favorites, reading status, and personal reviews belong to the current browser
  and are persisted in LocalStorage.
- There is no authentication, backend, database, or simulated server.
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
    favorites/
      FavoritesPage.tsx
      useFavorites.ts
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
| Boolean | `is`, `has`, `can`, or `should` prefix | `isFavorite` |
| Event handler prop | `on...` | `onStatusChange` |
| Internal event handler | `handle...` | `handleStatusChange` |
| CSS class | Tailwind utility or kebab-case custom class | `book-card` |

- Use named exports for application modules. A route lazy-loading constraint is
  an acceptable reason for a default export.
- Name query hooks with the `Query` suffix and local data hooks after the user
  action/domain, for example `useBookDetailsQuery` and `useFavorites`.
- Use the Open Library work ID without `/works/` as the canonical `bookId`, for
  example `OL45804W`.

## 4. TypeScript

- Keep TypeScript strict; do not weaken compiler settings to make an error pass.
- Do not use `any`. Use `unknown` at untrusted boundaries and narrow it.
- API transport types and UI domain types are different types.
- Normalize optional Open Library fields once in mapper functions. Components
  consume predictable domain models and should not know API field names such as
  `cover_i` or `author_name`.
- Prefer unions for finite states:

```ts
export type ReadingStatus = 'want-to-read' | 'reading' | 'completed';
```

- Prefer `type` for unions and composed shapes. Use `interface` when extension
  or declaration merging is intentional.
- Use `satisfies` for configuration objects when it preserves useful inference.
- Avoid non-null assertions. Handle missing remote data with an explicit
  fallback or state.
- Dates stored locally use ISO 8601 strings. Display dates through a formatter;
  do not format them at persistence boundaries.

## 5. React

- Components are functions and should stay focused on rendering and interaction.
- Keep derived values derived; do not mirror props or query data in state.
- Use controlled inputs for forms and filters.
- Prefer composition over large components with many conditional branches.
- Custom hooks own reusable behavior. They must not hide unrelated UI markup.
- Do not call hooks conditionally.
- Do not use an effect to compute values that can be computed during render.
- Effects are reserved for synchronization with systems outside React.
- Use stable Open Library work IDs as list keys; never use an array index for a
  list that can change order.
- Show destructive actions such as deleting a review with a confirmation step.

## 6. Routing and URL state

Routes:

| Path | Page |
| --- | --- |
| `/` | Home |
| `/books` | Catalog |
| `/books/:id` | Book details |
| `/favorites` | Favorites |
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
- The details route receives a plain work ID. Validate the `OL...W` shape before
  requesting data; invalid or missing works render a useful not-found state.
- Restore focus or move focus to the main heading after route changes where
  needed for keyboard and screen-reader users.

## 7. Remote data: Axios and React Query

### Boundary

All HTTP requests must be made by the configured Axios client from inside custom
React Query hooks. Components must never import Axios, call `fetch`, or assemble
Open Library URLs.

```text
component -> custom query hook -> feature API function -> Axios client -> API
                                      |
                                      +-> transport type -> mapper -> domain type
```

- Base URL: `https://openlibrary.org`.
- Cover URLs are built by one helper using
  `https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg?default=false`.
- Use HTTPS only.
- The Axios client owns base configuration and response/error normalization.
- API modules own endpoint paths and request/response transport types.
- Query hooks own query keys, enablement, stale time, and calls to API modules.
- Mapper modules convert API shapes into the app's domain models.
- Request only the Search API fields the UI uses; never request `fields=*`.
- Do not retry a confirmed `404`. Keep retries low for other failures.
- React Query caching and debounced searches are part of API politeness, not just
  performance optimizations.

### Planned API usage

| Use case | Endpoint/strategy |
| --- | --- |
| Catalog search | `GET /search.json` with explicit `fields`, `page`, and `limit` |
| Genre browse/filter | Search query constrained by subject; keep genre slugs in app configuration |
| Book details | `GET /works/{workId}.json` plus an exact Search API lookup for normalized author/cover metadata |
| Covers | Cover ID URL from the Covers API with a local visual fallback |
| Featured books | A small, deterministic subject/search query cached with a longer stale time |

The Search API supports one-based `page` pagination. Store the UI page as
one-based too, so no conversion is scattered across components.

### Query keys

Query keys are created by feature key factories and include every value that
changes the response:

```ts
export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (params: BookSearchParams) => [...bookKeys.lists(), params] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (workId: string) => [...bookKeys.details(), workId] as const,
};
```

- Query parameter objects must contain normalized primitives with stable values.
- Use `enabled` for queries that require a validated ID or non-empty input.
- Use `placeholderData` intentionally when retaining the previous catalog page
  improves pagination; expose that transitional state in the UI.
- Query invalidation is for remote server state. Do not invalidate queries for a
  LocalStorage update.

### Remote errors

- Convert Axios errors into a small application error shape with a user-safe
  message and optional status code.
- User messages state what failed and offer a retry where retrying can help.
- Log diagnostic detail only in development; do not expose raw response objects.
- A missing cover, author, year, or description is incomplete data, not a failed
  page. Render the agreed fallback text or artwork.

### Open Library constraints

- This is a low-volume educational client. Avoid background refetch churn and
  bulk requests.
- A browser cannot set the forbidden `User-Agent` header. Do not attempt to work
  around that frontend platform restriction; stay within the default public API
  limit by caching, debouncing, and avoiding per-card metadata requests.
- Never make a follow-up HTTP request for every card in a results grid.
- The Search and Subjects APIs can change. Their response shapes remain isolated
  in the API and mapper layers.

Official references:

- [Open Library API overview and usage guidance](https://openlibrary.org/developers/api)
- [Search API](https://openlibrary.org/dev/docs/api/search)
- [Book and Works APIs](https://openlibrary.org/dev/docs/api/books)
- [Covers API](https://openlibrary.org/dev/docs/api/covers)
- [Subjects API](https://openlibrary.org/dev/docs/api/subjects)

## 8. Local user data

LocalStorage is local state, not server state. Do not wrap it in Axios, React
Query, fake promises, or mutations.

Expose reusable synchronous hooks backed by a small typed storage adapter:

- `useFavorites()`
- `useLibrary()`
- `useReviews()` only if review behavior grows beyond the library hook

Storage keys are versioned and namespaced:

```text
bookhaven.favorites.v1
bookhaven.library.v1
```

Store a normalized `BookSummary` snapshot with each favorite/library item. This
keeps these pages useful after refresh without issuing one remote request per
saved book. Fresh remote detail data may replace a snapshot when the user opens
that book.

Conceptual persisted shapes:

```ts
type FavoriteRecord = {
  book: BookSummary;
  createdAt: string;
};

type LibraryRecord = {
  book: BookSummary;
  status: ReadingStatus;
  review: PersonalReview | null;
  updatedAt: string;
};

type PersonalReview = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
  updatedAt: string;
};
```

- There is at most one personal review per library book. Across books, the user
  can add, edit, and delete reviews.
- Parse persisted JSON defensively. Corrupt or outdated values fall back safely
  instead of crashing the application.
- Storage writes are immutable and centralized.
- Keep state synchronized across tabs using the browser `storage` event.
- UI actions update React state and LocalStorage together through the hook API.
- Do not persist transient UI state such as dialogs, search input, or loading.
- Removing a favorite does not remove a My Library entry, and vice versa.

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
  --ink-primary: #1e3a5f;
  --ink-accent: #e07a5f;
  --ink-background: #ffffff;
  --ink-background-soft: #eef6ff;
  --ink-surface: #ffffff;
  --ink-text: #172033;
  --ink-text-muted: #5f6b7a;
  --ink-border: #c9d8e8;
  --ink-focus: #1e3a5f;
  --card-radius: 14px;
}
```

- Do not introduce color literals inside components. Add a semantic token first.
- The application background is a white-to-light-blue linear gradient.
- Headings `h1`-`h3` use Fraunces; body copy and controls use Inter.
- Prefer self-hosted `@fontsource` packages so typography does not depend on a
  runtime font request.
- Cards use a `14px` radius and the established dashed bottom-border motif.
- Primary actions use the accent color; navigation and strong text use navy.
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

- API mappers with missing and irregular Open Library fields.
- Catalog URL parameter parsing and query construction.
- Query hooks with mocked HTTP responses.
- LocalStorage parsing, updates, corruption fallback, and versioned keys.
- Favorite toggling, reading-status transitions, and review CRUD.
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
- Update `docs/implementation.md` as work moves between planned, in progress,
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
   `docs/implementation.md` so the documentation and code do not drift.
