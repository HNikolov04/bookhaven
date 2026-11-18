export type BookFilterValues = {
  query: string
  genre: string
  sort: 'relevance' | 'newest' | 'oldest'
}

type BookFiltersProps = {
  value: BookFilterValues
  onChange: (value: BookFilterValues) => void
}

export function BookFilters({ value, onChange }: BookFiltersProps) {
  return (
    <form aria-label="Book filters" onSubmit={(event) => event.preventDefault()}>
      <label>
        Search books
        <input
          onChange={(event) => onChange({ ...value, query: event.target.value })}
          type="search"
          value={value.query}
        />
      </label>
    </form>
  )
}
