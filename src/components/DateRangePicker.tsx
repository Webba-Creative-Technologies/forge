import { CSSProperties } from 'react'
import { DatePicker } from './DatePicker'
import { ArrowRight16Regular } from '@fluentui/react-icons'
import { COLORS } from '../constants'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  label?: string
  startPlaceholder?: string
  endPlaceholder?: string
  minDate?: Date
  maxDate?: Date
  locale?: string
  disabled?: boolean
  error?: string
  hint?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Date range picker. Composes two DatePicker inputs with a linked constraint:
 * the end picker's minDate is always the start date, and clearing the start
 * date also clears the end date.
 *
 * @example
 *   const [range, setRange] = useState<DateRange>({ start: null, end: null })
 *   <DateRangePicker value={range} onChange={setRange} label="Event dates" />
 */
export function DateRangePicker({
  value,
  onChange,
  label,
  startPlaceholder = 'Start',
  endPlaceholder = 'End',
  minDate,
  maxDate,
  locale,
  disabled,
  error,
  hint,
  clearable = true,
  size = 'md',
  required,
  className,
  style
}: DateRangePickerProps) {
  const handleStart = (start: Date | null) => {
    if (start && value.end && start > value.end) {
      // User picked a start after the current end — clear end
      onChange({ start, end: null })
      return
    }
    onChange({ start, end: value.end })
  }

  const handleEnd = (end: Date | null) => {
    onChange({ start: value.start, end })
  }

  return (
    <div className={className} style={style}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <DatePicker
            value={value.start}
            onChange={handleStart}
            placeholder={startPlaceholder}
            minDate={minDate}
            maxDate={value.end ?? maxDate}
            locale={locale}
            disabled={disabled}
            clearable={clearable}
            size={size}
          />
        </div>
        <ArrowRight16Regular
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          aria-hidden
        />
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <DatePicker
            value={value.end}
            onChange={handleEnd}
            placeholder={endPlaceholder}
            minDate={value.start ?? minDate}
            maxDate={maxDate}
            locale={locale}
            disabled={disabled || !value.start}
            clearable={clearable}
            size={size}
          />
        </div>
      </div>
      {error && (
        <p role="alert" style={{ marginTop: 6, fontSize: '0.75rem', color: COLORS.error }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</p>
      )}
    </div>
  )
}
