import { ReactNode, useState } from 'react'

// ============================================
// HEADING
// ============================================
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps {
  children: ReactNode
  level?: HeadingLevel
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted' | 'brand' | 'success' | 'warning' | 'error' | string
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  className?: string
  style?: React.CSSProperties
}

const HEADING_SIZES = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
  md: { fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' }
}

const LEVEL_DEFAULTS: Record<HeadingLevel, keyof typeof HEADING_SIZES> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm'
}

const WEIGHT_MAP = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
}

const COLOR_MAP: Record<string, string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  brand: 'var(--brand-primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)'
}

export function Heading({
  children,
  level = 2,
  as,
  size,
  weight = 'semibold',
  color = 'primary',
  align,
  truncate,
  className,
  style
}: HeadingProps) {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements)
  const resolvedSize = size || LEVEL_DEFAULTS[level]

  return (
    <Component
      className={className}
      style={{
        margin: 0,
        ...HEADING_SIZES[resolvedSize],
        fontWeight: WEIGHT_MAP[weight],
        color: COLOR_MAP[color] || color,
        textAlign: align,
        ...(truncate ? {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        } : {}),
        ...style
      }}
    >
      {children}
    </Component>
  )
}

// ============================================
// TEXT
// ============================================
interface TextProps {
  children: ReactNode
  as?: 'p' | 'span' | 'div' | 'label'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted' | 'brand' | 'success' | 'warning' | 'error' | string
  align?: 'left' | 'center' | 'right' | 'justify'
  truncate?: boolean | number // true for single line, number for multi-line
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  uppercase?: boolean
  className?: string
  style?: React.CSSProperties
}

const TEXT_SIZES = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },      // 12px
  sm: { fontSize: '0.8125rem', lineHeight: '1.25rem' }, // 13px
  md: { fontSize: '0.875rem', lineHeight: '1.5rem' },   // 14px
  lg: { fontSize: '1rem', lineHeight: '1.75rem' }       // 16px
}

export function Text({
  children,
  as: Component = 'p',
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align,
  truncate,
  italic,
  underline,
  strikethrough,
  uppercase,
  className,
  style
}: TextProps) {
  const truncateStyles: React.CSSProperties = truncate === true
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    : typeof truncate === 'number'
      ? {
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: truncate,
          WebkitBoxOrient: 'vertical'
        }
      : {}

  return (
    <Component
      className={className}
      style={{
        margin: 0,
        ...TEXT_SIZES[size],
        fontWeight: WEIGHT_MAP[weight],
        color: COLOR_MAP[color] || color,
        textAlign: align,
        fontStyle: italic ? 'italic' : undefined,
        textDecoration: underline ? 'underline' : strikethrough ? 'line-through' : undefined,
        textTransform: uppercase ? 'uppercase' : undefined,
        letterSpacing: uppercase ? '0.05em' : undefined,
        ...truncateStyles,
        ...style
      }}
    >
      {children}
    </Component>
  )
}

// ============================================
// LABEL
// ============================================
interface LabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

export function Label({
  children,
  htmlFor,
  required,
  size = 'md',
  className,
  style
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={className}
      style={{
        display: 'block',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        marginBottom: '0.375rem',
        ...style
      }}
    >
      {children}
      {required && (
        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
      )}
    </label>
  )
}

// ============================================
// LINK
// ============================================
interface LinkProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'default' | 'muted' | 'brand' | 'underline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  external?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Link({
  children,
  href,
  onClick,
  variant = 'default',
  size = 'md',
  external,
  disabled,
  className,
  style
}: LinkProps) {
  const [hovered, setHovered] = useState(false)

  const getVariantColors = (variant: string, isHovered: boolean) => {
    switch (variant) {
      case 'default':
        return {
          color: isHovered ? 'var(--brand-hover)' : 'var(--brand-primary)',
          textDecoration: isHovered ? 'underline' : 'none'
        }
      case 'muted':
        return {
          color: isHovered ? 'var(--brand-primary)' : 'var(--text-secondary)',
          textDecoration: isHovered ? 'underline' : 'none'
        }
      case 'brand':
        return {
          color: isHovered ? 'var(--brand-hover)' : 'var(--brand-primary)',
          textDecoration: isHovered ? 'underline' : 'none',
          fontWeight: 500
        }
      case 'underline':
        return {
          color: isHovered ? 'var(--brand-primary)' : 'var(--text-primary)',
          textDecoration: 'underline',
          textUnderlineOffset: '2px'
        }
      default:
        return {}
    }
  }

  const variantStyles = getVariantColors(variant, hovered && !disabled)

  const Component = href ? 'a' : 'button'

  return (
    <Component
      href={href}
      onClick={disabled ? undefined : onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
      style={{
        ...TEXT_SIZES[size],
        ...variantStyles,
        display: 'inline',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'color 0.15s ease, text-decoration 0.15s ease',
        ...style
      }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
    >
      {children}
      {external && (
        <span style={{ marginLeft: '0.25rem', fontSize: '0.75em' }}>↗</span>
      )}
    </Component>
  )
}

// ============================================
// KBD (Keyboard shortcut)
// ============================================
interface KbdProps {
  children: ReactNode
  size?: 'sm' | 'md'
  variant?: 'default' | 'outline'
  className?: string
  style?: React.CSSProperties
}

export function Kbd({
  children,
  size = 'md',
  variant = 'default',
  className,
  style
}: KbdProps) {
  const sizeStyles = {
    sm: { fontSize: '0.625rem', padding: '0.125rem 0.375rem', minWidth: 18 },
    md: { fontSize: '0.75rem', padding: '0.25rem 0.5rem', minWidth: 24 }
  }

  return (
    <kbd
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontWeight: 500,
        ...sizeStyles[size],
        backgroundColor: variant === 'default' ? 'var(--bg-tertiary)' : 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xs)',
        color: 'var(--text-secondary)',
        boxShadow: variant === 'default' ? '0 1px 0 var(--border-color)' : 'none',
        ...style
      }}
    >
      {children}
    </kbd>
  )
}

// ============================================
// SHORTCUT (Multiple keys)
// ============================================
interface ShortcutProps {
  keys: string[]
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

export function Shortcut({ keys, size = 'md', className, style }: ShortcutProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', ...style }}>
      {keys.map((key, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <Kbd size={size}>{key}</Kbd>
          {i < keys.length - 1 && (
            <span style={{ color: 'var(--text-muted)', fontSize: size === 'sm' ? '0.625rem' : '0.75rem' }}>+</span>
          )}
        </span>
      ))}
    </span>
  )
}
