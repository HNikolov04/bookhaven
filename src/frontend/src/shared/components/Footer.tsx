import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container site-footer__inner">
        <div>
          <strong>BookHaven</strong>
          <p>Your digital library for every reader.</p>
        </div>
        <div className="site-footer__links">
          <Link to="/books">Browse books</Link>
          <a href="https://openlibrary.org" rel="noreferrer" target="_blank">
            Book data by Open Library
          </a>
        </div>
      </div>
    </footer>
  )
}
