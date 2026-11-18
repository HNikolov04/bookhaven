import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: 'https://openlibrary.org',
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
})
