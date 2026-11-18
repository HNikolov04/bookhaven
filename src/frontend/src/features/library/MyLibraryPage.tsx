import { Button } from '@mui/material'
import { Link } from 'react-router'
import { BookCard } from '../../shared/components/BookCard'
import { BookGrid } from '../../shared/components/BookGrid'
import { useMyLibrary } from './useMyLibrary'

export function MyLibraryPage() {
  const { library } = useMyLibrary()

  return (
    <section className="library-page page-container">
      <header className="library-page__header">
        <span className="section-kicker">Your saved books</span>
        <h1 className="section-heading">My Library</h1>
        <p className="muted-copy">
          Keep the books you want to return to in one place.
        </p>
      </header>

      {library.length > 0 ? (
        <BookGrid>
          {library.map(({ book }) => (
            <BookCard book={book} key={book.id} />
          ))}
        </BookGrid>
      ) : (
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
