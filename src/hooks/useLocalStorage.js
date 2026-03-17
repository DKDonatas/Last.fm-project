import { useCallback, useState } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const set = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {}
        return next
      })
    },
    [key],
  )

  return [value, set]
}
