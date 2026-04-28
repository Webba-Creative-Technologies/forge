import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// TYPEWRITER
// ============================================
// Types out one or more strings character by character. Supports a single
// string or a sequence (array of strings) which cycles with optional
// pause + backspace + loop.

export interface TypewriterProps {
  /**
   * The text(s) to type. Pass a single string for a one-shot effect or
   * an array for a sequence.
   */
  text: string | string[]
  /**
   * Characters per second (or ms per char if < 1).
   * @default 24 cps
   */
  speed?: number
  /**
   * Pause between sequences (ms).
   * @default 1200
   */
  pause?: number
  /**
   * Whether to backspace between strings (requires an array `text`).
   * @default true
   */
  deleteBetween?: boolean
  /**
   * Loop the sequence indefinitely.
   * @default true
   */
  loop?: boolean
  /**
   * Show the blinking cursor at the end of the current string.
   * @default true
   */
  cursor?: boolean
  /**
   * Cursor character.
   * @default '|'
   */
  cursorChar?: string
  /**
   * Fired when the sequence completes (only when `loop = false`).
   */
  onComplete?: () => void
  style?: CSSProperties
  className?: string
}

const CURSOR_BLINK_MS = 500

/**
 * Typewriter effect with sequence support.
 *
 * @example
 *   <Typewriter text={["Build fast", "Ship faster", "Forge it"]} />
 */
export function Typewriter({
  text,
  speed = 24,
  pause = 1200,
  deleteBetween = true,
  loop = true,
  cursor = true,
  cursorChar = '|',
  onComplete,
  style,
  className
}: TypewriterProps) {
  const strings = Array.isArray(text) ? text : [text]
  const reduced = useReducedMotion()

  const [displayed, setDisplayed] = useState('')
  const [blink, setBlink] = useState(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      setDisplayed(strings[0] ?? '')
      onComplete?.()
      return
    }

    let stringIdx = 0
    let charIdx = 0
    let deleting = false
    let cancelled = false

    const msPerChar = speed >= 1 ? 1000 / speed : speed

    const tick = () => {
      if (cancelled) return
      const current = strings[stringIdx] ?? ''
      if (!deleting) {
        charIdx++
        setDisplayed(current.slice(0, charIdx))
        if (charIdx >= current.length) {
          // Pause before next action
          if (strings.length === 1 && !loop) {
            onComplete?.()
            return
          }
          if (!deleteBetween) {
            timerRef.current = window.setTimeout(() => {
              stringIdx = (stringIdx + 1) % strings.length
              charIdx = 0
              setDisplayed('')
              tick()
            }, pause)
            return
          }
          timerRef.current = window.setTimeout(() => {
            deleting = true
            tick()
          }, pause)
          return
        }
      } else {
        charIdx--
        setDisplayed(current.slice(0, charIdx))
        if (charIdx <= 0) {
          deleting = false
          stringIdx = (stringIdx + 1) % strings.length
          if (stringIdx === 0 && !loop) {
            onComplete?.()
            return
          }
        }
      }
      timerRef.current = window.setTimeout(tick, msPerChar)
    }

    tick()

    return () => {
      cancelled = true
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [text, speed, pause, deleteBetween, loop, reduced])
  // onComplete is intentionally not a dep — we snapshot it at mount.

  useEffect(() => {
    if (!cursor || reduced) return
    const id = window.setInterval(() => setBlink((b) => !b), CURSOR_BLINK_MS)
    return () => window.clearInterval(id)
  }, [cursor, reduced])

  return (
    <span className={className} style={style}>
      {displayed}
      {cursor && (
        <span
          aria-hidden="true"
          style={{
            opacity: reduced ? 1 : blink ? 1 : 0,
            display: 'inline-block',
            marginLeft: 1
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}
