import { Alert, Snackbar } from '@mui/material'

type RequestErrorSnackbarProps = {
  message: string
  open: boolean
  onClose: () => void
}

export function RequestErrorSnackbar({
  message,
  open,
  onClose,
}: RequestErrorSnackbarProps) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={6_000}
      onClose={onClose}
      open={open}
    >
      <Alert onClose={onClose} severity="error" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}
