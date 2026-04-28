import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { dampedLerp } from '../spring'

// ============================================
// USE CURSOR POSITION
// ============================================
// Tracks the pointer inside (or around) a referenced element and exposes
// x/y (absolute inside the rect), relX/relY (-1 to 1 centred on the
// element), a distance to the element's centre, and a boolean `inside`.
//
// Exponential smoothing is applied via `dampedLerp` so the resulting
// values feel smooth even on low-frequency pointer events. Passing
// `damping: 1` disables smoothing (instant response).

export interface CursorPosition {
  /** Absolute X relative to the element's bounding rect, in px. */
  x: number
  /** Absolute Y relative to the element's bounding rect, in px. */
  y: number
  /** Normalized X in [-1, 1] where 0 is the horizontal centre. */
  relX: number
  /** Normalized Y in [-1, 1] where 0 is the vertical centre. */
  relY: number
  /** Euclidean distance to the element's centre, in px. */
  distance: number
  /** True when the pointer is within the element's bounding rect. */
  inside: boolean
}

export interface UseCursorPositionOptions {
  /**
   * Damping factor [0, 1]. Lower values smooth more (slow response).
   * Default 0.12 — snappy but not jittery. Set to 1 to disable smoothing.
   */
  damping?: number
  /**
   * Track pointer movement anywhere on the document. Default false — the
   * hook only updates while the pointer is within the element.
   */
  trackOutside?: boolean
}

const REST: CursorPosition = {
  x: 0,
  y: 0,
  relX: 0,
  relY: 0,
  distance: 99999,
  inside: false
}

/**
 * Tracks the pointer inside a referenced element with exponential smoothing.
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null)
 *   const cursor = useCursorPosition(ref)
 *   const style = { transform: `translate(${cursor.relX * 10}px, ${cursor.relY * 10}px)` }
 */
export function useCursorPosition(
  ref: RefObject<HTMLElement>,
  options: UseCursorPositionOptions = {}
): CursorPosition {
  const { damping = 0.12, trackOutside = false } = options
  const reduced = useReducedMotion()

  const [position, setPosition] = useState<CursorPosition>(REST)
  const targetRef = useRef<CursorPosition>(REST)
  const currentRef = useRef<CursorPosition>(REST)
  const rafRef = useRef<number>(0)
  const insideRef = useRef(false)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const computeTarget = (clientX: number, clientY: number): CursorPosition => {
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const halfW = rect.width / 2
      const halfH = rect.height / 2
      const relX = halfW ? (x - halfW) / halfW : 0
      const relY = halfH ? (y - halfH) / halfH : 0
      const dx = x - halfW
      const dy = y - halfH
      const distance = Math.sqrt(dx * dx + dy * dy)
      const inside =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      return { x, y, relX, relY, distance, inside }
    }

    const onMove = (e: PointerEvent) => {
      const target = computeTarget(e.clientX, e.clientY)
      if (!trackOutside && !target.inside) {
        insideRef.current = false
        targetRef.current = REST
        return
      }
      insideRef.current = target.inside
      targetRef.current = target
    }

    const onLeave = () => {
      insideRef.current = false
      targetRef.current = REST
    }

    const scope: Window | HTMLElement = trackOutside ? window : el
    scope.addEventListener('pointermove', onMove as EventListener, { passive: true })
    if (!trackOutside) {
      el.addEventListener('pointerleave', onLeave)
    }

    const tick = () => {
      const current = currentRef.current
      const target = targetRef.current
      if (damping >= 1) {
        currentRef.current = target
      } else {
        currentRef.current = {
          x: dampedLerp(current.x, target.x, damping),
          y: dampedLerp(current.y, target.y, damping),
          relX: dampedLerp(current.relX, target.relX, damping),
          relY: dampedLerp(current.relY, target.relY, damping),
          distance: dampedLerp(current.distance, target.distance, damping),
          inside: target.inside
        }
      }
      setPosition(currentRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      scope.removeEventListener('pointermove', onMove as EventListener)
      if (!trackOutside) {
        el.removeEventListener('pointerleave', onLeave)
      }
      cancelAnimationFrame(rafRef.current)
    }
  }, [ref, damping, trackOutside, reduced])

  return reduced ? REST : position
}

/**
 * Derived helper: given a cursor position relative to an element, returns
 * magnetic translate offsets that pull an inner element toward the pointer
 * within a given radius.
 *
 * @example
 *   const cursor = useCursorPosition(ref)
 *   const { translateX, translateY } = useMagneticAttraction(cursor, 120, 0.3)
 */
export function useMagneticAttraction(
  cursor: CursorPosition,
  radius = 120,
  strength = 0.3
): { translateX: number; translateY: number } {
  if (cursor.distance > radius * 1.2 || cursor.distance === Infinity) {
    return { translateX: 0, translateY: 0 }
  }
  // Smooth cubic falloff: stronger near center, gentle fade at edges
  const t = Math.min(cursor.distance / radius, 1)
  const falloff = 1 - t * t
  return {
    translateX: cursor.relX * radius * strength * falloff,
    translateY: cursor.relY * radius * strength * falloff
  }
}

/**
 * Derived helper: computes 3D tilt angles from a cursor position.
 *
 * @example
 *   const cursor = useCursorPosition(ref)
 *   const { rotateX, rotateY } = useTilt(cursor, 12)
 *   style={{ transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
 */
export function useTilt(
  cursor: CursorPosition,
  intensity = 10
): { rotateX: number; rotateY: number } {
  if (!cursor.inside) return { rotateX: 0, rotateY: 0 }
  return {
    rotateX: -cursor.relY * intensity,
    rotateY: cursor.relX * intensity
  }
}
