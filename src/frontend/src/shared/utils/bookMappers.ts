import type {
  BookSummary,
  OpenLibrarySearchDocument,
} from '../../features/books/types'

const UNKNOWN_AUTHOR = 'Unknown author'

export function mapSearchDocumentToBook(
  document: OpenLibrarySearchDocument,
): BookSummary | null {
  const id = document.key?.replace('/works/', '').trim()
  const title = document.title?.trim()

  if (!id || !title) {
    return null
  }

  const authors = document.author_name
    ?.map((author) => author.trim())
    .filter(Boolean)

  return {
    id,
    title,
    authors: authors?.length ? authors : [UNKNOWN_AUTHOR],
    firstPublishYear: document.first_publish_year ?? null,
    coverId: document.cover_i ?? null,
    subjects: document.subject?.slice(0, 4) ?? [],
  }
}

export function getBookCoverUrl(
  coverId: number,
  size: 'S' | 'M' | 'L' = 'M',
) {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`
}
