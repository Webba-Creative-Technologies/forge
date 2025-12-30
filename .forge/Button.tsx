import { CSSProperties, ReactNode, ButtonHTMLAttributes, useState, forwardRef } from 'react'
import { COLORS } from '../constants'

// ============================================
// SIZE STANDARDS (consistent heights across app)
// ============================================
export const SIZES = {
  xs: { height: 28, fontSize: '0.75rem', padding: '0 0.625rem', gap: '0.25rem', borderRadius: 'var(--radius-sm)', iconSize: 14, spinner: 12 },
  sm: { height: 36, fontSize: '0.8125rem', padding: '0 0.875rem', gap: '0.375rem', borderRadius: 'var(--radius-sm)', iconSize: 16, spinner: 14 },
  md: { height: 42, fontSize: '0.875rem', padding: '0 1.25rem', gap: '0.5rem', borderRadius: 'var(--radius-md)', iconSize: 18, spinner: 16 },
  lg: { height: 50, fontSize: '1rem', padding: '0 1.75rem', gap: '0.625rem', borderRadius: 'var(--radius-lg)', iconSize: 20, spinner: 18 }
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

// ============================================
// BUTTON
// ============================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth,
  children,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const isDisabled = disabled || loading

  const s = SIZES[size]

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--brand-primary)',
      color: 'white',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'transparent'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--text-muted)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'transparent'
    },
    danger: {
      backgroundColor: 'transparent',
      color: COLORS.error,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: COLORS.error
    }
  }

  // Hover styles for each variant (works in all theme modes)
  const hoverStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      filter: 'brightness(1.1)'
    },
    secondary: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-color)'
    },
    ghost: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)'
    },
    danger: {
      backgroundColor: COLORS.error,
      color: 'white',
      borderColor: COLORS.error
    }
  }

  const currentStyle = hovered && !isDisabled
    ? { ...variantStyles[variant], ...hoverStyles[variant] }
    : variantStyles[variant]

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={className || ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        borderRadius: s.borderRadius,
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        width: fullWidth ? '100%' : 'fit-content',
        boxSizing: 'border-box',
        lineHeight: 1,
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        transform: pressed && !isDisabled ? 'scale(0.96)' : 'scale(1)',
        ...currentStyle,
        ...style
      }}
    >
      {loading ? (
        <span style={{
          width: s.spinner,
          height: s.spinner,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: 'var(--radius-full)',
          animation: 'spin 1s linear infinite'
        }} />
      ) : icon && (
        <span style={{ display: 'flex', fontSize: s.iconSize }}>{icon}</span>
      )}
      {children}
      {iconRight && (
        <span style={{ display: 'flex', fontSize: s.iconSize }}>{iconRight}</span>
      )}
    </button>
  )
}

// ============================================
// ICON BUTTON
// ============================================
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  size?: ButtonSize
  variant?: 'ghost' | 'subtle' | 'danger' | 'inverted'
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  disabled,
  className,
  style,
  ...props
}: IconButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const sizeStyles = {
    xs: { width: 28, height: 28, fontSize: 14, borderRadius: 'var(--radius-xs)' },
    sm: { width: 36, height: 36, fontSize: 16, borderRadius: 'var(--radius-sm)' },
    md: { width: 42, height: 42, fontSize: 18, borderRadius: 'var(--radius-sm)' },
    lg: { width: 50, height: 50, fontSize: 20, borderRadius: 'var(--radius-md)' }
  }

  const s = sizeStyles[size]

  // Variant styles
  const variantStyles: Record<string, { bg: string; bgHover: string; color: string }> = {
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--bg-tertiary)',
      color: 'var(--text-muted)'
    },
    subtle: {
      bg: 'var(--bg-tertiary)',
      bgHover: 'var(--bg-hover)',
      color: 'var(--text-muted)'
    },
    danger: {
      bg: 'transparent',
      bgHover: `${COLORS.error}1a`,
      color: COLORS.error
    },
    inverted: {
      bg: 'rgba(255, 255, 255, 0.1)',
      bgHover: 'rgba(255, 255, 255, 0.2)',
      color: 'white'
    }
  }

  const v = variantStyles[variant]

  return (
    <button
      {...props}
      disabled={disabled}
      className={className || ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: s.width,
        height: s.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? v.bg : (hovered ? v.bgHover : v.bg),
        border: 'none',
        borderRadius: s.borderRadius,
        color: v.color,
        fontSize: s.fontSize,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed && !disabled ? 'scale(0.9)' : 'scale(1)',
        ...style
      }}
    >
      {icon}
    </button>
  )
}

// ============================================
// GRADIENT BUTTON (special CTA actions)
// ============================================
interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {}

export function GradientButton({
  children,
  size = 'md',
  icon,
  iconRight,
  disabled,
  loading,
  style,
  className,
  ...props
}: GradientButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const isDisabled = disabled || loading

  const s = SIZES[size]

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={className || ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
        border: 'none',
        borderRadius: s.borderRadius,
        color: 'white',
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease',
        boxShadow: hovered && !isDisabled
          ? '0 4px 20px rgba(163, 91, 255, 0.5), 0 4px 20px rgba(253, 145, 115, 0.5)'
          : '0 4px 12px rgba(163, 91, 255, 0.25), 0 4px 12px rgba(253, 145, 115, 0.15)',
        boxSizing: 'border-box',
        lineHeight: 1,
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        transform: pressed && !isDisabled
          ? 'translateY(0) scale(0.96)'
          : hovered && !isDisabled
            ? 'translateY(-2px) scale(1.02)'
            : 'translateY(0) scale(1)',
        ...style
      }}
    >
      {loading ? (
        <span style={{
          width: s.spinner,
          height: s.spinner,
          border: '2px solid white',
          borderTopColor: 'transparent',
          borderRadius: 'var(--radius-full)',
          animation: 'spin 1s linear infinite'
        }} />
      ) : icon && (
        <span style={{ display: 'flex', fontSize: s.iconSize }}>{icon}</span>
      )}
      {children}
      {iconRight && (
        <span style={{ display: 'flex', fontSize: s.iconSize }}>{iconRight}</span>
      )}
    </button>
  )
}
