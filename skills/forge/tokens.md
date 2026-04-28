# Tokens

Design tokens that Forge injects as CSS variables on `<html>` via `ForgeProvider`. Read any variable with `var(--name)`.

## Brand and surface

| Variable | Purpose |
|---|---|
| `--brand-primary` | Primary brand color |
| `--brand-secondary` | Secondary brand color (gradient stop, chart accent) |
| `--active-color` | Active-nav accent. Auto-derived from `brandPrimary` when `activeColor` is empty |
| `--bg-primary` | Page background |
| `--bg-secondary` | Card surface (layer 1) |
| `--bg-tertiary` | Subtle surface / inner layer (layer 2) |
| `--bg-dropdown` | Dropdown menu background |
| `--bg-elevated` | Floating cards, popovers (layer 3) |
| `--bg-subtle` | Ghost-button hover, neutral subtle fills |
| `--bg-hover` | Interactive hover. Auto-derived from `brandPrimary` @ 8% alpha |
| `--bg-active` | Active/selected item. Auto-derived from `brandPrimary` @ 12% alpha |
| `--text-primary` | Body text |
| `--text-secondary` | De-emphasized text |
| `--text-muted` | Disabled or hint text |
| `--border-color` | Default borders |
| `--border-subtle` | Subtle separators |

## Status

Two alias sets are injected. Both point to the same values. Use either.

| Variable | Aliased to |
|---|---|
| `--success` | `--color-success` |
| `--warning` | `--color-warning` |
| `--error` | `--color-error` |
| `--info` | `--color-info` |

## Radius

| Variable | Default |
|---|---|
| `--radius-xs` | `4px` |
| `--radius-sm` | `6px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `16px` |
| `--radius-full` | `9999px` |

Override per-value via `<ForgeProvider theme={{ radiusMd: '10px', radiusLg: '14px' }}>`.

## Spacing

Semantic scale, mirrors `gap` / `padding` prop keys on every Forge primitive.

| Variable | rem | px |
|---|---:|---:|
| `--spacing-none` | `0` | `0` |
| `--spacing-xs` | `0.25rem` | `4` |
| `--spacing-sm` | `0.5rem` | `8` |
| `--spacing-md` | `1rem` | `16` |
| `--spacing-lg` | `1.5rem` | `24` |
| `--spacing-xl` | `2rem` | `32` |
| `--spacing-2xl` | `3rem` | `48` |
| `--spacing-3xl` | `4rem` | `64` |
| `--spacing-4xl` | `6rem` | `96` |

Prop keys: `none | xs | sm | md | lg | xl | 2xl | 3xl | 4xl`.

Override per-value via `<ForgeProvider theme={{ spacingMd: '1.125rem' }}>`.

Raw scale `SPACING` is also exported for pixel-fine control:

```tsx
import { SPACING } from 'wss3-forge'
// SPACING[0] = '0', SPACING[1] = '0.25rem', SPACING[4] = '1rem', ..., SPACING[24] = '6rem'
```

## Elevation shadows

Eight presets. Read via `var(--shadow-*)` or consume through a component.

| Variable | Preset |
|---|---|
| `--shadow-card` | Card |
| `--shadow-dropdown` | Dropdown |
| `--shadow-modal` | Modal |
| `--shadow-toast` | Toast |
| `--shadow-popover` | Popover |
| `--shadow-button` | Button |
| `--shadow-button-hover` | Button hover |
| `--shadow-fab` | Floating action button |

Override globally:

```tsx
<ForgeProvider shadows={{ modal: '0 20px 60px rgba(0,0,0,0.4)' }}>...</ForgeProvider>
```

Disable all shadows:

```tsx
<ForgeProvider shadows={false}>...</ForgeProvider>
```

## `SHADOWS` constant

For direct JS access (charts, canvas, one-off styles):

```tsx
import { SHADOWS } from 'wss3-forge'

