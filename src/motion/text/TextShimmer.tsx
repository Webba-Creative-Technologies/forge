import type { CSSProperties, ReactNode } from 'react'

// ============================================
// TEXT SHIMMER
// ============================================

export interface TextShimmerProps {
  children: ReactNode
  /** Base color of the text. @default 'var(--text-secondary)' */
  color?: string
  /** Highlight color that sweeps across. @default 'var(--brand-primary)' */
  highlight?: string
  style?: CSSProperties
  className?: string
}

/**
 * A shimmer wave that continuously sweeps across a text string. Pure
 * CSS via `background-clip: text` and the `forge-text-shimmer` keyframe.
 *
 * @example
 *   <TextShimmer>Loading content</TextShimmer>
 */
export function TextShimmer({
  children,
  color = 'var(--text-secondary)',
  highlight = 'var(--brand-primary)',
  style,
  className
}: TextShimmerProps) {
  const mergedStyle: CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 40%, ${highlight} 50%, ${color} 60%, ${color} 100%)`,
    ...style
  }

  return (
    <span
      className={`forge-motion-text-shimmer ${className ?? ''}`.trim()}
      style={mergedStyle}
    >
      {children}
    </span>
  )
}
