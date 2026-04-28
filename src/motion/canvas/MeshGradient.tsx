import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// MESH GRADIENT
// ============================================
// Animated mesh gradient drawn on canvas. Several colored radial
// gradients slowly drift around the canvas and blend via `globalCompositeOperation`
// = 'lighter' for an organic blob feel à la Stripe / Linear / Pixel Launcher.

export interface MeshGradientProps {
  /**
   * Colors to mesh together. Minimum 2, recommended 3-5.
   * @default Forge brand gradient (purple, orange, violet)
   */
  colors?: string[]
  /**
   * Radius in px of each color blob. @default 400
   */
  blobRadius?: number
  /**
   * Speed of the blob drift (0 = still, 1 = brisk). @default 0.3
   */
  speed?: number
  /**
   * Blur passed to the canvas filter for extra softness (px).
   * @default 60
   */
  blur?: number
  className?: string
  style?: CSSProperties
}

interface Blob {
  baseX: number
  baseY: number
  amplitudeX: number
  amplitudeY: number
  phaseX: number
  phaseY: number
  freqX: number
  freqY: number
  color: string
}

/**
 * Drifting animated mesh gradient. Fills its positioned parent.
 *
 * @example
 *   <div style={{ position: 'relative', height: 600 }}>
 *     <MeshGradient colors={['#A35BFF', '#FD9173', '#10b981']} />
 *     <HeroContent />
 *   </div>
 */
export function MeshGradient({
  colors = ['#A35BFF', '#FD9173', '#8B5CF6'],
  blobRadius = 400,
  speed = 0.3,
  blur = 60,
  className,
  style
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0
    let blobs: Blob[] = []

    const seed = () => {
      blobs = colors.map((color, i) => ({
        baseX: (i + 1) * (width / (colors.length + 1)),
        baseY: (i % 2 === 0 ? 0.35 : 0.65) * height,
        amplitudeX: width * 0.25,
        amplitudeY: height * 0.2,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        freqX: 0.0003 * speed * (0.8 + Math.random() * 0.4),
        freqY: 0.0004 * speed * (0.8 + Math.random() * 0.4),
        color
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
      seed()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    // Static render when reduced motion is on
    if (reduced) {
      const drawOnce = () => {
        ctx.clearRect(0, 0, width, height)
        ctx.filter = `blur(${blur}px)`
        ctx.globalCompositeOperation = 'lighter'
        for (const b of blobs) {
          const grad = ctx.createRadialGradient(b.baseX, b.baseY, 0, b.baseX, b.baseY, blobRadius)
          grad.addColorStop(0, b.color)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(0, 0, width, height)
        }
      }
      drawOnce()
      return () => ro.disconnect()
    }

    let raf = 0
    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.filter = `blur(${blur}px)`
      ctx.globalCompositeOperation = 'lighter'

      for (const b of blobs) {
        const x = b.baseX + Math.sin(time * b.freqX + b.phaseX) * b.amplitudeX
        const y = b.baseY + Math.cos(time * b.freqY + b.phaseY) * b.amplitudeY
        const grad = ctx.createRadialGradient(x, y, 0, x, y, blobRadius)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [colors, blobRadius, speed, blur, reduced])

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    ...style
  }

  return (
    <div ref={wrapperRef} className={className} style={wrapperStyle} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
