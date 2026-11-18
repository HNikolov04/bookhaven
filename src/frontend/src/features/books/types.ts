export type BookSummary = {
  id: string
  title: string
  authors: string[]
  firstPublishYear: number | null
  coverId: number | null
  subjects: string[]
}

export type OpenLibrarySearchDocument = {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
}

export type OpenLibrarySearchResponse = {
  docs?: OpenLibrarySearchDocument[]
  numFound?: number
  num_found?: number
}
