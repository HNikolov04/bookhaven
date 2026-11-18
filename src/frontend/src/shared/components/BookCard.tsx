import { IconButton } from '@mui/material'
import { Link } from 'react-router'
import { useFavorites } from '../../features/favorites/useFavorites'
import type { BookSummary } from '../../features/books/types'
import { getBookCoverUrl } from '../utils/bookMappers'

type BookCardProps = {
  book: BookSummary
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
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
  const { isFavorite, toggleFavorite } = useFavorites()
  const isBookFavorite = isFavorite(book.id)

  return (
    <article className="book-card">
      <div className="book-card__cover-wrap">
        {book.coverId ? (
          <img
            alt={`Cover of ${book.title}`}
            className="book-card__cover"
            height="360"
            loading="lazy"
            src={getBookCoverUrl(book.coverId)}
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
            isBookFavorite
              ? `Remove ${book.title} from favorites`
              : `Add ${book.title} to favorites`
          }
          className="favorite-button"
          onClick={() => toggleFavorite(book)}
          size="small"
        >
          <HeartIcon filled={isBookFavorite} />
        </IconButton>
      </div>
      <div className="book-card__content">
        <Link className="book-card__title" to={`/books/${book.id}`}>
          {book.title}
        </Link>
        <p>{book.authors.slice(0, 2).join(', ')}</p>
        {book.firstPublishYear && <span>{book.firstPublishYear}</span>}
      </div>
    </article>
  )
}
