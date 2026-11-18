import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Toolbar,
} from '@mui/material'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/books' },
  { label: 'My Library', to: '/my-library' },
  { label: 'Favorites', to: '/favorites' },
]

function BookHavenMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 48 42">
      <path d="M4 11c8-1 14 1 20 6v20c-6-5-12-7-20-6V11Z" />
      <path d="M44 11c-8-1-14 1-20 6v20c6-5 12-7 20-6V11Z" />
      <path d="M24 17v20" />
      <path className="brand-mark__accent" d="m34 2 1.6 4.4L40 8l-4.4 1.6L34 14l-1.6-4.4L28 8l4.4-1.6L34 2Z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <AppBar className="site-header" color="transparent" elevation={0} position="sticky">
      <Toolbar className="site-header__inner page-container" disableGutters>
        <NavLink aria-label="BookHaven home" className="brand" to="/">
          <BookHavenMark />
          <span>BookHaven</span>
        </NavLink>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link--active' : ''}`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <IconButton
            aria-label="Search books"
            className="header-icon-button"
            component={Link}
            to="/books"
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            aria-label="Open navigation"
            className="header-icon-button mobile-menu-button"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </Toolbar>

      <Drawer
        anchor="right"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
      >
        <div className="mobile-drawer">
          <div className="mobile-drawer__heading">
            <BookHavenMark />
            <span>BookHaven</span>
          </div>
          <List component="nav" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <ListItemButton
                component={NavLink}
                key={item.to}
                onClick={() => setIsMenuOpen(false)}
                to={item.to}
              >
                {item.label}
              </ListItemButton>
            ))}
          </List>
        </div>
      </Drawer>
    </AppBar>
  )
}
