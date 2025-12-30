import React, { createContext, useContext, ReactNode, useMemo, useEffect } from 'react'

// ============================================
// THEME TYPES
// ============================================
export interface ForgeTheme {
  // Brand colors
  brandPrimary: string
  brandSecondary: string
  // Active/Accent color for navigation
  activeColor: string
  // Backgrounds
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  bgDropdown: string
  bgHover: string  // For button/element hover states
  bgActive: string // Background for active nav items
  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string
  // Border
  borderColor: string
  borderSubtle: string
  // Semantic
  success: string
  warning: string
  error: string
  info: string
}

// ============================================
// SEMANTIC COLORS (Normalized across themes)
// ============================================
const SEMANTIC_COLORS = {
  // Light themes - More saturated for contrast on light backgrounds
  light: {
    success: '#10b981', // emerald-500
    warning: '#f97316', // orange-500
    error: '#ef4444',   // red-500
    info: '#3b82f6'     // blue-500
  },
  // Dark themes - Slightly lighter/softer for dark backgrounds
  dark: {
    success: '#34d399', // emerald-400
    warning: '#fb923c', // orange-400
    error: '#f87171',   // red-400
    info: '#60a5fa'     // blue-400
  }
}

// ============================================
// DEFAULT THEMES
// ============================================
// Dark theme - Default dark mode
export const darkTheme: ForgeTheme = {
  brandPrimary: '#A35BFF',
  brandSecondary: '#FD9173',
  activeColor: '', // Will be computed from brandPrimary
  bgPrimary: '#070707',
  bgSecondary: '#0c0c0c',
  bgTertiary: '#1a1a1a',
  bgDropdown: '#1f1f1f',
  bgHover: '#2a2a2a',
  bgActive: '', // Will be computed from brandPrimary
  textPrimary: '#fafafa',
  textSecondary: '#a3a3a3',
  textMuted: '#737373',
  borderColor: '#404040',
  borderSubtle: '#404040',
  ...SEMANTIC_COLORS.dark
}

// Light theme - Purple-tinted on-brand
export const lightTheme: ForgeTheme = {
  brandPrimary: '#A35BFF',
  brandSecondary: '#FD9173',
  activeColor: '', // Will be computed from brandPrimary
  bgPrimary: '#f9f8fc',
  bgSecondary: '#fcfcfd',
  bgTertiary: '#f3f1fa',
  bgDropdown: '#fcfcfd',
  bgHover: '#ebe7f5',
  bgActive: '', // Will be computed from brandPrimary
  textPrimary: '#1a1625',
  textSecondary: '#4a4458',
  textMuted: '#6b6680',
  borderColor: '#d4d0e0',
  borderSubtle: '#d4d0e0',
  ...SEMANTIC_COLORS.light
}

// ============================================
// CONTEXT
// ============================================
export type ThemeMode = 'dark' | 'light'

interface ForgeContextValue {
  theme: ForgeTheme
  setTheme: (theme: Partial<ForgeTheme>) => void
  isDark: boolean
  mode: ThemeMode
  shadows: boolean
}

const ForgeContext = createContext<ForgeContextValue | null>(null)

export function useForge() {
  const context = useContext(ForgeContext)
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      theme: darkTheme,
      setTheme: () => {},
      isDark: true,
      mode: 'dark' as ThemeMode,
      shadows: true
    }
  }
  return context
}

// ============================================
// PROVIDER
// ============================================
interface ForgeProviderProps {
  children: ReactNode
  theme?: Partial<ForgeTheme>
  mode?: ThemeMode
  shadows?: boolean
}

export function ForgeProvider({
  children,
  theme: customTheme,
  mode = 'dark',
  shadows = true
}: ForgeProviderProps) {
  const baseTheme = mode === 'light' ? lightTheme : darkTheme
  const theme = useMemo(() => ({
    ...baseTheme,
    ...customTheme
  }), [baseTheme, customTheme])

  // Compute derived colors from brandPrimary
  const activeColor = theme.activeColor || `color-mix(in srgb, ${theme.brandPrimary} 70%, white)`
  const bgActive = theme.bgActive || `color-mix(in srgb, ${theme.brandPrimary} 12%, transparent)`

  const cssVariables = useMemo(() => ({
    '--brand-primary': theme.brandPrimary,
    '--brand-secondary': theme.brandSecondary,
    '--active-color': activeColor,
    '--bg-primary': theme.bgPrimary,
    '--bg-secondary': theme.bgSecondary,
    '--bg-tertiary': theme.bgTertiary,
    '--bg-dropdown': theme.bgDropdown,
    '--bg-hover': theme.bgHover,
    '--bg-active': bgActive,
    '--text-primary': theme.textPrimary,
    '--text-secondary': theme.textSecondary,
    '--text-muted': theme.textMuted,
    '--border-color': theme.borderColor,
    '--border-subtle': theme.borderSubtle,
    '--color-success': theme.success,
    '--color-warning': theme.warning,
    '--color-error': theme.error,
    '--color-info': theme.info,
    // Aliases
    '--success': theme.success,
    '--warning': theme.warning,
    '--error': theme.error,
    '--info': theme.info,
    // Border radius - consistent across all components
    '--radius-xs': '4px',
    '--radius-sm': '6px',
    '--radius-md': '8px',
    '--radius-lg': '12px',
    '--radius-xl': '16px',
    '--radius-full': '9999px',
    // Logo filter for theme
    '--logo-filter': mode === 'dark' ? 'none' : 'invert(1)'
  } as React.CSSProperties), [theme, mode, activeColor, bgActive])

  const contextValue = useMemo(() => ({
    theme,
    setTheme: () => {}, // TODO: Add dynamic theme switching
    isDark: mode === 'dark',
    mode,
    shadows
  }), [theme, mode, shadows])

  // Inject CSS variables globally so portals can access them
  useEffect(() => {
    const root = document.documentElement
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })
    return () => {
      Object.keys(cssVariables).forEach((key) => {
        root.style.removeProperty(key)
      })
    }
  }, [cssVariables])

  return (
    <ForgeContext.Provider value={contextValue}>
      <div style={{
        ...cssVariables,
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        {children}
      </div>
    </ForgeContext.Provider>
  )
}

// ============================================
// THEME HELPERS
// ============================================
export function createTheme(overrides: Partial<ForgeTheme>, base: 'dark' | 'light' = 'dark'): ForgeTheme {
  const baseTheme = base === 'dark' ? darkTheme : lightTheme
  return { ...baseTheme, ...overrides }
}

// Available themes
export const themes = {
  dark: darkTheme,
  light: lightTheme,
  default: darkTheme
}

// ============================================
// ANIMATE COMPONENT (for staggered animations)
// ============================================
type AnimationType = 'fadeIn' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn'

interface AnimateProps {
  children: ReactNode
  type?: AnimationType
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function Animate({
  children,
  type = 'fadeIn',
  delay = 0,
  duration,
  className = '',
  style
}: AnimateProps) {
  return (
    <div
      className={`animate-${type} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
        animationDuration: duration ? `${duration}ms` : undefined,
        ...style
      }}
    >
      {children}
    </div>
  )
}

// Stagger helper for lists
interface StaggerProps {
  children: ReactNode[]
  type?: AnimationType
  baseDelay?: number
  stagger?: number
  className?: string
}

export function Stagger({
  children,
  type = 'slideInUp',
  baseDelay = 0,
  stagger = 50,
  className = ''
}: StaggerProps) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <Animate
          type={type}
          delay={baseDelay + index * stagger}
          className={className}
        >
          {child}
        </Animate>
      ))}
    </>
  )
}
