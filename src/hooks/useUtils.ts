import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useDebounce — debounce a value by `delay` ms.
 * The returned value only updates after the input stays stable for the delay.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

/**
 * useThrottle — throttle a value so it updates at most once per `interval` ms.
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttled, setThrottled] = useState<T>(value)
  const lastRun = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastRun.current
    if (elapsed >= interval) {
      setThrottled(value)
      lastRun.current = now
      return
    }
    const id = setTimeout(() => {
      setThrottled(value)
      lastRun.current = Date.now()
    }, interval - elapsed)
    return () => clearTimeout(id)
  }, [value, interval])

  return throttled
}

/**
 * useLocalStorage — synced state backed by localStorage.
 * Returns `[value, setValue, remove]`.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  }, [key, initial])

  const [value, setValue] = useState<T>(read)

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        // storage full or unavailable, ignore
      }
      return resolved
    })
  }, [key])

  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
    setValue(initial)
  }, [key, initial])

  // Sync when other tabs change the same key
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return
      if (e.newValue === null) setValue(initial)
      else {
        try { setValue(JSON.parse(e.newValue) as T) } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initial])

  return [value, update, remove]
}

/**
 * useSessionStorage — same shape as useLocalStorage but backed by sessionStorage.
 */
export function useSessionStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.sessionStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  }, [key, initial])

  const [value, setValue] = useState<T>(read)

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      try {
        if (typeof window !== 'undefined') window.sessionStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        // ignore
      }
      return resolved
    })
  }, [key])

  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') window.sessionStorage.removeItem(key)
    } catch {
      // ignore
    }
    setValue(initial)
  }, [key, initial])

  return [value, update, remove]
}

/**
 * useClickOutside — call `handler` when a click lands outside `ref.current`.
 * Returns nothing; pass the handler via dependency.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (!el || el.contains(e.target as Node)) return
      handler(e)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

/**
 * usePrevious — remember the previous render's value.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => { ref.current = value }, [value])
  return ref.current
}
