import { ReactNode, useState, useRef, useEffect } from 'react'
import { ChevronDown16Regular, Checkmark16Regular } from '@fluentui/react-icons'

// ============================================
// TYPES
// ============================================
export interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  shortcut?: string  // Raccourci clavier (ex: "Ctrl+K")
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
}

export interface DropdownCategory {
  label: string
  items: DropdownItem[]
}

// Shared menu button style
const menuButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
  padding: '0.5rem 0.75rem',
  backgroundColor: 'transparent',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  textAlign: 'left',
  transition: 'all 0.15s ease'
}

// ============================================
// DROPDOWN MENU ITEM (with built-in hover animation)
// ============================================
function DropdownMenuItem({
  item,
  onSelect
}: {
  item: DropdownItem
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
// DROPDOWN (Action menu)
// ============================================
interface DropdownProps {
  trigger: ReactNode
  items?: DropdownItem[]
  categories?: DropdownCategory[]
  align?: 'left' | 'right'
  width?: string | number
  openOnHover?: boolean
}

export function Dropdown({
  trigger,
  items,
  categories,
  align = 'left',
  width = 220,
  openOnHover = false
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [adjustedAlign, setAdjustedAlign] = useState(align)
  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Adjust position if menu overflows viewport
  useEffect(() => {
    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      // Check if overflowing right
      if (rect.right > viewportWidth - 8) {
        setAdjustedAlign('right')
      }
      // Check if overflowing left
      else if (rect.left < 8) {
        setAdjustedAlign('left')
      } else {
        setAdjustedAlign(align)
      }
    }
  }, [open, align])

  // Reset alignment when closed
  useEffect(() => {
    if (!open) {
      setAdjustedAlign(align)
    }
  }, [open, align])

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={openOnHover ? () => setOpen(true) : undefined}
      onMouseLeave={openOnHover ? () => setOpen(false) : undefined}
    >
      <div onClick={openOnHover ? undefined : () => setOpen(!open)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: adjustedAlign === 'left' ? 0 : undefined,
            right: adjustedAlign === 'right' ? 0 : undefined,
            marginTop: 4,
            zIndex: 9999,
            minWidth: width,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
            padding: 6,
            animation: 'scaleIn 0.15s ease-out'
          }}
        >
          {items?.map(item => (
            <DropdownMenuItem key={item.id} item={item} onSelect={() => setOpen(false)} />
          ))}

          {categories?.map((cat, idx) => (
            <div key={cat.label}>
              {idx > 0 && <div style={{ height: 1, backgroundColor: 'var(--border-color)', margin: '4px 0' }} />}
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                padding: '0.5rem 0.75rem 0.25rem',
                letterSpacing: '0.05em'
              }}>
                {cat.label}
              </div>
              {cat.items.map(item => (
                <DropdownMenuItem key={item.id} item={item} onSelect={() => setOpen(false)} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// SELECT DROPDOWN (Form select with checkmark)
// ============================================
interface SelectDropdownProps {
  value: string
  options: { value: string; label: string; icon?: ReactNode; color?: string }[]
  onChange: (value: string) => void
  placeholder?: string
  width?: string | number
  size?: 'sm' | 'md'
}

export function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  width = '100%',
  size = 'md'
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  const sizeConfig = size === 'sm'
    ? { height: 36, fontSize: '0.8rem', padding: '0 1rem' }
    : { height: 42, fontSize: '0.875rem', padding: '0 1.25rem' }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', width }}>
      <button
        onClick={() => setOpen(!open)}
        className="dropdown-trigger"
        style={{
          width: '100%',
          height: sizeConfig.height,
          padding: sizeConfig.padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)',
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: sizeConfig.fontSize,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
          {selected?.color && (
            <span style={{
              width: 10,
              height: 10,
              borderRadius: 'var(--radius-xs)',
              backgroundColor: selected.color,
              flexShrink: 0
            }} />
          )}
          {selected?.icon}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selected?.label || placeholder}
          </span>
        </span>
        <ChevronDown16Regular style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease',
          color: 'var(--text-secondary)',
          flexShrink: 0
        }} />
      </button>

      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
            zIndex: 9999,
            padding: 6,
            maxHeight: 250,
            overflowY: 'auto',
            animation: 'scaleIn 0.15s ease-out'
          }}
        >
          {options.map(opt => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={isSelected ? undefined : 'interactive-row'}
                style={{
                  ...menuButtonStyle,
                  background: isSelected ? 'var(--brand-primary)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  marginBottom: 2
                }}
              >
                {opt.color && (
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: opt.color,
                    flexShrink: 0
                  }} />
                )}
                {opt.icon}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && <Checkmark16Regular style={{ flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================
// CONTEXT MENU
// ============================================
interface ContextMenuProps {
  items: DropdownItem[]
  x: number
  y: number
  onClose: () => void
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = () => onClose()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        backgroundColor: 'var(--bg-dropdown)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
        zIndex: 9999,
        padding: 6,
        minWidth: 200,
        animation: 'scaleIn 0.1s ease-out'
      }}
    >
      {items.map(item => {
        if (item.divider) {
          return <div key={item.id} style={{
            height: 1,
            backgroundColor: 'var(--border-color)',
            margin: '4px 0'
          }} />
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.()
                onClose()
              }
            }}
            className={item.disabled ? undefined : (item.destructive ? 'interactive-danger' : 'interactive-row')}
            style={{
              ...menuButtonStyle,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.5 : 1,
              color: item.destructive ? 'var(--color-error)' : 'var(--text-primary)'
            }}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.shortcut}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// useContextMenu hook
// ============================================
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: DropdownItem[] } | null>(null)

  const showContextMenu = (e: React.MouseEvent, items: DropdownItem[]) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, items })
  }

  const hideContextMenu = () => setContextMenu(null)

  const ContextMenuComponent = contextMenu ? (
    <ContextMenu
      x={contextMenu.x}
      y={contextMenu.y}
      items={contextMenu.items}
      onClose={hideContextMenu}
    />
  ) : null

  return { showContextMenu, hideContextMenu, ContextMenuComponent }
}
