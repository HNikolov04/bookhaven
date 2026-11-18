import { Button } from '@mui/material'
import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="not-found-page page-container">
      <span aria-hidden="true">404</span>
      <h1 className="section-heading">This page has wandered off the shelf.</h1>
      <p className="muted-copy">The page you are looking for does not exist.</p>
      <Button component={Link} to="/" variant="contained" color="secondary">
        Go to home
      </Button>
    </section>
  )
}
