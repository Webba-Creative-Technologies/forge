import { useState, useRef, useEffect } from 'react'
import { Clock20Regular, ChevronUp16Regular, ChevronDown16Regular } from '@fluentui/react-icons'
import { IconButton } from './Button'
import { Button } from './Button'

// ============================================
// TIME PICKER
// ============================================
interface TimePickerProps {
  value?: string // "HH:mm" or "HH:mm:ss"
  onChange?: (time: string) => void
  format?: '12h' | '24h'
  showSeconds?: boolean
  minuteStep?: number
  disabled?: boolean
  placeholder?: string
  label?: string
  error?: string
  className?: string
  style?: React.CSSProperties
}

export function TimePicker({
  value,
  onChange,
  format = '24h',
  showSeconds = false,
  minuteStep = 1,
  disabled,
  placeholder = 'Sélectionner une heure',
  label,
  error,
  className,
  style
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState(12)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse initial value
  useEffect(() => {
    if (value) {
      const parts = value.split(':')
      let h = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const s = parts[2] ? parseInt(parts[2], 10) : 0

      if (format === '12h') {
        setPeriod(h >= 12 ? 'PM' : 'AM')
        h = h % 12 || 12
      }

      setHours(h)
      setMinutes(m)
      setSeconds(s)
    }
  }, [value, format])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (): string => {
    let h = hours
    if (format === '12h') {
      h = period === 'PM' ? (hours % 12) + 12 : hours % 12
      if (hours === 12) h = period === 'PM' ? 12 : 0
    }

    const hStr = h.toString().padStart(2, '0')
    const mStr = minutes.toString().padStart(2, '0')
    const sStr = seconds.toString().padStart(2, '0')

    return showSeconds ? `${hStr}:${mStr}:${sStr}` : `${hStr}:${mStr}`
  }

  const displayTime = (): string => {
    if (!value && !isOpen) return ''

    const hStr = hours.toString().padStart(2, '0')
    const mStr = minutes.toString().padStart(2, '0')
    const sStr = seconds.toString().padStart(2, '0')

    let time = showSeconds ? `${hStr}:${mStr}:${sStr}` : `${hStr}:${mStr}`
    if (format === '12h') time += ` ${period}`

    return time
  }

  const handleConfirm = () => {
    onChange?.(formatTime())
    setIsOpen(false)
  }

  const maxHours = format === '12h' ? 12 : 23
  const minHours = format === '12h' ? 1 : 0

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          marginBottom: 6,
          color: 'var(--text-primary)'
        }}>
          {label}
        </label>
      )}

      {/* Input */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          height: 42,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'var(--bg-primary)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          color: value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          textAlign: 'left',
          transition: 'border-color 0.15s ease'
        }}
      >
        <Clock20Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{displayTime() || placeholder}</span>
      </button>

      {error && (
        <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          padding: '1rem',
          zIndex: 2000,
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {/* Hours */}
            <TimeColumn
              value={hours}
              min={minHours}
              max={maxHours}
              onChange={setHours}
              label="Heure"
            />

            {/* Minutes */}
            <TimeColumn
              value={minutes}
              min={0}
              max={59}
              step={minuteStep}
              onChange={setMinutes}
              label="Min"
            />

            {/* Seconds */}
            {showSeconds && (
              <TimeColumn
                value={seconds}
                min={0}
                max={59}
                onChange={setSeconds}
                label="Sec"
              />
            )}

            {/* AM/PM */}
            {format === '12h' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Période
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    onClick={() => setPeriod('AM')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: period === 'AM' ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                      color: period === 'AM' ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setPeriod('PM')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: period === 'PM' ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                      color: period === 'PM' ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    PM
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirm}>
              Confirmer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// TIME COLUMN (spinner)
// ============================================
interface TimeColumnProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label: string
}

function TimeColumn({ value, min, max, step = 1, onChange, label }: TimeColumnProps) {
  const increment = () => {
    const next = value + step
    onChange(next > max ? min : next)
  }

  const decrement = () => {
    const prev = value - step
    onChange(prev < min ? max : prev)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
      <IconButton
        icon={<ChevronUp16Regular />}
        size="xs"
        onClick={increment}
      />
      <div style={{
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        fontSize: '1.25rem',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }}>
        {value.toString().padStart(2, '0')}
      </div>
      <IconButton
        icon={<ChevronDown16Regular />}
        size="xs"
        onClick={decrement}
      />
    </div>
  )
}

// ============================================
// TIME RANGE PICKER
// ============================================
interface TimeRangePickerProps {
  startTime?: string
  endTime?: string
  onChange?: (start: string, end: string) => void
  format?: '12h' | '24h'
  disabled?: boolean
  label?: string
  error?: string
  className?: string
  style?: React.CSSProperties
}

export function TimeRangePicker({
  startTime,
  endTime,
  onChange,
  format = '24h',
  disabled,
  label,
  error,
  className,
  style
}: TimeRangePickerProps) {
  const [start, setStart] = useState(startTime || '')
  const [end, setEnd] = useState(endTime || '')

  const handleStartChange = (time: string) => {
    setStart(time)
    onChange?.(time, end)
  }

  const handleEndChange = (time: string) => {
    setEnd(time)
    onChange?.(start, time)
  }

  return (
    <div className={className} style={style}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          marginBottom: 6,
          color: 'var(--text-primary)'
        }}>
          {label}
        </label>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <TimePicker
          value={start}
          onChange={handleStartChange}
          format={format}
          disabled={disabled}
          placeholder="Début"
          style={{ flex: 1 }}
        />
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <TimePicker
          value={end}
          onChange={handleEndChange}
          format={format}
          disabled={disabled}
          placeholder="Fin"
          style={{ flex: 1 }}
        />
      </div>

      {error && (
        <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>
      )}
    </div>
  )
}
