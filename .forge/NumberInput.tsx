import { useState, useRef, useEffect } from 'react'
import { Add20Regular, Subtract20Regular } from '@fluentui/react-icons'

// ============================================
// NUMBER INPUT
// ============================================
interface NumberInputProps {
  value: number | ''
  onChange: (value: number | '') => void
  min?: number
  max?: number
  step?: number
  precision?: number // Decimal places
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'stepper' | 'inline'
  showButtons?: boolean
  allowEmpty?: boolean
  prefix?: string
  suffix?: string
  className?: string
  style?: React.CSSProperties
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  precision,
  label,
  hint,
  error,
  placeholder = '0',
  disabled,
  readOnly,
  size = 'md',
  variant = 'default',
  showButtons = true,
  allowEmpty = false,
  prefix,
  suffix,
  className,
  style
}: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const [localValue, setLocalValue] = useState(value === '' ? '' : String(value))
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLocalValue(value === '' ? '' : String(value))
  }, [value])

  const sizeStyles = {
    sm: { height: 32, fontSize: '0.75rem', padding: '0 0.5rem', buttonSize: 24 },
    md: { height: 40, fontSize: '0.8125rem', padding: '0 0.75rem', buttonSize: 32 },
    lg: { height: 48, fontSize: '0.875rem', padding: '0 1rem', buttonSize: 40 }
  }

  const styles = sizeStyles[size]

  const clamp = (val: number): number => {
    let result = val
    if (min !== undefined) result = Math.max(min, result)
    if (max !== undefined) result = Math.min(max, result)
    if (precision !== undefined) {
      result = Number(result.toFixed(precision))
    }
    return result
  }

  const increment = () => {
    if (disabled || readOnly) return
    const currentValue = value === '' ? 0 : value
    const newValue = clamp(currentValue + step)
    onChange(newValue)
  }

  const decrement = () => {
    if (disabled || readOnly) return
    const currentValue = value === '' ? 0 : value
    const newValue = clamp(currentValue - step)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value

    // Allow empty
    if (inputVal === '' && allowEmpty) {
      setLocalValue('')
      onChange('')
      return
    }

    // Allow negative sign and decimal point while typing
    if (inputVal === '-' || inputVal === '.' || inputVal === '-.') {
      setLocalValue(inputVal)
      return
    }

    const parsed = parseFloat(inputVal)
    if (!isNaN(parsed)) {
      setLocalValue(inputVal)
      onChange(clamp(parsed))
    }
  }

  const handleBlur = () => {
    setFocused(false)
    if (localValue === '' && !allowEmpty) {
      const defaultVal = min !== undefined ? min : 0
      setLocalValue(String(defaultVal))
      onChange(defaultVal)
    } else if (localValue !== '' && localValue !== '-') {
      const parsed = parseFloat(localValue)
      if (!isNaN(parsed)) {
        const clamped = clamp(parsed)
        setLocalValue(String(clamped))
        onChange(clamped)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }

  const startContinuous = (action: () => void) => {
    action()
    intervalRef.current = setInterval(action, 100)
  }

  const stopContinuous = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const canDecrement = min === undefined || (value !== '' && value > min)
  const canIncrement = max === undefined || (value !== '' && value < max)

  // Inline stepper variant
  if (variant === 'inline') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
        {label && (
          <span style={{ fontSize: styles.fontSize, color: 'var(--text-secondary)' }}>{label}</span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || !canDecrement}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: styles.buttonSize,
              height: styles.buttonSize,
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: disabled || !canDecrement ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: disabled || !canDecrement ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Subtract20Regular style={{ fontSize: 16 }} />
          </button>
          <span style={{
            minWidth: 40,
            textAlign: 'center',
            fontSize: styles.fontSize,
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            {prefix}{value === '' ? '—' : value}{suffix}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={disabled || !canIncrement}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: styles.buttonSize,
              height: styles.buttonSize,
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: disabled || !canIncrement ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: disabled || !canIncrement ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Add20Regular style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    )
  }

  // Stepper variant (buttons only, no input)
  if (variant === 'stepper') {
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
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <button
            type="button"
            onClick={decrement}
            onMouseDown={() => startContinuous(decrement)}
            onMouseUp={stopContinuous}
            onMouseLeave={stopContinuous}
            disabled={disabled || !canDecrement}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: styles.height,
              height: styles.height,
              border: 'none',
              borderRight: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: disabled || !canDecrement ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: disabled || !canDecrement ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Subtract20Regular />
          </button>
          <span style={{
            minWidth: 60,
            padding: '0 1rem',
            textAlign: 'center',
            fontSize: styles.fontSize,
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            {prefix}{value === '' ? '0' : value}{suffix}
          </span>
          <button
            type="button"
            onClick={increment}
            onMouseDown={() => startContinuous(increment)}
            onMouseUp={stopContinuous}
            onMouseLeave={stopContinuous}
            disabled={disabled || !canIncrement}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: styles.height,
              height: styles.height,
              border: 'none',
              borderLeft: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: disabled || !canIncrement ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: disabled || !canIncrement ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Add20Regular />
          </button>
        </div>
        {(hint || error) && (
          <p style={{
            margin: '0.375rem 0 0',
            fontSize: '0.75rem',
            color: error ? 'var(--error)' : 'var(--text-muted)'
          }}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }

  // Default variant (input with optional buttons)
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
        height: styles.height,
        border: `1px solid ${error ? 'var(--error)' : focused ? 'var(--brand-primary)' : 'var(--border-color)'}`,
        borderRadius: 'var(--radius-md)',
        backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        boxShadow: focused ? '0 0 0 3px rgba(163, 91, 255, 0.1)' : 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        overflow: 'hidden'
      }}>
        {showButtons && (
          <button
            type="button"
            onClick={decrement}
            onMouseDown={() => startContinuous(decrement)}
            onMouseUp={stopContinuous}
            onMouseLeave={stopContinuous}
            disabled={disabled || !canDecrement}
            tabIndex={-1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: styles.height,
              height: '100%',
              border: 'none',
              borderRight: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: disabled || !canDecrement ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: disabled || !canDecrement ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease, color 0.15s ease'
            }}
            className="interactive-nav"
          >
            <Subtract20Regular style={{ fontSize: 18 }} />
          </button>
        )}

        {prefix && (
          <span style={{ paddingLeft: '0.75rem', color: 'var(--text-muted)', fontSize: styles.fontSize }}>
            {prefix}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          style={{
            flex: 1,
            height: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: styles.fontSize,
            color: 'var(--text-primary)',
            textAlign: 'center',
            padding: styles.padding,
            minWidth: 0
          }}
        />

        {suffix && (
          <span style={{ paddingRight: '0.75rem', color: 'var(--text-muted)', fontSize: styles.fontSize }}>
            {suffix}
          </span>
        )}

        {showButtons && (
          <button
            type="button"
            onClick={increment}
            onMouseDown={() => startContinuous(increment)}
            onMouseUp={stopContinuous}
            onMouseLeave={stopContinuous}
            disabled={disabled || !canIncrement}
            tabIndex={-1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: styles.height,
              height: '100%',
              border: 'none',
              borderLeft: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: disabled || !canIncrement ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: disabled || !canIncrement ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease, color 0.15s ease'
            }}
            className="interactive-nav"
          >
            <Add20Regular style={{ fontSize: 18 }} />
          </button>
        )}
      </div>
      {(hint || error) && (
        <p style={{
          margin: '0.375rem 0 0',
          fontSize: '0.75rem',
          color: error ? 'var(--error)' : 'var(--text-muted)'
        }}>
          {error || hint}
        </p>
      )}
    </div>
  )
}
