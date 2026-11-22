import { Button } from '@mui/material'
import { Link } from 'react-router'
import notFoundCatIllustration from '../../assets/illustrations/not-found-cat.png'

export function NotFoundPage() {
  return (
    <section className="not-found-page page-container">
      <div className="not-found-visual">
        <img
          alt="A sleeping cat curled on a stack of books"
          height="1024"
          src={notFoundCatIllustration}
          width="1536"
        />
      </div>
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
    </section>
  )
}
