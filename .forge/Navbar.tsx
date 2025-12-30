import { ReactNode, useState, useRef, useEffect } from 'react'
import { Navigation20Regular, Dismiss20Regular, Search20Regular, ChevronDown16Regular, ChevronDown20Regular, Home20Regular, Person20Regular, Settings20Regular, Heart20Regular } from '@fluentui/react-icons'
import { Button } from './Button'
import { useNavigation } from '../hooks/useNavigation'
import { Z_INDEX } from '../constants'

// ============================================
// TYPES
// ============================================
export interface NavDropdownItem {
  id: string
  label: string
  icon?: ReactNode
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
}

export interface NavbarItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
  icon?: ReactNode
  badge?: number | string
  dropdownItems?: NavDropdownItem[]
}

// Active color (same as sidebar)
const ACTIVE_COLOR = 'var(--active-color, #BF8DFF)'

// ============================================
// SEARCH BUTTON (with hover animation)
// ============================================
function SearchButton({ onClick }: { onClick?: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        backgroundColor: isHovered ? 'var(--bg-tertiary)' : 'transparent',
        border: 'none',
        color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      <Search20Regular />
    </button>
  )
}

// ============================================
// DROPDOWN MENU ITEM (for navbar dropdowns)
// ============================================
function NavDropdownMenuItem({
  item,
  onSelect
}: {
  item: NavDropdownItem
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  if (item.divider) {
    return <div style={{
      height: 1,
      backgroundColor: 'var(--border-color)',
      margin: '4px 0'
    }} />
  }

  return (
    <button
      onClick={() => {
        if (!item.disabled) {
          item.onClick?.()
          onSelect()
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.5rem 0.75rem',
        backgroundColor: hovered && !item.disabled
          ? item.destructive
            ? 'rgba(239, 68, 68, 0.1)'
            : 'var(--bg-tertiary)'
          : 'transparent',
        color: item.destructive ? 'var(--color-error)' : 'var(--text-primary)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        fontSize: '0.875rem',
        textAlign: 'left',
        opacity: item.disabled ? 0.5 : 1,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed && !item.disabled ? 'scale(0.98)' : 'scale(1)'
      }}
    >
      {item.icon && (
        <span style={{
          display: 'flex',
          transition: 'transform 0.15s ease',
          transform: hovered && !item.disabled ? 'scale(1.1)' : 'scale(1)'
        }}>
          {item.icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.shortcut && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.shortcut}</span>
      )}
    </button>
  )
}

// ============================================
// NAVBAR ITEM COMPONENT (button or dropdown on hover)
// ============================================
interface NavItemProps {
  item: NavbarItem
  isActive: boolean
  onClick: () => void
  buttonRef?: (el: HTMLButtonElement | null) => void
}

function NavItem({ item, isActive, onClick, buttonRef }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setIsHovered(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (hasDropdown) setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
    if (hasDropdown) setDropdownOpen(false)
  }

  const handleClick = () => {
    if (!hasDropdown) {
      onClick()
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.875rem',
          backgroundColor: !isActive && (hasDropdown ? dropdownOpen : isHovered) ? 'var(--bg-tertiary)' : 'transparent',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          color: isActive
            ? ACTIVE_COLOR
            : (hasDropdown ? dropdownOpen : isHovered)
              ? 'var(--text-primary)'
              : 'var(--text-secondary)',
          fontSize: '0.875rem',
          fontWeight: isActive ? 500 : 400,
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed ? 'scale(0.97)' : 'scale(1)',
          zIndex: 1
        }}
      >
        {item.icon && (
          <span style={{
            display: 'flex',
            transition: 'transform 0.15s ease',
            transform: isHovered && !isActive ? 'scale(1.1)' : 'scale(1)'
          }}>
            {item.icon}
          </span>
        )}
        {item.label}
        {hasDropdown && (
          <ChevronDown16Regular style={{
            marginLeft: '0.125rem',
            transition: 'transform 0.2s ease',
            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.6
          }} />
        )}
        {item.badge !== undefined && (
          <span style={{
            backgroundColor: isActive ? ACTIVE_COLOR : 'var(--bg-hover)',
            color: isActive ? 'white' : 'var(--text-secondary)',
            padding: '0.125rem 0.5rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.75rem',
            fontWeight: 500,
            transition: 'all 0.15s ease'
          }}>
            {item.badge}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {hasDropdown && dropdownOpen && (
        <>
          {/* Invisible bridge to prevent hover gap */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            height: 8
          }} />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: 200,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
            padding: 6,
            zIndex: Z_INDEX.dropdown,
            animation: 'scaleIn 0.15s ease-out'
          }}>
            {item.dropdownItems!.map(dropItem => (
              <NavDropdownMenuItem
                key={dropItem.id}
                item={dropItem}
                onSelect={() => {
                  setDropdownOpen(false)
                  onClick() // Activate parent nav item
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// NAVBAR
// ============================================
interface NavbarProps {
  logo?: ReactNode
  items?: NavbarItem[]
  activeId?: string
  onNavigate?: (id: string) => void
  actions?: ReactNode
  showSearch?: boolean
  onSearchClick?: () => void
  sticky?: boolean
  transparent?: boolean
  variant?: 'default' | 'centered' | 'minimal'
  /** Force mobile mode regardless of screen size (useful for previews) */
  forceMobile?: boolean
  /** Force desktop mode regardless of container size (useful for previews) */
  forceDesktop?: boolean
}

const defaultLogo = (
  <svg width="114" height="28" viewBox="0 0 147 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_navbar)">
      <path d="M17.685 18.0072L14.2213 27.9046L5.69913 0.973395L5.62946 0.750763H0L10.7395 34.6926L10.8106 34.9153H17.579L23.4947 18.0072H17.685Z" fill="currentColor"/>
      <path d="M39.1643 0.750763H33.5364L22.859 34.5003L22.7272 34.9153H28.3537L39.0325 1.16574L39.1643 0.750763Z" fill="currentColor"/>
      <path d="M143.579 30.1006V16.008C143.579 12.5458 140.762 9.72733 137.302 9.72733H126.785C124.569 9.72733 122.765 11.5311 122.765 13.7484V14.5738H138.304V19.817H131.419C129.705 19.817 128.124 20.0972 126.721 20.65C125.281 21.2028 124.124 22.0676 123.285 23.2171C122.409 24.3545 121.984 25.7812 121.984 27.5759C121.984 29.3706 122.403 30.7443 123.264 31.9075C124.094 33.0857 125.246 34.0066 126.692 34.6457C128.074 35.2318 129.637 35.5287 131.337 35.5287C133.038 35.5287 134.463 35.303 135.554 34.8396C136.726 34.3443 137.577 33.7688 138.233 33.0252C138.468 32.7556 138.687 32.489 138.889 32.227C139.08 32.8222 139.408 33.3341 139.888 33.7839C140.653 34.5018 141.682 34.8653 142.948 34.8653H147.005V30.0991H143.578L143.579 30.1006ZM138.3 24.4681C138.241 26.4067 137.633 27.9318 136.491 29.0087C135.321 30.1461 133.732 30.7231 131.771 30.7231C130.436 30.7231 129.344 30.4172 128.437 29.7886C127.698 29.2555 127.339 28.4937 127.339 27.4593C127.339 26.4249 127.666 25.7661 128.36 25.2723C129.194 24.7392 130.264 24.4681 131.539 24.4681H138.303H138.3Z" fill="currentColor"/>
      <path d="M113.017 11.2449L113.011 11.2419C111.761 10.5315 110.406 10.0651 108.98 9.85607C108.402 9.77428 107.787 9.73188 107.151 9.73188C107.096 9.73188 107.045 9.73491 107.001 9.73945H103.386C101.137 9.73945 99.3057 11.575 99.3057 13.8302V14.6556H106.232C108.362 14.6571 110.036 15.3144 111.351 16.6638C112.67 18.0163 113.338 19.9443 113.338 22.3963V22.8264C113.338 25.3375 112.688 27.2261 111.351 28.5982C110.035 29.9507 108.341 30.608 106.177 30.608C104.013 30.608 102.301 29.9295 100.997 28.5907C99.6661 27.2594 99.0194 25.3738 99.0194 22.8264V0.500885H93.6671V34.8683H98.9013V32.0195C99.4874 32.7374 100.23 33.3978 101.158 34.0248C102.633 35.0243 104.65 35.5302 107.151 35.5302C109.261 35.5302 111.22 35.0213 112.974 34.0202C114.707 33.0297 116.121 31.5622 117.179 29.6584C118.246 27.7683 118.764 25.5722 118.764 22.9415V22.3175C118.764 19.7398 118.245 17.4953 117.221 15.6506C116.191 13.756 114.816 12.3156 113.015 11.2434L113.017 11.2449Z" fill="currentColor"/>
      <path d="M84.1094 11.2449L84.1033 11.2419C82.8538 10.5315 81.4983 10.0651 80.0732 9.85607C79.4946 9.77428 78.8797 9.73188 78.2436 9.73188C78.1891 9.73188 78.1391 9.73491 78.0937 9.73945H74.4786C72.2295 9.73945 70.4 11.575 70.4 13.8302V14.6556H77.3243C79.4553 14.6571 81.1288 15.3144 82.4434 16.6638C83.7625 18.0163 84.4304 19.9443 84.4304 22.3963V22.8264C84.4304 25.3375 83.7807 27.2261 82.4434 28.5982C81.1273 29.9507 79.4356 30.608 77.2713 30.608C75.1071 30.608 73.3957 29.9295 72.0902 28.5907C70.7589 27.2594 70.1122 25.3753 70.1122 22.8264V0.500885H64.7599V34.8683H69.9941V32.0195C70.5787 32.7374 71.3223 33.3962 72.2507 34.0248C73.7273 35.0243 75.7432 35.5302 78.2436 35.5302C80.3534 35.5302 82.3132 35.0213 84.0685 34.0202C85.8011 33.0297 87.2157 31.5622 88.2728 29.6584C89.3405 27.7683 89.8585 25.5707 89.8585 22.9415V22.3175C89.8585 19.7398 89.339 17.4968 88.3152 15.6506C87.2853 13.7575 85.9101 12.3156 84.1094 11.2434V11.2449Z" fill="currentColor"/>
      <path d="M55.5391 10.4846C53.7701 9.49714 51.7119 8.99734 49.4219 8.99734C47.132 8.99734 44.942 9.53046 43.1079 10.583C41.2647 11.6372 39.8017 13.1396 38.7612 15.0494C37.7344 16.941 37.2134 19.1704 37.2134 21.6769V22.2373C37.2134 24.7105 37.7344 26.9247 38.7612 28.8163C39.8047 30.7307 41.2829 32.2361 43.1579 33.2902C45.0177 34.3307 47.1895 34.8608 49.6158 34.8684H54.3184C56.8612 34.8684 58.9301 32.7995 58.9301 30.2566V29.9371H49.7475C47.7272 29.9371 46.0264 29.3086 44.6936 28.0682C43.5426 27.011 42.8519 25.548 42.6354 23.72H61.2564V21.2059C61.2564 18.7599 60.749 16.5957 59.7494 14.7722C58.7362 12.9169 57.3201 11.4751 55.5391 10.4846ZM44.8132 15.5037C45.9915 14.4632 47.5424 13.9362 49.4219 13.9362C51.3014 13.9362 52.7887 14.4632 53.9518 15.5022C54.9393 16.3867 55.533 17.5407 55.7602 19.025H42.7898C43.1503 17.5559 43.8303 16.3715 44.8117 15.5052L44.8132 15.5037Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_navbar">
        <rect width="147" height="35.0123" fill="white" transform="translate(0 0.500885)"/>
      </clipPath>
    </defs>
  </svg>
)

const defaultNavItems: NavbarItem[] = [
  { id: 'home', label: 'Accueil' },
  { id: 'products', label: 'Produits', dropdownItems: [
    { id: 'product-1', label: 'Produit 1' },
    { id: 'product-2', label: 'Produit 2' },
    { id: 'product-3', label: 'Produit 3' }
  ]},
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'À propos' },
  { id: 'contact', label: 'Contact' }
]

export function Navbar({
  logo = defaultLogo,
  items,
  activeId = 'home',
  onNavigate,
  actions,
  showSearch = true,
  onSearchClick,
  sticky = true,
  transparent = false,
  variant = 'default',
  forceMobile = false,
  forceDesktop = false
}: NavbarProps) {
  const navItems = items ?? defaultNavItems
  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const [isContainerMobile, setIsContainerMobile] = useState(false)

  // Detect container width with ResizeObserver
  useEffect(() => {
    // Skip detection if forceDesktop is enabled
    if (forceDesktop) {
      setIsContainerMobile(false)
      return
    }

    if (!navRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setIsContainerMobile(width < 1024)
      }
    })

    observer.observe(navRef.current)
    return () => observer.disconnect()
  }, [forceDesktop])

  // Combined mobile state: forceMobile prop OR container width (forceDesktop overrides)
  const isMobile = forceDesktop ? false : (forceMobile || isContainerMobile)

  // Navigation context for sidebar integration
  const navigation = useNavigation()

  // Register navbar in context
  useEffect(() => {
    navigation.registerNavbar()
    return () => navigation.unregisterNavbar()
  }, [])

  // Use shared mobile menu state if sidebar exists, otherwise use local state
  const hasSidebar = navigation.sidebarSections.length > 0
  const mobileMenuOpen = hasSidebar ? navigation.mobileMenuOpen : localMobileMenuOpen
  const setMobileMenuOpen = hasSidebar ? navigation.setMobileMenuOpen : setLocalMobileMenuOpen

  // Update sliding indicator position
  useEffect(() => {
    if (!activeId) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }
    const activeButton = buttonRefs.current.get(activeId)
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        opacity: 1
      })
    }
  }, [activeId, navItems])

  const handleItemClick = (item: NavbarItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (onNavigate) {
      onNavigate(item.id)
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: sticky ? 'sticky' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          minHeight: 64,
          backgroundColor: transparent ? 'transparent' : 'var(--bg-secondary)',
          backdropFilter: transparent ? 'blur(12px)' : undefined,
          zIndex: Z_INDEX.sticky,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : undefined,
          padding: isMobile ? '1rem' : '1rem 2rem',
          overflow: 'visible'
        }}
      >
        {/* Logo */}
        {logo && (
          <div style={{
            marginRight: isMobile ? 0 : (variant === 'centered' ? 'auto' : '1rem'),
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-primary)'
          }}>
            {logo}
          </div>
        )}

        {/* Desktop Navigation with sliding indicator */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flex: variant === 'centered' ? undefined : 1,
            justifyContent: variant === 'centered' ? 'center' : 'flex-start',
            overflow: 'visible'
          }}
        >
          {/* Sliding background indicator */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: '100%',
              backgroundColor: 'var(--bg-active, var(--bg-tertiary))',
              borderRadius: 'var(--radius-md)',
              transition: 'left 0.25s ease, width 0.25s ease, opacity 0.15s ease',
              opacity: indicatorStyle.opacity,
              zIndex: 0
            }}
          />

          {navItems.map(item => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => handleItemClick(item)}
              buttonRef={(el) => {
                if (el) buttonRefs.current.set(item.id, el)
                else buttonRefs.current.delete(item.id)
              }}
            />
          ))}
        </div>

        {/* Spacer for centered variant */}
        {variant === 'centered' && <div style={{ flex: 1 }} />}

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginLeft: variant === 'centered' ? 'auto' : undefined,
          overflow: 'visible'
        }}>
          {/* Search button */}
          {showSearch && (
            <SearchButton onClick={onSearchClick} />
          )}

          {/* Custom actions or default login button */}
          {!isMobile && (
            <div style={{ overflow: 'visible' }}>
              {actions ?? (
                <Button size="sm" fullWidth={false}>Connexion</Button>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
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
                justifyContent: 'center'
              }}
            >
              <Navigation20Regular />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <MobileMenu
          items={navItems}
          activeId={activeId}
          onItemClick={handleItemClick}
          onClose={() => setMobileMenuOpen(false)}
          actions={actions}
          sidebarSections={navigation.sidebarVisible ? [] : navigation.sidebarSections}
          sidebarActiveId={navigation.sidebarActiveId}
          onSidebarNavigate={navigation.onSidebarNavigate}
        />
      )}

    </>
  )
}

