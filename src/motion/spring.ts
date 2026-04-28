// ============================================
// FORGE MOTION -- SPRING SOLVER
// ============================================
// Tiny zero-dependency spring integrator. Runs a semi-implicit Euler loop
// on rAF and drives a scalar `value` from `from` -> `to` using stiffness /
// damping / mass. Components and hooks compose this solver to build richer
// motion primitives (useSpring, useMotionValue, magnetic/tilt easing).
//
// Design notes:
// - Scalar only for `spring()`. Use `springMulti()` for multi-dimensional.
// - Integration timestep is auto-detected from display refresh rate.
// - Stops when velocity and displacement are both below `precision`.

import type { SpringConfig, SpringKey } from './tokens'
import { SPRINGS } from './tokens'

// ---------------------------------------------------------------------------
// Adaptive timestep: detect display refresh rate at module load
// ---------------------------------------------------------------------------
let detectedDt = 1 / 60

function detectRefreshRate() {
  if (typeof requestAnimationFrame === 'undefined') return
  let last = 0
  const samples: number[] = []
  const detect = (now: number) => {
    if (last > 0) {
      samples.push((now - last) / 1000)
      if (samples.length >= 10) {
        const avg = samples.reduce((a, b) => a + b) / samples.length
        detectedDt = Math.max(1 / 240, Math.min(1 / 30, avg))
        return
      }
    }
    last = now
    requestAnimationFrame(detect)
  }
  requestAnimationFrame(detect)
}

detectRefreshRate()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpringState {
  value: number
  velocity: number
}

export interface SpringHandle {
  /** Stop the animation immediately. Idempotent. */
  stop: () => void
  /** Swap the target while the animation is running. */
  setTarget: (to: number) => void
  /** Read the current state synchronously. */
  state: () => SpringState
}

export interface SpringOptions extends Partial<SpringConfig> {
  /** Initial value (defaults to 0). */
  from?: number
  /** Initial velocity (defaults to 0). */
  velocity?: number
  /** Initial velocity. Useful for continuing momentum from drag. */
  initialVelocity?: number
  /** Called on every frame with the current value. */
  onUpdate: (value: number, velocity: number) => void
  /** Called once when the solver settles. */
  onComplete?: () => void
  /** Early-return when already at rest within this threshold. Default 0.01. */
  precision?: number
}

export interface SpringMultiHandle {
  /** Stop the animation immediately. Idempotent. */
  stop: () => void
  /** Redirect all dimensions at once. */
  setTarget: (to: Record<string, number>) => void
  /** Read the current state of every dimension synchronously. */
  state: () => Record<string, { value: number; velocity: number }>
}

const DEFAULT_PRECISION = 0.01

/**
 * Start a spring animation from `from` to `to`. Returns a handle that can
 * stop or redirect the motion. Caller is responsible for scheduling and
 * cleanup via the handle.
 *
 * @example
 *   const handle = spring(0, 100, {
 *     stiffness: 180,
 *     damping: 12,
 *     mass: 1,
 *     onUpdate: (v) => { el.style.transform = `translateX(${v}px)` }
 *   })
 *   // later
 *   handle.stop()
 */
export function spring(
  from: number,
  to: number,
  options: SpringOptions
): SpringHandle {
  const stiffness = options.stiffness ?? 180
  const damping = options.damping ?? 12
  const mass = options.mass ?? 1
  const precision = options.precision ?? DEFAULT_PRECISION

  let value = from
  let velocity = options.initialVelocity ?? options.velocity ?? 0
  let target = to
  let raf = 0
  let running = true

  const settled = (): boolean =>
    Math.abs(velocity) < precision && Math.abs(value - target) < precision

  const step = () => {
    if (!running) return
    const dt = detectedDt
    // Semi-implicit Euler: compute force, integrate velocity, then position
    const displacement = value - target
    const springForce = -stiffness * displacement
    const dampingForce = -damping * velocity
    const acceleration = (springForce + dampingForce) / mass

    velocity += acceleration * dt
    value += velocity * dt

    options.onUpdate(value, velocity)

    if (settled()) {
      value = target
      velocity = 0
      options.onUpdate(value, velocity)
      running = false
      options.onComplete?.()
      return
    }
    raf = requestAnimationFrame(step)
  }

  raf = requestAnimationFrame(step)

  return {
    stop: () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    },
    setTarget: (next: number) => {
      target = next
      if (!running) {
        running = true
        raf = requestAnimationFrame(step)
      }
    },
    state: () => ({ value, velocity })
  }
}

