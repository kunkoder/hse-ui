import { useState, useEffect } from "react"

/**
 * Custom hook to debounce a value
 * @param value - the value to debounce
 * @param delay - delay in milliseconds
 * @returns debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timer to update the debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup if value changes before delay
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}