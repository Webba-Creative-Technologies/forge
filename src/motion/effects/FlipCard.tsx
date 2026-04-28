import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASINGS } from '../tokens'

// ============================================
// FLIP CARD
// ============================================
// A 3D card with front and back faces. Flips on click or hover
// using CSS perspective + rotateY + backface-visibility.

export interface FlipCardProps {
  /** Content for the front face. */
  front: ReactNode
  /** Content for the back face. */
  back: ReactNode
  /** What triggers the flip. @default 'click' */
  trigger?: 'click' | 'hover'
  /** Controlled flip state. When provided, internal state is ignored. */
  flipped?: boolean
  /** Flip axis. @default 'horizontal' */
  direction?: 'horizontal' | 'vertical'
  /** Flip animation duration in ms. @default 600 */
  duration?: number
  /** CSS perspective distance. @default 1000 */
  perspective?: number
  /** Width of the card. @default '100%' */
  width?: string | number
  /** Height of the card. @default 'auto' */
  height?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * 3D card with front and back faces.
 *
 * @example
 *   <FlipCard
 *     front={<Card>Front</Card>}
 *     back={<Card>Back</Card>}
 *     trigger="click"
 *   />
 */
export function FlipCard({
  front,
  back,
  trigger = 'click',
  flipped: controlledFlipped,
  direction = 'horizontal',
  duration = 600,
  perspective = 1000,
  width = '100%',
  height = 'auto',
  style,
  className
}: FlipCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const reduced = useReducedMotion()
  const isControlled = controlledFlipped !== undefined
  const flipped = isControlled ? controlledFlipped : internalFlipped

  // Track when flip changes to enable 3D context only during transition
  const prevFlipped = useRef(flipped)
  useEffect(() => {
    if (prevFlipped.current !== flipped) {
      prevFlipped.current = flipped
      setTransitioning(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setTransitioning(false), duration + 50)
    }
    return () => clearTimeout(timerRef.current)
  }, [flipped, duration])

  // Only use preserve-3d and backface-visibility during flip or when flipped,
  // so nested 3D children (Tilt, SpinCard) work when the front face is showing
  const needs3D = flipped || transitioning

  const rotation = direction === 'horizontal'
    ? `rotateY(${flipped ? 180 : 0}deg)`
    : `rotateX(${flipped ? 180 : 0}deg)`

  const containerStyle: CSSProperties = {
    perspective: needs3D ? perspective : undefined,
    width,
    height,
    ...style
  }

  const innerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: needs3D ? 'preserve-3d' : undefined,
    transform: needs3D ? rotation : undefined,
    transition: reduced ? 'none' : `transform ${duration}ms ${EASINGS.emphasized}`
  }

  const frontFaceStyle: CSSProperties = {
    position: needs3D && flipped ? 'absolute' : 'relative',
    inset: needs3D && flipped ? 0 : undefined,
    height: needs3D && flipped ? undefined : '100%',
    backfaceVisibility: needs3D ? 'hidden' : undefined,
    WebkitBackfaceVisibility: needs3D ? 'hidden' : undefined
  }

  const backFaceStyle: CSSProperties = {
    position: needs3D && !flipped ? 'absolute' : 'relative',
    inset: needs3D && !flipped ? 0 : undefined,
    height: needs3D && !flipped ? undefined : '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden'
  }

  const backRotation = direction === 'horizontal'
    ? 'rotateY(180deg)'
    : 'rotateX(180deg)'

  const handlers = isControlled
    ? { style: containerStyle }
    : trigger === 'click'
      ? { onClick: () => setInternalFlipped(f => !f), style: { ...containerStyle, cursor: 'pointer' } }
      : {
          onPointerEnter: () => setInternalFlipped(true),
          onPointerLeave: () => setInternalFlipped(false),
          style: containerStyle
        }

  return (
    <div className={className} {...handlers}>
      <div style={innerStyle}>
        <div style={{ ...frontFaceStyle, zIndex: 2 }}>{front}</div>
        {needs3D && <div style={{ ...backFaceStyle, transform: backRotation }}>{back}</div>}
      </div>
    </div>
  )
}
