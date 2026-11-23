import type { BookQuery } from '../types'

export const bookQueryKeys = {
  all: ['books'] as const,
  catalog: (query: BookQuery) => ['books', 'catalog', query] as const,
  detail: (bookId: string | undefined) => ['books', 'detail', bookId] as const,
  featured: ['books', 'featured'] as const,
  favourites: (page: number, pageSize: number) =>
    ['books', 'favourites', { page, pageSize }] as const,
}
