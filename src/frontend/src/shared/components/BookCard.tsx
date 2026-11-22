import { CircularProgress, IconButton, SvgIcon, Tooltip } from '@mui/material'
import { Link } from 'react-router'
import { useFavouriteMutation } from '../../features/books/hooks/useFavouriteMutation'
import type { BookSummary } from '../../features/books/types'

type BookCardProps = {
  book: BookSummary
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </SvgIcon>
  )
}

export function BookCard({ book }: BookCardProps) {
  const favourite = useFavouriteMutation()
  const actionLabel = book.isFavourite
    ? `Remove ${book.title} from My Library`
    : `Add ${book.title} to My Library`

  return (
    <article className="book-card">
      <Link
        aria-label={`View details for ${book.title}`}
        className="book-card__link"
        to={`/books/${book.id}`}
      />
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
        <Tooltip title={actionLabel}>
          <span>
            <IconButton
              aria-label={actionLabel}
              aria-pressed={book.isFavourite}
              className="library-button"
              disabled={favourite.isPending}
              onClick={() => favourite.mutate({
                bookId: book.id,
                isFavourite: book.isFavourite,
              })}
              size="small"
            >
              {favourite.isPending
                ? <CircularProgress color="inherit" size={18} />
                : <HeartIcon filled={book.isFavourite} />}
            </IconButton>
          </span>
        </Tooltip>
      </div>
      <div className="book-card__content">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author.name}</p>
        <span>{book.publishYear}</span>
      </div>
    </article>
  )
}
