import { ReactNode, useState, useRef, useEffect } from 'react'
import { SIZES } from './Button'
import { useDraggableScroll } from '../hooks/useDraggableScroll'

// ============================================
// TABS (with sliding indicator)
// ============================================
interface Tab {
  id: string
  label: string
  icon?: ReactNode
  count?: number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  stretchLine?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function Tabs({
  tabs,
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  stretchLine = true,
  orientation = 'horizontal'
}: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Update indicator position
  useEffect(() => {
    const activeButton = tabRefs.current.get(value)
    if (activeButton && containerRef.current) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth
      })
    }
  }, [value, tabs])

  const sizeStyles = {
    xs: { padding: '0.375rem 0.75rem', fontSize: '0.75rem' },
    sm: { padding: '0.5rem 1rem',      fontSize: '0.8125rem' },
    md: { padding: '0.75rem 1.25rem',  fontSize: '0.875rem' },
    lg: { padding: '1rem 1.5rem',      fontSize: '1rem' },
    xl: { padding: '1.25rem 1.75rem',  fontSize: '1.0625rem' }
  }

  const isVertical = orientation === 'vertical'

  if (variant === 'pills') {
    return (
      <div role="tablist" aria-orientation={isVertical ? 'vertical' : 'horizontal'} style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: '0.5rem',
        width: fullWidth ? '100%' : 'fit-content',
        overflowX: isVertical ? 'hidden' : 'auto',
        overflowY: isVertical ? 'auto' : 'hidden',
        maxWidth: '100%',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {tabs.map(tab => {
          const isActive = tab.id === value
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              data-tab-id={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              style={{
                ...sizeStyles[size],
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
                transition: 'all 0.15s ease',
                flex: fullWidth ? 1 : 'none',
                justifyContent: 'center'
              }}
            >
              {tab.icon}
              {tab.label}
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span style={{
                  backgroundColor: isActive ? 'color-mix(in srgb, currentColor 20%, transparent)' : 'var(--bg-secondary)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.75rem'
                }}>
                  {tab.count > 99 ? '99+' : tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Underline variant (with sliding indicator)
  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        ...(isVertical
          ? { borderRight: '1px solid var(--border-subtle)' }
          : { borderBottom: '1px solid var(--border-subtle)' }),
        position: 'relative',
        width: isVertical ? 'fit-content' : (fullWidth || stretchLine) ? '100%' : 'fit-content',
        overflowX: isVertical ? 'hidden' : 'auto',
        overflowY: isVertical ? 'auto' : 'hidden',
        maxWidth: '100%',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Sliding indicator */}
      {!isVertical && (
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            height: 2,
            backgroundColor: 'var(--brand-primary)',
            transition: 'left 0.25s ease, width 0.25s ease',
            borderRadius: 1
          }}
        />
      )}
      {tabs.map(tab => {
        const isActive = tab.id === value
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            data-tab-id={tab.id}
            ref={(el) => { if (el) tabRefs.current.set(tab.id, el) }}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={!isActive ? 'interactive-nav' : undefined}
            style={{
              ...sizeStyles[size],
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              ...(isVertical
                ? {
                    borderRight: `2px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
                    marginRight: -1,
                  }
                : {
                    borderBottom: '2px solid transparent',
                    marginBottom: -1,
                  }),
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.5 : 1,
              transition: 'color 0.15s ease, border-color 0.15s ease',
              flex: fullWidth ? 1 : 'none',
              justifyContent: fullWidth ? 'center' : 'flex-start',
              textAlign: 'left',
              width: isVertical ? '100%' : undefined
            }}
          >
            {tab.icon}
            {tab.label}
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span style={{
                backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                padding: '0.125rem 0.5rem',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.75rem',
                transition: 'background-color 0.15s ease, color 0.15s ease'
              }}>
                {tab.count > 99 ? '99+' : tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// TAB PANELS
// ============================================
interface TabPanelsProps {
  children: ReactNode
  value: string
}

export function TabPanels({ children }: TabPanelsProps) {
  return <>{children}</>
}

// ============================================
// TAB PANEL
// ============================================
interface TabPanelProps {
  id: string
  value: string
  children: ReactNode
}

export function TabPanel({ id, value, children }: TabPanelProps) {
  if (id !== value) return null
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      style={{ animation: 'fadeIn 0.15s ease-out' }}
    >
      {children}
    </div>
  )
}

// ============================================
// PILL TABS (Draggable horizontal scroll with sliding indicator)
// ============================================
interface PillTab {
  value: string
  label: string
}

interface PillTabsProps {
  tabs: PillTab[]
  value: string
  onChange: (value: string) => void
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function PillTabs({ tabs, value, onChange, size = 'md' }: PillTabsProps) {
  const { containerRef, isDragging, handlers } = useDraggableScroll()
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const innerRef = useRef<HTMLDivElement>(null)

  // Merge refs
  const setContainerRef = (el: HTMLDivElement | null) => {
    if (containerRef) {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    }
    (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }

  useEffect(() => {
    const activeButton = pillRefs.current.get(value)
    if (activeButton && innerRef.current) {
      const containerRect = innerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left + innerRef.current.scrollLeft,
        width: buttonRect.width
      })
    }
  }, [value, tabs])

  const handleClick = (tabValue: string) => {
    if (!isDragging) {
      onChange(tabValue)
    }
  }

  const heightByKey: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
    xs: SIZES.xs.height as string,
    sm: SIZES.sm.height as string,
    md: SIZES.md.height as string,
    lg: SIZES.lg.height as string,
    xl: SIZES.xl.height as string
  }
  const height = heightByKey[size]
  const innerHeight = `calc(${height} - 4px)`
  const fontSizeByKey: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
    xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem', xl: '0.9375rem'
  }
  const fontSize = fontSizeByKey[size]

  return (
    <div
      ref={setContainerRef}
      {...handlers}
      className="pill-tabs-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        padding: 2,
        width: 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
        cursor: 'grab',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'relative'
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          height: 'calc(100% - 4px)',
          backgroundColor: 'var(--brand-primary)',
          borderRadius: 'var(--radius-sm)',
          transition: 'left 0.25s ease, width 0.25s ease',
          zIndex: 0
        }}
      />
      {tabs.map((tab) => {
        const isActive = value === tab.value
        return (
          <button
            key={tab.value}
            ref={(el) => { if (el) pillRefs.current.set(tab.value, el) }}
            onClick={() => handleClick(tab.value)}
            style={{
              height: innerHeight,
              padding: '0 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: isActive ? 'white' : 'var(--text-muted)',
              fontSize,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: isDragging ? 'grabbing' : 'pointer',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// VIEW TOGGLE (Icon-based toggle with sliding indicator)
// ============================================
interface ViewOption {
  value: string
  icon: ReactNode
  label?: string
}

interface ViewToggleProps {
  options: ViewOption[]
  value: string
  onChange: (value: string) => void
}

export function ViewToggle({ options, value, onChange }: ViewToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    const activeButton = buttonRefs.current.get(value)
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width
      })
    }
  }, [value, options])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        padding: 2,
        position: 'relative'
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          height: 'calc(100% - 4px)',
          backgroundColor: 'var(--brand-primary)',
          borderRadius: 'var(--radius-sm)',
          transition: 'left 0.2s ease, width 0.2s ease',
          zIndex: 0
        }}
      />
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            ref={(el) => { if (el) buttonRefs.current.set(option.value, el) }}
            onClick={() => onChange(option.value)}
            title={option.label}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: isActive ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            {option.icon}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// PILLS (Standalone filter pills)
// ============================================
interface PillOption {
  id: string
  label: React.ReactNode
  count?: number
}

interface PillsProps {
  options: PillOption[]
  value: string | string[]
  onChange: (id: string) => void
  multiple?: boolean
}

export function Pills({ options, value, onChange, multiple = false }: PillsProps) {
  const isSelected = (id: string) =>
    multiple ? (value as string[]).includes(id) : value === id

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-xl)',
            border: 'none',
            backgroundColor: isSelected(opt.id) ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
            color: isSelected(opt.id) ? 'white' : 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            transition: 'all 0.15s ease'
          }}
        >
          {opt.label}
          {typeof opt.count === 'number' && (
            <span style={{
              backgroundColor: isSelected(opt.id) ? 'color-mix(in srgb, currentColor 20%, transparent)' : 'var(--bg-secondary)',
              padding: '0.125rem 0.375rem',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.6875rem'
            }}>
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
