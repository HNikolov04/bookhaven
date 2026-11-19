import { useQuery } from '@tanstack/react-query'
import { getFavouriteBooks } from '../api/booksApi'

export function useFavouriteBooksQuery() {
  return useQuery({
    queryKey: ['books', 'favourites'],
    queryFn: getFavouriteBooks,
  })
}
