// ============================================
// FORGE MOTION — TOKENS
// ============================================
// Foundational motion vocabulary: durations, easings, spring configs and
// motion scales. Every motion primitive, hook and component in Forge reads
// from these tokens so consumers can retheme the whole motion language via
// ForgeProvider.

// --------------------------------------------
// DURATIONS (ms)
// --------------------------------------------
// Eight semantic steps. Use names, not raw numbers, inside component source.
export const DURATIONS = {
  instant: 0,
  micro: 100,   // button press feedback, micro-hover
  fast: 150,    // current default hover/transition (Material standard)
  snappy: 200,  // slide/scale entry
  base: 300,    // modal, drawer, non-trivial state changes
  relaxed: 500, // parallax, scroll reveal
  slow: 800,    // hero entrance, cinematic moments
  stately: 1200 // reserved for decorative-only, rarely used
} as const

export type DurationKey = keyof typeof DURATIONS

// --------------------------------------------
// EASINGS (cubic-bezier curves)
// --------------------------------------------
// Twelve named curves. `standard` matches Material/current Forge default.
// `emphasized` is Material 3. `swift` / `gentle` mimic iOS feel.
export const EASINGS = {
  linear: 'linear',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  overshoot: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  anticipate: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  swift: 'cubic-bezier(0.16, 1, 0.3, 1)',
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.77, 0, 0.175, 1)'
} as const

export type EasingKey = keyof typeof EASINGS

// --------------------------------------------
// SPRING CONFIGS
// --------------------------------------------
// Parameters consumed by the Forge spring solver. See motion/spring.ts for
// the implementation. `stiffness` drives attraction, `damping` drives
// friction, `mass` modulates inertia. Precision controls when the solver
// considers the animation finished.
export interface SpringConfig {
  stiffness: number
  damping: number
  mass: number
  precision?: number
}

export const SPRINGS = {
  stiff:    { stiffness: 180, damping: 12, mass: 1 },
  bouncy:   { stiffness: 300, damping: 10, mass: 1 },
  gentle:   { stiffness: 100, damping: 15, mass: 1 },
  wobbly:   { stiffness: 180, damping: 8,  mass: 1 },
  molasses: { stiffness: 60,  damping: 20, mass: 1 }
} as const satisfies Record<string, SpringConfig>

export type SpringKey = keyof typeof SPRINGS

// --------------------------------------------
// MOTION SCALES
// --------------------------------------------
// Global intensity multiplier. Components multiply their translate/scale
// deltas by this factor so a single ForgeProvider prop dampens or amplifies
// every motion at once.
export const MOTION_SCALES = {
  subtle: 0.5,
  normal: 1,
  dramatic: 1.8
} as const

export type MotionScaleKey = keyof typeof MOTION_SCALES

// --------------------------------------------
// REDUCED MOTION POLICY
// --------------------------------------------
// 'auto'   — respect the user's system preference (matchMedia)
// 'always' — force reduced motion regardless of system preference
// 'never'  — ignore system preference, always play full motion
export type ReducedMotionPolicy = 'auto' | 'always' | 'never'

// --------------------------------------------
// HELPERS — resolve a token value
// --------------------------------------------
/**
 * Resolve a duration key or raw ms number to a CSS `${n}ms` string.
 * Accepts `'fast'`, `150`, or `'150ms'`.
 */
export function resolveDuration(value: DurationKey | number | string): string {
  if (typeof value === 'number') return `${value}ms`
  if (value in DURATIONS) return `${DURATIONS[value as DurationKey]}ms`
  return value
}

/**
 * Resolve an easing key or raw cubic-bezier string.
 */
export function resolveEasing(value: EasingKey | string): string {
  if (value in EASINGS) return EASINGS[value as EasingKey]
  return value
}

/**
 * Resolve a spring key or config object into a full SpringConfig.
 */
export function resolveSpring(value: SpringKey | SpringConfig): SpringConfig {
  if (typeof value === 'string') return SPRINGS[value]
  return value
}
