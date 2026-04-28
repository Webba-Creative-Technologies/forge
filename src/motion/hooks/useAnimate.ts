import { useRef, useCallback, type RefObject } from 'react'
import { DURATIONS, EASINGS } from '../tokens'
import type { DurationKey, EasingKey } from '../tokens'
import type { MotionProperties } from '../Motion'

// ============================================
// TYPES
// ============================================

export interface AnimateOptions {
  duration?: DurationKey | number
  easing?: EasingKey | string
  delay?: number
}

export interface AnimationControls {
  pause: () => void
  resume: () => void
  cancel: () => void
  finished: Promise<void>
}

type AnimateTarget = string | Element | Element[] | RefObject<Element | null>

type SequenceItem = [
  target: string | Element | RefObject<Element | null>,
  props: MotionProperties,
  options?: AnimateOptions,
]

interface AnimateFunction {
  (
    target: AnimateTarget,
    props: MotionProperties,
    options?: AnimateOptions,
  ): AnimationControls
  (sequence: SequenceItem[]): AnimationControls
}

// ============================================
// HELPERS
// ============================================

function resolveDurationMs(value: DurationKey | number | undefined): number {
  if (value === undefined) return DURATIONS.fast
  if (typeof value === 'number') return value
  return DURATIONS[value]
}

function resolveEasingStr(value: EasingKey | string | undefined): string {
  if (value === undefined) return EASINGS.standard
  if (value in EASINGS) return EASINGS[value as EasingKey]
  return value
}

/**
 * Build a Web Animations API keyframe array from MotionProperties.
 *
 * Transform-related props (x, y, scale, scaleX, scaleY, rotate) are
 * collapsed into a single `transform` string per keyframe. Direct CSS
 * props (opacity, backgroundColor, etc.) are set as-is.
 */
function buildKeyframes(props: MotionProperties): Keyframe[] {
  const transformKeys = ['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotate'] as const
  const directKeys = [
    'opacity',
    'backgroundColor',
    'color',
    'borderColor',
    'borderRadius',
    'filter',
    'boxShadow',
  ] as const

  // Figure out the maximum number of keyframe steps
  let steps = 1
  for (const k of [...transformKeys, ...directKeys]) {
    const v = props[k as keyof MotionProperties]
    if (Array.isArray(v) && v.length > steps) steps = v.length
  }

  // Web Animations API needs at least 2 keyframes (from → to).
  // When all values are scalars (steps === 1), prepend an identity keyframe.
  const needsIdentityStart = steps === 1
  const totalSteps = needsIdentityStart ? 2 : steps

  const keyframes: Keyframe[] = []
  for (let i = 0; i < totalSteps; i++) {
    const valueIndex = needsIdentityStart ? Math.max(0, i - 1) : i
    const isIdentity = needsIdentityStart && i === 0
    const kf: Keyframe = {}

    // Build transform string for this step
    const pick = (key: keyof MotionProperties, fallback?: number) => {
      if (isIdentity) return fallback
      const v = props[key]
      if (v === undefined) return fallback
      if (Array.isArray(v)) return v[Math.min(valueIndex, v.length - 1)] as number
      return v as number
    }

    const tx = pick('x', 0) as number
    const ty = pick('y', 0) as number
    const rot = pick('rotate', 0) as number
    const sc = props.scale !== undefined ? pick('scale') : undefined
    const sxRaw = pick('scaleX')
    const syRaw = pick('scaleY')
    const sx = sc ?? sxRaw ?? 1
    const sy = sc ?? syRaw ?? 1

    const hasTransform =
      props.x !== undefined ||
      props.y !== undefined ||
      props.scale !== undefined ||
      props.scaleX !== undefined ||
      props.scaleY !== undefined ||
      props.rotate !== undefined

    if (hasTransform) {
      kf.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy}) rotate(${rot}deg)`
    }

    // Direct CSS properties
    for (const dk of directKeys) {
      const v = props[dk as keyof MotionProperties]
      if (v === undefined || isIdentity) continue
      const resolved = Array.isArray(v)
        ? v[Math.min(valueIndex, v.length - 1)]
        : v
      ;(kf as Record<string, unknown>)[dk] = resolved
    }

    keyframes.push(kf)
  }

  return keyframes
}

function resolveElements(
  target: AnimateTarget,
  scope: HTMLElement | null,
): Element[] {
  if (typeof target === 'string') {
    if (!scope) return []
    return Array.from(scope.querySelectorAll(target))
  }
  if (target instanceof Element) return [target]
  if (Array.isArray(target)) return target
  // RefObject
  if (
    target !== null &&
    typeof target === 'object' &&
    'current' in target
  ) {
    return target.current ? [target.current] : []
  }
  return []
}

function noop() {}

function createControls(animations: Animation[]): AnimationControls {
  const finished = animations.length > 0
    ? Promise.all(animations.map((a) => a.finished)).then(noop)
    : Promise.resolve()

  return {
    pause: () => animations.forEach((a) => a.pause()),
    resume: () => animations.forEach((a) => a.play()),
    cancel: () => animations.forEach((a) => a.cancel()),
    finished,
  }
}

// ============================================
// HOOK
// ============================================

export function useAnimate(): [RefObject<HTMLElement | null>, AnimateFunction] {
  const scope = useRef<HTMLElement | null>(null)

  const animate = useCallback(
    (
      targetOrSequence: AnimateTarget | SequenceItem[],
      props?: MotionProperties,
      options?: AnimateOptions,
    ): AnimationControls => {
      // Sequence overload: array of tuples
      if (
        Array.isArray(targetOrSequence) &&
        targetOrSequence.length > 0 &&
        Array.isArray(targetOrSequence[0])
      ) {
        const sequence = targetOrSequence as SequenceItem[]
        const allAnimations: Animation[] = []
        let aborted = false

        const finished = (async () => {
          for (const [seqTarget, seqProps, seqOpts] of sequence) {
            if (aborted) break
            const elements = resolveElements(seqTarget, scope.current)
            const kf = buildKeyframes(seqProps)
            const dur = resolveDurationMs(seqOpts?.duration)
            const ease = resolveEasingStr(seqOpts?.easing)
            const delay = seqOpts?.delay ?? 0

            const stepAnims = elements.map((el) =>
              el.animate(kf, {
                duration: dur,
                easing: ease,
                delay,
                fill: 'forwards',
              }),
            )
            allAnimations.push(...stepAnims)
            // Wait for this step to finish before proceeding
            if (stepAnims.length > 0) {
              await Promise.all(stepAnims.map((a) => a.finished))
            }
          }
        })()

        return {
          pause: () => allAnimations.forEach((a) => a.pause()),
          resume: () => allAnimations.forEach((a) => a.play()),
          cancel: () => {
            aborted = true
            allAnimations.forEach((a) => a.cancel())
          },
          finished,
        }
      }

      // Single target overload
      const target = targetOrSequence as AnimateTarget
      const elements = resolveElements(target, scope.current)
      if (!props || elements.length === 0) {
        return { pause: noop, resume: noop, cancel: noop, finished: Promise.resolve() }
      }

      const kf = buildKeyframes(props)
      const dur = resolveDurationMs(options?.duration)
      const ease = resolveEasingStr(options?.easing)
      const delay = options?.delay ?? 0

      const animations = elements.map((el) =>
        el.animate(kf, {
          duration: dur,
          easing: ease,
          delay,
          fill: 'forwards',
        }),
      )

      return createControls(animations)
    },
    [],
  )

  return [scope, animate as AnimateFunction]
}
