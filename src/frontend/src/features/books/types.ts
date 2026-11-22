export const genres = [
  'fiction',
  'scienceFiction',
  'fantasy',
  'mystery',
  'nonFiction',
  'history',
  'biography',
  'romance',
] as const

export type Genre = (typeof genres)[number]

export const bookSortOptions = [
  'titleAscending',
  'titleDescending',
  'authorAscending',
  'newest',
  'oldest',
] as const

export type BookSort = (typeof bookSortOptions)[number]

export type BookSummary = {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  author: {
    id: string
    name: string
    description: string | null
  }
  pictureUrl: string
  genres: Genre[]
  pages: number
  publishYear: number
  averageStars: number
  ratingVotes: number
  isFeatured: boolean
  isFavourite: boolean
  reviews: ReviewApiDto[]
}

export type ReviewApiDto = {
  id: string
  bookId: string
  userId: string
  userEmail: string
  text: string
  stars: number
  createdAtUtc: string
}

export type BookApiDto = BookSummary

export type PagedApiDto<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type BookQuery = {
  search: string
  genre?: Genre
  sort: BookSort
  page: number
  pageSize: number
}

export type SaveReviewRequest = {
  text: string
  stars: number
}
