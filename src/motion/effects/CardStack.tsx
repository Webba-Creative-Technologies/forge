import { useState, useRef, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASINGS } from '../tokens'

// ============================================
// CARD STACK
// ============================================
// A stack of cards where the top card can be swiped left or right.
// Uses pointer events + velocity tracking for natural gesture feel.

export interface CardStackProps<T> {
  /** Items to render as cards. */
  items: T[]
  /** Render function for each card. */
  renderCard: (item: T, index: number) => ReactNode
  /** Called when a card is swiped. */
  onSwipe?: (item: T, direction: 'left' | 'right') => void
  /** Called when all cards have been swiped. */
  onEmpty?: () => void
  /** Velocity threshold to trigger swipe (px/ms). @default 0.5 */
  swipeThreshold?: number
  /** Distance threshold to trigger swipe (px). @default 100 */
  distanceThreshold?: number
  /** Max cards visible in the stack. @default 3 */
  maxVisible?: number
  /** Card width. @default 300 */
  width?: number
  /** Card height. @default 400 */
  height?: number
  style?: CSSProperties
  className?: string
}

/**
 * Swipable card stack. Top card is draggable, swipe to dismiss.
 *
 * @example
 *   <CardStack
 *     items={users}
 *     renderCard={(u) => <UserCard user={u} />}
 *     onSwipe={(u, dir) => console.log(u, dir)}
 *   />
 */
export function CardStack<T>({
  items,
  renderCard,
  onSwipe,
  onEmpty,
  swipeThreshold = 0.5,
  distanceThreshold = 100,
  maxVisible = 3,
  width = 300,
  height = 400,
  style,
  className
}: CardStackProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragState, setDragState] = useState({ x: 0, y: 0, dragging: false })
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)
  const reduced = useReducedMotion()

  const startRef = useRef({ x: 0, y: 0, time: 0 })
  const lastRef = useRef({ x: 0, time: 0 })

  const remaining = items.slice(currentIndex)
  const visible = remaining.slice(0, maxVisible)

  const onPointerDown = (e: React.PointerEvent) => {
    if (exitDir) return
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    startRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    lastRef.current = { x: e.clientX, time: Date.now() }
    setDragState({ x: 0, y: 0, dragging: true })
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.dragging || exitDir) return
    const x = e.clientX - startRef.current.x
    const y = e.clientY - startRef.current.y
    lastRef.current = { x: e.clientX, time: Date.now() }
    setDragState({ x, y, dragging: true })
  }

  const onPointerUp = () => {
    if (!dragState.dragging || exitDir) return
    const dt = Date.now() - startRef.current.time
    const velocity = dt > 0 ? Math.abs(dragState.x) / dt : 0
    const shouldSwipe = velocity > swipeThreshold || Math.abs(dragState.x) > distanceThreshold

    if (shouldSwipe && dragState.x !== 0) {
      const dir = dragState.x > 0 ? 'right' : 'left'
      setExitDir(dir)
      const item = items[currentIndex]
      setTimeout(() => {
        setCurrentIndex(i => i + 1)
        setExitDir(null)
        setDragState({ x: 0, y: 0, dragging: false })
        onSwipe?.(item, dir)
        if (currentIndex + 1 >= items.length) onEmpty?.()
      }, reduced ? 0 : 300)
    } else {
      setDragState({ x: 0, y: 0, dragging: false })
    }
  }

  if (visible.length === 0) {
    return (
      <div className={className} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      </div>
    )
  }

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    ...style
  }

  return (
    <div className={className} style={wrapperStyle}>
      {visible.map((item, i) => {
        const isTop = i === 0
        const stackOffset = i * 6
        const stackScale = 1 - i * 0.04

        let transform: string
        let transition: string
        let zIndex: number

        if (isTop && exitDir) {
          const exitX = exitDir === 'right' ? 500 : -500
          transform = `translate(${exitX}px, ${dragState.y}px) rotate(${exitX * 0.03}deg)`
          transition = `transform 300ms ${EASINGS.swift}`
          zIndex = 10
        } else if (isTop && dragState.dragging) {
          transform = `translate(${dragState.x}px, ${dragState.y}px) rotate(${dragState.x * 0.05}deg)`
          transition = 'none'
          zIndex = 10
        } else {
          transform = `translateY(${stackOffset}px) scale(${stackScale})`
          transition = reduced ? 'none' : `transform 300ms ${EASINGS.emphasized}`
          zIndex = maxVisible - i
        }

        const cardStyle: CSSProperties = {
          position: 'absolute',
          inset: 0,
          transform,
          transition,
          zIndex,
          cursor: isTop ? 'grab' : 'default',
          userSelect: 'none',
          touchAction: 'none'
        }

        return (
          <div
            key={currentIndex + i}
            style={cardStyle}
            {...(isTop ? {
              onPointerDown,
              onPointerMove,
              onPointerUp,
              onPointerCancel: onPointerUp
            } : {})}
          >
            {renderCard(item, currentIndex + i)}
          </div>
        )
      })}
    </div>
  )
}
