import { ReactNode, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Dismiss20Regular, ChevronDown20Regular, Search20Regular, Navigation20Regular } from '@fluentui/react-icons'
import { useIsMobile } from '../hooks/useResponsive'
import { useNavigation } from '../hooks/useNavigation'
import { Z_INDEX } from '../constants'

// ============================================
// APP SIDEBAR (Navigation drawer like Webba CS)
// ============================================
export interface NavItem {
  id: string
  icon: ReactNode
  label: string
  badge?: number | string
  onClick?: () => void
  // Collapsible children
  children?: NavItem[]
  defaultOpen?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

interface AppSidebarProps {
  // Mode
  mode?: 'inline' | 'drawer'
  open?: boolean // Only used in drawer mode
  onClose?: () => void // Only used in drawer mode
  position?: 'left' | 'right' // Only used in drawer mode
  // Content
  logo?: ReactNode
  sections: NavSection[]
  activeId?: string
  onNavigate?: (id: string) => void
  // Header
  showHeader?: boolean // Show logo + search (default: true)
  showSearch?: boolean
  searchPlaceholder?: string
  searchShortcut?: string
  onSearchClick?: () => void
  // Footer
  footerContent?: ReactNode
  bottomItems?: NavItem[]
  // Styling
  width?: number
  height?: string // Custom height (default: '100dvh')
  accentColor?: string
  rounded?: boolean // Only used in drawer mode
  // Force desktop mode (for previews/demos)
  forceDesktop?: boolean
}

export function AppSidebar({
  mode = 'inline',
  open = true,
  onClose,
  position = 'left',
  logo,
  sections,
  activeId,
  onNavigate,
  showHeader = true,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchShortcut = 'Ctrl+K',
  onSearchClick,
  footerContent,
  bottomItems,
  width = 280,
  height = '100dvh',
  accentColor,
  rounded = true,
  forceDesktop = false
}: AppSidebarProps) {
  const isMobile = useIsMobile()
  const navigation = useNavigation()
  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false)
  const [isContainerMobile, setIsContainerMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect container width with ResizeObserver
  useEffect(() => {
    // Skip detection if forceDesktop is enabled
    if (forceDesktop) {
      setIsContainerMobile(false)
      return
    }

    if (!containerRef.current) return

    const parent = containerRef.current.parentElement
    if (!parent) return

    // Check if parent is a fixed/absolute positioned container (like in DocsLayout)
    const parentStyle = window.getComputedStyle(parent)
    const isFixedParent = parentStyle.position === 'fixed' || parentStyle.position === 'absolute'

    // If parent is fixed/absolute, observe window resize instead
    if (isFixedParent) {
      const handleResize = () => {
        const isMobileNow = window.innerWidth < 1024
        setIsContainerMobile(isMobileNow)
      }
      handleResize() // Initial check
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }

    // Otherwise, observe parent element width (for flex containers like in previews)
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width
        const isMobileNow = parentWidth < 1024
        setIsContainerMobile(isMobileNow)

        // Adjust parent flex direction for mobile layout
        if (isMobileNow) {
          parent.style.flexDirection = 'column'
        } else {
          parent.style.flexDirection = ''
        }
      }
    })

