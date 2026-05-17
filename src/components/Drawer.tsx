import { ReactNode, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Dismiss20Regular, ChevronDown20Regular, Search20Regular, Navigation20Regular } from '@fluentui/react-icons'
import { useIsMobile, useResponsiveOverride } from '../hooks/useResponsive'
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
  badgeColor?: string
  onClick?: () => void
  // Collapsible children
  children?: NavItem[]
  defaultOpen?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

/**
 * Density preset for `AppSidebar`. `comfortable` (default) keeps the
 * current spacing; `compact` tightens padding and gap so ~30% more
 * items fit at the same height without changing the bar width.
 */
export type AppSidebarDensity = 'comfortable' | 'compact'

/**
 * Visual style applied on hover and on the active item for `AppSidebar`.
 * - `bg` (default): subtle background tint on hover, brand-color text on active.
 * - `border-left`: 3px left bar (brand on active, muted on hover).
 * - `dot`: small brand-tinted dot left of the icon (filled on active, ghosted on hover).
 * - `highlight`: text + icon shift to the brand colour. No bg, no bar.
 * - `none`: no hover or active visual at all (use sparingly).
 */
export type AppSidebarHoverEffect = 'bg' | 'border-left' | 'dot' | 'highlight' | 'none'

/**
 * Shared drawer concerns: open/close state, positioning, content, header,
 * footer, base styling. Used by AppSidebar, Sheet, SidePanel, BottomSheet
 * and any future drawer-shaped surface.
 */
export interface DrawerBaseProps {
  // Mode
  mode?: 'inline' | 'drawer'
  open?: boolean // Only used in drawer mode
  onClose?: () => void // Only used in drawer mode
  position?: 'left' | 'right' // Only used in drawer mode
  // Content
  logo?: ReactNode
  /** Logo rendered in place of `logo` when the sidebar is in collapsed
   *  (icon-rail) mode. Typically a square mark (32x32 to 40x40) sized to fit
   *  the 60px collapsed rail. If omitted, no logo is shown when collapsed. */
  compactLogo?: ReactNode
  sections: NavSection[]
  value?: string
  onNavigate?: (id: string) => void
  // Header
  showHeader?: boolean // Show logo + search (default: true)
  headerContent?: ReactNode // Custom content rendered between logo and search
  showSearch?: boolean
  searchPlaceholder?: string
  searchShortcut?: string
  onSearchClick?: () => void
  // Footer
  footerContent?: ReactNode
  bottomItems?: NavItem[]
  // Styling
  width?: number
  /** Custom width when in drawer mode on mobile. Overrides the default
   *  `calc(100vw - 48px)`. Accepts a number (px) or any CSS length string.
   *  Use this when 100vw - 48px is too wide for your design (e.g. a
   *  compact dashboard sidebar that should not eat the full screen). */
  drawerWidth?: number | string
  height?: string // Custom height (default: '100dvh')
  accentColor?: string
  rounded?: boolean // Only used in drawer mode
  // Force desktop mode (for previews/demos)
  forceDesktop?: boolean
  /** Density preset. `comfortable` (default) keeps the current spacing; `compact` tightens item padding and inter-item gap. */
  density?: AppSidebarDensity
  /** Hover and active indicator style for nav items. Defaults to `bg`. */
  hoverEffect?: AppSidebarHoverEffect
}

/**
 * Collapse-to-icons concern. Adds a toggle that shrinks the drawer to a
 * compact icon rail. Controlled via `collapsed` + `onCollapsedChange`.
 */
export interface DrawerCollapsibleProps extends DrawerBaseProps {
  collapsible?: boolean // Show collapse toggle button
  collapsed?: boolean // Controlled collapsed state (icon-only mode)
  onCollapsedChange?: (collapsed: boolean) => void // Callback when collapsed state changes
}

/**
 * Drag-to-resize concern. Adds a resize handle on the trailing edge and
 * clamps the width between `minWidth` and `maxWidth`.
 */
export interface DrawerResizableProps extends DrawerBaseProps {
  resizable?: boolean // Allow drag-resizing the sidebar width
  minWidth?: number // Minimum width when resizing (default: 60)
  maxWidth?: number // Maximum width when resizing (default: 480)
  onWidthChange?: (width: number) => void // Callback when width changes via resize
}

/**
 * Final union accepted by AppSidebar (and the public DrawerProps type).
 * Collapsible and resizable concerns are optional; consumers can opt in
 * to either or both.
 */
