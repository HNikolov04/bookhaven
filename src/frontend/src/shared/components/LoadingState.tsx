import { Skeleton } from '@mui/material'
import { BookGrid } from './BookGrid'

export function LoadingState({ count = 4 }: { count?: number }) {
  return (
    <BookGrid>
      {Array.from({ length: count }, (_, index) => (
        <div className="book-card book-card--loading" key={index}>
          <Skeleton animation="wave" className="book-card__cover-skeleton" />
          <Skeleton animation="wave" height={28} width="82%" />
          <Skeleton animation="wave" height={20} width="58%" />
        </div>
      ))}
    </BookGrid>
  )
}
