import { useState, useRef, KeyboardEvent } from 'react'
import { Dismiss12Regular } from '@fluentui/react-icons'

// ============================================
// TAG INPUT
// ============================================
interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  readOnly?: boolean
  maxTags?: number
  allowDuplicates?: boolean
  validateTag?: (tag: string) => boolean | string // true = valid, string = error message
  transformTag?: (tag: string) => string // Transform before adding (e.g., lowercase)
  separator?: string | RegExp // Keys that trigger tag creation (default: Enter, comma)
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'pills'
  className?: string
  style?: React.CSSProperties
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Ajouter...',
  label,
  hint,
  error,
  disabled,
  readOnly,
  maxTags,
  allowDuplicates = false,
  validateTag,
  transformTag,
  separator,
  size = 'md',
  variant = 'default',
  className,
  style
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sizeStyles = {
    sm: { fontSize: '0.75rem', padding: '0.25rem 0.5rem', tagPadding: '0.125rem 0.375rem', gap: 4 },
    md: { fontSize: '0.8125rem', padding: '0.5rem 0.75rem', tagPadding: '0.25rem 0.5rem', gap: 6 },
    lg: { fontSize: '0.875rem', padding: '0.625rem 1rem', tagPadding: '0.375rem 0.625rem', gap: 8 }
  }

  const styles = sizeStyles[size]
  const displayError = error || localError

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return

    const transformed = transformTag ? transformTag(trimmed) : trimmed

    // Check max tags
    if (maxTags && value.length >= maxTags) {
      setLocalError(`Maximum ${maxTags} tags`)
      return
    }

    // Check duplicates
    if (!allowDuplicates && value.includes(transformed)) {
      setLocalError('Tag déjà ajouté')
      return
    }

    // Validate
    if (validateTag) {
      const result = validateTag(transformed)
      if (result !== true) {
        setLocalError(typeof result === 'string' ? result : 'Tag invalide')
        return
      }
    }

    setLocalError(null)
    onChange([...value, transformed])
    setInputValue('')
  }

  const removeTag = (index: number) => {
    if (disabled || readOnly) return
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    // Check for separator pattern
    if (separator) {
      const parts = val.split(separator)
      if (parts.length > 1) {
        parts.slice(0, -1).forEach(part => addTag(part))
        setInputValue(parts[parts.length - 1])
        return
      }
    }

    setInputValue(val)
    setLocalError(null)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    const parts = pasted.split(/[,;\n\t]+/)
    parts.forEach(part => addTag(part))
  }

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

      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: styles.gap,
          padding: styles.padding,
          backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          border: `1px solid ${displayError ? 'var(--error)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          minHeight: size === 'sm' ? 32 : size === 'lg' ? 48 : 40
        }}
        onFocus={() => {
          const container = inputRef.current?.parentElement
          if (container) {
            container.style.borderColor = 'var(--brand-primary)'
            container.style.boxShadow = '0 0 0 3px rgba(163, 91, 255, 0.1)'
          }
        }}
        onBlur={() => {
          const container = inputRef.current?.parentElement
          if (container) {
            container.style.borderColor = displayError ? 'var(--error)' : 'var(--border-color)'
            container.style.boxShadow = 'none'
          }
        }}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: styles.tagPadding,
              backgroundColor: variant === 'pills' ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
              color: variant === 'pills' ? 'white' : 'var(--text-primary)',
              borderRadius: variant === 'pills' ? 'var(--radius-full)' : 'var(--radius-xs)',
              fontSize: styles.fontSize,
              fontWeight: 500
            }}
          >
            {tag}
            {!disabled && !readOnly && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(index)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: variant === 'pills' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = variant === 'pills'
                    ? 'rgba(255,255,255,0.2)'
                    : 'var(--bg-hover)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent'
                }}
              >
                <Dismiss12Regular />
              </button>
            )}
          </span>
        ))}

        {!readOnly && (!maxTags || value.length < maxTags) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            style={{
              flex: 1,
              minWidth: 80,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: styles.fontSize,
              color: 'var(--text-primary)',
              padding: 0
            }}
          />
        )}
      </div>

      {(hint || displayError) && (
        <p style={{
          margin: '0.375rem 0 0',
          fontSize: '0.75rem',
          color: displayError ? 'var(--error)' : 'var(--text-muted)'
        }}>
          {displayError || hint}
        </p>
      )}
    </div>
  )
}

// ============================================
// EMAIL TAG INPUT (Preset for emails)
// ============================================
interface EmailTagInputProps extends Omit<TagInputProps, 'validateTag' | 'transformTag'> {
  value: string[]
  onChange: (emails: string[]) => void
}

export function EmailTagInput(props: EmailTagInputProps) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return (
    <TagInput
      {...props}
      placeholder={props.placeholder || 'Ajouter un email...'}
      validateTag={(tag) => emailRegex.test(tag) ? true : 'Email invalide'}
      transformTag={(tag) => tag.toLowerCase().trim()}
    />
  )
}
