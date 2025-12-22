import { useState, useEffect, useRef, useLayoutEffect, ReactNode } from 'react'
import { ChevronRight12Regular } from '@fluentui/react-icons'

// ============================================
// TYPES
// ============================================
export interface TOCItem {
  id: string
  title: string
  level?: number // 1, 2, 3 for h1, h2, h3
  children?: TOCItem[]
}

// ============================================
// TABLE OF CONTENTS
// ============================================
interface TableOfContentsProps {
  items: TOCItem[]
  activeId?: string
  onItemClick?: (id: string) => void
  title?: string
  collapsible?: boolean
  sticky?: boolean
  maxHeight?: number | string
  variant?: 'default' | 'minimal' | 'bordered'
  autoTrack?: boolean // Auto-track scroll position
  scrollOffset?: number // Offset for scroll tracking (default: 100)
}

// Helper to flatten nested items
function flattenItems(items: TOCItem[]): TOCItem[] {
  const result: TOCItem[] = []
  for (const item of items) {
    result.push(item)
    if (item.children) {
      result.push(...flattenItems(item.children))
    }
  }
  return result
}

export function TableOfContents({
  items,
  activeId: controlledActiveId,
  onItemClick,
  title = 'Sur cette page',
  collapsible = false,
  sticky = false,
  maxHeight,
  variant = 'default',
  autoTrack = true,
  scrollOffset = 100
}: TableOfContentsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [hasAnimated, setHasAnimated] = useState(false)
  const [trackedActiveId, setTrackedActiveId] = useState<string | null>(null)

  // Use controlled activeId if provided, otherwise use tracked
  const activeId = controlledActiveId ?? trackedActiveId

  // Sliding indicator
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Auto-track scroll position
  useEffect(() => {
    if (!autoTrack || controlledActiveId !== undefined) return

    const flatItems = flattenItems(items)

    const handleScroll = () => {
      let currentId: string | null = null

      for (const item of flatItems) {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= scrollOffset) {
            currentId = item.id
          }
        }
      }

      setTrackedActiveId(currentId)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items, autoTrack, controlledActiveId, scrollOffset])

  // Update indicator position when activeId changes
  useLayoutEffect(() => {
    if (!activeId || variant === 'bordered') {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }

    const updateIndicator = () => {
      const activeButton = buttonRefs.current.get(activeId)
      if (!activeButton || !containerRef.current) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }

      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        top: buttonRect.top - containerRect.top,
        height: buttonRect.height,
        opacity: 1
      })
    }

    const timer = setTimeout(updateIndicator, 10)
    return () => clearTimeout(timer)
  }, [activeId, variant, expandedIds])

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleClick = (item: TOCItem) => {
    if (item.children && collapsible) {
      toggleExpand(item.id)
    }

    // Smooth scroll to element
    const element = document.getElementById(item.id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    onItemClick?.(item.id)
  }

  const renderItems = (items: TOCItem[], depth = 0): ReactNode => {
    return items.map((item, index) => {
      const isActive = activeId === item.id
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedIds.has(item.id) || !collapsible
      const level = item.level || 1
      const indent = (level - 1) * 12 + depth * 12

      return (
        <div
          key={item.id}
          style={{
            opacity: hasAnimated ? 1 : 0,
            transform: hasAnimated ? 'translateX(0)' : 'translateX(-8px)',
            transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`
          }}
        >
          <button
            ref={el => { if (el) buttonRefs.current.set(item.id, el) }}
            onClick={() => handleClick(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.5rem 0.75rem',
              paddingLeft: `${0.75 + indent / 16}rem`,
              backgroundColor: variant === 'bordered' && isActive ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              borderLeft: variant === 'bordered'
                ? `2px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`
                : 'none',
              borderRadius: variant === 'bordered' ? 0 : 6,
              color: isActive ? '#BF8DFF' : 'var(--text-secondary)',
              fontSize: level === 1 ? '0.8125rem' : '0.75rem',
              fontWeight: isActive ? 500 : 400,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
              position: 'relative',
              zIndex: 1
            }}
            className={isActive ? undefined : 'interactive-nav'}
          >
            {hasChildren && collapsible && (
              <ChevronRight12Regular
                style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0
                }}
              />
            )}
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.title}
            </span>
          </button>

          {hasChildren && isExpanded && (
            <div style={{
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease'
            }}>
              {renderItems(item.children!, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <nav
      className="animate-fadeIn"
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? '1.5rem' : undefined,
        backgroundColor: variant === 'default' ? 'var(--bg-secondary)' : 'transparent',
        borderRadius: variant === 'default' ? 'var(--radius-lg)' : 0,
        padding: variant === 'default' ? '1rem' : variant === 'bordered' ? '0' : '1rem 1.5rem',
        maxHeight: maxHeight,
        overflowY: maxHeight ? 'auto' : undefined,
        minWidth: 180
      }}
    >
      {title && variant !== 'minimal' && (
        <h4 style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: '0 0 0.75rem',
          padding: variant === 'bordered' ? '0 0.75rem' : '0'
        }}>
          {title}
        </h4>
      )}

      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'relative' }}>
        {/* Sliding indicator */}
        {variant !== 'bordered' && (
          <div
            style={{
              position: 'absolute',
              top: indicatorStyle.top,
              left: 0,
              right: 0,
              height: indicatorStyle.height,
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              transition: 'top 0.25s ease, height 0.25s ease, opacity 0.15s ease',
              opacity: indicatorStyle.opacity,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
        )}
        {renderItems(items)}
      </div>
    </nav>
  )
}

// ============================================
// MINI TOC (inline version)
// ============================================
interface MiniTOCProps {
  items: { id: string; title: string }[]
  activeId?: string
  onItemClick?: (id: string) => void
}

export function MiniTOC({ items, activeId, onItemClick }: MiniTOCProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  useLayoutEffect(() => {
    if (!activeId) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }

    const updateIndicator = () => {
      const activeButton = buttonRefs.current.get(activeId)
      if (!activeButton || !containerRef.current) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }

      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        opacity: 1
      })
    }

    const timer = setTimeout(updateIndicator, 10)
    return () => clearTimeout(timer)
  }, [activeId])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        position: 'relative'
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: 'absolute',
          left: indicatorStyle.left,
          top: 0,
          width: indicatorStyle.width,
          height: '100%',
          backgroundColor: 'var(--brand-primary)',
          borderRadius: 'var(--radius-sm)',
          transition: 'left 0.25s ease, width 0.25s ease, opacity 0.15s ease',
          opacity: indicatorStyle.opacity,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      {items.map((item, index) => {
        const isActive = activeId === item.id
        return (
          <button
            key={item.id}
            ref={el => { if (el) buttonRefs.current.set(item.id, el) }}
            onClick={() => onItemClick?.(item.id)}
            className="animate-scaleIn"
            style={{
              animationDelay: `${index * 30}ms`,
              animationFillMode: 'backwards',
              padding: '0.375rem 0.75rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'white' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.15s ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            {item.title}
          </button>
        )
      })}
    </div>
  )
}
