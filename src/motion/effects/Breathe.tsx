import type { CSSProperties, ReactNode } from 'react'

// ============================================
// BREATHE
// ============================================
// Subtle lifelike scale + opacity pulse. Used on empty states, "waiting"
// indicators or hero ornaments to signal the app is alive.

export interface BreatheProps {
  children: ReactNode
  /** Cycle duration in seconds. @default 4 */
  duration?: number
  style?: CSSProperties
  className?: string
}

/**
 * Gentle scale + opacity pulse (lifelike "breathing" motion).
 *
 * @example
 *   <Breathe><EmptyStateIllustration /></Breathe>
 */
export function Breathe({ children, duration = 4, style, className }: BreatheProps) {
  const mergedStyle: CSSProperties = {
    display: 'inline-block',
    animationDuration: `${duration}s`,
    ...style
  }

  return (
    <div
      className={`forge-motion-breathe ${className ?? ''}`.trim()}
      style={mergedStyle}
    >
      {children}
    </div>
  )
}
