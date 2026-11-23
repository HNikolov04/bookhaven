import { Button } from '@mui/material'
import { Link } from 'react-router'
import { useFeaturedBooksQuery } from '../books/hooks/useFeaturedBooksQuery'
import { BookCard } from '../../shared/components/BookCard'
import { BookGrid } from '../../shared/components/BookGrid'
import { ErrorState } from '../../shared/components/ErrorState'
import { LoadingState } from '../../shared/components/LoadingState'

export function FeaturedBooks() {
  const featuredBooks = useFeaturedBooksQuery()

  return (
    <section className="featured-section section-shell" aria-labelledby="featured-heading">
      <div className="page-container">
        <div className="section-title-row">
          <div>
            <h2 className="section-heading" id="featured-heading">Featured books</h2>
            <p className="muted-copy">A fresh shelf of timeless fiction to begin with.</p>
          </div>
          <Button component={Link} to="/books" variant="contained">
            View all books
          </Button>
        </div>

        {featuredBooks.isPending && <LoadingState />}
        {featuredBooks.isError && (
          <ErrorState onRetry={() => void featuredBooks.refetch()} />
        )}
        {featuredBooks.isSuccess && featuredBooks.data.length === 0 && (
          <p className="empty-featured-state">
            This shelf is being restocked. Browse the full catalog in the meantime.
          </p>
        )}
        {featuredBooks.isSuccess && featuredBooks.data.length > 0 && (
          <BookGrid>
            {featuredBooks.data.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </BookGrid>
        )}
      </div>
    </section>
  )
}
