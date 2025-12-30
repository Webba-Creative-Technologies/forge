import { useState } from 'react'
import { ChevronLeft20Regular, ChevronRight20Regular, MoreHorizontal20Regular } from '@fluentui/react-icons'

// ============================================
// PAGINATION
// ============================================
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  size?: 'sm' | 'md'
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md'
}: PaginationProps) {
  const buttonSize = size === 'sm' ? 32 : 36
  const fontSize = size === 'sm' ? '0.75rem' : '0.8125rem'

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []

    // Always show first page
    if (showFirstLast) pages.push(1)

    // Calculate range around current page
    const leftSibling = Math.max(2, currentPage - siblingCount)
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount)

    // Add ellipsis after first page if needed
    if (leftSibling > 2) {
      pages.push('ellipsis')
    } else if (!showFirstLast) {
      pages.push(1)
    }

    // Add pages around current
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // Add ellipsis before last page if needed
    if (rightSibling < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (showFirstLast && totalPages > 1) {
      pages.push(totalPages)
    } else if (!showFirstLast && totalPages > 1 && rightSibling < totalPages) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const PageButton = ({ page, isActive }: { page: number; isActive: boolean }) => {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    return (
      <button
        onClick={() => onPageChange(page)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isActive ? 'var(--brand-primary)' : (hovered ? 'var(--bg-tertiary)' : 'transparent'),
          color: isActive ? 'white' : 'var(--text-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontSize,
          fontWeight: isActive ? 600 : 400,
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        {page}
      </button>
    )
  }

  const NavButton = ({ direction, disabled }: { direction: 'prev' | 'next'; disabled: boolean }) => {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    return (
      <button
        onClick={() => onPageChange(direction === 'prev' ? currentPage - 1 : currentPage + 1)}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          width: buttonSize,
          height: buttonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hovered && !disabled ? 'var(--bg-tertiary)' : 'transparent',
          color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        {direction === 'prev' ? <ChevronLeft20Regular /> : <ChevronRight20Regular />}
      </button>
    )
  }

  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}
    >
      <NavButton direction="prev" disabled={currentPage === 1} />

      {pageNumbers.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            style={{
              width: buttonSize,
              height: buttonSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <MoreHorizontal20Regular />
          </span>
        ) : (
          <PageButton key={page} page={page} isActive={page === currentPage} />
        )
      )}

      <NavButton direction="next" disabled={currentPage === totalPages} />
    </nav>
  )
}

// ============================================
// SIMPLE PAGINATION
// ============================================
interface SimplePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageInfo?: boolean
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true
}: SimplePaginationProps) {
  const [hoveredPrev, setHoveredPrev] = useState(false)
  const [pressedPrev, setPressedPrev] = useState(false)
  const [hoveredNext, setHoveredNext] = useState(false)
  const [pressedNext, setPressedNext] = useState(false)

  if (totalPages <= 1) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        onMouseEnter={() => setHoveredPrev(true)}
        onMouseLeave={() => { setHoveredPrev(false); setPressedPrev(false) }}
        onMouseDown={() => setPressedPrev(true)}
        onMouseUp={() => setPressedPrev(false)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: hoveredPrev && currentPage !== 1 ? 'var(--bg-tertiary)' : 'transparent',
          color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8125rem',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressedPrev && currentPage !== 1 ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        Previous
      </button>

      {showPageInfo && (
        <span style={{
          fontSize: '0.8125rem',
          color: 'var(--text-muted)'
        }}>
          Page {currentPage} of {totalPages}
        </span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        onMouseEnter={() => setHoveredNext(true)}
        onMouseLeave={() => { setHoveredNext(false); setPressedNext(false) }}
        onMouseDown={() => setPressedNext(true)}
        onMouseUp={() => setPressedNext(false)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: hoveredNext && currentPage !== totalPages ? 'var(--bg-tertiary)' : 'transparent',
          color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8125rem',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressedNext && currentPage !== totalPages ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        Next
      </button>
    </div>
  )
}

// ============================================
// TABLE PAGINATION
// ============================================
interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (count: number) => void
  itemsPerPageOptions?: number[]
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100]
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {onItemsPerPageChange && (
          <>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Afficher
            </span>
            <select
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              {itemsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </>
        )}
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {startItem}-{endItem} sur {totalItems}
        </span>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        size="sm"
      />
    </div>
  )
}
