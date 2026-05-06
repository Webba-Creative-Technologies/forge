# Anti-patterns

Wrong/right pairs for the most common mistakes when writing Forge code. Skim this when you are about to write a styled native element, a flex `<div>`, a `@media` query, or a hardcoded color.

Format: `WRONG ...` on one line, `RIGHT ...` on the next.

## Layout

- WRONG `<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>`
- RIGHT `<VStack gap="md">`

- WRONG `<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>`
- RIGHT `<HStack gap="sm" align="center">`

- WRONG `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>`
- RIGHT `<Grid columns={2}>`

- WRONG `<div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 1.5rem' }}>`
- RIGHT `<Container maxWidth="lg">`

- WRONG `<section style={{ padding: 'clamp(56px, 9vh, 96px) 0' }}><Container>...</Container></section>` (every marketing section re-implementing the same chrome)
- RIGHT `<PageSection size="md">...</PageSection>` (handles padding scale, container, optional tone)

- WRONG hand-rolling a tier card with a Card + custom hex border + manual "Most popular" badge
- RIGHT `<PricingCard tier="Pro" price="$24" features={[...]} cta={{ label: 'Start' }} featured />`

- WRONG `useEffect` + `setInterval` + `setState` to tween a number for a stat
- RIGHT `<Counter value={1247832} format={n => fmtUSD(n, 0)} />` or `useCountUp(value)` if you need the live number directly

- WRONG `<Marquee>` over a colored hero where logos hard-crop at the visible edges
- RIGHT `<Marquee fadeEdges={120}>` so the strip dissolves into the bg via CSS mask

- WRONG `<div style={{ display: 'flex', flex: 1 }}><div /><div /></div>` for "push to edges"
- RIGHT `<HStack justify="between">` or `<HStack><Box /><Spacer /><Box /></HStack>`

## Spacing

- WRONG `style={{ padding: '16px 24px' }}`
- RIGHT `padding="md"` or `style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}`

- WRONG `style={{ marginTop: 20 }}` between children
- RIGHT structure via `<VStack gap="lg">` so the parent controls rhythm

- WRONG random pixel values (`13`, `17`, `23`)
- RIGHT 4/8 rhythm via tokens: `xs=4, sm=8, md=12, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96`

- WRONG `<VStack gap="md"><Heading level={1}>X</Heading><Text>subtitle</Text></VStack>` (gap too large for a tight title pair)
- RIGHT `<VStack gap="sm">` for the hero h1 + subtitle pair, `gap="xs"` for label + value pairs

- WRONG putting a `Tabs` / `Pills` / `SegmentedControl` directly inside the same `VStack gap="2xl"` (or `xl`) that separates sections, so the page heading and the nav control sit ~48px apart with a big void of empty space between them. A nav control under a heading is a tight pair, not a section break.
- RIGHT wrap the page heading and the tab-bar together in their own `VStack gap="lg"` (24px) or `gap="md"` (16px), then use the bigger outer gap for the actual section break between the tab-bar and the panel content:
  ```tsx
  <VStack gap="2xl">
    <VStack gap="lg">                    // tight pair: title + nav
      <PageHead title="Settings" />
      <Tabs value={tab} onChange={setTab} tabs={TABS} />
    </VStack>
    <SectionContent />                   // section break after the nav
  </VStack>
  ```
  Same rule applies to `Pills` (filter row under a list heading), `SegmentedControl` and `Breadcrumbs`. Heading + filter / nav / breadcrumb is one block.

- WRONG `<VStack gap="lg"><Heading/>...<Divider/>...<List/></VStack>` (gap too large around a Divider; ~50px of empty space)
- RIGHT `<VStack gap="md">` around the Divider, the Divider already separates visually

- WRONG explicitly passing `spacing="md"` (or letting an old version of Forge set it) on a Divider that sits inside a Stack. Result: the parent gap stacks with the Divider's own margin, ~50px of dead space around a 1px line.
- RIGHT just write `<Divider />`. Modern Forge makes the Divider context-aware: inside a `VStack` / `HStack` / `Stack` the spacing default is `'none'` so the parent gap is the only source of rhythm. Outside any Stack the default stays `'md'` for standalone usage. You only pass `spacing` explicitly to override (e.g. `spacing="lg"` for a roomy section break).

