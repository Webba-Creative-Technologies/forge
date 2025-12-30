import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown16Regular } from '@fluentui/react-icons'
import { useIsMobile } from '../hooks/useResponsive'
import { Z_INDEX, SHADOWS } from '../constants'

// ============================================
// PRESET COLORS (Webba palette)
// ============================================
export const PRESET_COLORS = [
  '#A35BFF', '#FD9173', '#10b981', '#3b82f6',
  '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7', '#f43f5e', '#0ea5e9'
]

export const PROJECT_COLORS = [
  { name: 'Violet', value: '#A35BFF' },
  { name: 'Coral', value: '#FD9173' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Lime', value: '#84cc16' }
]

// ============================================
// COLOR PICKER
// ============================================
interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  colors?: string[]
  label?: string
  showInput?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ColorPicker({
  value,
  onChange,
  colors = PRESET_COLORS,
  label,
  showInput = false,
  size = 'md'
}: ColorPickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue)
    }
  }

  // Responsive sizes - bigger touch targets on mobile
  const sizeStyles = {
    sm: { swatch: isMobile ? 24 : 20, grid: isMobile ? 32 : 20, gap: isMobile ? 8 : 4 },
    md: { swatch: isMobile ? 28 : 24, grid: isMobile ? 36 : 24, gap: isMobile ? 8 : 6 },
    lg: { swatch: isMobile ? 36 : 32, grid: isMobile ? 40 : 28, gap: isMobile ? 10 : 8 }
  }

  const { swatch, grid, gap } = sizeStyles[size]

  // Fewer columns on mobile for better fit
  const columns = isMobile ? Math.min(5, colors.length) : Math.min(8, colors.length)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }}>
          {label}
        </label>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          height: 42,
          padding: '0 0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease'
        }}
      >
        <div style={{
          width: swatch,
          height: swatch,
          borderRadius: 'var(--radius-xs)',
          backgroundColor: value,
          border: '2px solid rgba(255,255,255,0.1)'
        }} />
        {showInput && (
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {value}
          </span>
        )}
        <ChevronDown16Regular style={{
          color: 'var(--text-muted)',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.15s'
        }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          padding: '0.75rem',
          backgroundColor: 'var(--bg-dropdown)',
          borderRadius: 'var(--radius-md)',
          boxShadow: SHADOWS.elevation.dropdown,
          zIndex: Z_INDEX.dropdown,
          animation: 'scaleIn 0.15s ease-out'
        }}>
          {/* Color grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, ${grid}px)`,
            gap
          }}>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => {
                  onChange(color)
                  setOpen(false)
                }}
                style={{
                  width: grid,
                  height: grid,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: color,
                  border: value === color ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                  boxShadow: value === color ? '0 0 0 2px var(--brand-primary)' : undefined
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
          </div>

          {/* Custom color input */}
          {showInput && (
            <div style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  style={{
                    width: 36,
                    height: 42,
                    padding: 0,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#A35BFF"
                  style={{
                    flex: 1,
                    padding: '0 0.75rem',
                    height: 42,
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// COLOR SWATCH (Simple color display)
// ============================================
interface ColorSwatchProps {
  color: string
  size?: number
  onClick?: () => void
  selected?: boolean
}

export function ColorSwatch({ color, size = 24, onClick, selected }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        backgroundColor: color,
        border: selected ? '2px solid white' : '2px solid transparent',
        boxShadow: selected ? `0 0 0 2px ${color}` : undefined,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.1s'
      }}
    />
  )
}

// ============================================
// COLOR PALETTE (Inline color selection)
// ============================================
interface ColorPaletteProps {
  value: string
  onChange: (color: string) => void
  colors?: string[]
  size?: number
}

export function ColorPalette({
  value,
  onChange,
  colors = PRESET_COLORS,
  size = 24
}: ColorPaletteProps) {
  const isMobile = useIsMobile()
  // Ensure minimum 36px touch targets on mobile
  const responsiveSize = isMobile ? Math.max(36, size) : size
  const responsiveGap = isMobile ? 10 : 6

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: responsiveGap }}>
      {colors.map(color => (
        <ColorSwatch
          key={color}
          color={color}
          size={responsiveSize}
          selected={value === color}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}
