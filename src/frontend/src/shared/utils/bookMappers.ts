import type { BookApiDto, BookSummary } from '../../features/books/types'

const UNKNOWN_AUTHOR = 'Unknown author'

export function mapBookApiDtoToBook(book: BookApiDto): BookSummary {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors.length > 0 ? book.authors : [UNKNOWN_AUTHOR],
    firstPublishYear: book.firstPublishedYear,
    coverUrl: book.coverUrl,
    genre: book.genre,
  }
}
