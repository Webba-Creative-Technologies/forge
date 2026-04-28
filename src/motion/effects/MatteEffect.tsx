import { type CSSProperties, type ReactNode, useId } from 'react'

export interface MatteEffectProps {
  children: ReactNode
  /** Grain intensity 0-1. @default 0.4 */
  intensity?: number
  /** Border radius. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

export function MatteEffect({
  children,
  intensity = 0.4,
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: MatteEffectProps) {
  const id = useId()
  const filterId = `forge-matte-${id.replace(/:/g, '')}`

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        borderRadius,
        overflow: 'hidden',
        ...style
      }}
    >
      {/* SVG filter definition for noise texture */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Content */}
      {children}

      {/* Matte overlay - subtle grain texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          opacity: intensity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle inner shadow for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06), inset 0 -1px 1px rgba(255,255,255,0.04)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
