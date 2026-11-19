import type { BookApiDto, BookSummary } from '../../features/books/types'

export function mapBookApiDtoToBook(book: BookApiDto): BookSummary {
  return {
    ...book,
  }
}
