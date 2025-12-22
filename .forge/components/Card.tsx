import React, { CSSProperties, ReactNode, useState } from 'react'
import { ArrowRight16Regular, ArrowUp16Regular, ArrowDown16Regular } from '@fluentui/react-icons'
import { Button } from './Button'
import { Text } from './Typography'

// ============================================
// CARD (Base container)
// ============================================
interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  variant?: 'default' | 'subtle' | 'outlined'
  onClick?: () => void
  hoverable?: boolean
  className?: string
  style?: CSSProperties
}

export function Card({
  children,
  title,
  subtitle,
  action,
  padding = 'md',
  variant = 'default',
  onClick,
  hoverable,
  className,
  style
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const paddingStyles = {
    none: 0,
    sm: '0.875rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem'
  }

  const isInteractive = onClick || hoverable

  // Background based on variant
  const getBackground = () => {
    if (isInteractive && isHovered) {
      return variant === 'subtle' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)'
    }
    switch (variant) {
      case 'subtle':
        return 'var(--bg-tertiary)'
      case 'outlined':
        return 'transparent'
      default:
        return 'var(--bg-secondary)'
    }
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={className || ''}
      style={{
        backgroundColor: getBackground(),
        borderRadius: 'var(--radius-lg)',
        padding: paddingStyles[padding],
        border: variant === 'outlined' ? '1px solid var(--border-color)' : undefined,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isInteractive && isPressed ? 'scale(0.99)' : undefined,
        ...style
      }}
    >
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: children ? '1rem' : 0,
          gap: '1rem'
        }}>
          <div>
            {title && (
              <Text size="sm" weight="semibold">{title}</Text>
            )}
            {subtitle && (
              <Text size="xs" color="muted" style={{ marginTop: 4 }}>{subtitle}</Text>
            )}
          </div>
          {action && (
            <Button
              variant="ghost"
              size="xs"
              iconRight={<ArrowRight16Regular />}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick()
              }}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ============================================
