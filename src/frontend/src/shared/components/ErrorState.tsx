import { Alert, Button } from '@mui/material'

type ErrorStateProps = {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" onClick={onRetry} size="small">
          Try again
        </Button>
      }
    >
      We could not load the featured collection. Please try again.
    </Alert>
  )
}
