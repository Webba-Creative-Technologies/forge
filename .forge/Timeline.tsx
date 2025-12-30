import { ReactNode, useState } from 'react'

// ============================================
// TYPES
// ============================================
export interface TimelineItem {
  id: string
  title: string
  description?: ReactNode
  date?: string
  time?: string
  icon?: ReactNode
  color?: string
  status?: 'completed' | 'current' | 'upcoming'
  actions?: ReactNode
  onClick?: () => void
}

// ============================================
// TIMELINE
// ============================================
interface TimelineProps {
  items: TimelineItem[]
  variant?: 'default' | 'compact' | 'alternate'
  showConnector?: boolean
  color?: string
}

export function Timeline({
  items,
  variant = 'default',
  showConnector = true,
  color = 'var(--brand-primary)'
}: TimelineProps) {
  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => (
          <TimelineItemCompact
            key={item.id}
            item={item}
            index={index}
            isLast={index === items.length - 1}
            showConnector={showConnector}
            defaultColor={color}
            nextItemCompleted={index < items.length - 1 && items[index + 1].status === 'completed'}
          />
        ))}
      </div>
    )
  }

  if (variant === 'alternate') {
    return (
      <div style={{ position: 'relative', paddingLeft: '50%' }}>
        {/* Center line */}
        {showConnector && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'var(--border-subtle)',
            transform: 'translateX(-50%)'
          }} />
        )}

        {items.map((item, index) => (
          <TimelineItemAlternate
            key={item.id}
            item={item}
            index={index}
            defaultColor={color}
          />
        ))}
      </div>
    )
  }

  // Default variant
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      paddingLeft: 40
    }}>
      {items.map((item, index) => (
        <TimelineItemDefault
          key={item.id}
          item={item}
          index={index}
          isLast={index === items.length - 1}
          showConnector={showConnector}
          defaultColor={color}
          nextItemCompleted={index < items.length - 1 && items[index + 1].status === 'completed'}
        />
      ))}
    </div>
  )
}

// ============================================
// TIMELINE ITEM - DEFAULT
// ============================================
interface TimelineItemDefaultProps {
  item: TimelineItem
  index: number
  isLast: boolean
  showConnector: boolean
  defaultColor: string
  nextItemCompleted: boolean
}

