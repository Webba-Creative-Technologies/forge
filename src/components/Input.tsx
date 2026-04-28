import React, { CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState, useRef, useEffect, useId, forwardRef } from 'react'
import { Search20Regular, Dismiss20Regular, ChevronDown16Regular, Checkmark16Regular, Checkmark12Regular, Subtract12Regular } from '@fluentui/react-icons'
import { SIZES } from './Button'
import { COLORS, Z_INDEX } from '../constants'

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
  borderRadius: 'min(var(--radius-sm), 12px)',
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
  rightIcon?: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  clearable?: boolean
  showCount?: boolean
  onChange?: (value: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  label,
  error,
  hint,
  icon,
  rightIcon,
  size = 'md',
  clearable,
  showCount,
  required,
  disabled,
  onChange,
  maxLength,
  value,
  className,
  style,
  ...props
}, ref) {
  const s = SIZES[size]
  const hasRightContent = rightIcon || (clearable && value)
  const hintId = useId()
  const errorId = useId()
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

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
            justifyContent: 'center',
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
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          onChange={e => onChange?.(e.target.value)}
          style={{
            ...inputStyle,
            height: s.height,
            padding: s.padding,
            fontSize: s.fontSize,
            borderRadius: s.borderRadius,
            paddingLeft: icon ? '2.5rem' : s.padding,
            paddingRight: hasRightContent ? '2.5rem' : s.padding,
            borderColor: error ? COLORS.error : 'var(--border-color)',
            opacity: disabled ? 0.5 : 1
          }}
          onFocus={e => {
            if (!error) e.target.style.borderColor = 'var(--brand-primary)'
          }}
          onBlur={e => {
            if (!error) e.target.style.borderColor = 'var(--border-color)'
          }}
        />
        {hasRightContent && (
          <div style={{
            position: 'absolute',
            right: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            height: s.height
          }}>
            {clearable && value && (
              <button
                type="button"
                onClick={() => onChange?.('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  padding: 0,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Dismiss20Regular style={{ fontSize: 12 }} />
              </button>
            )}
            {rightIcon && (
              <span style={{ display: 'flex', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" style={{ color: COLORS.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {hint}
        </p>
      )}
      {showCount && maxLength && (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          marginTop: '0.25rem',
          textAlign: 'right'
        }}>
          {String(value || '').length}/{maxLength}
        </p>
      )}
    </div>
  )
})

// ============================================
// TEXTAREA
// ============================================
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  hint?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  autoResize?: boolean
  showCount?: boolean
  onChange?: (value: string) => void
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  label,
  error,
  hint,
  size = 'md',
  autoResize,
  showCount,
  required,
  disabled,
  rows = 4,
  maxLength,
  value,
  onChange,
  className,
  style,
  ...props
}, ref) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  const s = SIZES[size]

  const handleResize = () => {
    const el = internalRef.current
    if (el && autoResize) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  const setRefs = (el: HTMLTextAreaElement | null) => {
    internalRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
  }

  return (
    <div className={className} style={style}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: COLORS.error, marginLeft: 4 }}>*</span>}
        </label>
      )}
      <textarea
        ref={setRefs}
        {...props}
        rows={rows}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={e => {
          onChange?.(e.target.value)
          if (autoResize) handleResize()
        }}
        style={{
          ...textareaStyle,
          fontSize: s.fontSize,
          borderColor: error ? COLORS.error : 'var(--border-color)',
          opacity: disabled ? 0.5 : 1,
          resize: autoResize ? 'none' : 'vertical',
          overflow: autoResize ? 'hidden' : undefined
        }}
        onFocus={e => {
          if (!error) e.target.style.borderColor = 'var(--brand-primary)'
        }}
        onBlur={e => {
          if (!error) e.target.style.borderColor = 'var(--border-color)'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
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
        {showCount && maxLength && (
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            marginTop: '0.25rem',
            flexShrink: 0
          }}>
            {String(value || '').length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
})

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
  hint?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  searchable?: boolean
  clearable?: boolean
  className?: string
  style?: CSSProperties
}

