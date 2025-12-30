import { ReactNode, useEffect, useCallback, useState } from 'react'
import {
  Warning20Regular,
  Delete20Regular,
  Info20Regular,
  CheckmarkCircle20Regular
} from '@fluentui/react-icons'
import { Z_INDEX } from '../constants'

// ============================================
// CONFIRM DIALOG
// ============================================
interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning' | 'success'
  icon?: ReactNode
  loading?: boolean
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  icon,
  loading,
  children
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      onClose()
    }
  }, [onClose, loading])

  useEffect(() => {
    if (open) {
      // Small delay for animation
      requestAnimationFrame(() => setIsVisible(true))
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const variantConfig = {
    default: {
      icon: icon || <Info20Regular />,
      iconColor: 'var(--text-primary)',
      buttonBg: 'var(--brand-primary)',
      buttonText: 'white'
    },
    danger: {
      icon: icon || <Delete20Regular />,
      iconColor: 'var(--error)',
      buttonBg: 'var(--error)',
      buttonText: 'white'
    },
    warning: {
      icon: icon || <Warning20Regular />,
      iconColor: 'var(--warning)',
      buttonBg: 'var(--warning)',
      buttonText: '#1a1a1a'
    },
    success: {
      icon: icon || <CheckmarkCircle20Regular />,
      iconColor: 'var(--success)',
      buttonBg: 'var(--success)',
      buttonText: 'white'
    }
  }

  const config = variantConfig[variant]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={loading ? undefined : onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: Z_INDEX.modalBackdrop,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-out'
        }}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.95})`,
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
          zIndex: Z_INDEX.modal,
          padding: '1.5rem',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
        }}
      >
        {/* Header with icon + title */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginBottom: description || children ? '0.75rem' : '1.25rem'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.iconColor,
            fontSize: 20,
            flexShrink: 0,
            height: '1.5rem',
            marginTop: '0.0625rem'
          }}>
            {config.icon}
          </span>
          <h2
            id="confirm-title"
            style={{
              margin: 0,
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: '1.5rem'
            }}
          >
            {title}
          </h2>
        </div>

        {/* Description */}
        {description && (
          <p
            id="confirm-description"
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: children ? '1rem' : 0
            }}
          >
            {description}
          </p>
        )}

        {/* Custom content */}
        {children && (
          <div>
            {children}
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '1.25rem'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.15s ease'
            }}
            className="btn-ghost"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: config.buttonText,
              backgroundColor: config.buttonBg,
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            className="btn-primary"
          >
            {loading && (
              <span style={{
                width: 16,
                height: 16,
                border: `2px solid ${config.buttonText === 'white' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                borderTopColor: config.buttonText,
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </>
  )
}

// ============================================
// ALERT DIALOG (Info only, single button)
// ============================================
interface AlertDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  buttonText?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  icon?: ReactNode
}

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  buttonText = 'OK',
  variant = 'info',
  icon
}: AlertDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setIsVisible(true))
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          onClose()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    } else {
      setIsVisible(false)
    }
  }, [open, onClose])

  if (!open) return null

  const variantConfig = {
    info: {
      icon: icon || <Info20Regular />,
      iconColor: 'var(--info)'
    },
    success: {
      icon: icon || <CheckmarkCircle20Regular />,
      iconColor: 'var(--success)'
    },
    warning: {
      icon: icon || <Warning20Regular />,
      iconColor: 'var(--warning)'
    },
    error: {
      icon: icon || <Delete20Regular />,
      iconColor: 'var(--error)'
    }
  }

  const config = variantConfig[variant]

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: Z_INDEX.modalBackdrop,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-out'
        }}
      />
      <div
        role="alertdialog"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.95})`,
          width: '100%',
          maxWidth: 360,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
          zIndex: Z_INDEX.modal,
          padding: '1.5rem',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
        }}
      >
        {/* Header with icon + title */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginBottom: description ? '0.75rem' : '1.25rem'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.iconColor,
            fontSize: 20,
            flexShrink: 0,
            height: '1.5rem',
            marginTop: '0.0625rem'
          }}>
            {config.icon}
          </span>
          <h2 style={{
            margin: 0,
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: '1.5rem'
          }}>
            {title}
          </h2>
        </div>

        {description && (
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            {description}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          autoFocus
          style={{
            width: '100%',
            marginTop: '1.25rem',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'white',
            backgroundColor: 'var(--brand-primary)',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          className="btn-primary"
        >
          {buttonText}
        </button>
      </div>
    </>
  )
}
