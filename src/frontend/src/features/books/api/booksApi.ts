import { axiosClient } from '../../../shared/api/axiosClient'
import { mapSearchDocumentToBook } from '../../../shared/utils/bookMappers'
import type { BookSummary, OpenLibrarySearchResponse } from '../types'

const FEATURED_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'cover_i',
  'subject',
].join(',')

export async function getFeaturedBooks(): Promise<BookSummary[]> {
  const response = await axiosClient.get<OpenLibrarySearchResponse>('/search.json', {
    params: {
      q: 'subject:classics language:eng',
      fields: FEATURED_FIELDS,
      limit: 12,
    },
  })

  const uniqueBooks = new Map<string, BookSummary>()

  for (const document of response.data.docs ?? []) {
    const book = mapSearchDocumentToBook(document)

    if (book?.coverId && !uniqueBooks.has(book.id)) {
      uniqueBooks.set(book.id, book)
    }
  }

  return [...uniqueBooks.values()].slice(0, 4)
}
