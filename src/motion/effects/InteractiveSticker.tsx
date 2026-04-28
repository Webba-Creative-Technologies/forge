import { useRef, useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// INTERACTIVE STICKER
// ============================================
// A peelable sticker. Same visual model as Sticker (curl corner
// revealing the underside, content clip-path cutting the corner),
// but the peel size is driven by a click-and-drag gesture on the
// grip. Past threshold the sticker tears off and leaves a residue.

type PeelCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type StickerState = 'idle' | 'peeling' | 'snapping' | 'tearing' | 'removed'

export interface InteractiveStickerProps {
  children: ReactNode
  /** Which corner is peeled (grip lives here). @default 'bottom-right' */
  peeledCorner?: PeelCorner
  /** Base peel size in px when idle. @default 26 */
  basePeelSize?: number
  /** Organic tilt of the whole sticker. @default -4 */
  rotation?: number
  /** Color of the underside showing on the peel. @default '#e2e0dc' */
  undersideColor?: string
  /** Border radius of the sticker. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  /** Fraction of diagonal at which the sticker tears off. @default 0.6 */
  threshold?: number
  /** Called once when the sticker is fully peeled off. */
  onPeelOff?: () => void
  /** Show torn residue after removal. @default true */
  showResidue?: boolean
  /** Click residue to re-attach. @default true */
  resetOnClick?: boolean
  style?: CSSProperties
  className?: string
}

/**
 * Peelable sticker. Click and drag the peeled corner toward the
 * opposite corner to tear it off.
 */
export function InteractiveSticker({
  children,
  peeledCorner = 'bottom-right',
  basePeelSize = 26,
  rotation = -4,
  undersideColor = '#e2e0dc',
  borderRadius = 'var(--radius-lg)',
  threshold = 0.6,
  onPeelOff,
  showResidue = true,
  resetOnClick = true,
  style,
  className
}: InteractiveStickerProps) {
  const [state, setState] = useState<StickerState>('idle')
  const [progress, setProgress] = useState(0)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const reduced = useReducedMotion()

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Snap back animation
  useEffect(() => {
    if (state !== 'snapping') return
    const start = progress
    const t0 = Date.now()
    const duration = 320
    let raf = 0
    const tick = () => {
      const t = Math.min(1, (Date.now() - t0) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(start * (1 - eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setProgress(0)
        setState('idle')
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state])

  // Tearing transition
  useEffect(() => {
    if (state !== 'tearing') return
    onPeelOff?.()
    const t = setTimeout(() => setState('removed'), 600)
    return () => clearTimeout(t)
  }, [state, onPeelOff])

  // Drag direction toward opposite corner
  const isRight = peeledCorner.includes('right')
  const isBottom = peeledCorner.includes('bottom')
  const dirX = isRight ? -1 : 1
  const dirY = isBottom ? -1 : 1

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced || state === 'removed' || state === 'tearing') return
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY }
    setState('peeling')
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (state !== 'peeling' || !dragStart.current || !size.w) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const diag = Math.hypot(size.w, size.h)
    const proj = (dx * dirX + dy * dirY) / diag
    setProgress(Math.max(0, Math.min(1, proj)))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (state !== 'peeling') return
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch { /* noop */ }
    dragStart.current = null
    if (progress >= threshold) setState('tearing')
    else setState('snapping')
  }

  const reset = () => {
    setProgress(0)
    setState('idle')
  }

  // --- Rendering ---

  if (state === 'removed') {
    return showResidue ? (
      <div
        onClick={resetOnClick ? reset : undefined}
        style={{
          position: 'relative',
          cursor: resetOnClick ? 'pointer' : 'default',
          transform: `rotate(${rotation}deg)`,
          display: 'inline-block',
          ...style
        }}
        className={className}
      >
        <StickerResidue width={size.w || 150} height={size.h || 150} borderRadius={borderRadius} />
      </div>
    ) : null
  }

  // Effective peel size (base + progress scaled up to most of the diagonal)
  const maxPeel = Math.max(size.w, size.h) * 0.9 || basePeelSize
  const peelSize = basePeelSize + progress * (maxPeel - basePeelSize)

  // Config per corner: position of curl + transform origin + border radius of curl + clip-path shape
  const curlPos = {
    'bottom-right': { bottom: 0, right: 0, transformOrigin: 'bottom right', cornerRadius: `${peelSize * 0.5}px 0 0 0` },
    'bottom-left':  { bottom: 0, left: 0,  transformOrigin: 'bottom left',  cornerRadius: `0 ${peelSize * 0.5}px 0 0` },
    'top-right':    { top: 0, right: 0,    transformOrigin: 'top right',    cornerRadius: `0 0 0 ${peelSize * 0.5}px` },
    'top-left':     { top: 0, left: 0,     transformOrigin: 'top left',     cornerRadius: `0 0 ${peelSize * 0.5}px 0` }
  }[peeledCorner]

  const cutConfig = {
    'bottom-right': `polygon(0 0, 100% 0, 100% calc(100% - ${peelSize}px), calc(100% - ${peelSize}px) 100%, 0 100%)`,
    'bottom-left':  `polygon(0 0, 100% 0, 100% 100%, ${peelSize}px 100%, 0 calc(100% - ${peelSize}px))`,
    'top-right':    `polygon(0 0, calc(100% - ${peelSize}px) 0, 100% ${peelSize}px, 100% 100%, 0 100%)`,
    'top-left':     `polygon(${peelSize}px 0, 100% 0, 100% 100%, 0 100%, 0 ${peelSize}px)`
  }[peeledCorner]

  // Curl tilts slightly forward as the peel grows, to look like paper lifting
  const curlTilt = progress * 12  // degrees
  const curlTiltTransform = peeledCorner === 'bottom-right' ? `rotate(-${curlTilt}deg)`
    : peeledCorner === 'bottom-left' ? `rotate(${curlTilt}deg)`
    : peeledCorner === 'top-right' ? `rotate(${curlTilt}deg)`
    : `rotate(-${curlTilt}deg)`

  // Tearing flies off
  const tearTransform = state === 'tearing'
    ? `rotate(${rotation}deg) translate(${dirX * 260}px, ${-Math.abs(dirY) * 320}px) rotate(${dirX * 30}deg) scale(0.7)`
    : `rotate(${rotation}deg)`

  const tearStyle: CSSProperties = state === 'tearing' ? {
    opacity: 0,
    transition: 'opacity 600ms ease-in, transform 600ms cubic-bezier(0.32, 0, 0.67, 0)',
    pointerEvents: 'none'
  } : {}

  const peelTransition = state === 'peeling' ? 'none' : 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: tearTransform,
        transformOrigin: 'center',
        borderRadius,
        boxShadow: '0 3px 10px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)',
        ...tearStyle,
        ...style
      }}
    >
      {/* Curl (underside) - positioned at the peeled corner */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: peelSize,
          height: peelSize,
          background: `linear-gradient(135deg, ${undersideColor} 0%, ${undersideColor} 50%, rgba(0,0,0,0.08) 100%)`,
          zIndex: 2,
          pointerEvents: 'none',
          boxShadow: `-2px -2px 6px rgba(0,0,0,${0.15 + progress * 0.15})`,
          transition: peelTransition,
          transform: curlTiltTransform,
          ...curlPos,
          borderRadius: curlPos.cornerRadius
        }}
      />

      {/* Content with corner cut away */}
      <div
        style={{
          clipPath: cutConfig,
          WebkitClipPath: cutConfig,
          borderRadius: 'inherit',
          overflow: 'hidden',
          transition: peelTransition
        }}
      >
        {children}
      </div>

      {/* Inner edge shadow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 2px rgba(0,0,0,0.06)',
          pointerEvents: 'none',
          zIndex: 3,
          clipPath: cutConfig,
          WebkitClipPath: cutConfig,
          transition: peelTransition
        }}
      />

      {/* Drag grip (invisible, sits on the curl area) */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute',
          width: Math.max(peelSize, 48),
          height: Math.max(peelSize, 48),
          cursor: state === 'peeling' ? 'grabbing' : 'grab',
          touchAction: 'none',
          zIndex: 4,
          ...(peeledCorner === 'bottom-right' && { bottom: 0, right: 0 }),
          ...(peeledCorner === 'bottom-left' && { bottom: 0, left: 0 }),
          ...(peeledCorner === 'top-right' && { top: 0, right: 0 }),
          ...(peeledCorner === 'top-left' && { top: 0, left: 0 })
        }}
      />
    </div>
  )
}

