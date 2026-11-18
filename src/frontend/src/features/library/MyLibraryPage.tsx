import { Button } from '@mui/material'
import { Link } from 'react-router'

export function MyLibraryPage() {
  return (
    <section className="placeholder-page page-container">
      <span className="section-kicker">Coming soon</span>
      <h1 className="section-heading">My library</h1>
      <p className="muted-copy">
        Reading statuses and personal reviews will be implemented after the
        catalog and details experiences.
      </p>
      <Button component={Link} to="/" variant="outlined">Back to home</Button>
    </section>
  )
}
