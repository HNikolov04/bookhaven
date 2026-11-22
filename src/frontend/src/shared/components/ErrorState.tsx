import { Alert, Button } from '@mui/material'

type ErrorStateProps = {
  onRetry: () => void
  message?: string
}

export function ErrorState({
  onRetry,
  message = 'We could not load this collection. Please try again.',
}: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" onClick={onRetry} size="small">
          Try again
        </Button>
      }
    >
      {message}
    </Alert>
  )
}
