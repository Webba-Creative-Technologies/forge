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

### Elevation = surface ladder, not borders

Forge is a filled-first design system. Different elevation levels are expressed by different shades of grey on a continuous surface ladder, not by adding borders.

```
--bg-primary    page background
--bg-secondary  default Card on the page (one step up)
--bg-tertiary   nested Card inside another card (two steps up)
--bg-dropdown   floating menus, popovers, dropdowns (three steps up)
--bg-elevated   modals, sheets, very prominent floating panels (four steps up)
```

`Card` exposes this directly via `variant`:

| Use this | When |
|---|---|
| `<Card>` (default) | Most cards. Top-level surfaces sitting on the page. |
| `<Card variant="raised">` | Cards nested inside another card or block. Lighter than the parent so it reads as one tier up. |
| `<Card variant="subtle">` | Very faint blocks for non-essential content. |
| `<Card variant="elevated">` | Floating panels with a heavy shadow (auth modals, lifted CTAs). |
| `<Card variant="outlined">` | Exception only. Use when the card sits over a colored or gradient backdrop and any fill would clash. |

`outlined` is NOT the default and should be a deliberate choice.

Reason: borders are visually heavier than fill differences. They fight surrounding type and feel "designed in Figma" rather than "built". A surface ladder with consistent steps reads as a calm, layered system at any zoom level.

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

### Navbar active state must reflect reality

The navbar's `value` prop drives which item shows as active. When the user is on a page that is NOT represented in the navbar (account / settings / auth callback / checkout / terms / a 404), nothing should be highlighted. Returning a default like `'home'` for unmatched paths makes Home light up while the user is clearly elsewhere, which feels broken.

```
WRONG (page-not-in-navbar lights up Home):
const getActiveId = () => {
  if (path === '/') return 'home'
  if (path.startsWith('/docs')) return 'docs'
  ...
  return 'home'                  // /account ⇒ Home highlighted
}

RIGHT (return a sentinel that does not match any item):
const getActiveId = () => {
  if (path === '/') return 'home'
  if (path.startsWith('/docs')) return 'docs'
  ...
  return ''                      // /account ⇒ nothing highlighted
}
```

This applies anywhere a navbar / sidebar / tab bar drives selection from the URL: if the current URL has no logical place in that menu, the menu must look neutral. The active indicator carries meaning. Lighting it up wrong is not just cosmetic, it lies to the user about where they are.

### Button variants encode importance, not decoration

The `Button` variants (`primary | secondary | ghost | outline | danger | link`) form an importance hierarchy:

| Variant | Meaning |
|---|---|
| `primary` | THE main action of the screen / form / card. There is at most one per group. |
| `secondary` | Important supporting action (cancel a modal, sign out, edit, manage). |
| `ghost` | Tertiary, low-importance, dismissive (close, skip, "more"). |
| `outline` | Secondary alternative when extra emphasis is needed without going primary. |
| `danger` | Destructive action (delete, revoke, remove). Same importance level as the destructive cousin it replaces. |
| `link` | Inline forward CTA, flows with type. |

The rule: **siblings of equal importance must share the same variant.** Mixing `secondary` + `ghost` for two actions that mean the same thing creates a fake hierarchy: the user reads "the secondary one is more important than the ghost one", but in reality they are both just management actions.

```
WRONG (Edit profile and Log out are both "manage your account" with equal importance,
       so giving them different variants invents a hierarchy that doesn't exist):
<HStack gap="xs">
  <Button variant="secondary">Edit profile</Button>
  <Button variant="ghost">Log out</Button>
</HStack>

RIGHT (same importance => same variant):
<HStack gap="xs">
  <Button variant="secondary">Edit profile</Button>
  <Button variant="secondary">Log out</Button>
</HStack>
```

Pick the variant by asking "how important is this action on this screen?" not "which variant gives me the visual variety I want?". Variation comes from layout (spacing, grouping, size), never from arbitrary variant mixing.

Common asymmetric pairs that ARE correct (because the actions truly have different importance):
- Modal footer: `primary` (Save) + `secondary` or `ghost` (Cancel)
- Page CTA + back link: `primary` (Continue) + `ghost` (Back)
- Pricing card: `primary` (Buy now) + `secondary` (Live preview)