// ============================================
// MOBILE MENU
// ============================================
interface SidebarNavItem {
  id: string
  icon?: ReactNode
  label: string
  badge?: number | string
  onClick?: () => void
  children?: SidebarNavItem[]
}

interface SidebarNavSection {
  title?: string
  items: SidebarNavItem[]
}

interface MobileMenuProps {
  items: NavbarItem[]
  activeId?: string
  onItemClick: (item: NavbarItem) => void
  onClose: () => void
  actions?: ReactNode
  // Sidebar integration
  sidebarSections?: SidebarNavSection[]
  sidebarActiveId?: string
  onSidebarNavigate?: (id: string) => void
}

// ============================================
// MOBILE MENU ITEM (with animations)
// ============================================
interface MobileMenuItemProps {
  item: NavbarItem
  isActive: boolean
  onClick: () => void
  index: number
}

function MobileMenuItem({ item, isActive, onClick, index }: MobileMenuItemProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.875rem 1rem',
        backgroundColor: isActive ? 'var(--bg-active, var(--bg-tertiary))' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        color: isActive ? ACTIVE_COLOR : 'var(--text-primary)',
        fontSize: '0.9375rem',
        fontWeight: isActive ? 500 : 400,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        animation: `slideInRight 0.25s ease ${index * 0.03}s both`
      }}
    >
      {item.icon && (
        <span style={{
          display: 'flex',
          fontSize: 20,
          transition: 'transform 0.15s ease',
          transform: isActive ? 'scale(1.1)' : 'scale(1)'
        }}>
          {item.icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge !== undefined && (
        <span style={{
          backgroundColor: isActive ? ACTIVE_COLOR : 'var(--bg-hover)',
          color: isActive ? 'white' : 'var(--text-secondary)',
          padding: '0.125rem 0.625rem',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.75rem',
          fontWeight: 500,
          transition: 'all 0.15s ease'
        }}>
          {item.badge}
        </span>
      )}
    </button>
  )
}

