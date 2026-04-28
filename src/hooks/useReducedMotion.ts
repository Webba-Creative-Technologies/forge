import { useEffect, useState } from 'react'
import { useForge } from '../components/ForgeProvider'
import type { ReducedMotionPolicy } from '../motion/tokens'

const QUERY = '(prefers-reduced-motion: reduce)'

export function readSystemPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(QUERY).matches
}

export function resolveReducedMotion(policy: ReducedMotionPolicy): boolean {
  if (policy === 'always') return true
  if (policy === 'never') return false
  return readSystemPrefersReducedMotion()
}

/**
 * Returns `true` when motion should be reduced or disabled.
 *
 * Resolution order:
 *  1. ForgeProvider `reducedMotion` prop ('always' | 'never' | 'auto')
 *  2. System preference via `matchMedia('(prefers-reduced-motion: reduce)')`
 *  3. Defaults to `false` during SSR
 *
 * Every motion hook and expressive component in Forge Motion consults this
 * hook before animating. When it returns `true`:
 *  - hooks return final/rest values without starting RAF loops
 *  - components skip transitions/animations and render final state
 *  - gesture wrappers disable magnetic/tilt/spotlight effects
 *
 * ForgeProvider ALSO mirrors this value onto
 * `document.documentElement.dataset.forgeReduceMotion` so raw CSS rules
 * in motion.css (used by Kinetic, Marquee, Aura, Breathe, Orbital, etc.)
 * stay in sync without relying on the `@media (prefers-reduced-motion)`
 * query — which would always override the `reducedMotion="never"` escape
 * hatch used on the docs site.
 *
 * @example
 *   const reduced = useReducedMotion()
 *   const opacity = reduced ? 1 : phase(scroll, 0, 400)
 */
export function useReducedMotion(): boolean {
  const forge = useForge() as { reducedMotion?: ReducedMotionPolicy }
  const policy = forge.reducedMotion ?? 'auto'

  const [systemReduce, setSystemReduce] = useState<boolean>(() => readSystemPrefersReducedMotion())

  useEffect(() => {
    if (policy !== 'auto') return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(QUERY)
    const handler = (e: MediaQueryListEvent) => setSystemReduce(e.matches)
    // Some older Safari needs addListener
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      type Legacy = {
        addListener: (cb: (e: MediaQueryListEvent) => void) => void
        removeListener: (cb: (e: MediaQueryListEvent) => void) => void
      }
      const legacy = mql as unknown as Legacy
      legacy.addListener(handler)
      return () => legacy.removeListener(handler)
    }
  }, [policy])

  if (policy === 'always') return true
  if (policy === 'never') return false
  return systemReduce
}
