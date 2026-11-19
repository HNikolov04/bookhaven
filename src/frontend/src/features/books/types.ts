export type BookSummary = {
  id: string
  title: string
  authors: string[]
  firstPublishYear: number | null
  coverUrl: string | null
  genre: string
}

export type BookApiDto = {
  id: string
  title: string
  description: string | null
  firstPublishedYear: number | null
  coverUrl: string | null
  genre: string
  isFeatured: boolean
  authors: string[]
}

export type PagedApiDto<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
