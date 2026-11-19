import { axiosClient } from '../../../shared/api/axiosClient'
import { mapBookApiDtoToBook } from '../../../shared/utils/bookMappers'
import type { BookApiDto, BookSummary, PagedApiDto } from '../types'

export async function getFeaturedBooks(): Promise<BookSummary[]> {
  const response = await axiosClient.get<PagedApiDto<BookApiDto>>('/books', {
    params: {
      isFeatured: true,
      page: 1,
      pageSize: 4,
    },
  })
  return response.data.items.map(mapBookApiDtoToBook)
}

export async function getFavouriteBooks(): Promise<BookSummary[]> {
  const response = await axiosClient.get<PagedApiDto<BookApiDto>>('/books', {
    params: {
      favouritesOnly: true,
      page: 1,
      pageSize: 100,
    },
  })
  return response.data.items.map(mapBookApiDtoToBook)
}

export async function addBookToFavourites(bookId: string): Promise<void> {
  await axiosClient.post(`/books/${bookId}/favourites`)
}
