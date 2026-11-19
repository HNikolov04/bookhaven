import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBookToFavourites } from '../api/booksApi'

export function useAddBookToFavouritesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBookToFavourites,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
