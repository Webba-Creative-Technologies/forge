import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useCursorPosition } from '../hooks/useCursorPosition'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// GLOW AREA
// ============================================
// Renders a soft radial glow that follows the cursor within the wrapped
// area. Differs from Spotlight in that it's behind the content and uses
// a softer falloff — useful for adding ambient brand light to sections.

export interface GlowAreaProps {
  children: ReactNode
  /** Radius of the glow in px. @default 360 */
  radius?: number
  /** Glow color (with alpha). @default 'rgba(163, 91, 255, 0.25)' */
  color?: string
  /**
   * Intensity (0-1). Scales the opacity of the glow.
   * @default 1
   */
  intensity?: number
  style?: CSSProperties
  className?: string
}

/**
 * Ambient cursor-following glow placed BEHIND the children. Ideal for
 * large hero sections or card grids where you want a subtle light
 * presence rather than a spotlight.
 *
 * @example
 *   <GlowArea color="rgba(163, 91, 255, 0.4)" radius={500}>
 *     <HeroContent />
 *   </GlowArea>
 */
export function GlowArea({
  children,
  radius = 360,
  color = 'rgba(163, 91, 255, 0.25)',
  intensity = 1,
  style,
  className
}: GlowAreaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const cursor = useCursorPosition(ref, { damping: 0.18 })

  const glowStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    background:
      reduced || !cursor.inside
        ? 'transparent'
        : `radial-gradient(circle ${radius}px at ${cursor.x}px ${cursor.y}px, ${color}, transparent 65%)`,
    opacity: cursor.inside && !reduced ? intensity : 0,
    transition: 'opacity 220ms ease-out',
    zIndex: 0
  }

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    ...style
  }

  return (
    <div ref={ref} className={className} style={wrapperStyle}>
      <div style={glowStyle} aria-hidden="true" />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
