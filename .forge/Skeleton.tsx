
// ============================================
// SKELETON (Loading placeholder)
// ============================================
interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'text',
  animation = 'pulse'
}: SkeletonProps) {
  const getBorderRadius = () => {
    switch (variant) {
      case 'circular': return '50%'
      case 'rectangular': return 0
      case 'rounded': return 'var(--radius-md)'
      case 'text': return 'var(--radius-xs)'
    }
  }

  const getHeight = () => {
    if (variant === 'circular') return width
    return height
  }

  return (
    <div
      className={animation !== 'none' ? `skeleton-${animation}` : undefined}
      style={{
        width,
        height: getHeight(),
        borderRadius: getBorderRadius(),
        backgroundColor: 'var(--bg-tertiary)',
        animation: animation === 'pulse'
          ? 'skeletonPulse 1.5s ease-in-out infinite'
          : animation === 'wave'
            ? 'skeletonWave 1.5s ease-in-out infinite'
            : undefined
      }}
    />
  )
}

// ============================================
// SKELETON TEXT (Multiple lines)
// ============================================
interface SkeletonTextProps {
  lines?: number
  spacing?: number
}

export function SkeletonText({ lines = 3, spacing = 8 }: SkeletonTextProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

// ============================================
// SKELETON CARD
// ============================================
export function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <div style={{ flex: 1 }}>
          <Skeleton height={14} width="50%" />
          <div style={{ height: 6 }} />
          <Skeleton height={12} width="30%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

// ============================================
// SKELETON TABLE ROW
// ============================================
interface SkeletonTableProps {
  rows?: number
  columns?: number
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-tertiary)'
      }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={12} width="70%" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} height={14} width={colIdx === 0 ? '80%' : '60%'} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ============================================
// SKELETON AVATAR GROUP
// ============================================
interface SkeletonAvatarGroupProps {
  count?: number
  size?: number
}

export function SkeletonAvatarGroup({ count = 3, size = 32 }: SkeletonAvatarGroupProps) {
  return (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <Skeleton variant="circular" width={size} height={size} />
        </div>
      ))}
    </div>
  )
}

// ============================================
// SKELETON STAT CARD
// ============================================
export function SkeletonStatCard() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <Skeleton variant="rounded" width={48} height={48} />
      <div style={{ flex: 1 }}>
        <Skeleton height={24} width="60%" />
        <div style={{ height: 6 }} />
        <Skeleton height={12} width="40%" />
      </div>
    </div>
  )
}
