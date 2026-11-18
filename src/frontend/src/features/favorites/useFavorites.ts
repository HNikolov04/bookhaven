import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import type { BookSummary } from '../books/types'

const FAVORITES_KEY = 'bookhaven.favorites.v1'
const EMPTY_FAVORITES: FavoriteRecord[] = []

export type FavoriteRecord = {
  book: BookSummary
  createdAt: string
}

function isFavoriteRecord(value: unknown): value is FavoriteRecord {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<FavoriteRecord>
  return Boolean(
    candidate.book &&
      typeof candidate.book.id === 'string' &&
      typeof candidate.book.title === 'string' &&
      typeof candidate.createdAt === 'string',
  )
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteRecord[]>(
    FAVORITES_KEY,
    EMPTY_FAVORITES,
  )
  const safeFavorites = useMemo(
    () => (Array.isArray(favorites) ? favorites.filter(isFavoriteRecord) : EMPTY_FAVORITES),
    [favorites],
  )

  const isFavorite = useCallback(
    (bookId: string) => safeFavorites.some(({ book }) => book.id === bookId),
    [safeFavorites],
  )

  const toggleFavorite = useCallback(
    (book: BookSummary) => {
      setFavorites((currentFavorites) => {
        const safeCurrentFavorites = Array.isArray(currentFavorites)
          ? currentFavorites
          : EMPTY_FAVORITES
        const exists = safeCurrentFavorites.some(
          ({ book: favoriteBook }) => favoriteBook.id === book.id,
        )

        if (exists) {
          return safeCurrentFavorites.filter(
            ({ book: favoriteBook }) => favoriteBook.id !== book.id,
          )
        }

        return [
          ...safeCurrentFavorites,
          { book, createdAt: new Date().toISOString() },
        ]
      })
    },
    [setFavorites],
  )

  return { favorites: safeFavorites, isFavorite, toggleFavorite }
}
