import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { genreOptions, sortOptions } from '../constants/bookOptions'
import type { BookSort, Genre } from '../types'

export type BookFilterValues = {
  query: string
  genre?: Genre
  sort: BookSort
}

type BookFiltersProps = {
  value: BookFilterValues
  onChange: (value: BookFilterValues) => void
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
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </aside>
  )
}
