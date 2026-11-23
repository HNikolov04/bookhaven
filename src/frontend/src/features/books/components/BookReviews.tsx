import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  SvgIcon,
} from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from '../hooks/useReviewMutations'
import { ReviewForm } from './ReviewForm'
import type { BookSummary, SaveReviewRequest } from '../types'

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function BookReviews({ book }: { book: BookSummary }) {
  const auth = useAuth()
  const addReview = useAddReviewMutation()
  const updateReview = useUpdateReviewMutation()
  const deleteReview = useDeleteReviewMutation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string>()
  const [reviewError, setReviewError] = useState<string>()
  const editingReview = book.reviews.find(
    (review) => review.id === editingReviewId && review.userId === auth.user?.id,
  )
  const isSaving = addReview.isPending || updateReview.isPending
  const reviewCount = book.reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = book.reviews.filter((review) => review.stars === stars).length
    return {
      stars,
      percentage: reviewCount === 0 ? 0 : Math.round((count / reviewCount) * 100),
    }
  })

  function openNewReviewDialog() {
    setEditingReviewId(undefined)
    setReviewError(undefined)
    setIsDialogOpen(true)
  }

  function openEditReviewDialog(reviewId: string) {
    setEditingReviewId(reviewId)
    setReviewError(undefined)
    setIsDialogOpen(true)
  }

  async function saveReview(review: SaveReviewRequest) {
    setReviewError(undefined)
    try {
      if (editingReview) {
        await updateReview.mutateAsync({ reviewId: editingReview.id, ...review })
      } else {
        await addReview.mutateAsync({ bookId: book.id, ...review })
      }
      setIsDialogOpen(false)
    } catch {
      setReviewError('Your review could not be saved. Please try again.')
    }
  }

  async function removeReview(reviewId: string) {
    setReviewError(undefined)
    try {
      await deleteReview.mutateAsync(reviewId)
    } catch {
      setReviewError('Your review could not be deleted. Please try again.')
    }
  }

  return (
    <section aria-labelledby="reviews-heading" className="reviews-section">
      <div className="reviews-section__heading">
        <h2 id="reviews-heading">Reviews ({reviewCount})</h2>
        <Button
          color="secondary"
          onClick={openNewReviewDialog}
          startIcon={<PencilIcon />}
          variant="contained"
        >
          Add a review
        </Button>
      </div>

      {reviewError && !isDialogOpen && (
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
                    <time dateTime={review.createdAtUtc}>
                      {formatDate(review.createdAtUtc)}
                    </time>
                  </div>
                  <p>{review.text}</p>
                  {isOwn && (
                    <div className="review-card__actions">
                      <Button
                        color="secondary"
                        onClick={() => openEditReviewDialog(review.id)}
                        size="small"
                        variant="contained"
                      >
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        disabled={deleteReview.isPending}
                        onClick={() => void removeReview(review.id)}
                        size="small"
                        variant="contained"
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

      <Dialog
        aria-labelledby="review-dialog-title"
        className="review-dialog"
        fullWidth
        maxWidth="sm"
        onClose={() => !isSaving && setIsDialogOpen(false)}
        open={isDialogOpen}
      >
        <DialogTitle className="review-dialog__title" id="review-dialog-title">
          <div>
            <h2>{editingReview ? 'Edit your review' : 'Write a review'}</h2>
            <p>Share your thoughts about {book.title} with other readers.</p>
          </div>
          <IconButton
            aria-label="Close review form"
            disabled={isSaving}
            onClick={() => setIsDialogOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReviewForm
            error={reviewError}
            initialValue={editingReview
              ? { stars: editingReview.stars, text: editingReview.text }
              : undefined}
            isSaving={isSaving}
            key={editingReview?.id ?? 'new-review'}
            onCancel={() => setIsDialogOpen(false)}
            onSubmit={saveReview}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
