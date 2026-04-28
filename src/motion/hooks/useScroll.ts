import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { clamp, phase } from '../spring'

// ============================================
// USE IN VIEW
// ============================================
// Lightweight IntersectionObserver wrapper. Returns `true` once the
// element crosses a threshold. With `once: false` it flips back to false
// when the element leaves the viewport.

export interface UseInViewOptions {
  /** IntersectionObserver threshold. 0 = enters the viewport at all, 1 = fully visible. */
  threshold?: number
  /** Margin applied to the root (CSS string, same as rootMargin). */
  rootMargin?: string
  /** Stop observing after the first intersection. */
  once?: boolean
}

/**
 * Returns `true` when `ref` intersects the viewport.
 *
 * @example
 *   const ref = useRef(null)
 *   const inView = useInView(ref, { once: true })
 *   return <div ref={ref} style={{ opacity: inView ? 1 : 0 }}>...</div>
 */
export function useInView(
  ref: RefObject<HTMLElement>,
  options: UseInViewOptions = {}
): boolean {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options
  const reduced = useReducedMotion()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (reduced) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) io.disconnect()
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin, once, reduced])

  return inView
}

// ============================================
// USE SCROLL REVEAL
// ============================================
// Extended useInView that exposes a 0-1 `phase` representing how far the
// element has crossed the viewport. Useful for progress-linked effects
// (opacity, scale, translate).

export interface UseScrollRevealOptions {
  /** Offset (in px) before the element is considered visible. Negative to pre-reveal. */
  offset?: number
  /** Stop updating once fully revealed. Default true. */
  once?: boolean
}

export interface ScrollRevealState {
  inView: boolean
  phase: number // 0-1
}

/**
 * Richer alternative to useInView. Exposes a 0-1 phase as the element
 * crosses the viewport and a boolean inView flag.
 *
 * Phase math: 0 when the element's top hits viewport bottom, 1 when its
 * top hits viewport top (i.e. the element has fully entered).
 *
 * @example
 *   const { phase } = useScrollReveal(ref)
 *   style={{ opacity: phase, transform: `translateY(${(1 - phase) * 40}px)` }}
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement>,
  options: UseScrollRevealOptions = {}
): ScrollRevealState {
  const { offset = 0, once = true } = options
  const reduced = useReducedMotion()
  const [state, setState] = useState<ScrollRevealState>({ inView: false, phase: 0 })
  // Once a `once` reveal has been seen, latch inView=true forever.
  // Without this, the previous behaviour froze inView=false at the moment
  // phase hit 1 (which coincides with rect.bottom <= 0), and the element
  // stayed at opacity=0 for the rest of the scroll.
  const latchedRef = useRef(false)

  useEffect(() => {
    if (reduced) {
      setState({ inView: true, phase: 1 })
      return
    }
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    let raf = 0
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const distanceFromBottom = vh - rect.top + offset
      const travel = vh + rect.height
      const p = clamp(distanceFromBottom / travel, 0, 1)
      const inViewNow = rect.top < vh && rect.bottom > 0
      if (once && (inViewNow || p >= 1)) {
        latchedRef.current = true
      }
      setState({ inView: latchedRef.current || inViewNow, phase: p })
    }

    const onScroll = () => {
      raf && cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, offset, once, reduced])

  return state
}

// ============================================
// USE SCROLL PROGRESS
// ============================================
// Returns a 0-1 scalar representing how far the element has travelled
// through the viewport. 0 = element's top just entered the bottom, 1 =
// element's bottom just left the top. Clamped.

/**
 * Per-element scroll progress. Useful for sticky sections: wrap a tall
 * container and read progress to drive phased animations.
 *
 * @example
 *   const p = useScrollProgress(ref)  // 0 to 1
 */
export function useScrollProgress(ref: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setProgress(1)
      return
    }
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    let raf = 0
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const travelled = vh - rect.top
      setProgress(clamp(travelled / total, 0, 1))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, reduced])

  return progress
}

