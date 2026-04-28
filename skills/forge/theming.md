# Theming

`ForgeProvider` injects every CSS variable Forge components rely on. Wrap the app once, at the root, never nested.

<a id="brand-customization-in-30-seconds"></a>
## Brand customization in 30 seconds

Pass a `theme` override to `ForgeProvider`. Hover, active, and focus tints auto-derive from `brandPrimary`. Radius and font flow into every component without per-component overrides.

```tsx
<ForgeProvider
  mode="light"
  theme={{ brandPrimary: '#5B5BD6', radiusMd: '10px' }}
  fontFamily="'Inter', system-ui, sans-serif"
>
  <App />
</ForgeProvider>
```

## `ForgeProvider` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | App content |
| `theme` | `Partial<ForgeTheme>` | `{}` | Flat overrides on top of the default dark/light palette |
| `mode` | `'dark' \| 'light'` | `'dark'` | Which base palette to use before applying `theme` |
| `shadows` | `boolean \| Partial<ShadowElevation>` | `true` | `true` uses built-in shadows, `false` disables all, object overrides specific elevations |
| `motionScale` | `'subtle' \| 'normal' \| 'dramatic'` | `'normal'` | Global motion intensity (0.5x, 1x, 1.8x) |
| `reducedMotion` | `'auto' \| 'always' \| 'never'` | `'auto'` | How to respond to `prefers-reduced-motion` |
| `fontFamily` | `string` | inherit | CSS font-family value. Injected as `--font-family` and applied on the wrapper |

`ShadowElevation` keys: `card | dropdown | modal | toast | popover | button | buttonHover | fab`.

## `ForgeTheme` (flat shape)

```ts
interface ForgeTheme {
  // Brand
  brandPrimary: string
  brandSecondary: string
  activeColor: string    // empty string → auto-derived from brandPrimary
  // Backgrounds (low to high elevation)
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  bgDropdown: string
  bgElevated: string
  bgSubtle: string
  bgHover: string        // empty → auto-derived from brandPrimary @ 8% alpha
  bgActive: string       // empty → auto-derived from brandPrimary @ 12% alpha
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
  // Radius (optional, overrides the hardcoded defaults)
  radiusXs?: string
  radiusSm?: string
  radiusMd?: string
  radiusLg?: string
  radiusXl?: string
  radiusFull?: string
  // Spacing (optional, overrides SPACING_SEMANTIC defaults)
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
```

There is no nested `dark:{}` / `light:{}` shape. Pass one flat object. `mode` picks the base palette, `theme` overrides on top.

## `darkTheme` defaults

```ts
brandPrimary:   '#8B5CF6'
brandSecondary: '#F97316'
activeColor:    ''   // auto-derived from brandPrimary
bgPrimary:      '#0F0F0F'
bgSecondary:    '#181818'
bgTertiary:     '#222222'
bgDropdown:     '#2A2A2A'
bgElevated:     '#323232'
bgSubtle:       'rgba(255, 255, 255, 0.04)'
bgHover:        ''   // auto-derived from brandPrimary @ 8% alpha
bgActive:       ''   // auto-derived from brandPrimary @ 12% alpha
textPrimary:    '#FFFFFF'
textSecondary:  '#9CA3AF'
textMuted:      '#6B7280'
borderColor:    '#2E2E2E'
borderSubtle:   '#202020'
success:        '#10B981'
warning:        '#F59E0B'
error:          '#EF4444'
info:           '#60A5FA'
```

## `lightTheme` defaults

```ts
brandPrimary:   '#A35BFF'
brandSecondary: '#FD9173'
activeColor:    ''
bgPrimary:      '#f9f8fc'
bgSecondary:    '#ffffff'
bgTertiary:     '#f3f1fa'
bgDropdown:     '#ffffff'
bgElevated:     '#ffffff'
bgSubtle:       'rgba(26, 22, 37, 0.04)'
bgHover:        ''
bgActive:       ''
textPrimary:    '#1a1625'
textSecondary:  '#4a4458'
textMuted:      '#6b6680'
borderColor:    '#d4d0e0'
borderSubtle:   '#e8e5ef'
success:        '#10b981'
warning:        '#f97316'
error:          '#ef4444'
info:           '#3b82f6'
```

## `useForge()` hook

Reads the current theme context.

```tsx
import { useForge } from 'wss3-forge'

const { theme, isDark, mode, shadows, motionScale, reducedMotion } = useForge()
```

| Field | Type | Description |
|---|---|---|
| `theme` | `ForgeTheme` | The resolved theme object (base merged with overrides) |
| `setTheme` | `(partial: Partial<ForgeTheme>) => void` | Placeholder, currently a no-op |
| `isDark` | `boolean` | `mode === 'dark'` |
| `mode` | `'dark' \| 'light'` | Active mode |
| `shadows` | `boolean` | Whether shadows are enabled (false if `shadows={false}` was passed) |
| `motionScale` | `'subtle' \| 'normal' \| 'dramatic'` | Motion scale |
| `reducedMotion` | `'auto' \| 'always' \| 'never'` | Reduced motion policy |

If called outside a `ForgeProvider`, returns the dark defaults.

## `createTheme` helper

Small helper to merge a base theme (`dark` or `light`) with overrides.

```tsx
import { createTheme, ForgeProvider } from 'wss3-forge'

const myTheme = createTheme('dark', {
  brandPrimary: '#3B82F6',
  brandSecondary: '#60A5FA',
  radiusMd: '10px'
})

<ForgeProvider theme={myTheme}>
  <App />
</ForgeProvider>
```

## `themes` export

`themes` is an object of preset themes keyed by name. Read via `themes.dark`, `themes.light`, `themes.default`.

```tsx
import { themes } from 'wss3-forge'
// themes.dark | themes.light | themes.default
```

## Toggling mode at runtime

`ForgeProvider` is not stateful by itself. Hold the mode in your own React state, pass it down:

```tsx
const [mode, setMode] = useState<'dark' | 'light'>('dark')

<ForgeProvider mode={mode}>
  <App onToggleTheme={() => setMode(m => m === 'dark' ? 'light' : 'dark')} />
</ForgeProvider>
```

## Full example

```tsx
import { ForgeProvider, ToastProvider, NotificationProvider, NavigationProvider } from 'wss3-forge'
import 'wss3-forge/styles/animations.css'
import 'wss3-forge/styles/motion.css'

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <ForgeProvider
      mode="dark"
      fontFamily="'Inter', system-ui, sans-serif"
      theme={{
        brandPrimary: '#3B82F6',
        brandSecondary: '#60A5FA',
        radiusMd: '10px',
        radiusLg: '14px'
      }}
      motionScale="normal"
      reducedMotion="auto"
    >
      <NavigationProvider>
        <ToastProvider position="bottom-right">
          <NotificationProvider position="top-right">
            {children}
          </NotificationProvider>
        </ToastProvider>
      </NavigationProvider>
    </ForgeProvider>
  )
}
```

`ToastProvider`, `NotificationProvider`, and `NavigationProvider` are separate providers. Only mount the ones your app uses.
