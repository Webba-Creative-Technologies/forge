import { useState, useCallback, ReactNode } from 'react'
import { Copy20Regular, Checkmark20Regular } from '@fluentui/react-icons'

// ============================================
// COPY BUTTON
// ============================================
interface CopyButtonProps {
  text: string
  children?: ReactNode
  onCopy?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button' | 'minimal'
  label?: string
  successLabel?: string
  timeout?: number
  className?: string
  style?: React.CSSProperties
}

export function CopyButton({
  text,
  children,
  onCopy,
  size = 'md',
  variant = 'icon',
  label = 'Copy',
  successLabel = 'Copied!',
  timeout = 2000,
  className,
  style
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), timeout)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [text, onCopy, timeout])

  const sizeConfig = {
    sm: { icon: 14, padding: '0.25rem', fontSize: '0.75rem', buttonPadding: '0.25rem 0.5rem' },
    md: { icon: 18, padding: '0.375rem', fontSize: '0.8125rem', buttonPadding: '0.375rem 0.75rem' },
    lg: { icon: 22, padding: '0.5rem', fontSize: '0.875rem', buttonPadding: '0.5rem 1rem' }
  }

  const config = sizeConfig[size]
  const Icon = copied ? Checkmark20Regular : Copy20Regular
  const iconColor = copied ? 'var(--success)' : 'var(--text-muted)'

  // Minimal variant - just the icon inline
  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          border: 'none',
          background: 'transparent',
          color: iconColor,
          cursor: 'pointer',
          borderRadius: 'var(--radius-xs)',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed ? 'scale(0.9)' : hovered ? 'scale(1.1)' : 'scale(1)',
          ...style
        }}
        title={copied ? successLabel : label}
      >
        <Icon style={{ fontSize: config.icon }} />
      </button>
    )
  }

  // Icon variant - icon button with hover state
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className={`interactive-icon ${className || ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: config.padding,
          border: '1px solid var(--border-color)',
          background: pressed ? 'var(--bg-tertiary)' : hovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          color: iconColor,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed ? 'scale(0.95)' : hovered ? 'scale(1.05)' : 'scale(1)',
          ...style
        }}
        title={copied ? successLabel : label}
      >
        <Icon style={{ fontSize: config.icon }} />
      </button>
    )
  }

  // Button variant - full button with label
  return (
    <button
      type="button"
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        padding: config.buttonPadding,
        border: '1px solid var(--border-color)',
        background: copied ? 'var(--success)' : pressed ? 'var(--bg-tertiary)' : hovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        color: copied ? 'white' : 'var(--text-primary)',
        fontSize: config.fontSize,
        fontWeight: 500,
        cursor: 'pointer',
        borderRadius: 6,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed ? 'scale(0.95)' : hovered ? 'scale(1.02)' : 'scale(1)',
        ...style
      }}
    >
      <Icon style={{ fontSize: config.icon }} />
      {children || (copied ? successLabel : label)}
    </button>
  )
}

// ============================================
// COPY FIELD (Input with copy button)
// ============================================
interface CopyFieldProps {
  value: string
  label?: string
  onCopy?: () => void
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

export function CopyField({
  value,
  label,
  onCopy,
  size = 'md',
  className,
  style
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [value, onCopy])

  const sizeStyles = {
    sm: { height: 32, fontSize: '0.75rem', iconSize: 14 },
    md: { height: 40, fontSize: '0.8125rem', iconSize: 18 }
  }

  const config = sizeStyles[size]

  return (
    <div className={className} style={style}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.375rem'
        }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: config.height,
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-tertiary)',
        overflow: 'hidden'
      }}>
        <input
          type="text"
          value={value}
          readOnly
          style={{
            flex: 1,
            height: '100%',
            padding: '0 0.75rem',
            border: 'none',
            background: 'transparent',
            fontSize: config.fontSize,
            color: 'var(--text-secondary)',
            outline: 'none',
            fontFamily: 'monospace'
          }}
        />
        <button
          type="button"
          onClick={handleCopy}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setPressed(false) }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: config.height,
            height: '100%',
            border: 'none',
            borderLeft: '1px solid var(--border-color)',
            background: copied ? 'var(--success)' : pressed ? 'var(--bg-tertiary)' : hovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
            color: copied ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: pressed ? 'scale(0.95)' : hovered ? 'scale(1.05)' : 'scale(1)'
          }}
          title={copied ? 'Copied!' : 'Copy'}
        >
          {copied ? (
            <Checkmark20Regular style={{ fontSize: config.iconSize }} />
          ) : (
            <Copy20Regular style={{ fontSize: config.iconSize }} />
          )}
        </button>
      </div>
    </div>
  )
}
