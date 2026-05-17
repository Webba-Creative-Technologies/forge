# Changelog

All notable changes to `wss3-forge` will be documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.3] | 2026-05-17

### Added
- **`Navbar.density`** new prop. `'compact'` shrinks the whole bar: shorter height (sm 40px, md 48px, lg 56px), smaller logo, tighter item padding, smaller fontSize and gap. A denser version of the same `size` preset.
- **`Navbar.hoverEffect`** new prop with `'pill'` (default sliding bg), `'underline'` (animated bottom bar), `'highlight'` (text-only colour shift to brand), `'none'`. Active item follows the same family. The sliding pill indicator and the icon scale-on-hover are both gated to `'pill'`.
- **`Navbar.layout="search"`** new layout preset. Swaps the items row for a real centered `<input>` (logo / wide input / actions). Nav `items` are ignored in this mode. Drive the input via the new `searchInline` prop (`{ value, onChange, placeholder?, onSubmit?, width? }`). The input is anchored to the viewport center via the same 3-column grid Forge uses for `itemsAlignment="center"`. On mobile, the inline input is hidden and the existing search icon button shows up as the fallback (so `showSearch={true}` still matters on mobile in this mode). Focus ring uses a brand-tinted halo. Enter triggers `onSubmit`.
- **`AppSidebar.density`** new prop. `'compact'` tightens item padding, the icon/label gap, and the icon size (top-level 20→18, nested 16→14) so ~30% more items fit at the same sidebar width. Pairs with any `hoverEffect`.
- **`AppSidebar.hoverEffect`** new prop. Picks the indicator drawn on hover and on the active item:
  - `'bg'` (default): subtle background tint on hover, brand-color text on active.
  - `'border-left'`: 3px left bar (brand on active, muted on hover).
  - `'dot'`: small brand-tinted dot left of the icon (filled on active, ghosted on hover). Reserves extra left padding so the dot sits cleanly.
  - `'highlight'`: text + icon shift to the brand colour on hover and on active. No bg, no bar. Minimalist editorial look.
  - `'none'`: no surface feedback. The active item still gets the brand colour so it stays readable.

### Changed
- **`AppSidebar` default `width`** changed from `280` to `240`.
- **`AppSidebar` padding** tightened: top/bottom `1.5rem` (`1rem` on mobile), left/right `0.75rem`.

