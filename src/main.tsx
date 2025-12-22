import React, { useState, createContext, useContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '../.forge/styles/animations.css'
import { ForgeProvider, ToastProvider, NotificationProvider, CookieConsent, useCookieConsent, NavigationProvider } from '../.forge'

type ThemeMode = 'dark' | 'light'

interface ThemeContextValue {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  toggleTheme: () => {}
})

export function useTheme() {
  return useContext(ThemeContext)
}

function Root() {
  const { isPreferencesAllowed, consentStatus } = useCookieConsent()

  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forge-theme')
      return (saved as ThemeMode) || 'dark'
    }
    return 'dark'
  })

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      // Only save if preferences cookies are allowed
      if (isPreferencesAllowed) {
        localStorage.setItem('forge-theme', next)
      }
      return next
    })
  }

  // Handle consent changes
  useEffect(() => {
    if (consentStatus === 'rejected') {
      localStorage.removeItem('forge-theme')
    } else if (consentStatus === 'accepted' && isPreferencesAllowed) {
      // Save current theme when user accepts cookies
      localStorage.setItem('forge-theme', mode)
    }
  }, [consentStatus, isPreferencesAllowed, mode])

  // Optional: Initialize analytics (configure in .env)
  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_ID
    if (clarityId) {
      import('@microsoft/clarity').then(({ default: clarity }) => {
        clarity.init(clarityId)
      })
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ForgeProvider mode={mode}>
        <NavigationProvider>
          <ToastProvider position="bottom-right">
            <NotificationProvider position="top-right">
              <App />
              <CookieConsent
                variant="floating"
                position="bottom-left"
                title="Cookies"
                description="We use cookies to improve your experience and save your preferences."
                acceptAllLabel="Accept"
                rejectAllLabel="Reject"
                showSettings={false}
                showRejectAll={true}
              />
            </NotificationProvider>
          </ToastProvider>
        </NavigationProvider>
      </ForgeProvider>
    </ThemeContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
