import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ============================================
// TYPES
// ============================================

type ViewTransitionCallback = () => void | Promise<void>

// `document.startViewTransition` is declared in recent lib.dom but only as
// a required method. We cast to `unknown` then check at runtime so the
// component degrades gracefully on browsers without support.
type StartViewTransitionFn = (cb: ViewTransitionCallback) => {
  finished: Promise<void>
}

export interface ViewTransitionProps {
  /**
   * Unique view-transition-name for this element. Matching names in
   * another render produce a morph animation via the native View
   * Transitions API.
   */
  name: string
  children: ReactNode
}

// ============================================
// COMPONENT
// ============================================

/**
 * Tags its child with `view-transition-name: <name>` so the browser can
 * morph between matching elements across renders via the native View
 * Transitions API. See also `useViewTransition()` for triggering the
 * transition imperatively from state-changing callbacks.
 *
 * This primitive is a no-op on browsers without View Transitions support
 * (Firefox as of 2024, older Safari). The child still renders normally,
 * just without the cross-fade/morph.
 *
 * Browser support resolved at runtime — no polyfill, zero overhead on
 * unsupported platforms.
 *
 * @example
 *   <ViewTransition name="hero-image">
 *     <img src={currentImage} />
 *   </ViewTransition>
 */
export function ViewTransition({ name, children }: ViewTransitionProps) {
  const child = Children.only(children)
  if (!isValidElement(child)) return <>{children}</>

  const existingStyle = (child.props as { style?: CSSProperties }).style ?? {}
  const mergedStyle: CSSProperties = {
    ...existingStyle,
    viewTransitionName: name
  }

  return cloneElement(child as ReactElement, {
    style: mergedStyle
  } as Record<string, unknown>)
}

// ============================================
// HOOK
// ============================================

/**
 * Returns an imperative trigger that runs a DOM-mutating callback inside
 * `document.startViewTransition` when available, falling back to running
 * the callback directly otherwise. Respects `useReducedMotion` — when the
 * user prefers reduced motion the transition is skipped.
 *
 * @example
 *   const start = useViewTransition()
 *   const handleClick = () => {
 *     start(() => setCurrentImage(next))
 *   }
 */
export function useViewTransition(): (cb: ViewTransitionCallback) => Promise<void> {
  const reduced = useReducedMotion()

  return useCallback(
    async (cb: ViewTransitionCallback) => {
      if (typeof document === 'undefined' || reduced) {
        await cb()
        return
      }
      const start = (document as unknown as { startViewTransition?: StartViewTransitionFn }).startViewTransition
      if (!start) {
        await cb()
        return
      }
      const transition = start.call(document, cb)
      await transition.finished.catch(() => {
        // A cancelled transition rejects `finished`. Swallow silently so
        // consumers don't need to try/catch every caller site.
      })
    },
    [reduced]
  )
}
