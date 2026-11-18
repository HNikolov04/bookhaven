import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from 'react'

const LOCAL_STORAGE_EVENT = 'bookhaven:local-storage'

function readValue<T>(key: string, initialValue: T): T {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue === null ? initialValue : (JSON.parse(storedValue) as T)
  } catch {
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        const nextValue = readValue(key, initialValue)
        valueRef.current = nextValue
        setValue(nextValue)
      }
    }

    const handleLocalStorage = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string }>
      if (customEvent.detail.key === key) {
        const nextValue = readValue(key, initialValue)
        valueRef.current = nextValue
        setValue(nextValue)
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage)
    }
  }, [initialValue, key])

  const updateValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (value: T) => T)(valueRef.current)
          : nextValue

      valueRef.current = resolvedValue
      window.localStorage.setItem(key, JSON.stringify(resolvedValue))
      setValue(resolvedValue)
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_EVENT, { detail: { key } }),
      )
    },
    [key],
  )

  return [value, updateValue] as const
}
