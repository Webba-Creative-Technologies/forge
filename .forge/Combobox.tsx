import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronDown16Regular, Search16Regular, Dismiss12Regular, Checkmark16Regular } from '@fluentui/react-icons'
import { Z_INDEX } from '../constants'

// ============================================
// TYPES
// ============================================
export interface ComboboxOption {
  value: string
  label: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
  group?: string
}

// ============================================
// COMBOBOX (Searchable select / Autocomplete)
// ============================================
interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  label?: string
  emptyMessage?: string
  disabled?: boolean
  clearable?: boolean
  creatable?: boolean
  onCreate?: (value: string) => void
  renderOption?: (option: ComboboxOption, isSelected: boolean) => ReactNode
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  label,
  emptyMessage = 'No results',
  disabled = false,
  clearable = false,
  creatable = false,
  onCreate,
  renderOption
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  // Filter options
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Group options
  const groupedOptions = filteredOptions.reduce((acc, opt) => {
    const group = opt.group || ''
    if (!acc[group]) acc[group] = []
    acc[group].push(opt)
    return acc
  }, {} as Record<string, ComboboxOption[]>)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setHighlightedIndex(0)
    }
  }, [open])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        setSearch('')
        break
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex])
        } else if (creatable && search.trim()) {
          onCreate?.(search.trim())
          setOpen(false)
          setSearch('')
        }
        break
    }
  }

  const selectOption = (option: ComboboxOption) => {
    if (option.disabled) return
    onChange?.(option.value)
    setOpen(false)
    setSearch('')
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem'
        }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          height: 36,
          padding: '0 0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: open ? '0 0 0 3px rgba(163, 91, 255, 0.15)' : 'none',
          textAlign: 'left'
        }}
      >
        {selectedOption?.icon && (
          <span style={{ display: 'flex', color: 'var(--text-muted)' }}>
            {selectedOption.icon}
          </span>
        )}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.label || placeholder}
        </span>
        {clearable && selectedOption && (
          <button
            onClick={clearSelection}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--bg-secondary)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Dismiss12Regular />
          </button>
        )}
        <ChevronDown16Regular style={{
          color: 'var(--text-muted)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="animate-scaleIn"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
            zIndex: Z_INDEX.dropdown,
            overflow: 'hidden'
          }}
        >
          {/* Search input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 0.875rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <Search16Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setHighlightedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Options list */}
          <div style={{
            maxHeight: 280,
            overflowY: 'auto',
            padding: 6
          }}>
            {Object.entries(groupedOptions).map(([group, opts]) => (
              <div key={group}>
                {group && (
                  <div style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.5rem 0.625rem 0.375rem'
                  }}>
                    {group}
                  </div>
                )}
                {opts.map((option, idx) => {
                  const isSelected = option.value === value
                  const isHighlighted = filteredOptions.indexOf(option) === highlightedIndex
                  const flatIndex = filteredOptions.indexOf(option)

                  return (
                    <button
                      key={option.value}
                      onClick={() => selectOption(option)}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                      disabled={option.disabled}
                      className="animate-fadeIn"
                      style={{
                        animationDelay: `${idx * 20}ms`,
                        animationFillMode: 'backwards',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 0.625rem',
                        backgroundColor: isHighlighted ? 'var(--bg-tertiary)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: option.disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                        fontSize: '0.875rem',
                        cursor: option.disabled ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        opacity: option.disabled ? 0.5 : 1
                      }}
                    >
                      {renderOption ? (
                        renderOption(option, isSelected)
                      ) : (
                        <>
                          {option.icon && (
                            <span style={{ display: 'flex', color: 'var(--text-muted)' }}>
                              {option.icon}
                            </span>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {option.label}
                            </div>
                            {option.description && (
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {option.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <Checkmark16Regular style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                          )}
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}

            {/* Empty state */}
            {filteredOptions.length === 0 && (
              <div style={{
                padding: '1.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
              }}>
                {creatable && search.trim() ? (
                  <button
                    onClick={() => {
                      onCreate?.(search.trim())
                      setOpen(false)
                      setSearch('')
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--brand-primary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Créer "{search.trim()}"
                  </button>
                ) : (
                  emptyMessage
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MULTI COMBOBOX (Multiple selection)
// ============================================
interface MultiComboboxProps {
  options: ComboboxOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  label?: string
  emptyMessage?: string
  disabled?: boolean
  maxSelections?: number
}

export function MultiCombobox({
  options,
  value = [],
  onChange,
  placeholder = 'Select...',
  label,
  emptyMessage = 'No results',
  disabled = false,
  maxSelections
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOptions = options.filter(opt => value.includes(opt.value))

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) &&
    !value.includes(opt.value)
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange?.(value.filter(v => v !== optionValue))
    } else if (!maxSelections || value.length < maxSelections) {
      onChange?.([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(value.filter(v => v !== optionValue))
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem'
        }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(true)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.375rem',
          minHeight: 36,
          padding: '0.25rem 0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.5 : 1,
          transition: 'border-color 0.15s ease',
          boxShadow: open ? '0 0 0 3px rgba(163, 91, 255, 0.15)' : 'none'
        }}
      >
        {/* Selected tags */}
        {selectedOptions.map(opt => (
          <span
            key={opt.value}
            className="animate-scaleIn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)'
            }}
          >
            {opt.label}
            <button
              onClick={(e) => removeOption(opt.value, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 14,
                height: 14,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <Dismiss12Regular style={{ fontSize: 10 }} />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          disabled={disabled}
          style={{
            flex: 1,
            minWidth: 60,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            padding: '0.25rem'
          }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="animate-scaleIn"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
            zIndex: Z_INDEX.dropdown,
            maxHeight: 280,
            overflowY: 'auto',
            padding: 6
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className="animate-fadeIn interactive-row"
                style={{
                  animationDelay: `${index * 20}ms`,
                  animationFillMode: 'backwards',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  width: '100%',
                  padding: '0.5rem 0.625rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {option.icon && (
                  <span style={{ display: 'flex', color: 'var(--text-muted)' }}>
                    {option.icon}
                  </span>
                )}
                <span style={{ flex: 1 }}>{option.label}</span>
              </button>
            ))
          ) : (
            <div style={{
              padding: '1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
