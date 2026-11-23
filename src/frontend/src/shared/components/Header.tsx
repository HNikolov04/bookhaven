import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  SvgIcon,
  Toolbar,
} from '@mui/material'
import { useState, type MouseEvent } from 'react'
import { NavLink } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'

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
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </SvgIcon>
  )
}

function PersonIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </SvgIcon>
  )
}

function LogoutIcon() {
  return (
    <SvgIcon aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
    </SvgIcon>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const auth = useAuth()

  function handleProfileOpen(event: MouseEvent<HTMLElement>) {
    setProfileAnchor(event.currentTarget)
  }

  function handleSignOut() {
    setProfileAnchor(null)
    auth.signOut()
  }

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
          <IconButton
            aria-label="Open navigation"
            className="header-icon-button mobile-menu-button"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            aria-controls={profileAnchor ? 'profile-menu' : undefined}
            aria-expanded={profileAnchor ? 'true' : undefined}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="profile-button"
            onClick={handleProfileOpen}
            size="small"
          >
            <Avatar className="profile-avatar"><PersonIcon /></Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchor}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            className="profile-menu"
            id="profile-menu"
            onClose={() => setProfileAnchor(null)}
            open={Boolean(profileAnchor)}
            slotProps={{ paper: { className: 'profile-menu__paper' } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <div className="profile-menu__identity">
              <Avatar className="profile-menu__avatar"><PersonIcon /></Avatar>
              <div>
                <span>Signed in as</span>
                <strong>{auth.user?.email}</strong>
              </div>
            </div>
            <Divider />
            <MenuItem className="profile-menu__logout" onClick={handleSignOut}>
              <LogoutIcon />
              <span>Log out</span>
            </MenuItem>
          </Menu>
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
