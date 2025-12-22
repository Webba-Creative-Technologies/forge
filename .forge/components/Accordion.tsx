import { useState, useRef, useEffect, ReactNode, createContext, useContext } from 'react'
import { ChevronDown20Regular } from '@fluentui/react-icons'

// ============================================
// ACCORDION CONTEXT
// ============================================
interface AccordionContextValue {
  expandedItems: Set<string>
  toggleItem: (id: string) => void
  multiple: boolean
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

// ============================================
// ACCORDION
// ============================================
interface AccordionProps {
  children: ReactNode
  defaultExpanded?: string | string[]
  multiple?: boolean
  onChange?: (expanded: string[]) => void
}

export function Accordion({
  children,
  defaultExpanded,
  multiple = false,
  onChange
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (!defaultExpanded) return new Set()
    return new Set(Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded])
  })

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)

      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!multiple) {
          newSet.clear()
        }
        newSet.add(id)
      }

      onChange?.(Array.from(newSet))
      return newSet
    })
  }

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, multiple }}>
      <div className="animate-fadeIn" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// ============================================
// ACCORDION ITEM
// ============================================
interface AccordionItemProps {
  id: string
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  disabled?: boolean
  badge?: ReactNode
}

export function AccordionItem({
  id,
  title,
  subtitle,
  icon,
  children,
  disabled = false,
  badge
}: AccordionItemProps) {
  const context = useContext(AccordionContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion')
  }

  const { expandedItems, toggleItem } = context
  const isExpanded = expandedItems.has(id)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isExpanded])

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      {/* Header */}
      <button
        onClick={() => toggleItem(id)}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '1rem 1.25rem',
          backgroundColor: hovered && !disabled ? 'var(--bg-tertiary)' : 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        {/* Icon */}
        {icon && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0
          }}>
            {icon}
          </span>
        )}

        {/* Title & subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginTop: 2
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Badge */}
        {badge}

        {/* Chevron */}
        <ChevronDown20Regular
          style={{
            fontSize: 20,
            color: 'var(--text-muted)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Content */}
      <div style={{
        height: isExpanded ? contentHeight : 0,
        overflow: 'hidden',
        transition: 'height 0.25s ease'
      }}>
        <div ref={contentRef} style={{
          padding: '0 1.25rem 1.25rem',
          paddingLeft: icon ? '3rem' : '1.25rem'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// COLLAPSIBLE (standalone, simpler version)
// ============================================
interface CollapsibleProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  icon?: ReactNode
  headerAction?: ReactNode
  variant?: 'default' | 'ghost' | 'card'
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  icon,
  headerAction,
  variant = 'default'
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isOpen])

  const variantStyles = {
    default: {
      container: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      },
      header: {
        padding: '1rem 1.25rem'
      },
      content: {
        padding: '0 1.25rem 1.25rem'
      }
    },
    ghost: {
      container: {
        backgroundColor: 'transparent'
      },
      header: {
        padding: '0.75rem 0'
      },
      content: {
        padding: '0 0 0.75rem'
      }
    },
    card: {
      container: {
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      },
      header: {
        padding: '1rem 1.25rem',
        borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none'
      },
      content: {
        padding: '1rem 1.25rem'
      }
    }
  }

  const styles = variantStyles[variant]

  return (
    <div style={styles.container}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          backgroundColor: hovered ? 'var(--bg-tertiary)' : 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
          ...styles.header
        }}
      >
        {/* Icon */}
        {icon && (
          <span style={{ display: 'flex', color: 'var(--text-primary)' }}>
            {icon}
          </span>
        )}

        {/* Title */}
        <span style={{
          flex: 1,
          fontSize: '0.9375rem',
          fontWeight: 500
        }}>
          {title}
        </span>

        {/* Header action */}
        {headerAction && (
          <span onClick={e => e.stopPropagation()}>
            {headerAction}
          </span>
        )}

        {/* Chevron */}
        <ChevronDown20Regular
          style={{
            fontSize: 20,
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease'
          }}
        />
      </button>

      {/* Content */}
      <div style={{
        height: isOpen ? contentHeight : 0,
        overflow: 'hidden',
        transition: 'height 0.25s ease'
      }}>
        <div ref={contentRef} style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// FAQ ACCORDION (pre-styled for FAQ use case)
// ============================================
interface FAQItem {
  question: string
  answer: ReactNode
}

interface FAQAccordionProps {
  items: FAQItem[]
  multiple?: boolean
}

export function FAQAccordion({ items, multiple = false }: FAQAccordionProps) {
  return (
    <Accordion multiple={multiple}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          id={`faq-${index}`}
          title={item.question}
        >
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            {item.answer}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// ============================================
// COLLAPSIBLE CARD (independent, accordion style)
// ============================================
interface CollapsibleCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  defaultOpen?: boolean
  icon?: ReactNode
  badge?: ReactNode
  onToggle?: (isOpen: boolean) => void
}

export function CollapsibleCard({
  title,
  subtitle,
  children,
  defaultOpen = false,
  icon,
  badge,
  onToggle
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isOpen])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <button
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '1rem 1.25rem',
          backgroundColor: hovered ? 'var(--bg-tertiary)' : 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: pressed ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        {/* Icon */}
        {icon && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0
          }}>
            {icon}
          </span>
        )}

        {/* Title & subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginTop: 2
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Badge */}
        {badge}

        {/* Chevron */}
        <ChevronDown20Regular
          style={{
            fontSize: 20,
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Content */}
      <div style={{
        height: isOpen ? contentHeight : 0,
        overflow: 'hidden',
        transition: 'height 0.25s ease'
      }}>
        <div ref={contentRef} style={{
          padding: '0 1.25rem 1.25rem',
          paddingLeft: icon ? '3rem' : '1.25rem'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
