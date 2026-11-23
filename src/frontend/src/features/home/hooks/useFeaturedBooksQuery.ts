import { useQuery } from '@tanstack/react-query'
import { getFeaturedBooks } from '../../books/api/booksApi'
import { bookQueryKeys } from '../../books/hooks/bookQueryKeys'

export function useFeaturedBooksQuery() {
  return useQuery({
    queryKey: bookQueryKeys.featured,
    queryFn: getFeaturedBooks,
    staleTime: 30 * 60 * 1000,
  })
}