- WRONG nesting big gaps inside a Card that already has generous `padding="lg"` (the contents float instead of feeling cohesive)
- RIGHT `padding="lg"` on the Card + `gap="md"` between blocks inside it

## Grouping

- WRONG flat children with uniform gap, no visual schema:
  ```
  <VStack gap="md">
    <Text>Label</Text>
    <Heading>{value}</Heading>
    <Button>Buy</Button>
    {error && <p>{error}</p>}
    <Text>Secured by Stripe</Text>
  </VStack>
  ```
- RIGHT sub-stacks for related siblings, tighter gap inside groups than between groups:
  ```
  <VStack gap="md">
    <VStack gap="xs">                       {/* caption + value */}
      <Text>Label</Text>
      <Heading>{value}</Heading>
    </VStack>
    <VStack gap="xs">                       {/* action + its error + caption */}
      <Button>Buy</Button>
      {error && <p>{error}</p>}
      <Text size="xs">Secured by Stripe</Text>
    </VStack>
  </VStack>
  ```

- WRONG three "major sections" of a page treated as three flat siblings at the same gap:
  ```
  <VStack gap="3xl">
    <Hero />
    <ArtifactCard />
    <Actions />
  </VStack>
  ```
  (Action buttons read as detached from the artifact they act on; the hero is no further from the artifact than the actions are.)
- RIGHT cluster the artifact and its actions together, separated from the hero:
  ```
  <VStack gap="3xl">                {/* hero vs everything else */}
    <Hero />
    <VStack gap="lg">               {/* artifact + actions form a cluster */}
      <ArtifactCard />
      <Actions />
    </VStack>
  </VStack>
  ```

- WRONG using the same gap at two consecutive nesting levels (the inner `gap="md"` and the outer `gap="md"` flatten the hierarchy):
  ```
  <VStack gap="md">
    <VStack gap="md"><Heading/><Text/></VStack>
    <VStack gap="md"><Button/><Text/></VStack>
  </VStack>
  ```
- RIGHT each nesting level steps down one or two notches on the scale (`md` outside, `xs` inside):
  ```
  <VStack gap="md">
    <VStack gap="xs"><Heading/><Text/></VStack>
    <VStack gap="xs"><Button/><Text/></VStack>
  </VStack>
  ```

- WRONG primary action and its error/trust caption as separate top-level siblings of unrelated content (the error and the caption become visual orphans)
- RIGHT primary action + immediately-related caption/error in one tight `VStack gap="xs"`, secondary action as its own block

- WRONG a Card whose body is just `<>{a}{b}{c}{d}{e}</>`
- RIGHT outer `<VStack gap="md">` for the schema, inner sub-stacks for each role (header, body, actions, footer)

## Surfaces

Forge is a filled-first system. Cards lean on a surface ladder of grey shades, not on borders.

- WRONG glass effect on every card (`backdrop-filter: blur(20px) saturate(180%)` + translucent bg). Glass on everything reads as "AI-generated landing page", not as a premium product. Buyers dismiss it instantly.
- RIGHT plain `<Card>` (default fill = `--bg-secondary`). Reserve glass for at most one hero or modal in the entire product, never as a global card style.

- WRONG aurora / gradient mesh / animated WebGL background painting the whole app. Reads as "AI sci-fi spaceship", not as a SaaS dashboard.
- RIGHT solid `var(--bg-primary)` page background. Charts and data carry the visual interest.

- WRONG ParticleField, cursor-following blob, magnetic CTA, halo around icons, drop-shadow glow. Even when ambient.
- RIGHT no ambient pointer effects. Subtle hover lift on the target element is enough.

- WRONG `<Card variant="outlined">` as the default for every card on the page
- RIGHT `<Card>` (default fill = `--bg-secondary`)

- WRONG nesting `<Card variant="outlined">` inside another `<Card>` "to differentiate"
- RIGHT `<Card variant="raised">` (uses `--bg-tertiary`, one tier up from default)

- WRONG `style={{ backgroundColor: 'var(--bg-tertiary)' }}` on a `<Card>` to hand-roll a raised look
- RIGHT `<Card variant="raised">`

- WRONG using `variant="outlined"` because the page is already dark and you "want some contrast"
- RIGHT default fill on `--bg-primary` already gives one luminance step of contrast. Outlined is the exception, not the norm.

