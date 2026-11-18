export type ReadingStatusValue = 'want-to-read' | 'reading' | 'completed'

type ReadingStatusProps = {
  value: ReadingStatusValue
  onChange: (value: ReadingStatusValue) => void
}

export function ReadingStatus({ value, onChange }: ReadingStatusProps) {
  return (
    <label>
      Reading status
      <select
        onChange={(event) => onChange(event.target.value as ReadingStatusValue)}
        value={value}
      >
        <option value="want-to-read">Want to read</option>
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
      </select>
    </label>
  )
}
