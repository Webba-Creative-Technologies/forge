import { useState } from 'react'
import { Star20Filled, Star20Regular, StarHalf20Filled } from '@fluentui/react-icons'

// ============================================
// RATING
// ============================================
interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  readOnly?: boolean
  allowHalf?: boolean
  showValue?: boolean
  label?: string
  className?: string
  style?: React.CSSProperties
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = 'md',
  color = 'var(--warning)',
  readOnly = false,
  allowHalf = false,
  showValue = false,
  label,
  className,
  style
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pressedIndex, setPressedIndex] = useState<number | null>(null)

  const sizeConfig = {
    sm: { icon: 16, gap: 2 },
    md: { icon: 20, gap: 4 },
    lg: { icon: 28, gap: 6 }
  }

  const config = sizeConfig[size]
  const displayValue = hoverValue !== null ? hoverValue : value

  const handleClick = (index: number, isHalf: boolean) => {
    if (readOnly || !onChange) return
    const newValue = isHalf ? index + 0.5 : index + 1
    onChange(newValue)
  }

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (readOnly) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isHalf = allowHalf && x < rect.width / 2
    setHoverValue(isHalf ? index + 0.5 : index + 1)
    setHoveredIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
    setHoveredIndex(null)
  }

  return (
    <div className={className} style={style}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.375rem'
        }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap
      }}>
        {Array.from({ length: max }, (_, index) => {
          const filled = displayValue >= index + 1
          const half = allowHalf && displayValue === index + 0.5

          const isHovered = hoveredIndex === index
          const isPressed = pressedIndex === index

          return (
            <span
              key={index}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const isHalf = allowHalf && x < rect.width / 2
                handleClick(index, isHalf)
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onMouseDown={() => !readOnly && setPressedIndex(index)}
              onMouseUp={() => setPressedIndex(null)}
              style={{
                display: 'flex',
                cursor: readOnly ? 'default' : 'pointer',
                color: filled || half ? color : 'var(--text-muted)',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.2)' : 'scale(1)',
                filter: isHovered ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' : 'none'
              }}
            >
              {half ? (
                <StarHalf20Filled style={{ fontSize: config.icon }} />
              ) : filled ? (
                <Star20Filled style={{ fontSize: config.icon }} />
              ) : (
                <Star20Regular style={{ fontSize: config.icon }} />
              )}
            </span>
          )
        })}
        {showValue && (
          <span style={{
            marginLeft: 4,
            fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            {value.toFixed(allowHalf ? 1 : 0)}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// RATING DISPLAY (Read-only compact)
// ============================================
interface RatingDisplayProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  color?: string
  showCount?: number
}

export function RatingDisplay({
  value,
  max: _max = 5,
  size = 'sm',
  color = 'var(--warning)',
  showCount
}: RatingDisplayProps) {
  const iconSize = size === 'sm' ? 14 : 18

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Star20Filled style={{ fontSize: iconSize, color }} />
      <span style={{
        fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
        fontWeight: 600,
        color: 'var(--text-primary)'
      }}>
        {value.toFixed(1)}
      </span>
      {showCount !== undefined && (
        <span style={{
          fontSize: size === 'sm' ? '0.6875rem' : '0.8125rem',
          color: 'var(--text-muted)'
        }}>
          ({showCount})
        </span>
      )}
    </div>
  )
}
