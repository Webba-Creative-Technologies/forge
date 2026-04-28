import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// NUMBER COUNTER
// ============================================
// Animates a number from `from` to `to` using requestAnimationFrame.
// Common on dashboards, pricing pages, stat counters.

export interface NumberCounterProps {
  /** Target value. */
  to: number
  /** Starting value. @default 0 */
  from?: number
  /** Animation duration in ms. @default 1200 */
  duration?: number
  /** Decimal places to show. @default 0 */
  decimals?: number
  /** Locale for number formatting (e.g. 'en-US' for commas). */
  locale?: string
  /** Prefix (e.g. '$', '€'). */
  prefix?: string
  /** Suffix (e.g. '%', '+', 'k'). */
  suffix?: string
  /** Easing function. @default ease-out */
  easing?: (t: number) => number
  style?: React.CSSProperties
  className?: string
}

const defaultEasing = (t: number) => 1 - Math.pow(1 - t, 3) // ease-out cubic

/**
 * Animated number counter. Counts from `from` to `to` over `duration`
 * milliseconds with an easing curve.
 *
 * @example
 *   <NumberCounter to={12450} prefix="$" locale="en-US" />
 *   <NumberCounter to={99.9} decimals={1} suffix="%" />
 */
export function NumberCounter({
  to,
  from = 0,
  duration = 1200,
  decimals = 0,
  locale,
  prefix = '',
  suffix = '',
  easing = defaultEasing,
  style,
  className
}: NumberCounterProps) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? to : from)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduced) {
      setValue(to)
      return
    }
    const start = performance.now()
    const startValue = from

    const tick = () => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easing(progress)
      setValue(startValue + (to - startValue) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [to, from, duration, easing, reduced])

  const formatted = locale
    ? value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    : value.toFixed(decimals)

  return (
    <span className={className} style={style}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
