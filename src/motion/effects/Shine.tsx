import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useCursorPosition } from '../hooks/useCursorPosition'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// SHINE
// ============================================
// A diagonal light reflection that moves across the child surface
// following the cursor. Unlike Spotlight (radial glow), Shine produces
// a narrow angled band like the reflection on a credit card or
// holographic surface.

export interface ShineProps {
  children: ReactNode
  /** Width of the shine band in px. @default 120 */
  width?: number
  /** Angle of the shine band in degrees. @default 35 */
  angle?: number
  /** Shine color with alpha. @default 'rgba(255, 255, 255, 0.15)' */
  color?: string
  /** Border radius to clip the shine. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * Diagonal light reflection that follows the cursor across the surface.
 *
 * @example
 *   <Shine>
 *     <Card padding="xl">Product</Card>
 *   </Shine>
 */
export function Shine({
  children,
  width = 120,
  angle = 35,
  color = 'rgba(255, 255, 255, 0.15)',
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: ShineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const cursor = useCursorPosition(ref, { damping: 0.1 })

  // Diagonal sweep opposite to cursor. Combines X + Y for full coverage.
  const diag = ((-cursor.relX - cursor.relY + 2) / 4) * 100
  const active = cursor.inside && !reduced
  const halfBand = width / 6

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    background: active
      ? `linear-gradient(${angle}deg, transparent ${diag - halfBand * 2}%, rgba(255,255,255,0.03) ${diag - halfBand}%, ${color} ${diag}%, rgba(255,255,255,0.03) ${diag + halfBand}%, transparent ${diag + halfBand * 2}%)`
      : 'transparent',
    opacity: active ? 1 : 0,
    transition: 'opacity 300ms ease-out',
    mixBlendMode: 'overlay' as CSSProperties['mixBlendMode']
  }

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius,
    ...style
  }

  return (
    <div ref={ref} className={className} style={wrapperStyle}>
      {children}
      <div style={overlayStyle} aria-hidden="true" />
    </div>
  )
}