// ============================================
// RESIDUE
// ============================================

function StickerResidue({
  width,
  height,
  borderRadius
}: {
  width: number
  height: number
  borderRadius: string | number
}) {
  const w = width
  const h = height

  const seededRand = (seed: number) => {
    let s = seed
    return () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  }
  const rand = seededRand(7919)

  // Zigzag edge along perimeter
  const segments = 44
  const amp = 5
  const points: string[] = []
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const n1 = (rand() - 0.5) * amp * 2
    const n2 = (rand() - 0.5) * amp * 2
    let x = 0
    let y = 0
    if (t < 0.25) {
      x = (t / 0.25) * w
      y = n1
    } else if (t < 0.5) {
      x = w + n1
      y = ((t - 0.25) / 0.25) * h
    } else if (t < 0.75) {
      x = w - ((t - 0.5) / 0.25) * w
      y = h + n2
    } else {
      x = n2
      y = h - ((t - 0.75) / 0.25) * h
    }
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  const specks = Array.from({ length: 24 }, (_, i) => ({
    cx: rand() * w,
    cy: rand() * h,
    r: 0.8 + rand() * 2.4,
    op: 0.08 + rand() * 0.18,
    key: i
  }))

  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: 'block', position: 'absolute', inset: 0 }}
      >
        {/* Faint fill */}
        <polygon points={points.join(' ')} fill="rgba(235,231,222,0.12)" />
        {/* Torn dashed edge */}
        <polygon
          points={points.join(' ')}
          fill="none"
          stroke="rgba(210,204,192,0.45)"
          strokeWidth="1"
          strokeDasharray="3 2.5"
        />
        {/* Adhesive specks */}
        {specks.map(s => (
          <circle key={s.key} cx={s.cx} cy={s.cy} r={s.r} fill="rgba(220,214,204,0.7)" opacity={s.op} />
        ))}
      </svg>

      {/* Darkened surface shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 6,
          borderRadius,
          boxShadow: 'inset 0 0 22px rgba(0,0,0,0.1)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
