import { useQuery } from '@tanstack/react-query'
import { getBook } from '../api/booksApi'
import { bookQueryKeys } from './bookQueryKeys'

export function useBookQuery(bookId: string | undefined) {
  return useQuery({
    queryKey: bookQueryKeys.detail(bookId),
    queryFn: () => getBook(bookId!),
    enabled: Boolean(bookId),
  })
}
