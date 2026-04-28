import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// SCRATCH CARD
// ============================================
// Canvas overlay that the user can "scratch" (erase) by dragging
// their pointer to reveal content underneath.

export interface ScratchCardProps {
  /** Content revealed underneath the scratch layer. */
  children: ReactNode
  /** Color of the scratch overlay. @default '#c0c0c0' */
  overlayColor?: string
  /** Text shown on the overlay before scratching. */
  overlayText?: string
  /** Brush radius in px. @default 24 */
  brushSize?: number
  /** Percentage of area that must be scratched to trigger onComplete. @default 60 */
  revealThreshold?: number
  /** Called with the current scratch percentage on every stroke. */
  onReveal?: (percent: number) => void
  /** Called once when revealThreshold is reached. */
  onComplete?: () => void
  /** Width. @default '100%' */
  width?: string | number
  /** Height. @default 200 */
  height?: number
  /** Border radius. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * Scratch card that reveals content underneath on pointer drag.
 *
 * @example
 *   <ScratchCard overlayText="Scratch here" onComplete={() => alert('Won!')}>
 *     <Text>You won a prize!</Text>
 *   </ScratchCard>
 */
export function ScratchCard({
  children,
  overlayColor = '#c0c0c0',
  overlayText,
  brushSize = 24,
  revealThreshold = 60,
  onReveal,
  onComplete,
  width = '100%',
  height = 200,
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scratchingRef = useRef(false)
  const completedRef = useRef(false)
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(reduced)

  useEffect(() => {
    if (reduced || revealed) return
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = wrapper.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Base: warm silver, lighter than concrete
    ctx.fillStyle = '#d0ccc6'
    ctx.fillRect(0, 0, w, h)

    // Uneven coating: horizontal radial gradients for soft tonal variation
    for (let i = 0; i < 5; i++) {
      const cx = Math.random() * w
      const cy = Math.random() * h
      const r = 40 + Math.random() * 80
      const tone = 190 + Math.random() * 25
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, `rgba(${tone}, ${tone - 5}, ${tone - 10}, 0.3)`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
    }

    // Pre-scratched marks: a few faint streaks as if someone tested it
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    for (let i = 0; i < 3; i++) {
      const sx = w * 0.15 + Math.random() * w * 0.3
      const sy = h * 0.3 + Math.random() * h * 0.4
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(sx + 15 + Math.random() * 25, sy + (Math.random() - 0.5) * 10)
      ctx.stroke()
    }

    // Fine matte grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    for (let i = 0; i < w * h * 0.008; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
    }

    // Overlay text
    if (overlayText) {
      ctx.fillStyle = 'rgba(100, 95, 88, 0.55)'
      ctx.font = '600 13px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(overlayText, w / 2, h / 2)
    }

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, brushSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    const getPercent = (): number => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let transparent = 0
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparent++
      }
      return (transparent / (imageData.data.length / 4)) * 100
    }

    const getPos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onDown = (e: PointerEvent) => {
      scratchingRef.current = true
      const { x, y } = getPos(e)
      scratch(x, y)
    }

    const onMove = (e: PointerEvent) => {
      if (!scratchingRef.current) return
      const { x, y } = getPos(e)
      scratch(x, y)
      const pct = getPercent()
      onReveal?.(pct)
      if (!completedRef.current && pct >= revealThreshold) {
        completedRef.current = true
        setRevealed(true)
        onComplete?.()
      }
    }

    const onUp = () => {
      scratchingRef.current = false
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [overlayColor, overlayText, brushSize, revealThreshold, onReveal, onComplete, reduced, revealed])

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    borderRadius,
    overflow: 'hidden',
    ...style
  }

  return (
    <div ref={wrapperRef} className={className} style={wrapperStyle}>
      {/* Content underneath */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
      {/* Scratch canvas overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'crosshair',
            touchAction: 'none'
          }}
        />
      )}
    </div>
  )
}
