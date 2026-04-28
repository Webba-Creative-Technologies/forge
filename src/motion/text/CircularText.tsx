import type { CSSProperties } from 'react'

// ============================================
// CIRCULAR TEXT
// ============================================
// Renders text along a circular SVG path. Optionally spins
// continuously via CSS animation.

export interface CircularTextProps {
  /** Text to render along the circle. Repeat the text with separators for a full ring. */
  text: string
  /** Circle radius in px. @default 80 */
  radius?: number
  /** Font size in px. @default 14 */
  fontSize?: number
  /** Letter spacing. @default 2 */
  letterSpacing?: number
  /** Spin continuously. @default false */
  spin?: boolean
  /** Spin speed in seconds per revolution. @default 20 */
  speed?: number
  /** Spin direction. @default 'cw' */
  direction?: 'cw' | 'ccw'
  /** Text color. @default 'currentColor' */
  color?: string
  /** Font weight. @default 600 */
  fontWeight?: number
  style?: CSSProperties
  className?: string
}

/**
 * Text rendered along a circular path.
 *
 * @example
 *   <CircularText text="FORGE MOTION · FORGE MOTION · " radius={80} spin />
 */
export function CircularText({
  text,
  radius = 80,
  fontSize = 14,
  letterSpacing = 2,
  spin = false,
  speed = 20,
  direction = 'cw',
  color = 'currentColor',
  fontWeight = 600,
  style,
  className
}: CircularTextProps) {
  const size = radius * 2
  // SVG circle path for textPath
  const d = direction === 'cw'
    ? `M ${radius},${radius} m -${radius},0 a ${radius},${radius} 0 1,1 ${size},0 a ${radius},${radius} 0 1,1 -${size},0`
    : `M ${radius},${radius} m ${radius},0 a ${radius},${radius} 0 1,0 -${size},0 a ${radius},${radius} 0 1,0 ${size},0`

  const wrapperStyle: CSSProperties = {
    display: 'inline-block',
    width: size,
    height: size,
    ...(spin ? {
      animation: `forge-orbital-spin ${speed}s linear infinite ${direction === 'cw' ? 'normal' : 'reverse'}`
    } : {}),
    ...style
  }

  return (
    <div className={className} style={wrapperStyle}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <path id={`circular-text-path-${radius}`} d={d} fill="none" />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
        >
          <textPath href={`#circular-text-path-${radius}`}>
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  )
}
