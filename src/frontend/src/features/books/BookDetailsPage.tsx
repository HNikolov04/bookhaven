import {
  Chip,
  CircularProgress,
  IconButton,
  Rating,
  Skeleton,
  SvgIcon,
} from '@mui/material'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../shared/components/ErrorState'
import { RequestErrorSnackbar } from '../../shared/components/RequestErrorSnackbar'
import { genreLabels } from './bookOptions'
import { BookReviews } from './BookReviews'
import { useBookQuery } from './hooks/useBookQuery'
import { useFavouriteMutation } from './hooks/useFavouriteMutation'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <SvgIcon aria-hidden="true" className="details-heart" viewBox="0 0 24 24">
      <path
        d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.4 5.4 0 0 0 0-7.7Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </SvgIcon>
  )
}

function BackIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m15 18-6-6 6-6M9 12h10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </SvgIcon>
  )
}

function ChevronRightIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m9 6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </SvgIcon>
  )
}

export function BookDetailsPage() {
  const { id } = useParams()
  const bookQuery = useBookQuery(id)
  const favourite = useFavouriteMutation()

  if (bookQuery.isPending) {
    return (
      <section className="book-details-page page-container details-loading">
        <Skeleton height={420} variant="rectangular" />
        <div>
          <Skeleton height={62} width="60%" />
          <Skeleton height={24} width="30%" />
          <Skeleton height={160} />
        </div>
      </section>
    )
  }

  if (bookQuery.isError || !bookQuery.data) {
    return (
      <section className="book-details-page page-container">
        <ErrorState
          message="We could not find this book. It may have been moved."
          onRetry={() => void bookQuery.refetch()}
        />
      </section>
    )
  }

  const book = bookQuery.data

  return (
    <section className="book-details-page page-container">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <IconButton
          aria-label="Back to catalog"
          className="breadcrumbs__back"
          component={Link}
          size="small"
          to="/books"
        >
          <BackIcon />
        </IconButton>
        <Link to="/books">Catalog</Link>
        <ChevronRightIcon />
        <span>Book Details</span>
      </nav>

      <div className="book-details-hero">
        <div className="book-details-cover">
          <img alt={`Cover of ${book.title}`} src={book.pictureUrl} />
        </div>

        <div className="book-details-content">
          <div className="book-details-title-row">
            <div>
              <h1>{book.title}</h1>
              <p className="book-details-author">By {book.author.name}</p>
            </div>
            <IconButton
              aria-pressed={book.isFavourite}
              aria-label={book.isFavourite
                ? `Remove ${book.title} from My Library`
                : `Add ${book.title} to My Library`}
              className="details-favourite-button"
              disabled={favourite.isPending}
              onClick={() => favourite.mutate({
                bookId: book.id,
                isFavourite: book.isFavourite,
              })}
            >
              {favourite.isPending
                ? <CircularProgress color="inherit" size={28} />
                : <HeartIcon filled={book.isFavourite} />}
            </IconButton>
          </div>

          <div className="genre-chips">
            {book.genres.map((genre) => (
              <Chip key={genre} label={genreLabels[genre]} size="small" />
            ))}
          </div>

          <div className="book-facts">
            <span><strong>{book.publishYear}</strong> Published</span>
            <span><strong>{book.pages}</strong> pages</span>
            <span className="book-rating">
              <Rating precision={0.1} readOnly size="small" value={book.averageStars} />
              <strong>{book.averageStars.toFixed(1)}</strong>
              ({book.ratingVotes.toLocaleString()})
            </span>
          </div>

          <p className="book-long-description">{book.longDescription}</p>
          {book.author.description && (
            <p className="book-author-description">{book.author.description}</p>
          )}
        </div>
      </div>

      <BookReviews book={book} />
      <RequestErrorSnackbar
        message="Your library could not be updated. Please try again."
        onClose={favourite.reset}
        open={favourite.isError}
      />
    </section>
  )
}
