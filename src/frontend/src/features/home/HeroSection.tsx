import { Button } from '@mui/material'
import { Link } from 'react-router'

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section__inner page-container">
        <div className="hero-copy">
          <h1>
            Welcome to <span>BookHaven</span>
          </h1>
          <p>
            Discover, read and keep track of the books you love — all in one place.
          </p>
          <div className="hero-actions">
            <Button
              component={Link}
              to="/books"
              variant="contained"
              color="secondary"
            >
              Browse catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
