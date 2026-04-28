import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ============================================
// CONFETTI
// ============================================
// Canvas-based particle burst. Fires a one-shot cascade when `trigger`
// changes. Zero deps, respects useReducedMotion.

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  life: number
  shape: 'square' | 'circle' | 'triangle'
}

const DEFAULT_COLORS = [
  '#A35BFF',
  '#FD9173',
  '#10b981',
  '#f59e0b',
  '#3b82f6'
]

export interface ConfettiProps {
  /**
   * Changing this value (e.g. a counter or timestamp) triggers a new
   * burst. Passing the same value on re-renders does nothing.
   */
  trigger: number | string | boolean
  /** Number of particles in the burst. @default 60 */
  count?: number
  /** Color palette. @default forge brand palette */
  colors?: string[]
  /** Origin X in viewport px. @default window.innerWidth / 2 */
  originX?: number
  /** Origin Y in viewport px. @default window.innerHeight / 3 */
  originY?: number
  /**
   * Spread angle of the cone in degrees (180 = full hemisphere).
   * @default 90
   */
  spread?: number
  /** Gravity acceleration per frame. @default 0.15 */
  gravity?: number
  /** Particle lifespan in frames. @default 180 */
  lifetime?: number
}

/**
 * One-shot confetti burst overlaid on the page via a fixed canvas.
 *
 * @example
 *   const [fire, setFire] = useState(0)
 *   <>
 *     <Button onClick={() => setFire(f => f + 1)}>Celebrate</Button>
 *     <Confetti trigger={fire} />
 *   </>
 */
export function Confetti({
  trigger,
  count = 60,
  colors = DEFAULT_COLORS,
  originX,
  originY,
  spread = 90,
  gravity = 0.15,
  lifetime = 180
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const reduced = useReducedMotion()

  // Fire a burst whenever `trigger` changes.
  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.scale(dpr, dpr)

    const ox = originX ?? window.innerWidth / 2
    const oy = originY ?? window.innerHeight / 3
    const spreadRad = (spread * Math.PI) / 180

    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad
      const speed = 6 + Math.random() * 6
      newParticles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: lifetime,
        shape:
          Math.random() < 0.33 ? 'square' : Math.random() < 0.66 ? 'circle' : 'triangle'
      })
    }
    particlesRef.current = [...particlesRef.current, ...newParticles]

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const remaining: Particle[] = []
      for (const p of particlesRef.current) {
        p.vy += gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.life--

        if (p.life <= 0 || p.y > window.innerHeight + 40) continue
        remaining.push(p)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.min(1, p.life / 40)
        if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }
      particlesRef.current = remaining
      if (remaining.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = 0
      }
    }
    if (rafRef.current === 0) {
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      particlesRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998
      }}
    />
  )
}