function MobileMenu({
  items,
  activeId,
  onItemClick,
  onClose,
  actions,
  sidebarSections = [],
  sidebarActiveId,
  onSidebarNavigate
}: MobileMenuProps) {
  const [closeButtonHovered, setCloseButtonHovered] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const hasSidebar = sidebarSections.length > 0

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

  const handleSidebarItemClick = (item: SidebarNavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id)
    } else {
      if (item.onClick) {
        item.onClick()
      } else if (onSidebarNavigate) {
        onSidebarNavigate(item.id)
      }
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: Z_INDEX.modalBackdrop,
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Menu panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 300,
        maxWidth: '85vw',
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
            onClick={onClose}
            onMouseEnter={() => setCloseButtonHovered(true)}
            onMouseLeave={() => setCloseButtonHovered(false)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: closeButtonHovered ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <Dismiss20Regular />
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0.75rem'
        }}
        className="forge-scrollbar-thin"
        >
          {/* Navbar items */}
          {items.map((item, index) => (
            <MobileMenuItem
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => onItemClick(item)}
              index={index}
            />
          ))}

          {/* Divider + Sidebar items */}
          {hasSidebar && (
            <>
              <div style={{
                height: 1,
                backgroundColor: 'var(--border-subtle)',
                margin: '0.75rem 0'
              }} />

              {sidebarSections.map((section, sectionIndex) => (
                <div key={sectionIndex} style={{ marginBottom: '0.75rem' }}>
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
                    const isActive = sidebarActiveId === item.id
                    const hasChildren = item.children && item.children.length > 0
                    const isExpanded = expandedItems.has(item.id)
                    const hasActiveChild = hasChildren && item.children!.some(c => c.id === sidebarActiveId)

                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => handleSidebarItemClick(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? ACTIVE_COLOR : hasActiveChild ? 'var(--text-primary)' : 'var(--text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: isActive || hasActiveChild ? 500 : 400,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          {item.icon && <span style={{ fontSize: 20, display: 'flex' }}>{item.icon}</span>}
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
                              const isChildActive = sidebarActiveId === child.id
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    if (child.onClick) {
                                      child.onClick()
                                    } else if (onSidebarNavigate) {
                                      onSidebarNavigate(child.id)
                                    }
                                    onClose()
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
                                    color: isChildActive ? ACTIVE_COLOR : 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    fontWeight: isChildActive ? 500 : 400,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'color 0.15s ease'
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
            </>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            animation: 'slideInUp 0.3s ease 0.1s both'
          }}>
            {actions}
          </div>
        )}
      </div>
    </>
  )
}

