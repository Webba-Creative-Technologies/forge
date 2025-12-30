import { useState, useRef, useCallback, useEffect } from 'react'
import { SHADOWS } from '../constants'

// ============================================
// SLIDER - Modern with micro-animations
// ============================================
interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  marks?: { value: number; label?: string }[]
  showTooltip?: boolean | 'always'
  animated?: boolean
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  size = 'md',
  color = 'var(--brand-primary)',
  marks,
  showTooltip = true,
  animated = true
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [thumbHovered, setThumbHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(!animated)

  // Animation d'entrée progressive
  useEffect(() => {
    if (!animated) return
    const timer = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [animated])

  // Tailles variées : de fin à épais
  const sizeStyles = {
    sm: { track: 4, thumb: 14, trackHover: 6 },
    md: { track: 6, thumb: 18, trackHover: 8 },
    lg: { track: 10, thumb: 22, trackHover: 12 },
    xl: { track: 16, thumb: 28, trackHover: 18 }
  }

  const s = sizeStyles[size]
  const percentage = ((value - min) / (max - min)) * 100
  const isActive = isDragging || isHovered

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return

    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percent * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))

    if (clampedValue !== value) {
      onChange(clampedValue)
    }
  }, [min, max, step, value, onChange, disabled])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    updateValue(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX)
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      updateValue(e.touches[0].clientX)
    }
    const handleEnd = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, updateValue])

  const showTooltipNow = showTooltip === 'always' || (showTooltip && (isDragging || isHovered))

  // Track height avec animation
  const currentTrackHeight = isActive ? s.trackHover : s.track

  return (
    <div
      className="animate-fadeIn"
      style={{ width: '100%', opacity: disabled ? 0.5 : 1 }}
    >
      {/* Label and value */}
      {(label || showValue) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.625rem'
        }}>
          {label && (
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}>
              {label}
            </span>
          )}
          {showValue && (
            <span style={{
              fontSize: '0.875rem',
              color: isActive ? color : 'var(--text-secondary)',
              fontWeight: 600,
              transition: 'color 0.2s ease',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {formatValue(value)}
            </span>
          )}
        </div>
      )}

      {/* Track container - zone de clic plus grande */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          height: s.thumb + 16,
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          touchAction: 'none',
          padding: '8px 0'
        }}
      >
        {/* Track background */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: currentTrackHeight,
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: currentTrackHeight,
          transition: 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 0
        }} />

        {/* Track fill */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: hasAnimated ? `${percentage}%` : '0%',
          height: currentTrackHeight,
          backgroundColor: color,
          borderRadius: currentTrackHeight,
          transition: isDragging
            ? 'height 0.15s ease'
            : hasAnimated
              ? 'height 0.15s ease'
              : 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.15s ease',
          boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
          zIndex: 1
        }} />

        {/* Marks */}
        {marks && marks.map((mark) => {
          const markPercent = ((mark.value - min) / (max - min)) * 100
          const isActive = mark.value <= value
          return (
            <div
              key={mark.value}
              style={{
                position: 'absolute',
                left: `${markPercent}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none'
              }}
            >
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: isActive ? 'white' : 'var(--border-color)',
                border: `2px solid ${isActive ? color : 'var(--bg-tertiary)'}`,
                marginTop: s.thumb / 2 + currentTrackHeight / 2 + 8,
                transition: 'all 0.2s ease',
                transform: isActive ? 'scale(1)' : 'scale(0.8)'
              }} />
              {mark.label && (
                <span style={{
                  fontSize: '0.6875rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginTop: 6,
                  whiteSpace: 'nowrap',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'color 0.2s ease'
                }}>
                  {mark.label}
                </span>
              )}
            </div>
          )
        })}

        {/* Thumb avec animations */}
        <div
          onMouseEnter={() => !disabled && setThumbHovered(true)}
          onMouseLeave={() => setThumbHovered(false)}
          style={{
            position: 'absolute',
            left: hasAnimated ? `${percentage}%` : '0%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${isDragging ? 0.95 : thumbHovered ? 1.15 : 1})`,
            width: s.thumb,
            height: s.thumb,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: isDragging
              ? `0 0 0 6px ${color}25, 0 4px 16px rgba(0,0,0,0.25)`
              : thumbHovered
              ? `0 0 0 6px ${color}30, 0 0 20px ${color}40, 0 6px 16px rgba(0,0,0,0.25)`
              : '0 2px 8px rgba(0,0,0,0.15)',
            transition: isDragging
              ? 'transform 0.1s, box-shadow 0.1s'
              : hasAnimated
                ? 'transform 0.15s, box-shadow 0.15s'
                : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
            zIndex: 2
          }}>
          {/* Inner colored dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${isDragging ? 1 : 0})`,
            width: s.thumb * 0.4,
            height: s.thumb * 0.4,
            borderRadius: '50%',
            backgroundColor: color,
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: 0.9
          }} />

          {/* Highlight shine */}
          <div style={{
            position: 'absolute',
            top: 3,
            left: 3,
            right: 3,
            height: '35%',
            borderRadius: s.thumb / 2,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 100%)'
          }} />
        </div>

        {/* Tooltip avec animation */}
        <div style={{
          position: 'absolute',
          left: `${percentage}%`,
          bottom: s.thumb + 14,
          transform: `translateX(-50%) translateY(${showTooltipNow ? 0 : 8}px) scale(${showTooltipNow ? 1 : 0.9})`,
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.375rem 0.625rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          boxShadow: SHADOWS.soft.lg,
          opacity: showTooltipNow ? 1 : 0,
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {formatValue(value)}
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8,
            height: 8,
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)'
          }} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// RANGE SLIDER (dual handles)
// ============================================
interface RangeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  minDistance?: number
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  size = 'md',
  color = 'var(--brand-primary)',
  minDistance = 0
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null)
  const [hoveredThumb, setHoveredThumb] = useState<0 | 1 | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isDragging = activeThumb !== null

  // Animation d'entrée progressive
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const sizeStyles = {
    sm: { track: 4, thumb: 14, trackHover: 6 },
    md: { track: 6, thumb: 18, trackHover: 8 },
    lg: { track: 10, thumb: 22, trackHover: 12 },
    xl: { track: 16, thumb: 28, trackHover: 18 }
  }

  const s = sizeStyles[size]
  const [minVal, maxVal] = value
  const minPercent = ((minVal - min) / (max - min)) * 100
  const maxPercent = ((maxVal - min) / (max - min)) * 100
  const isActive = activeThumb !== null || hoveredThumb !== null

  const currentTrackHeight = isActive ? s.trackHover : s.track

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percent * (max - min)
    return Math.round(rawValue / step) * step
  }, [min, max, step])

  const handleMouseDown = (thumb: 0 | 1) => (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setActiveThumb(thumb)
  }

  const handleTouchStart = (thumb: 0 | 1) => (e: React.TouchEvent) => {
    if (disabled) return
    e.stopPropagation()
    setActiveThumb(thumb)
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled || activeThumb !== null) return

    const clickValue = getValueFromPosition(e.clientX)
    const distToMin = Math.abs(clickValue - minVal)
    const distToMax = Math.abs(clickValue - maxVal)
    const thumb = distToMin < distToMax ? 0 : 1

    let newValue: [number, number] = [...value]
    if (thumb === 0) {
      newValue[0] = Math.max(min, Math.min(clickValue, maxVal - minDistance))
    } else {
      newValue[1] = Math.min(max, Math.max(clickValue, minVal + minDistance))
    }
    onChange(newValue)
  }

  // Global mouse/touch handlers
  useEffect(() => {
    if (activeThumb === null) return

    const handleMove = (clientX: number) => {
      const newVal = getValueFromPosition(clientX)
      let newValue: [number, number] = [...value]

      if (activeThumb === 0) {
        newValue[0] = Math.max(min, Math.min(newVal, value[1] - minDistance))
      } else {
        newValue[1] = Math.min(max, Math.max(newVal, value[0] + minDistance))
      }

      if (newValue[0] !== value[0] || newValue[1] !== value[1]) {
        onChange(newValue)
      }
    }

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }
    const handleEnd = () => setActiveThumb(null)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [activeThumb, value, min, max, minDistance, onChange, getValueFromPosition])

  const renderThumb = (thumb: 0 | 1, percent: number, val: number) => {
    const isThisActive = activeThumb === thumb
    const isThisHovered = hoveredThumb === thumb
    const showTooltip = isThisActive || isThisHovered

    return (
      <div
        key={thumb}
        onMouseDown={handleMouseDown(thumb)}
        onTouchStart={handleTouchStart(thumb)}
        onMouseEnter={() => setHoveredThumb(thumb)}
        onMouseLeave={() => setHoveredThumb(null)}
        style={{
          position: 'absolute',
          left: hasAnimated ? `${percent}%` : '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${isThisActive ? 0.95 : isThisHovered ? 1.15 : 1})`,
          width: s.thumb,
          height: s.thumb,
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: isThisActive
            ? `0 0 0 6px ${color}25, 0 4px 16px rgba(0,0,0,0.25)`
            : isThisHovered
            ? `0 0 0 6px ${color}30, 0 0 20px ${color}40, 0 6px 16px rgba(0,0,0,0.25)`
            : '0 2px 8px rgba(0,0,0,0.15)',
          transition: isDragging ? 'transform 0.1s, box-shadow 0.1s' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: disabled ? 'not-allowed' : isThisActive ? 'grabbing' : 'grab',
          zIndex: isThisActive ? 3 : isThisHovered ? 2 : 1
        }}
      >
        {/* Inner colored dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isThisActive ? 1 : 0})`,
          width: s.thumb * 0.4,
          height: s.thumb * 0.4,
          borderRadius: '50%',
          backgroundColor: color,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: 0.9
        }} />

        {/* Highlight */}
        <div style={{
          position: 'absolute',
          top: 3,
          left: 3,
          right: 3,
          height: '35%',
          borderRadius: s.thumb / 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 100%)'
        }} />

        {/* Tooltip */}
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: s.thumb + 6,
          transform: `translateX(-50%) translateY(${showTooltip ? 0 : 8}px) scale(${showTooltip ? 1 : 0.9})`,
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.375rem 0.625rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          boxShadow: SHADOWS.soft.lg,
          opacity: showTooltip ? 1 : 0,
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {formatValue(val)}
          <div style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8,
            height: 8,
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)'
          }} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="animate-fadeIn"
      style={{ width: '100%', opacity: disabled ? 0.5 : 1 }}
    >
      {/* Label and value */}
      {(label || showValue) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.625rem'
        }}>
          {label && (
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}>
              {label}
            </span>
          )}
          {showValue && (
            <span style={{
              fontSize: '0.875rem',
              color: isActive ? color : 'var(--text-secondary)',
              fontWeight: 600,
              transition: 'color 0.2s ease',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {formatValue(minVal)} — {formatValue(maxVal)}
            </span>
          )}
        </div>
      )}

      {/* Track container */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        onMouseLeave={() => setHoveredThumb(null)}
        style={{
          position: 'relative',
          height: s.thumb + 16,
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          touchAction: 'none',
          padding: '8px 0'
        }}
      >
        {/* Track background */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: currentTrackHeight,
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: currentTrackHeight,
          transition: 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 0
        }} />

        {/* Track fill (between thumbs) */}
        <div style={{
          position: 'absolute',
          left: hasAnimated ? `${minPercent}%` : '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: hasAnimated ? `${maxPercent - minPercent}%` : '0%',
          height: currentTrackHeight,
          backgroundColor: color,
          borderRadius: currentTrackHeight,
          transition: isDragging
            ? 'height 0.15s ease'
            : hasAnimated
              ? 'height 0.15s ease'
              : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
          zIndex: 1
        }} />

        {/* Thumbs */}
        {renderThumb(0, minPercent, minVal)}
        {renderThumb(1, maxPercent, maxVal)}
      </div>
    </div>
  )
}