// ============================================
// USE PARALLAX
// ============================================
// Simple parallax offset. Multiply the scroll delta relative to the
// element's position by `speed` and return the resulting y offset.

/**
 * Returns a y-offset (in px) based on scroll position, proportional to
 * the element's distance from the viewport centre. Negative speed
 * reverses direction.
 *
 * @example
 *   const y = useParallax(ref, 0.3)
 *   style={{ transform: `translateY(${y}px)` }}
 */
export function useParallax(
  ref: RefObject<HTMLElement>,
  speed = 0.3
): number {
  const [offset, setOffset] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    let raf = 0
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const centre = rect.top + rect.height / 2
      const delta = vh / 2 - centre
      setOffset(delta * speed)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, speed, reduced])

  return offset
}

// ============================================
// USE PAGE SCROLL
// ============================================

export interface PageScroll {
  y: number
  progress: number // 0-1 of total scrollable height
  direction: 'up' | 'down' | 'idle'
}

/**
 * Global page scroll state. Useful for scroll progress bars or
 * direction-aware UI (e.g. hide navbar on scroll down).
 *
 * @example
 *   const { progress, direction } = usePageScroll()
 */
export function usePageScroll(): PageScroll {
  const [state, setState] = useState<PageScroll>({ y: 0, progress: 0, direction: 'idle' })
  const lastYRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const measure = () => {
      const y = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? clamp(y / docHeight, 0, 1) : 0
      const direction: PageScroll['direction'] =
        y > lastYRef.current ? 'down' : y < lastYRef.current ? 'up' : 'idle'
      lastYRef.current = y
      setState({ y, progress, direction })
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return state
}

// Re-export phase helper under a useScroll-friendly alias
export { phase as scrollPhase }

// ============================================
// USE SCROLL MOTION
// ============================================
// Returns 4 MotionValues (scrollX, scrollY, scrollXProgress, scrollYProgress)
// that update on every scroll frame. These can be piped into useTransform
// for declarative scroll-linked animations without re-renders.

import { MotionValue } from './useMotionValue'

export interface UseScrollMotionOptions {
  /** Element to track. If not provided, tracks the page. */
  target?: RefObject<HTMLElement>
  /** Container for scroll measurement. Defaults to window. */
  container?: RefObject<HTMLElement>
  /** Scroll offset for progress calculation. @default ["start end", "end start"] */
  offset?: string[]
}

export interface ScrollMotionValues {
  scrollX: MotionValue<number>
  scrollY: MotionValue<number>
  scrollXProgress: MotionValue<number>
  scrollYProgress: MotionValue<number>
}

/**
 * Returns scroll position and progress as MotionValues that update without
 * triggering React re-renders. Pair with `useTransform` to derive opacity,
 * scale, color, etc. from scroll position.
 *
 * When a `target` ref is provided the progress values track how far the
 * element has scrolled through the viewport (0 = top enters bottom,
 * 1 = bottom leaves top). Without a target they reflect the container's
 * own scroll fraction.
 *
 * @example
 *   const { scrollYProgress } = useScrollMotion()
 *   const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
 *
 * @example
 *   const ref = useRef(null)
 *   const { scrollYProgress } = useScrollMotion({ target: ref })
 */
export function useScrollMotion(
  options: UseScrollMotionOptions = {}
): ScrollMotionValues {
  const { target, container, offset: _offset } = options
  const reduced = useReducedMotion()

  const valuesRef = useRef<ScrollMotionValues | null>(null)
  if (valuesRef.current === null) {
    valuesRef.current = {
      scrollX: new MotionValue(0),
      scrollY: new MotionValue(0),
      scrollXProgress: new MotionValue(0),
      scrollYProgress: new MotionValue(0),
    }
  }
  const values = valuesRef.current

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (reduced) {
      values.scrollXProgress.set(1)
      values.scrollYProgress.set(1)
      return
    }

    const containerEl = container?.current
    const scrollTarget = containerEl ?? window

    let rafId = 0

    const measure = () => {
      let scrollLeft: number
      let scrollTop: number
      let scrollWidth: number
      let scrollHeight: number
      let clientWidth: number
      let clientHeight: number

      if (containerEl) {
        scrollLeft = containerEl.scrollLeft
        scrollTop = containerEl.scrollTop
        scrollWidth = containerEl.scrollWidth
        scrollHeight = containerEl.scrollHeight
        clientWidth = containerEl.clientWidth
        clientHeight = containerEl.clientHeight
      } else {
        scrollLeft = window.scrollX
        scrollTop = window.scrollY
        scrollWidth = document.documentElement.scrollWidth
        scrollHeight = document.documentElement.scrollHeight
        clientWidth = window.innerWidth
        clientHeight = window.innerHeight
      }

      values.scrollX.set(scrollLeft)
      values.scrollY.set(scrollTop)

      if (target?.current) {
        const el = target.current
        const rect = el.getBoundingClientRect()
        const vh = clientHeight
        // 0 = element top just entered viewport bottom
        // 1 = element bottom just left viewport top
        const total = vh + rect.height
        const travelled = vh - rect.top
        values.scrollYProgress.set(clamp(travelled / total, 0, 1))

        const vw = clientWidth
        const totalX = vw + rect.width
        const travelledX = vw - rect.left
        values.scrollXProgress.set(clamp(travelledX / totalX, 0, 1))
      } else {
        const maxScrollX = scrollWidth - clientWidth
        const maxScrollY = scrollHeight - clientHeight
        values.scrollXProgress.set(maxScrollX > 0 ? clamp(scrollLeft / maxScrollX, 0, 1) : 0)
        values.scrollYProgress.set(maxScrollY > 0 ? clamp(scrollTop / maxScrollY, 0, 1) : 0)
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(measure)
    }

    measure()
    scrollTarget.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [target, container, reduced, values])

  useEffect(() => {
    return () => {
      values.scrollX.destroy()
      values.scrollY.destroy()
      values.scrollXProgress.destroy()
      values.scrollYProgress.destroy()
    }
  }, [values])

  return values
}

// ============================================
// USE SCROLL VELOCITY
// ============================================
// Subscribes to a scroll MotionValue and computes velocity (delta / deltaTime).
// Smoothed with a simple moving average over the last 5 samples.

const VELOCITY_WINDOW = 5

/**
 * Derives a velocity MotionValue from a scroll MotionValue. The velocity
 * is smoothed with a moving average and expressed in pixels per second.
 *
 * @example
 *   const { scrollY } = useScrollMotion()
 *   const velocity = useScrollVelocity(scrollY)
 *   const scaleX = useTransform(velocity, [-1000, 0, 1000], [0.95, 1, 1.05])
 */
export function useScrollVelocity(scrollValue: MotionValue<number>): MotionValue<number> {
  const velocityRef = useRef<MotionValue<number> | null>(null)
  if (velocityRef.current === null) {
    velocityRef.current = new MotionValue(0)
  }
  const velocity = velocityRef.current

  useEffect(() => {
    const samples: number[] = []
    let lastValue = scrollValue.get()
    let lastTime = performance.now()

    const unsubscribe = scrollValue.on((current) => {
      const now = performance.now()
      const dt = now - lastTime
      if (dt < 1) return

      const rawVelocity = ((current - lastValue) / dt) * 1000

      samples.push(rawVelocity)
      if (samples.length > VELOCITY_WINDOW) samples.shift()

      const avg = samples.reduce((sum, v) => sum + v, 0) / samples.length
      velocity.set(avg)

      lastValue = current
      lastTime = now
    })

    return () => {
      unsubscribe()
    }
  }, [scrollValue, velocity])

  useEffect(() => {
    return () => {
      velocity.destroy()
    }
  }, [velocity])

  return velocity
}
