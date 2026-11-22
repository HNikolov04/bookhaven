import { useQuery } from '@tanstack/react-query'
import { getBook } from '../api/booksApi'

export function useBookQuery(bookId: string | undefined) {
  return useQuery({
    queryKey: ['books', 'detail', bookId],
    queryFn: () => getBook(bookId!),
    enabled: Boolean(bookId),
  })
}