Common symmetric groups that should share the same variant:
- Toolbar with Edit, Duplicate, Delete: all `ghost` (or all `secondary`); mark Delete as `danger` only because it is destructive, not because it is more important.
- Profile management (Edit + Log out): both `secondary`.
- Settings rows with multiple "Change", "Reset", "Disconnect" buttons: all the same.

### "Hero moment" vs "page header" calibrate the outer gap differently

Not every page is a hero moment. Calibrate the outer-level gap to the visual density of the page's first block.

- **Celebration / end-of-flow / placeholder** (CheckoutSuccess "You're in", "Coming soon", "Authentication failed"): the first block is a real hero (icon at 64-96px, generous title, subtitle, optional decorative aura). Outer gap: **`3xl`** (64px). The hero deserves to breathe.
- **Page header** (Account "Manage your profile and templates", Templates "Production-ready React apps..."): the first block is just `Heading level={1}` + a one-line `Text size="lg"`. Outer gap: **`2xl`** (48px) or even **`xl`** (32px). 64px below a 90-pixel-tall header creates a visual hole.

Heuristic: **if your first block has its own decorative element (icon, illustration, gradient orb), use `3xl`. If it is just type, use `2xl` or `xl`.** Stepping the outer gap to fit the page is part of the rhythm; using `3xl` everywhere flattens the system in the other direction.

### Inline links and breadcrumbs are real Buttons, not styled HStacks

A "Read more →" or "See all (12)" or "All templates ←" affordance is a Button. Use `<Button variant="link">` for both forward CTAs and back/breadcrumb links: link is the only Forge variant with zero horizontal padding, so it sits flush with the surrounding type instead of looking 16px misaligned (the trap with `variant="ghost"` whose size-driven padding pushes the label to the right when the button is not hovered).

```
WRONG (reinvents Button, missing focus/keyboard/hover):
<HStack gap="xs" style={{ cursor: 'pointer', color: 'var(--brand-primary)' }} onClick={...}>
  <Text weight="semibold" style={{ color: 'var(--brand-primary)' }}>See all</Text>
  <ArrowRight16Regular />
</HStack>

RIGHT (real Button, inline-feeling thanks to variant="link"):
<Button variant="link" size="sm" rightIcon={<ArrowRight16Regular />} onClick={...}>
  See all
</Button>
```

