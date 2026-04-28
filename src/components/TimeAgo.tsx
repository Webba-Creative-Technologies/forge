import { useState, useEffect, CSSProperties } from 'react'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

export interface TimeAgoLabels {
  now?: string
  secondsAgo?: (n: number) => string
  minuteAgo?: string
  minutesAgo?: (n: number) => string
  hourAgo?: string
  hoursAgo?: (n: number) => string
  dayAgo?: string
  daysAgo?: (n: number) => string
  weekAgo?: string
  weeksAgo?: (n: number) => string
  monthAgo?: string
  monthsAgo?: (n: number) => string
  yearAgo?: string
  yearsAgo?: (n: number) => string
  // Future tense
  inSeconds?: (n: number) => string
  inMinute?: string
  inMinutes?: (n: number) => string
  inHour?: string
  inHours?: (n: number) => string
  inDay?: string
  inDays?: (n: number) => string
}

const DEFAULT_LABELS: Required<TimeAgoLabels> = {
  now: 'just now',
  secondsAgo: (n) => `${n}s ago`,
  minuteAgo: '1m ago',
  minutesAgo: (n) => `${n}m ago`,
  hourAgo: '1h ago',
  hoursAgo: (n) => `${n}h ago`,
  dayAgo: 'yesterday',
  daysAgo: (n) => `${n}d ago`,
  weekAgo: 'last week',
  weeksAgo: (n) => `${n}w ago`,
  monthAgo: 'last month',
  monthsAgo: (n) => `${n}mo ago`,
  yearAgo: 'last year',
  yearsAgo: (n) => `${n}y ago`,
  inSeconds: (n) => `in ${n}s`,
  inMinute: 'in 1m',
  inMinutes: (n) => `in ${n}m`,
  inHour: 'in 1h',
  inHours: (n) => `in ${n}h`,
  inDay: 'tomorrow',
  inDays: (n) => `in ${n}d`
}

/**
 * Format a past/future date as a relative time string ("2m ago", "in 3h").
 * Pure function, no React.
 */
export function formatTimeAgo(date: Date | string | number, labels?: TimeAgoLabels, now: number = Date.now()): string {
  const ts = typeof date === 'number' ? date : new Date(date).getTime()
  const diff = now - ts  // positive = past, negative = future
  const abs = Math.abs(diff)
  const l = { ...DEFAULT_LABELS, ...labels }

  if (diff >= 0) {
    // Past
    if (abs < 10 * SECOND) return l.now
    if (abs < MINUTE) return l.secondsAgo(Math.floor(abs / SECOND))
    if (abs < 2 * MINUTE) return l.minuteAgo
    if (abs < HOUR) return l.minutesAgo(Math.floor(abs / MINUTE))
    if (abs < 2 * HOUR) return l.hourAgo
    if (abs < DAY) return l.hoursAgo(Math.floor(abs / HOUR))
    if (abs < 2 * DAY) return l.dayAgo
    if (abs < WEEK) return l.daysAgo(Math.floor(abs / DAY))
    if (abs < 2 * WEEK) return l.weekAgo
    if (abs < MONTH) return l.weeksAgo(Math.floor(abs / WEEK))
    if (abs < 2 * MONTH) return l.monthAgo
    if (abs < YEAR) return l.monthsAgo(Math.floor(abs / MONTH))
    if (abs < 2 * YEAR) return l.yearAgo
    return l.yearsAgo(Math.floor(abs / YEAR))
  }

  // Future
  if (abs < MINUTE) return l.inSeconds(Math.floor(abs / SECOND))
  if (abs < 2 * MINUTE) return l.inMinute
  if (abs < HOUR) return l.inMinutes(Math.floor(abs / MINUTE))
  if (abs < 2 * HOUR) return l.inHour
  if (abs < DAY) return l.inHours(Math.floor(abs / HOUR))
  if (abs < 2 * DAY) return l.inDay
  return l.inDays(Math.floor(abs / DAY))
}

/**
 * Subscribe to a live-updating relative time string.
 * Recomputes every `interval` ms (default 60s for anything older than 1 minute).
 */
export function useTimeAgo(date: Date | string | number, labels?: TimeAgoLabels, interval?: number): string {
  const [, tick] = useState(0)

  useEffect(() => {
    const ts = typeof date === 'number' ? date : new Date(date).getTime()
    const age = Math.abs(Date.now() - ts)
    const next = interval ?? (age < MINUTE ? SECOND : age < HOUR ? MINUTE : HOUR)
    const id = setInterval(() => tick(v => v + 1), next)
    return () => clearInterval(id)
  }, [date, interval])

  return formatTimeAgo(date, labels)
}

interface TimeAgoProps {
  /** The date or timestamp to render relatively. */
  date: Date | string | number
  /** Custom labels. Falls back to English defaults. */
  labels?: TimeAgoLabels
  /** Refresh interval in ms. Defaults to smart: 1s for <1m, 1m for <1h, 1h after. */
  interval?: number
  /** Show the absolute date on hover as a `title` attribute. Default `true`. */
  showTitle?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Render a live-updating relative time. Wraps `useTimeAgo` with a `<time>` element.
 *
 * @example
 *   <TimeAgo date={post.createdAt} />
 *   <TimeAgo date={comment.date} labels={{ now: 'right now' }} />
 */
export function TimeAgo({ date, labels, interval, showTitle = true, className, style }: TimeAgoProps) {
  const text = useTimeAgo(date, labels, interval)
  const iso = typeof date === 'number' ? new Date(date).toISOString() : new Date(date).toISOString()
  const absolute = new Date(date).toLocaleString()

  return (
    <time
      dateTime={iso}
      title={showTitle ? absolute : undefined}
      className={className}
      style={style}
    >
      {text}
    </time>
  )
}
