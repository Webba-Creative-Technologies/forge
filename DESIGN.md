# DESIGN.md

Design rules for Forge. Every rule has a reason. This file answers "why is the codebase built this way" so that AI generations stay consistent with human decisions.

## Visual system

### Monochrome icons, no decorative fills

Icons render at their natural stroke weight with `currentColor`. They sit next to text, they do not sit inside a tinted square or circle.

Allowed exceptions:
- `StatusBadge` uses a status-colored dot to convey state (online, offline, away, busy)
- `Avatar` can show a status dot in the bottom-right corner
- `Badge variant="success|warning|error|info|primary"` uses a tinted pill as the entire surface, and the icon inherits its text color

Not allowed:
- Wrapping a plain content icon in a tinted 40x40 box "to balance the layout"
- Adding a circular colored background behind a navigation icon

Reason: colored squares behind icons add visual noise, introduce false status cues, and fight the typography. Keeping icons monochrome on transparent surfaces keeps the UI legible at a glance.

### No emojis

Forge never uses emojis. Decorative glyphs come from Fluent UI 2.

Reason: emojis render inconsistently across OS versions, they do not inherit `currentColor`, they cannot be themed dark/light, and they pull attention away from the content. Fluent icons are monochrome SVG, scale cleanly, and respect the theme.

### No em-dashes

No `—` anywhere. Use a period, a comma, a colon, parentheses, or a line break.

Reason: the project owner does not use them and wants UI copy that reads like a human wrote it, not like it came from an AI. This rule applies to code comments, commit messages, docs, and UI strings.

### Dark by default

`ForgeProvider` defaults to `mode="dark"`. Surfaces ramp `bgPrimary` → `bgSecondary` → `bgTertiary` → `bgDropdown` → `bgElevated`, with about 8 to 11 points of luminance per step. Interactive states (`bgHover`, `bgActive`) are brand-tinted, not neutral gray.

Reason: a visible surface ramp makes layering easy to scan. Brand-tinted hover states make the app feel "on brand" instead of "flat gray".

### Brand primary is one color

There is one `brandPrimary` per theme. `brandSecondary` is used only as the second stop of a gradient or for a specific accent (a chart series, a highlight). It is not a general-purpose secondary UI color. Secondary UI actions use `variant="secondary"` on `Button`, which uses neutral surfaces.

Reason: a two-color brand system is harder to enforce consistently than one plus neutrals. Keeping `brandSecondary` for decoration and gradients prevents drift into a blue/red/green rainbow.

## Component usage

### Prefer primitives, then compose

Every UI concern has a primitive: `Card`, `Modal`, `Dropdown`, `Tooltip`, `Table`, and so on. Compose by nesting existing components. Never fork a primitive to add a prop.

If a primitive is missing a feature you need, three options in order:
1. Compose: wrap the primitive in your own component, layer your addition outside
2. Propose: open an issue to extend the Forge primitive
3. Replace: do not reimplement the primitive; use a different Forge component that fits

Reason: forks drift. Composition stays in sync with upstream changes.

### No custom CSS classes for design-system concerns

Design tokens live in CSS variables. Components consume them via props or `var(--...)`. Writing a class `.my-button` that hardcodes `padding: 12px 16px` bypasses the design system and creates a surface where the next developer has to guess which value is authoritative.

Allowed inline styles:
- One-off positional tweaks: `position: absolute; top: 8px`
- Consumer-owned layout that no primitive covers

Not allowed:
- `style={{ padding: 16 }}` (use `<Card padding="md">` or `<Box p="md">`)
- `style={{ color: '#fff' }}` (use `color: 'var(--text-primary)'`)
- `style={{ fontSize: 14 }}` (use `<Text size="md">`)
- `style={{ borderRadius: 8 }}` (use `borderRadius: 'var(--radius-md)'`)

### Use semantic variants to convey state

`variant="success" | "warning" | "error" | "info"` on `Banner`, `Badge`, and `AlertDialog` is how the system communicates state. The variant picks the color and the icon. Do not replace a semantic variant with hardcoded color styling.

Reason: semantic variants can be themed, translated, and made accessible once in the primitive. Hand-rolled state colors cannot.

### Typography is a three-tier hierarchy

- `Heading level={1..6}` for titles and section labels
- `Text` for body copy, with `size="xs|sm|md|lg"` and `color="primary|secondary|muted|brand|success|warning|error"`
- `Label` for form labels and required markers

Reason: the three components cover every type use case. Picking one forces you to think about semantic role, not just pixel size.

### Layout is done with stacks and grids, not flex divs

`VStack`, `HStack`, `Stack`, `Grid`, `Flex`, `Box`, `Center`, `Spacer`, `AspectRatio`. Each one maps to a layout intent. Writing `<div style={{ display: 'flex' }}>` is a signal that you skipped the primitives.

Reason: stacks encode the three decisions every flex container makes (direction, gap, alignment) into named props. That reduces the surface where a typo or a missing prop produces a silent layout bug.

### Responsive via hooks and responsive object props

Use `useIsMobile()`, `useIsTablet()`, `useIsDesktop()`, `useBreakpoint()`, or pass a responsive object like `columns={{ xs: 1, md: 2, lg: 3 }}`. Do not read `window.innerWidth`. Do not write `@media` queries in the app layer.