Color is the only difference between forward and back. Forward CTAs keep the default brand color (they invite forward motion). Back / breadcrumb links override the color to muted (they should not compete with the page's primary CTAs):

```
Forward CTA (brand color, default):
<Button variant="link" size="sm" rightIcon={<ArrowRight16Regular />}>See all</Button>

Back / breadcrumb (muted, subordinate):
<Button
  variant="link"
  size="sm"
  icon={<ChevronLeft20Regular />}
  style={{ color: 'var(--text-muted)' }}
>
  All templates
</Button>
```

Do **not** use `variant="ghost"` for back links: ghost has horizontal padding from the size scale, so the label is misaligned with the surrounding content until the user hovers (and the hover background appears to fix it). Link is the only variant that aligns flush at rest.

Heuristic: any clickable text styled in `var(--brand-primary)` is a forward link Button (default link). Any back arrow + label is a muted link Button (`style={{ color: 'var(--text-muted)' }}`). If you find yourself writing `cursor: 'pointer'` on a `Text` or `HStack`, you missed a Button.

### Use semantic variants to convey state

`variant="success" | "warning" | "error" | "info"` on `Banner`, `Badge`, and `AlertDialog` is how the system communicates state. The variant picks the color and the icon. Do not replace a semantic variant with hardcoded color styling.

Reason: semantic variants can be themed, translated, and made accessible once in the primitive. Hand-rolled state colors cannot.

### Typography is a three-tier hierarchy

- `Heading level={1..6}` for titles and section labels
- `Text` for body copy, with `size="xs|sm|md|lg"` and `color="primary|secondary|muted|brand|success|warning|error"`
- `Label` for form labels and required markers

Reason: the three components cover every type use case. Picking one forces you to think about semantic role, not just pixel size.

### Display type calibration (size and line-height)

A landing-page section title is not a generic h2. It is the visual anchor of its section, sitting in proportion with the hero above it and the body below it. Two recurring mistakes flatten that proportion:

**Line-height for displays that wrap.** Tight line-height (`0.95`-`1.02`) is a wordmark-only setting. The moment a title wraps to two lines (a hard `<br />`, a `clamp()` headline that flows on narrow viewports, anything with a `max-inline-size`), descenders of line 1 collide with ascenders of line 2 and the reader perceives "the lines are crashing into each other". Use `line-height: 1.04-1.06` for any display that *might* wrap. Reserve `0.95-1.02` for guaranteed-single-line uses (logo wordmarks, hero h1 you have visually verified at every breakpoint).

**Size floors relative to the hero.** A landing page sets a typographic ceiling at its hero. Section h2 should land at roughly **60% of the hero ceiling, never less than 40%** at desktop. If hero is `clamp(72px, 10vw, 160px)`, section h2 floors at `clamp(48px, 6vw, 96px)`. If you ship h2 at `clamp(40px, 5vw, 80px)` against a 160px hero, the section reads "minuscule" against the hero and the page hierarchy collapses. Symptom in user feedback: "le titre est minuscule".

```
WRONG (tight + small):
.section-title {
  font-size: clamp(40px, 5vw, 80px);
  line-height: 1.0;
  letter-spacing: -0.02em;
}

RIGHT (calibrated to a 160px hero, safe for wraps):
.section-title {
  font-size: clamp(48px, 6vw, 96px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  max-inline-size: 14ch;
  overflow-wrap: anywhere;
}
```

When you write a mobile floor (`@media (max-width: 480px)`), keep the line-height override on the same rule. A clamp that drops to 36-44px at 320px-wide will still wrap, and the line-height rule must follow.

### Dark sections invert *every* text token, not just the background

When a section flips its background to dark (`#1F1A14`, `var(--bg-primary)` in dark mode, a hero photo with a black scrim), the inline styles still pointing at `#1F1A14` titles or `#4A4036` body text become invisible against the new surface. Symptom in user feedback: "le choix de couleur de texte c'est mauvais faut mettre blanc".

The fix is to invert *the whole token set* the section uses, not patch a single rule. Easiest: scope a class on the dark wrapper and override the relevant Forge tokens once, the way `.iro-hero nav` and `.atl-hero-nav nav` already do for hero navbars. Tokens that almost always need overriding on a dark surface:

- `--text-primary` -> `#F5EDDD` (cream) or `#FFFFFF`
- `--text-secondary` -> `rgba(245, 237, 221, 0.78)`
- `--text-muted` -> `rgba(245, 237, 221, 0.55)`
- `--border-color` -> `rgba(245, 237, 221, 0.14)`
- `--bg-tertiary` / `--bg-hover` -> `rgba(245, 237, 221, 0.08-0.16)` for hover/active states inside the section

Then audit every custom class that lives inside the section: progress dots, dividers, dotted separators, mono overlines, decorative icons. Any rule that hardcodes `rgba(31, 26, 20, ...)` needs a sibling rule for the dark scope. The default tone for a body paragraph on dark is `rgba(245, 237, 221, 0.78-0.85)`, never pure white at 100% (it vibrates).

### Layout is done with stacks and grids, not flex divs

`VStack`, `HStack`, `Stack`, `Grid`, `Flex`, `Box`, `Center`, `Spacer`, `AspectRatio`. Each one maps to a layout intent. Writing `<div style={{ display: 'flex' }}>` is a signal that you skipped the primitives.

Reason: stacks encode the three decisions every flex container makes (direction, gap, alignment) into named props. That reduces the surface where a typo or a missing prop produces a silent layout bug.

### Hero moments deserve scale and a real schema

A success screen, a thank-you screen, a "you're in" moment, an empty-state hero, a 404 page: these are not stub pages. They land at the end of a flow and they are the user's emotional payoff. Treat them as a designed moment.

Three things to get right:

**1. Anchor icon at hero scale.** Default icon sizes (20-32px) make a celebration look like a notification. For a hero moment, render the Fluent icon at 64-96px via `style={{ fontSize: 96 }}`. Pair with a meaningful color: `--color-success` for completion, `--color-error` for failure, `--brand-primary` for invitation/upcoming. Never wrap it in a tinted box (see Monochrome icons rule above).

**2. Show what happened, visually.** A "You bought X" page must render X. Pull the entity's identity (template name, gradient, thumbnail) into the page. Otherwise the user is told they succeeded but sees no proof. Use the same visual elements (gradients, badges) that the catalog uses, so the screen feels like the same product.

**3. Vary gaps by section type.** Hero pages stack three or four major sections (the celebration block, the artifact card, the actions, the footnote). Use big gaps between sections (`3xl`/`2xl`) and tight gaps inside each section. A flat list with `gap="xl"` between every child reads as a form, not a moment.

```
WRONG (flat, equal gaps, tiny icon, no visual confirmation):
<VStack gap="2xl">
  <CheckmarkCircle32Filled style={{ fontSize: 32 }} />
  <Heading>You're in</Heading>
  <Text>Thanks for buying.</Text>
  <Card>
    <Text>Order summary</Text>
    <Text>{name}</Text>
    <Text>{price}</Text>
    <Text>License: {key}</Text>
  </Card>
  <Button>My templates</Button>
  <Button>Browse more</Button>
  <Text>Receipt was emailed.</Text>
</VStack>

RIGHT (hero scale, visual confirmation, hierarchy of gaps):
<VStack gap="3xl">                                  {/* between major sections */}
  <VStack gap="md">                                 {/* hero block */}
    <CheckmarkCircle48Filled style={{ fontSize: 96, color: 'var(--color-success)' }} />
    <VStack gap="xs">                               {/* tight title pair */}
      <Heading level={1}>You're in</Heading>
      <Text size="lg" color="secondary">Your license is active.</Text>
    </VStack>
  </VStack>

  <Card padding="none">
    <div style={{ height: 140, background: categoryGradient, ... }}>
      <Badge variant="success">Paid</Badge>      {/* visual confirmation */}
    </div>
    <VStack gap="lg" style={{ padding: '1.5rem' }}>
      <VStack gap="xs">
        <HStack justify="between"><Heading level={3}>{name}</Heading><Text>${price}</Text></HStack>
        <Text size="sm" color="muted">Purchased {date}</Text>
      </VStack>
      <Divider />
      <VStack gap="sm">                            {/* license key in its own group */}
        <HStack justify="between"><Text>Your license key</Text><CopyButton text={key} /></HStack>
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontFamily: 'monospace', textAlign: 'center' }}>
          {key}
        </div>
      </VStack>
    </VStack>
  </Card>

  <VStack gap="xs">                                {/* actions + footnote tight */}
    <HStack gap="sm"><Button size="lg">Go to my templates</Button><Button size="lg" variant="secondary">Browse more</Button></HStack>
    <Text size="xs" color="muted">A receipt was emailed to you.</Text>
  </VStack>
</VStack>
```

Apply this to every "you just did something" page: post-purchase, post-onboarding, post-signup, post-publish, post-share, completion screens after a workflow.

Reason: end-of-flow screens disproportionately shape how the product feels. A flat list of facts says "transaction logged". A composed moment with hero scale, a visual proof of what happened, and a clear next step says "we built this for you".

### Never repeat the same gap across siblings of unequal relationship

This is the strongest version of the grouping rule. Memorize it:

> If you write `<VStack gap="X">` (or any stack) with **three or more children**, ask: are any two of them more related to each other than to the third? They almost always are. Wrap the closer pair in a sub-stack with a tighter gap.

A page with three visual sections is almost never three flat siblings. It is two siblings, where one of the siblings is itself a small group of two.

```
WRONG (flat: Hero, Card, Actions all equally separated):
<VStack gap="3xl">
  <Hero />
  <ArtifactCard />
  <Actions />
</VStack>
→ Action buttons feel detached from the artifact they act on.
→ Hero feels exactly as far from the artifact as the actions do.

RIGHT (the artifact + its actions form a cluster, separated from the hero):
<VStack gap="3xl">             {/* outer: hero vs the rest */}
  <Hero />
  <VStack gap="lg">            {/* cluster: artifact + actions */}
    <ArtifactCard />
    <Actions />
  </VStack>
</VStack>
```

Recursive application. Inside the artifact card, the same question applies. A typical post-purchase card body has three sections (order summary, license key, divider). The summary and the license key are both descriptions of what was bought, but the license key is the artifact the user actually came for; it deserves its own sub-group with a tighter internal rhythm and a Divider above it, not the same `gap="md"` between every child.

Default gap pattern for a 3-section page or panel:

```
outer  3xl  ── 2xl ── lg ── md ── sm ── xs ──  inner
        |      |      |     |      |     |
        |      |      |     |      |     └─ tight pair (label+value, button+caption)
        |      |      |     |      └─ row inside a list (checkmarks, settings)
        |      |      |     └─ blocks inside a Card (header, body, footer)
        |      |      └─ artifact + its actions (cluster)
        |      └─ hero + cluster (still on one screen)
        └─ between page-level moments
```

The outer gap is always the largest you use on that page. Each nesting level steps down one or two notches on the scale. If you find yourself using the same gap value at two consecutive nesting levels, you are flattening the hierarchy.

Reason: equal gaps tell the user "all of these things are equally important, equally related". Three visual sections at equal gap reads as a list of unrelated facts. Two outer sections, where one is a tight cluster, reads as a story: "look at this, here is what you got, and here is what to do next".

### Group siblings by intent

Before you flatten a stack of children, ask: do these children share a role? If yes, wrap the related ones in a sub-stack with a tighter gap.

```
WRONG (5 flat siblings, no schema, every child reads as equal):
<VStack gap="md">
  <Text>Label</Text>
  <Heading>{value}</Heading>
  <Divider />
  <Button>Primary</Button>
  <Button>Secondary</Button>
  <Text>caption</Text>
</VStack>

RIGHT (visual schema: 3 groups, tighter gap inside each group):
<VStack gap="md">
  <VStack gap="xs">              {/* group 1: caption + value, tight pair */}
    <Text>Label</Text>
    <Heading>{value}</Heading>
  </VStack>

  <Divider />

  <VStack gap="md">              {/* group 2: actions, with their caption */}
    <VStack gap="xs">            {/* sub-group: primary + caption (tight) */}
      <Button>Primary</Button>
      <Text size="xs">caption</Text>
    </VStack>
    <Button>Secondary</Button>
  </VStack>
</VStack>
```

The eye reads grouped children as one unit (Gestalt proximity). A flat list with uniform gap makes every child equal in priority, which is rarely the intent. A captioned action like a buy button + "Secured by Stripe" caption belongs together; an error message belongs tight under the action that produced it; a section header + body text belong together; etc.

Apply this at every depth, not just at the page level. Card content, hero blocks, sidebar widgets, form sections, table cells: every container of more than two siblings is a candidate.

Reason: visual hierarchy is built from proximity + alignment. Items that belong together must sit closer than items that don't. Flat lists fight this and produce screens that feel like inventories instead of compositions.

### Spacing rhythm (gap by intent, not by size)

Pick gap by the relationship between siblings, not by "what looks about right". The scale is `xs=4, sm=8, md=12, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96`.

| Relationship | Gap | Example |
|---|---|---|
| Tight pair (label + value, title + immediate subtitle) | `xs` (4) | Heading + small caption above it; price label + price value |
| Compact list (rows of related items) | `xs` to `sm` | Checkmark feature lists, settings rows |
| Card section internal (between blocks within one Card) | `md` (12) | Header block, divider, body block |
| Around a `<Divider>` inside a Card | `md` (12), and the Divider must be `spacing="none"` (see below) | The divider has its own visual weight, do not wrap it in `gap="lg"` |
| Section title + content (h2 over a list/grid) | `lg` (24) | Section heading and the components below it |
| Between major page sections | `2xl` to `3xl` (48 to 64) | Hero, then catalog, then footer CTA |
| Hero h1 + supporting subtitle | `sm` (8) | Big page title + size="lg" subtitle paragraph |

**`Divider` is context-aware.** When rendered inside a `VStack`/`HStack`/`Stack`, its default `spacing` is `'none'` automatically: the parent's `gap` is the only source of rhythm and the line is just punctuation. Outside any Stack (a raw `<div>`, a flex/grid where you suppressed gap), the default is still `'md'`. So in practice you can write `<Divider />` and trust the right behaviour both inside and outside Stacks; you only pass `spacing` explicitly to override (e.g. `spacing="lg"` for an extra-roomy section break, `spacing="md"` to opt back into the legacy margin even inside a Stack).

Common over-spacing mistakes:

- `<VStack gap="lg">` around a `<Divider>` produces ~50px of empty space (24 + divider + 24). The divider already separates. Use `gap="md"`.
- `<VStack gap="md">` between a `<Heading>` and its immediate subtitle pulls the eye apart. Use `gap="xs"` for the tight pair, then a larger gap to the next block.
- Stacking large gaps inside a Card defeats the Card padding. The Card already breathes via `padding="lg"`; the contents should feel cohesive, not float.

Reason: spacing communicates relationships. A 4px gap says "these two things belong together"; a 24px gap says "different sections". Picking the gap by visual relationship instead of by aesthetic preference makes the rhythm scan correctly at any zoom level.

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
