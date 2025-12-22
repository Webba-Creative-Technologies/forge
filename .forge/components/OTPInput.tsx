import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'

// ============================================
// OTP INPUT
// ============================================
interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  type?: 'numeric' | 'alphanumeric'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  autoFocus?: boolean
  label?: string
  hint?: string
  separator?: boolean
  separatorAfter?: number
  className?: string
  style?: React.CSSProperties
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  type = 'numeric',
  size = 'md',
  error = false,
  errorMessage,
  disabled = false,
  autoFocus = false,
  label,
  hint,
  separator = false,
  separatorAfter = 3,
  className,
  style
}: OTPInputProps) {
  const [values, setValues] = useState<string[]>(() => {
    const initial = value.split('').slice(0, length)
    return [...initial, ...Array(length - initial.length).fill('')]
  })
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value !== undefined) {
      const newValues = value.split('').slice(0, length)
      setValues([...newValues, ...Array(length - newValues.length).fill('')])
    }
  }, [value, length])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const sizeConfig = {
    sm: { width: 36, height: 40, fontSize: '1rem', gap: 6 },
    md: { width: 44, height: 48, fontSize: '1.25rem', gap: 8 },
    lg: { width: 52, height: 56, fontSize: '1.5rem', gap: 10 }
  }

  const config = sizeConfig[size]

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus()
    }
  }

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return

    // Filter based on type
    const filtered = type === 'numeric'
      ? newValue.replace(/[^0-9]/g, '')
      : newValue.replace(/[^a-zA-Z0-9]/g, '')

    if (filtered.length > 1) {
      // Handle paste into single field
      const chars = filtered.split('').slice(0, length - index)
      const newValues = [...values]
      chars.forEach((char, i) => {
        if (index + i < length) {
          newValues[index + i] = char.toUpperCase()
        }
      })
      setValues(newValues)
      const combined = newValues.join('')
      onChange?.(combined)

      // Focus next empty or last
      const nextIndex = Math.min(index + chars.length, length - 1)
      focusInput(nextIndex)

      if (combined.length === length && !combined.includes('')) {
        onComplete?.(combined)
      }
      return
    }

    const newValues = [...values]
    newValues[index] = filtered.toUpperCase()
    setValues(newValues)

    const combined = newValues.join('')
    onChange?.(combined)

    // Auto focus next
    if (filtered && index < length - 1) {
      focusInput(index + 1)
    }

    if (combined.length === length && !combined.includes('')) {
      onComplete?.(combined)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValues = [...values]
      if (values[index]) {
        newValues[index] = ''
        setValues(newValues)
        onChange?.(newValues.join(''))
      } else if (index > 0) {
        newValues[index - 1] = ''
        setValues(newValues)
        onChange?.(newValues.join(''))
        focusInput(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      focusInput(index + 1)
    } else if (e.key === 'Delete') {
      e.preventDefault()
      const newValues = [...values]
      newValues[index] = ''
      setValues(newValues)
      onChange?.(newValues.join(''))
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const filtered = type === 'numeric'
      ? pastedData.replace(/[^0-9]/g, '')
      : pastedData.replace(/[^a-zA-Z0-9]/g, '')

    const chars = filtered.split('').slice(0, length)
    const newValues = Array(length).fill('')
    chars.forEach((char, i) => {
      newValues[i] = char.toUpperCase()
    })
    setValues(newValues)

    const combined = newValues.join('')
    onChange?.(combined)

    // Focus last filled or first empty
    const lastIndex = Math.min(chars.length, length - 1)
    focusInput(lastIndex)

    if (combined.length === length && !combined.includes('')) {
      onComplete?.(combined)
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
    // Select the content when focusing
    inputRefs.current[index]?.select()
  }

  const handleBlur = () => {
    setFocusedIndex(null)
  }

  const handleClick = (index: number) => {
    focusInput(index)
  }

  return (
    <div className={className} style={style}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem'
        }}>
          {label}
        </label>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: config.gap
      }}>
        {Array.from({ length }, (_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: config.gap }}>
            <input
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              maxLength={2}
              value={values[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onClick={() => handleClick(index)}
              disabled={disabled}
              autoComplete="one-time-code"
              style={{
                width: config.width,
                height: config.height,
                textAlign: 'center',
                fontSize: config.fontSize,
                fontWeight: 600,
                fontFamily: 'monospace',
                border: `2px solid ${error ? 'var(--error)' : focusedIndex === index ? 'var(--brand-primary)' : values[index] ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                caretColor: 'var(--brand-primary)',
                boxShadow: focusedIndex === index ? '0 0 0 3px rgba(163, 91, 255, 0.15)' : 'none',
                cursor: disabled ? 'not-allowed' : 'text'
              }}
            />
            {separator && index === separatorAfter - 1 && index < length - 1 && (
              <span style={{
                color: 'var(--text-muted)',
                fontSize: config.fontSize,
                fontWeight: 300
              }}>
                -
              </span>
            )}
          </div>
        ))}
      </div>

      {(hint || errorMessage) && (
        <p style={{
          margin: '0.5rem 0 0',
          fontSize: '0.75rem',
          color: error ? 'var(--error)' : 'var(--text-muted)'
        }}>
          {errorMessage || hint}
        </p>
      )}
    </div>
  )
}

// ============================================
// PIN INPUT (Alias for OTPInput with dots)
// ============================================
interface PINInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  label?: string
  masked?: boolean
  autoFocus?: boolean
}

export function PINInput({
  length = 4,
  value = '',
  onChange,
  onComplete,
  size = 'md',
  error = false,
  errorMessage,
  disabled = false,
  label,
  masked = true,
  autoFocus = false
}: PINInputProps) {
  const [values, setValues] = useState<string[]>(() => {
    const initial = value.split('').slice(0, length)
    return [...initial, ...Array(length - initial.length).fill('')]
  })
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value !== undefined) {
      const newValues = value.split('').slice(0, length)
      setValues([...newValues, ...Array(length - newValues.length).fill('')])
    }
  }, [value, length])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const sizeConfig = {
    sm: { size: 40, fontSize: '1.5rem', gap: 8 },
    md: { size: 48, fontSize: '2rem', gap: 10 },
    lg: { size: 56, fontSize: '2.5rem', gap: 12 }
  }

  const config = sizeConfig[size]

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus()
    }
  }

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return
    const filtered = newValue.replace(/[^0-9]/g, '')

    if (!filtered && !newValue) {
      const newValues = [...values]
      newValues[index] = ''
      setValues(newValues)
      onChange?.(newValues.join(''))
      return
    }

    if (!filtered) return

    const newValues = [...values]
    newValues[index] = filtered[filtered.length - 1]
    setValues(newValues)

    const combined = newValues.join('')
    onChange?.(combined)

    if (index < length - 1) {
      focusInput(index + 1)
    }

    if (combined.length === length && !combined.includes('')) {
      onComplete?.(combined)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValues = [...values]
      if (values[index]) {
        newValues[index] = ''
        setValues(newValues)
        onChange?.(newValues.join(''))
      } else if (index > 0) {
        newValues[index - 1] = ''
        setValues(newValues)
        onChange?.(newValues.join(''))
        focusInput(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleBlur = () => {
    setFocusedIndex(null)
  }

  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          {label}
        </label>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: config.gap
      }}>
        {Array.from({ length }, (_, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: config.size,
              height: config.size
            }}
          >
            <input
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={masked ? '' : values[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              disabled={disabled}
              autoComplete="one-time-code"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                textAlign: 'center',
                fontSize: config.fontSize,
                fontWeight: 700,
                border: `2px solid ${error ? 'var(--error)' : focusedIndex === index ? 'var(--brand-primary)' : values[index] ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                color: masked ? 'transparent' : 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.15s ease',
                caretColor: 'transparent',
                boxShadow: focusedIndex === index ? '0 0 0 3px rgba(163, 91, 255, 0.15)' : 'none',
                cursor: disabled ? 'not-allowed' : 'text'
              }}
            />
            {/* Dot indicator */}
            {values[index] && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'var(--text-primary)',
                pointerEvents: 'none'
              }} />
            )}
          </div>
        ))}
      </div>

      {errorMessage && (
        <p style={{
          margin: '0.5rem 0 0',
          fontSize: '0.75rem',
          color: 'var(--error)',
          textAlign: 'center'
        }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
