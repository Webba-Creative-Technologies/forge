import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useCursorPosition } from '../hooks/useCursorPosition'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// HOLO EFFECT
// ============================================
// Holographic sticker: silver surface with rainbow refraction bands
// always visible. Cursor movement shifts the bands and adds a glare,
// like tilting a real holographic label.

export interface HoloEffectProps {
  children: ReactNode
  /** Rainbow intensity (0 to 1). @default 0.55 */
  intensity?: number
  /** Angle of the refraction bands. @default 135 */
  angle?: number
  /** Border radius. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * Holographic sticker. Rainbow bands always visible, shift on cursor move.
 *
 * @example
 *   <HoloEffect>
 *     <div style={{ width: 200, height: 200, background: '#ddd' }}>
 *       Authentic
 *     </div>
 *   </HoloEffect>
 */
export function HoloEffect({
  children,
  intensity = 0.85,
  angle = 135,
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: HoloEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const cursor = useCursorPosition(ref, { damping: 0.08 })

  // Cursor shifts the gradient position (like tilting a real hologram)
  const shiftX = reduced ? 0 : cursor.inside ? cursor.relX * 30 : 0
  const shiftY = reduced ? 0 : cursor.inside ? cursor.relY * 30 : 0

  // Rainbow refraction: always visible, position shifts with cursor
  const refractionStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    opacity: intensity,
    background: `linear-gradient(
      ${angle}deg,
      hsla(350, 80%, 62%, 0.5) 0%,
      hsla(10, 75%, 64%, 0.2) 5%,
      hsla(25, 72%, 63%, 0.4) 10%,
      hsla(40, 68%, 66%, 0.15) 16%,
      hsla(55, 65%, 68%, 0.45) 22%,
      hsla(80, 58%, 67%, 0.2) 28%,
      hsla(110, 55%, 66%, 0.35) 34%,
      hsla(150, 50%, 64%, 0.15) 40%,
      hsla(180, 60%, 62%, 0.5) 46%,
      hsla(200, 68%, 61%, 0.25) 52%,
      hsla(220, 75%, 60%, 0.55) 58%,
      hsla(245, 72%, 62%, 0.2) 64%,
      hsla(270, 70%, 63%, 0.4) 70%,
      hsla(295, 65%, 64%, 0.15) 76%,
      hsla(320, 68%, 63%, 0.35) 82%,
      hsla(340, 72%, 62%, 0.2) 90%,
      hsla(350, 80%, 62%, 0.45) 100%
    )`,
    backgroundSize: '200% 200%',
    backgroundPosition: `${50 + shiftX}% ${50 + shiftY}%`,
    transition: reduced ? 'none' : 'background-position 80ms ease-out',
    mixBlendMode: 'hard-light' as CSSProperties['mixBlendMode'],
    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 15%, black 70%)',
    maskImage: 'radial-gradient(ellipse at center, transparent 15%, black 70%)'
  }

  // Glare: white spotlight that follows cursor
  const glareStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    opacity: cursor.inside && !reduced ? 0.35 : 0,
    background: cursor.inside
      ? `radial-gradient(circle 120px at ${((cursor.relX + 1) / 2) * 100}% ${((cursor.relY + 1) / 2) * 100}%, rgba(255,255,255,0.5), transparent 70%)`
      : 'none',
    transition: 'opacity 300ms ease-out'
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
      <div style={refractionStyle} aria-hidden="true" />
      <div style={glareStyle} aria-hidden="true" />
    </div>
  )
}
