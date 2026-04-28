import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useScrollProgress } from '../hooks/useScroll'
import { clamp } from '../spring'

// ============================================
// NETWORK GRAPH
// ============================================
// A scroll-revealed network diagram. Nodes and edges are described by
// props; as the element scrolls through the viewport, nodes fade in,
// then edges draw progressively from node to node. Base pattern from
// Webba V8 CommunitySection.
//
// Implementation notes:
// - Runs a continuous rAF loop, like every other canvas primitive. The
//   loop reads the current scroll progress from a ref so React re-renders
//   are not required to trigger a redraw. This avoids the first-paint
//   race where the element was visible but progress was still 0.

export interface NetworkNode {
  id: string
  /** X position in 0-1 normalized coordinates (0 = left, 1 = right) */
  x: number
  /** Y position in 0-1 normalized coordinates. */
  y: number
  /** Optional label drawn next to the node. */
  label?: string
}

export interface NetworkEdge {
  from: string
  to: string
}

export interface NetworkGraphProps {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  /** Node radius in px. @default 6 */
  nodeRadius?: number
  /** Node + edge color. @default 'rgba(163, 91, 255, 0.8)' */
  color?: string
  /** Label color. @default 'var(--text-secondary)' */
  labelColor?: string
  /** Label font size. @default 11 */
  labelFontSize?: number
  /** Where in the scroll progress nodes appear. @default 0.0 */
  nodesStart?: number
  /** Where in the scroll progress edges finish drawing. @default 0.8 */
  edgesEnd?: number
  /**
   * When true, the diagram is always fully drawn regardless of scroll
   * position. Useful inside small demo panes where scroll reveal does
   * not have enough travel to fire.
   * @default false
   */
  alwaysVisible?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Scroll-revealed network diagram. Nodes fade in first, then edges draw
 * progressively as the element travels through the viewport. Pass
 * `alwaysVisible` to skip the scroll-reveal and show the diagram at rest.
 *
 * @example
 *   <div style={{ position: 'relative', height: 500 }}>
 *     <NetworkGraph
 *       nodes={[
 *         { id: 'a', x: 0.2, y: 0.5, label: 'You' },
 *         { id: 'b', x: 0.5, y: 0.2, label: 'Forge' }
 *       ]}
 *       edges={[{ from: 'a', to: 'b' }]}
 *     />
 *   </div>
 */
export function NetworkGraph({
  nodes,
  edges,
  nodeRadius = 6,
  color = 'rgba(163, 91, 255, 0.8)',
  labelColor = 'rgba(255, 255, 255, 0.7)',
  labelFontSize = 11,
  nodesStart = 0,
  edgesEnd = 0.8,
  alwaysVisible = false,
  className,
  style
}: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const scrollProgress = useScrollProgress(wrapperRef)

  // Keep the latest progress / props in refs so the rAF loop can read
  // them without re-running the mount effect on every React render.
  const progressRef = useRef(0)
  progressRef.current = reduced || alwaysVisible ? 1 : scrollProgress
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const edgesRef = useRef(edges)
  edgesRef.current = edges
  const configRef = useRef({ nodeRadius, color, labelColor, labelFontSize, nodesStart, edgesEnd })
  configRef.current = { nodeRadius, color, labelColor, labelFontSize, nodesStart, edgesEnd }

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    const draw = () => {
      if (width === 0 || height === 0) return
      const progress = progressRef.current
      const currentNodes = nodesRef.current
      const currentEdges = edgesRef.current
      const cfg = configRef.current

      ctx.clearRect(0, 0, width, height)

      // Compute node positions in px
      const positions = new Map<string, { x: number; y: number }>()
      for (const n of currentNodes) {
        positions.set(n.id, { x: n.x * width, y: n.y * height })
      }

      // Edges first so they sit under the nodes
      const edgesPhase = clamp(
        (progress - cfg.nodesStart) / (cfg.edgesEnd - cfg.nodesStart),
        0,
        1
      )
      ctx.strokeStyle = cfg.color
      ctx.lineWidth = 1.5
      for (let i = 0; i < currentEdges.length; i++) {
        const e = currentEdges[i]
        const a = positions.get(e.from)
        const b = positions.get(e.to)
        if (!a || !b) continue
        const edgeStart = (i / currentEdges.length) * 0.8
        const edgeEnd = edgeStart + 0.2
        const localPhase = clamp((edgesPhase - edgeStart) / (edgeEnd - edgeStart), 0, 1)
        if (localPhase <= 0) continue
        const tx = a.x + (b.x - a.x) * localPhase
        const ty = a.y + (b.y - a.y) * localPhase
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(tx, ty)
        ctx.stroke()
      }

      // Nodes
      const nodePhase = clamp(progress / Math.max(cfg.nodesStart + 0.2, 0.01), 0, 1)
      ctx.globalAlpha = nodePhase
      ctx.fillStyle = cfg.color
      for (const n of currentNodes) {
        const p = positions.get(n.id)!
        ctx.beginPath()
        ctx.arc(p.x, p.y, cfg.nodeRadius, 0, Math.PI * 2)
        ctx.fill()
      }
      // Labels last so they sit on top
      ctx.fillStyle = cfg.labelColor
      ctx.font = `${cfg.labelFontSize}px system-ui, -apple-system, sans-serif`
      ctx.textAlign = 'center'
      for (const n of currentNodes) {
        if (!n.label) continue
        const p = positions.get(n.id)!
        ctx.fillText(n.label, p.x, p.y - cfg.nodeRadius - 8)
      }
    }

    let raf = 0
    const tick = () => {
      draw()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

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
