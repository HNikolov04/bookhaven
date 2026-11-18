import { Button, TextField } from '@mui/material'
import { useState, type FormEvent } from 'react'

type ReviewFormProps = {
  initialValue?: string
  onSubmit: (review: string) => void
}

export function ReviewForm({ initialValue = '', onSubmit }: ReviewFormProps) {
  const [review, setReview] = useState(initialValue)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedReview = review.trim()
    if (trimmedReview) onSubmit(trimmedReview)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Your review"
        multiline
        onChange={(event) => setReview(event.target.value)}
        rows={4}
        value={review}
      />
      <Button type="submit" variant="contained">Save review</Button>
    </form>
  )
}
