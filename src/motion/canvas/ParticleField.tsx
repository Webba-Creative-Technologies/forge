import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// PARTICLE FIELD
// ============================================
// A generic floating particle system. Particles drift with light noise,
// respect bounds, and softly fade in/out with a life cycle. The base
// primitive for Confetti/Ember/decorative backgrounds.

export interface ParticleFieldProps {
  /** Number of particles on screen. @default 80 */
  count?: number
  /** Particle color. @default 'rgba(255, 255, 255, 0.5)' */
  color?: string
  /** Min/max particle radius in px. @default [1, 3] */
  size?: [number, number]
  /** Min/max particle speed in px per frame. @default [0.2, 0.6] */
  speed?: [number, number]
  /** Gravity acceleration per frame. @default 0 (no gravity) */
  gravity?: number
  /** Whether particles wrap at edges (true) or bounce (false). @default true */
  wrap?: boolean
  className?: string
  style?: CSSProperties
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
}

/**
 * Decorative floating particle system. Fills its positioned parent.
 *
 * @example
 *   <div style={{ position: 'relative', height: 400 }}>
 *     <ParticleField count={120} color="rgba(163, 91, 255, 0.4)" />
 *   </div>
 */
export function ParticleField({
  count = 80,
  color = 'rgba(255, 255, 255, 0.5)',
  size = [1, 3],
  speed = [0.2, 0.6],
  gravity = 0,
  wrap = true,
  className,
  style
}: ParticleFieldProps) {
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
    let particles: Particle[] = []

    const spawn = (): Particle => {
      const maxLife = 200 + Math.random() * 400
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (speed[1] - speed[0]) + speed[0] * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() - 0.5) * (speed[1] - speed[0]) + speed[0] * (Math.random() < 0.5 ? -1 : 1),
        size: size[0] + Math.random() * (size[1] - size[0]),
        life: maxLife,
        maxLife
      }
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
      if (particles.length === 0) {
        particles = Array.from({ length: count }, spawn)
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.vy += gravity
        p.x += p.vx
        p.y += p.vy
        p.life--

        if (wrap) {
          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0
        } else {
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1
        }

        if (p.life <= 0) {
          const next = spawn()
          Object.assign(p, next)
        }

        const alpha = Math.min(1, p.life / 80) * Math.min(1, (p.maxLife - p.life) / 80)
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [count, color, size, speed, gravity, wrap, reduced])

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
