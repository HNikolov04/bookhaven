import { useQuery } from '@tanstack/react-query'
import { getFeaturedBooks } from '../api/booksApi'

export function useFeaturedBooksQuery() {
  return useQuery({
    queryKey: ['books', 'featured'],
    queryFn: getFeaturedBooks,
    staleTime: 30 * 60 * 1000,
  })
}
