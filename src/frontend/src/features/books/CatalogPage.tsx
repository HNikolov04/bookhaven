import { Pagination } from '@mui/material'
import { useDeferredValue } from 'react'
import { useSearchParams } from 'react-router'
import { BookCard } from '../../shared/components/BookCard'
import { BookGrid } from '../../shared/components/BookGrid'
import { ErrorState } from '../../shared/components/ErrorState'
import { LoadingState } from '../../shared/components/LoadingState'
import { BookFilters, BookSearch, type BookFilterValues } from './BookFilters'
import { useBooksQuery } from './hooks/useBooksQuery'
import {
  bookSortOptions,
  genres,
  type BookSort,
  type Genre,
} from './types'

function isGenre(value: string | null): value is Genre {
  return Boolean(value && genres.includes(value as Genre))
}

function isBookSort(value: string | null): value is BookSort {
  return Boolean(value && bookSortOptions.includes(value as BookSort))
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const genreParam = searchParams.get('genre')
  const sortParam = searchParams.get('sort')
  const filters: BookFilterValues = {
    query: searchParams.get('search') ?? '',
    genre: isGenre(genreParam) ? genreParam : undefined,
    sort: isBookSort(sortParam) ? sortParam : 'titleAscending',
  }
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const deferredSearch = useDeferredValue(filters.query)
  const books = useBooksQuery({
    search: deferredSearch,
    genre: filters.genre,
    sort: filters.sort,
    page,
    pageSize: 8,
  })

  function updateFilters(next: BookFilterValues) {
    const params = new URLSearchParams()
    if (next.query) params.set('search', next.query)
    if (next.genre) params.set('genre', next.genre)
    if (next.sort !== 'titleAscending') params.set('sort', next.sort)
    setSearchParams(params, { replace: true })
  }

  function updatePage(nextPage: number) {
    const params = new URLSearchParams(searchParams)
    if (nextPage === 1) params.delete('page')
    else params.set('page', String(nextPage))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="catalog-page page-container">
      <header className="catalog-header">
        <h1>Book Catalog</h1>
        <p>Explore our collection, search, filter and find your next favourite book.</p>
      </header>

      <BookSearch onChange={updateFilters} value={filters} />

      <div className="catalog-layout">
        <BookFilters onChange={updateFilters} value={filters} />

        <div className="catalog-results">
          {books.isPending && <LoadingState count={8} />}
          {books.isError && (
            <ErrorState
              message="We could not load the catalogue. Please try again."
              onRetry={() => void books.refetch()}
            />
          )}
          {books.isSuccess && books.data.items.length === 0 && (
            <div className="catalog-empty">
              <h2>No books found</h2>
              <p>Try another title, author, or genre.</p>
            </div>
          )}
          {books.isSuccess && books.data.items.length > 0 && (
            <>
              <BookGrid>
                {books.data.items.map((book) => (
                  <BookCard book={book} key={book.id} />
                ))}
              </BookGrid>
              {books.data.totalPages > 1 && (
                <Pagination
                  color="secondary"
                  count={books.data.totalPages}
                  onChange={(_, nextPage) => updatePage(nextPage)}
                  page={Math.min(page, books.data.totalPages)}
                  shape="rounded"
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
