import { useState, useMemo, useRef, useEffect, ReactNode } from 'react'
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Calendar20Regular,
  CalendarWeekNumbers20Regular,
  List20Regular,
  Clock20Regular,
  Location20Regular,
  Link20Regular,
  People20Regular
} from '@fluentui/react-icons'
import { IconButton, Button } from './Button'
import { ViewToggle } from './Tabs'
import { useIsMobile } from '../hooks/useResponsive'
import { Z_INDEX } from '../constants'

// ============================================
// EVENT HOVER CARD (Rich tooltip for events)
// ============================================
interface EventHoverCardProps {
  event: CalendarEvent
  accentColor: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

function EventHoverCard({ event, accentColor, children, position = 'bottom' }: EventHoverCardProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, actualPosition: position })
  const triggerRef = useRef<HTMLDivElement>(null)
  const showTimeoutRef = useRef<NodeJS.Timeout>()
  const hideTimeoutRef = useRef<NodeJS.Timeout>()
  const color = event.color || accentColor

  const show = () => {
    // Annuler le hide si on revient
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

    showTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const cardWidth = 280
        const cardHeight = 200 // estimation

        // Calcul position horizontale - centré sur l'élément
        let left = rect.left + rect.width / 2

        // Eviter de sortir de l'écran horizontalement
        if (left - cardWidth / 2 < 16) {
          left = cardWidth / 2 + 16
        } else if (left + cardWidth / 2 > windowWidth - 16) {
          left = windowWidth - cardWidth / 2 - 16
        }

        // Calcul position verticale
        let actualPosition = position
        let top: number

        if (position === 'bottom') {
          top = rect.bottom + 8
          // Si dépasse en bas, mettre en haut
          if (top + cardHeight > windowHeight - 16) {
            top = rect.top - 8
            actualPosition = 'top'
          }
        } else {
          top = rect.top - 8
          // Si dépasse en haut, mettre en bas
          if (top - cardHeight < 16) {
            top = rect.bottom + 8
            actualPosition = 'bottom'
          }
        }

        setCoords({ top, left, actualPosition })
        setOpen(true)
      }
    }, 400)
  }

  const hide = () => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
    // Délai avant de fermer pour permettre d'aller sur le tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 150)
  }

  const cancelHide = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
  }

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  // Extraire les infos additionnelles du data
  const description = event.data?.description as string | undefined
  const location = event.data?.location as string | undefined
  const meetingLink = event.data?.meetingLink as string | undefined
  const participants = event.data?.participants as { name: string }[] | undefined

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>

      {open && (
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={hide}
          className="animate-fadeIn"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: coords.actualPosition === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            zIndex: Z_INDEX.max,
            width: 280,
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
            padding: '0.875rem',
            display: 'flex',
            gap: '0.75rem'
          }}
        >
          {/* Barre de couleur DANS la div */}
          <div style={{
            width: 4,
            borderRadius: 'var(--radius-xs)',
            backgroundColor: color,
            flexShrink: 0
          }} />

          {/* Contenu */}
          <div style={{ flex: 1 }}>
            {/* Titre */}
            <div style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.625rem'
            }}>
              {event.title}
            </div>

            {/* Heure */}
            {event.time && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}>
                <Clock20Regular style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                {event.time}
              </div>
            )}

            {/* Lieu */}
            {location && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}>
                <Location20Regular style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                {location}
              </div>
            )}

            {/* Lien visio */}
            {meetingLink && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: color,
                marginBottom: '0.5rem'
              }}>
                <Link20Regular style={{ fontSize: 16 }} />
                Meeting link
              </div>
            )}

            {/* Participants */}
            {participants && participants.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}>
                <People20Regular style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                {participants.length} participant{participants.length > 1 ? 's' : ''}
              </div>
            )}

            {/* Description */}
            {description && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {description}
              </div>
            )}

            {/* Date (if not same day) */}
            {event.date && (
              <div style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                marginTop: '0.625rem',
                opacity: 0.8
              }}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ============================================
