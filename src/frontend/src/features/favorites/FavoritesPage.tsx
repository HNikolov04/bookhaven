import { Button } from '@mui/material'
import { Link } from 'react-router'

export function FavoritesPage() {
  return (
    <section className="placeholder-page page-container">
      <span className="section-kicker">Coming soon</span>
      <h1 className="section-heading">Favorites</h1>
      <p className="muted-copy">
        Favorite controls already work on the Home page. The complete collection
        view will be built in its dedicated phase.
      </p>
      <Button component={Link} to="/" variant="outlined">Discover books</Button>
    </section>
  )
}
