import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  CheckmarkCircle20Regular,
  ErrorCircle20Regular,
  Warning20Regular,
  Info20Regular,
  Dismiss16Regular
} from '@fluentui/react-icons'
import { Z_INDEX, COLORS } from '../constants'

// ============================================
// TOAST TYPES
// ============================================
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  variant: ToastType
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

interface ToastContextValue {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  success: (title: string, message?: string) => string
  error: (title: string, message?: string) => string
  warning: (title: string, message?: string) => string
  info: (title: string, message?: string) => string
}

// ============================================
// TOAST CONTEXT
// ============================================
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// ============================================
// TOAST PROVIDER
// ============================================
interface ToastProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxVisible?: number
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  maxVisible = 5
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastData = { ...toast, id }

    setToasts(prev => {
      const updated = [...prev, newToast]
      return updated.slice(-maxVisible)
    })

    // Auto remove
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }

    return id
  }, [maxVisible, removeToast])

  const success = useCallback((title: string, message?: string) => {
    return addToast({ variant: 'success', title, message })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    return addToast({ variant: 'error', title, message, duration: 8000 })
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    return addToast({ variant: 'warning', title, message })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    return addToast({ variant: 'info', title, message })
  }, [addToast])

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' }
  }

  const isBottom = position.includes('bottom')

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          zIndex: Z_INDEX.toast,
          display: 'flex',
          flexDirection: isBottom ? 'column-reverse' : 'column',
          gap: '0.5rem',
          maxWidth: 380,
          width: '100%',
          pointerEvents: 'none',
          ...positionStyles[position]
        }}
      >
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            index={index}
            fromBottom={isBottom}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ============================================
// TOAST COMPONENT
// ============================================
interface ToastProps {
  toast: ToastData
  onClose: () => void
  index: number
  fromBottom: boolean
}

function Toast({ toast, onClose, index, fromBottom }: ToastProps) {
  const [dismissHovered, setDismissHovered] = useState(false)

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckmarkCircle20Regular />,
    error: <ErrorCircle20Regular />,
    warning: <Warning20Regular />,
    info: <Info20Regular />
  }

  const colors: Record<ToastType, string> = {
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info
  }

  const color = colors[toast.variant]

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: `4px solid ${color}`,
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-toast)',
        pointerEvents: 'auto',
        animation: `${fromBottom ? 'slideInUp' : 'slideInDown'} 0.25s ease-out`,
        animationFillMode: 'both',
        animationDelay: `${index * 50}ms`
      }}
    >
      <div style={{ color, flexShrink: 0, marginTop: 1 }}>
        {icons[toast.variant]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 500,
          fontSize: '0.875rem',
          color: 'var(--text-primary)',
          marginBottom: toast.message ? '0.25rem' : 0
        }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4
          }}>
            {toast.message}
          </div>
        )}
        {toast.actions && toast.actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: `${color}20`,
              border: 'none',
              color: color,
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        onMouseEnter={() => setDismissHovered(true)}
        onMouseLeave={() => setDismissHovered(false)}
        style={{
          background: dismissHovered ? 'var(--bg-tertiary)' : 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          flexShrink: 0,
          transform: dismissHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.15s ease'
        }}
      >
        <Dismiss16Regular />
      </button>
    </div>
  )
}

// ============================================
// STANDALONE TOAST (without provider)
// ============================================
interface SimpleToastProps {
  variant: ToastType
  title: string
  message?: string
  onClose?: () => void
}

export function SimpleToast({ variant, title, message, onClose }: SimpleToastProps) {
  const [dismissHovered, setDismissHovered] = useState(false)

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckmarkCircle20Regular />,
    error: <ErrorCircle20Regular />,
    warning: <Warning20Regular />,
    info: <Info20Regular />
  }

  const colors: Record<ToastType, string> = {
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info
  }

  const color = colors[variant]

  return (
    <div
      role="alert"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: `4px solid ${color}`,
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-toast)'
      }}
    >
      <div style={{ color, flexShrink: 0 }}>
        {icons[variant]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{title}</div>
        {message && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {message}
          </div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          onMouseEnter={() => setDismissHovered(true)}
          onMouseLeave={() => setDismissHovered(false)}
          style={{
            background: dismissHovered ? 'var(--bg-tertiary)' : 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 2,
            transform: dismissHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.15s ease'
          }}
        >
          <Dismiss16Regular />
        </button>
      )}
    </div>
  )
}
