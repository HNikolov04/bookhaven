import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import type { BookSort, Genre } from './types'

export type BookFilterValues = {
  query: string
  genre?: Genre
  sort: BookSort
}

type BookFiltersProps = {
  value: BookFilterValues
  onChange: (value: BookFilterValues) => void
}

const genreOptions: { value: Genre; label: string }[] = [
  { value: 'fiction', label: 'Fiction' },
  { value: 'scienceFiction', label: 'Science Fiction' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'nonFiction', label: 'Non-Fiction' },
  { value: 'history', label: 'History' },
  { value: 'biography', label: 'Biography' },
  { value: 'romance', label: 'Romance' },
]

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="search-field__icon" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

export function BookSearch({ value, onChange }: BookFiltersProps) {
  return (
    <TextField
      aria-label="Search books"
      className="catalog-search"
      fullWidth
      onChange={(event) => onChange({ ...value, query: event.target.value })}
      placeholder="Search by title or author..."
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      type="search"
      value={value.query}
    />
  )
}

export function BookFilters({ value, onChange }: BookFiltersProps) {
  return (
    <aside aria-label="Catalog filters" className="catalog-sidebar">
      <fieldset className="filter-group">
        <legend>Genre</legend>
        <FormControlLabel
          control={(
            <Checkbox
              checked={!value.genre}
              onChange={() => onChange({ ...value, genre: undefined })}
              size="small"
            />
          )}
          label="All genres"
        />
        {genreOptions.map((genre) => (
          <FormControlLabel
            control={(
              <Checkbox
                checked={value.genre === genre.value}
                onChange={() => onChange({ ...value, genre: genre.value })}
                size="small"
              />
            )}
            key={genre.value}
            label={genre.label}
          />
        ))}
      </fieldset>

      <div className="filter-group">
        <label htmlFor="catalog-sort">Sort by</label>
        <FormControl fullWidth size="small">
          <Select
            id="catalog-sort"
            onChange={(event) => onChange({
              ...value,
              sort: event.target.value as BookSort,
            })}
            value={value.sort}
          >
            <MenuItem value="titleAscending">Title (A–Z)</MenuItem>
            <MenuItem value="titleDescending">Title (Z–A)</MenuItem>
            <MenuItem value="authorAscending">Author (A–Z)</MenuItem>
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
          </Select>
        </FormControl>
      </div>
    </aside>
  )
}
