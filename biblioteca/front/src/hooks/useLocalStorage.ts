import { useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  function set(val: T | ((prev: T) => T)) {
    setState(prev => {
      const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val
      try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return [state, set] as const
}