// ============================================
// BOTTOM NAV ITEM (with built-in animations)
// ============================================
interface BottomNavItemProps {
  item: NavbarItem
  isActive: boolean
  onClick: () => void
}

function BottomNavItem({ item, isActive, onClick }: BottomNavItemProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: isActive ? ACTIVE_COLOR : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed ? 'scale(0.9)' : 'scale(1)',
        position: 'relative'
      }}
    >
      {/* Icon with scale animation */}
      <span style={{
        display: 'flex',
        fontSize: 24,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1.1)' : 'scale(1)'
      }}>
        {item.icon}
      </span>

      {/* Label */}
      <span style={{
        fontSize: '0.625rem',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.15s ease'
      }}>
        {item.label}
      </span>

      {/* Active indicator dot */}
      <span style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: `translateX(-50%) scale(${isActive ? 1 : 0})`,
        width: 4,
        height: 4,
        borderRadius: '50%',
        backgroundColor: ACTIVE_COLOR,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }} />

      {/* Badge */}
      {item.badge !== undefined && item.badge !== 0 && (
        <span style={{
          position: 'absolute',
          top: 2,
          right: '50%',
          transform: 'translateX(14px)',
          minWidth: 16,
          height: 16,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-error)',
          color: 'white',
          fontSize: '0.625rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          animation: 'scaleIn 0.2s ease'
        }}>
          {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </button>
  )
}

