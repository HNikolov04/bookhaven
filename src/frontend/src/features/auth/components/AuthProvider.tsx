import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  clearStoredAuth,
  readStoredAuth,
  storeAuth,
  subscribeToAuth,
} from '../storage/authStorage'
import type { AuthResponse } from '../types'
import { AuthContext, type AuthContextValue } from '../hooks/useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(readStoredAuth)

  useEffect(() => subscribeToAuth(() => setAuth(readStoredAuth())), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      isAuthenticated: Boolean(auth?.token),
      signIn: (nextAuth) => {
        storeAuth(nextAuth)
        setAuth(nextAuth)
      },
      signOut: () => {
        clearStoredAuth()
        setAuth(null)
      },
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
