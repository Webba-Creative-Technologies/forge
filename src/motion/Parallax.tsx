import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useParallax } from './hooks/useScroll'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ============================================
// PARALLAX
// ============================================
// Translates its children based on scroll position. Positive speed moves
// the content opposite to the scroll (classic parallax feel), negative
// speed moves with the scroll (overshoot).
//
// Respects useReducedMotion — falls back to the natural position.

export interface ParallaxProps {
  children: ReactNode
  /**
   * How much the child moves per scroll pixel. 0 = none, 0.3 = subtle,
   * 0.6 = strong, 1 = match scroll, negative reverses.
   * @default 0.3
   */
  speed?: number
  /**
   * Axis of motion.
   * @default 'y'
   */
  axis?: 'x' | 'y'
  as?: ElementType
  style?: CSSProperties
  className?: string
}

/**
 * Scroll-linked parallax wrapper.
 *
 * @example
 *   <Parallax speed={0.4}>
 *     <img src={hero} />
 *   </Parallax>
 */
export function Parallax({
  children,
  speed = 0.3,
  axis = 'y',
  as: Tag = 'div',
  style,
  className
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const offset = useParallax(ref, speed)

  const transform = reduced
    ? 'none'
    : axis === 'y'
      ? `translate3d(0, ${offset}px, 0)`
      : `translate3d(${offset}px, 0, 0)`

  const mergedStyle: CSSProperties = {
    transform,
    willChange: 'transform',
    ...style
  }

  const Component = Tag as ElementType
  return (
    <Component ref={ref} className={className} style={mergedStyle}>
      {children}
    </Component>
  )
}
