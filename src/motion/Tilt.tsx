import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useCursorPosition, useTilt } from './hooks/useCursorPosition'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ============================================
// TILT
// ============================================

export interface TiltProps {
  children: ReactNode
  /** Max rotation angle in degrees. @default 10 */
  intensity?: number
  /** CSS perspective in px. @default 800 */
  perspective?: number
  /** Pointer smoothing factor. @default 0.15 */
  damping?: number
  /** Scale up slightly on hover. @default true */
  scale?: boolean
  /**
   * Add a diagonal light reflection that moves opposite to the cursor
   * (simulating a fixed light source above). Combines Tilt with Shine.
   * @default false
   */
  shine?: boolean
  /** Shine color. @default 'rgba(255, 255, 255, 0.15)' */
  shineColor?: string
  /** Border radius applied to the wrapper for clipping. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * 3D perspective tilt following the cursor. Pass `shine` for an
 * integrated diagonal light reflection.
 *
 * @example
 *   <Tilt intensity={15} shine>
 *     <Card>Product</Card>
 *   </Tilt>
 */
export function Tilt({
  children,
  intensity = 10,
  perspective = 800,
  damping = 0.15,
  scale = true,
  shine = false,
  shineColor = 'rgba(255, 255, 255, 0.15)',
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const cursor = useCursorPosition(ref, { damping })
  const { rotateX, rotateY } = useTilt(cursor, intensity)

  const scaleValue = scale && cursor.inside ? 1.02 : 1
  const transform = reduced
    ? 'none'
    : `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleValue})`

  const mergedStyle: CSSProperties = {
    display: 'inline-block',
    willChange: 'transform',
    transform,
    transformStyle: 'preserve-3d',
    transition: reduced ? 'none' : 'transform 120ms ease-out',
    position: 'relative',
    overflow: 'hidden',
    borderRadius,
    ...style
  }

  // Shine: diagonal band opposite to cursor. Combines relX + relY for
  // a true diagonal sweep. Soft gradient with multiple stops.
  const shineDiag = ((-cursor.relX - cursor.relY + 2) / 4) * 100
  const shineActive = cursor.inside && !reduced
  const shineStyle: CSSProperties | undefined = shine ? {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    background: shineActive
      ? `linear-gradient(130deg, transparent ${shineDiag - 30}%, rgba(255,255,255,0.03) ${shineDiag - 15}%, ${shineColor} ${shineDiag}%, rgba(255,255,255,0.03) ${shineDiag + 15}%, transparent ${shineDiag + 30}%)`
      : 'transparent',
    opacity: shineActive ? 1 : 0,
    transition: 'opacity 300ms ease-out',
    mixBlendMode: 'overlay' as CSSProperties['mixBlendMode'],
    zIndex: 1
  } : undefined

  return (
    <div ref={ref} className={className} style={mergedStyle}>
      {children}
      {shine && <div style={shineStyle} aria-hidden="true" />}
    </div>
  )
}
