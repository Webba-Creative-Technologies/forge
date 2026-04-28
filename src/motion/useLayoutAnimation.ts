import { useRef, useLayoutEffect } from 'react'
import { DURATIONS, EASINGS } from './tokens'
import type { DurationKey, EasingKey } from './tokens'
import type { MotionTransition } from './Motion'

type LayoutProp = boolean | 'position' | 'size'

function resolveDurationMs(value: DurationKey | number | undefined): number {
  if (value === undefined) return DURATIONS.fast
  if (typeof value === 'number') return value
  return DURATIONS[value]
}

function resolveEasingString(value: EasingKey | string | undefined): string {
  if (value === undefined) return EASINGS.standard
  if (value in EASINGS) return EASINGS[value as EasingKey]
  return value
}

export function useLayoutAnimation(
  ref: React.RefObject<HTMLElement>,
  layout: LayoutProp | undefined,
  transition?: MotionTransition,
  reducedMotion?: boolean
) {
  const prevRect = useRef<DOMRect | null>(null)

  useLayoutEffect(() => {
    if (!layout || reducedMotion) return
    const el = ref.current
    if (!el) return

    const newRect = el.getBoundingClientRect()
    const oldRect = prevRect.current

    if (oldRect) {
      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top
      const sw = oldRect.width / newRect.width
      const sh = oldRect.height / newRect.height

      const hasPositionChange =
        layout !== 'size' && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)
      const hasSizeChange =
        layout !== 'position' && (Math.abs(sw - 1) > 0.01 || Math.abs(sh - 1) > 0.01)

      if (hasPositionChange || hasSizeChange) {
        // INVERT: apply inverse transform so element appears at old position
        const transforms: string[] = []
        if (hasPositionChange) transforms.push(`translate(${dx}px, ${dy}px)`)
        if (hasSizeChange) transforms.push(`scale(${sw}, ${sh})`)

        el.style.transform = transforms.join(' ')
        el.style.transformOrigin = '0 0'

        // Force reflow so the inverse transform is painted
        el.getBoundingClientRect()

        // PLAY: animate to identity (the actual new position)
        const duration = resolveDurationMs(transition?.duration)
        const easing = resolveEasingString(transition?.easing)

        el.style.transition = `transform ${duration}ms ${easing}`
        el.style.transform = 'none'

        const cleanup = () => {
          el.style.transition = ''
          el.style.transform = ''
          el.style.transformOrigin = ''
          el.removeEventListener('transitionend', cleanup)
        }
        el.addEventListener('transitionend', cleanup, { once: true })
      }
    }

    prevRect.current = newRect
  })
}
