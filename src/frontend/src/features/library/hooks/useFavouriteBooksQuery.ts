import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFavouriteBooks } from '../../books/api/booksApi'
import { bookQueryKeys } from '../../books/hooks/bookQueryKeys'

export function useFavouriteBooksQuery(page: number, pageSize = 8) {
  return useQuery({
    queryKey: bookQueryKeys.favourites(page, pageSize),
    queryFn: () => getFavouriteBooks(page, pageSize),
    placeholderData: keepPreviousData,
  })
}