// CALENDAR DAY CELL (with hover/selected states)
// ============================================
interface CalendarDayCellProps {
  date: Date
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  events: CalendarEvent[]
  accentColor: string
  onClick: () => void
  onDoubleClick?: () => void
  renderEvent?: (event: CalendarEvent) => ReactNode
  renderDayContent?: (date: Date, events: CalendarEvent[]) => ReactNode
  onEventClick?: (event: CalendarEvent) => void
  index: number
}

function CalendarDayCell({
  date,
  isToday,
  isSelected,
  isCurrentMonth,
  events,
  accentColor,
  onClick,
  onDoubleClick,
  renderEvent,
  renderDayContent,
  onEventClick,
  index
}: CalendarDayCellProps) {
  const [isHovered, setIsHovered] = useState(false)

  const renderEventDefault = (event: CalendarEvent) => {
    const color = event.color || accentColor
    return (
      <EventHoverCard key={event.id} event={event} accentColor={accentColor}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onEventClick?.(event)
          }}
          className="animate-fadeIn"
          style={{
            padding: '2px 6px',
            backgroundColor: `${color}20`,
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.6875rem',
            color: color,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${color}35`
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${color}20`
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {event.time && <span style={{ opacity: 0.7, marginRight: 4 }}>{event.time}</span>}
          {event.title}
        </div>
      </EventHoverCard>
    )
  }

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-fadeIn"
      style={{
        minHeight: 80,
        padding: '0.375rem',
        backgroundColor: isSelected
          ? 'var(--bg-tertiary)'
          : isHovered
            ? 'var(--bg-hover)'
            : 'transparent',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isCurrentMonth ? 1 : 0.4,
        animationDelay: `${index * 15}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {/* Date number */}
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isToday ? accentColor : isSelected ? `${accentColor}22` : 'transparent',
        color: isToday ? 'white' : isSelected ? accentColor : 'var(--text-primary)',
        fontSize: '0.8125rem',
        fontWeight: isToday || isSelected ? 600 : 400,
        marginBottom: 4,
        transition: 'all 0.2s ease',
        boxShadow: isToday ? `0 0 0 2px ${accentColor}44` : 'none'
      }}>
        {date.getDate()}
      </div>

      {/* Events */}
      {renderDayContent ? (
        renderDayContent(date, events)
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden'
        }}>
          {events.slice(0, 3).map(event =>
            renderEvent ? renderEvent(event) : renderEventDefault(event)
          )}
          {events.length > 3 && (
            <div style={{
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              paddingLeft: 4
            }}>
              +{events.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// WEEK DAY CELL
// ============================================
interface WeekDayCellProps {
  date: Date
  isToday: boolean
  isSelected: boolean
  events: CalendarEvent[]
  accentColor: string
  locale: string
  onClick: () => void
  renderEvent?: (event: CalendarEvent) => ReactNode
  onEventClick?: (event: CalendarEvent) => void
  index: number
}

function WeekDayCell({
  date,
  isToday,
  isSelected,
  events,
  accentColor,
  locale,
  onClick,
  renderEvent,
  onEventClick,
  index
}: WeekDayCellProps) {
  const [isHovered, setIsHovered] = useState(false)

  const renderEventDefault = (event: CalendarEvent) => {
    const color = event.color || accentColor
    return (
      <EventHoverCard key={event.id} event={event} accentColor={accentColor}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onEventClick?.(event)
          }}
          style={{
            padding: '4px 8px',
            backgroundColor: `${color}20`,
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.75rem',
            color: color,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${color}35`
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${color}20`
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {event.time && <div style={{ fontSize: '0.6875rem', opacity: 0.7 }}>{event.time}</div>}
          <div style={{ fontWeight: 500 }}>{event.title}</div>
        </div>
      </EventHoverCard>
    )
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-fadeIn"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 200,
        padding: '0.75rem',
        backgroundColor: isSelected
          ? 'var(--bg-tertiary)'
          : isHovered
            ? 'var(--bg-hover)'
            : 'transparent',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {/* Day header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '0.75rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: isToday ? accentColor : 'var(--text-muted)',
          textTransform: 'uppercase',
          marginBottom: 4,
          fontWeight: isToday ? 600 : 500
        }}>
          {date.toLocaleDateString(locale, { weekday: 'short' })}
        </div>
        <div
          className={isToday ? 'animate-scaleIn' : undefined}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isToday ? accentColor : isSelected ? `${accentColor}22` : 'transparent',
            color: isToday ? 'white' : isSelected ? accentColor : 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 600,
            margin: '0 auto',
            boxShadow: isToday ? `0 0 0 3px ${accentColor}33` : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {date.getDate()}
        </div>
      </div>

      {/* Events */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1
      }}>
        {events.map(event =>
          renderEvent ? renderEvent(event) : renderEventDefault(event)
        )}
      </div>
    </div>
  )
}

// ============================================
// AGENDA ITEM
// ============================================
interface AgendaItemProps {
  event: CalendarEvent
  accentColor: string
  onClick?: () => void
  index: number
}

function AgendaItem({ event, accentColor, onClick, index }: AgendaItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const color = event.color || accentColor

  // Extraire les infos additionnelles du data
  const location = event.data?.location as string | undefined
  const description = event.data?.description as string | undefined

  return (
    <EventHoverCard event={event} accentColor={accentColor} position="top">
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="animate-fadeIn"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '0.75rem',
          padding: '0.75rem',
          backgroundColor: isHovered ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          animationDelay: `${index * 50}ms`,
          animationFillMode: 'backwards',
          overflow: 'hidden'
        }}
      >
        {/* Color bar inside */}
        <div style={{
          width: 4,
          borderRadius: 'var(--radius-xs)',
          backgroundColor: color,
          flexShrink: 0,
          marginLeft: -4
        }} />

        {event.icon && (
          <span style={{ color: color, display: 'flex', alignItems: 'center' }}>
            {event.icon}
          </span>
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            {event.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {event.time && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                {event.time}
              </div>
            )}
            {location && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Location20Regular style={{ fontSize: 12 }} />
                {location}
              </div>
            )}
          </div>
          {description && (
            <div style={{
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              marginTop: 4,
              opacity: 0.8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {description}
            </div>
          )}
        </div>
      </div>
    </EventHoverCard>
  )
}

// ============================================
// TYPES
// ============================================
export interface CalendarEvent {
  id: string
  title: string
  date: Date | string
  endDate?: Date | string
  color?: string
  icon?: ReactNode
  allDay?: boolean
  time?: string
  data?: Record<string, unknown>
}

type ViewMode = 'month' | 'week' | 'agenda'

// ============================================
// CALENDAR
// ============================================
interface CalendarProps {
  events?: CalendarEvent[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onDateDoubleClick?: (date: Date) => void
  defaultView?: ViewMode
  showViewToggle?: boolean
  showNavigation?: boolean
  minDate?: Date
  maxDate?: Date
  weekStartsOn?: 0 | 1 // 0 = Sunday, 1 = Monday
  locale?: string
  renderEvent?: (event: CalendarEvent) => ReactNode
  renderDayContent?: (date: Date, events: CalendarEvent[]) => ReactNode
  accentColor?: string
}

export function Calendar({
  events = [],
  selectedDate,
  onDateSelect,
  onEventClick,
  onDateDoubleClick,
  defaultView = 'month',
  showViewToggle = true,
  showNavigation = true,
  weekStartsOn = 1,
  locale = 'en-US',
  renderEvent,
  renderDayContent,
  accentColor = 'var(--brand-primary)'
}: CalendarProps) {
  const isMobile = useIsMobile()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(null)

  const selected = selectedDate || internalSelectedDate

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format helpers
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  }

  const formatWeekRange = (date: Date) => {
    const start = getWeekStart(date)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}`
  }

  // Get week start
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    d.setDate(d.getDate() - diff)
    return d
  }

  // Get days for month view
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days: Date[] = []

    // Days from previous month
    const firstDayOfWeek = firstDay.getDay()
    const daysFromPrev = (firstDayOfWeek - weekStartsOn + 7) % 7
    for (let i = daysFromPrev - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push(d)
    }

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Days from next month to complete grid
    const remaining = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }, [currentDate, weekStartsOn])

  // Get days for week view
  const weekDays = useMemo(() => {
    const start = getWeekStart(currentDate)
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [currentDate, weekStartsOn])

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if date is selected
  const isSelected = (date: Date) => {
    if (!selected) return false
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    setInternalSelectedDate(date)
    onDateSelect?.(date)
  }

  // Day names
  const dayNames = useMemo(() => {
    const days: string[] = []
    const baseDate = new Date(2024, 0, weekStartsOn) // A Sunday or Monday
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate)
      d.setDate(d.getDate() + i)
      days.push(d.toLocaleDateString(locale, { weekday: 'short' }))
    }
    return days
  }, [weekStartsOn, locale])


  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0.75rem' : '1rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: isMobile ? '0.5rem' : '0'
      }}>
        {/* Navigation */}
        {showNavigation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.25rem' : '0.5rem', flex: isMobile ? 1 : 'none', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
            <IconButton
              icon={<ChevronLeft20Regular />}
              onClick={goToPrevious}
              size="sm"
              title="Previous month"
            />

            <span style={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              minWidth: isMobile ? 'auto' : 180,
              textAlign: 'center',
              textTransform: 'capitalize'
            }}>
              {viewMode === 'month' ? formatMonth(currentDate) : formatWeekRange(currentDate)}
            </span>

            <IconButton
              icon={<ChevronRight20Regular />}
              onClick={goToNext}
              size="sm"
              title="Next month"
            />

            {!isMobile && (
              <Button
                variant="secondary"
                size="xs"
                onClick={goToToday}
                style={{ marginLeft: '0.25rem' }}
              >
                Today
              </Button>
            )}
          </div>
        )}

        {/* View toggle + Today button on mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isMobile && showNavigation && (
            <Button
              variant="secondary"
              size="xs"
              onClick={goToToday}
            >
              Today
            </Button>
          )}
          {showViewToggle && (
            <ViewToggle
              options={[
                { value: 'month', icon: <Calendar20Regular />, label: 'Month' },
                { value: 'week', icon: <CalendarWeekNumbers20Regular />, label: 'Week' },
                { value: 'agenda', icon: <List20Regular />, label: 'Agenda' }
              ]}
              value={viewMode}
              onChange={(v) => setViewMode(v as ViewMode)}
            />
          )}
        </div>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <div style={{ padding: '0.5rem' }}>
          {/* Day names header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 2,
            marginBottom: 4
          }}>
            {dayNames.map((day, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}
              >
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
            {monthDays.map((date, i) => (
              <CalendarDayCell
                key={i}
                date={date}
                isToday={isToday(date)}
                isSelected={isSelected(date)}
                isCurrentMonth={isCurrentMonth(date)}
                events={getEventsForDate(date)}
                accentColor={accentColor}
                onClick={() => handleDateClick(date)}
                onDoubleClick={() => onDateDoubleClick?.(date)}
                renderEvent={renderEvent}
                renderDayContent={renderDayContent}
                onEventClick={onEventClick}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div style={{ padding: '0.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 8
          }}>
            {weekDays.map((date, i) => (
              <WeekDayCell
                key={i}
                date={date}
                isToday={isToday(date)}
                isSelected={isSelected(date)}
                events={getEventsForDate(date)}
                accentColor={accentColor}
                locale={locale}
                onClick={() => handleDateClick(date)}
                renderEvent={renderEvent}
                onEventClick={onEventClick}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Agenda View */}
      {viewMode === 'agenda' && (
        <div style={{ padding: '1rem' }}>
          {(() => {
            // Group events by date for next 14 days
            const upcoming: { date: Date; events: CalendarEvent[] }[] = []
            const today = new Date()

            for (let i = 0; i < 14; i++) {
              const date = new Date(today)
              date.setDate(date.getDate() + i)
              const dayEvents = getEventsForDate(date)
              if (dayEvents.length > 0) {
                upcoming.push({ date, events: dayEvents })
              }
            }

            if (upcoming.length === 0) {
              return (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: 'var(--text-muted)'
                }}>
                  <Calendar20Regular style={{ fontSize: 40, marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No events in the next 14 days</p>
                </div>
              )
            }

            let eventIndex = 0
            return upcoming.map(({ date, events: dayEvents }) => (
              <div key={date.toISOString()} className="animate-fadeIn" style={{ marginBottom: '1.5rem' }}>
                {/* Date header */}
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isToday(date) ? accentColor : 'var(--text-muted)',
                  marginBottom: '0.75rem',
                  textTransform: 'capitalize'
                }}>
                  {isToday(date) ? "Today" : date.toLocaleDateString(locale, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>

                {/* Events list */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {dayEvents.map(event => {
                    const idx = eventIndex++
                    return (
                      <AgendaItem
                        key={event.id}
                        event={event}
                        accentColor={accentColor}
                        onClick={() => onEventClick?.(event)}
                        index={idx}
                      />
                    )
                  })}
                </div>
              </div>
            ))
          })()}
        </div>
      )}

      {/* CSS for mobile */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// ============================================
// MINI CALENDAR DAY
// ============================================
interface MiniCalendarDayProps {
  date: Date
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  hasEvent: boolean
  accentColor: string
  onClick: () => void
  index: number
}

function MiniCalendarDay({
  date,
  isToday,
  isSelected,
  isCurrentMonth,
  hasEvent,
  accentColor,
  onClick,
  index
}: MiniCalendarDayProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-fadeIn"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isSelected
          ? accentColor
          : isToday
            ? `${accentColor}22`
            : isHovered && isCurrentMonth
              ? 'var(--bg-tertiary)'
              : 'transparent',
        border: 'none',
        color: isSelected
          ? 'white'
          : isToday
            ? accentColor
            : isCurrentMonth
              ? 'var(--text-primary)'
              : 'var(--text-muted)',
        fontSize: '0.8125rem',
        fontWeight: isToday || isSelected ? 600 : 400,
        cursor: 'pointer',
        position: 'relative',
        opacity: isCurrentMonth ? 1 : 0.4,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered && !isSelected ? 'scale(1.1)' : 'scale(1)',
        boxShadow: isSelected ? `0 0 0 2px ${accentColor}44` : 'none',
        animationDelay: `${index * 10}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {date.getDate()}
      {hasEvent && !isSelected && (
        <span
          className="animate-scaleIn"
          style={{
            position: 'absolute',
            bottom: 4,
            width: 4,
            height: 4,
            borderRadius: 'var(--radius-xs)',
            backgroundColor: accentColor
          }}
        />
      )}
    </button>
  )
}

// ============================================
// MINI CALENDAR (for date pickers, sidebars)
// ============================================
interface MiniCalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  events?: { date: Date | string; color?: string }[]
  weekStartsOn?: 0 | 1
  locale?: string
  accentColor?: string
}

export function MiniCalendar({
  selectedDate,
  onDateSelect,
  events = [],
  weekStartsOn = 1,
  locale = 'en-US',
  accentColor = 'var(--brand-primary)'
}: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    const firstDayOfWeek = firstDay.getDay()
    const daysFromPrev = (firstDayOfWeek - weekStartsOn + 7) % 7
    for (let i = daysFromPrev - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i))
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }, [currentDate, weekStartsOn])

  const dayNames = useMemo(() => {
    const days: string[] = []
    const baseDate = new Date(2024, 0, weekStartsOn)
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate)
      d.setDate(d.getDate() + i)
      days.push(d.toLocaleDateString(locale, { weekday: 'narrow' }))
    }
    return days
  }, [weekStartsOn, locale])

  const hasEvent = (date: Date) => {
    return events.some(e => {
      const eventDate = new Date(e.date)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div style={{ width: 280 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <IconButton
          icon={<ChevronLeft20Regular />}
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          size="xs"
          title="Previous month"
        />
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          textTransform: 'capitalize'
        }}>
          {currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        </span>
        <IconButton
          icon={<ChevronRight20Regular />}
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          size="xs"
          title="Next month"
        />
      </div>

      {/* Days grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2
      }}>
        {/* Day names */}
        {dayNames.map((day, i) => (
          <div
            key={i}
            style={{
              padding: '0.375rem',
              textAlign: 'center',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--text-muted)'
            }}
          >
            {day}
          </div>
        ))}

        {/* Dates */}
        {monthDays.map((date, i) => (
          <MiniCalendarDay
            key={i}
            date={date}
            isToday={isToday(date)}
            isSelected={isSelected(date)}
            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
            hasEvent={hasEvent(date)}
            accentColor={accentColor}
            onClick={() => onDateSelect?.(date)}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
