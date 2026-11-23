import { Alert, Button, Rating, TextField } from '@mui/material'
import { useState, type FormEvent } from 'react'
import type { SaveReviewRequest } from './types'

type ReviewFormProps = {
  initialValue?: SaveReviewRequest
  isSaving: boolean
  error?: string
  onCancel?: () => void
  onSubmit: (review: SaveReviewRequest) => Promise<void>
}

export function ReviewForm({
  initialValue,
  isSaving,
  error,
  onCancel,
  onSubmit,
}: ReviewFormProps) {
  const [stars, setStars] = useState(initialValue?.stars ?? 0)
  const [text, setText] = useState(initialValue?.text ?? '')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (stars < 1 || !text.trim()) return
    await onSubmit({ stars, text: text.trim() })
  }

  return (
    <form className="review-form" onSubmit={(event) => void handleSubmit(event)}>
      <div>
        <label>Your rating</label>
        <Rating
          className="review-form__rating"
          onChange={(_, value) => setStars(value ?? 0)}
          size="large"
          value={stars}
        />
      </div>
      <TextField
        fullWidth
        label="Your review"
        minRows={4}
        multiline
        onChange={(event) => setText(event.target.value)}
        placeholder="What stayed with you after reading this book?"
        slotProps={{ htmlInput: { maxLength: 2000 } }}
        value={text}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="review-form__actions">
        {onCancel && (
          <Button
            className="button-secondary"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
        )}
        <Button
          color="secondary"
          disabled={isSaving || stars < 1 || !text.trim()}
          type="submit"
          variant="contained"
        >
          {isSaving ? 'Saving...' : initialValue ? 'Update review' : 'Add review'}
        </Button>
      </div>
    </form>
  )
}