function TimelineItemDefault({ item, index, isLast, showConnector, defaultColor, nextItemCompleted }: TimelineItemDefaultProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const itemColor = item.color || defaultColor

  // La ligne est colorée si l'item courant ET le suivant sont completed
  const lineCompleted = item.status === 'completed' && nextItemCompleted

  return (
    <div
      onClick={item.onClick}
      onMouseEnter={() => item.onClick && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => item.onClick && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="animate-fadeIn"
      style={{
        position: 'relative',
        paddingBottom: isLast ? 0 : '2rem',
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards',
        cursor: item.onClick ? 'pointer' : 'default',
        padding: item.onClick ? '0.5rem' : undefined,
        marginLeft: item.onClick ? '-0.5rem' : undefined,
        marginRight: item.onClick ? '-0.5rem' : undefined,
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.98)' : hovered ? 'translateX(4px)' : 'none',
        backgroundColor: hovered && item.onClick ? 'var(--bg-tertiary)' : 'transparent',
        boxShadow: hovered && item.onClick ? '0 0 0 3px rgba(163, 91, 255, 0.2)' : 'none'
      }}
    >
      {/* Connector line */}
      {showConnector && !isLast && (
        <div style={{
          position: 'absolute',
          left: -31,
          top: 20,
          bottom: 0,
          width: 2,
          backgroundColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
          overflow: 'hidden'
        }}>
          {/* Colored fill */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: lineCompleted ? '100%' : '0%',
            backgroundColor: 'var(--color-success)',
            transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: `${index * 100 + 200}ms`
          }} />
        </div>
      )}

      {/* Dot/Icon - aligned with title */}
      <div
        className={item.status === 'completed' ? 'animate-scaleIn' : undefined}
        style={{
          position: 'absolute',
          left: -40,
          top: 0,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: item.status === 'completed' ? 'var(--color-success)'
            : item.status === 'current' ? itemColor
            : 'var(--text-muted)',
          border: '2px solid var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 1,
          boxShadow: `0 0 0 2px ${item.status === 'completed' ? 'var(--color-success)' : item.status === 'current' ? itemColor : 'var(--border-subtle)'}`,
          transition: 'all 0.3s ease',
          animationDelay: `${index * 100}ms`
        }}
      >
        {item.icon}
      </div>

      {/* Content */}
      <div>
        {/* Title - first, aligned with dot */}
        <div style={{
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: item.status === 'upcoming' ? 'var(--text-muted)' : 'var(--text-primary)',
          lineHeight: '24px',
          transition: 'color 0.3s ease'
        }}>
          {item.title}
        </div>

        {/* Date/Time - below title */}
        {(item.date || item.time) && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 2
          }}>
            {item.date}
            {item.date && item.time && ' • '}
            {item.time}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginTop: 6,
            lineHeight: 1.5
          }}>
            {item.description}
          </div>
        )}

        {/* Actions */}
        {item.actions && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: 10
          }}>
            {item.actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// TIMELINE ITEM - COMPACT
// ============================================
interface TimelineItemCompactProps {
  item: TimelineItem
  index: number
  isLast: boolean
  showConnector: boolean
  defaultColor: string
  nextItemCompleted: boolean
}

function TimelineItemCompact({ item, index, isLast, showConnector, defaultColor, nextItemCompleted }: TimelineItemCompactProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const itemColor = item.color || defaultColor
  const lineCompleted = item.status === 'completed' && nextItemCompleted

  return (
    <div
      onClick={item.onClick}
      onMouseEnter={() => item.onClick && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => item.onClick && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="animate-fadeIn"
      style={{
        display: 'flex',
        gap: '1rem',
        position: 'relative',
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'backwards',
        cursor: item.onClick ? 'pointer' : 'default',
        padding: item.onClick ? '0.5rem' : undefined,
        marginLeft: item.onClick ? '-0.5rem' : undefined,
        marginRight: item.onClick ? '-0.5rem' : undefined,
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.98)' : hovered ? 'translateX(4px)' : 'none',
        backgroundColor: hovered && item.onClick ? 'var(--bg-tertiary)' : 'transparent',
        boxShadow: hovered && item.onClick ? '0 0 0 3px rgba(163, 91, 255, 0.2)' : 'none'
      }}
    >
      {/* Dot column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 12,
        paddingTop: 3
      }}>
        {/* Dot */}
        <div
          className={item.status === 'completed' ? 'animate-scaleIn' : undefined}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: item.status === 'completed' ? 'var(--color-success)'
              : item.status === 'current' ? itemColor
              : 'var(--text-muted)',
            border: '2px solid var(--bg-primary)',
            boxShadow: `0 0 0 2px ${item.status === 'completed' ? 'var(--color-success)' : item.status === 'current' ? itemColor : 'var(--border-subtle)'}`,
            flexShrink: 0,
            transition: 'all 0.3s ease',
            animationDelay: `${index * 80}ms`,
            zIndex: 1
          }}
        />
      </div>

      {/* Line connecting dots - positioned absolutely to span full height */}
      {showConnector && !isLast && (
        <div style={{
          position: 'absolute',
          left: 5, // center of 12px column
          top: 16, // after dot (3 paddingTop + 10 dot + 3 margin)
          bottom: -3, // extend to touch next dot
          width: 2,
          backgroundColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
          overflow: 'hidden'
        }}>
          {/* Colored fill */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: lineCompleted ? '100%' : '0%',
            backgroundColor: 'var(--color-success)',
            transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: `${index * 80 + 150}ms`
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.5rem'
        }}>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: item.status === 'upcoming' ? 'var(--text-muted)' : 'var(--text-primary)',
            transition: 'color 0.3s ease'
          }}>
            {item.title}
          </span>
          {item.date && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              {item.date}
            </span>
          )}
        </div>
        {item.description && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginTop: 2
          }}>
            {item.description}
          </div>
        )}
        {item.actions && (
          <div style={{
            display: 'flex',
            gap: '0.375rem',
            marginTop: 6
          }}>
            {item.actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// TIMELINE ITEM - ALTERNATE
// ============================================
interface TimelineItemAlternateProps {
  item: TimelineItem
  index: number
  defaultColor: string
}

function TimelineItemAlternate({ item, index, defaultColor }: TimelineItemAlternateProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const itemColor = item.color || defaultColor
  const isLeft = index % 2 === 0

  return (
    <div style={{
      display: 'flex',
      justifyContent: isLeft ? 'flex-end' : 'flex-start',
      position: 'relative',
      paddingRight: isLeft ? 'calc(50% + 20px)' : 0,
      paddingLeft: isLeft ? 0 : 'calc(50% + 20px)',
      marginLeft: isLeft ? '-100%' : 0,
      paddingBottom: '2rem'
    }}>
      {/* Dot */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 4,
        transform: 'translateX(-50%)',
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: item.status === 'current' ? itemColor : 'var(--bg-secondary)',
        border: `2px solid ${item.status === 'completed' ? 'var(--color-success)' : itemColor}`,
        zIndex: 1
      }} />

      {/* Content card */}
      <div
        onClick={item.onClick}
        onMouseEnter={() => item.onClick && setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false) }}
        onMouseDown={() => item.onClick && setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          maxWidth: 300,
          cursor: item.onClick ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          transform: pressed ? 'scale(0.98)' : hovered ? 'scale(1.02)' : 'scale(1)',
          boxShadow: hovered && item.onClick ? '0 0 0 3px rgba(163, 91, 255, 0.2)' : 'none'
        }}
      >
        {(item.date || item.time) && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: 4
          }}>
            {item.date} {item.time}
          </div>
        )}
        <div style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginTop: 4
          }}>
            {item.description}
          </div>
        )}
        {item.actions && (
          <div style={{
            display: 'flex',
            gap: '0.375rem',
            marginTop: 8
          }}>
            {item.actions}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// ACTIVITY TIMELINE (specialized for activity feeds)
// ============================================
export interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target?: string
  timestamp: string
  icon?: ReactNode
  color?: string
}

interface ActivityTimelineProps {
  items: ActivityItem[]
  maxItems?: number
}

export function ActivityTimeline({ items, maxItems }: ActivityTimelineProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {displayItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Avatar */}
          {item.user.avatar ? (
            <img
              src={item.user.avatar}
              alt={item.user.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: item.color || 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              flexShrink: 0
            }}>
              {item.user.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              lineHeight: 1.4
            }}>
              <span style={{ fontWeight: 500 }}>{item.user.name}</span>
              {' '}
              <span style={{ color: 'var(--text-secondary)' }}>{item.action}</span>
              {item.target && (
                <>
                  {' '}
                  <span style={{ fontWeight: 500 }}>{item.target}</span>
                </>
              )}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: 2
            }}>
              {item.timestamp}
            </div>
          </div>

          {/* Icon */}
          {item.icon && (
            <span style={{
              display: 'flex',
              color: item.color || 'var(--text-muted)',
              fontSize: 16
            }}>
              {item.icon}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
