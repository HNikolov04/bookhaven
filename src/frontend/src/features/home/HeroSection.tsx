import { Button } from '@mui/material'
import { Link } from 'react-router'

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="button-icon" viewBox="0 0 24 24">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="page-container grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="hero-copy">
          <span className="section-kicker">Your next chapter starts here</span>
          <h1>
            Welcome to <span>BookHaven</span>
          </h1>
          <p>
            Discover remarkable books, save the stories you love, and keep every
            reading journey in one welcoming place.
          </p>
          <div className="hero-actions">
            <Button
              component={Link}
              endIcon={<ArrowIcon />}
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
          <div className="hero-proof" aria-label="BookHaven benefits">
            <span><strong>Free</strong> to explore</span>
            <span><strong>Real</strong> library data</span>
            <span><strong>Yours</strong> to organize</span>
          </div>
        </div>

        <div
          aria-label="A warm cup beside a stack of books and leafy branches"
          className="hero-illustration"
          role="img"
        >
          <span className="hero-spark hero-spark--one">✦</span>
          <span className="hero-spark hero-spark--two">✦</span>
          <div className="hero-steam"><i /><i /></div>
          <div className="hero-cup"><span /></div>
          <div className="hero-plant">
            {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
          </div>
          <div className="hero-books">
            <span className="hero-book hero-book--one" />
            <span className="hero-book hero-book--two" />
            <span className="hero-book hero-book--three" />
            <span className="hero-book hero-book--four" />
          </div>
          <div className="hero-shadow" />
        </div>
      </div>
    </section>
  )
}