- WRONG `<div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>` to make a "card-looking thing"
- RIGHT `<Card padding="md">` (or `variant="outlined"` if you specifically want the transparent + border look)

- WRONG passing a partial surface ramp to `ForgeProvider`: only setting `bgPrimary`, `bgSecondary`, `bgElevated`, leaving `bgDropdown` to fall back to the default light-theme white.
- RIGHT set the full ladder together (`bgPrimary` → `bgSecondary` → `bgTertiary` → `bgDropdown` → `bgElevated`). Reason: `Select`/`Combobox` popups read `--bg-dropdown`, while `DatePicker`/`TimePicker`/`Modal` read `--bg-elevated`. If only one is themed, popups in the same form render at different colors. When in doubt, set `bgDropdown` and `bgElevated` to the same value.

- WRONG stacking two adjacent borders on sibling elements: `<table>` rows with `border-bottom` and the pagination footer with `border-top` right beneath. The two lines render pixel-adjacent and read as a double divider on the last row, not as one strong separator. Recurring regression pattern in Table-like components.
- RIGHT only one of the two carries the divider. Forge `Table` keeps `border-bottom` per row but conditions it off on the last one: `borderBottom: isLastRow ? 'none' : '1px solid var(--border-subtle)'`. The pagination footer's `border-top` (1px `--border-color`) becomes the single visible line between body and footer. Same rule for any list/footer or section/section pair: pick which side owns the divider, drop the other.

- WRONG shipping a form control whose bounding height is dictated only by its content (a `Switch` whose box is just the 22px track, a `Checkbox` whose box is just the 16px square). It cannot be vertically aligned with `Input` (40px), `Button` (40px), or `Select` (40px) on the same row, even with `alignItems: 'center'`, because the slot heights differ.
- RIGHT every form control reserves a `min-height` matching the Forge form-field scale per size (xs=24, sm=32, md=40, lg=48, xl=56), regardless of what its visual primitive (track, square, dot) actually is. The visual stays compact and centred inside that box. Forge `Switch` follows this rule: `minHeight: sizeStyles[size].box` on the inner `<label>`, then the track is `align-items: center` inside.

## Color

- WRONG cyan + magenta + violet trio anywhere (linear-gradient, aurora preset, brand override). It is the most-cliched AI palette of 2024-2026. Buyers recognize it on sight.
- RIGHT one accent color. A clean blue (`#3B82F6`), emerald (`#10B981`), orange (`#F97316`), or monochrome. Use it on primary CTAs and active nav, sparingly.

- WRONG two-color gradients on funnel bars, chart fills, badge backgrounds, button surfaces. `linear-gradient(90deg, #00E5FF 0%, #FF2D9D 100%)` is the AI-trope smell test.
- RIGHT solid `var(--brand-primary)` for fills. Forge `Sparkline` and `LineChart` already handle this correctly when you skip `fillColor`.

- WRONG `style={{ color: '#A35BFF' }}`
- RIGHT `style={{ color: 'var(--brand-primary)' }}`

- WRONG `style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}`
- RIGHT `style={{ backgroundColor: 'var(--bg-subtle)' }}` (theme-aware)

- WRONG `style={{ border: '1px solid #333' }}`
- RIGHT `style={{ border: '1px solid var(--border-color)' }}`

- WRONG `style={{ color: 'white' }}` on body text
- RIGHT `style={{ color: 'var(--text-primary)' }}` (white in dark, black in light)

- WRONG `rgba(163, 91, 255, 0.08)` for a hover state
- RIGHT `var(--bg-hover)` (already brand-tinted and theme-aware)

- WRONG `<Button variant="primary">` with a light brand-primary (cream, off-white, beige). Forge hardcodes `color: 'white'` for the primary variant, so a light brand-primary renders white-on-light text. Invisible.
- RIGHT either keep brand-primary dark, OR pass an explicit dark text override: `<Button variant="primary" style={{ color: '#000' }}>`. The user `style` prop is spread after the variant defaults, so the override wins.

