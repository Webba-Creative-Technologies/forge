import type { CSSProperties, ReactNode } from 'react'

// ============================================
// AURA
// ============================================
// A pulsing halo that emanates from a focused/highlighted element. Great
// replacement for the default outline:focus on primary CTAs.

export interface AuraProps {
  children: ReactNode
  /** Color of the aura halo. Accepts any CSS color. @default brand primary */
  color?: string
  /**
   * Border radius applied to the wrapper and the aura overlay so the
   * halo follows the child's shape. Pass the same radius as the child.
   * @default 'var(--radius-md)'
   */
  borderRadius?: string | number
  /**
   * Whether the aura is visible. Consumers toggle this via state
   * (hover/focus/active) depending on the use case.
   * @default true
   */
  active?: boolean
  style?: CSSProperties
  className?: string
}

/**
 * A pulsing halo ring that follows the shape of its child. Pass the same
 * `borderRadius` as the child to keep the ring aligned.
 *
 * @example
 *   <Aura borderRadius="var(--radius-lg)">
 *     <Button>Action</Button>
 *   </Aura>
 */
export function Aura({
  children,
  color = 'rgba(163, 91, 255, 0.5)',
  borderRadius = 'var(--radius-md)',
  active = true,
  style,
  className
}: AuraProps) {
  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderRadius,
    ...style
  }

  const auraStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    ['--forge-aura-color' as string]: color,
    opacity: active ? 1 : 0,
    transition: 'opacity 220ms ease-out'
  }

  return (
    <div className={className} style={wrapperStyle}>
      <div
        className="forge-motion-aura"
        style={auraStyle}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
