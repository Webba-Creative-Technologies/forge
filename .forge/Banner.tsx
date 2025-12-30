import { ReactNode, useState } from 'react'
import {
  Dismiss20Regular,
  Info20Regular,
  Warning20Regular,
  CheckmarkCircle20Regular,
  ErrorCircle20Regular,
  Megaphone20Regular
} from '@fluentui/react-icons'
import { Z_INDEX } from '../constants'

// ============================================
// BANNER
// ============================================
interface BannerProps {
  children: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error' | 'brand' | 'neutral'
  icon?: ReactNode
  title?: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
  position?: 'top' | 'bottom' | 'inline'
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

export function Banner({
  children,
  variant = 'info',
  icon,
  title,
  action,
  dismissible = false,
  onDismiss,
  position = 'inline',
  size = 'md',
  className,
  style
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [actionHovered, setActionHovered] = useState(false)
  const [dismissHovered, setDismissHovered] = useState(false)

  if (dismissed) return null

  const variantConfig = {
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      color: 'var(--info)',
      icon: icon || <Info20Regular />
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      color: 'var(--success)',
      icon: icon || <CheckmarkCircle20Regular />
    },
    warning: {
      bg: 'rgba(249, 115, 22, 0.1)',
      color: 'var(--warning)',
      icon: icon || <Warning20Regular />
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--error)',
      icon: icon || <ErrorCircle20Regular />
    },
    brand: {
      bg: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
      color: 'var(--brand-primary)',
      icon: icon || <Megaphone20Regular />
    },
    neutral: {
      bg: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
      icon: icon || <Info20Regular />
    }
  }

  const config = variantConfig[variant]

  const sizeStyles = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.8125rem', iconSize: 16 },
    md: { padding: '0.75rem 1rem', fontSize: '0.875rem', iconSize: 20 }
  }

  const sizeConfig = sizeStyles[size]

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const positionStyles: React.CSSProperties = position === 'inline'
    ? { borderRadius: 'var(--radius-md)' }
    : {
        position: 'fixed',
        left: 0,
        right: 0,
        [position]: 0,
        borderRadius: 0,
        zIndex: Z_INDEX.sticky
      }

  return (
    <div
      role="alert"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: sizeConfig.padding,
        backgroundColor: config.bg,
        ...positionStyles,
        animation: position !== 'inline' ? 'slideInDown 0.3s ease-out' : undefined,
        ...style
      }}
    >
      {/* Icon */}
      <span style={{
        display: 'flex',
        color: config.color,
        fontSize: sizeConfig.iconSize,
        flexShrink: 0
      }}>
        {config.icon}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontWeight: 600,
            fontSize: sizeConfig.fontSize,
            color: 'var(--text-primary)',
            marginBottom: children ? '0.125rem' : 0
          }}>
            {title}
          </div>
        )}
        <div style={{
          fontSize: sizeConfig.fontSize,
          color: 'var(--text-secondary)',
          lineHeight: 1.4
        }}>
          {children}
        </div>
      </div>

      {/* Action */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          onMouseEnter={() => setActionHovered(true)}
          onMouseLeave={() => setActionHovered(false)}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: config.color,
            backgroundColor: actionHovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transform: actionHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.15s ease'
          }}
        >
          {action.label}
        </button>
      )}

      {/* Dismiss */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          onMouseEnter={() => setDismissHovered(true)}
          onMouseLeave={() => setDismissHovered(false)}
          aria-label="Close"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            color: 'var(--text-muted)',
            backgroundColor: dismissHovered ? 'var(--bg-tertiary)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            transform: dismissHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.15s ease'
          }}
          className="interactive-icon"
        >
          <Dismiss20Regular style={{ fontSize: 18 }} />
        </button>
      )}
    </div>
  )
}

// ============================================
// ANNOUNCEMENT BANNER (Full-width promo style)
// ============================================
interface AnnouncementBannerProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  dismissible?: boolean
  onDismiss?: () => void
  gradient?: boolean
  className?: string
  style?: React.CSSProperties
}

export function AnnouncementBanner({
  children,
  href,
  onClick,
  dismissible = true,
  onDismiss,
  gradient = true,
  className,
  style
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [dismissHovered, setDismissHovered] = useState(false)

  if (dismissed) return null

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDismissed(true)
    onDismiss?.()
  }

  const Component = href ? 'a' : onClick ? 'button' : 'div'
  const isInteractive = href || onClick

  return (
    <Component
      href={href}
      onClick={onClick}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.625rem 1rem',
        background: gradient
          ? 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)'
          : 'var(--brand-primary)',
        color: 'white',
        fontSize: '0.8125rem',
        fontWeight: 500,
        textDecoration: 'none',
        textAlign: 'center',
        border: 'none',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'opacity 0.15s ease',
        position: 'relative',
        width: '100%',
        ...(Component === 'button' ? { width: '100%' } : {}),
        ...style
      }}
      onMouseEnter={(e) => {
        if (isInteractive) {
          (e.currentTarget as HTMLElement).style.opacity = '0.9'
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          (e.currentTarget as HTMLElement).style.opacity = '1'
        }
      }}
    >
      <span>{children}</span>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          onMouseEnter={() => setDismissHovered(true)}
          onMouseLeave={() => setDismissHovered(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: dismissHovered ? 'translateY(-50%) scale(1.05)' : 'translateY(-50%) scale(1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            color: dismissHovered ? 'white' : 'rgba(255,255,255,0.8)',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Dismiss20Regular style={{ fontSize: 16 }} />
        </button>
      )}
    </Component>
  )
}
