import type { CSSProperties, ReactNode } from 'react'

// ============================================
// STICKER
// ============================================
// Makes a child look like a physical sticker with a curled/peeled
// corner that folds back showing the underside.

export interface StickerProps {
  children: ReactNode
  /** Which corner is peeled. @default 'bottom-right' */
  peeledCorner?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Size of the corner curl in px. @default 28 */
  peelSize?: number
  /** Slight rotation for organic feel. @default 2 */
  rotation?: number
  /** Color of the sticker underside. @default '#e2e0dc' */
  undersideColor?: string
  /** Border radius. @default 'var(--radius-lg)' */
  borderRadius?: string | number
  style?: CSSProperties
  className?: string
}

/**
 * Physical sticker with a curled corner.
 *
 * @example
 *   <Sticker peeledCorner="bottom-right">
 *     <Card>Content</Card>
 *   </Sticker>
 */
export function Sticker({
  children,
  peeledCorner = 'bottom-right',
  peelSize = 28,
  rotation = 2,
  undersideColor = '#e2e0dc',
  borderRadius = 'var(--radius-lg)',
  style,
  className
}: StickerProps) {
  const s = peelSize

  // The curl: a rotated square that simulates the folded-back corner
  // Position and rotation depend on which corner is peeled
  const curlConfig: Record<string, CSSProperties> = {
    'bottom-right': {
      bottom: 0, right: 0,
      transformOrigin: 'bottom right',
      transform: 'rotate(0deg)',
      borderRadius: `${s * 0.6}px 0 0 0`,
      boxShadow: `-2px -2px 4px rgba(0,0,0,0.15)`
    },
    'bottom-left': {
      bottom: 0, left: 0,
      transformOrigin: 'bottom left',
      transform: 'rotate(0deg)',
      borderRadius: `0 ${s * 0.6}px 0 0`,
      boxShadow: `2px -2px 4px rgba(0,0,0,0.15)`
    },
    'top-right': {
      top: 0, right: 0,
      transformOrigin: 'top right',
      transform: 'rotate(0deg)',
      borderRadius: `0 0 0 ${s * 0.6}px`,
      boxShadow: `-2px 2px 4px rgba(0,0,0,0.15)`
    },
    'top-left': {
      top: 0, left: 0,
      transformOrigin: 'top left',
      transform: 'rotate(0deg)',
      borderRadius: `0 0 ${s * 0.6}px 0`,
      boxShadow: `2px 2px 4px rgba(0,0,0,0.15)`
    }
  }

  // Cut the corner of the content to reveal the curl behind
  const cutConfig: Record<string, string> = {
    'bottom-right': `polygon(0 0, 100% 0, 100% calc(100% - ${s}px), calc(100% - ${s}px) 100%, 0 100%)`,
    'bottom-left': `polygon(0 0, 100% 0, 100% 100%, ${s}px 100%, 0 calc(100% - ${s}px))`,
    'top-right': `polygon(0 0, calc(100% - ${s}px) 0, 100% ${s}px, 100% 100%, 0 100%)`,
    'top-left': `polygon(${s}px 0, 100% 0, 100% 100%, 0 100%, 0 ${s}px)`
  }

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    transform: `rotate(${rotation}deg)`,
    borderRadius,
    boxShadow: '0 3px 10px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)',
    ...style
  }

  // The folded-back corner piece
  const curlStyle: CSSProperties = {
    position: 'absolute',
    width: s,
    height: s,
    background: `linear-gradient(135deg, ${undersideColor} 0%, ${undersideColor} 50%, rgba(0,0,0,0.05) 100%)`,
    zIndex: 2,
    pointerEvents: 'none',
    ...curlConfig[peeledCorner]
  }

  // Content with the corner cut away
  const contentStyle: CSSProperties = {
    clipPath: cutConfig[peeledCorner],
    borderRadius: 'inherit',
    overflow: 'hidden'
  }

  // Stuck edges: subtle inner shadow
  const edgesStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 2px rgba(0,0,0,0.06)',
    pointerEvents: 'none',
    zIndex: 3,
    clipPath: cutConfig[peeledCorner]
  }

  return (
    <div className={className} style={wrapperStyle}>
      <div style={curlStyle} aria-hidden="true" />
      <div style={contentStyle}>
        {children}
      </div>
      <div style={edgesStyle} aria-hidden="true" />
    </div>
  )
}
