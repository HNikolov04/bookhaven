import { axiosClient } from '../../shared/api/axiosClient'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from './types'

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>('/users/login', request)
  return response.data
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>('/users/register', request)
  return response.data
}
