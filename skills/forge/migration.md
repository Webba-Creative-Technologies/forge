# Migration

How to upgrade Forge without breaking things. Read the section that matches your current version.

## From any pre-1.0.19 to 1.0.19+

### Run the CLI

```bash
npm install wss3-forge@latest @fluentui/react-icons
npx wss3-forge upgrade
```

`upgrade` detects your current skill version and re-syncs `.claude/skills/forge/` with the package. No data loss.

### CSS imports consolidated

If you had two imports, replace them with one:

```tsx
// Before
import 'wss3-forge/styles/animations.css'
import 'wss3-forge/styles/motion.css'

// After
import 'wss3-forge/styles'
```

The sub-paths still work, so existing code keeps running.

### FORGE_AI_GUIDE.md is gone

If your project references `node_modules/wss3-forge/FORGE_AI_GUIDE.md` in docs, CI, or AI prompts, update the path:

- Hard rules: `node_modules/wss3-forge/AGENTS.md`
- Component props: `node_modules/wss3-forge/skills/forge/components.md`
- Design tokens: `node_modules/wss3-forge/skills/forge/tokens.md`

### Z-index scale rescaled

If you imported `Z_INDEX` and used keys like `overlay`, `floatButton`, `highest`, they still work (kept as aliases). New code should use the semantic keys:

| Old key | New key | Value |
|---|---|---|
| `above` | `raised` | `10` |
| `elevated` | `raised` | `10` |
| `high` | (no direct equivalent) | (pick `raised` or `sticky`) |
| `higher` | `raised` | `10` |
| `highest` | `raised` | `10` |
| `floatButton` | `floating` | `100` |
| `overlay` | `blocking` | `800` |

Raw numeric values changed significantly. If you hardcoded a number like `zIndex: 9000` to beat toasts, switch to `zIndex: Z_INDEX.toast + 1`.

### `DateTimePicker` API expanded

The old `DateTimePicker` was a bare native input with three props (`value`, `onChange`, `label`). The new one is a composition of `DatePicker` + `TimePicker`.

Old calls still compile. New props available: `placeholder`, `minDate`, `maxDate`, `locale`, `disabled`, `error`, `hint`, `clearable`, `size`, `required`, `format`, `minuteStep`, `showSeconds`.

### Navbar `variant` deprecated

```tsx
// Before
<Navbar variant="glassmorphism" />       // deprecated
<Navbar variant="centered" />            // deprecated

// After
<Navbar background="glass" />
<Navbar itemsAlignment="center" />
```

The old `variant` prop still works and is resolved internally, but the type is marked `@deprecated`.

### `Card.variant="elevated"` visual change

`Card variant="elevated"` now uses `var(--bg-secondary)` (same background as default) plus a stronger shadow and a 1px border, instead of a brighter `var(--bg-elevated)`. The visual result: elevated cards now read as dark lifted panels on dark theme, not bright grey rectangles.

If you rely on the bright elevation, wrap your content in a `<div style={{ backgroundColor: 'var(--bg-elevated)' }}>` manually.

### `ForgeTheme` accepts radius and spacing overrides

New optional fields on `ForgeTheme`:

```ts
radiusXs?, radiusSm?, radiusMd?, radiusLg?, radiusXl?, radiusFull?
spacingNone?, spacingXs?, spacingSm?, spacingMd?, spacingLg?, spacingXl?,
spacing2xl?, spacing3xl?, spacing4xl?
```

Leave undefined to keep defaults. Existing theme objects keep working unchanged.

### `ForgeProvider.fontFamily` separate prop

```tsx
// Before (didn't work)
<ForgeProvider theme={{ fontFamily: 'Inter, sans-serif' }}>

// After
<ForgeProvider fontFamily="Inter, sans-serif">
```

### Component removals

- `GradientButton`: never existed in real exports (was a documentation fiction). Use `<Button variant="primary" gradient>`.
- `ProfileCard`, `PricingCard`, `FeatureCard`, `TestimonialCard`: never existed. Compose with `Card` + `VStack` + `Heading` + `Text`.
- `VerticalTabs`: never existed. Use `<Tabs orientation="vertical">`.
- `DateRangePicker`: never existed. Use two `DatePicker` components.
- `SkeletonAvatar`: never existed as a standalone export. Use `SkeletonAvatarGroup` or `<Skeleton variant="circular">`.
- `CheckboxGroup`: never existed. Use multiple `Checkbox` components with your own state.
- `DropdownMenu`: never existed as an export. Use `Dropdown`, `SelectDropdown`, or `ContextMenu`.
- `Drawer`: never exported directly. Use `Sheet`, `BottomSheet`, or `SidePanel` (all from the same file, fully featured).

### Extended size scales

The following components now accept `'xs' | 'sm' | 'md' | 'lg' | 'xl'` on their `size` prop (previously `'sm' | 'md' | 'lg'`):

- `Button`, `IconButton`, `ButtonGroup`
- `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Radio`
- `Tabs`, `PillTabs`, `SegmentedControl`
- `TagInput`, `NumberInput`, `OTPInput`, `PasswordInput`, `PhoneInput`

Existing calls with `sm`, `md`, `lg` keep working unchanged. You can now pass `xs` or `xl`.

## Breaking changes policy

Deprecated props live for one major version before being removed. Current deprecations:

- `Navbar.variant` (replaced by `background` + `itemsAlignment`, removed in 2.0)
- `Navbar.transparent` (use `background="transparent"`, removed in 2.0)
- Legacy Z_INDEX aliases: `above`, `elevated`, `high`, `higher`, `highest`, `floatButton`, `overlay` (removed in 2.0)

## Version check

Run `npx wss3-forge doctor` to confirm your install matches the package version and your app has the required imports and providers.

```
$ npx wss3-forge doctor
Forge doctor v1.0.19

✓ Skill installed (v1.0.19)
✓ ForgeProvider found in src/main.tsx
✓ animations.css imported
✓ motion.css imported

✓ All checks passed (4/4).
```

If the doctor flags a version mismatch, run `npx wss3-forge upgrade` to re-sync the skill.

## Still stuck

Common issues and fixes live in [faq.md](faq.md). Open an issue at https://github.com/Webba-Creative-Technologies/forge if it is still unclear.
