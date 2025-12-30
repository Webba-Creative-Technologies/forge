import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Calendar20Regular
} from '@fluentui/react-icons'
import { Z_INDEX } from '../constants'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  locale?: string
}

const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  locale = 'en-US'
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value || new Date())
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      // Check if click is outside both the main container AND the calendar portal
      const isOutsideMain = ref.current && !ref.current.contains(target)
      const isOutsideCalendar = calendarRef.current && !calendarRef.current.contains(target)

      if (isOutsideMain && isOutsideCalendar) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Update position on scroll/resize when open
  useEffect(() => {
    if (!open || !buttonRef.current) return
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPos({ top: rect.bottom + 4, left: rect.left })
      }
    }
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open])

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Get day of week (Monday = 0)
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6

    const days: (Date | null)[] = []

    // Previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return value && date.toDateString() === value.toDateString()
  }

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const selectDate = (date: Date) => {
    if (!isDisabled(date)) {
      onChange(date)
      setOpen(false)
    }
  }

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
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setDropdownPos({ top: rect.bottom + 4, left: rect.left })
          }
          setOpen(!open)
        }}
        style={{
          width: '100%',
          height: 42,
          padding: '0 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid ${open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-sm)',
          color: value ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 0.15s ease'
        }}
      >
        <Calendar20Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{value ? formatDate(value) : placeholder}</span>
      </button>

      {open && createPortal(
        <div
          ref={calendarRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            zIndex: Z_INDEX.overlay,
            padding: '0.75rem',
            width: 280,
            animation: 'scaleIn 0.15s ease-out'
          }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <button
              type="button"
              onClick={prevMonth}
              className="interactive-icon"
              style={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <ChevronLeft20Regular />
            </button>
            <span style={{
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}>
              {MONTHS_EN[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="interactive-icon"
              style={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <ChevronRight20Regular />
            </button>
          </div>

          {/* Days header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 2,
            marginBottom: '0.25rem'
          }}>
            {DAYS_EN.map(day => (
              <div key={day} style={{
                textAlign: 'center',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                padding: '0.25rem'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 2
          }}>
            {getDaysInMonth(viewDate).map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} />
              }

              const disabled = isDisabled(date)
              const selected = isSelected(date)
              const today = isToday(date)

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => selectDate(date)}
                  disabled={disabled}
                  className={!selected && !disabled ? 'interactive-row' : undefined}
                  style={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.3 : 1,
                    backgroundColor: selected
                      ? 'var(--brand-primary)'
                      : today
                        ? 'rgba(163, 91, 255, 0.2)'
                        : 'transparent',
                    color: selected
                      ? 'white'
                      : today
                        ? 'var(--brand-primary)'
                        : 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: selected || today ? 600 : 400,
                    transition: 'background-color 0.1s'
                  }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
              className="interactive-row"
              style={{
                padding: '0.375rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                selectDate(new Date())
              }}
              className="interactive-row"
              style={{
                padding: '0.375rem 0.75rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// DateTime Picker (for events)
interface DateTimePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
}

export function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
  const formatDateTime = (date: Date | null) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val ? new Date(val) : null)
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
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
      <input
        type="datetime-local"
        value={formatDateTime(value)}
        onChange={handleChange}
        style={{
          width: '100%',
          height: 42,
          padding: '0 0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          outline: 'none'
        }}
      />
    </div>
  )
}
