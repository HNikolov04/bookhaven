import { Button } from '@mui/material'
import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <div className="not-found-page__inner page-container">
        <div className="not-found-page__content">
          <h1>
            <span>404</span>
            Page Not Found
          </h1>
          <p>The page you’re looking for doesn’t exist or has been moved.</p>
          <Button component={Link} to="/" variant="contained" color="secondary">
            Go to Home
          </Button>
        </div>
      </div>
    </section>
  )
}