- WRONG `<Button variant="primary" gradient rightIcon={<Sparkle..Regular />}>Action</Button>` for a marketing or upsell CTA (Templates, Upgrade, Marketplace, Pricing). The gradient + Sparkle icon combo is the unmistakable 2024-2026 AI-cliche stack. User feedback: "le truc le plus IGNOBLE que j'ai vu". Trashes credibility instantly.
- RIGHT plain `<Button variant="primary">Action</Button>`. If the CTA needs more presence, add a `Badge` next to the label, or a single restrained `rightIcon={<ArrowRight16Regular />}` for "go-to" semantics. Sparkle icons stay reserved for genuine AI feature surfaces, not promotional links.

## Typography

- WRONG `<h1 style={{ fontSize: 32, fontWeight: 700 }}>Title</h1>`
- RIGHT `<Heading level={1}>Title</Heading>`

- WRONG `<p style={{ color: '#999' }}>...</p>`
- RIGHT `<Text color="secondary">...</Text>`

- WRONG `<span style={{ fontSize: 12, color: '#666' }}>...</span>`
- RIGHT `<Text size="sm" color="muted">...</Text>`

- WRONG `style={{ lineHeight: 1.5 }}` on plain `<div>` wrapping text
- RIGHT `<Text>` (handles line-height per size)

- WRONG using Forge `<Heading className="my-display-class">` or `<Text className="my-display-class">` to apply a *custom CSS class* that owns `font-size`, `line-height`, and `color`. Forge `Heading` and `Text` apply those three properties as **inline `style`** every render (via `HEADING_SIZES[level]` and `COLOR_MAP[color]`), and inline styles always beat external classes. Symptom: editorial display title renders at the default level-1 size (~30px) in the default theme color (`var(--text-primary)`, i.e. black on light surfaces) instead of the 96-160px white you wrote in the CSS. User reads it as "le titre est en noir et tout petit".
- RIGHT for editorial/display type that lives entirely in a hand-rolled CSS class, use a plain `<h1>` / `<h2>` / `<p>` / `<span>` with the className. The class owns the visual tokens and nothing fights it. Reserve Forge `Heading` and `Text` for *system-default* type where you want the props (`level`, `size`, `color="secondary"`) to win; if you also need a className override, pass `style={{ fontSize: ..., lineHeight: ..., color: ... }}` alongside it because `style` is spread *after* the inline defaults and wins. Atelier and Iro hero titles use the inline-style escape hatch; Forno uses plain `<h1 className>`. Both work; mixing className-only with Forge `Heading` does not.

```
WRONG (className silently dropped for fontSize/color):
<Heading level={1} className="hero-display">Tonight's dinner</Heading>

RIGHT (a) - plain element, CSS class owns everything:
<h1 className="hero-display">Tonight's dinner</h1>

RIGHT (b) - keep Forge Heading, override via inline style:
<Heading level={1} color="#FFFFFF" style={{ fontSize: 'clamp(72px, 10vw, 160px)', lineHeight: 1.02 }}>
  Tonight's dinner
</Heading>
```

- WRONG display title with `line-height: 0.95` / `0.98` / `1.0` that wraps to 2+ lines. Descenders (g, p, y) of line 1 collide with ascenders (h, l, t) of line 2. The user reads it as "les lignes se rentrent dedans". Tight line-heights are for one-line marketing only.
- RIGHT line-height `>= 1.04` for any display that *might* wrap (`clamp(... , ... , ...)` headlines, `<Heading>` with hard `<br />`, anything with `max-inline-size` < its content). Reserve `0.95-1.02` for one-line wordmarks where you control the wrap.

- WRONG section h2 at `clamp(40px, 5vw, 80px)` for an editorial / hero-leaning landing. At a 1280px viewport this lands near 64px which reads "minuscule" against a 96-128px hero. The visual hierarchy collapses.
- RIGHT calibrate display floors to the page's hero. If hero is `clamp(72px, 10vw, 160px)`, section h2 should be `clamp(48px, 6vw, 96px)` minimum. If hero is `clamp(56px, 8vw, 120px)`, section h2 floor `40-48px`. Section type is roughly 60% of hero size, never less than 40% on desktop.

- WRONG flipping a section background to dark (`#1F1A14`, `var(--bg-primary)` in dark mode) and leaving the inline styles pointing at `#1F1A14` titles, `#4A4036` body, and dotted progress in `rgba(31, 26, 20, 0.18)`. Result: invisible text on the surface that was supposed to be the most dramatic moment of the page.
- RIGHT every text token that *lives in* a dark section gets explicit light overrides (`color: '#F5EDDD'`, `color: 'rgba(245, 237, 221, 0.82)'`, `background-color: rgba(245, 237, 221, 0.20)` for dividers/dots). Easiest: scope a `.section-on-dark` class and override `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color` once at the wrapper, the way `.iro-hero nav` and `.atl-hero-nav nav` already do for hero navbars.

