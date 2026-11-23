import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const auth = useAuth()
  const location = useLocation()

  return auth.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: location.pathname }} to="/login" />
  )
}
