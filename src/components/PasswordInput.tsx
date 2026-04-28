import { forwardRef, useState, InputHTMLAttributes, ReactNode } from 'react'
import { Eye20Regular, EyeOff20Regular } from '@fluentui/react-icons'
import { SIZES } from './Button'
import { COLORS } from '../constants'
import { labelStyle } from './Input'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'type'> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showToggle?: boolean
  onChange?: (value: string) => void
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({
  label,
  error,
  hint,
  icon,
  size = 'md',
  showToggle = true,
  required,
  disabled,
  onChange,
  value,
  className,
  style,
  ...props
}, ref) {
  const [visible, setVisible] = useState(false)
  const s = SIZES[size]

  return (
    <div className={className} style={style}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: COLORS.error, marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            height: s.height
          }}>
            {icon}
          </div>
        )}
        <input
          ref={ref}
          {...props}
          type={visible ? 'text' : 'password'}
          value={value}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          style={{
            width: '100%',
            height: s.height,
            padding: s.padding,
            fontSize: s.fontSize,
            borderRadius: s.borderRadius,
            paddingLeft: icon ? '2.5rem' : s.padding,
            paddingRight: showToggle ? '2.5rem' : s.padding,
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${error ? COLORS.error : 'var(--border-color)'}`,
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            opacity: disabled ? 0.5 : 1
          }}
          onFocus={e => {
            if (!error) e.target.style.borderColor = 'var(--brand-primary)'
          }}
          onBlur={e => {
            if (!error) e.target.style.borderColor = 'var(--border-color)'
          }}
        />
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible(v => !v)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {visible ? <EyeOff20Regular style={{ fontSize: 16 }} /> : <Eye20Regular style={{ fontSize: 16 }} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ color: COLORS.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {hint}
        </p>
      )}
    </div>
  )
})
