import { useState, useEffect, ReactNode } from 'react'
import {
  Add24Regular,
  Dismiss24Regular,
  ArrowUp24Regular
} from '@fluentui/react-icons'
import { Tooltip } from './Tooltip'
import { Z_INDEX, SHADOWS } from '../constants'

// ============================================
// FLOAT BUTTON (FAB)
// ============================================
interface FloatButtonProps {
  icon?: ReactNode
  onClick?: () => void
  tooltip?: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'gradient'
  badge?: number | string
  disabled?: boolean
  inline?: boolean
  className?: string
  style?: React.CSSProperties
}

export function FloatButton({
  icon = <Add24Regular />,
  onClick,
  tooltip,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  badge,
  disabled,
  inline = true,
  className,
  style
}: FloatButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const sizeStyles = {
    sm: { width: 40, height: 40, iconScale: 0.85 },
    md: { width: 56, height: 56, iconScale: 1 },
    lg: { width: 72, height: 72, iconScale: 1.4 }
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'bottom-center': { bottom: 24, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 }
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--brand-primary)',
      color: 'white'
    },
    secondary: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)'
    },
    gradient: {
      background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
      color: 'white'
    }
  }

  const s = sizeStyles[size]
  const pos = positionStyles[position]
  const v = variantStyles[variant]

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: inline ? 'relative' : 'fixed',
        ...(inline ? {} : pos),
        width: s.width,
        height: s.height,
        borderRadius: 'var(--radius-full)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: pressed && !disabled
          ? '0 2px 8px rgba(0, 0, 0, 0.2)'
          : hovered && !disabled
          ? '0 0 0 4px rgba(163, 91, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.25)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed && !disabled ? 'scale(0.95)' : hovered && !disabled ? 'scale(1.1)' : 'scale(1)',
        zIndex: inline ? 'auto' : 2000,
        ...v,
        ...style
      }}
    >
      <span style={{ display: 'flex', transform: `scale(${s.iconScale})` }}>{icon}</span>
      {badge !== undefined && (
        <span style={{
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6px'
        }}>
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )

  if (tooltip) {
    return <Tooltip content={tooltip} position="left">{button}</Tooltip>
  }

  return button
}

// ============================================
// FLOAT BUTTON GROUP (expandable FAB)
// ============================================
interface FloatButtonGroupProps {
  icon?: ReactNode
  closeIcon?: ReactNode
  actions: Array<{
    icon: ReactNode
    label: string
    onClick: () => void
  }>
  position?: 'bottom-right' | 'bottom-left'
  variant?: 'primary' | 'secondary' | 'gradient'
  trigger?: 'click' | 'hover'
  inline?: boolean
  className?: string
  style?: React.CSSProperties
}

export function FloatButtonGroup({
  icon = <Add24Regular />,
  closeIcon = <Dismiss24Regular />,
  actions,
  position = 'bottom-right',
  variant = 'primary',
  trigger = 'click',
  inline = true,
  className,
  style
}: FloatButtonGroupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredAction, setHoveredAction] = useState<number | null>(null)
  const [pressedAction, setPressedAction] = useState<number | null>(null)

  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: 24, right: 24, alignItems: 'flex-end' },
    'bottom-left': { bottom: 24, left: 24, alignItems: 'flex-start' }
  }

  const pos = positionStyles[position]

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsOpen(false)
  }

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: inline ? 'relative' : 'fixed',
        ...(inline ? { alignItems: position === 'bottom-right' ? 'flex-end' : 'flex-start' } : pos),
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 12,
        zIndex: inline ? 'auto' : 2000,
        ...style
      }}
    >
      {/* Main FAB */}
      <FloatButton
        icon={isOpen ? closeIcon : icon}
        variant={variant}
        onClick={() => trigger === 'click' && setIsOpen(!isOpen)}
        style={{ position: 'relative', bottom: 'auto', right: 'auto', left: 'auto', top: 'auto' }}
      />

      {/* Action buttons */}
      {actions.map((action, index) => {
        const isHovered = hoveredAction === index
        const isPressed = pressedAction === index

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexDirection: position === 'bottom-right' ? 'row-reverse' : 'row',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`,
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
            <button
              onClick={() => {
                action.onClick()
                setIsOpen(false)
              }}
              onMouseEnter={() => setHoveredAction(index)}
              onMouseLeave={() => {
                setHoveredAction(null)
                setPressedAction(null)
              }}
              onMouseDown={() => setPressedAction(index)}
              onMouseUp={() => setPressedAction(null)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isPressed
                  ? '0 2px 6px rgba(0, 0, 0, 0.15)'
                  : isHovered
                  ? '0 0 0 4px rgba(163, 91, 255, 0.2), 0 6px 16px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.15)',
                transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {action.icon}
            </button>
            <span style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: SHADOWS.soft.md
            }}>
              {action.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// BACK TO TOP
// ============================================
interface BackToTopProps {
  threshold?: number
  smooth?: boolean
  position?: 'bottom-right' | 'bottom-left'
  className?: string
  style?: React.CSSProperties
}

export function BackToTop({
  threshold = 400,
  smooth = true,
  position = 'bottom-right',
  className,
  style
}: BackToTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold)
    }

    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  const positionStyles: React.CSSProperties = position === 'bottom-right'
    ? { bottom: 24, right: 24 }
    : { bottom: 24, left: 24 }

  return (
    <button
      className={className}
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        ...positionStyles,
        zIndex: Z_INDEX.floatButton,
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'all 0.2s ease',
        boxShadow: SHADOWS.elevation.fab,
        ...style
      }}
    >
      <ArrowUp24Regular />
    </button>
  )
}
