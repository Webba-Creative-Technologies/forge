import { useState, useRef, useEffect, ReactNode } from 'react'
import {
  ChevronRight16Regular,
  ChevronDown16Regular,
  Dismiss16Regular,
  Search20Regular,
  Checkmark16Regular
} from '@fluentui/react-icons'
import { IconButton } from './Button'
import { Z_INDEX } from '../constants'

// ============================================
// TYPES
// ============================================
export interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
  disabled?: boolean
  icon?: ReactNode
}

// ============================================
// CASCADER
// ============================================
interface CascaderProps {
  options: CascaderOption[]
  value?: string[]
  onChange?: (value: string[], labels: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  clearable?: boolean
  searchable?: boolean
  expandTrigger?: 'click' | 'hover'
  displayFormat?: 'path' | 'label' // "Region / City" or just "City"
  className?: string
  style?: React.CSSProperties
}

export function Cascader({
  options,
  value = [],
  onChange,
  placeholder = 'Sélectionner...',
  label,
  error,
  disabled,
  clearable = true,
  searchable = false,
  expandTrigger = 'click',
  displayFormat = 'path',
  className,
  style
}: CascaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState<CascaderOption[][]>([options])
  const [selectedPath, setSelectedPath] = useState<CascaderOption[]>([])
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync selected path from value
  useEffect(() => {
    if (value.length > 0) {
      const path = findPath(options, value)
      setSelectedPath(path)
    }
  }, [value, options])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        resetActivePath()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const resetActivePath = () => {
    setActivePath([options])
    setSearch('')
  }

  const findPath = (opts: CascaderOption[], values: string[]): CascaderOption[] => {
    const path: CascaderOption[] = []
    let current = opts

    for (const val of values) {
      const found = current.find(o => o.value === val)
      if (found) {
        path.push(found)
        current = found.children || []
      } else break
    }

    return path
  }

  const handleOptionClick = (option: CascaderOption, level: number) => {
    if (option.disabled) return

    const newPath = [...selectedPath.slice(0, level), option]

    if (option.children && option.children.length > 0) {
      // Has children - expand next level
      const newActivePath = [...activePath.slice(0, level + 1), option.children]
      setActivePath(newActivePath)

      if (expandTrigger === 'click') {
        setSelectedPath(newPath)
      }
    } else {
      // Leaf node - select and close
      setSelectedPath(newPath)
      const values = newPath.map(o => o.value)
      const labels = newPath.map(o => o.label)
      onChange?.(values, labels)
      setIsOpen(false)
      resetActivePath()
    }
  }

  const handleOptionHover = (option: CascaderOption, level: number) => {
    if (expandTrigger !== 'hover' || option.disabled || !option.children) return

    const newActivePath = [...activePath.slice(0, level + 1), option.children]
    setActivePath(newActivePath)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPath([])
    onChange?.([], [])
    resetActivePath()
  }

  const getDisplayValue = (): string => {
    if (selectedPath.length === 0) return ''

    if (displayFormat === 'label') {
      return selectedPath[selectedPath.length - 1].label
    }

    return selectedPath.map(o => o.label).join(' / ')
  }

  // Search filter
  const flattenOptions = (opts: CascaderOption[], parentPath: CascaderOption[] = []): Array<{ path: CascaderOption[], option: CascaderOption }> => {
    const result: Array<{ path: CascaderOption[], option: CascaderOption }> = []

    for (const opt of opts) {
      const currentPath = [...parentPath, opt]
      if (!opt.children || opt.children.length === 0) {
        result.push({ path: currentPath, option: opt })
      }
      if (opt.children) {
        result.push(...flattenOptions(opt.children, currentPath))
      }
    }

    return result
  }

  const filteredOptions = search
    ? flattenOptions(options).filter(({ path }) =>
        path.some(o => o.label.toLowerCase().includes(search.toLowerCase()))
      )
    : []

  const handleSearchSelect = (path: CascaderOption[]) => {
    setSelectedPath(path)
    const values = path.map(o => o.value)
    const labels = path.map(o => o.label)
    onChange?.(values, labels)
    setIsOpen(false)
    resetActivePath()
  }

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          marginBottom: 6,
          color: 'var(--text-primary)'
        }}>
          {label}
        </label>
      )}

      {/* Input */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          height: 42,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'var(--bg-primary)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          color: selectedPath.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          textAlign: 'left',
          transition: 'border-color 0.15s ease'
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getDisplayValue() || placeholder}
        </span>

        {clearable && selectedPath.length > 0 ? (
          <IconButton
            icon={<Dismiss16Regular />}
            size="xs"
            onClick={handleClear}
          />
        ) : (
          <ChevronDown16Regular style={{
            color: 'var(--text-muted)',
            transition: 'transform 0.15s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
          }} />
        )}
      </button>

      {error && (
        <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          zIndex: Z_INDEX.dropdown,
          animation: 'fadeIn 0.15s ease',
          overflow: 'hidden',
          minWidth: '100%'
        }}>
          {/* Search */}
          {searchable && (
            <div style={{ padding: 8, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Search20Regular style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* Search results */}
          {search && filteredOptions.length > 0 && (
            <div style={{ maxHeight: 300, overflowY: 'auto', padding: 8 }}>
              {filteredOptions.map(({ path }, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSelect(path)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {path.map(o => o.label).join(' / ')}
                </button>
              ))}
            </div>
          )}

          {/* Cascading panels */}
          {!search && (
            <div style={{ display: 'flex' }}>
              {activePath.map((levelOptions, level) => (
                <div
                  key={level}
                  style={{
                    minWidth: 180,
                    maxHeight: 300,
                    overflowY: 'auto',
                    borderRight: level < activePath.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  {levelOptions.map((option) => {
                    const isSelected = selectedPath[level]?.value === option.value
                    const isActive = activePath[level + 1] && selectedPath[level]?.value === option.value

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleOptionClick(option, level)}
                        onMouseEnter={(e) => {
                          handleOptionHover(option, level)
                          if (!option.disabled) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
                        }}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive ? 'var(--bg-hover)' : 'transparent'}
                        disabled={option.disabled}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                          border: 'none',
                          cursor: option.disabled ? 'not-allowed' : 'pointer',
                          opacity: option.disabled ? 0.5 : 1,
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 500 : 400
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {option.icon}
                          {option.label}
                        </span>

                        {isSelected && !option.children && (
                          <Checkmark16Regular style={{ color: 'var(--brand-primary)' }} />
                        )}

                        {option.children && option.children.length > 0 && (
                          <ChevronRight16Regular style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Empty search */}
          {search && filteredOptions.length === 0 && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              No results
            </div>
          )}
        </div>
      )}
    </div>
  )
}