export function Select({
  label,
  value,
  options,
  placeholder = 'Select...',
  required,
  disabled,
  onChange,
  error,
  hint,
  size = 'md',
  searchable,
  clearable,
  className,
  style
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [flipUp, setFlipUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const s = SIZES[size]

  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  const filteredOptions = searchable && search
    ? normalizedOptions.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : normalizedOptions

  const selected = normalizedOptions.find(o => o.value === value)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && searchable) setTimeout(() => searchRef.current?.focus(), 0)
    if (!open) { setSearch(''); setHighlightedIndex(-1) }
  }, [open, searchable])

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement
      if (el) el.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  const handleOpen = () => {
    if (disabled) return
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setFlipUp(window.innerHeight - rect.bottom < 280)
    }
    setOpen(!open)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        handleOpen()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => prev < filteredOptions.length - 1 ? prev + 1 : 0)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : filteredOptions.length - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          onChange?.(filteredOptions[highlightedIndex].value)
          setOpen(false)
          setSearch('')
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        setSearch('')
        break
    }
  }

  return (
    <div ref={ref} onKeyDown={handleKeyDown} className={className} style={style}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: COLORS.error, marginLeft: 4 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          style={{
            width: '100%',
            height: s.height,
            padding: '0 0.75rem',
            paddingRight: clearable && value ? '2.5rem' : '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${error ? COLORS.error : open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
            borderRadius: s.borderRadius,
            color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: s.fontSize,
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

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange?.('') }}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <Dismiss20Regular style={{ fontSize: 12 }} />
          </button>
        )}

        {open && (
          <div style={{
            position: 'absolute',
            ...(flipUp ? { bottom: '100%', marginBottom: 4 } : { top: '100%', marginTop: 4 }),
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: Z_INDEX.dropdown,
            padding: 6,
            animation: 'scaleIn 0.15s ease-out'
          }}>
            {searchable && (
              <div style={{ padding: '0 6px 6px' }}>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setHighlightedIndex(0) }}
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 0.5rem',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            )}
            <div ref={listRef} style={{ maxHeight: 200, overflowY: 'auto' }}>
              {filteredOptions.length === 0 ? (
                <div style={{
                  padding: '0.5rem 0.75rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  textAlign: 'center'
                }}>
                  No results
                </div>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === value
                  const isHighlighted = index === highlightedIndex
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { onChange?.(opt.value); setOpen(false); setSearch('') }}
                      className={!isSelected && !isHighlighted ? 'interactive-row' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: isSelected
                          ? 'var(--brand-primary)'
                          : isHighlighted
                            ? 'var(--bg-hover)'
                            : 'transparent',
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
                })
              )}
            </div>
          </div>
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
  className?: string
  style?: CSSProperties
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  size = 'md',
  autoFocus,
  onKeyDown,
  className,
  style
}: SearchInputProps) {
  const sizeConfig = size === 'sm' ? SIZES.sm : SIZES.md
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <div className={className} style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      ...style
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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  hint?: string
  error?: string
  className?: string
  style?: CSSProperties
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  indeterminate,
  size = 'md',
  hint,
  error,
  className,
  style
}: CheckboxProps) {
  const [hovered, setHovered] = useState(false)
  const [pressing, setPressing] = useState(false)

  const sizeStyles = {
    xs: { box: 14, icon: 9,  gap: '0.3125rem', fontSize: '0.75rem' },
    sm: { box: 16, icon: 10, gap: '0.375rem',  fontSize: '0.8rem' },
    md: { box: 20, icon: 12, gap: '0.5rem',    fontSize: '0.875rem' },
    lg: { box: 24, icon: 14, gap: '0.625rem',  fontSize: '0.9375rem' },
    xl: { box: 28, icon: 16, gap: '0.75rem',   fontSize: '1rem' }
  }

  const s = sizeStyles[size]
  const isActive = checked || indeterminate

  return (
    <div className={className} style={style}>
    <label
      style={{
        display: 'flex',
        alignItems: hint ? 'flex-start' : 'center',
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

      {/* Label and hint */}
      {(label || hint) && (
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
          {hint && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}>
              {hint}
            </span>
          )}
        </span>
      )}
    </label>
    {error && (
      <p style={{ color: COLORS.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>
    )}
    </div>
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
