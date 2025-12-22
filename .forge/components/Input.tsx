import React, { CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react'
import { Search20Regular, Dismiss20Regular, ChevronDown16Regular, Checkmark16Regular, Checkmark12Regular, Subtract12Regular } from '@fluentui/react-icons'
import { SIZES } from './Button'

// ============================================
// BASE STYLES
// ============================================
export const inputStyle: CSSProperties = {
  width: '100%',
  height: SIZES.md.height,
  padding: SIZES.md.padding,
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: SIZES.md.fontSize,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s ease'
}

export const textareaStyle: CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: SIZES.md.fontSize,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  resize: 'vertical',
  minHeight: 80,
  outline: 'none',
  transition: 'border-color 0.15s ease'
}

export const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.8rem',
  fontWeight: 500,
  color: 'var(--text-secondary)'
}

// ============================================
// INPUT
// ============================================
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  onChange?: (value: string) => void
  noMargin?: boolean
}

export function Input({
  label,
  error,
  hint,
  icon,
  required,
  disabled,
  onChange,
  noMargin,
  style,
  ...props
}: InputProps) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : '1rem' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            height: SIZES.md.height
          }}>
            {icon}
          </div>
        )}
        <input
          {...props}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          style={{
            ...inputStyle,
            paddingLeft: icon ? '2.5rem' : SIZES.md.padding,
            borderColor: error ? '#ef4444' : 'var(--border-color)',
            opacity: disabled ? 0.5 : 1,
            ...style
          }}
          onFocus={e => {
            if (!error) e.target.style.borderColor = 'var(--brand-primary)'
          }}
          onBlur={e => {
            if (!error) e.target.style.borderColor = 'var(--border-color)'
          }}
        />
      </div>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
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
}

// ============================================
// TEXTAREA
// ============================================
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  onChange?: (value: string) => void
}

export function Textarea({
  label,
  error,
  required,
  disabled,
  rows = 4,
  onChange,
  style,
  ...props
}: TextareaProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <textarea
        {...props}
        rows={rows}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        style={{
          ...textareaStyle,
          borderColor: error ? '#ef4444' : 'var(--border-color)',
          opacity: disabled ? 0.5 : 1,
          ...style
        }}
        onFocus={e => {
          if (!error) e.target.style.borderColor = 'var(--brand-primary)'
        }}
        onBlur={e => {
          if (!error) e.target.style.borderColor = 'var(--border-color)'
        }}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================
// SELECT (Custom dropdown)
// ============================================
interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value?: string
  options: (string | SelectOption)[]
  placeholder?: string
  onChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  error?: string
}

export function Select({
  label,
  value,
  options,
  placeholder = 'Sélectionner...',
  required,
  disabled,
  onChange,
  error
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Normalize options
  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )
  const selected = normalizedOptions.find(o => o.value === value)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '1rem' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        style={{
          width: '100%',
          height: SIZES.md.height,
          padding: '0 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${error ? '#ef4444' : open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)',
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: SIZES.md.fontSize,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'border-color 0.15s ease',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown16Regular style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease',
          color: 'var(--text-muted)',
          flexShrink: 0
        }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          backgroundColor: 'var(--bg-dropdown)',
          borderRadius: 8,
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
          zIndex: 2000,
          padding: 6,
          maxHeight: 250,
          overflowY: 'auto',
          animation: 'scaleIn 0.15s ease-out'
        }}>
          {normalizedOptions.map(opt => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(opt.value)
                  setOpen(false)
                }}
                className={isSelected ? undefined : 'interactive-row'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: isSelected ? 'var(--brand-primary)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && <Checkmark16Regular style={{ flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>
      )}

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================
// SEARCH INPUT
// ============================================
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md'
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher...',
  size = 'md',
  autoFocus,
  onKeyDown
}: SearchInputProps) {
  const sizeConfig = size === 'sm' ? SIZES.sm : SIZES.md
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Search20Regular style={{
        position: 'absolute',
        left: size === 'sm' ? 10 : 12,
        color: 'var(--text-muted)',
        fontSize: iconSize,
        pointerEvents: 'none'
      }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        style={{
          width: '100%',
          height: sizeConfig.height,
          padding: sizeConfig.padding,
          paddingLeft: size === 'sm' ? '2rem' : '2.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          fontSize: sizeConfig.fontSize,
          outline: 'none',
          transition: 'border-color 0.15s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="interactive-icon"
          style={{
            position: 'absolute',
            right: 8,
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 4,
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <Dismiss20Regular style={{ fontSize: 12 }} />
        </button>
      )}
    </div>
  )
}

// ============================================
// CHECKBOX
// ============================================
interface CheckboxProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
  size?: 'sm' | 'md'
  description?: string
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  indeterminate,
  size = 'md',
  description
}: CheckboxProps) {
  const [hovered, setHovered] = useState(false)
  const [pressing, setPressing] = useState(false)

  const sizeStyles = {
    sm: { box: 16, icon: 10, gap: '0.375rem', fontSize: '0.8rem' },
    md: { box: 20, icon: 12, gap: '0.5rem', fontSize: '0.875rem' }
  }

  const s = sizeStyles[size]
  const isActive = checked || indeterminate

  return (
    <label
      style={{
        display: 'flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: s.gap,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressing(false) }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
    >
      {/* Hidden native input for accessibility */}
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Custom checkbox box */}
      <span
        className={isActive ? 'checkbox-active' : ''}
        style={{
          width: s.box,
          height: s.box,
          minWidth: s.box,
          borderRadius: 5,
          border: isActive
            ? 'none'
            : `2px solid ${hovered && !disabled ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: pressing && !disabled
            ? 'scale(0.85)'
            : hovered && !disabled
              ? 'scale(1.1)'
              : 'scale(1)',
          boxShadow: isActive
            ? hovered && !disabled
              ? '0 0 0 4px color-mix(in srgb, var(--brand-primary) 25%, transparent), 0 2px 8px color-mix(in srgb, var(--brand-primary) 30%, transparent)'
              : '0 2px 6px color-mix(in srgb, var(--brand-primary) 25%, transparent)'
            : hovered && !disabled
              ? '0 0 0 4px color-mix(in srgb, var(--brand-primary) 10%, transparent)'
              : 'none'
        }}
      >
        {isActive && (
          <span
            style={{
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'checkmarkBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {indeterminate ? (
              <Subtract12Regular style={{ fontSize: s.icon }} />
            ) : (
              <Checkmark12Regular style={{ fontSize: s.icon }} />
            )}
          </span>
        )}
      </span>

      {/* Label and description */}
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {label && (
            <span style={{
              fontSize: s.fontSize,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              transition: 'color 0.15s ease'
            }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}

// ============================================
// FORM GROUP
// ============================================
interface FormGroupProps {
  children: ReactNode
  row?: boolean
  columns?: number
}

export function FormGroup({ children, row, columns }: FormGroupProps) {
  return (
    <div style={{
      display: row || columns ? 'grid' : 'block',
      gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : row ? 'repeat(auto-fit, minmax(200px, 1fr))' : undefined,
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {children}
    </div>
  )
}
