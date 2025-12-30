import { ReactNode, useState } from 'react'
import { Person20Regular } from '@fluentui/react-icons'
import { STATUS_COLORS, AVATAR_COLORS, Z_INDEX, SHADOWS } from '../constants'

// ============================================
// AVATAR
// ============================================
interface AvatarProps {
  name?: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  icon?: ReactNode
  status?: 'online' | 'offline' | 'away' | 'busy'
  onClick?: () => void
}

const sizeStyles = {
  xs: { width: 24, height: 24, fontSize: '0.625rem', statusSize: 8 },
  sm: { width: 32, height: 32, fontSize: '0.75rem', statusSize: 10 },
  md: { width: 40, height: 40, fontSize: '0.875rem', statusSize: 12 },
  lg: { width: 48, height: 48, fontSize: '1rem', statusSize: 14 },
  xl: { width: 64, height: 64, fontSize: '1.25rem', statusSize: 16 }
}

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function Avatar({
  name,
  src,
  size = 'md',
  color,
  icon,
  status,
  onClick,
  showTooltip = true
}: AvatarProps & { showTooltip?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { width, height, fontSize, statusSize } = sizeStyles[size]
  const bgColor = color || (name ? stringToColor(name) : 'var(--bg-tertiary)')

  const hasTooltipContent = showTooltip && (name || status)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => onClick && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        width,
        height,
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0
      }}
    >
      {/* Avatar circle with overflow hidden for image */}
      <div
        style={{
          width,
          height,
          borderRadius: 'var(--radius-full)',
          backgroundColor: src ? 'transparent' : bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 0.15s ease',
          transform: pressed ? 'scale(0.95)' : hovered ? 'scale(1.05)' : 'scale(1)',
          boxShadow: hovered && onClick ? '0 0 0 3px rgba(163, 91, 255, 0.2)' : 'none'
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : name ? (
          <span style={{
            color: 'white',
            fontSize,
            fontWeight: 600,
            lineHeight: 1
          }}>
            {getInitials(name)}
          </span>
        ) : icon ? (
          <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        ) : (
          <Person20Regular style={{ color: 'var(--text-muted)', fontSize }} />
        )}
      </div>

      {/* Status indicator - outside overflow hidden */}
      {status && (
        <div style={{
          position: 'absolute',
          bottom: -1,
          right: -1,
          width: statusSize,
          height: statusSize,
          borderRadius: 'var(--radius-full)',
          backgroundColor: STATUS_COLORS[status],
          border: '2px solid var(--bg-primary)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
        }} />
      )}

      {/* Tooltip on hover */}
      {hovered && hasTooltipContent && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            marginBottom: 8,
            zIndex: Z_INDEX.dropdown,
            pointerEvents: 'none',
            transform: 'translateX(-50%)'
          }}
        >
          <div
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-dropdown)',
              borderRadius: 'var(--radius-md)',
              boxShadow: SHADOWS.elevation.popover,
              padding: '0.5rem 0.75rem',
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--bg-dropdown)'
            }} />

          {name && (
            <div style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-primary)'
            }}>
              {name}
            </div>
          )}

          {status && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: name ? 4 : 0
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: 'var(--radius-full)',
                backgroundColor: STATUS_COLORS[status]
              }} />
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                {statusLabels[status]}
              </span>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// AVATAR STACK
