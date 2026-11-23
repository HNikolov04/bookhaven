import { genres, type BookSort, type Genre } from '../types'

export const genreLabels: Record<Genre, string> = {
  fiction: 'Fiction',
  scienceFiction: 'Science Fiction',
  fantasy: 'Fantasy',
  mystery: 'Mystery',
  nonFiction: 'Non-Fiction',
  history: 'History',
  biography: 'Biography',
  romance: 'Romance',
}

export const genreOptions = genres.map((value) => ({
  value,
  label: genreLabels[value],
}))

export const sortOptions = [
  { value: 'titleAscending', label: 'Title (A–Z)' },
  { value: 'titleDescending', label: 'Title (Z–A)' },
  { value: 'authorAscending', label: 'Author (A–Z)' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
] satisfies ReadonlyArray<{ value: BookSort; label: string }>
