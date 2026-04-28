import { useRef, type ReactNode, type CSSProperties } from 'react'
import {
  useCursorPosition,
  useMagneticAttraction
} from './hooks/useCursorPosition'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ============================================
// MAGNETIC
// ============================================

export interface MagneticProps {
  children: ReactNode
  /** Radius of the magnetic zone in px. @default 120 */
  radius?: number
  /** Max travel as fraction of radius. @default 0.3 */
  strength?: number
  /** Smoothing factor (lower = smoother). @default 0.08 */
  damping?: number
  style?: CSSProperties
  className?: string
}

/**
 * A zone that pulls its child toward the cursor within a radius.
 *
 * @example
 *   <Magnetic radius={150} strength={0.4}>
 *     <Button>Hover me</Button>
 *   </Magnetic>
 */
export function Magnetic({
  children,
  radius = 120,
  strength = 0.3,
  damping = 0.08,
  style,
  className
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const cursor = useCursorPosition(ref, { damping, trackOutside: true })
  const { translateX, translateY } = useMagneticAttraction(cursor, radius, strength)

  // No CSS transition: the dampedLerp in useCursorPosition already
  // produces smooth intermediate values on every rAF frame. Adding
  // CSS transition on top creates double-interpolation jank.
  const mergedStyle: CSSProperties = {
    display: 'inline-block',
    willChange: 'transform',
    transform: reduced
      ? 'none'
      : `translate3d(${translateX}px, ${translateY}px, 0)`,
    ...style
  }

  return (
    <div ref={ref} className={className} style={mergedStyle}>
      {children}
    </div>
  )
}
