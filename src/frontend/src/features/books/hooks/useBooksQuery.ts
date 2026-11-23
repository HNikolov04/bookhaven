import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBooks } from '../api/booksApi'
import type { BookQuery } from '../types'
import { bookQueryKeys } from './bookQueryKeys'

export function useBooksQuery(query: BookQuery) {
  return useQuery({
    queryKey: bookQueryKeys.catalog(query),
    queryFn: () => getBooks(query),
    placeholderData: keepPreviousData,
  })
}
