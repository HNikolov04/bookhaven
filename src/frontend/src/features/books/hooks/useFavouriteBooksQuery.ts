import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFavouriteBooks } from '../api/booksApi'

export function useFavouriteBooksQuery(page: number, pageSize = 8) {
  return useQuery({
    queryKey: ['books', 'favourites', { page, pageSize }],
    queryFn: () => getFavouriteBooks(page, pageSize),
    placeholderData: keepPreviousData,
  })
}