### Fixed
- **`AppSidebar`** the inner `<aside>` now uses `box-sizing: border-box` so the `width` prop is the true layout width. Previously the aside took `width + 2 * padding` and overflowed narrow wrappers (template docs sidebars, fixed-width containers).
- **`AppSidebar`** the aside no longer sets `minWidth: width` (now `minWidth: 0`). The aside can follow a narrower parent. The `width` prop sets the preferred width; the parent controls the bounds.
- **`AppSidebar`** nav item button gets `box-sizing: border-box` so `width: 100%` plus internal padding doesn't push the button past the parent's right edge on narrow sidebars.
- **`AppSidebar`** nav item label gets `min-width: 0`, `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`. Long labels truncate instead of pushing the right padding out.
- **`AppSidebar`** parent sliding indicator now renders only when `hoverEffect === 'bg'`. Other effects carry the active state on the item itself.
- **`Navbar`** mega-menu panel now renders via `createPortal` to `document.body`. Escapes any ancestor with `transform`, `filter`, or `perspective` (the NavItem button uses `transform: scale()` for the press effect, which previously broke the panel's `position: fixed`).
- **`ForgeProvider`** nested instances no longer write their CSS variables to `document.documentElement`. Previously, nested providers (theme previews on a landing page, isolated demos) overrode the root provider's variables on the global scope and, on unmount, removed them entirely. After navigating away from a page with nested providers, portals (dropdowns, mega menus, popovers) lost their `--bg-dropdown`, `--radius-lg`, etc. The root provider stays the only writer on `documentElement`; nested providers scope their variables to their wrapper `div` (which they already did via inline style).

### Documentation
- `skills/forge/components.md` documents the five new Navbar/AppSidebar props, the new `AppSidebar` default `width` (240) and padding, and the design rationale for each hover style.
- `skills/forge/patterns.md` gains two recipes: "Search-led navbar" and "Dense product sidebar".
- `skills/forge/anti-patterns.md` gains four entries: do not hand-roll a SearchNavbar (use `layout="search"`), do not override hover via custom CSS (use `hoverEffect`), do not cram a sidebar via inline styles (use `density="compact"`), and the AppSidebar variant of the hover override anti-pattern.
- Docs site: all `Motion whileInView` scroll-reveal wrappers stripped from the docs pages (`src/pages/docs/`).

## [3.1.2] | 2026-05-13

### Fixed
- **`Navbar`** with `itemsAlignment="center"` was not truly viewport-centered. The previous layout used a flex row with two `flex: 1` spacers around the items block (`[logo][spacer][items][spacer][actions]`), which only centered the items between the logo's right edge and the actions' left edge. As soon as `logo.width !== actions.width` the items drifted off-center by `(actions.width - logo.width) / 2`. The centered layout now uses a 3-column CSS grid (`minmax(0, 1fr) auto minmax(0, 1fr)`) with the logo in column 1, items in the auto-sized middle column, and actions in column 3. The two `1fr` tracks are equal by definition, so the items block is anchored to the true viewport center regardless of logo or actions content widths. Mobile layout and the `leftContent` / `centerContent` / `rightContent` slot mode are unchanged.

### Documentation
- `skills/forge/anti-patterns.md` gains an entry for the false-centered flex pattern (`[A][spacer flex:1][B][spacer flex:1][C]`) and the correct grid 1fr/auto/1fr replacement.

## [3.1.1] | 2026-05-07

### Added
- **`AppSidebar.compactLogo`** new prop. Renders in place of `logo` when the sidebar is collapsed (icon rail). Typically a square mark sized 32 to 40, designed to fit the 60px collapsed width. The collapse-toggle button stacks vertically below it. Without `compactLogo` the previous behaviour (toggle alone, centred) is preserved.

### Fixed
- **`Table` and `SimpleTable`** were drawing the per-cell `border-bottom` on every row including the last one. Combined with the pagination footer's `border-top`, this read as a double divider on the last row. The bottom border is now skipped on the last row so the pagination footer's `border-top` (or the table's natural bottom edge) becomes the single visible divider.
- **`Switch`** had no bounding-box height of its own (only the track height: 22px on `md`), so it could not be aligned vertically with `Input` (40px) or `Button` (40px) on the same row even with `align-items: center`. The component now reserves a `min-height` matching the Forge form-field scale (xs=24, sm=32, md=40, lg=48, xl=56). The track stays compact and is centred inside the new bounding box.

### Documentation
- `skills/forge/anti-patterns.md` gains entries for the two recurring regressions above (stacked-divider pattern, form-controls without a bounding-box).
- `skills/forge/components.md` documents `compactLogo` and the Switch sizing rule.

## [3.1.0] | 2026-04-28

### Added
- **`PageSection`** landing-page section wrapper. Owns the responsive vertical padding (clamp values across `size: 'sm' | 'md' | 'lg' | 'xl'`), the inner `Container` max-width, an optional `tone: 'transparent' | 'subtle' | 'tertiary'` accent background, a `fullBleed` escape hatch (skip the inner Container for edge-to-edge content like a Marquee), and a polymorphic `as` prop. Replaces the `<section><Container><VStack>` boilerplate every marketing page re-implements. Note: the previous re-export of the responsive `Section` as `PageSection` has been removed. `PageSection` is now its own dedicated component. Documented in `components.md` and `patterns.md` ("Page layout (marketing)").
- **`PricingCard`** composable pricing tier card. Built on top of `Card + VStack + Heading + Text + Badge + Button + Checkmark icon`, so radius / padding / shadow / hover all flow from tokens. `featured` highlights the recommended tier with a brand-tinted outline plus a "Most popular" badge, no literal hex required. `features` accepts a plain `string[]` or `Array<{ text: ReactNode; muted?: boolean }>` for cross-tier "feature not included" rendering. `cta` carries label + `onClick` or `href` + variant. Pair with `Pills` for monthly/yearly toggle and swap the `price` prop. Documented in `components.md`, `patterns.md` ("Pricing strip with monthly/yearly toggle"), and `anti-patterns.md`.
- **`Counter`** + **`useCountUp`** animated number counter component and matching hook. Eases from `from` to `value` over `duration` (ms) once on mount with cubic ease-out, respects `prefers-reduced-motion`, and applies `font-variant-numeric: tabular-nums` so digits don't jitter horizontally. Subsequent value changes do NOT re-animate (avoids flicker when filters update the value every keystroke). Component takes `prefix`, `suffix`, and a `format(n) => string` callback for currency / locale / unit. Use the hook directly when you need to drive multiple nodes off the same ticker. Documented in `components.md` and `patterns.md` ("Hero KPIs with Counter").
- **`KpiCard`** lightweight dashboard tile primitive: small uppercase label + big mono value + optional `delta` line + optional inline `sparkline`. Distinct from the existing `StatCard` (icon-led, larger card with `change: number` auto-formatting). `KpiCard` accepts pre-formatted strings or React nodes for `value` and `delta.text`, takes a raw `sparkline: number[]`, and the `delta.tone: 'up' | 'down' | 'flat' | 'brand'` drives both the delta colour and the sparkline stroke against semantic tokens (no literal hex). Used in dashboards for KPI strips at the top of a page. Documented in `skills/forge/components.md` under Charts and `patterns.md` under "Dashboard KPI strip + chart card".
- **`ChartLegend`** reusable legend component: `items: { color, label, value?, shape? }[]`, `layout: 'row' | 'column'`. `shape` accepts `'square'` (default), `'dot'`, or `'dash'` (a thin dashed horizontal rule, ideal for a benchmark reference line in a `MultiLineChart`). Use it next to charts that don't ship their own legend, or pair with `DonutChart showLegend={false}` for a separate legend below the donut with full layout control. Documented in `components.md`.
- **`StackedAreaChart`** new chart type for stacked filled areas over time. API parallels `MultiLineChart` (same `series: { name, data, color }[]`, `labels`, `showGrid`, `gridLines`, `showXLabels`, `showYLabels` props) plus a `normalize: boolean` flag for percent-of-100 mode (allocation drift, cohort share of total, budget by segment), `showTooltip` with a per-series breakdown at the hovered column, and a `valueFormatter`. Animated draw-in via clip-path.
- **`StackedBar`** new chart type for a single horizontal bar with multiple coloured segments. Distinct from the existing vertical `BarChart` (one bar per category): use `StackedBar` to show a single breakdown like asset mix, plan distribution, capacity by team, budget split. Percent-based by default with `valueFormatter` override. Inline legend with mono values, optional `showTooltip` on segment hover, animated sweep on first render with per-segment delay.
- **`Sparkline`** gained interactive props: `showTooltip` (default `false`, set to `true` to enable a hover crosshair dot + mini mono tooltip at the nearest data point), `labels?: string[]` (one per data point, shown in the tooltip), `valueFormatter?: (value, index) => string` (defaults to `value.toFixed(2)`). Sparkline is the chart type used most often in `KpiCard` foots and table-row cells, but until now it had no hover surface. Cursor changes to crosshair when `showTooltip` is on.

- **`Card variant="raised"`** uses `--bg-tertiary` for cards nested inside another card or block. Forge is a filled-first system; nested cards now have a clean way to read as one tier up without falling back to `variant="outlined"`. The new variant is documented in `skills/forge/components.md`, and a new "Elevation = surface ladder" section in `skills/forge/design.md` explains the full ladder (`bg-primary → bg-secondary → bg-tertiary → bg-dropdown → bg-elevated`) and when to use each Card variant. `outlined` is now framed as the exception, not the default.
- **`DateRangePicker`** picks a `{ start, end }` range. Composes two `DatePicker`s linked by constraints (end.minDate follows start, clearing start clears end). Inherits `DatePicker` props plus `startPlaceholder` and `endPlaceholder`.
- **`DateTimePicker` rewrite.** Previously two side-by-side pickers with mismatched heights. Now a single input with one unified popup: calendar grid on top, compact horizontal time spinner (hours, minutes, optional seconds, AM/PM toggle in 12h) below, and a Now/Clear/OK footer. Uses a pending-state model so edits only commit when the user presses OK, cancel via outside click or Escape. New props: `showNow`, `nowLabel`, `okLabel`, `clearLabel`. Also adds a `1px solid var(--border-color)` edge on the DatePicker popup so the dropdown reads as a framed surface instead of a floating shadow.
- **`TimeAgo`** live-updating relative time component ("2m ago", "in 3h"). Auto-tick cadence adapts to the age (1s / 1min / 1h). Fully customizable labels. Also exports `useTimeAgo` hook and `formatTimeAgo` pure function.
- **`VirtualList`** windowed list for large datasets. Supports fixed or variable row heights, overscan, custom keys, empty state, and scroll callbacks.
- **`ErrorBoundary`** React error boundary with a Forge-styled default fallback. Props include `fallback` render-prop, `onError` callback, and `resetKeys` for auto-reset when dependencies change.
- **`useKeyboardShortcut(keys, handler, options?)`** hook. Supports `'Mod+K'` (Cmd on macOS, Ctrl elsewhere), multi-key arrays, `enabled`, and `ignoreInput` options.
- Utility hooks: `useDebounce`, `useThrottle`, `useLocalStorage`, `useSessionStorage`, `useClickOutside`, `usePrevious`.

### Changed
- Skill: documented the orientation rule for primary nav. `Navbar` is always the horizontal top bar, `AppSidebar` is always the vertical side column. The pick is the menu's reading direction, not the use case. Rewrote the "Docs site" recipe to the canonical 3-zone pattern (Navbar at the App level + AppSidebar on the left + main + TOC on the right), matching Forge's own docs site, Mantine, Shadcn, Tailwind, MDN.
- Skill: docs site recipe in `patterns.md` now uses `position: fixed` for both the sidebar and the TOC instead of `position: sticky`. Sticky inside a grid track silently collapses or jumps under the Navbar in edge cases; fixed truly anchors to the viewport. The shell drops the grid and reserves space via `padding-left: 240px` and `padding-right: clamp(260px, 22vw, 300px)`. Companion entry added to `anti-patterns.md` under Navigation.
- `Banner` and `AnnouncementBanner` rename `closable` to `showCloseButton` to align with `Drawer` and `Modal` ("show the X button" naming). Default stays `false` on `Banner` and `true` on `AnnouncementBanner`.
- `Pills` rename `selected` to `value` so the prop matches `Tabs`, `SegmentedControl`, and the rest of the controlled-selection family.
- `Notification` internal `NotificationItem` renames its `onDismiss` prop to `onClose` for consistency with the public close callback naming.
- `Marquee` gained `fadeEdges?: boolean | number`. Pass `true` for a default 64px CSS-mask edge fade or a number for a custom width. Logos and testimonial reels now dissolve into the surrounding background instead of hard-cropping at the edges of the track. Documented in `motion.md` and `anti-patterns.md`.
- `Divider` is now context-aware. When rendered inside a `VStack` / `HStack` / `Stack` (any of the Forge stack shortcuts that own `gap`), its default `spacing` switches to `'none'` automatically. The parent gap stays the single source of rhythm and you no longer get ~50px of dead space around a 1px rule. Outside any Stack the default stays `'md'`. You can still pass `spacing` explicitly to override either default. Implementation: a small `StackGapContext` provided by `VStack` / `HStack` / `Stack`, consumed by `Divider`. No public API change.
- `Button variant="link"` is now flush-aligned: it has `padding: 0`, `height: auto`, `min-height: 0`, and `justify-content: flex-start`. This lets a link Button sit inside a `Card`/`VStack` next to a `Heading` or `Text` without a 16px horizontal shift to the right (caused by the default size-driven `padding`). Use `variant="link"` whenever you would otherwise be tempted to compose `<HStack onClick> + Text + ArrowRight`.
- `Card` variant `elevated` now uses `var(--bg-secondary)` (same as default) plus a stronger two-layer shadow and a 1px border, instead of `var(--bg-elevated)`. This makes elevated cards read as lifted dark panels in dark mode rather than bright grey rectangles. `--bg-elevated` CSS var is kept for future use.
- Light-theme compliance audit: replaced several hardcoded `rgba(255, 255, 255, ...)` values that broke the light palette.
  - `Badge` default close-button hover: `rgba(255,255,255,0.15)` to `var(--bg-active)`
  - `Tabs` and `Pills` count badge active background: `rgba(255,255,255,0.2)` to `color-mix(in srgb, currentColor 20%, transparent)`
  - `Switch` unchecked hover ring: `rgba(255,255,255,0.05)` to `var(--bg-subtle)`
  - `Table` selected-row background: hardcoded `rgba(163, 91, 255, 0.08)` to `var(--bg-active)`
  - `Table` striped odd rows: `rgba(255,255,255,0.02)` to `var(--bg-subtle)`
- `ButtonGroup.size` union extended from `'xs' | 'sm' | 'md' | 'lg'` to `'xs' | 'sm' | 'md' | 'lg' | 'xl'` to match `Button` and `IconButton`.

### Fixed
- DatePicker popup styling now uses the same surface, border, and selection tokens as TimePicker so the two pickers read as siblings under any ForgeProvider theme.
- TimePicker trigger now matches DatePicker trigger height + border + padding so they read as siblings in the same form row.
- `DonutChart.centerContent` was rendering offset toward the bottom-right when paired with `legendBelow={true}`. Root cause: the inner wrapper was sized `size + 16` with `padding: 8` and the absolutely-positioned center content was anchored to the wrapper bounds (which included the legend area below the donut SVG). Wrapper is now exactly `size × size` with `overflow: visible` and the center content uses `inset: 0`, so it is anchored to the donut SVG bounds and sits dead-centre regardless of `legendBelow` or surrounding layout. The recommended pattern for a legend-below-donut composition is now `showLegend={false}` + a separate `<ChartLegend>` rendered underneath the donut.
- `LineChart.showTooltip` only worked when `showDots={true}` was also set. The hover hit-areas (and the tooltip render) lived inside the `showDots && points.map(...)` block, so passing `showDots={false}` killed tooltips at the same time. Hover hit-areas now mount whenever `showDots || showTooltip`. The visible dot only renders when `showDots` is on, OR when the data point is the active hover target, so a dotless line still pops a marker at the cursor while the tooltip is open.
- `Popover` content was clipped, misplaced, or rendered off-viewport when an ancestor element used `backdrop-filter`, `filter`, `transform`, or `perspective`. Per CSS spec, those properties create a containing block for fixed-positioned descendants, so the popover's `position: fixed` was being interpreted relative to the ancestor's box rather than the viewport. Symptom in the wild: a Popover triggered from a sticky topbar with `backdrop-filter: blur(...)` rendered as a thin horizontal sliver clipped at the bottom of the topbar instead of opening below it. Popover content is now portaled to `document.body` via `createPortal`, so it escapes any ancestor containing block.

### Accessibility
- `Button` now exposes `aria-busy` when `loading` is true.
- `IconButton` auto-populates `aria-label` from the `tooltip` prop (falls back to explicit `aria-label` when provided).
- `Input` adds `aria-invalid`, `aria-describedby` wired to hint/error nodes, `aria-required`, and `role="alert"` on the error message.
- `Tabs` (all variants) gain `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, and `tabIndex` roving focus.
- `Accordion` items gain `aria-expanded`, `aria-controls`, matching `role="region"` + `aria-labelledby` on the panel, and `hidden` while collapsed.
- `Dropdown` trigger gets `role="button"`, `aria-haspopup="menu"`, `aria-expanded`; menu gets `role="menu"`.
- `Tooltip` content gets `role="tooltip"`.
- `Switch` gains `role="switch"`, `aria-checked`, `aria-label`, `aria-invalid`.
- `Slider` gains `role="slider"`, `aria-valuenow/min/max/text`, keyboard navigation (Arrow, Home, End, PageUp/PageDown).
- `Combobox` gains `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-invalid`, `aria-required`.
- `NumberInput` input gains `role="spinbutton"`, `aria-valuenow/min/max`, `aria-required`; inc/dec buttons gain `aria-label`.
- `Sheet` and `BottomSheet` gain `role="dialog"`, `aria-modal="true"`, `aria-label`.
- `ProgressBar` and `ProgressRing` gain `role="progressbar"`, `aria-valuenow/min/max`, `aria-label`.
- `Avatar` becomes keyboard-operable when clickable (`role="button"`, `tabIndex={0}`, Enter/Space handler) and always exposes an `aria-label` derived from name and status.
- `Popover` trigger gains `role="button"`, `aria-haspopup="dialog"`, `aria-expanded`; content gets `role="dialog"`.
- `TableOfContents` nav gets `aria-label` from `title` or defaults to `'Table of contents'`.

### Documentation
- `skills/forge/design.md` gains a "Hero moments deserve scale and a real schema" section covering end-of-flow / celebration / not-found / sign-in screens. Three rules: anchor icon at 64-96px (not the default 20-32px), show a visual proof of what happened (template gradient + name + price, not just text), vary gaps by section type (`3xl` between major sections, tight inside each). Includes a wrong/right code block with a typical post-purchase page.
- `skills/forge/design.md` gains a "Group siblings by intent" section. Before flattening N children into a single VStack, group the related ones in a sub-stack with a tighter gap. Documents the Gestalt proximity principle and shows wrong/right code (flat 5 siblings vs. 3 visual groups with internal rhythm). Companion entries land in `anti-patterns.md` under a new Grouping section.
- `skills/forge/design.md` extended with a "Spacing rhythm (gap by intent, not by size)" table mapping sibling relationships to gap values. Documents the common over-spacing mistakes: `gap="lg"` around a `<Divider>` (use `md`), `gap="md"` between `<Heading>` and immediate subtitle (use `sm` or `xs`), and stacking large gaps inside a Card that already has generous padding.
- `skills/forge/anti-patterns.md` extended with a new "Surfaces" section: wrong/right pairs for `variant="outlined"` overuse, missing `variant="raised"` on nested cards, and hand-rolled border+radius "card-looking divs". Spacing section gains pairs for the title/subtitle gap and the around-a-Divider gap.
- Added `getting-started.md`, `migration.md`, and `faq.md` to `skills/forge/` for onboarding, upgrade paths, and common gotchas.
- Added `DateRangePickerDocs`, `TimeAgoDocs`, `VirtualListDocs`, `ErrorBoundaryDocs` pages to the docs site. Registered in sidebar, registry, and overview catalog.
- `skills/forge/SKILL.md` extended with a Decision rule, a numbered Review priority (accessibility, semantics, motion, theme parity, performance), and a 10-item Pre-delivery checklist.
- New `skills/forge/anti-patterns.md` with wrong/right code pairs for the most recurring mistakes (raw flex divs, hardcoded colors, styled native elements, `@media` queries, em-dashes, colored backgrounds behind icons).
- New `skills/forge/a11y.md` accessibility playbook: what every Forge component sets by default and what the developer still needs to add.
- `skills/forge/patterns.md` now includes a "Quality gates per pattern" section listing the verification checks to run for dashboards, forms, modals, tables, empty states, and animated entrances.

## [1.0.19] | 2026-04-24

### Added
- `DateTimePicker` rebuilt as a proper composition of `DatePicker` + `TimePicker` with the full prop surface (value, onChange, label, placeholder, min/maxDate, locale, disabled, error, hint, clearable, size, required, format, minuteStep, showSeconds). Previously a bare native `<input type="datetime-local">`.
- `ForgeTheme` now accepts flat radius overrides (`radiusXs` ... `radiusFull`) and spacing overrides (`spacingNone` ... `spacing4xl`).
- `ForgeProvider.fontFamily` prop injects `--font-family` and applies it on the provider wrapper.
- CLI commands: `npx wss3-forge init` installs the `/forge` skill into `.claude/skills/forge/`. `upgrade` re-syncs after a package update. `doctor` validates the local setup.
- `bin/cli.js` with shadcn-style output (progress, prompts, version marker).
- `skills/forge/` on-demand documentation: SKILL.md, components.md, tokens.md, theming.md, motion.md, patterns.md, design.md. Shipped inside the package.
- `AGENTS.md` and `DESIGN.md` at the package root for project-level AI integration.

### Changed
- Z-index scale rescaled with semantic keys: `dropdown=200, popover=210, tooltip=220, drawer=300, modalBackdrop=400, modal=410, commandBar=420, notification=500, toast=510, tour=600, cookieConsent=700, blocking=800, max=999`. Legacy keys kept as aliases (`above`, `elevated`, `high`, `higher`, `highest`, `floatButton`, `overlay`).
- Card `padding` union extended from `'sm' | 'md' | 'lg' | 'xl'` to `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'`.
- Size scale extended to `'xs' | 'sm' | 'md' | 'lg' | 'xl'` on `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Tabs`, `PillTabs`, `TagInput`, `NumberInput`, `OTPInput`, `PasswordInput`, `PhoneInput`, `SegmentedControl`.
- `Navbar` gains `background` (`'solid' | 'transparent' | 'glass' | 'none'`), `itemsAlignment` (`'left' | 'center' | 'right'`), `scrollFade`, `scrollFadeThreshold`, `size`, `actionsSize`, `height`. `variant` prop deprecated.
- `bgElevated`, `bgSubtle` added to `ForgeTheme`. `bgHover` and `bgActive` auto-derived from `brandPrimary` when empty.
- `styles/motion.css` now bundled into `dist/` (previously declared in exports but never built, leading to a 404 on `import 'wss3-forge/styles/motion.css'`).
- Removed the global `scroll-behavior: smooth` from `animations.css`; opt in with a `.forge-smooth-scroll` class.

### Removed
- `FORGE_AI_GUIDE.md` (both package and public copies). Replaced by `AGENTS.md` + `skills/forge/`.
- `skills/forge-block/` skill folder. Block creation rules merged into `skills/forge/patterns.md`.

## [1.0.18] and earlier

### Motion library (`v3.1.0 "Expressive"`)
- `Motion`, `AnimatePresence`, `MotionConfig`, `Stagger`, `ViewTransition` core primitives.
- Gesture components: `Magnetic`, `Tilt`, `Spotlight`.
- Scroll components: `RevealOnScroll`, `Parallax`, `StickySection`.
- Text effects: `GradientText`, `Typewriter`, `Kinetic`, `Cipher`, `TextShimmer`, `NumberCounter`, `CircularText`.
- Visual effects: `Marquee`, `GlowArea`, `Shimmer`, `Aura`, `Breathe`, `Orbital`, `Confetti`, `Shine`, `FlipCard`, `ScratchCard`, `HoloEffect`, `MatteEffect`, `CardStack`, `SpinCard`, `Sticker`, `InteractiveSticker`.
- Canvas backgrounds: `Starfield`, `ConstellationGrid`, `ParticleField`, `MeshGradient`, `NetworkGraph`.
- Motion hooks: `useMotionValue`, `useMotionValueState`, `useTransform`, `useSpring`, `useCursorPosition`, `useMagneticAttraction`, `useTilt`, `useInView`, `useScrollReveal`, `useScrollProgress`, `useParallax`, `usePageScroll`, `useScrollMotion`, `useScrollVelocity`, `useAnimate`, `useReducedMotion`.
- Tokens: `DURATIONS`, `EASINGS`, `SPRINGS`, `MOTION_SCALES`, `ReducedMotionPolicy`.
- `ForgeProvider.motionScale` (`'subtle' | 'normal' | 'dramatic'`) and `reducedMotion` (`'auto' | 'always' | 'never'`) props.

### Component highlights (historical)
- Shadows system with hardness levels (`soft`, `medium`, `hard`) and size scales (`xs` to `2xl`), elevation presets, brand-tinted and glow variants.
- `ForgeProvider.shadows` globally enables, disables, or overrides elevation shadows.
- Accessibility: Modal ARIA attributes (role, aria-modal, aria-labelledby).
- `useDraggableScroll` hook for drag-to-scroll containers.
- 4 Splash variants: `SplashScreen`, `LogoSplash`, `MinimalSplash`, `BrandedSplash`.
- `WebbaLoader` and `WebbaThinking` branded loaders.
- Translations: all French hardcoded strings moved to English with overridable label props.

## Versioning

`wss3-forge` uses semver:
- **major**: breaking API changes (prop renames, removed components, signature changes)
- **minor**: new components, new props, additive changes, deprecations announced
- **patch**: bug fixes, a11y fixes, doc corrections, internal refactors

Deprecated props stay for one major version before removal. Legacy Z-index aliases and deprecated `Navbar.variant` are current examples.