SHADOWS.none           // 'none'
SHADOWS.soft.xs        // subtle lift
SHADOWS.soft.sm | md | lg | xl | '2xl'
SHADOWS.medium.xs..2xl
SHADOWS.hard.xs..2xl
SHADOWS.brand.sm | md | lg      // brand-tinted
SHADOWS.inner.sm | md | lg      // inset
SHADOWS.glow.sm | md | lg       // brand glow
SHADOWS.elevation.card | dropdown | modal | toast | popover | button | buttonHover | fab
```

Types: `ShadowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`, `ShadowHardness = 'soft' | 'medium' | 'hard'`.

## Motion tokens

CSS variables (mirror the TypeScript constants):

Durations:
- `--duration-instant` (`0ms`)
- `--duration-micro` (`100ms`)
- `--duration-fast` (`150ms`)
- `--duration-snappy` (`200ms`)
- `--duration-base` (`300ms`)
- `--duration-relaxed` (`500ms`)
- `--duration-slow` (`800ms`)
- `--duration-stately` (`1200ms`)

Easings:
- `--easing-linear`
- `--easing-standard`
- `--easing-emphasized`
- `--easing-decelerate`
- `--easing-accelerate`
- `--easing-overshoot`
- `--easing-anticipate`
- `--easing-elastic`
- `--easing-swift`
- `--easing-gentle`
- `--easing-bounce`
- `--easing-smooth`

Scale: `--motion-scale` (`0.5` subtle, `1` normal, `1.8` dramatic). Set via `<ForgeProvider motionScale="subtle|normal|dramatic">`.

TypeScript constants (same values):

```tsx
import { DURATIONS, EASINGS, SPRINGS, MOTION_SCALES } from 'wss3-forge'

DURATIONS.fast            // 150
EASINGS.standard          // 'cubic-bezier(0.4, 0, 0.2, 1)'
SPRINGS.gentle            // { stiffness: 100, damping: 15, mass: 1 }
MOTION_SCALES.dramatic    // 1.8
```

Spring presets: `stiff | bouncy | gentle | wobbly | molasses`.

## Z-index scale

Stacking order is semantic. Use named keys, not raw numbers.

| Key | Value | Layer |
|---|---:|---|
| `base` | `0` | Page content |
| `raised` | `10` | Non-sticky lift above page |
| `sticky` | `100` | Sticky headers, Affix |
| `floating` | `100` | FAB, float buttons |
| `dropdown` | `200` | Dropdown menus |
| `popover` | `210` | Popovers (above dropdowns) |
| `tooltip` | `220` | Tooltips (above popovers) |
| `drawer` | `300` | Sheet/Drawer panels |
| `modalBackdrop` | `400` | Modal backdrop |
| `modal` | `410` | Modal content |
| `commandBar` | `420` | Ctrl+K palette |
| `notification` | `500` | Top-right notification cards |
| `toast` | `510` | Bottom snackbars |
| `tour` | `600` | Tour overlay |
| `cookieConsent` | `700` | Cookie banner |
| `blocking` | `800` | Full-screen blocking loaders |
| `max` | `999` | Absolute ceiling |

Legacy aliases still exported for existing code: `above=1`, `elevated=2`, `high=5`, `higher=10`, `highest=20`, `floatButton=100`, `overlay=800`. New code should use the named keys above.

```tsx
import { Z_INDEX } from 'wss3-forge'
<div style={{ zIndex: Z_INDEX.modal }} />
```

## Breakpoints

```tsx
import { BREAKPOINTS, useBreakpoint, useIsMobile } from 'wss3-forge'
// BREAKPOINTS = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
```

Responsive keys: `xs | sm | md | lg | xl | 2xl`. Use the same keys in responsive-object props:

```tsx
<Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md" />
```

## Color constants

`COLORS`: status (success, warning, error, info), brand (brandPrimary, brandSecondary), palette (emerald, cyan, amber, red, violet, purple, pink, rose, blue, indigo, teal, sky, lime, orange), gray (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950).

`AVATAR_COLORS`: 8-color array used by `Avatar` to derive a color from a name.

`STATUS_COLORS`: `{ online: '#10b981', offline: '#6b7280', away: '#f59e0b', busy: '#ef4444' }`.

`CHART_COLORS`: 6-color array for chart series.

`SYNTAX_COLORS`: code-highlighting palette (comment, string, keyword, constant, number, class, function, type, selector, property, value, tag, attribute, variable).

`PRESET_COLORS`, `PROJECT_COLORS`: palettes exposed by `ColorPicker`.

`COUNTRIES`: country list (dial codes, flags) used by `PhoneInput`.

## Font family

```tsx
<ForgeProvider fontFamily="'Inter', system-ui, sans-serif">...</ForgeProvider>
```

Injects `--font-family` and applies it on the wrapper. Pass any valid CSS font-family value (include fallbacks).

## Logo filter

`--logo-filter` is set automatically (`none` in dark, `invert(1)` in light) so a monochrome logo can read `filter: var(--logo-filter)` and flip with the theme.
