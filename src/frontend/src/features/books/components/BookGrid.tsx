import type { ReactNode } from 'react'

type BookGridProps = {
  children: ReactNode
}

export function BookGrid({ children }: BookGridProps) {
  return <div className="book-grid">{children}</div>
}
