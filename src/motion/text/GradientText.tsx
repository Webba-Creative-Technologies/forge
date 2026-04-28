import type { CSSProperties, ElementType, ReactNode } from 'react'

// ============================================
// GRADIENT TEXT
// ============================================

export interface GradientTextProps {
  children: ReactNode
  /** Gradient start color. @default '#A35BFF' (Forge brand primary) */
  from?: string
  /** Gradient end color. @default '#FD9173' (Forge brand secondary) */
  to?: string
  /** Optional third stop for 3-color gradients. */
  via?: string
  /** Gradient angle in degrees. @default 90 (left -> right) */
  angle?: number
  /**
   * Animate the gradient — the background position shifts left/right
   * continuously. Disabled by default because it's attention-grabbing.
   * @default false
   */
  animated?: boolean
  as?: ElementType
  style?: CSSProperties
  className?: string
}

/**
 * Text rendered with a color gradient via `background-clip: text`. Can
 * optionally animate the gradient position for a shifting hue effect.
 *
 * @example
 *   <GradientText from="#A35BFF" to="#FD9173">
 *     Build beautiful
 *   </GradientText>
 */
export function GradientText({
  children,
  from = '#A35BFF',
  to = '#FD9173',
  via,
  angle = 90,
  animated = false,
  as: Tag = 'span',
  style,
  className
}: GradientTextProps) {
  const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`
  const background = `linear-gradient(${angle}deg, ${stops})`

  const mergedStyle: CSSProperties = {
    backgroundImage: background,
    display: 'inline-block',
    ...style
  }

  const mergedClass = [
    'forge-motion-gradient-text',
    animated ? 'forge-motion-gradient-text--animated' : '',
    className ?? ''
  ]
    .filter(Boolean)
    .join(' ')

  const Component = Tag as ElementType
  return (
    <Component className={mergedClass} style={mergedStyle}>
      {children}
    </Component>
  )
}
