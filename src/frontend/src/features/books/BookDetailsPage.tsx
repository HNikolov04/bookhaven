import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Skeleton,
  SvgIcon,
} from '@mui/material'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../shared/components/ErrorState'
import { useAuth } from '../auth/useAuth'
import { useBookQuery } from './hooks/useBookQuery'
import { useFavouriteMutation } from './hooks/useFavouriteMutation'
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from './hooks/useReviewMutations'
import { ReviewForm } from './ReviewForm'
import type { Genre, SaveReviewRequest } from './types'

const genreLabels: Record<Genre, string> = {
  fiction: 'Fiction',
  scienceFiction: 'Science Fiction',
  fantasy: 'Fantasy',
  mystery: 'Mystery',
  nonFiction: 'Non-Fiction',
  history: 'History',
  biography: 'Biography',
  romance: 'Romance',
}

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

function PersonIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </SvgIcon>
  )
}

function PencilIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path d="m4 20 4.2-1 10.9-10.9-3.2-3.2L5 15.8 4 20ZM14.7 6.1l3.2 3.2" />
    </SvgIcon>
  )
}

function CloseIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function BookDetailsPage() {
  const { id } = useParams()
  const auth = useAuth()
  const bookQuery = useBookQuery(id)
  const favourite = useFavouriteMutation()
  const addReview = useAddReviewMutation()
  const updateReview = useUpdateReviewMutation()
  const deleteReview = useDeleteReviewMutation()
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewError, setReviewError] = useState<string>()

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
  const ownReview = book.reviews.find((review) => review.userId === auth.user?.id)
  const isSavingReview = addReview.isPending || updateReview.isPending
  const reviewCount = book.reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = book.reviews.filter((review) => review.stars === stars).length
    return {
      stars,
      percentage: reviewCount === 0 ? 0 : Math.round((count / reviewCount) * 100),
    }
  })

  function openReviewDialog() {
    setReviewError(undefined)
    setIsReviewDialogOpen(true)
  }

  async function saveReview(review: SaveReviewRequest) {
    setReviewError(undefined)
    try {
      if (ownReview) {
        await updateReview.mutateAsync({ reviewId: ownReview.id, ...review })
      } else {
        await addReview.mutateAsync({ bookId: book.id, ...review })
      }
      setIsReviewDialogOpen(false)
    } catch {
      setReviewError('Your review could not be saved. Please try again.')
    }
  }

  async function removeReview(reviewId: string) {
    setReviewError(undefined)
    try {
      await deleteReview.mutateAsync(reviewId)
      setIsReviewDialogOpen(false)
    } catch {
      setReviewError('Your review could not be deleted. Please try again.')
    }
  }

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
            <Button
              aria-pressed={book.isFavourite}
              color="secondary"
              disabled={favourite.isPending}
              onClick={() => favourite.mutate({
                bookId: book.id,
                isFavourite: book.isFavourite,
              })}
              startIcon={favourite.isPending
                ? <CircularProgress color="inherit" size={17} />
                : <HeartIcon filled={book.isFavourite} />}
              variant="contained"
            >
              Add to My Library
            </Button>
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

      <section aria-labelledby="reviews-heading" className="reviews-section">
        <div className="reviews-section__heading">
          <h2 id="reviews-heading">Reviews ({reviewCount})</h2>
          <Button
            color="secondary"
            onClick={openReviewDialog}
            startIcon={<PencilIcon />}
            variant="contained"
          >
            {ownReview ? 'Edit your review' : 'Write a review'}
          </Button>
        </div>

        {reviewError && !isReviewDialogOpen && (
          <Alert severity="error">{reviewError}</Alert>
        )}

        <div className="reviews-layout">
          <aside aria-label="Rating summary" className="rating-summary">
            <div className="rating-summary__score">
              <strong>{book.averageStars.toFixed(1)}</strong>
              <span>/ 5</span>
            </div>
            <Rating precision={0.1} readOnly value={book.averageStars} />
            <p>{book.ratingVotes.toLocaleString()} ratings</p>
            <div className="rating-breakdown">
              {ratingDistribution.map((rating) => (
                <div className="rating-breakdown__row" key={rating.stars}>
                  <span>{rating.stars} ★</span>
                  <div><i style={{ width: `${rating.percentage}%` }} /></div>
                  <span>{rating.percentage}%</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="review-list">
            {reviewCount === 0 && (
              <p className="reviews-empty">Be the first reader to review this book.</p>
            )}
            {book.reviews.map((review) => {
              const isOwn = review.userId === auth.user?.id
              return (
                <article className="review-card" key={review.id}>
                  <div className="review-avatar" aria-hidden="true">
                    <PersonIcon />
                  </div>
                  <div className="review-card__body">
                    <div className="review-card__meta">
                      <div>
                        <strong>{review.userEmail}</strong>
                        <div className="review-card__rating">
                          <Rating readOnly size="small" value={review.stars} />
                          <span>{review.stars.toFixed(1)}</span>
                        </div>
                      </div>
                      <time dateTime={review.createdAtUtc}>{formatDate(review.createdAtUtc)}</time>
                    </div>
                    <p>{review.text}</p>
                    {isOwn && (
                      <div className="review-card__actions">
                        <Button onClick={openReviewDialog} size="small">
                          Edit
                        </Button>
                        <Button
                          color="error"
                          disabled={deleteReview.isPending}
                          onClick={() => void removeReview(review.id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <Dialog
        aria-labelledby="review-dialog-title"
        className="review-dialog"
        fullWidth
        maxWidth="sm"
        onClose={() => !isSavingReview && setIsReviewDialogOpen(false)}
        open={isReviewDialogOpen}
      >
        <DialogTitle className="review-dialog__title" id="review-dialog-title">
          <div>
            <h2>{ownReview ? 'Edit your review' : 'Write a review'}</h2>
            <p>Share your thoughts about {book.title} with other readers.</p>
          </div>
          <IconButton
            aria-label="Close review form"
            disabled={isSavingReview}
            onClick={() => setIsReviewDialogOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReviewForm
            error={reviewError}
            initialValue={ownReview
              ? { stars: ownReview.stars, text: ownReview.text }
              : undefined}
            isSaving={isSavingReview}
            key={ownReview?.id ?? 'new-review'}
            onCancel={() => setIsReviewDialogOpen(false)}
            onSubmit={saveReview}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
