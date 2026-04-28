import { useState, useRef, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useCursorPosition, useTilt } from '../hooks/useCursorPosition'
import { EASINGS } from '../tokens'

// ============================================
// SPIN CARD
// ============================================
// A 3D card with front/back faces. On hover it tilts subtly. On drag
// it rotates toward the other side but SNAPS to the nearest face
// (0deg or 180deg) on release, like a magnet.

export interface SpinCardProps {
  /** Front face content. */
  front: ReactNode
  /** Back face content. */
  back: ReactNode
  /** Tilt intensity on hover (degrees). @default 8 */
  tiltIntensity?: number
  /** Perspective in px. @default 800 */
  perspective?: number
  /** Drag sensitivity. @default 1.2 */
  sensitivity?: number
  /** Snap animation duration in ms. @default 400 */
  snapDuration?: number
  /** Width. @default 280 */
  width?: number
  /** Height. @default 180 */
  height?: number
  /** Called when the card flips to front or back. */
  onFlip?: (side: 'front' | 'back') => void
  style?: CSSProperties
  className?: string
}

/**
 * Card with front/back. Tilts on hover, drag to flip, snaps to
 * the nearest face on release.
 *
 * @example
 *   <SpinCard
 *     front={<Card>Front</Card>}
 *     back={<Card>Back</Card>}
 *   />
 */
export function SpinCard({
  front,
  back,
  tiltIntensity = 8,
  perspective = 800,
  sensitivity = 1.2,
  snapDuration = 400,
  width = 280,
  height = 180,
  onFlip,
  style,
  className
}: SpinCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const cursor = useCursorPosition(ref, { damping: 0.12 })
  const { rotateX, rotateY: tiltY } = useTilt(cursor, tiltIntensity)

  // 0 = front, 180 = back
  const [baseAngle, setBaseAngle] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const lastXRef = useRef(0)
  const velocityRef = useRef(0)

  const currentAngle = baseAngle + dragOffset

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced) return
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    setDragging(true)
    setSnapping(false)
    setDragOffset(0)
    lastXRef.current = e.clientX
    velocityRef.current = 0
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const dx = (e.clientX - lastXRef.current) * sensitivity
    lastXRef.current = e.clientX
    velocityRef.current = dx
    setDragOffset(prev => Math.max(-190, Math.min(190, prev + dx)))
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)

    const offset = dragOffset
    const vel = velocityRef.current

    // Determine drag direction from offset, fallback to velocity
    const dir = Math.abs(offset) > 5 ? Math.sign(offset) : Math.sign(vel)

    // Flip if dragged past threshold or flicked hard enough
    const shouldFlip = Math.abs(offset) > 50 || Math.abs(vel) > 2

    let snapTo = baseAngle
    if (shouldFlip && dir !== 0) {
      // Add or subtract 180 in the drag direction (allows continuous rotation)
      snapTo = baseAngle + dir * 180
    }

    const newSide = ((Math.round(snapTo / 180) % 2) + 2) % 2 === 0 ? 'front' : 'back'

    setSnapping(true)
    setBaseAngle(snapTo)
    setDragOffset(0)
    onFlip?.(newSide)

    setTimeout(() => setSnapping(false), snapDuration)
  }

  // Compose the final rotation:
  // - When dragging: currentAngle from drag, no tilt
  // - When snapping: baseAngle with transition
  // - When idle: baseAngle + tilt from cursor
  let finalRotateY: number
  let finalRotateX: number
  let transition: string

  if (dragging) {
    finalRotateY = currentAngle
    finalRotateX = 0
    transition = 'none'
  } else if (snapping) {
    finalRotateY = baseAngle
    finalRotateX = 0
    transition = `transform ${snapDuration}ms ${EASINGS.emphasized}`
  } else {
    finalRotateY = baseAngle + (cursor.inside ? tiltY : 0)
    finalRotateX = cursor.inside ? rotateX : 0
    transition = `transform 120ms ease-out`
  }

  const containerStyle: CSSProperties = {
    perspective,
    width,
    height,
    cursor: dragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'none',
    ...style
  }

  const innerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transform: `rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg)`,
    transition: reduced ? 'none' : transition
  }

  const faceBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden'
  }

  return (
    <div
      ref={ref}
      className={className}
      style={containerStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div style={innerStyle}>
        <div style={{ ...faceBase, zIndex: 2 }}>{front}</div>
        <div style={{ ...faceBase, transform: 'rotateY(180deg)' }}>{back}</div>
      </div>
    </div>
  )
}
