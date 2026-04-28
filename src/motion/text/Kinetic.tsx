import type { CSSProperties } from 'react'

// ============================================
// KINETIC TEXT
// ============================================
// Letters animate individually via staggered CSS animation delays. Each
// character is wrapped in a span and tagged with a `forge-motion-kinetic-char--${type}`
// class from motion.css.

export interface KineticProps {
  /**
   * Text to animate. Must be a string — JSX children are not supported
   * because we split per character.
   */
  children: string
  /**
   * Animation type.
   * - 'wave'   — gentle up/down
   * - 'rubber' — horizontal stretch
   * - 'float'  — slight rotate + float
   */
  type?: 'wave' | 'rubber' | 'float'
  /**
   * Delay offset between successive characters in ms.
   * @default 80
   */
  stagger?: number
  /**
   * Override the animation duration (affects all chars) — falls back to
   * the CSS default set in motion.css (1.6s).
   */
  duration?: number
  style?: CSSProperties
  className?: string
}

const SPACE_MARKER = '\u00A0'

/**
 * Animate text character by character with a shared motion pattern.
 * Spaces are preserved and stay non-animated.
 *
 * @example
 *   <Kinetic type="wave" stagger={80}>Expressive</Kinetic>
 */
export function Kinetic({
  children,
  type = 'wave',
  stagger = 80,
  duration,
  style,
  className
}: KineticProps) {
  const chars = Array.from(children)

  return (
    <span className={className} style={style}>
      {chars.map((char, i) => {
        const isSpace = char === ' '
        const charStyle: CSSProperties = {
          animationDelay: `${i * stagger}ms`,
          ...(duration ? { animationDuration: `${duration}ms` } : {})
        }
        return (
          <span
            key={i}
            className={isSpace ? undefined : `forge-motion-kinetic-char forge-motion-kinetic-char--${type}`}
            style={isSpace ? undefined : charStyle}
          >
            {isSpace ? SPACE_MARKER : char}
          </span>
        )
      })}
    </span>
  )
}
