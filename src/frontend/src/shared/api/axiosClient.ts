import axios from 'axios'
import { readStoredAuth } from '../../features/auth/authStorage'

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5261/api',
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = readStoredAuth()?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
