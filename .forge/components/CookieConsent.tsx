import { useState, useEffect, ReactNode } from 'react'
import { Cookies20Regular, Dismiss20Regular } from '@fluentui/react-icons'
import { Button, IconButton } from './Button'
import { Z_INDEX, SHADOWS } from '../constants'

// ============================================
// COOKIE CONSENT
// ============================================
const COOKIE_CONSENT_KEY = 'forge-cookie-consent'

type ConsentStatus = 'pending' | 'accepted' | 'rejected'

interface CookiePreferences {
  necessary: boolean // Always true
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface CookieConsentProps {
  // Appearance
  variant?: 'banner' | 'modal' | 'floating'
  position?: 'bottom' | 'top' | 'bottom-left' | 'bottom-right'
  // Content
  title?: string
  description?: string | ReactNode
  // Buttons
  acceptAllLabel?: string
  acceptSelectedLabel?: string
  rejectAllLabel?: string
  settingsLabel?: string
  // Features
  showSettings?: boolean // Show granular settings
  showRejectAll?: boolean
  // Callbacks
  onAccept?: (preferences: CookiePreferences) => void
  onReject?: () => void
  onChange?: (preferences: CookiePreferences) => void
}

// Get consent from localStorage
function getStoredConsent(): { status: ConsentStatus; preferences: CookiePreferences } | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // localStorage not available
  }
  return null
}

// Save consent to localStorage
function saveConsent(status: ConsentStatus, preferences: CookiePreferences) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ status, preferences, timestamp: Date.now() }))
  } catch {
    // localStorage not available
  }
}

// Hook to use cookie consent
export function useCookieConsent() {
  const [consent, setConsent] = useState<{ status: ConsentStatus; preferences: CookiePreferences } | null>(null)

  useEffect(() => {
    setConsent(getStoredConsent())
  }, [])

  const hasConsent = consent?.status === 'accepted'
  const isAnalyticsAllowed = consent?.preferences?.analytics ?? false
  const isMarketingAllowed = consent?.preferences?.marketing ?? false
  const isPreferencesAllowed = consent?.preferences?.preferences ?? false

  const resetConsent = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY)
      setConsent(null)
    } catch {
      // localStorage not available
    }
  }

  return {
    hasConsent,
    consentStatus: consent?.status ?? 'pending',
    preferences: consent?.preferences,
    isAnalyticsAllowed,
    isMarketingAllowed,
    isPreferencesAllowed,
    resetConsent
  }
}

