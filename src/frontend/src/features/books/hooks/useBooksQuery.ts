import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBooks } from '../api/booksApi'
import type { BookQuery } from '../types'

export function useBooksQuery(query: BookQuery) {
  return useQuery({
    queryKey: ['books', 'catalog', query],
    queryFn: () => getBooks(query),
    placeholderData: keepPreviousData,
  })
}