export type DrawerProps = DrawerBaseProps & Partial<DrawerCollapsibleProps & DrawerResizableProps>

export function AppSidebar({
  mode = 'inline',
  open = true,
  onClose,
  position = 'left',
  logo,
  compactLogo,
  sections,
  value,
  onNavigate,
  showHeader = true,
  headerContent,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchShortcut = 'Ctrl+K',
  onSearchClick,
  footerContent,
  bottomItems,
  width: initialWidth = 240,
  drawerWidth,
  height = '100dvh',
  accentColor,
  rounded = true,
  collapsible = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  resizable = false,
  minWidth = 60,
  maxWidth = 480,
  onWidthChange,
  forceDesktop = false,
  density = 'comfortable',
  hoverEffect = 'bg'
}: DrawerProps) {
  const isMobile = useIsMobile()
  const navigation = useNavigation()
  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false)
  const [isContainerMobile, setIsContainerMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Collapsed state (uncontrolled fallback)
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = collapsible ? (controlledCollapsed ?? internalCollapsed) : false
  const toggleCollapsed = () => {
    const next = !isCollapsed
    setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  // Resizable state
  const [currentWidth, setCurrentWidth] = useState(initialWidth)
  const isResizing = useRef(false)

  useEffect(() => {
    setCurrentWidth(initialWidth)
  }, [initialWidth])

  useEffect(() => {
    if (!resizable) return
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newWidth = Math.min(maxWidth, Math.max(minWidth, e.clientX - rect.left))
      setCurrentWidth(newWidth)
      onWidthChange?.(newWidth)
    }
    const handleMouseUp = () => {
      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizable, minWidth, maxWidth, onWidthChange])

  const startResize = () => {
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  // Resolved width (collapsed overrides)
  const width = isCollapsed ? 60 : currentWidth

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
    navigation.registerSidebar(sections, value, logo)
    navigation.setOnSidebarNavigate(onNavigate)
    return () => {
      navigation.unregisterSidebar()
      navigation.setOnSidebarNavigate(undefined)
    }
  }, [sections, value, logo, onNavigate])

  // Use shared mobile menu state if navbar exists, otherwise use local state
  const mobileMenuOpen = navigation.hasNavbar ? navigation.mobileMenuOpen : localMobileMenuOpen
  const setMobileMenuOpen = navigation.hasNavbar ? navigation.setMobileMenuOpen : setLocalMobileMenuOpen

  // Responsive width for drawer mode. The default `calc(100vw - 48px)`
  // is appropriate for navigation-heavy apps but too wide for compact
  // dashboards. Pass `drawerWidth` to override.
  const drawerOverride = typeof drawerWidth === 'number' ? `${drawerWidth}px` : drawerWidth
  const responsiveWidth = mode === 'drawer' && isMobile
    ? (drawerOverride ?? 'calc(100vw - 48px)')
    : width

  // Hover state for inline hover effects (no CSS dependency)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Collapsible state for items with children
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const defaultExpanded = new Set<string>()
    const collectDefaults = (items: NavItem[]) => {
      items.forEach(item => {
        if (item.children && item.defaultOpen) {
          defaultExpanded.add(item.id)
        }
        if (item.children) collectDefaults(item.children)
      })
    }
    sections.forEach(section => collectDefaults(section.items))
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

  // Auto-expand all ancestors when value is nested
  useEffect(() => {
    if (!value) return
    const toExpand: string[] = []
    const findAncestors = (items: NavItem[]): boolean => {
      for (const item of items) {
        if (item.id === value) return true
        if (item.children && findAncestors(item.children)) {
          toExpand.push(item.id)
          return true
        }
      }
      return false
    }
    sections.forEach(section => findAncestors(section.items))
    if (toExpand.length > 0) {
      setExpandedItems(prev => {
        const next = new Set(prev)
        toExpand.forEach(id => next.add(id))
        return next
      })
    }
  }, [value, sections])

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

  // Check if active item is visible (not inside a collapsed ancestor)
  const isActiveItemVisible = (): boolean => {
    if (!value) return false
    const checkVisibility = (items: NavItem[]): 'found' | 'hidden' | 'not_found' => {
      for (const item of items) {
        if (item.id === value) return 'found'
        if (item.children) {
          const result = checkVisibility(item.children)
          if (result === 'found' || result === 'hidden') {
            return expandedItems.has(item.id) ? result : 'hidden'
          }
        }
      }
      return 'not_found'
    }
    for (const section of sections) {
      const result = checkVisibility(section.items)
      if (result === 'hidden') return false
      if (result === 'found') return true
    }
    return true
  }

  // Track previous expandedItems to detect expansion changes
  const prevExpandedRef = useRef<Set<string>>(new Set())

  // Track previous collapsed state to detect collapse toggle
  const prevCollapsedRef = useRef<boolean>(isCollapsed)

  // Update sliding indicator position
  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (!value || !isActiveItemVisible()) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }

      const activeButton = buttonRefs.current.get(value)
      if (!activeButton || !navRef.current) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }

      // Use offsetTop/offsetLeft (pre-transform CSS pixels) instead of getBoundingClientRect
      // so the indicator stays aligned when the sidebar is rendered inside a CSS transform:
      // scale() ancestor (e.g. preview frames, zoom levels).
      const nav = navRef.current
      let top = activeButton.offsetTop
      let left = activeButton.offsetLeft
      // Walk up from activeButton's offsetParent chain until we reach nav, summing offsets.
      let op = activeButton.offsetParent as HTMLElement | null
      while (op && op !== nav && nav.contains(op)) {
        top += op.offsetTop
        left += op.offsetLeft
        op = op.offsetParent as HTMLElement | null
      }

      setIndicatorStyle({
        top,
        left,
        width: activeButton.offsetWidth,
        height: activeButton.offsetHeight,
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

    // Check if collapsed state changed (sidebar width transition)
    const collapseChanged = prevCollapsedRef.current !== isCollapsed
    prevCollapsedRef.current = isCollapsed

    let rafId: number
    let running = true

    if (expandedChanged || collapseChanged) {
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
  }, [value, open, mode, expandedItems, sections, shouldAnimate, isCollapsed])

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
    return item.children.some(child => child.id === value || isChildActive(child))
  }

  // Resolved accent color (use CSS variable if not provided)
  const resolvedAccentColor = accentColor || 'var(--active-color, #BF8DFF)'

  // Count all visible children recursively (for max-height animation)
  const countVisibleChildren = (item: NavItem): number => {
    if (!item.children) return 0
    return item.children.reduce((count, child) => {
      return count + 1 + (expandedItems.has(child.id) ? countVisibleChildren(child) : 0)
    }, 0)
  }

  // Recursive nav item renderer
  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const isActive = value === item.id
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const hasActiveChild = isChildActive(item)
    const isTopLevel = depth === 0
    const isHovered = hoveredId === item.id
    const isHotNotActive = isHovered && !isActive && !hasActiveChild
    const activeOrChild = isActive || hasActiveChild

    const compact = density === 'compact'
    const itemPadding = compact
      ? (isTopLevel ? '0.4375rem 0.625rem' : '0.3125rem 0.5rem')
      : (isTopLevel ? '0.75rem' : '0.5rem 0.75rem')
    const itemGap = compact ? '0.5rem' : '0.75rem'

    let hoverBg: string = 'transparent'
    let hoverShadow: string | undefined
    let hoverTransform: string | undefined
    switch (hoverEffect) {
      case 'bg':
        hoverBg = isHotNotActive ? 'var(--bg-tertiary)' : 'transparent'
        break
      case 'border-left':
        hoverShadow = activeOrChild
          ? `inset 3px 0 0 ${resolvedAccentColor}`
          : isHotNotActive ? 'inset 3px 0 0 var(--text-muted)' : undefined
        break
      case 'dot':
        hoverBg = isHotNotActive ? 'var(--bg-subtle, var(--bg-tertiary))' : 'transparent'
        break
      case 'highlight':
        break
      case 'none':
        break
    }

    const isDefaultHover = hoverEffect === 'bg'

    return (
      <div key={item.id}>
        <button
          ref={(el) => { if (el) buttonRefs.current.set(item.id, el) }}
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          title={isCollapsed ? item.label : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : undefined,
            gap: isCollapsed ? 0 : itemGap,
            width: '100%',
            boxSizing: 'border-box',
            padding: itemPadding,
            ...(hoverEffect === 'dot' && !isCollapsed && {
              paddingLeft: compact ? '1.125rem' : '1.375rem'
            }),
            backgroundColor: isDefaultHover
              ? (isHotNotActive ? 'var(--bg-tertiary)' : 'transparent')
              : hoverBg,
            ...(hoverShadow !== undefined && { boxShadow: hoverShadow }),
            ...(hoverTransform !== undefined && { transform: hoverTransform }),
            border: 'none',
            borderRadius: hoverEffect === 'border-left'
              ? 0
              : (isTopLevel ? 'var(--radius-md)' : 'var(--radius-sm)'),
            color: hoverEffect === 'none' && !isActive
              ? (!isTopLevel ? 'var(--text-secondary)' : 'var(--text-primary)')
              : isActive
                ? resolvedAccentColor
                : hoverEffect === 'highlight' && isHovered
                  ? resolvedAccentColor
                  : !isTopLevel
                    ? (isHovered ? 'var(--text-primary)' : 'var(--text-secondary)')
                    : (isHovered ? 'var(--text-primary)' : 'var(--text-primary)'),
            fontSize: isTopLevel ? '0.8125rem' : '0.8rem',
            fontWeight: isActive || hasActiveChild ? 500 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            position: 'relative',
            zIndex: 1,
            transition: isDefaultHover
              ? 'color 0.15s ease, background-color 0.15s ease'
              : 'color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease'
          }}
        >
          {hoverEffect === 'dot' && !isCollapsed && (isHovered || activeOrChild) && (
            <span style={{
              position: 'absolute',
              left: compact ? 6 : 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: activeOrChild ? resolvedAccentColor : 'var(--text-muted)',
              opacity: activeOrChild ? 1 : 0.6,
              transition: 'background-color 0.15s ease, opacity 0.15s ease'
            }} />
          )}
          {item.icon && (
            <span style={{
              fontSize: isTopLevel ? (compact ? 18 : 20) : (compact ? 14 : 16),
              display: 'flex',
              flexShrink: 0
            }}>{item.icon}</span>
          )}
          {!isCollapsed && (
            <span style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left'
            }}>{item.label}</span>
          )}
          {!isCollapsed && item.badge !== undefined && item.badge !== 0 && (
            <span style={{
              backgroundColor: item.badgeColor ? item.badgeColor : isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
              color: item.badgeColor ? 'white' : isActive ? 'white' : (isTopLevel ? 'var(--text-secondary)' : 'var(--text-muted)'),
              padding: isTopLevel ? '0.125rem 0.5rem' : '0.125rem 0.375rem',
              borderRadius: 'var(--radius-lg)',
              fontSize: isTopLevel ? '0.75rem' : '0.7rem',
              fontWeight: 500,
              transition: 'background-color 0.15s ease, color 0.15s ease'
            }}>
              {item.badge}
            </span>
          )}
          {!isCollapsed && hasChildren && (
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

        {/* Children (recursive) */}
        {hasChildren && !isCollapsed && (
          <div style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? `${countVisibleChildren(item) * 44}px` : '0px',
            opacity: isExpanded ? 1 : 0,
            transition: 'max-height 0.25s ease, opacity 0.2s ease',
            marginLeft: '0.75rem',
            marginTop: '2px'
          }}>
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Recursive mobile nav item renderer (closes menu on click)
  const renderMobileNavItem = (item: NavItem, depth: number = 0): ReactNode => {
    const isActive = value === item.id
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isTopLevel = depth === 0

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
            boxSizing: 'border-box',
            padding: isTopLevel ? '0.75rem' : '0.5rem 0.75rem',
            backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
            border: 'none',
            borderRadius: isTopLevel ? 'var(--radius-md)' : 'var(--radius-sm)',
            color: isActive ? resolvedAccentColor : (isTopLevel ? 'var(--text-primary)' : 'var(--text-secondary)'),
            fontSize: isTopLevel ? '0.875rem' : '0.8rem',
            fontWeight: isActive ? 500 : 400,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          {item.icon && <span style={{ fontSize: isTopLevel ? 20 : 16, display: 'flex', flexShrink: 0 }}>{item.icon}</span>}
          <span style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left'
          }}>{item.label}</span>
          {item.badge !== undefined && item.badge !== 0 && (
            <span style={{
              backgroundColor: item.badgeColor ? item.badgeColor : isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
              color: item.badgeColor ? 'white' : isActive ? 'white' : 'var(--text-secondary)',
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
        {hasChildren && isExpanded && (
          <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
            {item.children!.map(child => renderMobileNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Don't render in drawer mode if not open
  if (mode === 'drawer' && !open) return null

  const borderRadius = mode === 'drawer' && rounded
    ? position === 'right'
      ? '16px 0 0 16px'
      : '0 16px 16px 0'
    : 0

  const mobilePadding = isMobile ? '1rem 0.75rem' : '1.5rem 0.75rem'

  const sidebarContent = (
    <aside style={{
      width: responsiveWidth,
      minWidth: 0,
      maxWidth: '100vw',
      boxSizing: 'border-box',
      ...(height === '100%' ? { alignSelf: 'stretch' } : { height }),
      backgroundColor: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      padding: isCollapsed ? '1rem 0.5rem' : mobilePadding,
      flexShrink: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'width 0.2s ease, min-width 0.2s ease, padding 0.2s ease',
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
      {/* Logo + Collapse Toggle */}
      {showHeader && (logo || compactLogo || collapsible) && (
        <div style={{
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: isCollapsed ? '0.75rem' : 0,
          marginBottom: isCollapsed ? '1rem' : '2rem',
          marginTop: '0.5rem',
          marginLeft: isCollapsed ? 0 : 15,
          color: 'var(--text-primary)'
        }}>
          {(isCollapsed ? compactLogo : logo) || null}
          {collapsible && (
            <button
              onClick={toggleCollapsed}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                flexShrink: 0
              }}
            >
              <ChevronDown20Regular style={{
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(90deg)',
                transition: 'transform 0.2s ease'
              }} />
            </button>
          )}
        </div>
      )}

      {/* Header Content */}
      {headerContent && !isCollapsed && (
        <div style={{ marginBottom: '1rem' }}>
          {headerContent}
        </div>
      )}

      {/* Search button */}
      {showHeader && showSearch && !isCollapsed && (
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
        {hoverEffect === 'bg' && indicatorStyle.width > 0 && (
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
            {section.title && !isCollapsed && (
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
            {isCollapsed && section.title && (
              <div style={{
                height: 1,
                backgroundColor: 'var(--border-subtle)',
                margin: '0.5rem 0.75rem'
              }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {section.items.map(item => renderNavItem(item, 0))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      {bottomItems && bottomItems.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {bottomItems.map(item => {
            const isActive = value === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredId(`bottom-${item.id}`)}
                onMouseLeave={() => setHoveredId(null)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : undefined,
                  gap: isCollapsed ? 0 : '0.75rem',
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
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Footer */}
      {footerContent && !isCollapsed && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {footerContent}
        </div>
      )}

      {/* Resize handle */}
      {resizable && !isCollapsed && mode !== 'drawer' && (
        <div
          onMouseDown={startResize}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 4,
            cursor: 'col-resize',
            backgroundColor: 'transparent',
            transition: 'background-color 0.15s ease',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--brand-primary)'
          }}
          onMouseLeave={(e) => {
            if (!isResizing.current) {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
            }
          }}
        />
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
            zIndex: Z_INDEX.drawerBackdrop,
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
                zIndex: Z_INDEX.drawerBackdrop,
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
                    {section.items.map(item => renderMobileNavItem(item, 0))}
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
  const responsiveOverride = useResponsiveOverride()
  const isInPreview = responsiveOverride !== null
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

  // Prevent body scroll (skipped in preview mode — we don't want to lock
  // the docs page when a sheet opens inside a scoped block preview)
  useEffect(() => {
    if (isInPreview) return
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible, isInPreview])

  if (!isVisible) return null

  const fullUnit = isInPreview ? '100%' : '100vw'
  const sheetWidth = isMobile ? `calc(${fullUnit} - 24px)` : (width ?? SHEET_SIZES[size])
  const isFullWidth = size === 'full' || sheetWidth === fullUnit
  const borderRadius = isFullWidth ? 0 : position === 'right' ? '16px 0 0 16px' : '0 16px 16px 0'
  const headerPadding = isMobile ? '1.25rem 1.25rem 0.75rem' : '1.5rem 1.75rem 1rem'
  const contentPadding = isMobile ? '0.5rem 1.25rem 1.25rem' : '0.5rem 1.75rem 1.5rem'
  const footerPadding = isMobile ? '1rem 1.25rem' : '1.25rem 1.75rem'

  const sheetContent = (
    <>
      {showOverlay && (
        <div
          onClick={closeOnOverlayClick ? handleClose : undefined}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: Z_INDEX.drawerBackdrop,
            cursor: closeOnOverlayClick ? 'pointer' : 'default',
            opacity: hasEntered && !isClosing ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Sheet'}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [position]: 0,
          width: sheetWidth,
          maxWidth: fullUnit,
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

  if (isInPreview) return sheetContent
  return createPortal(sheetContent, document.body)
}

// Aliases
export const SidePanel = Sheet
export const Drawer = Sheet
export const Sidebar = AppSidebar


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
          zIndex: Z_INDEX.drawerBackdrop,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Sheet'}
        style={{
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
        }}
      >
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