    observer.observe(parent)
    return () => {
      observer.disconnect()
      // Reset parent style on unmount
      if (parent) parent.style.flexDirection = ''
    }
  }, [forceDesktop])

  // Combined mobile state (forceDesktop overrides)
  const isResponsiveMobile = forceDesktop ? false : isContainerMobile

  // Report sidebar visibility to navigation context
  // Sidebar is visible when: inline mode AND not in responsive mobile (or no navbar in mobile)
  useEffect(() => {
    const isVisible = mode === 'inline' && (!isResponsiveMobile || !navigation.hasNavbar)
    navigation.setSidebarVisible(isVisible)
    return () => navigation.setSidebarVisible(false)
  }, [isResponsiveMobile, navigation.hasNavbar, mode])

  // Register sidebar items in navigation context
  useEffect(() => {
    navigation.registerSidebar(sections, activeId, logo)
    navigation.setOnSidebarNavigate(onNavigate)
    return () => {
      navigation.unregisterSidebar()
      navigation.setOnSidebarNavigate(undefined)
    }
  }, [sections, activeId, logo, onNavigate])

  // Use shared mobile menu state if navbar exists, otherwise use local state
  const mobileMenuOpen = navigation.hasNavbar ? navigation.mobileMenuOpen : localMobileMenuOpen
  const setMobileMenuOpen = navigation.hasNavbar ? navigation.setMobileMenuOpen : setLocalMobileMenuOpen

  // Responsive width for drawer mode
  const responsiveWidth = mode === 'drawer' && isMobile ? 'calc(100vw - 48px)' : width

  // Hover state for inline hover effects (no CSS dependency)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Collapsible state for items with children
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Initialize with defaultOpen items
    const defaultExpanded = new Set<string>()
    sections.forEach(section => {
      section.items.forEach(item => {
        if (item.children && item.defaultOpen) {
          defaultExpanded.add(item.id)
        }
      })
    })
    return defaultExpanded
  })

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  // Auto-expand parent when activeId is a child
  useEffect(() => {
    if (!activeId) return
    for (const section of sections) {
      for (const item of section.items) {
        if (item.children) {
          const isChildOfThisItem = item.children.some(child => child.id === activeId)
          if (isChildOfThisItem && !expandedItems.has(item.id)) {
            setExpandedItems(prev => new Set([...prev, item.id]))
            return
          }
        }
      }
    }
  }, [activeId, sections])

  // Sliding indicator
  const navRef = useRef<HTMLElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 })
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // Close on Escape (drawer mode)
  useEffect(() => {
    if (mode !== 'drawer') return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mode, open, onClose])

  // Prevent body scroll (drawer mode)
  useEffect(() => {
    if (mode !== 'drawer') return
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mode, open])

  // Check if active item is a child of a collapsed parent
  const isActiveItemVisible = (): boolean => {
    if (!activeId) return false

    // Check if activeId is a child of any collapsed parent
    for (const section of sections) {
      for (const item of section.items) {
        if (item.children) {
          const isChildOfThisItem = item.children.some(child => child.id === activeId)
          if (isChildOfThisItem && !expandedItems.has(item.id)) {
            return false // Active item is in a collapsed menu
          }
        }
      }
    }
    return true
  }

  // Track previous expandedItems to detect expansion changes
  const prevExpandedRef = useRef<Set<string>>(new Set())

  // Update sliding indicator position
  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (!activeId || !isActiveItemVisible()) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }

      const activeButton = buttonRefs.current.get(activeId)
      if (!activeButton || !navRef.current) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }

      const navRect = navRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        top: buttonRect.top - navRect.top,
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
        height: buttonRect.height,
        opacity: 1
      })

      // Enable animation after first position is set
      if (!shouldAnimate) {
        requestAnimationFrame(() => {
          setShouldAnimate(true)
        })
      }
    }

    // Check if expandedItems changed (submenu opened/closed)
    const expandedChanged = prevExpandedRef.current.size !== expandedItems.size ||
      [...expandedItems].some(id => !prevExpandedRef.current.has(id))
    prevExpandedRef.current = new Set(expandedItems)

    let rafId: number
    let running = true

    if (expandedChanged) {
      // Continuously update position during CSS transition using rAF loop
      const startTime = performance.now()
      const animate = () => {
        if (!running) return
        updateIndicator()
        // Keep animating for 260ms (duration of CSS transition)
        if (performance.now() - startTime < 260) {
          rafId = requestAnimationFrame(animate)
        }
      }
      rafId = requestAnimationFrame(animate)
    } else {
      // Normal update
      rafId = requestAnimationFrame(updateIndicator)
    }

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [activeId, open, mode, expandedItems, sections, shouldAnimate])

  const handleItemClick = (item: NavItem) => {
    // If item has children and no onClick, toggle expansion
    if (item.children && item.children.length > 0 && !item.onClick) {
      toggleExpanded(item.id)
      return
    }

    if (item.onClick) {
      item.onClick()
    } else if (onNavigate) {
      onNavigate(item.id)
    }
    // Close drawer after navigation in drawer mode
    if (mode === 'drawer') {
      onClose?.()
    }
  }

  // Check if any child is active (for parent highlight)
  const isChildActive = (item: NavItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => child.id === activeId || isChildActive(child))
  }

  // Resolved accent color (use CSS variable if not provided)
  const resolvedAccentColor = accentColor || 'var(--active-color, #BF8DFF)'

  // Don't render in drawer mode if not open
  if (mode === 'drawer' && !open) return null

  const borderRadius = mode === 'drawer' && rounded
    ? position === 'right'
      ? '16px 0 0 16px'
      : '0 16px 16px 0'
    : 0

  const mobilePadding = isMobile ? '1rem' : '1.5rem'

  const sidebarContent = (
    <aside style={{
      width: responsiveWidth,
      minWidth: mode === 'drawer' ? undefined : width,
      maxWidth: '100vw',
      ...(height === '100%' ? { alignSelf: 'stretch' } : { height }),
      backgroundColor: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      padding: mobilePadding,
      flexShrink: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      ...(mode === 'drawer' ? {
        position: 'fixed',
        top: 0,
        bottom: 0,
        [position]: 0,
        zIndex: Z_INDEX.drawer,
        borderRadius,
        boxShadow: position === 'right'
          ? '-8px 0 32px rgba(0, 0, 0, 0.4)'
          : '8px 0 32px rgba(0, 0, 0, 0.4)',
        animation: `slideIn${position === 'right' ? 'Right' : 'Left'} 0.25s ease-out`
      } : {
        position: 'relative'
      })
    }}>
      {/* Logo */}
      {showHeader && logo && (
        <div style={{
          marginBottom: '2rem',
          marginTop: '0.5rem',
          marginLeft: 15,
          color: 'var(--text-primary)'
        }}>
          {logo}
        </div>
      )}

      {/* Search button */}
      {showHeader && showSearch && (
        <button
          onClick={onSearchClick}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.625rem 0.75rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            marginBottom: '1.5rem',
            cursor: 'pointer'
          }}
        >
          <Search20Regular style={{ fontSize: 16 }} />
          <span style={{ flex: 1, textAlign: 'left' }}>{searchPlaceholder}</span>
          {searchShortcut && (
            <kbd style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '0.125rem 0.375rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.7rem'
            }}>
              {searchShortcut}
            </kbd>
          )}
        </button>
      )}

      {/* Navigation */}
      <nav ref={navRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', flex: 1 }}>
        {/* Sliding indicator */}
        {indicatorStyle.width > 0 && (
          <div
            style={{
              position: 'absolute',
              left: indicatorStyle.left,
              top: indicatorStyle.top,
              width: indicatorStyle.width,
              height: indicatorStyle.height,
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              transition: shouldAnimate ? 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              opacity: indicatorStyle.opacity,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
        )}

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                paddingLeft: '0.75rem'
              }}>
                {section.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {section.items.map(item => {
                const isActive = activeId === item.id
                const hasChildren = item.children && item.children.length > 0
                const isExpanded = expandedItems.has(item.id)
                const hasActiveChild = isChildActive(item)

                return (
                  <div key={item.id}>
                    <button
                      ref={(el) => { if (el) buttonRefs.current.set(item.id, el) }}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: (!isActive && !hasActiveChild && hoveredId === item.id) ? 'var(--bg-tertiary)' : 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: isActive ? resolvedAccentColor : (hoveredId === item.id ? 'var(--text-primary)' : 'var(--text-primary)'),
                        fontSize: '0.8125rem',
                        fontWeight: isActive || hasActiveChild ? 500 : 400,
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'color 0.15s ease, background-color 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: 20, display: 'flex' }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge !== undefined && item.badge !== 0 && (
                        <span style={{
                          backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          padding: '0.125rem 0.5rem',
                          borderRadius: 'var(--radius-lg)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          transition: 'background-color 0.15s ease, color 0.15s ease'
                        }}>
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--text-muted)',
                          transition: 'transform 0.2s ease',
                          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                        }}>
                          <ChevronDown20Regular />
                        </span>
                      )}
                    </button>

                    {/* Children items */}
                    {hasChildren && (
                      <div style={{
                        overflow: 'hidden',
                        maxHeight: isExpanded ? `${item.children!.length * 44}px` : '0px',
                        opacity: isExpanded ? 1 : 0,
                        transition: 'max-height 0.25s ease, opacity 0.2s ease',
                        marginLeft: '0.75rem',
                        marginTop: '2px'
                      }}>
                        {item.children!.map((child) => {
                          const isChildItemActive = activeId === child.id

                          return (
                            <button
                              key={child.id}
                              ref={(el) => { if (el) buttonRefs.current.set(child.id, el) }}
                              onClick={() => handleItemClick(child)}
                              onMouseEnter={() => setHoveredId(child.id)}
                              onMouseLeave={() => setHoveredId(null)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: (!isChildItemActive && hoveredId === child.id) ? 'var(--bg-tertiary)' : 'transparent',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: isChildItemActive ? resolvedAccentColor : (hoveredId === child.id ? 'var(--text-primary)' : 'var(--text-secondary)'),
                                fontSize: '0.8rem',
                                fontWeight: isChildItemActive ? 500 : 400,
                                cursor: 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                zIndex: 1,
                                transition: 'color 0.15s ease, background-color 0.15s ease'
                              }}
                            >
                                {child.icon && (
                                  <span style={{ fontSize: 16, display: 'flex' }}>{child.icon}</span>
                                )}
                                <span style={{ flex: 1 }}>{child.label}</span>
                                {child.badge !== undefined && child.badge !== 0 && (
                                  <span style={{
                                    backgroundColor: isChildItemActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                                    color: isChildItemActive ? 'white' : 'var(--text-muted)',
                                    padding: '0.125rem 0.375rem',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: '0.7rem',
                                    fontWeight: 500
                                  }}>
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      {bottomItems && bottomItems.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {bottomItems.map(item => {
            const isActive = activeId === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredId(`bottom-${item.id}`)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: isActive ? 'var(--bg-active, var(--bg-tertiary))' : (hoveredId === `bottom-${item.id}` ? 'var(--bg-tertiary)' : 'transparent'),
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? resolvedAccentColor : 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: 20, display: 'flex' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Footer */}
      {footerContent && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {footerContent}
        </div>
      )}
    </aside>
  )

  // Drawer mode: wrap with overlay
  if (mode === 'drawer') {
    return (
      <div ref={containerRef}>
        {/* Overlay */}
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: Z_INDEX.modalBackdrop,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
        {sidebarContent}
      </div>
    )
  }

  // Inline mode with responsive mobile detection
  // Mobile mode with existing navbar: don't render sidebar, navbar handles menu
  if (isResponsiveMobile && navigation.hasNavbar && mode === 'inline') {
    return <div ref={containerRef} style={{ display: 'none' }} />
  }

  // Mobile mode without navbar: render mobile navbar + drawer
  if (isResponsiveMobile && !navigation.hasNavbar && mode === 'inline') {
    return (
      <div
        ref={containerRef}
        style={{ width: '100%' }}
      >
        {/* Mobile navbar with logo and burger */}
        <nav style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: Z_INDEX.sticky
        }}>
          {/* Logo */}
          {logo && (
            <div style={{ color: 'var(--text-primary)' }}>
              {logo}
            </div>
          )}

          {/* Menu button on the right */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="interactive-icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto'
            }}
          >
            <Navigation20Regular />
          </button>
        </nav>

        {/* Drawer menu */}
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: Z_INDEX.modalBackdrop,
                animation: 'fadeIn 0.2s ease-out'
              }}
            />
            {/* Drawer panel */}
            <div style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 280,
              maxWidth: '80vw',
              backgroundColor: 'var(--bg-secondary)',
              zIndex: Z_INDEX.drawer,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '16px 0 0 16px'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Dismiss20Regular />
                </button>
              </div>

              {/* Search */}
              {showSearch && (
                <div style={{ padding: '0.75rem 1rem' }}>
                  <button
                    onClick={onSearchClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-muted)',
                      fontSize: '0.8125rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Search20Regular style={{ fontSize: 16 }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{searchPlaceholder}</span>
                  </button>
                </div>
              )}

              {/* Items */}
              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.75rem' }}>
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} style={{ marginBottom: '1rem' }}>
                    {section.title && (
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem',
                        paddingLeft: '0.75rem'
                      }}>
                        {section.title}
                      </div>
                    )}
                    {section.items.map(item => {
                      const isActive = activeId === item.id
                      const hasChildren = item.children && item.children.length > 0
                      const isExpanded = expandedItems.has(item.id)

                      return (
                        <div key={item.id}>
                          <button
                            onClick={() => {
                              if (hasChildren) {
                                toggleExpanded(item.id)
                              } else {
                                handleItemClick(item)
                                setMobileMenuOpen(false)
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              width: '100%',
                              padding: '0.75rem',
                              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              color: isActive ? resolvedAccentColor : 'var(--text-primary)',
                              fontSize: '0.875rem',
                              fontWeight: isActive ? 500 : 400,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ fontSize: 20, display: 'flex' }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.badge !== undefined && item.badge !== 0 && (
                              <span style={{
                                backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                padding: '0.125rem 0.5rem',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}>
                                {item.badge}
                              </span>
                            )}
                            {hasChildren && (
                              <ChevronDown20Regular style={{
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                                color: 'var(--text-muted)'
                              }} />
                            )}
                          </button>

                          {/* Children */}
                          {hasChildren && isExpanded && (
                            <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                              {item.children!.map(child => {
                                const isChildActive = activeId === child.id
                                return (
                                  <button
                                    key={child.id}
                                    onClick={() => {
                                      handleItemClick(child)
                                      setMobileMenuOpen(false)
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.625rem',
                                      width: '100%',
                                      padding: '0.5rem 0.75rem',
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                      borderRadius: 'var(--radius-sm)',
                                      color: isChildActive ? resolvedAccentColor : 'var(--text-secondary)',
                                      fontSize: '0.8rem',
                                      fontWeight: isChildActive ? 500 : 400,
                                      cursor: 'pointer',
                                      textAlign: 'left'
                                    }}
                                  >
                                    {child.icon && <span style={{ fontSize: 16, display: 'flex' }}>{child.icon}</span>}
                                    <span style={{ flex: 1 }}>{child.label}</span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Inline mode (desktop): return the sidebar with ref wrapper
  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {sidebarContent}
    </div>
  )
}

// ============================================
// SHEET (Slide-in panel from side)
// ============================================
type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const SHEET_SIZES: Record<SheetSize, number | string> = {
  sm: 360,
  md: 440,
  lg: 560,
  xl: 720,
  full: '100vw'
}

interface SheetProps {
  open: boolean
  onClose: () => void
  // Appearance
  position?: 'left' | 'right'
  size?: SheetSize
  width?: number | string // Override size
  // Header
  title?: string
  subtitle?: string
  icon?: ReactNode
  headerAction?: ReactNode
  // Content
  children?: ReactNode
  // Footer
  footer?: ReactNode
  // Options
  showOverlay?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

export function Sheet({
  open,
  onClose,
  position = 'right',
  size = 'md',
  width,
  title,
  subtitle,
  icon,
  headerAction,
  children,
  footer,
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}: SheetProps) {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  // Handle open/close with animations
  useEffect(() => {
    if (open) {
      setIsVisible(true)
      setIsClosing(false)
      setHasEntered(false)
      // Trigger slide-in after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHasEntered(true)
        })
      })
    } else if (isVisible) {
      setIsClosing(true)
      setHasEntered(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsClosing(false)
      }, 300) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [open])

  // Close handler with animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  // Close on Escape
  useEffect(() => {
    if (!closeOnEscape) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isClosing) handleClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, isClosing])

  // Prevent body scroll
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  if (!isVisible) return null

  // On mobile, sheets are almost full width (except sm on larger mobiles)
  const sheetWidth = isMobile ? 'calc(100vw - 24px)' : (width ?? SHEET_SIZES[size])
  const isFullWidth = size === 'full' || sheetWidth === '100vw'
  const borderRadius = isFullWidth ? 0 : position === 'right' ? '16px 0 0 16px' : '0 16px 16px 0'
  const headerPadding = isMobile ? '1.25rem 1.25rem 0.75rem' : '1.5rem 1.75rem 1rem'
  const contentPadding = isMobile ? '0.5rem 1.25rem 1.25rem' : '0.5rem 1.75rem 1.5rem'
  const footerPadding = isMobile ? '1rem 1.25rem' : '1.25rem 1.75rem'

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          onClick={closeOnOverlayClick ? handleClose : undefined}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: Z_INDEX.modalBackdrop,
            cursor: closeOnOverlayClick ? 'pointer' : 'default',
            opacity: hasEntered && !isClosing ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [position]: 0,
          width: sheetWidth,
          maxWidth: '100vw',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius,
          boxShadow: isFullWidth ? 'none' : position === 'right'
            ? '-12px 0 40px rgba(0, 0, 0, 0.5)'
            : '12px 0 40px rgba(0, 0, 0, 0.5)',
          zIndex: Z_INDEX.drawer,
          display: 'flex',
          flexDirection: 'column',
          transform: hasEntered && !isClosing
            ? 'translateX(0)'
            : `translateX(${position === 'right' ? '100%' : '-100%'})`,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Header */}
        {(title || showCloseButton || headerAction) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: headerPadding
            }}
          >
            {/* Icon */}
            {icon && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                flexShrink: 0,
                fontSize: 28
              }}>
                {icon}
              </div>
            )}

            {/* Title & Subtitle */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  margin: 0,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3
                }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  margin: '0.125rem 0 0',
                  lineHeight: 1.4
                }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Header Action */}
            {headerAction}

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="interactive-icon"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background-color 0.15s ease, color 0.15s ease'
                }}
              >
                <Dismiss20Regular />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: contentPadding
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: footerPadding,
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  )
}

// Legacy alias
export const SidePanel = Sheet


// ============================================
// BOTTOM SHEET (Mobile-friendly drawer)
// ============================================
interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: Z_INDEX.modalBackdrop,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px 16px 0 0',
        zIndex: Z_INDEX.drawer,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
        animation: 'slideInBottom 0.3s ease-out'
      }}>
        {/* Handle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0.75rem'
        }}>
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--border-subtle)'
          }} />
        </div>

        {title && (
          <div style={{
            padding: '0 1.25rem 1rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
              {title}
            </h2>
          </div>
        )}

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 1.25rem 1.25rem'
        }}>
          {children}
        </div>
      </div>
    </>
  )
}
