import { useState, useRef, useEffect, CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Calendar20Regular,
  Dismiss20Regular,
  ChevronUp16Regular,
  ChevronDown16Regular
} from '@fluentui/react-icons'
import { SIZES } from './Button'
import { COLORS, Z_INDEX } from '../constants'

const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const pad = (n: number) => n.toString().padStart(2, '0')

function getDaysInMonth(date: Date): (Date | null)[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6

  const days: (Date | null)[] = []
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
  return days
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate) {
    const min = new Date(minDate)
    min.setHours(0, 0, 0, 0)
    if (date < min) return true
  }
  if (maxDate) {
    const max = new Date(maxDate)
    max.setHours(23, 59, 59, 999)
    if (date > max) return true
  }
  return false
}

const navBtnStyle: CSSProperties = {
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
}

// ============================================
// CALENDAR GRID PANEL (shared by DatePicker + DateTimePicker popups)
// ============================================
interface CalendarGridPanelProps {
  viewDate: Date
  onViewDateChange: (d: Date) => void
  selectedDate: Date | null
  onSelectDate: (d: Date) => void
  minDate?: Date
  maxDate?: Date
}

function CalendarGridPanel({
  viewDate,
  onViewDateChange,
  selectedDate,
  onSelectDate,
  minDate,
  maxDate
}: CalendarGridPanelProps) {
  const today = new Date()

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <button
          type="button"
          onClick={() => onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          className="interactive-icon"
          style={navBtnStyle}
          aria-label="Previous month"
        >
          <ChevronLeft20Regular />
        </button>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
          {MONTHS_EN[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          className="interactive-icon"
          style={navBtnStyle}
          aria-label="Next month"
        >
          <ChevronRight20Regular />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
        marginBottom: '0.25rem'
      }}>
        {DAYS_EN.map(d => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            padding: '0.25rem'
          }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {getDaysInMonth(viewDate).map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />
          const dis = isDateDisabled(date, minDate, maxDate)
          const sel = selectedDate ? isSameDay(date, selectedDate) : false
          const tod = isSameDay(date, today)
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => !dis && onSelectDate(date)}
              disabled={dis}
              className={!sel && !dis ? 'interactive-row' : undefined}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: 'none',
                cursor: dis ? 'not-allowed' : 'pointer',
                opacity: dis ? 0.3 : 1,
                backgroundColor: sel
                  ? 'var(--brand-primary)'
                  : tod
                    ? 'var(--bg-active)'
                    : 'transparent',
                color: sel
                  ? 'white'
                  : tod
                    ? 'var(--brand-primary)'
                    : 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: sel || tod ? 600 : 400,
                transition: 'background-color 0.1s'
              }}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </>
  )
}

// ============================================
// DATE PICKER
// ============================================
interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  locale?: string
  disabled?: boolean
  error?: string
  hint?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  locale = 'en-US',
  disabled,
  error,
  hint,
  clearable = true,
  size = 'md',
  required
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value || new Date())
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const s = SIZES[size]

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      const isOutsideMain = ref.current && !ref.current.contains(target)
      const isOutsideCalendar = calendarRef.current && !calendarRef.current.contains(target)
      if (isOutsideMain && isOutsideCalendar) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const selectDate = (date: Date) => {
    onChange(date)
    setOpen(false)
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
          {required && <span style={{ color: COLORS.error, marginLeft: 4 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            if (disabled) return
            if (!open && buttonRef.current) {
              const rect = buttonRef.current.getBoundingClientRect()
              setDropdownPos({ top: rect.bottom + 4, left: rect.left })
            }
            setOpen(!open)
          }}
          style={{
            width: '100%',
            height: s.height,
            padding: '0 0.75rem',
            paddingRight: clearable && value ? '2.5rem' : '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${error ? COLORS.error : open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
            borderRadius: s.borderRadius,
            color: value ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: s.fontSize,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            textAlign: 'left',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box'
          }}
        >
          <Calendar20Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{value ? formatDate(value) : placeholder}</span>
        </button>

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null) }}
            style={{
              position: 'absolute',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            aria-label="Clear date"
          >
            <Dismiss20Regular style={{ fontSize: 12 }} />
          </button>
        )}
      </div>

      {open && createPortal(
        <div
          ref={calendarRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: Z_INDEX.overlay,
            padding: '0.75rem',
            width: 280,
            animation: 'scaleIn 0.15s ease-out'
          }}
        >
          <CalendarGridPanel
            viewDate={viewDate}
            onViewDateChange={setViewDate}
            selectedDate={value}
            onSelectDate={selectDate}
            minDate={minDate}
            maxDate={maxDate}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false) }}
              className="interactive-row"
              style={footerBtnStyle('muted')}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => selectDate(new Date())}
              className="interactive-row"
              style={footerBtnStyle('primary')}
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}

      {error && (
        <p style={{ color: COLORS.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{hint}</p>
      )}
    </div>
  )
}

