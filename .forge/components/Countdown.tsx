import { useState, useEffect, useRef } from 'react'
import {
  Play16Filled,
  Pause16Filled,
  ArrowResetRegular
} from '@fluentui/react-icons'
import { IconButton } from './Button'

// ============================================
// COUNTDOWN (to a target date)
// ============================================
interface CountdownProps {
  targetDate: Date
  onComplete?: () => void
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  labels?: {
    days?: string
    hours?: string
    minutes?: string
    seconds?: string
  }
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'cards'
  className?: string
  style?: React.CSSProperties
}

export function Countdown({
  targetDate,
  onComplete,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  labels = { days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes' },
  size = 'md',
  variant = 'default',
  className,
  style
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const completedRef = useRef(false)

  function calculateTimeLeft() {
    const now = new Date().getTime()
    const target = targetDate.getTime()
    const diff = Math.max(0, target - now)

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      total: diff
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.total === 0 && !completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const sizeStyles = {
    sm: { fontSize: '1.25rem', padding: '0.5rem 0.75rem', labelSize: '0.625rem' },
    md: { fontSize: '2rem', padding: '0.75rem 1rem', labelSize: '0.75rem' },
    lg: { fontSize: '3rem', padding: '1rem 1.5rem', labelSize: '0.875rem' }
  }

  const s = sizeStyles[size]

  const units = [
    { key: 'days', value: timeLeft.days, label: labels.days, show: showDays },
    { key: 'hours', value: timeLeft.hours, label: labels.hours, show: showHours },
    { key: 'minutes', value: timeLeft.minutes, label: labels.minutes, show: showMinutes },
    { key: 'seconds', value: timeLeft.seconds, label: labels.seconds, show: showSeconds }
  ].filter(u => u.show)

  if (variant === 'compact') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...style }}>
        {units.map((unit, index) => (
          <span key={unit.key} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {String(unit.value).padStart(2, '0')}
            {index < units.length - 1 && <span style={{ opacity: 0.5 }}>:</span>}
          </span>
        ))}
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className={className} style={{ display: 'flex', gap: 12, ...style }}>
        {units.map((unit) => (
          <div
            key={unit.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: s.padding,
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              minWidth: size === 'lg' ? 100 : size === 'md' ? 80 : 60
            }}
          >
            <span style={{
              fontSize: s.fontSize,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-primary)'
            }}>
              {String(unit.value).padStart(2, '0')}
            </span>
            <span style={{
              fontSize: s.labelSize,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Default variant
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      {units.map((unit, index) => (
        <div key={unit.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: s.fontSize,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-primary)'
            }}>
              {String(unit.value).padStart(2, '0')}
            </span>
            <div style={{
              fontSize: s.labelSize,
              color: 'var(--text-muted)'
            }}>
              {unit.label}
            </div>
          </div>
          {index < units.length - 1 && (
            <span style={{ fontSize: s.fontSize, color: 'var(--text-muted)', fontWeight: 300 }}>:</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// TIMER (stopwatch style - counts up or down)
// ============================================
interface TimerProps {
  initialSeconds?: number
  autoStart?: boolean
  countDown?: boolean
  onComplete?: () => void
  onTick?: (seconds: number) => void
  showControls?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export function Timer({
  initialSeconds = 0,
  autoStart = false,
  countDown = false,
  onComplete,
  onTick,
  showControls = true,
  size = 'md',
  className,
  style
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = countDown ? prev - 1 : prev + 1
          onTick?.(next)

          if (countDown && next <= 0) {
            setIsRunning(false)
            onComplete?.()
            return 0
          }

          return next
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, countDown, onComplete, onTick])

  const toggle = () => setIsRunning(!isRunning)
  const reset = () => {
    setSeconds(initialSeconds)
    setIsRunning(false)
  }

  const formatTime = (secs: number): string => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60

    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const sizeStyles = {
    sm: { fontSize: '1.5rem' },
    md: { fontSize: '2.5rem' },
    lg: { fontSize: '4rem' }
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, ...style }}>
      <span style={{
        fontSize: sizeStyles[size].fontSize,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'monospace',
        color: 'var(--text-primary)'
      }}>
        {formatTime(seconds)}
      </span>

      {showControls && (
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton
            icon={isRunning ? <Pause16Filled /> : <Play16Filled />}
            variant="subtle"
            onClick={toggle}
          />
          <IconButton
            icon={<ArrowResetRegular />}
            variant="ghost"
            onClick={reset}
          />
        </div>
      )}
    </div>
  )
}

// ============================================
// COUNTDOWN SIMPLE (just numbers, minimal)
// ============================================
interface SimpleCountdownProps {
  seconds: number
  onComplete?: () => void
  autoStart?: boolean
  className?: string
  style?: React.CSSProperties
}

export function SimpleCountdown({
  seconds: initialSeconds,
  onComplete,
  autoStart = true,
  className,
  style
}: SimpleCountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)

  useEffect(() => {
    if (!isRunning || seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, seconds, onComplete])

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <span
      className={className}
      style={{
        fontVariantNumeric: 'tabular-nums',
        ...style
      }}
    >
      {formatTime(seconds)}
    </span>
  )
}

// ============================================
// POMODORO TIMER (specialized work timer)
// ============================================
interface PomodoroTimerProps {
  workMinutes?: number
  breakMinutes?: number
  longBreakMinutes?: number
  sessionsBeforeLongBreak?: number
  onSessionComplete?: (type: 'work' | 'break' | 'longBreak') => void
  className?: string
  style?: React.CSSProperties
}

export function PomodoroTimer({
  workMinutes = 25,
  breakMinutes = 5,
  longBreakMinutes = 15,
  sessionsBeforeLongBreak = 4,
  onSessionComplete,
  className,
  style
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work')
  const [sessions, setSessions] = useState(0)
  const [seconds, setSeconds] = useState(workMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          onSessionComplete?.(mode)

          // Transition to next mode
          if (mode === 'work') {
            const newSessions = sessions + 1
            setSessions(newSessions)

            if (newSessions >= sessionsBeforeLongBreak) {
              setMode('longBreak')
              setSessions(0)
              return longBreakMinutes * 60
            } else {
              setMode('break')
              return breakMinutes * 60
            }
          } else {
            setMode('work')
            return workMinutes * 60
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, mode, sessions, workMinutes, breakMinutes, longBreakMinutes, sessionsBeforeLongBreak, onSessionComplete])

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const reset = () => {
    setMode('work')
    setSessions(0)
    setSeconds(workMinutes * 60)
    setIsRunning(false)
  }

  const modeColors = {
    work: 'var(--brand-primary)',
    break: '#10b981',
    longBreak: '#3b82f6'
  }

  const modeLabels = {
    work: 'Travail',
    break: 'Pause',
    longBreak: 'Longue pause'
  }

  return (
    <div className={className} style={{ textAlign: 'center', ...style }}>
      {/* Mode indicator */}
      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: `${modeColors[mode]}20`,
        color: modeColors[mode],
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        marginBottom: 16
      }}>
        {modeLabels[mode]}
      </div>

      {/* Timer display */}
      <div style={{
        fontSize: '4rem',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'monospace',
        color: 'var(--text-primary)',
        marginBottom: 8
      }}>
        {formatTime(seconds)}
      </div>

      {/* Session counter */}
      <div style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        marginBottom: 24
      }}>
        Session {sessions + 1} / {sessionsBeforeLongBreak}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <IconButton
          icon={isRunning ? <Pause16Filled /> : <Play16Filled />}
          variant="subtle"
          size="lg"
          onClick={() => setIsRunning(!isRunning)}
          style={{
            backgroundColor: modeColors[mode],
            color: 'white'
          }}
        />
        <IconButton
          icon={<ArrowResetRegular />}
          variant="ghost"
          size="lg"
          onClick={reset}
        />
      </div>
    </div>
  )
}
