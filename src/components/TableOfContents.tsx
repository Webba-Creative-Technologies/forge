import { useState, useEffect, useRef, useLayoutEffect, useCallback, ReactNode } from 'react'
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
// useScrollSpy — shared hook for tracking active heading on scroll
// ============================================
// Handles:
//   - Top-of-page fallback (first heading stays active until scrolled past it)
//   - Bottom-of-page detection (last heading active when scrolled to end)
//   - Click-lock window to avoid jitter during smooth-scroll triggered by a click
//   - RAF-throttled scroll handler for performance
//   - DOM order sort (items array doesn't need to match document order)
function useScrollSpy(
  ids: string[],
  options: { offset?: number; enabled?: boolean } = {}
): { activeId: string | null; lock: (id: string, durationMs?: number) => void } {
  const { offset = 100, enabled = true } = options
  const [activeId, setActiveId] = useState<string | null>(null)
  const lockUntilRef = useRef<number>(0)

  const lock = useCallback((id: string, durationMs = 700) => {
    lockUntilRef.current = Date.now() + durationMs
    setActiveId(id)
  }, [])

  // Re-create effect when the set of ids changes (by value, not reference)
  const idsKey = ids.join('|')

  useEffect(() => {
    if (!enabled || ids.length === 0) return

    let rafId: number | null = null

    const compute = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null

        // Skip during click-initiated scroll
        if (Date.now() < lockUntilRef.current) return

        const elements = ids
          .map(id => document.getElementById(id))
          .filter((el): el is HTMLElement => el !== null)

        if (elements.length === 0) {
          setActiveId(null)
          return
        }

        // Sort by actual position in the document — items array order is not reliable
        const sorted = elements
          .map(el => ({ el, top: el.getBoundingClientRect().top }))
          .sort((a, b) => a.top - b.top)

        const scrollY = window.scrollY
        const viewportHeight = window.innerHeight
        const pageHeight = document.documentElement.scrollHeight
        const hasScrolled = scrollY > 1
        const isAtBottom = hasScrolled && scrollY + viewportHeight >= pageHeight - 2

        // Bottom of page: force last heading active (handles short pages where later
        // headings can never cross the offset line)
        if (isAtBottom) {
          setActiveId(sorted[sorted.length - 1].el.id)
          return
        }

        // Find the last heading whose top has crossed the offset line
        let currentId: string | null = null
        for (const { el, top } of sorted) {
          if (top <= offset) {
            currentId = el.id
          } else {
            break
          }
        }

        // Fallback: nothing crossed yet → highlight first heading so there's always a hint
        if (currentId === null) {
          currentId = sorted[0].el.id
        }

        setActiveId(currentId)
      })
    }

    compute()
    // Retry after initial paint in case headings aren't yet in the DOM (lazy content)
    const retryTimer = window.setTimeout(compute, 120)

    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute, { passive: true })

    return () => {
      window.clearTimeout(retryTimer)
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, offset, enabled])

  return { activeId, lock }
}

// ============================================
// TABLE OF CONTENTS
// ============================================
interface TableOfContentsProps {
  items: TOCItem[]
  value?: string
  onItemClick?: (id: string) => void
  title?: string
  collapsible?: boolean
  sticky?: boolean
  maxHeight?: number | string
  variant?: 'default' | 'minimal' | 'bordered'
  autoTrack?: boolean
  scrollOffset?: number
  smooth?: boolean
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

// Find the first scrollable ancestor (overflow auto/scroll with actual overflow),
// stopping before body/documentElement so we never scroll the window.
function findScrollableAncestor(el: HTMLElement): HTMLElement | null {
  let parent: HTMLElement | null = el.parentElement
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = getComputedStyle(parent)
    const overflowY = style.overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      return parent
    }
    parent = parent.parentElement
  }
  return null
}

export function TableOfContents({
  items,
  value: controlledActiveId,
  onItemClick,
  title = 'On this page',
  collapsible = false,
  sticky = false,
  maxHeight,
  variant = 'default',
  autoTrack = true,
  scrollOffset = 100,
  smooth = true
}: TableOfContentsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [hasAnimated, setHasAnimated] = useState(false)

  // Scroll spy — only engaged when uncontrolled and autoTrack is on
  const flatIds = flattenItems(items).map(i => i.id)
  const { activeId: trackedActiveId, lock: lockActive } = useScrollSpy(flatIds, {
    offset: scrollOffset,
    enabled: autoTrack && controlledActiveId === undefined
  })

  // Use controlled activeId if provided, otherwise use tracked
  const activeId = controlledActiveId ?? trackedActiveId

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const updateIndicator = () => {
    if (!activeId || variant === 'bordered') {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }
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

    // Auto-scroll the nearest scrollable ancestor (the nav itself if maxHeight is set,
    // or an outer container like an <aside> with overflow). We deliberately skip
    // body/documentElement to avoid fighting the user's page scroll.
    const scrollable = findScrollableAncestor(activeButton)
    if (scrollable) {
      const scrollRect = scrollable.getBoundingClientRect()
      const padding = 16
      if (buttonRect.top < scrollRect.top + padding) {
        scrollable.scrollTo({
          top: scrollable.scrollTop + (buttonRect.top - scrollRect.top) - padding,
          behavior: 'smooth'
        })
      } else if (buttonRect.bottom > scrollRect.bottom - padding) {
        scrollable.scrollTo({
          top: scrollable.scrollTop + (buttonRect.bottom - scrollRect.bottom) + padding,
          behavior: 'smooth'
        })
      }
    }
  }

  // Update indicator position when activeId changes
  useLayoutEffect(() => {
    const timer = setTimeout(updateIndicator, 10)
    return () => clearTimeout(timer)
  }, [activeId, variant, expandedIds])

  // Re-sync indicator on resize
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => updateIndicator())
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [activeId, variant])

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

    // Lock the tracked active id immediately so the indicator doesn't jitter through
    // intermediate headings during the smooth scroll animation
    lockActive(item.id)

    const element = document.getElementById(item.id)
    if (element) {
      element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
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
              color: isActive ? 'var(--active-color)' : 'var(--text-secondary)',
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
              lineHeight: 1.4
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
      aria-label={title || 'Table of contents'}
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
  value?: string
  onItemClick?: (id: string) => void
  /** Auto-track active heading based on scroll position. Default: true. */
  autoTrack?: boolean
  /** Distance from top of viewport (px) at which a heading is considered active. Default: 100. */
  scrollOffset?: number
  /** Use smooth scroll when clicking an item. Default: true. */
  smooth?: boolean
}

export function MiniTOC({
  items,
  value: controlledActiveId,
  onItemClick,
  autoTrack = true,
  scrollOffset = 100,
  smooth = true
}: MiniTOCProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  // Scroll spy (same semantics as TableOfContents)
  const ids = items.map(i => i.id)
  const { activeId: trackedActiveId, lock: lockActive } = useScrollSpy(ids, {
    offset: scrollOffset,
    enabled: autoTrack && controlledActiveId === undefined
  })

  const activeId = controlledActiveId ?? trackedActiveId

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

  // Re-sync indicator on resize (pills can wrap to a new line)
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      if (!activeId) return
      const activeButton = buttonRefs.current.get(activeId)
      if (!activeButton || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        opacity: 1
      })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [activeId])

  const handleClick = (id: string) => {
    lockActive(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    }
    onItemClick?.(id)
  }

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
            onClick={() => handleClick(item.id)}
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
