import React, { createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react'
import { SPACING_SEMANTIC } from '../hooks/useResponsive'
import { SHADOWS } from '../constants'
import { DURATIONS, EASINGS, MOTION_SCALES } from '../motion/tokens'
import type { MotionScaleKey, ReducedMotionPolicy } from '../motion/tokens'

const PREFERS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function readSystemPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches
}

// ============================================
// THEME TYPES
// ============================================
export interface ForgeTheme {
  // Brand colors
  brandPrimary: string
  brandSecondary: string
  // Active/Accent color for navigation (empty string → auto-derived from brandPrimary)
  activeColor: string
  // Backgrounds — ordered from low to high elevation
  bgPrimary: string       // page
  bgSecondary: string     // cards (layer 1)
  bgTertiary: string      // subtle surface / inner layer
  bgDropdown: string      // dropdown menu background
  bgElevated: string      // floating cards, popovers (layer 3, above dropdown)
  bgSubtle: string        // tint for ghost-button hover, neutral subtle surfaces
  bgHover: string         // interactive hover (brand-tinted)
  bgActive: string        // active/selected (empty → auto-derived from brandPrimary 12% alpha)
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
  // Border radius — all optional, allow overriding per-theme.
  // If left undefined, the hardcoded defaults are used
  // (4/6/8/12/16/9999px for xs/sm/md/lg/xl/full).
  radiusXs?: string
  radiusSm?: string
  radiusMd?: string
  radiusLg?: string
  radiusXl?: string
  radiusFull?: string
  // Spacing scale — all optional, allow overriding the semantic spacing
  // tokens globally. Defaults come from SPACING_SEMANTIC
  // (0 / 0.25 / 0.5 / 1 / 1.5 / 2 / 3 / 4 / 6 rem for
  // none/xs/sm/md/lg/xl/2xl/3xl/4xl).
  spacingNone?: string
  spacingXs?: string
  spacingSm?: string
  spacingMd?: string
  spacingLg?: string
  spacingXl?: string
  spacing2xl?: string
  spacing3xl?: string
  spacing4xl?: string
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
// Dark theme — clear elevation spread, brand-tinted interactive states.
// Surface ramp: primary #0F → secondary #18 → tertiary #22 → dropdown #2a →
// elevated #32. Each step is ~8-11 points of luminance so layers are visible
// without the page itself reading too dark.
// Interactive states use brand-tinted rgba instead of neutral gray so the
// whole app reads as "on-brand" rather than "flat gray".
export const darkTheme: ForgeTheme = {
  brandPrimary: '#8B5CF6',
  brandSecondary: '#F97316',
  activeColor: '', // Will be computed from brandPrimary
  bgPrimary: '#0F0F0F',
  bgSecondary: '#181818',
  bgTertiary: '#222222',
  bgDropdown: '#2A2A2A',
  bgElevated: '#323232',
  bgSubtle: 'rgba(255, 255, 255, 0.04)',
  bgHover: '', // Will be computed from brandPrimary (8% alpha)
  bgActive: '', // Will be computed from brandPrimary (12% alpha)
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  borderColor: '#2E2E2E',
  borderSubtle: '#202020',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#60a5fa'
}

// Light theme — subtle elevation on warm-white base, brand-tinted hover.
export const lightTheme: ForgeTheme = {
  brandPrimary: '#A35BFF',
  brandSecondary: '#FD9173',
  activeColor: '', // Will be computed from brandPrimary
  bgPrimary: '#f9f8fc',
  bgSecondary: '#ffffff',
  bgTertiary: '#f3f1fa',
  bgDropdown: '#ffffff',
  bgElevated: '#ffffff',
  bgSubtle: 'rgba(26, 22, 37, 0.04)',
  bgHover: '', // Will be computed from brandPrimary (8% alpha)
  bgActive: '', // Will be computed from brandPrimary (12% alpha)
  textPrimary: '#1a1625',
  textSecondary: '#4a4458',
  textMuted: '#6b6680',
  borderColor: '#d4d0e0',
  borderSubtle: '#e8e5ef',
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
  motionScale: MotionScaleKey
  reducedMotion: ReducedMotionPolicy
}

const ForgeContext = createContext<ForgeContextValue | null>(null)

export function useForge(): ForgeContextValue {
  const context = useContext(ForgeContext)
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      theme: darkTheme,
      setTheme: () => {},
      isDark: true,
      mode: 'dark' as ThemeMode,
      shadows: true,
      motionScale: 'normal',
      reducedMotion: 'auto'
    }
  }
  return context
}

