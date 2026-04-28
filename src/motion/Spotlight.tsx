import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useCursorPosition } from './hooks/useCursorPosition'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ============================================
// SPOTLIGHT
// ============================================
// Overlays a radial-gradient that follows the cursor on top of its
// child. The gradient hard-edges to transparent so it feels like a torch
// sweeping across the surface.
//
// The overlay is position: absolute inside a relatively positioned
// wrapper so it does not disturb the child's layout.

export interface SpotlightProps {
  children: ReactNode
  /**
   * Radius of the visible spotlight in px (full opacity at centre,
   * transparent at radius).
   * @default 240
   */
  radius?: number
  /**
   * Spotlight color (including alpha). Accepts any CSS color.
   * @default 'rgba(163, 91, 255, 0.35)'
   */
  color?: string
  /**
   * Smoothing factor for pointer tracking.
   * @default 0.15
   */
  damping?: number
  /**
   * Blend mode applied to the overlay. 'screen' gives a glow feel on
   * dark backgrounds; 'overlay' is more neutral.
   * @default 'screen'
   */
  blendMode?: CSSProperties['mixBlendMode']
  /**
   * Border radius applied to the wrapper so the spotlight clips to the
   * child's shape. Pass the same radius as the child element.
   * @default 'var(--radius-lg)'
   */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * Wraps a child in a cursor-following radial spotlight overlay.
 *
 * @example
 *   <Spotlight color="rgba(163, 91, 255, 0.4)" radius={280}>
 *     <Card padding="xl">Hover over me</Card>
 *   </Spotlight>
 */
export function Spotlight({
  children,
  radius = 240,
  color = 'rgba(163, 91, 255, 0.35)',
  damping = 0.15,
  blendMode = 'screen',
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const cursor = useCursorPosition(ref, { damping })

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    background: reduced
      ? 'transparent'
      : `radial-gradient(circle ${radius}px at ${cursor.x}px ${cursor.y}px, ${color}, transparent 70%)`,
    mixBlendMode: blendMode,
    opacity: cursor.inside && !reduced ? 1 : 0,
    transition: 'opacity 180ms ease-out'
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
