import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import type { BookSummary } from '../books/types'
import type { ReadingStatusValue } from './ReadingStatus'

const LIBRARY_KEY = 'bookhaven.library.v1'
const EMPTY_LIBRARY: LibraryRecord[] = []

export type LibraryRecord = {
  book: BookSummary
  status: ReadingStatusValue
  review: string | null
  updatedAt: string
}

function isLibraryRecord(value: unknown): value is LibraryRecord {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<LibraryRecord>
  return Boolean(
    candidate.book &&
      typeof candidate.book.id === 'string' &&
      typeof candidate.book.title === 'string' &&
      ['want-to-read', 'reading', 'completed'].includes(candidate.status ?? '') &&
      typeof candidate.updatedAt === 'string',
  )
}

export function useMyLibrary() {
  const [library, setLibrary] = useLocalStorage<LibraryRecord[]>(
    LIBRARY_KEY,
    EMPTY_LIBRARY,
  )
  const safeLibrary = useMemo(
    () => (Array.isArray(library) ? library.filter(isLibraryRecord) : EMPTY_LIBRARY),
    [library],
  )

  const isInLibrary = useCallback(
    (bookId: string) => safeLibrary.some(({ book }) => book.id === bookId),
    [safeLibrary],
  )

  const toggleBook = useCallback(
    (book: BookSummary) => {
      setLibrary((currentLibrary) => {
        const safeCurrentLibrary = Array.isArray(currentLibrary)
          ? currentLibrary.filter(isLibraryRecord)
          : EMPTY_LIBRARY
        const exists = safeCurrentLibrary.some(
          ({ book: libraryBook }) => libraryBook.id === book.id,
        )

        if (exists) {
          return safeCurrentLibrary.filter(
            ({ book: libraryBook }) => libraryBook.id !== book.id,
          )
        }

        return [
          ...safeCurrentLibrary,
          {
            book,
            status: 'want-to-read',
            review: null,
            updatedAt: new Date().toISOString(),
          },
        ]
      })
    },
    [setLibrary],
  )

  return { library: safeLibrary, isInLibrary, toggleBook, setLibrary }
}
