import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Toolbar,
} from '@mui/material'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { useAuth } from '../../features/auth/useAuth'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/books' },
  { label: 'My Library', to: '/my-library' },
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const auth = useAuth()

  return (
    <AppBar className="site-header" color="transparent" elevation={0} position="sticky">
      <Toolbar className="site-header__inner" disableGutters>
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
          <div className="desktop-auth-actions">
            {auth.isAuthenticated ? (
              <>
                <span className="header-username">{auth.user?.username}</span>
                <Button onClick={auth.signOut} size="small" variant="outlined">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button component={NavLink} size="small" to="/login">
                  Sign in
                </Button>
                <Button component={NavLink} size="small" to="/register" variant="contained">
                  Register
                </Button>
              </>
            )}
          </div>
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
            {auth.isAuthenticated ? (
              <ListItemButton
                onClick={() => {
                  auth.signOut()
                  setIsMenuOpen(false)
                }}
              >
                Sign out ({auth.user?.username})
              </ListItemButton>
            ) : (
              <>
                <ListItemButton
                  component={NavLink}
                  onClick={() => setIsMenuOpen(false)}
                  to="/login"
                >
                  Sign in
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  onClick={() => setIsMenuOpen(false)}
                  to="/register"
                >
                  Register
                </ListItemButton>
              </>
            )}
          </List>
        </div>
      </Drawer>
    </AppBar>
  )
}
