import { CSSProperties, ReactNode, useEffect, useId } from 'react'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { Z_INDEX } from '../constants'

// ============================================
// MODAL (with compound components)
// ============================================
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg' | number
  showCloseButton?: boolean
  /** Accessible label for the modal (used if no title) */
  ariaLabel?: string
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
  showCloseButton = true,
  ariaLabel
}: ModalProps) {
  const titleId = useId()
  const descId = useId()

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const widthStyles = {
    sm: 380,
    md: 480,
    lg: 600
  }
  const maxWidth = typeof width === 'number' ? width : widthStyles[width]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: Z_INDEX.modalBackdrop,
        padding: '1rem',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? descId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem'
          }}>
            <div>
              {title && (
                <h2
                  id={titleId}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  id={descId}
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    margin: '0.25rem 0 0 0'
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="interactive-icon"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Dismiss20Regular />
              </button>
            )}
          </div>
        )}
        <div style={{
          padding: '0 1.5rem 1.5rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MODAL CONTENT
// ============================================
interface ModalContentProps {
  children: ReactNode
  noPadding?: boolean
  style?: CSSProperties
}

Modal.Content = function ModalContent({ children, style }: ModalContentProps) {
  return (
    <div style={{
      overflowY: 'auto',
      flex: 1,
      ...style
    }}>
      {children}
    </div>
  )
}

// ============================================
// MODAL FOOTER
// ============================================
interface ModalFooterProps {
  children: ReactNode
  align?: 'left' | 'right' | 'space-between'
}

Modal.Footer = function ModalFooter({ children, align = 'right' }: ModalFooterProps) {
  const justifyContent = align === 'left' ? 'flex-start' :
    align === 'space-between' ? 'space-between' : 'flex-end'

  return (
    <div style={{
      display: 'flex',
      justifyContent,
      gap: '0.5rem',
      marginTop: '1rem'
    }}>
      {children}
    </div>
  )
}

// ============================================
// MODAL TABS (for tabbed modals)
// ============================================
interface ModalTabsProps {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}

Modal.Tabs = function ModalTabs({ tabs, active, onChange }: ModalTabsProps) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 1.5rem'
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={!isActive ? 'interactive-nav' : undefined}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: -1,
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// MODAL SECTION (for grouped content)
// ============================================
interface ModalSectionProps {
  title?: string
  children: ReactNode
}

Modal.Section = function ModalSection({ title, children }: ModalSectionProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {title && (
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
