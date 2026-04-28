import { ReactNode } from 'react'
import { useInteractionState } from '../hooks/useInteractionState'

// ============================================
// TOOLBAR (action bar)
// ============================================
export interface ToolbarItem {
  id: string
  icon?: ReactNode
  label?: string
  tooltip?: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  type?: 'button' | 'separator' | 'spacer'
}

interface ToolbarProps {
  items: ToolbarItem[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'floating'
  orientation?: 'horizontal' | 'vertical'
  children?: ReactNode
}

const toolbarSizes = {
  sm: { height: 36, iconSize: 16, padding: '0 0.5rem', buttonPadding: '0.25rem 0.5rem', fontSize: '0.75rem' },
  md: { height: 42, iconSize: 18, padding: '0 0.75rem', buttonPadding: '0.375rem 0.625rem', fontSize: '0.8125rem' },
  lg: { height: 48, iconSize: 20, padding: '0 1rem', buttonPadding: '0.5rem 0.75rem', fontSize: '0.875rem' }
}

export function Toolbar({
  items,
  size = 'md',
  variant = 'default',
  orientation = 'horizontal',
  children
}: ToolbarProps) {
  const config = toolbarSizes[size]
  const isVertical = orientation === 'vertical'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'stretch' : 'center',
    gap: '0.25rem',
    ...(isVertical ? { width: config.height } : { height: config.height }),
    padding: isVertical ? config.padding.split(' ').reverse().join(' ') : config.padding,
    backgroundColor: variant === 'ghost' ? 'transparent' : 'var(--bg-secondary)',
    borderRadius: variant === 'floating' ? 'var(--radius-lg)' : 'var(--radius-md)',
    border: variant === 'ghost' ? 'none' : '1px solid var(--border-subtle)',
    boxShadow: variant === 'floating' ? '0 2px 8px rgba(0,0,0,0.15)' : undefined
  }

  return (
    <div style={containerStyle} role="toolbar" aria-orientation={orientation}>
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <ToolbarSeparator key={item.id || `sep-${index}`} vertical={isVertical} />
        }
        if (item.type === 'spacer') {
          return <div key={item.id || `spacer-${index}`} style={{ flex: 1 }} />
        }
        return (
          <ToolbarButton
            key={item.id}
            item={item}
            size={size}
          />
        )
      })}
      {children}
    </div>
  )
}

// ============================================
// TOOLBAR BUTTON
// ============================================
function ToolbarButton({ item, size }: { item: ToolbarItem; size: 'sm' | 'md' | 'lg' }) {
  const { hovered, pressed, bind } = useInteractionState({ enabled: !item.disabled })
  const config = toolbarSizes[size]

  return (
    <button
      onClick={item.onClick}
      {...bind}
      disabled={item.disabled}
      title={item.tooltip || item.label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        padding: item.label ? config.buttonPadding : `0.375rem`,
        minWidth: item.label ? undefined : config.height - 8,
        height: config.height - 8,
        backgroundColor: item.active
          ? 'var(--bg-active, var(--bg-tertiary))'
          : hovered
            ? 'var(--bg-tertiary)'
            : 'transparent',
        color: item.active
          ? 'var(--active-color, #BF8DFF)'
          : item.disabled
            ? 'var(--text-muted)'
            : hovered
              ? 'var(--text-primary)'
              : 'var(--text-secondary)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        fontSize: config.fontSize,
        fontWeight: item.active ? 500 : 400,
        opacity: item.disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        userSelect: 'none'
      }}
    >
      {item.icon && (
        <span style={{ display: 'flex', fontSize: config.iconSize }}>
          {item.icon}
        </span>
      )}
      {item.label && <span>{item.label}</span>}
    </button>
  )
}

// ============================================
// TOOLBAR SEPARATOR
// ============================================
function ToolbarSeparator({ vertical }: { vertical?: boolean }) {
  return (
    <div style={{
      ...(vertical
        ? { height: 1, width: '60%', margin: '0.25rem auto' }
        : { width: 1, height: '60%', margin: '0 0.25rem' }),
      backgroundColor: 'var(--border-subtle)'
    }} />
  )
}

// ============================================
// TOOLBAR GROUP (visual grouping)
// ============================================
interface ToolbarGroupProps {
  children: ReactNode
}

export function ToolbarGroup({ children }: ToolbarGroupProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.125rem',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-sm)',
      padding: 2
    }}>
      {children}
    </div>
  )
}
