import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================
// MOTION VALUE
// ============================================
// Lightweight, React-free scalar state for animations. Subscribers receive
// the new value on every `set` call. The returned `useMotionValue` hook is
// a thin wrapper that lets React components read/write a motion value
// without forcing a re-render on every frame.
//
// Inspired by framer-motion's MotionValue but intentionally simpler.

export type MotionValueListener<T> = (value: T) => void

export class MotionValue<T = number> {
  private currentValue: T
  private listeners = new Set<MotionValueListener<T>>()

  constructor(initial: T) {
    this.currentValue = initial
  }

  get(): T {
    return this.currentValue
  }

  set(next: T): void {
    if (next === this.currentValue) return
    this.currentValue = next
    this.listeners.forEach((l) => l(next))
  }

  on(listener: MotionValueListener<T>): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  destroy(): void {
    this.listeners.clear()
  }
}

/**
 * Returns a stable `MotionValue` instance. The value persists across
 * renders and does NOT trigger re-renders on change — consumers who need
 * React state should call `useMotionValueState` instead or use
 * `useTransform` to derive reactive state.
 *
 * @example
 *   const x = useMotionValue(0)
 *   useEffect(() => x.set(window.scrollY), [scroll])
 */
export function useMotionValue<T = number>(initial: T): MotionValue<T> {
  const ref = useRef<MotionValue<T> | null>(null)
  if (ref.current === null) ref.current = new MotionValue<T>(initial)
  useEffect(() => {
    return () => {
      ref.current?.destroy()
    }
  }, [])
  return ref.current
}

/**
 * Subscribes to a `MotionValue` and returns its current value as React
 * state. Every change triggers a re-render — use sparingly, prefer direct
 * DOM writes via `useEffect(() => motion.on(v => el.style.x = v))` on hot
 * paths.
 *
 * @example
 *   const xState = useMotionValueState(x)
 *   return <div>{xState}</div>
 */
export function useMotionValueState<T>(value: MotionValue<T>): T {
  const [snap, setSnap] = useState<T>(() => value.get())
  useEffect(() => value.on((v) => setSnap(v)), [value])
  return snap
}

/**
 * Derive a new MotionValue from another using a mapping function. The
 * mapping runs on every source update; the derived MotionValue does NOT
 * trigger React re-renders unless paired with `useMotionValueState`.
 *
 * Supports two signatures:
 *  - useTransform(source, fn)  — free-form mapping
 *  - useTransform(source, [inputRange], [outputRange]) — piecewise lerp
 *
 * @example
 *   const x = useMotionValue(0)
 *   const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
 *   const hue = useTransform(x, (v) => `hsl(${v % 360}, 80%, 60%)`)
 */
export function useTransform<T, U>(
  source: MotionValue<T>,
  mapper: (value: T) => U
): MotionValue<U>
export function useTransform(
  source: MotionValue<number>,
  inputRange: number[],
  outputRange: number[]
): MotionValue<number>
export function useTransform<T, U>(
  source: MotionValue<T>,
  mapperOrInput: ((value: T) => U) | number[],
  outputRange?: number[]
): MotionValue<U | number> {
  const derivedRef = useRef<MotionValue<U | number> | null>(null)

  // Build the mapping function once from the provided signature
  const mapFn = useCallback<(value: T) => U | number>(
    (v) => {
      if (typeof mapperOrInput === 'function') return mapperOrInput(v)
      if (!outputRange) return v as unknown as number
      const input = mapperOrInput
      const value = v as unknown as number
      // Piecewise linear interpolation between the ranges
      if (value <= input[0]) return outputRange[0]
      if (value >= input[input.length - 1]) return outputRange[input.length - 1]
      for (let i = 0; i < input.length - 1; i++) {
        if (value >= input[i] && value <= input[i + 1]) {
          const t = (value - input[i]) / (input[i + 1] - input[i])
          return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * t
        }
      }
      return outputRange[0]
    },
    [mapperOrInput, outputRange]
  )

  if (derivedRef.current === null) {
    derivedRef.current = new MotionValue<U | number>(mapFn(source.get()))
  }

  useEffect(() => {
    const unsubscribe = source.on((v) => {
      derivedRef.current?.set(mapFn(v))
    })
    return () => {
      unsubscribe()
    }
  }, [source, mapFn])

  return derivedRef.current
}
