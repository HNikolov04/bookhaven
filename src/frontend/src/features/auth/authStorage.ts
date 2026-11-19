import type { AuthResponse } from './types'

const AUTH_STORAGE_KEY = 'bookhaven.auth.v1'
const AUTH_EVENT = 'bookhaven:auth-changed'

export function readStoredAuth(): AuthResponse | null {
  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!value) return null

    const auth = JSON.parse(value) as Partial<AuthResponse>
    if (
      typeof auth.token !== 'string' ||
      !auth.user ||
      typeof auth.user.id !== 'string' ||
      typeof auth.user.username !== 'string' ||
      typeof auth.user.email !== 'string'
    ) {
      return null
    }

    return auth as AuthResponse
  } catch {
    return null
  }
}

export function storeAuth(auth: AuthResponse) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function subscribeToAuth(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(AUTH_EVENT, onChange)

  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(AUTH_EVENT, onChange)
  }
}
