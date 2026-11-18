import { Button } from '@mui/material'
import { Link } from 'react-router'

export function CatalogPage() {
  return (
    <section className="placeholder-page page-container">
      <span className="section-kicker">Coming next</span>
      <h1 className="section-heading">Book catalog</h1>
      <p className="muted-copy">
        Search, filters, sorting, and pagination will be implemented in the next
        feature phase.
      </p>
      <Button component={Link} to="/" variant="outlined">Back to home</Button>
    </section>
  )
}
