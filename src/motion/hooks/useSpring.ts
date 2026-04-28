import { useEffect, useRef } from 'react'
import { spring, type SpringHandle } from '../spring'
import type { SpringConfig, SpringKey } from '../tokens'
import { SPRINGS } from '../tokens'
import { MotionValue } from './useMotionValue'

// ============================================
// USE SPRING
// ============================================
// Animate a numeric target with the Forge spring solver and expose the
// result as a MotionValue. Under the hood this is `spring()` from
// `motion/spring.ts` driven by the React `target` prop. Whenever `target`
// changes the underlying handle is redirected via `setTarget`, so there
// is no GC pressure from creating new solvers per frame.

export interface UseSpringOptions extends Partial<SpringConfig> {
  preset?: SpringKey
}

/**
 * Drives a MotionValue<number> towards `target` with the Forge spring
 * solver. Returns the MotionValue so consumers can pipe it into transforms
 * or read it via `useMotionValueState`.
 *
 * @example
 *   const y = useSpring(scrollY, { preset: 'gentle' })
 *   // then: el.style.transform = `translateY(${y.get()}px)`
 *
 * @example
 *   const x = useSpring(hovered ? 10 : 0, { stiffness: 300, damping: 20 })
 */
export function useSpring(
  target: number,
  options: UseSpringOptions = {}
): MotionValue<number> {
  const valueRef = useRef<MotionValue<number> | null>(null)
  const handleRef = useRef<SpringHandle | null>(null)

  if (valueRef.current === null) {
    valueRef.current = new MotionValue<number>(target)
  }

  useEffect(() => {
    const current = valueRef.current!
    const preset = options.preset ? SPRINGS[options.preset] : undefined
    const config: Partial<SpringConfig> = {
      stiffness: options.stiffness ?? preset?.stiffness ?? SPRINGS.stiff.stiffness,
      damping: options.damping ?? preset?.damping ?? SPRINGS.stiff.damping,
      mass: options.mass ?? preset?.mass ?? SPRINGS.stiff.mass,
      precision: options.precision
    }

    if (handleRef.current) {
      handleRef.current.setTarget(target)
      return
    }

    handleRef.current = spring(current.get(), target, {
      ...config,
      onUpdate: (v) => current.set(v)
    })

    return () => {
      handleRef.current?.stop()
      handleRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  // Config changes (stiffness/damping/mass/preset) rebuild the solver
  useEffect(() => {
    if (!handleRef.current) return
    handleRef.current.stop()
    handleRef.current = null
    const current = valueRef.current!
    const preset = options.preset ? SPRINGS[options.preset] : undefined
    handleRef.current = spring(current.get(), target, {
      stiffness: options.stiffness ?? preset?.stiffness ?? SPRINGS.stiff.stiffness,
      damping: options.damping ?? preset?.damping ?? SPRINGS.stiff.damping,
      mass: options.mass ?? preset?.mass ?? SPRINGS.stiff.mass,
      precision: options.precision,
      onUpdate: (v) => current.set(v)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.stiffness, options.damping, options.mass, options.preset, options.precision])

  return valueRef.current
}
