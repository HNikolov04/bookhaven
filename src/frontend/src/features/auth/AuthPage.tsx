import { Alert, Button, Paper, TextField } from '@mui/material'
import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from './useAuth'
import { useLoginMutation, useRegisterMutation } from './useAuthMutations'

type AuthMode = 'login' | 'register'

type ProblemDetails = {
  detail?: string
  title?: string
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ProblemDetails>(error)) {
    return error.response?.data.detail ?? error.response?.data.title ?? 'The request failed.'
  }

  return 'The request failed. Please try again.'
}

function AuthPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const auth = useAuth()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const mutation = isRegister ? registerMutation : loginMutation

  if (auth.isAuthenticated) {
    return <Navigate replace to="/" />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const onSuccess = (response: Parameters<typeof auth.signIn>[0]) => {
      auth.signIn(response)
      void navigate('/')
    }

    if (isRegister) {
      registerMutation.mutate({ email, password }, { onSuccess })
      return
    }

    loginMutation.mutate({ email, password }, { onSuccess })
  }

  return (
    <main className="auth-page page-container">
      <Paper className="auth-card" elevation={0} component="section">
        <span className="section-kicker">Welcome to BookHaven</span>
        <h1>{isRegister ? 'Create an account' : 'Sign in'}</h1>
        <p>
          {isRegister
            ? 'Register with your email and password.'
            : 'Sign in to add books and write your reviews.'}
        </p>

        {mutation.isError && (
          <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextField
            autoComplete="email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <TextField
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            helperText={isRegister ? 'Use at least 6 characters.' : undefined}
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            required
            slotProps={{ htmlInput: { minLength: 6 } }}
            type="password"
            value={password}
          />
          <Button disabled={mutation.isPending} type="submit" variant="contained">
            {mutation.isPending
              ? 'Please wait…'
              : isRegister
                ? 'Register'
                : 'Sign in'}
          </Button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already registered?' : 'New to BookHaven?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </Paper>
      <p className="auth-powered">Powered by BookHaven</p>
    </main>
  )
}

export function LoginPage() {
  return <AuthPage mode="login" />
}

export function RegisterPage() {
  return <AuthPage mode="register" />
}
