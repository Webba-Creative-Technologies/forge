import { ReactNode } from 'react'

// ============================================
// DIVIDER
// ============================================
interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  color?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  label?: ReactNode
  labelPosition?: 'left' | 'center' | 'right'
}

const spacingMap = {
  none: 0,
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem'
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'var(--border-color)',
  spacing = 'md',
  label,
  labelPosition = 'center'
}: DividerProps) {
  const margin = spacingMap[spacing]

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          width: 1,
          alignSelf: 'stretch',
          backgroundColor: 'var(--border-subtle)',
          margin: `0 ${margin}`
        }}
      />
    )
  }

  // Horizontal with label
  if (label) {
    return (
      <div
        role="separator"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: `${margin} 0`
        }}
      >
        {labelPosition !== 'left' && (
          <div style={{
            flex: 1,
            height: 1,
            backgroundColor: variant === 'solid' ? color : 'transparent',
            borderTop: variant !== 'solid' ? `1px ${variant} ${color}` : undefined
          }} />
        )}
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {label}
        </span>
        {labelPosition !== 'right' && (
          <div style={{
            flex: 1,
            height: 1,
            backgroundColor: variant === 'solid' ? color : 'transparent',
            borderTop: variant !== 'solid' ? `1px ${variant} ${color}` : undefined
          }} />
        )}
      </div>
    )
  }

  // Simple horizontal
  return (
    <hr
      role="separator"
      style={{
        border: 'none',
        height: variant === 'solid' ? 1 : 0,
        backgroundColor: variant === 'solid' ? color : 'transparent',
        borderTop: variant !== 'solid' ? `1px ${variant} ${color}` : 'none',
        margin: `${margin} 0`,
        opacity: 1
      }}
    />
  )
}

// ============================================
// VERTICAL DIVIDER (shorthand)
// ============================================
export function VerticalDivider({ spacing = 'md' }: { spacing?: 'none' | 'sm' | 'md' | 'lg' }) {
  return <Divider orientation="vertical" spacing={spacing} />
}

// ============================================
// SECTION DIVIDER (with more prominence)
// ============================================
interface SectionDividerProps {
  label?: string
  icon?: ReactNode
}

export function SectionDivider({ label, icon }: SectionDividerProps) {
  return (
    <div
      role="separator"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '2rem 0'
      }}
    >
      <div style={{
        flex: 1,
        height: 1,
        background: 'linear-gradient(to right, var(--border-subtle), transparent)'
      }} />
      {(label || icon) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          {icon && (
            <span style={{ display: 'flex', color: 'var(--text-muted)' }}>
              {icon}
            </span>
          )}
          {label && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {label}
            </span>
          )}
        </div>
      )}
      <div style={{
        flex: 1,
        height: 1,
        background: 'linear-gradient(to left, var(--border-subtle), transparent)'
      }} />
    </div>
  )
}