export function CookieConsent({
  variant = 'banner',
  position = 'bottom',
  title = 'We use cookies',
  description = 'This site uses cookies to improve your experience. By continuing to browse, you accept our use of cookies.',
  acceptAllLabel = 'Accept all',
  acceptSelectedLabel = 'Accept selected',
  rejectAllLabel = 'Reject all',
  settingsLabel = 'Customize',
  showSettings = true,
  showRejectAll = true,
  onAccept,
  onReject,
  onChange
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true
  })

  // Check if consent already given
  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored || stored.status === 'pending') {
      // Small delay for animation
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    saveConsent('accepted', allAccepted)
    onAccept?.(allAccepted)
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    saveConsent('accepted', preferences)
    onAccept?.(preferences)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const rejected: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    saveConsent('rejected', rejected)
    onReject?.()
    setIsVisible(false)
  }

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    const newPrefs = { ...preferences, [key]: value }
    setPreferences(newPrefs)
    onChange?.(newPrefs)
  }

  if (!isVisible) return null

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    bottom: { bottom: 0, left: 0, right: 0 },
    top: { top: 0, left: 0, right: 0 },
    'bottom-left': { bottom: '1.5rem', left: '1.5rem', maxWidth: 420 },
    'bottom-right': { bottom: '1.5rem', right: '1.5rem', maxWidth: 420 }
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div
        className="animate-slideInUp"
        style={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: Z_INDEX.cookieConsent,
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Cookies20Regular style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreferences(!showPreferences)}
            >
              {settingsLabel}
            </Button>
          )}
          {showRejectAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRejectAll}
            >
              {rejectAllLabel}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleAcceptAll}
          >
            {acceptAllLabel}
          </Button>
        </div>

        {/* Preferences panel */}
        {showPreferences && (
          <div
            style={{
              width: '100%',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
              marginTop: '0.5rem'
            }}
          >
            <PreferencesPanel
              preferences={preferences}
              onChange={handlePreferenceChange}
              onAccept={handleAcceptSelected}
              acceptLabel={acceptSelectedLabel}
            />
          </div>
        )}
      </div>
    )
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <div
        className="animate-slideInUp"
        style={{
          position: 'fixed',
          ...positionStyles[position.includes('bottom') ? position : 'bottom-right'],
          zIndex: Z_INDEX.cookieConsent,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: SHADOWS.medium.xl,
          maxWidth: 380
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
          <Cookies20Regular style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 600 }}>{title}</h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        </div>

        {showPreferences && (
          <PreferencesPanel
            preferences={preferences}
            onChange={handlePreferenceChange}
            compact
          />
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {showRejectAll && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRejectAll}
              style={{ flex: 1 }}
            >
              {rejectAllLabel}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={showPreferences ? handleAcceptSelected : handleAcceptAll}
            style={{ flex: 1 }}
          >
            {showPreferences ? acceptSelectedLabel : acceptAllLabel}
          </Button>
        </div>
      </div>
    )
  }

  // Modal variant
  return (
    <>
      {/* Overlay */}
      <div
        className="animate-fadeIn"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: Z_INDEX.modalBackdrop
        }}
      />
      {/* Modal */}
      <div
        className="animate-scaleIn"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: Z_INDEX.modal,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          width: '90%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: SHADOWS.elevation.modal
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Cookies20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, flex: 1 }}>{title}</h3>
          {showRejectAll && (
            <IconButton
              icon={<Dismiss20Regular />}
              variant="ghost"
              size="sm"
              onClick={handleRejectAll}
            />
          )}
        </div>

        <p style={{ margin: '0 0 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {description}
        </p>

        {showSettings && (
          <PreferencesPanel
            preferences={preferences}
            onChange={handlePreferenceChange}
          />
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {showRejectAll && (
            <Button
              variant="secondary"
              onClick={handleRejectAll}
              style={{ flex: 1 }}
            >
              {rejectAllLabel}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={showSettings ? handleAcceptSelected : handleAcceptAll}
            style={{ flex: 1 }}
          >
            {showSettings ? acceptSelectedLabel : acceptAllLabel}
          </Button>
        </div>
      </div>
    </>
  )
}

// ============================================
// PREFERENCES PANEL (internal)
// ============================================
interface PreferencesPanelProps {
  preferences: CookiePreferences
  onChange: (key: keyof CookiePreferences, value: boolean) => void
  onAccept?: () => void
  acceptLabel?: string
  compact?: boolean
}

const cookieTypes = [
  {
    key: 'necessary' as const,
    title: 'Necessary cookies',
    description: 'Essential for the site to function. Cannot be disabled.',
    required: true
  },
  {
    key: 'analytics' as const,
    title: 'Analytics cookies',
    description: 'Help us understand how you use the site.'
  },
  {
    key: 'marketing' as const,
    title: 'Marketing cookies',
    description: 'Used to show you relevant ads.'
  },
  {
    key: 'preferences' as const,
    title: 'Preference cookies',
    description: 'Remember your choices and preferences.'
  }
]

function PreferencesPanel({ preferences, onChange, onAccept, acceptLabel, compact }: PreferencesPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '0.5rem' : '0.75rem' }}>
      {cookieTypes.map(type => (
        <label
          key={type.key}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: compact ? '0.5rem' : '0.75rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            cursor: type.required ? 'not-allowed' : 'pointer',
            opacity: type.required ? 0.7 : 1
          }}
        >
          <input
            type="checkbox"
            checked={preferences[type.key]}
            disabled={type.required}
            onChange={e => onChange(type.key, e.target.checked)}
            style={{
              width: 18,
              height: 18,
              marginTop: 2,
              accentColor: 'var(--brand-primary)',
              cursor: type.required ? 'not-allowed' : 'pointer'
            }}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{type.title}</span>
            {!compact && (
              <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {type.description}
              </p>
            )}
          </div>
        </label>
      ))}
      {onAccept && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAccept}
          style={{ marginTop: '0.5rem' }}
        >
          {acceptLabel}
        </Button>
      )}
    </div>
  )
}
