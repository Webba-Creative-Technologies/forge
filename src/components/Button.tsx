import { CSSProperties, ReactNode, ButtonHTMLAttributes, useState } from 'react'
import { COLORS, SHADOWS } from '../constants'
import { Tooltip } from './Tooltip'
import { useInteractionState } from '../hooks/useInteractionState'

// ============================================
// SIZE STANDARDS (consistent heights across app)
// ============================================
// Height values reference var(--size-*) tokens (injected by ForgeProvider)
// so a <Button size="md" /> and an <Input size="md" /> render with the same
// exact height. `xs` / `xl` are fully supported across the form/controls family.
export const SIZES = {
  xs: { height: 'var(--size-xs)', fontSize: '0.75rem',   padding: '0 0.75rem',  gap: '0.25rem',  borderRadius: 'var(--radius-sm)', iconSize: 14, spinner: 12 },
  sm: { height: 'var(--size-sm)', fontSize: '0.8125rem', padding: '0 1rem',     gap: '0.375rem', borderRadius: 'var(--radius-md)', iconSize: 16, spinner: 14 },
  md: { height: 'var(--size-md)', fontSize: '0.875rem',  padding: '0 1.125rem', gap: '0.5rem',   borderRadius: 'var(--radius-md)', iconSize: 18, spinner: 16 },
  lg: { height: 'var(--size-lg)', fontSize: '0.9375rem', padding: '0 1.375rem', gap: '0.5rem',   borderRadius: 'var(--radius-md)', iconSize: 20, spinner: 18 },
  xl: { height: 'var(--size-xl)', fontSize: '1rem',      padding: '0 1.625rem', gap: '0.5rem',   borderRadius: 'var(--radius-md)', iconSize: 22, spinner: 20 }
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const COMPACT_PADDING: Record<ButtonSize, string> = {
  xs: '0 0.375rem',
  sm: '0 0.5rem',
  md: '0 0.75rem',
  lg: '0 1rem',
  xl: '0 1.25rem'
}

// ============================================
// BUTTON (Subtle Depth design)
// ============================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  compact?: boolean
  gradient?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  rightIcon,
  fullWidth,
  compact,
  gradient = false,
  children,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  const { hovered, pressed, bind } = useInteractionState()
  const [focused, setFocused] = useState(false)
  const isDisabled = disabled || loading

  const s = SIZES[size]

  const getVariantStyle = (): CSSProperties => {
    const base: CSSProperties = {}

    switch (variant) {
      case 'primary':
        Object.assign(base, {
          backgroundColor: 'var(--brand-primary)',
          color: 'white',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: pressed && !isDisabled
            ? 'inset 0 1px 3px rgba(0,0,0,0.2)'
            : '0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
          fontWeight: 600,
          filter: hovered && !isDisabled && !pressed ? 'brightness(1.15)' : 'none'
        })
        break

      case 'secondary':
        Object.assign(base, {
          backgroundColor: pressed && !isDisabled
            ? 'color-mix(in srgb, var(--text-primary) 10%, var(--bg-primary))'
            : hovered && !isDisabled
              ? 'color-mix(in srgb, var(--text-primary) 7%, var(--bg-primary))'
              : 'color-mix(in srgb, var(--text-primary) 3%, var(--bg-primary))',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          boxShadow: pressed && !isDisabled
            ? 'inset 0 1px 3px rgba(0,0,0,0.1)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          fontWeight: 500
        })
        break

      case 'outline':
        Object.assign(base, {
          backgroundColor: 'transparent',
          color: hovered && !isDisabled ? 'var(--brand-primary)' : 'var(--text-secondary)',
          border: `1px solid ${hovered && !isDisabled ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          boxShadow: pressed && !isDisabled
            ? 'inset 0 1px 3px rgba(0,0,0,0.08)'
            : 'none'
        })
        break

      case 'ghost':
        // Uses --bg-subtle (neutral white/4%) for hover so a ghost Button
        // sitting inside a Card variant="subtle" does NOT merge visually —
        // the two surfaces have distinct backgrounds.
        Object.assign(base, {
          backgroundColor: hovered && !isDisabled ? 'var(--bg-subtle)' : 'transparent',
          color: hovered && !isDisabled ? 'var(--text-primary)' : 'var(--text-secondary)',
          border: '1px solid transparent',
          boxShadow: 'none'
        })
        break

      case 'danger':
        Object.assign(base, {
          backgroundColor: COLORS.error,
          color: 'white',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: pressed && !isDisabled
            ? 'inset 0 1px 3px rgba(0,0,0,0.2)'
            : '0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
          fontWeight: 600,
          filter: hovered && !isDisabled && !pressed ? 'brightness(1.1)' : 'none'
        })
        break

      case 'link':
        // `link` is meant to flow as inline text. Strip horizontal padding
        // and the button's fixed height so the label sits flush with the
        // surrounding type (no 16px shift to the right when placed in a
        // Card body). Click area follows the label + icon natural size.
        Object.assign(base, {
          backgroundColor: 'transparent',
          color: 'var(--brand-primary)',
          border: '1px solid transparent',
          boxShadow: 'none',
          textDecoration: hovered && !isDisabled ? 'underline' : 'none',
          padding: 0,
          height: 'auto',
          minHeight: 0,
          justifyContent: 'flex-start'
        })
        break
    }

    return base
  }

  const variantStyle = getVariantStyle()

  const gradientBg = 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)'
  const gradientActive = gradient && (variant === 'primary' || variant === 'outline' || variant === 'ghost')
  const useGradientText = gradientActive && (variant === 'ghost' || (variant === 'outline' && !(hovered && !isDisabled)))

  if (gradientActive) {
    if (variant === 'outline') {
      if (hovered && !isDisabled) {
        Object.assign(variantStyle, {
          background: gradientBg,
          backgroundColor: undefined,
          color: 'white',
          border: '1px solid transparent',
          boxShadow: pressed ? 'inset 0 1px 3px rgba(0,0,0,0.2)' : SHADOWS.glow.lg,
          fontWeight: 600,
          filter: pressed ? 'none' : 'brightness(1.1)',
          textDecoration: 'none'
        })
      } else {
        Object.assign(variantStyle, {
          background: `linear-gradient(var(--bg-primary), var(--bg-primary)) padding-box, ${gradientBg} border-box`,
          backgroundColor: undefined,
          color: 'var(--brand-primary)',
          border: '1px solid transparent',
          boxShadow: 'none',
          fontWeight: 600,
          textDecoration: 'none'
        })
      }
    } else if (variant === 'ghost') {
      Object.assign(variantStyle, {
        backgroundColor: hovered && !isDisabled ? 'var(--bg-subtle)' : 'transparent',
        color: 'var(--brand-primary)',
        border: '1px solid transparent',
        boxShadow: 'none',
        fontWeight: 600
      })
    } else {
      Object.assign(variantStyle, {
        background: gradientBg,
        backgroundColor: undefined,
        color: 'white',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: pressed && !isDisabled
          ? 'inset 0 1px 3px rgba(0,0,0,0.2)'
          : hovered && !isDisabled
            ? SHADOWS.glow.lg
            : SHADOWS.glow.md,
        fontWeight: 600,
        filter: hovered && !isDisabled && !pressed ? 'brightness(1.1)' : 'none',
        textDecoration: 'none'
      })
    }
  }

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={className || ''}
      {...bind}
      onFocus={(e) => { if (e.target.matches(':focus-visible')) setFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        borderRadius: s.borderRadius,
        fontWeight: (variantStyle.fontWeight as number) || 500,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'fit-content',
        boxSizing: 'border-box',
        lineHeight: 1,
        height: s.height,
        padding: compact ? COMPACT_PADDING[size] : s.padding,
        fontSize: s.fontSize,
        outline: focused ? '2px solid var(--brand-primary)' : 'none',
        outlineOffset: focused ? 2 : 0,
        ...variantStyle,
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
      {useGradientText ? (
        <span style={{
          background: gradientBg,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        }}>
          {children}
        </span>
      ) : children}
      {rightIcon && (
        <span style={{ display: 'flex', fontSize: s.iconSize }}>{rightIcon}</span>
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
  tooltip?: string
  loading?: boolean
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  tooltip,
  loading,
  disabled,
  className,
  style,
  ...props
}: IconButtonProps) {
  const { hovered, pressed, bind } = useInteractionState()

  const sizeStyles: Record<ButtonSize, { width: string; height: string; fontSize: number; borderRadius: string }> = {
    xs: { width: 'var(--size-xs)', height: 'var(--size-xs)', fontSize: 14, borderRadius: 'var(--radius-sm)' },
    sm: { width: 'var(--size-sm)', height: 'var(--size-sm)', fontSize: 16, borderRadius: 'var(--radius-md)' },
    md: { width: 'var(--size-md)', height: 'var(--size-md)', fontSize: 18, borderRadius: 'var(--radius-md)' },
    lg: { width: 'var(--size-lg)', height: 'var(--size-lg)', fontSize: 20, borderRadius: 'var(--radius-md)' },
    xl: { width: 'var(--size-xl)', height: 'var(--size-xl)', fontSize: 22, borderRadius: 'var(--radius-md)' }
  }

  const s = sizeStyles[size]

  // Variant styles
  const variantStyles: Record<string, { bg: string; bgHover: string; bgPress: string; color: string }> = {
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--bg-subtle)',
      bgPress: 'var(--bg-hover)',
      color: 'var(--text-muted)'
    },
    subtle: {
      bg: 'var(--bg-subtle)',
      bgHover: 'var(--bg-hover)',
      bgPress: 'var(--bg-active)',
      color: 'var(--text-muted)'
    },
    danger: {
      bg: 'transparent',
      bgHover: `${COLORS.error}1a`,
      bgPress: `${COLORS.error}30`,
      color: COLORS.error
    },
    inverted: {
      bg: 'rgba(255, 255, 255, 0.1)',
      bgHover: 'rgba(255, 255, 255, 0.2)',
      bgPress: 'rgba(255, 255, 255, 0.3)',
      color: 'white'
    }
  }

  const v = variantStyles[variant]
  const isDisabled = disabled || loading

  const button = (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={props['aria-label'] || tooltip}
      className={className || ''}
      {...bind}
      style={{
        width: s.width,
        height: s.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDisabled ? v.bg : pressed ? v.bgPress : hovered ? v.bgHover : v.bg,
        border: 'none',
        borderRadius: s.borderRadius,
        color: v.color,
        fontSize: s.fontSize,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {loading ? (
        <span style={{
          width: s.fontSize * 0.85,
          height: s.fontSize * 0.85,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      ) : icon}
    </button>
  )

  if (tooltip && !isDisabled) {
    return <Tooltip content={tooltip}>{button}</Tooltip>
  }

  return button
}

