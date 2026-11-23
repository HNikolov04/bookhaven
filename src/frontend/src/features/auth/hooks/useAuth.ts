import { createContext, useContext } from 'react'
import type { AuthResponse, AuthUser } from '../types'

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  signIn: (auth: AuthResponse) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
