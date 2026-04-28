import { useState, useRef, useCallback, useEffect, type CSSProperties } from 'react'
import { parsePath, normalizePaths, interpolatePaths } from './hooks/usePathMorph'
import type { MorphIconProps } from './hooks/usePathMorph'

// Feature-detect CSS d property transition support
let cssPathTransitionSupported: boolean | null = null
function supportsCSSPathTransition(): boolean {
  if (cssPathTransitionSupported !== null) return cssPathTransitionSupported
  if (typeof document === 'undefined') {
    cssPathTransitionSupported = false
    return false
  }
  try {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    svg.appendChild(path)
    document.body.appendChild(svg)
    path.style.setProperty('d', 'path("M0 0")')
    const val = getComputedStyle(path).getPropertyValue('d')
    document.body.removeChild(svg)
    cssPathTransitionSupported = val !== ''
  } catch {
    cssPathTransitionSupported = false
  }
  return cssPathTransitionSupported
}

export function MorphIcon({
  from,
  to,
  active: controlledActive,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  duration = 300,
  fill = 'none',
  style,
  className,
  onClick
}: MorphIconProps) {
  const isControlled = controlledActive !== undefined
  const [internalActive, setInternalActive] = useState(false)
  const active = isControlled ? controlledActive : internalActive

  const handleClick = useCallback(() => {
    if (!isControlled) setInternalActive(prev => !prev)
    onClick?.()
  }, [isControlled, onClick])

  const currentPath = active ? to : from
  const useCSS = supportsCSSPathTransition()

  // rAF fallback for browsers without CSS d transition
  const pathRef = useRef<SVGPathElement>(null)
  const rafRef = useRef(0)
  const progressRef = useRef(active ? 1 : 0)

  useEffect(() => {
    if (useCSS) return
    const target = active ? 1 : 0
    const start = progressRef.current
    const startTime = performance.now()
    const durationMs = duration

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / durationMs, 1)
      // ease-in-out quad
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      progressRef.current = start + (target - start) * eased

      const parsedA = parsePath(from)
      const parsedB = parsePath(to)
      const [nA, nB] = normalizePaths(parsedA, parsedB)
      const d = interpolatePaths(nA, nB, progressRef.current)
      pathRef.current?.setAttribute('d', d)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, from, to, duration, useCSS])

  const pathStyle: CSSProperties = useCSS
    ? { d: `path("${currentPath}")`, transition: `d ${duration}ms ease` } as CSSProperties
    : {}

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: onClick || !isControlled ? 'pointer' : undefined, ...style }}
      className={className}
      onClick={handleClick}
      role="img"
    >
      <path
        ref={pathRef}
        d={useCSS ? currentPath : (active ? to : from)}
        style={pathStyle}
      />
    </svg>
  )
}
