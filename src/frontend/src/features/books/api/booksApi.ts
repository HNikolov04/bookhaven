import { axiosClient } from '../../../shared/api/axiosClient'
import { mapBookApiDtoToBook } from '../../../shared/utils/bookMappers'
import type {
  BookApiDto,
  BookQuery,
  BookSummary,
  PagedApiDto,
  ReviewApiDto,
  SaveReviewRequest,
} from '../types'

export async function getBooks(query: BookQuery): Promise<PagedApiDto<BookSummary>> {
  const response = await axiosClient.get<PagedApiDto<BookApiDto>>('/books', {
    params: {
      search: query.search || undefined,
      genre: query.genre,
      sort: query.sort,
      page: query.page,
      pageSize: query.pageSize,
    },
  })
  return {
    ...response.data,
    items: response.data.items.map(mapBookApiDtoToBook),
  }
}

export async function getBook(bookId: string): Promise<BookSummary> {
  const response = await axiosClient.get<BookApiDto>(`/books/${bookId}`)
  return mapBookApiDtoToBook(response.data)
}

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

export async function getFavouriteBooks(
  page: number,
  pageSize: number,
): Promise<PagedApiDto<BookSummary>> {
  const response = await axiosClient.get<PagedApiDto<BookApiDto>>('/books', {
    params: {
      favouritesOnly: true,
      page,
      pageSize,
    },
  })
  return {
    ...response.data,
    items: response.data.items.map(mapBookApiDtoToBook),
  }
}

export async function addBookToFavourites(bookId: string): Promise<void> {
  await axiosClient.post(`/books/${bookId}/favourites`)
}

export async function removeBookFromFavourites(bookId: string): Promise<void> {
  await axiosClient.delete(`/books/${bookId}/favourites`)
}

export async function addReview(
  bookId: string,
  review: SaveReviewRequest,
): Promise<ReviewApiDto> {
  const response = await axiosClient.post<ReviewApiDto>(
    `/books/${bookId}/reviews`,
    review,
  )
  return response.data
}

export async function updateReview(
  reviewId: string,
  review: SaveReviewRequest,
): Promise<ReviewApiDto> {
  const response = await axiosClient.put<ReviewApiDto>(
    `/books/reviews/${reviewId}`,
    review,
  )
  return response.data
}

export async function deleteReview(reviewId: string): Promise<void> {
  await axiosClient.delete(`/books/reviews/${reviewId}`)
}