// IMAGE CARD (Card with image header)
// ============================================
interface ImageCardProps {
  image: string
  imageAlt?: string
  imageHeight?: number
  title: string
  subtitle?: string
  description?: string
  badge?: ReactNode
  actions?: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export function ImageCard({
  image,
  imageAlt,
  imageHeight = 160,
  title,
  subtitle,
  description,
  badge,
  actions,
  onClick,
  className,
  style
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={className || ''}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.99)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
        ...style
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: imageHeight, overflow: 'hidden' }}>
        <img
          src={image}
          alt={imageAlt || title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        {badge && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            {badge}
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <Text size="sm" weight="semibold" style={{ marginBottom: 2 }}>{title}</Text>
        {subtitle && (
          <Text size="xs" color="muted">{subtitle}</Text>
        )}
        {description && (
          <Text size="xs" color="secondary" style={{ marginTop: 8 }}>{description}</Text>
        )}
        {actions && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// HORIZONTAL CARD (Image on side)
// ============================================
interface HorizontalCardProps {
  image?: string
  imageAlt?: string
  imageWidth?: number
  title: string
  subtitle?: string
  description?: string
  meta?: ReactNode
  actions?: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export function HorizontalCard({
  image,
  imageAlt,
  imageWidth = 120,
  title,
  subtitle,
  description,
  meta,
  actions,
  onClick,
  className,
  style
}: HorizontalCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={className || ''}
      style={{
        display: 'flex',
        gap: '1rem',
        backgroundColor: isHovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.99)' : undefined,
        ...style
      }}
    >
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={imageAlt || title}
          style={{
            width: imageWidth,
            height: '100%',
            minHeight: 100,
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
      )}
      {/* Content */}
      <div style={{ flex: 1, padding: '1rem', paddingLeft: image ? 0 : '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" weight="semibold">{title}</Text>
            {subtitle && (
              <Text size="xs" color="muted" style={{ marginTop: 2 }}>{subtitle}</Text>
            )}
          </div>
          {meta && <div style={{ flexShrink: 0 }}>{meta}</div>}
        </div>
        {description && (
          <Text size="xs" color="secondary" style={{ marginTop: 6 }}>{description}</Text>
        )}
        {actions && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// ACTION CARD (Card with footer actions)
// ============================================
interface ActionCardProps {
  title: string
  subtitle?: string
  children?: ReactNode
  icon?: ReactNode
  iconColor?: string
  actions: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export function ActionCard({
  title,
  subtitle,
  children,
  icon,
  iconColor = 'var(--brand-primary)',
  actions,
  onClick,
  className,
  style
}: ActionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className || ''}
      style={{
        backgroundColor: isHovered && onClick ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {/* Header */}
      <div style={{ padding: '1.25rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          {icon && (
            <div style={{ color: iconColor, fontSize: 20, lineHeight: 1 }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <Text size="sm" weight="semibold">{title}</Text>
            {subtitle && (
              <Text size="xs" color="muted" style={{ marginTop: 2 }}>{subtitle}</Text>
            )}
          </div>
        </div>
        {children && (
          <div style={{ marginTop: 12 }}>
            {children}
          </div>
        )}
      </div>
      {/* Footer */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {actions}
        </div>
      </div>
    </div>
  )
}

// ============================================
// STAT CARD (Big dashboard stats)
// ============================================
interface StatCardProps {
  icon?: ReactNode
  label: string
  value: string | number
  color?: string
  subtitle?: string
  change?: number
  changeLabel?: string
  onClick?: () => void
}

export function StatCard({
  icon,
  label,
  value,
  color = 'var(--brand-primary)',
  subtitle,
  change,
  changeLabel,
  onClick
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        backgroundColor: onClick && isHovered
          ? 'var(--bg-tertiary)'
          : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: onClick && isPressed ? 'scale(0.99)' : undefined
      }}
    >
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 140
      }}>
        {/* Top row: Label + Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem'
        }}>
          {/* Left: Label */}
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>
            {label}
          </div>
          {/* Right: Icon */}
          {icon && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontSize: 24,
              flexShrink: 0
            }}>
              {icon}
            </div>
          )}
        </div>

        {/* Change indicator */}
        {change !== undefined && change !== 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: change > 0 ? 'var(--success)' : 'var(--error)',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.125rem',
              padding: '0.125rem 0.375rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: change > 0
                ? 'color-mix(in srgb, var(--success) 15%, transparent)'
                : 'color-mix(in srgb, var(--error) 15%, transparent)'
            }}>
              {change > 0 ? <ArrowUp16Regular style={{ fontSize: 14 }} /> : <ArrowDown16Regular style={{ fontSize: 14 }} />}
              {Math.abs(Math.round(change))}%
            </span>
            {changeLabel && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                {changeLabel}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom: Large value */}
        <div style={{
          fontSize: '1.625rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.1
        }}>
          {value}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem'
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MINI STAT (Compact version for grids)
// ============================================
interface MiniStatProps {
  icon: ReactNode
  value: string | number
  label: string
  color: string
  onClick?: () => void
}

export function MiniStat({ icon, value, label, color, onClick }: MiniStatProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        backgroundColor: onClick && isHovered
          ? 'var(--bg-tertiary)'
          : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: onClick && isPressed ? 'scale(0.98)' : undefined
      }}
    >
      <div style={{
        color: color,
        fontSize: 20,
        lineHeight: 1,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// ============================================
// STAT ROW (For lists)
// ============================================
interface StatRowProps {
  label: string
  value: string | number
  color?: string
}

export function StatRow({ label, value, color }: StatRowProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{
        fontSize: '0.875rem',
        fontWeight: 500,
        color: color || 'var(--text-primary)'
      }}>
        {value}
      </span>
    </div>
  )
}

// ============================================
// PROGRESS CARD
// ============================================
interface ProgressCardProps {
  title: string
  value: number
  max: number
  unit?: string
  color?: string
}

export function ProgressCard({
  title,
  value,
  max,
  unit = '',
  color = 'var(--brand-primary)'
}: ProgressCardProps) {
  const percentage = Math.min(100, (value / max) * 100)
  const progressColor = percentage >= 100 ? '#10b981' : percentage >= 75 ? '#f59e0b' : color

  return (
    <Card>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{title}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {value}{unit} / {max}{unit}
        </span>
      </div>
      <div style={{
        height: 6,
        background: 'var(--bg-tertiary)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div
          className="progress-bar-animated"
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: progressColor,
            borderRadius: 3
          }}
        />
      </div>
    </Card>
  )
}

// ============================================
// INFO CARD (Subtle card for info display)
// ============================================
interface InfoCardProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

export function InfoCard({ children, title, icon, padding = 'md' }: InfoCardProps) {
  const paddingStyles = {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem'
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: paddingStyles[padding]
    }}>
      {(title || icon) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          {icon && (
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {icon}
            </div>
          )}
          {title && (
            <div style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}>
              {title}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ============================================
// SECTION (Card with section-style header)
// ============================================
interface SectionProps {
  title: string
  action?: { label: string; onClick: () => void }
  children: ReactNode
  noPadding?: boolean
}

export function Section({ title, action, children, noPadding, delay = 0 }: SectionProps & { delay?: number }) {
  return (
    <div
      className="animate-slideInUp"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: noPadding ? 0 : '1.25rem',
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: noPadding ? '1.25rem 1.25rem 0' : 0
      }}>
        <h3 style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          margin: 0,
          color: 'var(--text-secondary)'
        }}>
          {title}
        </h3>
        {action && (
          <Button
            variant="ghost"
            size="sm"
            iconRight={<ArrowRight16Regular />}
            onClick={action.onClick}
            style={{ fontWeight: 400 }}
          >
            {action.label}
          </Button>
        )}
      </div>
      <div style={{ padding: noPadding ? '0 1.25rem 1.25rem' : 0 }}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// PAGE HEADER
// ============================================
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.5rem',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          marginBottom: subtitle ? '0.25rem' : 0
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{
        color: 'var(--text-muted)',
        marginBottom: '1rem',
        opacity: 0.5
      }}>
        {React.cloneElement(icon as React.ReactElement, { style: { fontSize: 48 } })}
      </div>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 500,
        marginBottom: description ? '0.5rem' : 0,
        color: 'var(--text-secondary)'
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          marginBottom: action ? '1.5rem' : 0
        }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
          style={{
            padding: '0.6rem 1.25rem',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}


// ============================================
// PROGRESS BAR (standalone)
// ============================================
interface ProgressBarProps {
  value: number // 0-100
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  height?: number // custom height (overrides size)
  showLabel?: boolean
  animated?: boolean
  delay?: number
  label?: string
}

const progressSizes = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 16
}

export function ProgressBar({
  value,
  color = 'var(--brand-primary)',
  size = 'md',
  height,
  showLabel,
  animated = true,
  delay = 0,
  label
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const barHeight = height ?? progressSizes[size]
  const isThick = barHeight >= 12

  return (
    <div>
      {/* Label row for thick progress bars */}
      {isThick && label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            {label}
          </span>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: color,
            fontVariantNumeric: 'tabular-nums'
          }}>
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          flex: 1,
          height: barHeight,
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: barHeight,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div
            className={animated ? 'progress-bar-animated' : undefined}
            style={{
              height: '100%',
              width: `${clampedValue}%`,
              backgroundColor: color,
              borderRadius: barHeight,
              position: 'relative',
              ...(animated ? { animationDelay: `${delay}ms` } : { transition: 'width 0.3s ease' })
            }}
          >
            {/* Shine effect for thick bars */}
            {isThick && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
                borderRadius: `${barHeight}px ${barHeight}px 0 0`
              }} />
            )}
          </div>
        </div>
        {showLabel && !isThick && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 35, fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    </div>
  )
}