## Buttons

- WRONG `<button style={{ background: 'var(--brand-primary)', color: 'white', ... }}>`
- RIGHT `<Button variant="primary">`

- WRONG building a custom dashboard tile (`<div className="my-kpi">` with `padding`, `border`, `min-height: 144`, label + big value + spark inside) when you need a KPI strip. Forge ships `KpiCard` for exactly this pattern. Symptom: every dashboard template ends up with its own slightly-different tile component and the KPIs drift apart visually across templates.
- RIGHT `<KpiCard label="Net worth" value={fmtUSD(value, 0)} delta={{ text: '+11.4%', tone: 'up' }} sparkline={series} />`. Tone is `'up' | 'down' | 'flat' | 'brand'`, drives both the delta colour and the sparkline stroke. The `value` accepts a string or any node so call sites stay simple.

- WRONG building a custom slide-in detail panel (`position: fixed`, `transform: translateX(100%)`, custom backdrop, manual Escape listener, manual body-scroll lock) for row-detail or transaction-detail drawers. Forge `Sheet` ships overlay, backdrop, Escape, body-scroll lock and animation already.
- RIGHT `<Sheet open={...} onClose={...} position="right" size="md" title="...">`. Pass the detail markup as children. Never wrap `AppSidebar` in `Sheet` (use `AppSidebar mode="drawer"` for nav drawers).

- WRONG raw HTML `<table>` with custom `vlt-table` styling for sortable / paginated / searchable lists. The classes drift, sort/pagination ends up reimplemented on every page.
- RIGHT `<Table<RowType> data={rows} columns={cols} keyField="id" searchable searchKeys={['ticker','name']} sortable pagination pageSize={20} onRowClick={r => ...} />`. Use `<SimpleTable headers={[]} rows={[][]}>` for the smaller activity-feed style strips that don't need search/sort.

- WRONG custom segmented horizontal bar (a flex container of coloured `<div>` segments with manual width-percent calc) for asset mix / capacity / budget breakdowns.
- RIGHT `<StackedBar data={[{ label, value, color }]} height={12} showLegend />`. Animated, percent-based, ships an inline legend with mono values, hover tooltips on segments.

- WRONG custom SVG stacked-area for allocation drift / cohort share / budget over time. Forge ships `StackedAreaChart` with the same props as `MultiLineChart` plus a `normalize` flag for percent-of-total mode and a hover tooltip that breaks down each series.
- RIGHT `<StackedAreaChart series={[...]} labels={[...]} height={260} normalize showXLabels showTooltip />`.

- WRONG hand-rolling a row of `<HStack><span style={dot}/><Text/></HStack>` swatches as a chart legend on every page.
- RIGHT `<ChartLegend items={[{ color, label, value? }]} layout="row" />`. Item `shape` accepts `'square' | 'dot' | 'dash'` (use `dash` for dashed reference lines like a benchmark).

- WRONG passing `legendBelow` on `DonutChart` and discovering the centerContent is offset toward the bottom-right of the wrapper.
- RIGHT either keep the built-in legend with `showLegend` and the donut sized to the card, OR set `showLegend={false}` and render a `<ChartLegend>` separately below the donut. The center content is now anchored to the donut SVG bounds so it sits dead-centre regardless. (Bug fixed in DonutChart: previous wrapper was size+padding and the center inset was off; current wrapper is exactly `size x size`.)

- WRONG `<button><Settings20Regular /></button>` (icon-only, no label)
- RIGHT `<IconButton icon={<Settings20Regular />} aria-label="Settings" />`

- WRONG `<Button><svg>...</svg></Button>` for icon-only
- RIGHT `<IconButton icon={<Icon />} aria-label="..." />`

- WRONG `<a href="/x" className="btn btn-primary">`
- RIGHT `<Button onClick={() => navigate('/x')}>` or a `Link`-based `Button`