Reason: one breakpoint system. Change it in one place, the whole app moves together.

### One source of truth for icons

Fluent UI 2 (`@fluentui/react-icons`). No `react-icons`, no `lucide-react`, no `heroicons`, no inline SVG for icons that exist in Fluent.

Reason: one icon library means one style, one set of sizes, and one convention (`{Name}{Size}{Style}`). Mixing libraries gives you two sets of stroke weights on the same screen.

## Motion

### Motion respects `prefers-reduced-motion`

Every Forge motion component reads the effective reduced-motion setting from `ForgeProvider` and collapses to instant transitions when reduced motion is requested. Do not bypass this with raw CSS `transition` inside component code. Use `var(--duration-*)` and `var(--easing-*)`, which are also motion-scale aware.

Reason: accessibility. Some users get motion sickness or are distracted by motion. The tokens already solve this correctly.

### Motion is decorative, not functional

Do not gate core functionality on an animation finishing. A user must be able to click, submit, and navigate the moment a component renders. Animations are sugar on top.

Reason: slow network, reduced motion, old devices. Functionality must not depend on motion completing.

### Motion scale is a global knob

`ForgeProvider motionScale="subtle|normal|dramatic"` multiplies every translate and scale delta. Build a single animation, let the provider decide how big it feels. Do not ship a "dashboard uses subtle but marketing uses dramatic" split at the component level.

Reason: consistency within a screen. A subtle fade on one card and a dramatic slide on the next reads as a bug.

## Forms

### `FormGroup` owns label, hint, error, and required marker

Every form input sits inside `FormGroup` in composed forms. Label text, hint text, error text, and the required marker come from `FormGroup` props. The input itself stays pure.

Reason: consistent spacing between label and input, consistent error position, consistent required marker. Change it once, every form updates.

### `onChange` gives the value, not the event

Every Forge input exposes `onChange: (value) => void`. You never receive a synthetic event, you never call `e.target.value`. Boolean inputs (`Checkbox`, `Switch`) receive the boolean directly.

Reason: removes the most common React boilerplate (`e.target.value`) and makes state handlers symmetrical.

## Performance

### Avoid deep trees of Motion components

Each `Motion` component is a light wrapper around a React ref plus a few listeners. Stacking ten nested `Motion` components for a single animation is wasteful. Prefer `Stagger` for lists, `RevealOnScroll` for scroll-triggered entries, and one `Motion` at the outermost element that needs to move.

### Use `SkeletonCard`, `SkeletonText`, `SkeletonAvatarGroup` for loading, not `Spinner` everywhere

Spinner is for short, blocking waits (a button submit). For content layouts that will appear, use skeleton variants that match the eventual shape. The visual continuity reduces layout shift.

## Data

### Table has search, filters, selection, sort, pagination, bulk actions built in

Do not wrap `Table` in your own filter bar or pagination. Pass `searchable`, `filters`, `selectable`, `sortable`, `pagination`, `pageSize`, `bulkActions`, `rowActions` to the primitive. Everything is already wired.

Reason: parallel implementations drift. Table already handles keyboard navigation, selection state, and a11y. Re-implementing that is how bugs appear.

### Dropdown for forms: use `SelectDropdown`

`Dropdown` is a generic trigger-plus-menu. `SelectDropdown` is the form-shaped variant with a label, value, and onChange. Use `SelectDropdown` in forms, `Dropdown` elsewhere.

## Accessibility

### Every interactive element has a keyboard handler

Forge components ship keyboard support (Escape closes modals, arrows navigate menus, Enter submits, Tab walks focus). When composing custom wrappers, do not intercept these keys.

### Every icon-only button has a `tooltip`

`IconButton` accepts a `tooltip` prop that doubles as the aria-label. Always set it. Icon-only buttons without tooltips are invisible to screen readers.

### Modals must have a title or an `ariaLabel`

`Modal` uses `title` or `ariaLabel` as the dialog label. If neither is set, screen readers announce an unlabeled dialog.

## Building blocks (the "blocks" system)

Block templates live under `src/pages/blocks/blocks/{category}/{slug}/`. See `skills/forge/patterns.md` for the full structure, file layout, and manifest rules.

Block rules:
- Block code imports only from `'wss3-forge'` and `'@fluentui/react-icons'`
- No `ForgeProvider` inside a block (the preview system wraps it)
- No custom CSS files in a block folder
- Use `useIsMobile()` for responsive behavior
- Full-height blocks read `var(--block-fill-height, 100vh)` instead of `100vh` directly, so the preview can override height

## Writing style for copy

- No em-dashes
- No exclamation marks except in critical error banners
- No jargon-first sentences (lead with the concrete word)
- No redundant "please" or "kindly" in UI copy
- Use sentence case in titles, `Heading 1` down to `Heading 4`
- Labels go above inputs, never floating

## File and commit style

- No "Generated with Claude Code" in commit messages
- No "Co-Authored-By: Claude" in commit messages
- Commit messages are lowercase, imperative: `feat: add Tour with useTour hook`
- `CHANGELOG.md` entries reference user-visible changes, not refactor internals
