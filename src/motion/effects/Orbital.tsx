import { Children, type CSSProperties, type ReactNode } from 'react'

// ============================================
// ORBITAL
// ============================================
// Places children around a central node, rotating around it on a shared
// orbit. Pure CSS — no JS scheduling, no rAF.
//
// How it works:
// - Each orbiting child lives inside a 0x0 "ring" pinned at the wrapper's
//   center (top: 50%, left: 50%).
// - A CSS @keyframes animation rotates the ring around its own 0x0 origin,
//   which is the wrapper's center. Children inside the ring are positioned
//   at (radius, 0) relative to that origin, so they sweep along the orbit.
// - Different starting angles are achieved via `animationDelay: negative`:
//   a ring with delay `-(angle/360) * duration` starts its loop already
//   advanced by that angle, effectively setting its initial position.
// - The child is wrapped in a static translate(-50%, -50%) so its centre
//   (not its top-left) sits on the orbit path. This wrapper is NOT
//   animated, so the translate isn't overwritten.
// - To keep the child visually upright while the ring spins, an innermost
//   wrapper runs the SAME animation in the opposite direction. Its
//   transform is just rotate, so it composes cleanly with nothing else.

export interface OrbitalProps {
  /** Central element. Stays stationary in the middle of the orbit. */
  center: ReactNode
  /** Orbiting children. Distributed at equal angular offsets. */
  children: ReactNode
  /** Orbit radius in px. @default 120 */
  radius?: number
  /** Seconds for one full loop. @default 20 */
  duration?: number
  /** Rotation direction. @default 'cw' */
  direction?: 'cw' | 'ccw'
  /**
   * Keep each orbiting child visually upright as the ring spins.
   * @default true
   */
  counterRotate?: boolean
  style?: CSSProperties
  className?: string
}

/**
 * Children orbit around a central element.
 *
 * @example
 *   <Orbital center={<Logo />} radius={120}>
 *     <Avatar name="A" />
 *     <Avatar name="B" />
 *     <Avatar name="C" />
 *   </Orbital>
 */
export function Orbital({
  center,
  children,
  radius = 120,
  duration = 20,
  direction = 'cw',
  counterRotate = true,
  style,
  className
}: OrbitalProps) {
  const childrenArray = Children.toArray(children)
  const count = childrenArray.length

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: radius * 2,
    height: radius * 2,
    ...style
  }

  const ringDirection = direction === 'cw' ? 'normal' : 'reverse'
  const counterDirection = direction === 'cw' ? 'reverse' : 'normal'

  return (
    <div
      className={`forge-motion-orbital ${className ?? ''}`.trim()}
      style={wrapperStyle}
    >
      {/* Center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}
      >
        {center}
      </div>

      {/* Orbiting children */}
      {childrenArray.map((child, i) => {
        const angle = (360 / count) * i
        // Negative delay puts the ring at (angle/360) of its cycle at t=0
        const delay = `-${(angle / 360) * duration}s`

        const ringStyle: CSSProperties = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          animation: `forge-orbital-spin ${duration}s linear ${delay} infinite ${ringDirection}`,
          willChange: 'transform'
        }

        // The middle wrapper carries the translate(-50%, -50%) so the child's
        // CENTER sits on the orbit path. Not animated -> translate survives.
        const centeringStyle: CSSProperties = {
          position: 'absolute',
          left: radius,
          top: 0,
          transform: 'translate(-50%, -50%)'
        }

        // Counter-rotating innermost wrapper keeps the child upright.
        const counterStyle: CSSProperties | undefined = counterRotate
          ? {
              display: 'inline-block',
              animation: `forge-orbital-spin ${duration}s linear ${delay} infinite ${counterDirection}`,
              willChange: 'transform'
            }
          : undefined

        return (
          <div key={i} style={ringStyle}>
            <div style={centeringStyle}>
              {counterRotate ? <div style={counterStyle}>{child}</div> : child}
            </div>
          </div>
        )
      })}
    </div>
  )
}
