import { Button } from '@mui/material'
import { Link, useParams } from 'react-router'

export function BookDetailsPage() {
  const { id } = useParams()

  return (
    <section className="placeholder-page page-container">
      <span className="section-kicker">Coming next</span>
      <h1 className="section-heading">Book details</h1>
      <p className="muted-copy">
        The details experience for <strong>{id ?? 'this book'}</strong> is planned
        for a later phase.
      </p>
      <Button component={Link} to="/books" variant="outlined">Back to catalog</Button>
    </section>
  )
}
