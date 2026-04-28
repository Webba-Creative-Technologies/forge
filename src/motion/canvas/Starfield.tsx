import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// STARFIELD
// ============================================
// Canvas-based generative starfield. A grid of monospace glyphs drawn with
// per-cell alpha that pulses on a sine wave and reacts to pointer
// proximity (cells near the cursor fade). Signature visual from Webba V8
// hero, ported as a Forge primitive.

export interface StarfieldProps {
  /**
   * Cell size in px. Smaller = denser grid. @default 18
   */
  cellSize?: number
  /**
   * Base color of glyphs. @default 'rgba(255, 255, 255, 0.4)'
   */
  color?: string
  /**
   * Radius in px of the cursor influence zone.
   * @default 280
   */
  attractRadius?: number
  /**
   * Whether the cursor attracts (brightens) or repels (dims) glyphs.
   * @default 'repel'
   */
  mode?: 'attract' | 'repel'
  /**
   * Character pool used for the glyphs. Random pick per cell.
   * @default '∇φΩ·*+·'
   */
  glyphs?: string
  /**
   * Pulse frequency (radians per ms). @default 0.0008
   */
  pulseSpeed?: number
  /**
   * Font size in px for the glyphs. @default 13
   */
  fontSize?: number
  /**
   * Class for the wrapper container.
   */
  className?: string
  style?: CSSProperties
}

/**
 * Canvas starfield that reacts to the pointer. Fills its container.
 *
 * @example
 *   <div style={{ position: 'relative', height: 600 }}>
 *     <Starfield attractRadius={320} />
 *     <HeroContent />
 *   </div>
 */
export function Starfield({
  cellSize = 18,
  color = 'rgba(255, 255, 255, 0.4)',
  attractRadius = 280,
  mode = 'repel',
  glyphs = '∇φΩ·*+·',
  pulseSpeed = 0.0008,
  fontSize = 13,
  className,
  style
}: StarfieldProps) {
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

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    // Listen on window so the starfield reacts even when content sits
    // on top of the canvas (higher z-index). We check if the pointer is
    // within the wrapper's bounds manually.
    const onMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseX = x
        mouseY = y
      } else {
        mouseX = -Infinity
        mouseY = -Infinity
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const cols = Math.ceil(width / cellSize) + 1
      const rows = Math.ceil(height / cellSize) + 1

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize + cellSize / 2
          const y = r * cellSize + cellSize / 2

          // Deterministic glyph per cell
          const idx = (r * 31 + c * 17) % glyphs.length
          const glyph = glyphs[idx]

          // Sine pulse offset per cell so they don't all pulse together
          const phaseOffset = (r * 0.3 + c * 0.25) % (Math.PI * 2)
          const pulse = 0.5 + 0.5 * Math.sin(time * pulseSpeed + phaseOffset)

          // Cursor proximity falloff
          let proximity = 1
          if (mouseX > -Infinity) {
            const dx = x - mouseX
            const dy = y - mouseY
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < attractRadius) {
              const factor = Math.pow(1 - dist / attractRadius, 1.5)
              proximity = mode === 'repel' ? 1 - factor : 1 + factor * 0.8
            }
          }

          const alpha = Math.max(0, Math.min(1, pulse * proximity * 0.7))
          ctx.globalAlpha = alpha
          ctx.fillStyle = color
          ctx.fillText(glyph, x, y)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [cellSize, color, attractRadius, mode, glyphs, pulseSpeed, fontSize, reduced])

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    ...style
  }

  return (
    <div ref={wrapperRef} className={className} style={wrapperStyle} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