function footerBtnStyle(tone: 'muted' | 'primary'): CSSProperties {
  return {
    padding: '0.375rem 0.75rem',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: tone === 'primary' ? 'var(--text-primary)' : 'var(--text-muted)',
    fontSize: '0.8125rem',
    cursor: 'pointer'
  }
}

// ============================================
// TIME SPINNER (compact horizontal, used inside DateTimePicker popup)
// ============================================
interface SpinCellProps {
  value: number
  onChange: (next: number) => void
  min: number
  max: number
  step?: number
}

function SpinCell({ value, onChange, min, max, step = 1 }: SpinCellProps) {
  const inc = () => {
    const next = value + step
    onChange(next > max ? min : next)
  }
  const dec = () => {
    const prev = value - step
    onChange(prev < min ? max : prev)
  }
  const chevronStyle: CSSProperties = {
    width: 28,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-xs)'
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button type="button" onClick={inc} className="interactive-icon" style={chevronStyle} tabIndex={-1} aria-hidden>
        <ChevronUp16Regular />
      </button>
      <div style={{
        width: 40,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.9375rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {pad(value)}
      </div>
      <button type="button" onClick={dec} className="interactive-icon" style={chevronStyle} tabIndex={-1} aria-hidden>
        <ChevronDown16Regular />
      </button>
    </div>
  )
}

interface TimeSpinnerProps {
  hours: number
  minutes: number
  seconds: number
  period: 'AM' | 'PM'
  format: '12h' | '24h'
  showSeconds: boolean
  minuteStep: number
  onHoursChange: (h: number) => void
  onMinutesChange: (m: number) => void
  onSecondsChange: (s: number) => void
  onPeriodChange: (p: 'AM' | 'PM') => void
}

function TimeSpinner({
  hours,
  minutes,
  seconds,
  period,
  format,
  showSeconds,
  minuteStep,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  onPeriodChange
}: TimeSpinnerProps) {
  const maxHours = format === '12h' ? 12 : 23
  const minHours = format === '12h' ? 1 : 0

  const colon: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginTop: 18
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '0.5rem 0'
    }}>
      <SpinCell value={hours} onChange={onHoursChange} min={minHours} max={maxHours} />
      <span style={colon}>:</span>
      <SpinCell value={minutes} onChange={onMinutesChange} min={0} max={59} step={minuteStep} />
      {showSeconds && (
        <>
          <span style={colon}>:</span>
          <SpinCell value={seconds} onChange={onSecondsChange} min={0} max={59} />
        </>
      )}
      {format === '12h' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 8,
          marginTop: 18,
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden'
        }}>
          {(['AM', 'PM'] as const).map(p => {
            const active = p === period
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  background: active ? 'var(--brand-primary)' : 'transparent',
                  color: active ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================
// DATE TIME PICKER (unified single-input, single-popup)
// ============================================
interface DateTimePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  locale?: string
  disabled?: boolean
  error?: string
  hint?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
  format?: '12h' | '24h'
  minuteStep?: number
  showSeconds?: boolean
  showNow?: boolean
  nowLabel?: string
  okLabel?: string
  clearLabel?: string
}

interface PendingState {
  date: Date | null
  hours: number
  minutes: number
  seconds: number
  period: 'AM' | 'PM'
}

function toPending(value: Date | null, format: '12h' | '24h'): PendingState {
  const base = value || new Date()
  const h24 = base.getHours()
  return {
    date: value,
    hours: format === '12h' ? (h24 % 12 || 12) : h24,
    minutes: base.getMinutes(),
    seconds: base.getSeconds(),
    period: h24 >= 12 ? 'PM' : 'AM'
  }
}

function pendingToDate(p: PendingState, format: '12h' | '24h', showSeconds: boolean): Date | null {
  if (!p.date) return null
  const out = new Date(p.date)
  let h = p.hours
  if (format === '12h') {
    const base = p.hours % 12
    h = p.period === 'PM' ? base + 12 : base
  }
  out.setHours(h, p.minutes, showSeconds ? p.seconds : 0, 0)
  return out
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date and time',
  minDate,
  maxDate,
  locale = 'en-US',
  disabled,
  error,
  hint,
  clearable = true,
  size = 'md',
  required,
  format = '24h',
  minuteStep = 1,
  showSeconds = false,
  showNow = true,
  nowLabel = 'Now',
  okLabel = 'OK',
  clearLabel = 'Clear'
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<PendingState>(() => toPending(value, format))
  const [viewDate, setViewDate] = useState<Date>(value || new Date())
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const s = SIZES[size]

  // Reset pending state each time the popup opens (so cancel via outside click discards edits)
  useEffect(() => {
    if (open) {
      setPending(toPending(value, format))
      setViewDate(value || new Date())
    }
  }, [open, value, format])

  // Outside click closes without committing
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      const isOutsideMain = ref.current && !ref.current.contains(target)
      const isOutsidePopup = popupRef.current && !popupRef.current.contains(target)
      if (isOutsideMain && isOutsidePopup) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Keep popup anchored to the trigger on scroll/resize
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

  // Keyboard: Esc cancels, Enter commits
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); e.stopPropagation() }
      if (e.key === 'Enter') { commit(); e.stopPropagation() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pending])

  const formatDisplay = (d: Date | null) => {
    if (!d) return ''
    const datePart = d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    let timePart: string
    if (format === '12h') {
      const h12 = d.getHours() % 12 || 12
      const suffix = d.getHours() >= 12 ? 'PM' : 'AM'
      timePart = showSeconds
        ? `${pad(h12)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${suffix}`
        : `${pad(h12)}:${pad(d.getMinutes())} ${suffix}`
    } else {
      timePart = showSeconds
        ? `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        : `${pad(d.getHours())}:${pad(d.getMinutes())}`
    }
    return `${datePart}, ${timePart}`
  }

  const toggle = () => {
    if (disabled) return
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen(!open)
  }

  const commit = () => {
    const out = pendingToDate(pending, format, showSeconds)
    onChange(out)
    setOpen(false)
  }

  const setNow = () => {
    const n = new Date()
    setPending(toPending(n, format))
    setViewDate(n)
  }

  const clearAll = () => {
    onChange(null)
    setOpen(false)
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
          {required && <span style={{ color: COLORS.error, marginLeft: 4 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={!!error}
          style={{
            width: '100%',
            height: s.height,
            padding: '0 0.75rem',
            paddingRight: clearable && value ? '2.5rem' : '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${error ? COLORS.error : open ? 'var(--brand-primary)' : 'var(--border-color)'}`,
            borderRadius: s.borderRadius,
            color: value ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: s.fontSize,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            textAlign: 'left',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box'
          }}
        >
          <Calendar20Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{value ? formatDisplay(value) : placeholder}</span>
        </button>

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null) }}
            style={{
              position: 'absolute',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            aria-label="Clear value"
          >
            <Dismiss20Regular style={{ fontSize: 12 }} />
          </button>
        )}
      </div>

      {open && createPortal(
        <div
          ref={popupRef}
          role="dialog"
          aria-label={label || 'Select date and time'}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: Z_INDEX.overlay,
            padding: 0,
            width: 440 + (format === '12h' ? 80 : 0) + (showSeconds ? 60 : 0),
            animation: 'scaleIn 0.15s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ padding: '0.75rem', width: 280, flex: '0 0 auto' }}>
              <CalendarGridPanel
                viewDate={viewDate}
                onViewDateChange={setViewDate}
                selectedDate={pending.date}
                onSelectDate={d => setPending(p => ({ ...p, date: d }))}
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
            <div style={{ width: 1, backgroundColor: 'var(--border-color)' }} />
            <div style={{
              padding: '0.75rem',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                Time
              </div>
              <TimeSpinner
                hours={pending.hours}
                minutes={pending.minutes}
                seconds={pending.seconds}
                period={pending.period}
                format={format}
                showSeconds={showSeconds}
                minuteStep={minuteStep}
                onHoursChange={h => setPending(p => ({ ...p, hours: h }))}
                onMinutesChange={m => setPending(p => ({ ...p, minutes: m }))}
                onSecondsChange={sec => setPending(p => ({ ...p, seconds: sec }))}
                onPeriodChange={pe => setPending(p => ({ ...p, period: pe }))}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '0.625rem 0.75rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {showNow && (
                <button
                  type="button"
                  onClick={setNow}
                  className="interactive-row"
                  style={footerBtnStyle('muted')}
                >
                  {nowLabel}
                </button>
              )}
              {clearable && value && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="interactive-row"
                  style={footerBtnStyle('muted')}
                >
                  {clearLabel}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={commit}
              disabled={!pending.date}
              style={{
                padding: '0.4375rem 0.875rem',
                background: pending.date ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: pending.date ? 'white' : 'var(--text-muted)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: pending.date ? 'pointer' : 'not-allowed'
              }}
            >
              {okLabel}
            </button>
          </div>
        </div>,
        document.body
      )}

      {error && (
        <p role="alert" style={{ marginTop: 6, fontSize: '0.75rem', color: COLORS.error }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</p>
      )}
    </div>
  )
}