- WRONG mixing `Button` variants for siblings of equal importance, inventing a fake hierarchy:
  ```
  <HStack>
    <Button variant="secondary">Edit profile</Button>
    <Button variant="ghost">Log out</Button>     {/* same importance, looks subordinate */}
  </HStack>
  ```
- RIGHT same importance level → same variant; pick the variant by importance, not by "I want some visual variety":
  ```
  <HStack>
    <Button variant="secondary">Edit profile</Button>
    <Button variant="secondary">Log out</Button>
  </HStack>
  ```
  Asymmetric variant pairs are correct only when the actions truly have asymmetric importance (modal: primary Save + ghost Cancel; pricing card: primary Buy + secondary Preview). Decorative variation between equally-important siblings is wrong.

- WRONG hand-rolled "link" with HStack + Text + ArrowRight + manual `cursor: pointer` + brand color:
  ```
  <HStack gap="xs" style={{ cursor: 'pointer', color: 'var(--brand-primary)' }}
    onClick={() => navigate('/account/templates')}>
    <Text size="sm" weight="semibold" style={{ color: 'var(--brand-primary)' }}>See all</Text>
    <ArrowRight16Regular />
  </HStack>
  ```
  Reinvents Button. No focus ring, no `:focus-visible`, no `aria-busy`, no consistent height with surrounding controls, no hover underline, no keyboard activation feel.

- RIGHT `<Button variant="link" size="sm" rightIcon={<ArrowRight16Regular />}>` for forward CTAs ("See all", "Contact us", "Read more"):
  ```
  <Button
    variant="link"
    size="sm"
    rightIcon={<ArrowRight16Regular />}
    onClick={() => navigate('/account/templates')}
  >
    See all
  </Button>
  ```
  And the same `variant="link"` with a muted color override for back/breadcrumb links:
  ```
  <Button
    variant="link"
    size="sm"
    icon={<ChevronLeft20Regular />}
    style={{ color: 'var(--text-muted)' }}
    onClick={() => navigate('/templates')}
  >
    All templates
  </Button>
  ```

  **Heuristic:** any clickable text-with-icon is a `Button variant="link"`. Default brand color = forward CTA. Muted color override = back / breadcrumb. Never compose `HStack + Text + cursor: pointer`.

- WRONG `variant="ghost"` for a back/breadcrumb link at the top of a page. The ghost padding shifts the label ~16px to the right, so it looks misaligned with the page content until the user hovers (which then adds a background that hides the misalignment):
  ```
  <Button variant="ghost" size="sm" icon={<ChevronLeft20Regular />}>All templates</Button>
  ```
- RIGHT `variant="link"` with a muted color (zero horizontal padding, label flush at rest):
  ```
  <Button variant="link" size="sm" icon={<ChevronLeft20Regular />} style={{ color: 'var(--text-muted)' }}>
    All templates
  </Button>
  ```

## Inputs and forms

- WRONG `<input type="text" className="border rounded ..." />`
- RIGHT `<Input label="..." value={v} onChange={setV} />`

- WRONG manual error `<p>` sibling under an input
- RIGHT `<Input error={errorMsg} />` (auto wires `role="alert"` + `aria-describedby`)

- WRONG `<label>Email</label><input>`
- RIGHT `<Input label="Email">` (handles label + id + aria wiring)

- WRONG `<select>...</select>` with custom styling
- RIGHT `<Select options={[...]} />`

- WRONG placeholder used as label: `<input placeholder="Email" />`
- RIGHT `<Input label="Email" placeholder="you@example.com" />`

## Icons

- WRONG `<div style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)', borderRadius: 8, width: 36, height: 36 }}>{icon}</div>` (colored pill behind icon)
- RIGHT `<Icon style={{ color: '#a855f7' }} />` (color the glyph, no background)

- WRONG emoji as structural icon: `<span>⭐</span>`
- RIGHT `<Star20Regular />` from `@fluentui/react-icons`

- WRONG mixing icon families (Material + Fluent in the same UI)
- RIGHT only `@fluentui/react-icons`

## Navigation

- WRONG `getActiveId()` falls back to `'home'` when the path has no nav item:
  ```
  const getActiveId = () => {
    const path = location.pathname
    if (path === '/') return 'home'
    if (path.startsWith('/docs')) return 'docs'
    ...
    return 'home'              // ← /account, /checkout, /auth, /terms all light up Home
  }
  ```