// ============================================
// PROVIDER
// ============================================
export interface ShadowElevation {
  card: string
  dropdown: string
  modal: string
  toast: string
  popover: string
  button: string
  buttonHover: string
  fab: string
}

interface ForgeProviderProps {
  children: ReactNode
  theme?: Partial<ForgeTheme>
  mode?: ThemeMode
  /**
   * Controls elevation shadows.
   * - `true` (default) — use the built-in Forge elevation shadows
   * - `false` — disable all elevation shadows (sets every `--shadow-*` var to `none`)
   * - `Partial<ShadowElevation>` — override one or more elevation shadows
   *   (e.g. to apply a design-system shadow preset like "sharp" or "dreamy")
   */
  shadows?: boolean | Partial<ShadowElevation>
  /**
   * Global motion intensity multiplier.
   * - `'subtle'` — 0.5x, understated motion
   * - `'normal'` — 1x (default), current Forge feel
   * - `'dramatic'` — 1.8x, bigger translate/scale for marketing sites
   */
  motionScale?: MotionScaleKey
  /**
   * Reduced motion policy. Controls how Forge components respond to
   * `prefers-reduced-motion`.
   * - `'auto'` (default) — respect the system preference
   * - `'always'` — force reduced motion on every consumer of `useReducedMotion`
   * - `'never'` — ignore the system preference, always play full motion
   */
  reducedMotion?: ReducedMotionPolicy
  /**
   * App-wide font family. Injects `--font-family` CSS var and applies it on
   * the provider wrapper so descendants inherit by default. Pass any valid
   * CSS font-family value (include fallbacks).
   * Example: `"'Inter', system-ui, sans-serif"`.
   */
  fontFamily?: string
}

const NO_SHADOWS: ShadowElevation = {
  card: 'none',
  dropdown: 'none',
  modal: 'none',
  toast: 'none',
  popover: 'none',
  button: 'none',
  buttonHover: 'none',
  fab: 'none'
}