// ============================================
interface AvatarStackProps {
  users: Array<{ name?: string; src?: string; status?: 'online' | 'offline' | 'away' | 'busy' }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function AvatarStack({
  users,
  max = 4,
  size = 'sm',
  onClick
}: AvatarStackProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const visibleUsers = users.slice(0, max)
  const hiddenUsers = users.slice(max)
  const remaining = users.length - max
  const { width, height } = sizeStyles[size]
  const overlap = width * 0.3

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative'
      }}
    >
      {visibleUsers.map((user, idx) => (
        <div
          key={idx}
          style={{
            marginLeft: idx === 0 ? 0 : -overlap,
            zIndex: visibleUsers.length - idx,
            border: '2px solid var(--bg-primary)',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <Avatar
            name={user.name}
            src={user.src}
            size={size}
            status={user.status}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div
            style={{
              marginLeft: -overlap,
              width,
              height,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '2px solid var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: sizeStyles[size].fontSize,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              zIndex: 0,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            className="interactive-icon"
          >
            +{remaining}
          </div>

          {/* Tooltip with hidden users */}
          {showTooltip && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 8,
                zIndex: Z_INDEX.dropdown
              }}
            >
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-dropdown)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: SHADOWS.elevation.popover,
                  padding: '0.5rem',
                  minWidth: 160,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid var(--bg-dropdown)'
                }} />

                {hiddenUsers.map((user, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    className="interactive-row"
                  >
                    <Avatar name={user.name} src={user.src} size="xs" showTooltip={false} />
                    <span style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.name || 'Utilisateur'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// AVATAR GROUP (with label)
// ============================================
interface AvatarGroupProps {
  users: Array<{ name?: string; src?: string }>
  label?: string
  max?: number
}

export function AvatarGroup({ users, label, max = 3 }: AvatarGroupProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <AvatarStack users={users} max={max} size="xs" />
      {label && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ============================================
// AVATAR CARD (Full avatar with name and details)
// ============================================
interface AvatarCardProps {
  name: string
  src?: string
  subtitle?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  actions?: ReactNode
}

export function AvatarCard({
  name,
  src,
  subtitle,
  status,
  size = 'md',
  onClick,
  actions
}: AvatarCardProps) {
  const [hovered, setHovered] = useState(false)

  const sizeConfig = {
    sm: { avatar: 'sm' as const, nameFontSize: '0.8125rem', subtitleFontSize: '0.6875rem', gap: '0.5rem' },
    md: { avatar: 'md' as const, nameFontSize: '0.875rem', subtitleFontSize: '0.75rem', gap: '0.75rem' },
    lg: { avatar: 'lg' as const, nameFontSize: '1rem', subtitleFontSize: '0.8125rem', gap: '0.875rem' }
  }

  const config = sizeConfig[size]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: config.gap,
        padding: '0.5rem',
        borderRadius: 'var(--radius-md)',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: hovered && onClick ? 'var(--bg-tertiary)' : 'transparent',
        transition: 'background-color 0.15s ease'
      }}
    >
      <Avatar
        name={name}
        src={src}
        size={config.avatar}
        status={status}
        showTooltip={false}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: config.nameFontSize,
          fontWeight: 500,
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {name}
        </div>

        {(subtitle || status) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: 2
          }}>
            {status && (
              <>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: STATUS_COLORS[status]
                }} />
                <span style={{
                  fontSize: config.subtitleFontSize,
                  color: 'var(--text-muted)'
                }}>
                  {statusLabels[status]}
                </span>
                {subtitle && (
                  <span style={{
                    fontSize: config.subtitleFontSize,
                    color: 'var(--text-muted)'
                  }}>
                    •
                  </span>
                )}
              </>
            )}
            {subtitle && (
              <span style={{
                fontSize: config.subtitleFontSize,
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {actions && (
        <div style={{ flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  )
}

// ============================================
// AVATAR LIST (List of avatar cards)
// ============================================
interface AvatarListProps {
  users: Array<{
    name: string
    src?: string
    subtitle?: string
    status?: 'online' | 'offline' | 'away' | 'busy'
  }>
  size?: 'sm' | 'md' | 'lg'
  onUserClick?: (user: AvatarListProps['users'][0], index: number) => void
}

export function AvatarList({ users, size = 'md', onUserClick }: AvatarListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {users.map((user, idx) => (
        <AvatarCard
          key={idx}
          name={user.name}
          src={user.src}
          subtitle={user.subtitle}
          status={user.status}
          size={size}
          onClick={onUserClick ? () => onUserClick(user, idx) : undefined}
        />
      ))}
    </div>
  )
}
