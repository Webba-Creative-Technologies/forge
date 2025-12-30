import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react'
import {
  Dismiss16Regular,
  CheckmarkCircle20Filled,
  ErrorCircle20Filled,
  Warning20Filled,
  Info20Filled
} from '@fluentui/react-icons'
import { IconButton } from './Button'
import { Button } from './Button'
import { Text } from './Typography'
import { Z_INDEX } from '../constants'

// ============================================
// TYPES
// ============================================
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number | null // null = persistent
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }>
  avatar?: string
  icon?: ReactNode
  onClose?: () => void
  timestamp?: Date
}

interface NotificationContextType {
  notifications: NotificationData[]
  notify: (notification: Omit<NotificationData, 'id'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

// ============================================
// CONTEXT
// ============================================
const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

// ============================================
// PROVIDER
// ============================================
interface NotificationProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  maxVisible?: number
}

export function NotificationProvider({
  children,
  position = 'top-right',
  maxVisible = 5
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const notify = useCallback((notification: Omit<NotificationData, 'id'>): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification: NotificationData = {
      ...notification,
      id,
      timestamp: new Date()
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      return updated.slice(0, maxVisible + 5) // Keep a few extra for animation
    })

    // Auto dismiss if duration is set
    if (notification.duration !== null && notification.duration !== undefined) {
      setTimeout(() => {
        dismiss(id)
      }, notification.duration)
    }

    return id
  }, [maxVisible])

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setNotifications([])
  }, [])

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 }
  }

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss, dismissAll }}>
      {children}
      {/* Notification container */}
      <div
        style={{
          position: 'fixed',
          ...positionStyles[position],
          display: 'flex',
          flexDirection: position.startsWith('top') ? 'column' : 'column-reverse',
          gap: 12,
          zIndex: Z_INDEX.dropdown,
          maxWidth: 400,
          width: '100%',
          pointerEvents: 'none'
        }}
      >
        {notifications.slice(0, maxVisible).map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={() => dismiss(notification.id)}
            index={index}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

// ============================================
// NOTIFICATION ITEM
// ============================================
interface NotificationItemProps {
  notification: NotificationData
  onDismiss: () => void
  index: number
}

function NotificationItem({ notification, onDismiss, index }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => {
      notification.onClose?.()
      onDismiss()
    }, 200)
  }

  const typeConfig: Record<NotificationType, { icon: ReactNode; color: string }> = {
    info: { icon: <Info20Filled />, color: 'var(--brand-primary)' },
    success: { icon: <CheckmarkCircle20Filled />, color: '#10b981' },
    warning: { icon: <Warning20Filled />, color: '#f59e0b' },
    error: { icon: <ErrorCircle20Filled />, color: '#ef4444' }
  }

  const config = typeConfig[notification.type]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        padding: '1rem',
        pointerEvents: 'auto',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transform: isVisible && !isLeaving
          ? 'translateX(0) scale(1)'
          : 'translateX(20px) scale(0.95)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${index * 50}ms`
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Icon or Avatar */}
        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          {notification.avatar ? (
            <img
              src={notification.avatar}
              alt=""
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              color: config.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notification.icon || config.icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <Text weight="semibold" style={{ marginBottom: 2 }}>
              {notification.title}
            </Text>
            <IconButton
              icon={<Dismiss16Regular />}
              size="xs"
              variant="ghost"
              onClick={handleDismiss}
            />
          </div>

          {notification.message && (
            <Text size="sm" color="secondary" style={{ marginBottom: notification.actions ? 12 : 0 }}>
              {notification.message}
            </Text>
          )}

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {notification.actions.map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant || (i === 0 ? 'primary' : 'ghost')}
                  size="xs"
                  onClick={() => {
                    action.onClick()
                    handleDismiss()
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          {notification.timestamp && (
            <Text size="xs" color="muted" style={{ marginTop: 8 }}>
              {formatTime(notification.timestamp)}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// HELPERS
// ============================================
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 60) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// ============================================
// STANDALONE NOTIFICATION (no provider needed)
// ============================================
interface StandaloneNotificationProps {
  type: NotificationType
  title: string
  message?: string
  onClose?: () => void
  actions?: NotificationData['actions']
  className?: string
  style?: React.CSSProperties
}

export function Notification({
  type,
  title,
  message,
  onClose,
  actions,
  className,
  style
}: StandaloneNotificationProps) {
  const [hovered, setHovered] = useState(false)

  const typeConfig: Record<NotificationType, { icon: ReactNode; color: string }> = {
    info: { icon: <Info20Filled />, color: 'var(--brand-primary)' },
    success: { icon: <CheckmarkCircle20Filled />, color: '#10b981' },
    warning: { icon: <Warning20Filled />, color: '#f59e0b' },
    error: { icon: <ErrorCircle20Filled />, color: '#ef4444' }
  }

  const config = typeConfig[type]

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        display: 'flex',
        gap: 10,
        transition: 'all 0.15s ease',
        ...style
      }}
    >
      <div style={{
        color: config.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        paddingTop: 2
      }}>
        {config.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text weight="semibold">{title}</Text>
          {onClose && (
            <IconButton icon={<Dismiss16Regular />} size="xs" variant="ghost" onClick={onClose} />
          )}
        </div>
        {message && <Text size="sm" color="secondary">{message}</Text>}
        {actions && actions.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant || (i === 0 ? 'primary' : 'ghost')}
                size="xs"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