// ============================================
// BOTTOM NAV (Mobile tab bar)
// ============================================
const defaultBottomNavItems: NavbarItem[] = [
  { id: 'home', label: 'Accueil', icon: <Home20Regular /> },
  { id: 'favorites', label: 'Favoris', icon: <Heart20Regular /> },
  { id: 'profile', label: 'Profil', icon: <Person20Regular /> },
  { id: 'settings', label: 'Paramètres', icon: <Settings20Regular /> }
]

interface BottomNavProps {
  items?: NavbarItem[]
  activeId?: string
  onNavigate?: (id: string) => void
  variant?: 'fixed' | 'floating'
}

export function BottomNav({ items, activeId = 'home', onNavigate, variant = 'floating' }: BottomNavProps) {
  const navItems = items ?? defaultBottomNavItems
  const navRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const handleClick = (item: NavbarItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (onNavigate) {
      onNavigate(item.id)
    }
  }

  // Update indicator position
  useEffect(() => {
    if (!activeId || !navRef.current) return

    const activeButton = buttonRefs.current.get(activeId)
    if (activeButton) {
      const navRect = navRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
        opacity: 1
      })
    }
  }, [activeId])

  const displayItems = navItems.slice(0, 5)

  if (variant === 'fixed') {
    return (
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: Z_INDEX.sticky,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {displayItems.map(item => (
          <BottomNavItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => handleClick(item)}
          />
        ))}
      </nav>
    )
  }

  // Floating variant (default)
  return (
    <nav style={{
      height: 56,
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 99,
      padding: '0.375rem'
    }}>
      <div
        ref={navRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* Sliding indicator */}
        <div
          style={{
            position: 'absolute',
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            height: '100%',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 99,
            transition: 'left 0.25s ease, width 0.25s ease, opacity 0.15s ease',
            opacity: indicatorStyle.opacity,
            pointerEvents: 'none'
          }}
        />

        {displayItems.map(item => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              ref={el => { if (el) buttonRefs.current.set(item.id, el) }}
              onClick={() => handleClick(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.125rem',
                flex: 1,
                padding: '0.5rem 0.25rem',
                minHeight: 44,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 99,
                color: isActive ? ACTIVE_COLOR : 'var(--text-muted)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.15s ease'
              }}
            >
              <span style={{ display: 'flex', fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: '0.5625rem', fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
              {item.badge !== undefined && item.badge !== 0 && (
                <span style={{
                  position: 'absolute',
                  top: 4,
                  right: '50%',
                  transform: 'translateX(16px)',
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ============================================
// TOP BAR (Simple app header)
// ============================================
interface TopBarProps {
  title?: string
  subtitle?: string
  leftAction?: ReactNode
  rightActions?: ReactNode
  transparent?: boolean
}

export function TopBar({
  title,
  subtitle,
  leftAction,
  rightActions,
  transparent = false
}: TopBarProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      height: 56,
      padding: '0 1rem',
      backgroundColor: transparent ? 'transparent' : 'var(--bg-secondary)'
    }}>
      {/* Left action */}
      {leftAction}

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h1 style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            margin: 0
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {rightActions}
      </div>
    </header>
  )
}
