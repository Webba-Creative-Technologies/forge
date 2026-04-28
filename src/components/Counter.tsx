import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

// ============================================
// USE COUNT UP
// ============================================
// Animated number counter hook. Eases from `from` to `value` over
// `duration` ms once on mount. Subsequent value changes do NOT re-animate
// — that avoids flicker when filter / range changes update the value
// every keystroke. If you need re-animation on every value change, key
// the consuming component on `value`.
//
// @example
//   const animated = useCountUp(t.value, 900)
//   <Heading>{fmtUSD(animated)}</Heading>

export function useCountUp(value: number, duration = 800, from = 0): number {
  const [n, setN] = useState(from)
  // Track the animation start to support a fast-path skip when the user
  // has reduced motion preference set.
  const startRef = useRef(0)
  useEffect(() => {
    if (typeof window === 'undefined') {
      setN(value)
      return
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setN(value)
      return
    }
    let raf = 0
    startRef.current = performance.now()
    const tick = (t: number) => {
      const progress = Math.min(1, (t - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setN(from + (value - from) * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return n
}

// ============================================
// COUNTER
// ============================================
// Inline animated number. Wraps `useCountUp` and runs the result through
// an optional `format` function (defaults to integer formatter). Use it
// when you want a single ticking value without managing the hook state
// in the parent.
//
// @example
//   <Counter value={1247832} duration={900} format={n => fmtUSD(n, 0)} />
//   <Counter value={87} suffix="%" />

interface CounterProps {
  /** Final value to count up to. */
  value: number
  /** Animation duration in ms. @default 800 */
  duration?: number
  /** Starting value. @default 0 */
  from?: number
  /** Format the live value. Defaults to `Math.round(n).toLocaleString()`. */
  format?: (n: number) => string
  /** Optional prefix rendered before the number. */
  prefix?: ReactNode
  /** Optional suffix rendered after the number. */
  suffix?: ReactNode
  className?: string
  style?: CSSProperties
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString()

export function Counter({
  value,
  duration,
  from,
  format,
  prefix,
  suffix,
  className,
  style
}: CounterProps) {
  const n = useCountUp(value, duration, from)
  const fmt = format ?? defaultFormat
  return (
    <span
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums lining-nums', ...style }}
    >
      {prefix}
      {fmt(n)}
      {suffix}
    </span>
  )
}
