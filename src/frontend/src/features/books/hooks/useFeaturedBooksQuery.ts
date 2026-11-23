import { useQuery } from '@tanstack/react-query'
import { getFeaturedBooks } from '../api/booksApi'
import { bookQueryKeys } from './bookQueryKeys'

export function useFeaturedBooksQuery() {
  return useQuery({
    queryKey: bookQueryKeys.featured,
    queryFn: getFeaturedBooks,
    staleTime: 30 * 60 * 1000,
  })
}
