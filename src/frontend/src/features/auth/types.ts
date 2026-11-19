export type AuthUser = {
  id: string
  username: string
  email: string
}

export type AuthResponse = {
  token: string
  user: AuthUser
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = LoginRequest & {
  username: string
}
