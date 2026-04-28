import { Children, isValidElement, type ReactNode } from 'react'
import { Motion } from './Motion'
import type { MotionProperties, MotionTransition } from './Motion'

// ============================================
// TYPES
// ============================================

export interface StaggerProps {
  children: ReactNode
  /**
   * Entry state applied to each wrapped child (`initial`).
   * @default { opacity: 0, y: 20 }
   */
  from?: MotionProperties
  /**
   * Target state applied to each wrapped child (`animate`).
   * @default { opacity: 1, y: 0 }
   */
  to?: MotionProperties
  /**
   * Shared transition for every child.
   * @default { duration: 'snappy', easing: 'swift' }
   */
  transition?: MotionTransition
  /**
   * Delay between successive children, in milliseconds. The nth child
   * starts `baseDelay + n * stagger` after mount.
   * @default 60
   */
  stagger?: number
  /**
   * Delay before the first child starts (ms).
   * @default 0
   */
  baseDelay?: number
  /**
   * Direction of the stagger wave.
   * - `'forward'`  — first child first
   * - `'reverse'`  — last child first
   * - `'center'`   — from the middle outward
   * - `'edges'`    — from the edges to the middle
   */
  direction?: 'forward' | 'reverse' | 'center' | 'edges'
  /**
   * Passthrough className for the wrapper div. Defaults to `display: contents`
   * so the Stagger itself introduces no layout.
   */
  className?: string
}

// ============================================
// HELPERS
// ============================================

function resolveIndex(
  i: number,
  total: number,
  direction: StaggerProps['direction']
): number {
  switch (direction) {
    case 'reverse':
      return total - 1 - i
    case 'center': {
      const mid = (total - 1) / 2
      return Math.abs(i - mid)
    }
    case 'edges': {
      const mid = (total - 1) / 2
      return mid - Math.abs(i - mid)
    }
    case 'forward':
    default:
      return i
  }
}

// ============================================
// COMPONENT
// ============================================

const DEFAULT_FROM: MotionProperties = { opacity: 0, y: 20 }
const DEFAULT_TO: MotionProperties = { opacity: 1, y: 0 }
const DEFAULT_TRANSITION: MotionTransition = { duration: 'snappy', easing: 'swift' }

/**
 * Orchestrates a cascade of Motion wrappers around a list of children.
 * Each child gets its own staggered delay computed from its position.
 *
 * @example
 *   <Stagger stagger={80} direction="forward">
 *     <Card>One</Card>
 *     <Card>Two</Card>
 *     <Card>Three</Card>
 *   </Stagger>
 */
export function Stagger({
  children,
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
  transition = DEFAULT_TRANSITION,
  stagger = 60,
  baseDelay = 0,
  direction = 'forward',
  className
}: StaggerProps) {
  const childrenArray = Children.toArray(children).filter(isValidElement)
  const total = childrenArray.length

  return (
    <div className={className} style={{ display: 'contents' }}>
      {childrenArray.map((child, i) => {
        const order = resolveIndex(i, total, direction)
        const delay = baseDelay + order * stagger
        return (
          <Motion
            key={child.key ?? `__stagger_${i}`}
            initial={from}
            animate={to}
            transition={{ ...transition, delay }}
          >
            {child}
          </Motion>
        )
      })}
    </div>
  )
}