export function ForgeProvider({
  children,
  theme: customTheme,
  mode = 'dark',
  shadows = true,
  motionScale = 'normal',
  reducedMotion = 'auto',
  fontFamily
}: ForgeProviderProps) {
  const baseTheme = mode === 'light' ? lightTheme : darkTheme
  const theme = useMemo(() => ({
    ...baseTheme,
    ...customTheme
  }), [baseTheme, customTheme])

  // Compute derived colors from brandPrimary
  const activeColor = theme.activeColor || `color-mix(in srgb, ${theme.brandPrimary} 70%, white)`
  const bgActive = theme.bgActive || `color-mix(in srgb, ${theme.brandPrimary} 12%, transparent)`
  const bgHover = theme.bgHover || `color-mix(in srgb, ${theme.brandPrimary} 8%, transparent)`

  // Resolve the final elevation-shadow map based on the `shadows` prop.
  // Defaults come from SHADOWS.elevation; `false` disables everything;
  // an object selectively overrides specific elevations.
  const resolvedShadows: ShadowElevation = useMemo(() => {
    if (shadows === false) return NO_SHADOWS
    const base: ShadowElevation = {
      card: SHADOWS.elevation.card,
      dropdown: SHADOWS.elevation.dropdown,
      modal: SHADOWS.elevation.modal,
      toast: SHADOWS.elevation.toast,
      popover: SHADOWS.elevation.popover,
      button: SHADOWS.elevation.button,
      buttonHover: SHADOWS.elevation.buttonHover,
      fab: SHADOWS.elevation.fab
    }
    if (shadows === true || shadows === undefined) return base
    return { ...base, ...shadows }
  }, [shadows])

  // Exposed as a boolean for components that still gate shadow rendering
  // via `useForge().shadows` (e.g. Card, Table). When the consumer passes
  // `shadows={false}`, these components skip shadows entirely.
  const shadowsEnabled = shadows !== false

  const cssVariables = useMemo(() => ({
    '--brand-primary': theme.brandPrimary,
    '--brand-secondary': theme.brandSecondary,
    '--active-color': activeColor,
    '--bg-primary': theme.bgPrimary,
    '--bg-secondary': theme.bgSecondary,
    '--bg-tertiary': theme.bgTertiary,
    '--bg-dropdown': theme.bgDropdown,
    '--bg-elevated': theme.bgElevated,
    '--bg-subtle': theme.bgSubtle,
    '--bg-hover': bgHover,
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
    // Border radius — theme can override via ForgeTheme.radius* fields.
    // Defaults: 4/6/8/12/16/9999.
    '--radius-xs':   theme.radiusXs   ?? '4px',
    '--radius-sm':   theme.radiusSm   ?? '6px',
    '--radius-md':   theme.radiusMd   ?? '8px',
    '--radius-lg':   theme.radiusLg   ?? '12px',
    '--radius-xl':   theme.radiusXl   ?? '16px',
    '--radius-full': theme.radiusFull ?? '9999px',
    // Size scale for controls (Button, Input, Select, Switch, Checkbox, Badge...).
    // Components reference these via var(--size-*) so horizontal rhythms
    // align across the form/controls family.
    '--size-xs': '28px',
    '--size-sm': '32px',
    '--size-md': '36px',
    '--size-lg': '40px',
    '--size-xl': '48px',
    // Spacing scale - mirrors SPACING_SEMANTIC so consumers can use
    // `var(--spacing-md)` in raw style objects alongside gap/padding props.
    // Each value can be overridden via `ForgeTheme.spacing*` fields.
    '--spacing-none': theme.spacingNone ?? SPACING_SEMANTIC.none,
    '--spacing-xs':   theme.spacingXs   ?? SPACING_SEMANTIC.xs,
    '--spacing-sm':   theme.spacingSm   ?? SPACING_SEMANTIC.sm,
    '--spacing-md':   theme.spacingMd   ?? SPACING_SEMANTIC.md,
    '--spacing-lg':   theme.spacingLg   ?? SPACING_SEMANTIC.lg,
    '--spacing-xl':   theme.spacingXl   ?? SPACING_SEMANTIC.xl,
    '--spacing-2xl':  theme.spacing2xl  ?? SPACING_SEMANTIC['2xl'],
    '--spacing-3xl':  theme.spacing3xl  ?? SPACING_SEMANTIC['3xl'],
    '--spacing-4xl':  theme.spacing4xl  ?? SPACING_SEMANTIC['4xl'],
    // App font family — inherits if not set. Descendants of the wrapper pick
    // this up automatically via the `fontFamily: var(--font-family, inherit)`
    // on the wrapper div below.
    '--font-family': fontFamily ?? 'inherit',
    // Elevation shadows - components read these directly via `var(--shadow-*)`.
    // Drive by the `shadows` prop so passing a preset (or `false`) propagates
    // through every component (Card, StatCard, Dropdown, Modal, Toast, ...)
    // without each component having to know about the preset.
    '--shadow-card': resolvedShadows.card,
    '--shadow-dropdown': resolvedShadows.dropdown,
    '--shadow-modal': resolvedShadows.modal,
    '--shadow-toast': resolvedShadows.toast,
    '--shadow-popover': resolvedShadows.popover,
    '--shadow-button': resolvedShadows.button,
    '--shadow-button-hover': resolvedShadows.buttonHover,
    '--shadow-fab': resolvedShadows.fab,
    // Logo filter for theme
    '--logo-filter': mode === 'dark' ? 'none' : 'invert(1)',
    // ============================================
    // MOTION TOKENS (Forge Motion v3.1.0 "Expressive")
    // Every motion hook/component reads these via CSS var so consumer
    // apps can override a single token globally without touching JS.
    // ============================================
    '--duration-instant': `${DURATIONS.instant}ms`,
    '--duration-micro': `${DURATIONS.micro}ms`,
    '--duration-fast': `${DURATIONS.fast}ms`,
    '--duration-snappy': `${DURATIONS.snappy}ms`,
    '--duration-base': `${DURATIONS.base}ms`,
    '--duration-relaxed': `${DURATIONS.relaxed}ms`,
    '--duration-slow': `${DURATIONS.slow}ms`,
    '--duration-stately': `${DURATIONS.stately}ms`,
    '--easing-linear': EASINGS.linear,
    '--easing-standard': EASINGS.standard,
    '--easing-emphasized': EASINGS.emphasized,
    '--easing-decelerate': EASINGS.decelerate,
    '--easing-accelerate': EASINGS.accelerate,
    '--easing-overshoot': EASINGS.overshoot,
    '--easing-anticipate': EASINGS.anticipate,
    '--easing-elastic': EASINGS.elastic,
    '--easing-swift': EASINGS.swift,
    '--easing-gentle': EASINGS.gentle,
    '--easing-bounce': EASINGS.bounce,
    '--easing-smooth': EASINGS.smooth,
    '--motion-scale': `${MOTION_SCALES[motionScale]}`
  } as React.CSSProperties), [theme, mode, activeColor, bgActive, bgHover, resolvedShadows, motionScale, fontFamily])

  const contextValue = useMemo(() => ({
    theme,
    setTheme: () => {}, // TODO: Add dynamic theme switching
    isDark: mode === 'dark',
    mode,
    shadows: shadowsEnabled,
    motionScale,
    reducedMotion
  }), [theme, mode, shadowsEnabled, motionScale, reducedMotion])

  // ============================================
  // REDUCED MOTION ATTRIBUTE
  // ============================================
  // Mirror the resolved reducedMotion state onto <html data-forge-reduce-
  // motion="true"> so pure CSS rules in motion.css stay in sync with the
  // JS hook. Listens to matchMedia changes when policy is 'auto'.
  const [systemReducesMotion, setSystemReducesMotion] = useState<boolean>(
    () => readSystemPrefersReducedMotion()
  )
  useEffect(() => {
    if (reducedMotion !== 'auto') return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY)
    const handler = (e: MediaQueryListEvent) => setSystemReducesMotion(e.matches)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      type Legacy = {
        addListener: (cb: (e: MediaQueryListEvent) => void) => void
        removeListener: (cb: (e: MediaQueryListEvent) => void) => void
      }
      const legacy = mql as unknown as Legacy
      legacy.addListener(handler)
      return () => legacy.removeListener(handler)
    }
  }, [reducedMotion])

  const effectiveReducedMotion =
    reducedMotion === 'always' ? true : reducedMotion === 'never' ? false : systemReducesMotion

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (effectiveReducedMotion) {
      document.documentElement.dataset.forgeReduceMotion = 'true'
    } else {
      delete document.documentElement.dataset.forgeReduceMotion
    }
  }, [effectiveReducedMotion])

  // Inject CSS variables globally so portals can access them. Also propagate
  // the font-family to <html> so portaled popups (DatePicker, TimePicker,
  // Tooltip, etc.) inherit the configured app font instead of the browser
  // default. Without this, popups rendered into document.body fall back to
  // Times New Roman in browsers that ship serif as the UA font-family.
  useEffect(() => {
    const root = document.documentElement
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })
    if (fontFamily) {
      root.style.fontFamily = 'var(--font-family)'
    }
    return () => {
      Object.keys(cssVariables).forEach((key) => {
        root.style.removeProperty(key)
      })
      if (fontFamily) {
        root.style.removeProperty('font-family')
      }
    }
  }, [cssVariables, fontFamily])

  return (
    <ForgeContext.Provider value={contextValue}>
      <div style={{
        ...cssVariables,
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: fontFamily ? 'var(--font-family)' : undefined
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

// Stagger helper for lists bound to the legacy <Animate> keyframe system.
// Renamed from `Stagger` in v3.1.0 to free up that name for the Motion-based
// <Stagger> in src/motion/Stagger.tsx which offers richer from/to/transition
// props.
interface AnimateStaggerProps {
  children: ReactNode[]
  type?: AnimationType
  baseDelay?: number
  stagger?: number
  className?: string
}

export function AnimateStagger({
  children,
  type = 'slideInUp',
  baseDelay = 0,
  stagger = 50,
  className = ''
}: AnimateStaggerProps) {
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
