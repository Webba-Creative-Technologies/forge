import type { CSSProperties, ReactNode } from 'react'

// ============================================
// SHIMMER
// ============================================

export interface ShimmerProps {
  children: ReactNode
  /**
   * Base color of the shimmered surface. @default 'rgba(255, 255, 255, 0.06)'
   */
  color?: string
  /**
   * Highlight color that sweeps across. @default 'rgba(255, 255, 255, 0.18)'
   */
  highlight?: string
  /**
   * Shimmer duration in seconds. @default 2
   */
  duration?: number
  style?: CSSProperties
  className?: string
}

/**
 * Generic shimmer overlay used by skeleton loaders and placeholder cards.
 * Wraps children in a container with a sweeping gradient animation.
 *
 * @example
 *   <Shimmer><div style={{ width: 200, height: 24 }} /></Shimmer>
 */
export function Shimmer({
  children,
  color = 'rgba(255, 255, 255, 0.06)',
  highlight = 'rgba(255, 255, 255, 0.18)',
  duration = 2,
  style,
  className
}: ShimmerProps) {
  const mergedStyle: CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 40%, ${highlight} 50%, ${color} 60%, ${color} 100%)`,
    animationDuration: `${duration}s`,
    ...style
  }

  return (
    <div
      className={`forge-motion-shimmer ${className ?? ''}`.trim()}
      style={mergedStyle}
    >
      {children}
    </div>
  )
}
