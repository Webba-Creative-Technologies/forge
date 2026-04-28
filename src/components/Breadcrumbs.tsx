import { ReactNode, Fragment } from 'react'
import { Home20Regular } from '@fluentui/react-icons'
import { useInteractionState } from '../hooks/useInteractionState'

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
  const { hovered: isHovered, pressed: isPressed, bind } = useInteractionState()

  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      {...bind}
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
  const isClickable = !isLast && (item.href || item.onClick)
  const { hovered: isHovered, pressed: isPressed, bind } = useInteractionState({ enabled: !!isClickable })

  const content = (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      lineHeight: 1
    }}>
      {item.icon && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: iconSize,
          transition: 'transform 0.15s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}>
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
    </span>
  )

  const baseStyle: React.CSSProperties = {
    fontSize,
    lineHeight: 1,
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
          {...bind}
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
        {...bind}
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
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: '0.5em',
        height: '1em',
        lineHeight: 1,
        color: 'var(--text-muted)'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 8 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <path
          d="M2 6 L6 10 L2 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
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
        flexWrap: 'wrap',
        lineHeight: 1
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
