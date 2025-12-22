import { useState } from 'react'

// ============================================
// SWITCH / TOGGLE
// ============================================
interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Switch({
  checked,
  onChange,
  disabled,
  label,
  description,
  size = 'md'
}: SwitchProps) {
  const [hovered, setHovered] = useState(false)
  const [pressing, setPressing] = useState(false)

  const sizeStyles = {
    sm: { track: { width: 32, height: 18 }, thumb: 14, offset: 2 },
    md: { track: { width: 40, height: 22 }, thumb: 18, offset: 2 },
    lg: { track: { width: 48, height: 26 }, thumb: 22, offset: 2 }
  }

  const s = sizeStyles[size]

  // Thumb position calculation
  const thumbLeft = checked
    ? s.track.width - s.thumb - s.offset
    : s.offset

  // Thumb stretch effect when pressing
  const thumbWidth = pressing && !disabled ? s.thumb + 4 : s.thumb
  const thumbLeftAdjust = pressing && !disabled && checked ? thumbLeft - 4 : thumbLeft

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: '0.625rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressing(false) }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
    >
      {/* Hidden input for accessibility */}
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />

      {/* Track */}
      <span
        style={{
          position: 'relative',
          width: s.track.width,
          height: s.track.height,
          borderRadius: s.track.height / 2,
          backgroundColor: checked ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
          border: checked ? 'none' : '1px solid var(--border-color)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: checked
            ? hovered && !disabled
              ? '0 0 0 4px color-mix(in srgb, var(--brand-primary) 20%, transparent), inset 0 2px 4px rgba(0,0,0,0.1)'
              : 'inset 0 2px 4px rgba(0,0,0,0.1)'
            : hovered && !disabled
              ? '0 0 0 4px rgba(255, 255, 255, 0.05)'
              : 'none',
          flexShrink: 0
        }}
      >
        {/* Glow effect when checked */}
        {checked && (
          <span
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: s.track.height / 2,
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
              opacity: hovered ? 0.3 : 0,
              transition: 'opacity 0.2s ease',
              zIndex: 0
            }}
          />
        )}

        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: thumbLeftAdjust,
            transform: `translateY(-50%) ${pressing && !disabled ? 'scale(0.95)' : 'scale(1)'}`,
            width: thumbWidth,
            height: s.thumb,
            borderRadius: s.thumb / 2,
            backgroundColor: 'white',
            boxShadow: checked
              ? '0 2px 8px color-mix(in srgb, var(--brand-primary) 40%, transparent), 0 1px 2px rgba(0,0,0,0.2)'
              : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
          }}
        >
          {/* Inner highlight */}
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              height: '40%',
              borderRadius: s.thumb / 2,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
              opacity: 0.5
            }}
          />
        </span>
      </span>

      {/* Label and description */}
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {label && (
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              lineHeight: 1.3
            }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}

// ============================================
// SWITCH GROUP (for settings panels)
// ============================================
interface SwitchGroupProps {
  items: Array<{
    id: string
    label: string
    description?: string
    checked: boolean
  }>
  onChange: (id: string, checked: boolean) => void
  disabled?: boolean
}

export function SwitchGroup({ items, onChange, disabled }: SwitchGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map(item => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            gap: '1rem'
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}>
              {item.label}
            </div>
            {item.description && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.125rem'
              }}>
                {item.description}
              </div>
            )}
          </div>
          <Switch
            checked={item.checked}
            onChange={(checked) => onChange(item.id, checked)}
            disabled={disabled}
            size="sm"
          />
        </div>
      ))}
    </div>
  )
}
