import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// CONSTELLATION GRID
// ============================================
// A generative constellation drawn on canvas: random points scattered
// across the area are connected by lines when they are closer than a
// configurable threshold. Line alpha pulses on a sine wave and fades near
// the cursor for a "torch lifts the fog" effect.

export interface ConstellationGridProps {
  /** Number of nodes. @default 60 */
  count?: number
  /** Maximum distance in px to draw a link between two nodes. @default 140 */
  linkDistance?: number
  /** Node + line color. @default 'rgba(163, 91, 255, 0.55)' */
  color?: string
  /** Node radius in px. @default 2 */
  nodeRadius?: number
  /** Drift speed (px per frame). @default 0.15 */
  driftSpeed?: number
  /** Cursor influence radius. @default 200 */
  cursorRadius?: number
  className?: string
  style?: CSSProperties
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  phase: number
}

/**
 * A drifting constellation with links between nearby nodes. Lines pulse
 * and fade away from the cursor for an interactive parallax feel.
 *
 * @example
 *   <div style={{ position: 'relative', height: 500 }}>
 *     <ConstellationGrid count={80} linkDistance={160} />
 *   </div>
 */
export function ConstellationGrid({
  count = 60,
  linkDistance = 140,
  color = 'rgba(163, 91, 255, 0.55)',
  nodeRadius = 2,
  driftSpeed = 0.15,
  cursorRadius = 200,
  className,
  style
}: ConstellationGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0
    let mouseX = -Infinity
    let mouseY = -Infinity
    let nodes: Node[] = []

    const seed = () => {
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * driftSpeed,
        vy: (Math.random() - 0.5) * driftSpeed,
        phase: Math.random() * Math.PI * 2
      }))
    }

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (nodes.length === 0) seed()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    const onMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const onLeave = () => {
      mouseX = -Infinity
      mouseY = -Infinity
    }
    wrapper.addEventListener('pointermove', onMove, { passive: true })
    wrapper.addEventListener('pointerleave', onLeave)

    let raf = 0
    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      // Advance nodes
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // Draw links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > linkDistance) continue

          const baseAlpha = 1 - dist / linkDistance
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.0015 + a.phase + b.phase)

          // Cursor suppression
          let proximity = 1
          if (mouseX > -Infinity) {
            const mx = (a.x + b.x) / 2 - mouseX
            const my = (a.y + b.y) / 2 - mouseY
            const mdist = Math.sqrt(mx * mx + my * my)
            if (mdist < cursorRadius) {
              proximity = mdist / cursorRadius
            }
          }

          const alpha = baseAlpha * pulse * proximity
          if (alpha < 0.02) continue
          ctx.globalAlpha = alpha
          ctx.strokeStyle = color
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // Draw nodes
      ctx.globalAlpha = 1
      ctx.fillStyle = color
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      wrapper.removeEventListener('pointermove', onMove)
      wrapper.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [count, linkDistance, color, nodeRadius, driftSpeed, cursorRadius, reduced])

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    ...style
  }

  return (
    <div ref={wrapperRef} className={className} style={wrapperStyle} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
