import { IconButton } from '@mui/material'
import { Link } from 'react-router'
import { useAddBookToFavouritesMutation } from '../../features/books/hooks/useAddBookToFavouritesMutation'
import type { BookSummary } from '../../features/books/types'

type BookCardProps = {
  book: BookSummary
}

function LibraryBookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M6 3h12v18l-6-4-6 4V3Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function BookCard({ book }: BookCardProps) {
  const addToFavourites = useAddBookToFavouritesMutation()

  return (
    <article className="book-card">
      <div className="book-card__cover-wrap">
        {book.pictureUrl ? (
          <img
            alt={`Cover of ${book.title}`}
            className="book-card__cover"
            height="360"
            loading="lazy"
            src={book.pictureUrl}
            width="240"
          />
        ) : (
          <div className="book-card__cover book-card__cover--fallback">
            <span>BookHaven</span>
            <strong>{book.title}</strong>
          </div>
        )}
        <IconButton
          aria-label={
            book.isFavourite
              ? `${book.title} is in My Library`
              : `Add ${book.title} to My Library`
          }
          className="library-button"
          disabled={book.isFavourite || addToFavourites.isPending}
          onClick={() => addToFavourites.mutate(book.id)}
          size="small"
        >
          <LibraryBookmarkIcon filled={book.isFavourite} />
        </IconButton>
      </div>
      <div className="book-card__content">
        <Link className="book-card__title" to={`/books/${book.id}`}>
          {book.title}
        </Link>
        <p>{book.author.name}</p>
        <span>{book.publishYear}</span>
      </div>
    </article>
  )
}
