import { useState, useMemo, ReactNode } from 'react'
import {
  ChevronUp16Regular,
  ChevronDown16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  Table20Regular,
  ArrowSort16Regular,
  Search20Regular,
  Filter20Regular,
  Dismiss16Regular,
  MoreHorizontal20Regular
} from '@fluentui/react-icons'
import { Button, IconButton } from './Button'
import { Checkbox } from './Input'
import { Dropdown, SelectDropdown, DropdownItem } from './Dropdown'
import { useIsMobile } from '../hooks/useResponsive'
import { SHADOWS } from '../constants'
import { useForge } from './ForgeProvider'

// ============================================
// TABLE TYPES
// ============================================
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  width?: string | number
  sortable?: boolean
  render?: (value: any, row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  filterable?: boolean
}

export interface TableFilter {
  key: string
  label: string
  options: Array<{ value: string; label: string }>
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  keyField?: keyof T
  // Header
  title?: string
  subtitle?: string
  // Search
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  // Filters
  filters?: TableFilter[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string | null) => void
  // Selection
  selectable?: boolean
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  // Sorting
  sortable?: boolean
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  // Pagination
  pagination?: boolean
  pageSize?: number
  // Actions
  onRowClick?: (row: T) => void
  rowActions?: (row: T) => DropdownItem[]
  globalActions?: ReactNode
  bulkActions?: (selectedKeys: string[]) => ReactNode
  // States
  loading?: boolean
  // Styling
  striped?: boolean
  compact?: boolean
  stickyHeader?: boolean
  noPadding?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
}

// ============================================
// SKELETON ROW
// ============================================
function SkeletonRow({ columns, compact }: { columns: number; compact: boolean }) {
  const cellPadding = compact ? '0.5rem 0.75rem' : '0.875rem 1rem'

  return (
    <tr>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} style={{ padding: cellPadding }}>
          <div
            style={{
              height: 16,
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-xs)',
              width: idx === 0 ? '60%' : idx === columns - 1 ? '40%' : '80%',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </td>
      ))}
    </tr>
  )
}

// ============================================
// FILTER CHIP
// ============================================
interface FilterChipProps {
  label: string
  value: string
  onClear: () => void
}

function FilterChip({ label, value, onClear }: FilterChipProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.5rem 0.25rem 0.75rem',
        backgroundColor: 'rgba(163, 91, 255, 0.15)',
        borderRadius: 16,
        fontSize: '0.75rem',
        color: 'var(--brand-primary)'
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
      <button
        onClick={onClear}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--brand-primary)',
          cursor: 'pointer',
          padding: 0
        }}
        className="interactive-icon"
      >
        <Dismiss16Regular style={{ fontSize: 12 }} />
      </button>
    </div>
  )
}

