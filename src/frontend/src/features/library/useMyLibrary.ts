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

export function useMyLibrary() {
  const [library, setLibrary] = useLocalStorage<LibraryRecord[]>(
    LIBRARY_KEY,
    EMPTY_LIBRARY,
  )

  return { library, setLibrary }
}
