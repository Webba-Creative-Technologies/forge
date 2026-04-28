// ============================================
// Z-INDEX SCALE
// ============================================
// Clean scale with unique values per concern. Stacking order is semantic:
// base < raised < floating < overlays (dropdown/popover/tooltip) < drawer <
// modal stack < notifications < toasts < tour < cookie < blocking.
// Every "historic" key is kept as an alias so existing imports keep working.
export const Z_INDEX = {
  // ---- Page content layers ----
  base: 0,
  raised: 10,          // NEW — content lifted above the page (non-sticky)

  // ---- Sticky / floating in-flow elements ----
  sticky: 100,         // sticky headers, sticky sidebars, Affix
  floating: 100,       // NEW — FAB, float buttons, scroll-to-top

  // ---- Contextual overlays (dropdowns, popovers, tooltips) ----
  dropdown: 200,
  popover: 210,        // above dropdowns (richer UI)
  tooltip: 220,        // above popovers (short hints on top of richer UI)

  // ---- Drawers & modal stack ----
  // Drawers and modals use a backdrop + panel pair. The backdrop must sit
  // BELOW its own panel so the panel reads on top of the dim layer.
  drawerBackdrop: 290,
  drawer: 300,
  modalBackdrop: 400,
  modal: 410,
  commandBar: 420,     // Ctrl+K palette, above regular modals

  // ---- Top-of-app feedback ----
  notification: 500,   // NEW — top-right notification cards
  toast: 510,          // bottom snackbars (above notifications so confirmations are visible)

  // ---- App-level overlays ----
  tour: 600,
  cookieConsent: 700,
  blocking: 800,       // NEW — blocking loading overlays, full-screen spinners

  // ---- Absolute ceiling ----
  max: 999,

  // ============================================
  // LEGACY ALIASES (backward compatible)
  // Keep importing them, they map onto the new scale.
  // ============================================
  above: 1,            // deprecated, use `raised`
  elevated: 2,         // deprecated, use `raised`
  high: 5,             // deprecated
  higher: 10,          // deprecated, use `raised`
  highest: 20,         // deprecated, use `raised`
  floatButton: 100,    // → floating
  overlay: 800         // → blocking
} as const

// ============================================
// SEMANTIC COLORS
// ============================================
export const COLORS = {
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Brand colors
  brandPrimary: '#A35BFF',
  brandSecondary: '#FD9173',

  // Palette colors
  emerald: '#10b981',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  red: '#ef4444',
  violet: '#8b5cf6',
  purple: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  blue: '#3b82f6',
  indigo: '#6366f1',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  lime: '#84cc16',
  orange: '#f97316',

  // Gray scale
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  }
} as const

// ============================================
// AVATAR COLORS (for string-to-color)
// ============================================
export const AVATAR_COLORS = [
  '#A35BFF', '#FD9173', '#10b981', '#3b82f6',
  '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
] as const

// ============================================
// STATUS COLORS (for Avatar status indicator)
// ============================================
export const STATUS_COLORS = {
  online: '#10b981',
  offline: '#6b7280',
  away: '#f59e0b',
  busy: '#ef4444'
} as const

// ============================================
// CHART COLORS
// ============================================
export const CHART_COLORS = [
  '#A35BFF',
  '#10b981',
  '#06b6d4',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6'
] as const

// ============================================
// CODE SYNTAX COLORS
// ============================================
export const SYNTAX_COLORS = {
  comment: '#6b7280',
  string: '#10b981',
  keyword: '#a855f7',
  constant: '#f59e0b',
  number: '#06b6d4',
  class: '#f472b6',
  function: '#60a5fa',
  type: '#06b6d4',
  selector: '#f472b6',
  property: '#60a5fa',
  value: '#10b981',
  tag: '#a855f7',
  attribute: '#f59e0b',
  variable: '#06b6d4'
} as const

// ============================================
// SHADOWS
// ============================================
// Size scale: xs, sm, md, lg, xl, 2xl
// Hardness: soft (blur), medium, hard (sharp)

export const SHADOWS = {
  // No shadow
  none: 'none',

  // ---- SOFT SHADOWS (high blur, subtle) ----
  soft: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
    md: '0 4px 16px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.10)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.12)',
    '2xl': '0 20px 48px rgba(0, 0, 0, 0.14)'
  },

  // ---- MEDIUM SHADOWS (balanced) ----
  medium: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.08)',
    sm: '0 2px 6px rgba(0, 0, 0, 0.12)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 20px rgba(0, 0, 0, 0.18)',
    xl: '0 12px 28px rgba(0, 0, 0, 0.20)',
    '2xl': '0 20px 40px rgba(0, 0, 0, 0.22)'
  },

  // ---- HARD SHADOWS (less blur, sharp) ----
  hard: {
    xs: '0 1px 1px rgba(0, 0, 0, 0.12)',
    sm: '0 2px 3px rgba(0, 0, 0, 0.18)',
    md: '0 3px 6px rgba(0, 0, 0, 0.22)',
    lg: '0 5px 10px rgba(0, 0, 0, 0.26)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.30)',
    '2xl': '0 12px 24px rgba(0, 0, 0, 0.34)'
  },

  // ---- COLORED SHADOWS (brand-tinted) ----
  brand: {
    sm: '0 2px 8px rgba(163, 91, 255, 0.20)',
    md: '0 4px 16px rgba(163, 91, 255, 0.25)',
    lg: '0 8px 24px rgba(163, 91, 255, 0.30)'
  },

  // ---- INNER SHADOWS ----
  inner: {
    sm: 'inset 0 1px 2px rgba(0, 0, 0, 0.08)',
    md: 'inset 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: 'inset 0 4px 8px rgba(0, 0, 0, 0.16)'
  },

  // ---- GLOW EFFECTS ----
  glow: {
    sm: '0 0 8px rgba(163, 91, 255, 0.30)',
    md: '0 0 16px rgba(163, 91, 255, 0.40)',
    lg: '0 0 24px rgba(163, 91, 255, 0.50)'
  },

  // ---- ELEVATION PRESETS (common use cases) ----
  elevation: {
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    dropdown: '0 4px 16px rgba(0, 0, 0, 0.12)',
    modal: '0 16px 48px rgba(0, 0, 0, 0.20)',
    toast: '0 8px 24px rgba(0, 0, 0, 0.16)',
    popover: '0 4px 20px rgba(0, 0, 0, 0.15)',
    button: '0 2px 4px rgba(0, 0, 0, 0.10)',
    buttonHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fab: '0 6px 20px rgba(0, 0, 0, 0.20)'
  }
} as const

// Type exports
export type ZIndexKey = keyof typeof Z_INDEX
export type ColorKey = keyof typeof COLORS
export type StatusColor = keyof typeof STATUS_COLORS
export type ShadowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ShadowHardness = 'soft' | 'medium' | 'hard'