// ============================================
// TABLE COMPONENT
// ============================================
export function Table<T extends Record<string, any>>({
  data,
  columns,
  keyField = 'id' as keyof T,
  // Header
  title,
  subtitle,
  // Search
  searchable = true,
  searchPlaceholder = 'Search...',
  searchKeys,
  // Filters
  filters,
  activeFilters = {},
  onFilterChange,
  // Selection
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  // Sorting
  sortable = true,
  defaultSort,
  // Pagination
  pagination = true,
  pageSize = 10,
  // Actions
  onRowClick,
  rowActions,
  globalActions,
  // States
  loading = false,
  // Styling
  striped = false,
  compact = false,
  stickyHeader = true,
  noPadding = false,
  emptyMessage = 'No data',
  emptyIcon
}: TableProps<T>) {
  const { shadows } = useForge()
  const isMobile = useIsMobile()
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(defaultSort || null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Search filtering
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const query = searchQuery.toLowerCase()
    const keys = searchKeys || columns.map(c => c.key as keyof T)

    return data.filter(row =>
      keys.some(key => {
        const value = row[key]
        return value && String(value).toLowerCase().includes(query)
      })
    )
  }, [data, searchQuery, searchKeys, columns])

  // Filter application
  const filteredData = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return searchedData

    return searchedData.filter(row =>
      Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true
        return String(row[key]) === value
      })
    )
  }, [searchedData, activeFilters])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sort) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]
      if (aVal === bVal) return 0
      const comparison = aVal < bVal ? -1 : 1
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sort])

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, pagination, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Selection
  const allSelected = filteredData.length > 0 && selectedKeys.length === filteredData.length
  const someSelected = selectedKeys.length > 0 && selectedKeys.length < filteredData.length
  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(filteredData.map(row => String(row[keyField])))
    }
  }

  const toggleRow = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter(k => k !== key))
    } else {
      onSelectionChange?.([...selectedKeys, key])
    }
  }

  const handleSort = (key: string) => {
    if (!sortable) return
    if (sort?.key === key) {
      setSort(sort.direction === 'asc' ? { key, direction: 'desc' } : null)
    } else {
      setSort({ key, direction: 'asc' })
    }
  }

  const cellPadding = compact ? '0.5rem 0.75rem' : '0.875rem 1rem'
  const totalColumns = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)
  const hasActiveFilters = Object.values(activeFilters).some(v => v)
  const hasHeader = title || subtitle || searchable || filters || globalActions

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: shadows ? SHADOWS.elevation.card : undefined,
      overflow: 'hidden'
    }}>
      {/* Header */}
      {hasHeader && (
        <div style={{
          padding: noPadding ? 0 : '1rem 1.25rem'
        }}>
          {/* Title row */}
          {(title || subtitle) && (
            <div style={{
              marginBottom: (searchable || filters || globalActions) ? '1rem' : 0
            }}>
              {title && (
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  margin: title ? '0.25rem 0 0' : 0
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Search, filters and actions row */}
          {(searchable || filters || globalActions) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              {/* Search */}
              {searchable && (
                <div style={{
                  position: 'relative',
                  flex: '1 1 240px',
                  maxWidth: 320
                }}>
                  <Search20Regular style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder={searchPlaceholder}
                    style={{
                      width: '100%',
                      height: 38,
                      paddingLeft: '2.5rem',
                      paddingRight: searchQuery ? '2.25rem' : '0.75rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex'
                      }}
                    >
                      <Dismiss16Regular />
                    </button>
                  )}
                </div>
              )}

              {/* Filter button */}
              {filters && filters.length > 0 && (
                <Button
                  variant={hasActiveFilters ? 'primary' : 'ghost'}
                  size="sm"
                  icon={<Filter20Regular />}
                  onClick={() => setShowFilters(!showFilters)}
                  style={{ flexShrink: 0 }}
                >
                  Filtres {hasActiveFilters && `(${Object.values(activeFilters).filter(Boolean).length})`}
                </Button>
              )}

              {/* Global actions */}
              {globalActions && (
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: 'auto' }}>
                  {globalActions}
                </div>
              )}
            </div>
          )}

          {/* Filters panel */}
          {showFilters && filters && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 8
            }}>
              {filters.map(filter => (
                <div key={filter.key} style={{ minWidth: 180 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.375rem'
                  }}>
                    {filter.label}
                  </label>
                  <SelectDropdown
                    value={activeFilters[filter.key] || ''}
                    options={[
                      { value: '', label: 'Tous' },
                      ...filter.options
                    ]}
                    onChange={(value) => {
                      onFilterChange?.(filter.key, value || null)
                      setCurrentPage(1)
                    }}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Active filters chips */}
          {hasActiveFilters && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.75rem'
            }}>
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value) return null
                const filter = filters?.find(f => f.key === key)
                const option = filter?.options.find(o => o.value === value)
                return (
                  <FilterChip
                    key={key}
                    label={filter?.label || key}
                    value={option?.label || value}
                    onClear={() => onFilterChange?.(key, null)}
                  />
                )
              })}
              <button
                onClick={() => {
                  Object.keys(activeFilters).forEach(key => onFilterChange?.(key, null))
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem'
                }}
                className="interactive-row"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto', paddingLeft: noPadding ? 0 : '1.25rem', paddingTop: noPadding ? 0 : (!hasHeader ? '1rem' : 0), paddingBottom: noPadding ? 0 : (!pagination ? '1rem' : 0) }}>
        <div style={{ display: 'inline-block', minWidth: '100%', paddingRight: noPadding ? 0 : '1.25rem', boxSizing: 'border-box' }}>
          {/* Divider after header */}
          {hasHeader && (
            <div style={{
              height: 1,
              backgroundColor: 'var(--border-color)'
            }} />
          )}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: compact ? '0.8125rem' : '0.875rem'
          }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--bg-tertiary)',
              position: stickyHeader ? 'sticky' : undefined,
              top: 0,
              zIndex: 1
            }}>
              {selectable && (
                <th style={{
                  padding: cellPadding,
                  width: 56,
                  textAlign: 'center',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    size="md"
                  />
                </th>
              )}
              {columns.map(col => {
                const isSorted = sort?.key === String(col.key)
                const canSort = col.sortable !== false && sortable

                return (
                  <th
                    key={String(col.key)}
                    onClick={() => canSort && handleSort(String(col.key))}
                    style={{
                      padding: cellPadding,
                      textAlign: col.align || 'left',
                      fontWeight: 600,
                      color: isSorted ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontSize: '0.6875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: canSort ? 'pointer' : 'default',
                      width: col.width,
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'color 0.15s ease'
                    }}
                    className={canSort ? 'interactive-row' : undefined}
                  >
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'
                    }}>
                      {col.header}
                      {isSorted ? (
                        sort.direction === 'asc' ? <ChevronUp16Regular /> : <ChevronDown16Regular />
                      ) : canSort ? (
                        <ArrowSort16Regular style={{ opacity: 0.3 }} />
                      ) : null}
                    </span>
                  </th>
                )
              })}
              {rowActions && (
                <th style={{
                  padding: cellPadding,
                  width: 60,
                  borderBottom: '1px solid var(--border-color)'
                }} />
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonRow key={idx} columns={totalColumns} compact={compact} />
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      color: 'var(--text-muted)',
                      opacity: 0.4
                    }}>
                      {emptyIcon || <Table20Regular style={{ fontSize: 40 }} />}
                    </div>
                    <span style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem'
                    }}>
                      {searchQuery ? `No results for "${searchQuery}"` : emptyMessage}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const key = String(row[keyField])
                const isSelected = selectedKeys.includes(key)
                const isHovered = hoveredRow === key

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    onMouseEnter={() => setHoveredRow(key)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      backgroundColor: isSelected
                        ? 'rgba(163, 91, 255, 0.08)'
                        : isHovered
                          ? 'var(--bg-tertiary)'
                          : striped && idx % 2 === 1
                            ? 'rgba(255, 255, 255, 0.02)'
                            : 'transparent',
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {selectable && (
                      <td
                        style={{
                          padding: cellPadding,
                          textAlign: 'center',
                          borderBottom: '1px solid var(--border-subtle)'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          size="md"
                        />
                      </td>
                    )}
                    {columns.map(col => {
                      const value = row[col.key as keyof T]
                      return (
                        <td
                          key={String(col.key)}
                          style={{
                            padding: cellPadding,
                            textAlign: col.align || 'left',
                            color: 'var(--text-primary)',
                            borderBottom: '1px solid var(--border-subtle)'
                          }}
                        >
                          {col.render ? col.render(value, row, idx) : String(value ?? '')}
                        </td>
                      )
                    })}
                    {rowActions && (
                      <td
                        style={{
                          padding: cellPadding,
                          textAlign: 'center',
                          borderBottom: '1px solid var(--border-subtle)'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 0.15s ease'
                        }}>
                          <Dropdown
                            trigger={
                              <IconButton
                                icon={<MoreHorizontal20Regular />}
                                size="sm"
                              />
                            }
                            items={rowActions(row)}
                            align="right"
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Footer with pagination */}
      {pagination && !loading && filteredData.length > 0 && (
        <div style={{ padding: noPadding ? 0 : '0 1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: noPadding ? '0.75rem 0' : (isMobile ? '0.75rem 0' : '0.75rem 0'),
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
          <span style={{
            fontSize: isMobile ? '0.75rem' : '0.8125rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredData.length)}
            </span>
            {' '}sur{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {filteredData.length}
            </span>
            {!isMobile && filteredData.length !== data.length && (
              <span style={{ color: 'var(--text-muted)' }}>
                {' '}(filtré de {data.length})
              </span>
            )}
          </span>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <IconButton
                icon={<ChevronLeft16Regular />}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                size="sm"
              />

              {!isMobile && (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    const isActive = currentPage === page

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={isActive ? undefined : 'interactive-row'}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.8125rem',
                          fontWeight: isActive ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
              )}

              {isMobile && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
                  {currentPage}/{totalPages}
                </span>
              )}

              <IconButton
                icon={<ChevronRight16Regular />}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                size="sm"
              />
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// SIMPLE TABLE (for basic static tables)
// ============================================
interface SimpleTableProps {
  headers: string[]
  rows: ReactNode[][]
  compact?: boolean
}

export function SimpleTable({ headers, rows, compact = false }: SimpleTableProps) {
  const { shadows } = useForge()
  const cellPadding = compact ? '0.5rem 0.75rem' : '0.875rem 1rem'

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: shadows ? SHADOWS.elevation.card : undefined,
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: compact ? '0.8125rem' : '0.875rem'
      }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            {headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  padding: cellPadding,
                  textAlign: 'left',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => {
            const [hovered, setHovered] = useState(false)

            return (
              <tr
                key={rowIdx}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  backgroundColor: hovered ? 'var(--bg-tertiary)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    style={{
                      padding: cellPadding,
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}
