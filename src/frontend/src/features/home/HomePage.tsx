import { Chip } from '@mui/material'
import { Link } from 'react-router'
import { FeaturedBooks } from './FeaturedBooks'
import { HeroSection } from './HeroSection'

const genres = [
  { label: 'Fiction', slug: 'fiction', symbol: 'Aa' },
  { label: 'Science Fiction', slug: 'science_fiction', symbol: '✦' },
  { label: 'Fantasy', slug: 'fantasy', symbol: '⌁' },
  { label: 'Mystery', slug: 'mystery', symbol: '?' },
  { label: 'History', slug: 'history', symbol: '⌛' },
  { label: 'Biography', slug: 'biography', symbol: '◉' },
]

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedBooks />
      <section className="genres-section section-shell" aria-labelledby="genres-heading">
        <div className="page-container">
          <div className="genres-intro">
            <span className="section-kicker">Find your shelf</span>
            <h2 className="section-heading" id="genres-heading">Explore by genre</h2>
            <p className="muted-copy">
              Follow your curiosity—from imagined worlds to lives that changed ours.
            </p>
          </div>
          <div className="genre-grid">
            {genres.map((genre) => (
              <Link className="genre-card" key={genre.slug} to={`/books?genre=${genre.slug}`}>
                <span aria-hidden="true" className="genre-card__symbol">{genre.symbol}</span>
                <div>
                  <h3>{genre.label}</h3>
                  <Chip label="Explore" size="small" variant="outlined" />
                </div>
                <span aria-hidden="true" className="genre-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
