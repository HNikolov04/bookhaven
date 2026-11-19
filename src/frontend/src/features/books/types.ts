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
  genres: string[]
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
