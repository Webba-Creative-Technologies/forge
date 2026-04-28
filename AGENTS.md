# AGENTS.md

Hard rules for AI code generation with Forge. Read this before writing any code.

## Rule 1: Forge first, always

Before writing UI, check if Forge already has the component. The full list is in `skills/forge/components.md`. If Forge has it, import it. Do not reimplement.

Do not build: modals, drawers, tooltips, popovers, dropdowns, date pickers, time pickers, toasts, notifications, tables, tabs, accordions, steppers, breadcrumbs, avatars, badges, banners, toolbars, sidebars, navbars, footers, skeletons, spinners, carousels, image galleries, video players, audio players, command palettes, color pickers, sliders, tag inputs, OTP inputs, phone inputs, password inputs, mention inputs, tree views, sortable lists, calendars, timelines, charts, or cookie banners. Forge provides all of these.

## Rule 2: Single import source

Always import from `'wss3-forge'`. No deep imports.

```tsx
// Correct
import { Button, Card, useToast } from 'wss3-forge'

// Wrong
import { Button } from 'wss3-forge/components/Button'
```

## Rule 3: ForgeProvider is required

The app must be wrapped in `ForgeProvider` at the root. Without it, CSS variables are missing and every component renders unstyled. Never nest multiple providers.

```tsx
import { ForgeProvider } from 'wss3-forge'

<ForgeProvider mode="dark">
  <App />
</ForgeProvider>
```

## Rule 4: Icons from Fluent UI 2 only

Icons come from `@fluentui/react-icons`. No `react-icons`, no `lucide-react`, no `heroicons`, no inline SVG when a Fluent equivalent exists.

Naming convention: `{Name}{Size}{Style}` where size is `12 | 16 | 20 | 24 | 28 | 32 | 48` and style is `Regular | Filled`.

```tsx
import { ArrowRight20Regular, Heart24Filled } from '@fluentui/react-icons'
```

No text arrows (`->`, `=>`, `→`). Use `ArrowRight{Size}Regular`.

## Rule 5: Colors via CSS variables

Use `var(--...)` for every color. Never hardcode hex values, RGB, HSL, or any color name.

```tsx
// Correct
<div style={{ color: 'var(--text-primary)', background: 'var(--bg-secondary)' }} />

// Wrong
<div style={{ color: '#fff', background: '#181818' }} />
```

Full variable list is in `skills/forge/tokens.md`.

## Rule 6: Spacing via props or CSS variables

Use gap/padding props on layout primitives (`VStack`, `HStack`, `Grid`, `Card`) or `var(--spacing-*)` vars. Never hardcode `px` or `rem` for spacing when a semantic key exists.

```tsx
// Correct
<VStack gap="md">...</VStack>
<Card padding="lg">...</Card>

// Wrong
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>...</div>
<div style={{ padding: 24 }}>...</div>
```

## Rule 7: Layout via Forge primitives

Use `VStack`, `HStack`, `Grid`, `Container`, `Stack`, `Flex`, `Box`, `Center`, `Spacer`, `AspectRatio`. Do not write flex or grid by hand.

```tsx
// Correct
<HStack gap="sm" align="center" justify="between">
  <Text>Left</Text>
  <Button>Right</Button>
</HStack>

// Wrong
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <span>Left</span>
  <button>Right</button>
</div>
```

## Rule 8: Responsive via hooks and props

Use `useIsMobile()`, `useIsTablet()`, `useIsDesktop()`, `useBreakpoint()`, or the responsive object form on props like `columns={{ xs: 1, md: 3 }}`. Never write `@media` queries. Never read `window.innerWidth` directly.

## Rule 9: Typography via components

Use `Heading` with a semantic `level`. Use `Text` with a `size` prop. Do not style `<h1>`, `<h2>`, or `<span>` manually.

```tsx
// Correct
<Heading level={2}>Section</Heading>
<Text size="sm" color="muted">Help text</Text>

// Wrong
<h2 style={{ fontSize: 24, fontWeight: 600 }}>Section</h2>
<span style={{ fontSize: 12, color: '#999' }}>Help text</span>
```

## Rule 10: Inputs via controlled components

Use `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Radio`, `Slider`, `DatePicker`, `TimePicker`, `Combobox`, `FileUpload`, `OTPInput`, `PhoneInput`, `PasswordInput`, `TagInput`, `MentionInput`, `Rating`. Never write raw `<input>`, `<textarea>`, or `<select>` except inside a Forge component's implementation.

Input `onChange` gives the value directly, not an event:

```tsx
// Correct
<Input value={email} onChange={setEmail} />

// Wrong
<Input value={email} onChange={(e) => setEmail(e.target.value)} />
```

## Rule 11: Overlays via Forge

- Dialogs: `Modal`, `ConfirmDialog`, `AlertDialog`
- Sliding panels: `Sheet`, `BottomSheet`, `SidePanel`
- Dropdowns: `Dropdown`, `SelectDropdown`, `ContextMenu`
- Hover content: `Popover`, `HoverCard`, `Tooltip`, `InfoTooltip`
- Onboarding: `Tour`
- Command palette: `CommandBar`
- Notifications: `useToast()` for transient, `useNotification()` for persistent

Never build custom overlays. Never wrap `AppSidebar` in `Sheet`. Use `AppSidebar mode="drawer"` for mobile nav.

## Rule 12: No em-dashes

No em-dash (`—`) anywhere. Use a period, a comma, a colon, parentheses, or a line break. This applies to every string: UI copy, docs, commit messages, comments, and log messages.

## Rule 13: No emojis

No emojis in UI, logs, or copy. Use Fluent icons for any glyph needs. This keeps the visual language consistent and accessible.

## Rule 14: No decorative fills behind icons

Icons are rendered with `currentColor` on a transparent background. Do not wrap icons in colored circles or squares just for decoration. Colored containers around icons are reserved for real status patterns (`StatusBadge`, `Avatar` status dot). When you need an icon in a card header, place it next to the title, not inside a tinted square.

## Rule 15: Never skip semantic meaning for style

Use `variant="success"`, `variant="error"`, `variant="warning"`, `variant="info"` to convey state. Do not pick a color to imply state and then mislabel it with `variant="default"`. The variant names drive the color, the icon, and the aria-label.

## Rule 16: Respect motion preferences

Motion components read `useReducedMotion()` and fall back to instant transitions when the user requests reduced motion. Do not bypass this with raw CSS `transition` in components.

## Rule 17: No custom CSS classes for design-system concerns

No inline styles for font size, weight, color, radius, shadow, spacing, padding, or transition. Those are all owned by Forge props or CSS variables. Inline styles are acceptable only for one-off positional overrides that no prop covers.

## Rule 18: No backward-compat dead code

When refactoring, remove the old code. Do not leave a `// legacy` alias next to the new export unless the old name is still used elsewhere in the codebase. Forge already keeps legacy z-index aliases for external consumers. Inside the repo, use the new names.

## Files to read for details

- Full component list with props: `skills/forge/components.md`
- CSS variables and tokens: `skills/forge/tokens.md`
- ForgeProvider and theming: `skills/forge/theming.md`
- Motion library: `skills/forge/motion.md`
- Common compositions: `skills/forge/patterns.md`
- Design rationale: `DESIGN.md`