- RIGHT return an empty/sentinel value when no nav item matches the current path. Pages outside the navbar (account, auth callback, checkout, terms, settings deep links) should highlight nothing:
  ```
  const getActiveId = () => {
    ...
    return ''                  // no nav item is active
  }
  ```

- WRONG showing a navbar nav item as active on a page that has no logical relationship to it (e.g. Home highlighted while the user is on /account)
- RIGHT the active indicator only fires when the user is genuinely inside that section. If the page lives outside the navbar's tree, the navbar should look "neutral".

- WRONG using `<Navbar>` for a vertical menu. `Navbar` is **always** a horizontal top bar. It is never the right primitive when the menu reads top-to-bottom.
- RIGHT pick by the menu's orientation: horizontal menu uses `<Navbar>`, vertical menu uses `<AppSidebar>`. The use case (docs, dashboard, settings, admin, app shell) does not change the pick. The reading direction does.

- WRONG `<Navbar>` header + a hand-rolled `<aside>` with a vertical link list to fake a sidebar.
- RIGHT `<AppSidebar sections={..} logo={<Logo/>}/>` + `<main style={{ flex: 1 }}>` flex shell. The sidebar carries the logo and primary nav. No top Navbar above it.

- WRONG `.docs-sidebar { position: sticky; top: 64px; }` for a docs site sidebar that should never pass under the Navbar. `sticky` follows the scroll but rides the page flow, and inside a grid track with no fixed height it can collapse or jump under the Navbar at edge cases. Same trap on the TOC: `position: sticky` inside a grid column silently fails to stick when the parent has no fixed height.
- RIGHT `position: fixed; top: 64px; left: 0; width: 240px; height: calc(100vh - 64px);` so the sidebar truly anchors to the viewport. The shell reserves room with `padding-left: 240px` (no grid needed). Same model for the TOC: `position: fixed; top: calc(64px + 32px); right: clamp(24px, 4vw, 56px); width: 220px;` and the article column reserves space with `padding-right: clamp(260px, 22vw, 300px)`.

- WRONG `<Avatar name={...} src={...} />` used as a Dropdown / Popover / Menu trigger (the Avatar's built-in tooltip clashes with the menu and shows the user's name twice on hover):
  ```
  <Dropdown trigger={<Avatar name={user.name} />} ... />
  ```
- RIGHT pass `showTooltip={false}` whenever an `Avatar` triggers an overlay; the overlay is the disclosure, the tooltip is redundant:
  ```
  <Dropdown trigger={<Avatar name={user.name} showTooltip={false} />} ... />
  ```
  The same applies to any Forge primitive with a built-in tooltip when it serves as a trigger: turn the tooltip off, the open/expanded surface already discloses the meaning.

## Overlays

- WRONG custom `<div>` with `position: fixed` + backdrop for a dialog
- RIGHT `<Modal open onClose title="...">` (focus trap, Esc, body scroll lock, `aria-modal`)

- WRONG `<AppSidebar>` wrapped in `<Sheet>` on mobile
- RIGHT `<AppSidebar mode="drawer" open onClose>` (same component, built-in overlay)

- WRONG custom tooltip via `position: absolute`
- RIGHT `<Tooltip content="...">...</Tooltip>`

- WRONG using `z-index: 9999` because something is above the modal
- RIGHT the `Z_INDEX` scale (`dropdown=200`, `popover=210`, `tooltip=220`, `modal=410`, `toast=510`); pick the right key

## Responsive

- WRONG `@media (max-width: 768px) { ... }` in a `.css` file
- RIGHT `const isMobile = useIsMobile()` and branch in JSX

- WRONG `window.innerWidth < 768` for responsive logic
- RIGHT `useBreakpoint()` or `useIsMobile()`

- WRONG hardcoded breakpoint values in responsive logic
- RIGHT responsive prop objects: `columns={{ xs: 1, md: 2, lg: 3 }}`, `py={{ xs: '2rem', md: '4rem' }}`

- WRONG `style={{ width: '100%' }}` on a page-level wrapper (the outermost section container that already sits inside a `Container` or page-padded parent)
- RIGHT let the wrapper size itself naturally; reserve `width: 100%` for inner blocks (image, input, child of an explicit-width parent). Reason: `width: 100%` on a page-level element combined with the parent's horizontal padding can push the box past the viewport when the box also has its own padding/margin/border, and even with `box-sizing: border-box` it cancels the parent's intended insets. Use `Container` for centered max-width, `PageSection` for page rhythm, and skip explicit width on outer wrappers.

