import { CSSProperties, ReactNode, useState } from 'react'
import { Dismiss12Regular } from '@fluentui/react-icons'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  onRemove?: () => void
  onClick?: () => void
  style?: CSSProperties
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  default: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)'
  },
  primary: {
    backgroundColor: 'color-mix(in srgb, var(--brand-primary) 15%, transparent)',
    color: 'var(--brand-primary)'
  },
  success: {
    backgroundColor: 'color-mix(in srgb, var(--success) 20%, transparent)',
    color: 'var(--success)'
  },
  warning: {
    backgroundColor: 'color-mix(in srgb, var(--warning) 20%, transparent)',
    color: 'var(--warning)'
  },
  error: {
    backgroundColor: 'color-mix(in srgb, var(--error) 20%, transparent)',
    color: 'var(--error)'
  },
  info: {
    backgroundColor: 'color-mix(in srgb, var(--info) 20%, transparent)',
    color: 'var(--info)'
  }
}

const sizeStyles: Record<BadgeSize, { paddingBlock: string; paddingInline: string; fontSize: string }> = {
  sm: {
    paddingBlock: '0.125rem',
    paddingInline: '0.375rem',
    fontSize: '0.625rem'
  },
  md: {
    paddingBlock: '0.25rem',
    paddingInline: '0.5rem',
    fontSize: '0.75rem'
  },
  lg: {
    paddingBlock: '0.375rem',
    paddingInline: '0.75rem',
    fontSize: '0.8125rem'
  }
}

const removeButtonStyles: Record<BadgeSize, { size: number; btnSize: number }> = {
  sm: { size: 10, btnSize: 14 },
  md: { size: 12, btnSize: 18 },
  lg: { size: 14, btnSize: 22 }
}

const btnHoverBg: Record<BadgeVariant, string> = {
  default: 'rgba(255, 255, 255, 0.15)',
  primary: 'color-mix(in srgb, var(--brand-primary) 30%, transparent)',
  success: 'color-mix(in srgb, var(--success) 30%, transparent)',
  warning: 'color-mix(in srgb, var(--warning) 30%, transparent)',
  error: 'color-mix(in srgb, var(--error) 30%, transparent)',
  info: 'color-mix(in srgb, var(--info) 30%, transparent)'
}

export function Badge({ children, variant = 'default', size = 'md', dot, onRemove, onClick, style }: BadgeProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [removeBtnHovered, setRemoveBtnHovered] = useState(false)
  const removeStyle = removeButtonStyles[size]
  const isInteractive = onClick || onRemove

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => isInteractive && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={onRemove ? 'animate-scaleIn' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        borderRadius: 'var(--radius-full)',
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.95)' : hovered && isInteractive ? 'translateY(-1px)' : 'scale(1)',
        boxShadow: hovered && isInteractive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
        filter: hovered && isInteractive ? 'brightness(1.1)' : 'none',
        ...variantStyles[variant],
        fontSize: sizeStyles[size].fontSize,
        paddingBlock: sizeStyles[size].paddingBlock,
        paddingLeft: sizeStyles[size].paddingInline,
        paddingRight: onRemove ? '0.25rem' : sizeStyles[size].paddingInline,
        ...style
      }}>
      {dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'currentColor'
        }} />
      )}
      {children}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          onMouseEnter={() => setRemoveBtnHovered(true)}
          onMouseLeave={() => setRemoveBtnHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: removeStyle.btnSize,
            height: removeStyle.btnSize,
            background: removeBtnHovered ? btnHoverBg[variant] : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            color: 'currentColor',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '0.125rem',
            opacity: removeBtnHovered ? 1 : 0.7,
            transition: 'all 0.15s ease',
            transform: removeBtnHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <Dismiss12Regular style={{ fontSize: removeStyle.size }} />
        </button>
      )}
    </span>
  )
}

/** @deprecated Use Badge with onRemove prop instead */
export const Tag = Badge

// Status Badge (with semantic colors)
type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'error' | 'draft'

interface StatusBadgeProps {
  status: StatusType
  label?: string
}

const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'default', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  completed: { variant: 'success', label: 'Completed' },
  error: { variant: 'error', label: 'Error' },
  draft: { variant: 'default', label: 'Draft' }
}

export function StatusBadge({ status, label, onClick }: StatusBadgeProps & { onClick?: () => void }) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} dot onClick={onClick}>
      {label || config.label}
    </Badge>
  )
}

// Priority Badge
type PriorityType = 'low' | 'medium' | 'high' | 'urgent'

interface PriorityBadgeProps {
  priority: PriorityType
}

const priorityConfig: Record<PriorityType, { variant: BadgeVariant; label: string }> = {
  low: { variant: 'default', label: 'Low' },
  medium: { variant: 'info', label: 'Medium' },
  high: { variant: 'warning', label: 'High' },
  urgent: { variant: 'error', label: 'Urgent' }
}

export function PriorityBadge({ priority, onClick }: PriorityBadgeProps & { onClick?: () => void }) {
  const config = priorityConfig[priority]
  return <Badge variant={config.variant} onClick={onClick}>{config.label}</Badge>
}

// Count Badge (for notifications)
interface CountBadgeProps {
  count: number
  max?: number
}

export function CountBadge({ count, max = 99 }: CountBadgeProps) {
  if (count <= 0) return null

  return (
    <span style={{
      minWidth: 18,
      height: 18,
      padding: '0 0.375rem',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--brand-primary)',
      color: 'white',
      fontSize: '0.6875rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {count > max ? `${max}+` : count}
    </span>
  )
}
