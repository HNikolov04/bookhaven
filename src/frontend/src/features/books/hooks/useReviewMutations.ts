import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addReview, deleteReview, updateReview } from '../api/booksApi'
import type { SaveReviewRequest } from '../types'

type AddReviewVariables = SaveReviewRequest & { bookId: string }
type UpdateReviewVariables = SaveReviewRequest & { reviewId: string }

function useInvalidateBooks() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['books'] })
}

export function useAddReviewMutation() {
  const invalidateBooks = useInvalidateBooks()
  return useMutation({
    mutationFn: ({ bookId, ...review }: AddReviewVariables) =>
      addReview(bookId, review),
    onSuccess: invalidateBooks,
  })
}

export function useUpdateReviewMutation() {
  const invalidateBooks = useInvalidateBooks()
  return useMutation({
    mutationFn: ({ reviewId, ...review }: UpdateReviewVariables) =>
      updateReview(reviewId, review),
    onSuccess: invalidateBooks,
  })
}

export function useDeleteReviewMutation() {
  const invalidateBooks = useInvalidateBooks()
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: invalidateBooks,
  })
}
