import { Button, Pagination } from '@mui/material'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BookCard } from '../../books/components/BookCard'
import { BookGrid } from '../../books/components/BookGrid'
import { LoadingState } from '../../books/components/LoadingState'
import { ErrorState } from '../../../shared/components/ErrorState'
import { useFavouriteBooksQuery } from '../hooks/useFavouriteBooksQuery'

export function MyLibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const favourites = useFavouriteBooksQuery(page)

  function updatePage(nextPage: number) {
    const params = new URLSearchParams(searchParams)
    if (nextPage === 1) params.delete('page')
    else params.set('page', String(nextPage))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const totalPages = favourites.data?.totalPages ?? 0
    if (
      favourites.isSuccess &&
      totalPages > 0 &&
      page > totalPages
    ) {
      const params = new URLSearchParams()
      if (totalPages > 1) params.set('page', String(totalPages))
      setSearchParams(params, { replace: true })
    }
  }, [favourites.data?.totalPages, favourites.isSuccess, page, setSearchParams])

  return (
    <section className="library-page page-container">
      <header className="library-page__header">
        <h1 className="section-heading">My Library</h1>
        <p className="muted-copy">
          Keep the books you want to return to in one place.
        </p>
      </header>

      {favourites.isPending && <LoadingState />}
      {favourites.isError && (
        <ErrorState onRetry={() => void favourites.refetch()} />
      )}
      {favourites.isSuccess && favourites.data.items.length > 0 ? (
        <>
          <BookGrid>
            {favourites.data.items.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </BookGrid>
          {favourites.data.totalPages > 1 && (
            <Pagination
              className="library-pagination"
              count={favourites.data.totalPages}
              onChange={(_, nextPage) => updatePage(nextPage)}
              page={Math.min(page, favourites.data.totalPages)}
              shape="rounded"
            />
          )}
        </>
      ) : null}
      {favourites.isSuccess && favourites.data.totalCount === 0 && (
        <div className="library-empty-state">
          <h2>Your library is waiting for its first book.</h2>
          <p>Use the bookmark button on a book card to save it here.</p>
          <Button component={Link} to="/books" variant="contained" color="secondary">
            Browse books
          </Button>
        </div>
      )}
    </section>
  )
}
