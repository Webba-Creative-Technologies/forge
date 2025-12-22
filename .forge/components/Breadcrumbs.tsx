import { ReactNode, Fragment, useState } from 'react'
import { ChevronRight12Regular, Home20Regular } from '@fluentui/react-icons'

// ============================================
// TYPES
// ============================================
export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: ReactNode
}

// ============================================
// HOME BUTTON (internal)
// ============================================
function HomeButton({ href, onClick, iconSize }: { href?: string; onClick?: () => void; iconSize: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 'var(--radius-sm)',
        color: isHovered ? 'var(--brand-primary)' : 'var(--text-muted)',
        backgroundColor: isHovered ? 'var(--bg-tertiary)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
        transform: isPressed ? 'scale(0.92)' : isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <Home20Regular style={{ fontSize: iconSize }} />
    </a>
  )
}

// ============================================
// BREADCRUMB ITEM COMPONENT (internal)
// ============================================
interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem
  isLast: boolean
  fontSize: string
  iconSize: number
}

function BreadcrumbItemComponent({ item, isLast, fontSize, iconSize }: BreadcrumbItemComponentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const isClickable = !isLast && (item.href || item.onClick)

  const content = (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem'
    }}>
      {item.icon && (
        <span style={{
          display: 'flex',
          fontSize: iconSize,
          transition: 'transform 0.15s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}>
          {item.icon}
        </span>
      )}
      <span style={{
        position: 'relative'
      }}>
        {item.label}
        {/* Underline animation */}
        {isClickable && (
          <span style={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: 1.5,
            backgroundColor: 'var(--brand-primary)',
            borderRadius: 'var(--radius-xs)',
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0.8
          }} />
        )}
      </span>
    </span>
  )

  const baseStyle: React.CSSProperties = {
    fontSize,
    textDecoration: 'none',
    transition: 'color 0.15s ease, transform 0.15s ease',
    transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    display: 'inline-flex',
    alignItems: 'center'
  }

  if (isClickable) {
    const clickableStyle: React.CSSProperties = {
      ...baseStyle,
      color: isHovered ? 'var(--brand-primary)' : 'var(--text-secondary)',
      cursor: 'pointer'
    }

    if (item.href) {
      return (
        <a
          href={item.href}
          style={clickableStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        onClick={item.onClick}
        style={{
          ...clickableStyle,
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {content}
      </button>
    )
  }

  // Last item (current page) - non clickable
  return (
    <span style={{
      ...baseStyle,
      color: 'var(--text-primary)',
      fontWeight: 500
    }}>
      {content}
    </span>
  )
}

// ============================================
// BREADCRUMBS
// ============================================
interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
  showHome?: boolean
  homeHref?: string
  onHomeClick?: () => void
  maxItems?: number
  size?: 'sm' | 'md' | 'lg'
}

export function Breadcrumbs({
  items,
  separator,
  showHome = false,
  homeHref = '/',
  onHomeClick,
  maxItems,
  size = 'md'
}: BreadcrumbsProps) {
  const sizeStyles = {
    sm: { fontSize: '0.75rem', gap: '0.375rem', iconSize: 14 },
    md: { fontSize: '0.8125rem', gap: '0.5rem', iconSize: 16 },
    lg: { fontSize: '0.875rem', gap: '0.625rem', iconSize: 18 }
  }

  const s = sizeStyles[size]

  // Handle collapsing if maxItems is set
  let displayItems = items
  let collapsed = false

  if (maxItems && items.length > maxItems) {
    const firstItem = items[0]
    const lastItems = items.slice(-(maxItems - 1))
    displayItems = [firstItem, ...lastItems]
    collapsed = true
  }

  const defaultSeparator = (
    <ChevronRight12Regular
      style={{
        fontSize: s.iconSize,
        color: 'var(--text-muted)',
        flexShrink: 0
      }}
    />
  )

  const renderItem = (item: BreadcrumbItem, isLast: boolean, index: number) => {
    return (
      <span
        key={index}
        className="animate-fadeIn"
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: 'backwards'
        }}
      >
        <BreadcrumbItemComponent
          item={item}
          isLast={isLast}
          fontSize={s.fontSize}
          iconSize={s.iconSize}
        />
      </span>
    )
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="animate-fadeIn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: s.gap,
        flexWrap: 'wrap'
      }}
    >
      {/* Home icon */}
      {showHome && (
        <>
          {homeHref || onHomeClick ? (
            <HomeButton
              href={homeHref}
              onClick={onHomeClick}
              iconSize={s.iconSize + 2}
            />
          ) : (
            <span style={{
              display: 'flex',
              color: 'var(--text-muted)'
            }}>
              <Home20Regular style={{ fontSize: s.iconSize + 2 }} />
            </span>
          )}
          {separator || defaultSeparator}
        </>
      )}

      {/* Items */}
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1
        const showCollapsedIndicator = collapsed && index === 0

        return (
          <Fragment key={index}>
            {renderItem(item, isLast, index)}

            {/* Collapsed indicator */}
            {showCollapsedIndicator && (
              <>
                {separator || defaultSeparator}
                <span style={{
                  fontSize: s.fontSize,
                  color: 'var(--text-muted)',
                  padding: '0 0.25rem'
                }}>
                  ...
                </span>
              </>
            )}

            {/* Separator */}
            {!isLast && (separator || defaultSeparator)}
          </Fragment>
        )
      })}
    </nav>
  )
}

// ============================================
// BREADCRUMB LINK (for custom rendering)
// ============================================
interface BreadcrumbLinkProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  isActive?: boolean
}

export function BreadcrumbLink({
  href,
  onClick,
  children,
  isActive = false
}: BreadcrumbLinkProps) {
  const style: React.CSSProperties = {
    fontSize: '0.8125rem',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontWeight: isActive ? 500 : 400,
    textDecoration: 'none',
    transition: 'color 0.15s ease'
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={!isActive ? 'interactive-text' : undefined}
        style={style}
      >
        {children}
      </a>
    )
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={!isActive ? 'interactive-text' : undefined}
        style={{
          ...style,
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        {children}
      </button>
    )
  }

  return <span style={style}>{children}</span>
}

// ============================================
// PAGE BREADCRUMB (with page title integration)
// ============================================
interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageBreadcrumb({
  items,
  title,
  subtitle,
  actions
}: PageBreadcrumbProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={items} size="sm" />

      {/* Title row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              margin: '0.25rem 0 0'
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
