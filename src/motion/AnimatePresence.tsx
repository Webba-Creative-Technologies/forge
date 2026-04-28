import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'

// ============================================
// TYPES
// ============================================

export interface AnimatePresenceProps {
  children: ReactNode
  /**
   * Called once after every child's exit animation has completed.
   */
  onExitComplete?: () => void
  /**
   * When false, children skip their initial mount animation.
   * After the first render, behaves normally.
   */
  initial?: boolean
  /**
   * Controls how entering and exiting children are handled.
   * - "sync" (default): enter and exit happen simultaneously
   * - "wait": new children wait until exiting children finish before entering
   * - "popLayout": exiting children are taken out of flow immediately,
   *   new children enter right away
   */
  mode?: 'sync' | 'wait' | 'popLayout'
}

interface TrackedChild {
  key: string
  element: ReactElement
  isPresent: boolean
  /** For popLayout: captured bounding rect when the child starts exiting */
  exitRect?: DOMRect
}

// ============================================
// HELPERS
// ============================================

function getChildKey(child: ReactElement, index: number): string {
  if (child.key != null) return String(child.key)
  return `__fp_${index}`
}

function childrenToArray(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter(isValidElement) as ReactElement[]
}

// ============================================
// COMPONENT
// ============================================

/**
 * Defers the unmount of children until their exit animation has completed.
 *
 * Pairs with <Motion> — when a child with an `exit` prop is removed from
 * the children array, AnimatePresence keeps it mounted, flips `isPresent`
 * to false so Motion plays the exit transition, then actually unmounts it
 * once Motion calls `onExitComplete`.
 *
 * Children must have stable `key` props for tracking. Without keys the
 * component falls back to index-based tracking which only works for
 * fixed-size lists.
 *
 * @example
 *   <AnimatePresence>
 *     {show && (
 *       <Motion
 *         key="modal"
 *         initial={{ opacity: 0, scale: 0.95 }}
 *         animate={{ opacity: 1, scale: 1 }}
 *         exit={{ opacity: 0, scale: 0.95 }}
 *       >
 *         <Modal />
 *       </Motion>
 *     )}
 *   </AnimatePresence>
 */
export function AnimatePresence({
  children,
  onExitComplete,
  initial = true,
  mode = 'sync'
}: AnimatePresenceProps) {
  const [tracked, setTracked] = useState<TrackedChild[]>(() => {
    const arr = childrenToArray(children)
    return arr.map((el, i) => ({
      key: getChildKey(el, i),
      element: el,
      isPresent: true
    }))
  })

  // "wait" mode: pending children stored in a ref, flushed after all exits
  const pendingEnterRef = useRef<TrackedChild[]>([])

  // Track refs for popLayout bounding rect capture
  const childRefs = useRef<Map<string, HTMLElement>>(new Map())

  const firstRenderRef = useRef(true)

  useEffect(() => {
    const nextArr = childrenToArray(children)
    const nextKeys = new Set(nextArr.map((el, i) => getChildKey(el, i)))

    setTracked((prev) => {
      const merged: TrackedChild[] = []
      const seen = new Set<string>()
      const newEntries: TrackedChild[] = []

      for (const t of prev) {
        if (nextKeys.has(t.key)) {
          const latest = nextArr.find((el, i) => getChildKey(el, i) === t.key)!
          merged.push({ ...t, element: latest, isPresent: true })
          seen.add(t.key)
        } else {
          if (mode === 'popLayout') {
            const el = childRefs.current.get(t.key)
            const rect = el ? el.getBoundingClientRect() : undefined
            merged.push({ ...t, isPresent: false, exitRect: rect })
          } else {
            merged.push({ ...t, isPresent: false })
          }
        }
      }

      nextArr.forEach((el, i) => {
        const key = getChildKey(el, i)
        if (!seen.has(key) && !merged.some((m) => m.key === key)) {
          newEntries.push({ key, element: el, isPresent: true })
        }
      })

      const someExiting = merged.some((t) => !t.isPresent)

      if (mode === 'wait' && someExiting && newEntries.length > 0) {
        pendingEnterRef.current = newEntries
      } else {
        merged.push(...newEntries)
      }

      return merged
    })
  }, [children, mode])

  useEffect(() => {
    firstRenderRef.current = false
  }, [])

  const handleExitComplete = useCallback((key: string) => {
    setTracked((prev) => {
      const next = prev.filter((t) => t.key !== key)
      const allDone = next.every((t) => t.isPresent)

      if (allDone) {
        onExitComplete?.()
      }

      // Always flush pending entries when all exits are done
      if (allDone && pendingEnterRef.current.length > 0) {
        const pending = pendingEnterRef.current
        pendingEnterRef.current = []
        return [...next, ...pending]
      }

      return next
    })
  }, [onExitComplete])

  // Ref callback for popLayout
  const setChildRef = useCallback((key: string, node: HTMLElement | null) => {
    if (node) {
      childRefs.current.set(key, node)
    } else {
      childRefs.current.delete(key)
    }
  }, [])

  return (
    <>
      {tracked.map((t) => {
        const skipInitial =
          initial === false && firstRenderRef.current
            ? { initial: false }
            : {}

        // popLayout: exiting children get absolute positioning at their last rect
        let popStyle: CSSProperties | undefined
        if (mode === 'popLayout' && !t.isPresent && t.exitRect) {
          popStyle = {
            position: 'absolute',
            left: t.exitRect.left,
            top: t.exitRect.top,
            width: t.exitRect.width,
            height: t.exitRect.height
          }
        }

        const extraProps: Record<string, unknown> = {
          ...skipInitial,
          key: t.key,
          isPresent: t.isPresent,
          onExitComplete: () => handleExitComplete(t.key)
        }

        if (mode === 'popLayout') {
          extraProps.ref = (node: HTMLElement | null) => setChildRef(t.key, node)
          if (popStyle) {
            extraProps.style = {
              ...(t.element.props?.style ?? {}),
              ...popStyle
            }
          }
        }

        return cloneElement(t.element, extraProps)
      })}
    </>
  )
}