- WRONG hardcoded `font-size: clamp(28px, 4.4vw, 44px)` on display text whose floor is too high for narrow phones, leaving 28px text in a 220px-wide content area
- RIGHT clamp floors for display text should sit around 18-22px on phones: `clamp(20px, 4.4vw, 44px)`. Pair with `overflow-wrap: anywhere` on long titles, ingredient lists, or hand-written labels.

- WRONG hardcoded `gap={56}` (or any large pixel gap) in `<Marquee>` / `<Grid>` / `<HStack>` without a mobile reduction
- RIGHT for marquee, drop the gap on small screens via a CSS class. For grids/stacks, prefer Forge gap tokens (`gap="md"`) which already scale with the spacing system.

- WRONG using `<ImageGallery columns={3}>` (or any fixed number) on a route that renders edge to edge on mobile
- RIGHT `columns={{ xs: 1, sm: 2, lg: 3 }}` if the API supports it, otherwise wrap with `useIsMobile()` and pass `columns={1}`. ImageGallery currently accepts `2 | 3 | 4 | 5`, so on mobile you have to keep 2 and rely on a small `aspect-ratio`/`gap` to keep tiles readable.

- WRONG keeping a 5fr / 7fr two-column layout until 900px so it crushes on 768px tablets
- RIGHT stack at `768px` (md). Match the design system's md breakpoint (`useIsMobile` flips at md by default) so JS branches and CSS breakpoints land together.

- WRONG sticky right-column patterns (price card, TOC) that lose stickiness when the layout changes on mobile, leaving the card buried at the bottom of a long page
- RIGHT order the right column above the long content on mobile via CSS `order` (or render twice, gated by `useIsMobile()`). On desktop, keep `position: sticky; align-self: start` and ensure the cell spans enough rows to outlive the scroll.

## Motion

- WRONG `transition: all 0.5s` for a hover
- RIGHT `var(--duration-snappy)` (120ms) or `var(--duration-fast)` (90ms)

- WRONG animating every offscreen element on mount
- RIGHT `<Motion whileInView viewport={{ once: true }}>` so it only plays when visible

- WRONG custom `@keyframes` in a `.css` file for a standard entrance
- RIGHT `Motion` component or existing keyframes in `wss3-forge/styles/animations.css`

- WRONG `animation: ... 2s ease` for an interaction response
- RIGHT keep interactions under 300ms; 2s belongs to ambient/hero motion only

- WRONG custom cursor effects: cursor-following blob, magnetic CTA pull, swapped pointer, halo around the cursor. They feel cheap, fight muscle memory, and on mobile they do nothing. The user perceives them as "tape-a-l'oeil" not "premium".
- RIGHT keep the native cursor. Express attention via the target instead: subtle hover lift on the button (`translateY(-2px)` + shadow ramp), focus ring on inputs, glow on the *element*. Ambient motion (Aurora, ParticleField, drift gradients) is fine because it lives in the page and doesn't follow the pointer.

## Copy

- WRONG em-dash in UI, commits, comments, or subtitles: `Ship fast — easy`
- RIGHT period, comma, colon, line break: `Ship fast. Easy.`

- WRONG all-caps section titles forced via `textTransform: uppercase`
- RIGHT natural-case `Heading`; uppercase only for `<Label>` or `Badge`-style chips

- WRONG "Please click here to continue"
- RIGHT verb-first: "Continue" on the button

## State and logic

- WRONG `try/catch` around a call that cannot throw
- RIGHT let it run. See the project CLAUDE.md rule on no error handling for impossible scenarios.

- WRONG fallback rendering for a prop whose type says it is always set
- RIGHT trust the type

- WRONG feature flag around new code with no old code to compare against
- RIGHT ship it directly

## Comments

- WRONG `// set loading to true` above `setLoading(true)`
- RIGHT no comment; the identifier says it

- WRONG `// used by the OnboardingFlow`
- RIGHT belongs in the PR description, not the code

- WRONG multi-paragraph docstring on an internal helper
- RIGHT one short line only when the WHY is non-obvious (hidden constraint, workaround, invariant)
