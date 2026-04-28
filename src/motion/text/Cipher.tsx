import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// CIPHER (Matrix-style reveal)
// ============================================
// Characters are initially shown as random glyphs from a pool. Over the
// course of `duration`, each character progressively "solves" to its
// correct value with the left-most chars locking first.

const DEFAULT_POOL = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export interface CipherProps {
  /** The text to reveal. */
  text: string
  /** Total duration of the reveal in ms. @default 1400 */
  duration?: number
  /** When to start: 'mount' (on first render), 'hover' (on pointer enter). */
  trigger?: 'mount' | 'hover'
  /** Custom character pool for the scramble effect. */
  pool?: string
  /** How many frames per solved character. Lower = faster glyph churn. @default 2 */
  churn?: number
  style?: CSSProperties
  className?: string
}

/**
 * Matrix-style text reveal. Each character scrambles then locks into its
 * correct value from left to right.
 *
 * @example
 *   <Cipher text="Expressive" trigger="mount" />
 */
export function Cipher({
  text,
  duration = 1400,
  trigger = 'mount',
  pool = DEFAULT_POOL,
  churn = 2,
  style,
  className
}: CipherProps) {
  const reduced = useReducedMotion()
  const [displayed, setDisplayed] = useState(trigger === 'mount' ? '' : text)
  const runningRef = useRef(false)

  const start = () => {
    if (runningRef.current) return
    runningRef.current = true

    if (reduced) {
      setDisplayed(text)
      runningRef.current = false
      return
    }

    const total = text.length
    const startTime = performance.now()
    let frame = 0

    const tick = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const solvedCount = Math.floor(progress * total)

      let out = ''
      for (let i = 0; i < total; i++) {
        if (text[i] === ' ') {
          out += ' '
          continue
        }
        if (i < solvedCount) {
          out += text[i]
        } else if (frame % churn === 0) {
          out += pool[Math.floor(Math.random() * pool.length)]
        } else {
          out += displayedRef.current[i] ?? pool[Math.floor(Math.random() * pool.length)]
        }
      }
      displayedRef.current = out
      setDisplayed(out)
      frame++

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayed(text)
        runningRef.current = false
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const displayedRef = useRef<string>('')
  const rafRef = useRef(0)

  useEffect(() => {
    if (trigger === 'mount') start()
    return () => {
      cancelAnimationFrame(rafRef.current)
      runningRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const mergedStyle: CSSProperties = {
    display: 'inline-block',
    ...style
  }

  return (
    <span
      className={`forge-motion-cipher ${className ?? ''}`.trim()}
      style={mergedStyle}
      onPointerEnter={trigger === 'hover' ? start : undefined}
    >
      {displayed || text.replace(/./g, ' ')}
    </span>
  )
}
