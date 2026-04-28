import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useScrollProgress } from './hooks/useScroll'

// ============================================
// STICKY SECTION
// ============================================
// A tall container with an inner sticky viewport. The inner render prop
// receives a 0-1 progress scalar representing how far the container has
// scrolled through the viewport, enabling multi-phase scroll
// choreographies (ApproachSection-style).
//
// Consumer controls the total height in viewport-height units so the
// scroll duration is explicit.

export interface StickySectionRenderProps {
  /** 0 = start, 1 = end of the scroll range. */
  progress: number
}

export interface StickySectionProps {
  /**
   * Total height of the scroll container in viewport-height units.
   * e.g. 4 = 400vh. The inner sticky frame is always 100vh.
   * @default 3
   */
  heightVh?: number
  /**
   * Render function called with the current scroll progress. Use it to
   * compute phased opacity / transform on nested children.
   */
  children: (render: StickySectionRenderProps) => ReactNode
  style?: CSSProperties
  className?: string
}

/**
 * Tall section with a 100vh sticky inner frame. The render function
 * receives a 0-1 progress value for phased animations.
 *
 * @example
 *   <StickySection heightVh={5}>
 *     {({ progress }) => (
 *       <div style={{ opacity: phase(progress, 0.1, 0.5) }}>
 *         Revealed between 10% and 50% scroll
 *       </div>
 *     )}
 *   </StickySection>
 */
export function StickySection({
  heightVh = 3,
  children,
  style,
  className
}: StickySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(ref)

  const outerStyle: CSSProperties = {
    height: `${heightVh * 100}vh`,
    position: 'relative',
    ...style
  }

  const innerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: '100%',
    overflow: 'hidden'
  }

  return (
    <div ref={ref} className={className} style={outerStyle}>
      <div style={innerStyle}>{children({ progress })}</div>
    </div>
  )
}
