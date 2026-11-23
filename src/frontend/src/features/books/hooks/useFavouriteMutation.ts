import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addBookToFavourites,
  removeBookFromFavourites,
} from '../api/booksApi'
import { bookQueryKeys } from './bookQueryKeys'

type FavouriteChange = {
  bookId: string
  isFavourite: boolean
}

export function useFavouriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookId, isFavourite }: FavouriteChange) =>
      isFavourite
        ? removeBookFromFavourites(bookId)
        : addBookToFavourites(bookId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookQueryKeys.all })
    },
  })
}
