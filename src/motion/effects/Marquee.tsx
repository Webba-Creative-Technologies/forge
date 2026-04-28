import { Children, type CSSProperties, type ReactNode } from 'react'

// ============================================
// MARQUEE
// ============================================
// Horizontal infinite scroll via pure CSS. The children are duplicated
// once inside the track so translateX(-50%) seamlessly loops. Mask
// gradient on the left/right edges for a soft fade.

export interface MarqueeProps {
  children: ReactNode
  /** Animation speed (seconds per full loop). @default 30 */
  duration?: number
  /** Direction. @default 'ltr' */
  direction?: 'ltr' | 'rtl'
  /** Gap between items in px. @default 32 */
  gap?: number
  /** Pause the marquee when the user hovers over it. @default true */
  pauseOnHover?: boolean
  /** Fade the left and right edges into the surrounding background via a
   *  CSS mask. Use `true` for the default 64px fade or a number for a
   *  custom edge width in px. @default false */
  fadeEdges?: boolean | number
  style?: CSSProperties
  className?: string
}

/**
 * Infinite horizontal scrolling container. Duplicates children once to
 * allow a seamless translate(-50%) loop.
 *
 * @example
 *   <Marquee duration={20} gap={48}>
 *     {logos.map(l => <img key={l} src={l} height={40} />)}
 *   </Marquee>
 */
export function Marquee({
  children,
  duration = 30,
  direction = 'ltr',
  gap = 32,
  pauseOnHover = true,
  fadeEdges = false,
  style,
  className
}: MarqueeProps) {
  const childrenArray = Children.toArray(children)

  const trackStyle: CSSProperties = {
    gap,
    animationDuration: `${duration}s`,
    paddingRight: gap
  }

  const trackClass = [
    'forge-motion-marquee-track',
    `forge-motion-marquee-track--${direction}`,
    pauseOnHover ? 'forge-motion-marquee-track--pause' : ''
  ]
    .filter(Boolean)
    .join(' ')

  // Build the edge-fade mask when requested. `fadeEdges` accepts a boolean
  // (default 64px) or a number for custom width. The mask fades left and
  // right edges to transparent so logos blend into the surrounding bg.
  const fadeWidth = fadeEdges === true ? 64 : typeof fadeEdges === 'number' ? fadeEdges : 0
  const wrapperStyle: CSSProperties = fadeWidth > 0
    ? {
        ...style,
        maskImage: `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`
      }
    : (style ?? {})

  return (
    <div
      className={`forge-motion-marquee ${className ?? ''}`.trim()}
      style={wrapperStyle}
    >
      <div className={trackClass} style={trackStyle}>
        {childrenArray.map((child, i) => (
          <div key={`a-${i}`} style={{ flexShrink: 0 }}>
            {child}
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {childrenArray.map((child, i) => (
          <div key={`b-${i}`} style={{ flexShrink: 0 }} aria-hidden="true">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
