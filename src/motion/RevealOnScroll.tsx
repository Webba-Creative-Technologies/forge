import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useScrollReveal } from './hooks/useScroll'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { DURATIONS, EASINGS, MOTION_SCALES } from './tokens'
import type { DurationKey, EasingKey } from './tokens'
import { useForge } from '../components/ForgeProvider'

// ============================================
// REVEAL ON SCROLL
// ============================================
// Reveals children with a fade + translate when they enter the viewport.
// Uses IntersectionObserver via useScrollReveal. Respects useReducedMotion
// (instant reveal) and ForgeProvider's motionScale.

export interface RevealOnScrollProps {
  children: ReactNode
  /**
   * Direction the child travels FROM. `'up'` means it starts below and
   * translates up into place.
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /**
   * Translate distance in px before motionScale is applied.
   * @default 40
   */
  distance?: number
  /**
   * Transition duration.
   * @default 'relaxed'
   */
  duration?: DurationKey | number
  /**
   * Transition easing curve.
   * @default 'swift'
   */
  easing?: EasingKey | string
  /**
   * Delay before the transition starts (ms).
   * @default 0
   */
  delay?: number
  /**
   * Offset in px before the element is considered in view. Positive =
   * reveal earlier (before it hits the viewport).
   * @default 0
   */
  offset?: number
  /**
   * Re-reveal every time the element scrolls back into view.
   * @default true (reveal only once)
   */
  once?: boolean
  /**
   * Render as a different tag. Default div.
   */
  as?: ElementType
  style?: CSSProperties
  className?: string
}

function translateFor(direction: RevealOnScrollProps['direction'], d: number): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: d }
    case 'down':
      return { x: 0, y: -d }
    case 'left':
      return { x: d, y: 0 }
    case 'right':
      return { x: -d, y: 0 }
    case 'none':
    default:
      return { x: 0, y: 0 }
  }
}

/**
 * Reveals its children with a fade + translate once they scroll into view.
 *
 * @example
 *   <RevealOnScroll direction="up" delay={100}>
 *     <Heading>This reveals on scroll</Heading>
 *   </RevealOnScroll>
 */
export function RevealOnScroll({
  children,
  direction = 'up',
  distance = 40,
  duration = 'relaxed',
  easing = 'swift',
  delay = 0,
  offset = 0,
  once = true,
  as: Tag = 'div',
  style,
  className
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { motionScale } = useForge()
  const { inView } = useScrollReveal(ref, { offset, once })

  const scaled = distance * MOTION_SCALES[motionScale]
  const { x, y } = translateFor(direction, scaled)

  const durationMs = typeof duration === 'number' ? duration : DURATIONS[duration]
  const easingStr = easing in EASINGS ? EASINGS[easing as EasingKey] : easing

  const transitionString = reduced ? 'none' : `all ${durationMs}ms ${easingStr} ${delay}ms`

  const mergedStyle: CSSProperties = {
    opacity: inView || reduced ? 1 : 0,
    transform:
      inView || reduced
        ? 'translate(0, 0)'
        : `translate(${x}px, ${y}px)`,
    transition: transitionString,
    willChange: 'transform, opacity',
    ...style
  }

  const Component = Tag as ElementType
  return (
    <Component ref={ref} className={className} style={mergedStyle}>
      {children}
    </Component>
  )
}
