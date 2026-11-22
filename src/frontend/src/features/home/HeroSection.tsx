import { Button } from '@mui/material'
import { Link } from 'react-router'
import homeLibraryIllustration from '../../assets/illustrations/home-library.png'

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="page-container grid items-center gap-10 md:grid-cols-2 lg:gap-16">
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
            <Button component={Link} to="/my-library" variant="outlined">
              My library
            </Button>
          </div>
        </div>

        <div className="hero-visual">
          <img
            alt="A cup and leafy branch resting on a stack of books"
            fetchPriority="high"
            height="1024"
            src={homeLibraryIllustration}
            width="1536"
          />
        </div>
      </div>
    </section>
  )
}