/**
 * Convenience: start a spring with a preset key from SPRINGS.
 *
 * @example
 *   springPreset(0, 1, 'bouncy', { onUpdate: v => console.log(v) })
 */
export function springPreset(
  from: number,
  to: number,
  preset: SpringKey,
  options: Omit<SpringOptions, keyof SpringConfig>
): SpringHandle {
  return spring(from, to, { ...SPRINGS[preset], ...options })
}

/**
 * Pure helper: exponential damping step. Useful for cursor smoothing
 * (`value += (target - value) * factor`) where a full spring is overkill.
 *
 * @example
 *   smoothX = dampedLerp(smoothX, mouse.x, 0.08)
 */
export function dampedLerp(current: number, target: number, factor = 0.08): number {
  return current + (target - current) * factor
}

/**
 * Pure helper: linear interpolation between a and b at parameter t in [0, 1].
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Pure helper: clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Map a scroll position (or any scalar) to a 0-1 phase between [start, end],
 * with the edges clamped. Great for scroll-linked animations.
 *
 * @example
 *   const p = phase(scrollY, 200, 800) // 0 before 200, 1 after 800
 */
export function phase(value: number, start: number, end: number): number {
  if (end === start) return value >= end ? 1 : 0
  return clamp((value - start) / (end - start), 0, 1)
}

// ---------------------------------------------------------------------------
// Multi-dimensional spring
// ---------------------------------------------------------------------------

export type SpringMultiOptions = Partial<SpringConfig> & {
  precision?: number
}

/**
 * Animate multiple named values together with a single spring config.
 * All dimensions share stiffness/damping/mass/precision and complete
 * only when every dimension is at rest.
 *
 * @example
 *   const h = springMulti(
 *     { x: 0, y: 0 },
 *     { x: 200, y: 100 },
 *     {
 *       stiffness: 180,
 *       damping: 12,
 *       onUpdate: (vals) => {
 *         el.style.transform = `translate(${vals.x}px, ${vals.y}px)`
 *       }
 *     }
 *   )
 */
export function springMulti(
  from: Record<string, number>,
  to: Record<string, number>,
  options: SpringMultiOptions & {
    onUpdate: (values: Record<string, number>) => void
    onComplete?: () => void
  }
): SpringMultiHandle {
  const stiffness = options.stiffness ?? 180
  const damping = options.damping ?? 12
  const mass = options.mass ?? 1
  const precision = options.precision ?? DEFAULT_PRECISION

  const keys = Object.keys(from)
  const values: Record<string, number> = {}
  const velocities: Record<string, number> = {}
  const targets: Record<string, number> = {}

  for (const k of keys) {
    values[k] = from[k]
    velocities[k] = 0
    targets[k] = to[k] ?? from[k]
  }

  let raf = 0
  let running = true

  const allSettled = (): boolean =>
    keys.every(
      (k) =>
        Math.abs(velocities[k]) < precision &&
        Math.abs(values[k] - targets[k]) < precision
    )

  const step = () => {
    if (!running) return
    const dt = detectedDt

    for (const k of keys) {
      const displacement = values[k] - targets[k]
      const springForce = -stiffness * displacement
      const dampingForce = -damping * velocities[k]
      const acceleration = (springForce + dampingForce) / mass

      velocities[k] += acceleration * dt
      values[k] += velocities[k] * dt
    }

    // Build snapshot for callback
    const snapshot: Record<string, number> = {}
    for (const k of keys) snapshot[k] = values[k]
    options.onUpdate(snapshot)

    if (allSettled()) {
      for (const k of keys) {
        values[k] = targets[k]
        velocities[k] = 0
      }
      const finalSnap: Record<string, number> = {}
      for (const k of keys) finalSnap[k] = values[k]
      options.onUpdate(finalSnap)
      running = false
      options.onComplete?.()
      return
    }
    raf = requestAnimationFrame(step)
  }

  raf = requestAnimationFrame(step)

  return {
    stop: () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    },
    setTarget: (next: Record<string, number>) => {
      for (const k of keys) {
        if (k in next) targets[k] = next[k]
      }
      if (!running) {
        running = true
        raf = requestAnimationFrame(step)
      }
    },
    state: () => {
      const out: Record<string, { value: number; velocity: number }> = {}
      for (const k of keys) {
        out[k] = { value: values[k], velocity: velocities[k] }
      }
      return out
    }
  }
}
