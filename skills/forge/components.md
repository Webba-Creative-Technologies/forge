# Components

Every public component exported from `wss3-forge`. Props listed here are verified against the TypeScript source. Sizes, variants, and defaults match the current code.

Import path is always `'wss3-forge'`. Icons come from `'@fluentui/react-icons'`.

## Button

<a id="buttons-decision"></a>
**Pick:**
- `Button`: when the action sits in flow with text or other controls (forms, toolbars, hero CTA).
- `IconButton`: when space is tight and the meaning is unambiguous (close, more, edit). Always pass `tooltip` or `aria-label`.
- `FloatButton`: when the action floats over scrolling content (compose, scroll-to-top, primary mobile action).
- `Button variant="link"`: when the action belongs inline with body copy and should align to the text edge.
- Avoid: a styled `<button>` or `<a>` with custom CSS.

### `Button`
Primary action button.

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'outline' \| 'link'` | `'primary'` |
| | | |

**`variant="link"` is inline-aligned**: it has zero horizontal padding and `height: auto` so it sits flush with the surrounding text. Drop it directly inside a `VStack` next to a `Heading`/`Text` and the label aligns at the same left edge. Use it for forward CTAs ("See all", "Contact us", "Read more"); use `variant="ghost"` for back/breadcrumb links.
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `icon` | `ReactNode` | |
| `rightIcon` | `ReactNode` | |
| `loading` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `compact` | `boolean` | `false` |
| `gradient` | `boolean` | `false` |
| `disabled` | `boolean` | |
| `children` | `ReactNode` | required |

`gradient` only affects `primary`, `outline`, and `ghost` variants.

### `IconButton`
Square icon-only button.

| Prop | Type | Default |
|---|---|---|
| `icon` | `ReactNode` | required |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `variant` | `'ghost' \| 'subtle' \| 'danger' \| 'inverted'` | `'ghost'` |
| `tooltip` | `string` | |
| `loading` | `boolean` | `false` |
| `disabled` | `boolean` | |

### `ButtonGroup`
Attached row/column of buttons.

| Prop | Type | Default |
|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | inherits |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'outline'` | inherits |

### `FloatButton`, `FloatButtonGroup`, `BackToTop`
Floating action buttons anchored to a corner.

`FloatButton`: `icon`, `onClick`, `tooltip`, `position` (`'bottom-right' \| 'bottom-left' \| 'bottom-center' \| 'top-right' \| 'top-left'`, default `'bottom-right'`), `size` (`'sm' \| 'md' \| 'lg'`, default `'md'`), `variant` (`'primary' \| 'secondary' \| 'gradient'`, default `'primary'`), `badge` (number or string), `inline` (renders in-flow rather than fixed).

`FloatButtonGroup`: `icon`, `closeIcon`, `actions: { icon, label, onClick }[]`, `position`, `variant`, `trigger` (`'click' \| 'hover'`), `inline`.

`BackToTop`: `threshold` (px, default `400`), `smooth` (default `true`), `position`.

### `CopyButton`, `CopyField`
Copy-to-clipboard helpers with feedback.

`CopyButton`: `text` (required), `variant` (`'icon' \| 'button' \| 'minimal'`, default `'icon'`), `size` (`'sm' \| 'md' \| 'lg'`), `label` (default `'Copy'`), `successLabel` (default `'Copied!'`), `timeout` (ms, default `2000`), `onCopy`.

`CopyField`: `value` (required), `label`, `size` (`'sm' \| 'md'`), `onCopy`.

## Typography

### `Heading`
Semantic heading.

| Prop | Type | Default |
|---|---|---|
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` |
| `as` | element override | `h{level}` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | derived from level |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'semibold'` |
| `color` | `'primary' \| 'secondary' \| 'muted' \| 'brand' \| 'success' \| 'warning' \| 'error' \| string` | `'primary'` |
| `align` | `'left' \| 'center' \| 'right'` | |
| `truncate` | `boolean` | `false` |

Default size per level: `1=3xl, 2=2xl, 3=xl, 4=lg, 5=md, 6=sm`.

### `Text`
Body text.

| Prop | Type | Default |
|---|---|---|
| `as` | `'p' \| 'span' \| 'div' \| 'label'` | `'span'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'normal'` |
| `color` | same as `Heading` | `'primary'` |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | |
| `truncate` | `boolean \| number` (lines) | |
| `italic`, `underline`, `strikethrough`, `uppercase` | `boolean` | |

### `Label`
Form label. Props: `required`, `error`.

### `Link`
Anchor. Props: `href`, `external`, `size` (`'sm' \| 'md' \| 'lg'`), `disabled`, `onClick`.

### `Kbd`
Keyboard key.

### `Shortcut`
Stacked keys. Prop: `keys: string[]`.

## Layout

<a id="layout-decision"></a>
**Pick:**
- `VStack` / `HStack`: vertical or horizontal stack with a single direction. The default for any column or row.
- `Stack`: when the direction must flip responsively (column on mobile, row on desktop).
- `Grid`: when items live on a 2-D grid with responsive column counts.
- `Flex`: when you need flex behavior `Stack`/`Grid` cannot express (reverse, wrap-and-grow combos).
- `Box`: when you need a styled wrapper with spacing/radius/shadow shortcuts but no layout role.
- `Center`: when the only job is to center one child both axes.
- Avoid: a flex `<div>` with inline style or a custom CSS class.

### `Container`
Max-width wrapper.

Props: `maxWidth` (Breakpoint, `'full'`, or number, default `'xl'`), `padding` (ResponsiveValue, default `'1rem'`), `py` (ResponsiveValue), `center` (default `true`).

### `Grid`
CSS Grid with responsive columns.

Props: `columns` (ResponsiveValue<number | string>, default `1`), `gap` (SpacingValue, default `'md'`), `rowGap`, `columnGap`.

### `VStack` / `HStack` / `Stack`
Stacked layout. `VStack` is vertical, `HStack` is horizontal, `Stack` is responsive (direction prop).

Props: `gap` (SpacingValue, default `'md'`), `align` (`'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`; `HStack` defaults to `'center'`), `justify` (`'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'`), `wrap`, `inline`, `fullWidth`, `fullHeight`.

`Stack` additionally accepts `direction` (ResponsiveValue<`'row' \| 'column'`>, default `'column'`).

### `Box`
General-purpose element with design-system shortcuts.

Props: `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` (SpacingValue each), `w`, `h`, `minW`, `maxW`, `minH`, `maxH`, `display`, `bg`, `rounded` (`'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'`), `border`, `shadow` (`'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'`), `as`, `onClick`.

### `Flex`
Flexbox primitive.

Props: `direction` (`'row' \| 'column' \| 'row-reverse' \| 'column-reverse'`, default `'row'`), `wrap`, `align`, `justify`, `gap`, `inline`, plus `Box` props.

### `Center`
Centers its child. Props: `inline`, plus `Flex` props.

### `Spacer`
Fills flex space. Props: `size` (SpacingValue), `axis` (`'horizontal' \| 'vertical' \| 'both'`, default `'both'`), `flex` (boolean or number).

### `AspectRatio`
Locks aspect ratio. Props: `ratio` (number, default `1`), `maxW`.

### `Page`
Full-page container. Props: `padding` (default `'lg'`), `bg`, `maxWidth`, `center`, `minHeight` (default `'100vh'`).

### `PageSection`
Landing-page section wrapper. Owns the responsive vertical padding (`clamp()` so it scales with viewport), the inner `Container` max-width, and an optional accent background. Replaces the `<section><Container><VStack>` boilerplate every marketing page re-implements.

Props: `size` (`'sm' | 'md' | 'lg' | 'xl'`, default `'md'`, controls vertical padding), `container` (Container max-width, default `'xl'`), `tone` (`'transparent' | 'subtle' | 'tertiary'`, default `'transparent'`), `fullBleed` (skip the inner Container, default `false`), `as` (`'section' | 'header' | 'footer' | 'div'`, default `'section'`), `id` (anchor target).

```tsx
<PageSection id="features" size="lg" tone="subtle">
  <Heading level={2}>Features</Heading>
  <Grid columns={3}>{/* features */}</Grid>
</PageSection>

<PageSection size="xl" fullBleed>
  <Marquee fadeEdges>{logos}</Marquee>
</PageSection>
```

Note: there is a separate `Section` exported from `Card.tsx` as a titled content block. They have different jobs: `Section` is a titled card; `PageSection` is the chrome around a marketing section.

### `ActionItem`
Tap target tile. Props: `icon`, `label`, `color`, `onClick`, `padding` (default `'md'`), `rounded` (default `'md'`), `bg`, `hoverBg`, `direction` (default `'column'`), `align` (default `'center'`), `gap` (default `'sm'`), `disabled`.

### `IconBox`
Icon with background box. Props: `size` (default `40`), `color`, `bg`, `rounded` (default `'md'`).

### `Show` / `Hide`
Responsive visibility. Props: `above` (Breakpoint), `below` (Breakpoint), `at` (Breakpoint or Breakpoint[]).

### `Divider`, `VerticalDivider`, `SectionDivider`
Separator lines.

`Divider`: `orientation` (`'horizontal' \| 'vertical'`), `variant` (`'solid' \| 'dashed' \| 'dotted'`), `color`, `spacing` (`'none' \| 'sm' \| 'md' \| 'lg'`, default `'md'`), `label`, `labelPosition` (`'left' \| 'center' \| 'right'`, default `'center'`).

**`Divider` is context-aware.** When rendered inside a `VStack` / `HStack` / `Stack`, the default `spacing` is `'none'` automatically (the parent's `gap` becomes the only source of vertical/horizontal rhythm). Outside any Stack, the default is `'md'` so a standalone Divider keeps reasonable breathing room. You can still pass `spacing` explicitly to override either default.

`SectionDivider`: `label`, `icon`.

### `ScrollArea`
Styled scrollable region.

Props: `height`, `maxHeight`, `orientation` (`'vertical' \| 'horizontal' \| 'both'`, default `'vertical'`), `autoHide` (default `true`), `scrollbarSize` (default `6`), `onScrollEnd`.

## Cards

<a id="cards-decision"></a>
**Pick:**
- `Card`: generic surface for content blocks. The default.
- `StatCard`: icon-led metric tile with auto-formatted percent change.
- `KpiCard`: compact dashboard tile with mono value, pre-formatted delta, and optional inline sparkline.
- `ProgressCard`: single metric with a progress bar (quota, step, capacity).
- `InfoCard`: labeled card with leading icon for hint or callout content.
- `ImageCard`: card with a top media image (case study, blog teaser).
- `HorizontalCard`: image left, content right (list rows with media).
- `ActionCard`: clickable tile with icon, used in action grids.
- `PricingCard`: pricing tier card. Never roll your own.
- `EmptyState`: drop inside a `Card` to fill an empty list or zero-data slot.
- Avoid: a styled `<div>` with manual padding, radius, and shadow.

### `Card`
Primary surface.

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | |
| `subtitle` | `string` | |
| `action` | `{ label, onClick }` | |
| `padding` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'md'` |
| `variant` | `'default' \| 'raised' \| 'subtle' \| 'outlined' \| 'elevated'` | `'default'` |
| `onClick` | `() => void` | |
| `hoverable` | `boolean` | |

**Variant choice (filled-first, surface ladder):**

| Variant | Background | When |
|---|---|---|
| `default` | `--bg-secondary` | Top-level card on `--bg-primary`. Most cards. |
| `raised` | `--bg-tertiary` | Card nested inside another card or block, one shade up. |
| `subtle` | `--bg-subtle` (white/4%) | Faint surface for non-essential blocks (hint panels). |
| `elevated` | `--bg-secondary` + heavy shadow + 1px border | Floating panels (auth forms, "lifted" CTAs). |
| `outlined` | transparent + 1px border | Only when the card sits over a colored or gradient backdrop and a fill would clash. Not the default. |

Default to `default` and `raised`. `outlined` is the exception, not the norm. See [design.md](design.md#elevation--surface-ladder).

### `ImageCard`
Card with a top image. Props: `image` (required src), `imageAlt`, `imageHeight?: number`, `title` (required), `subtitle`, `description`, `badge: ReactNode`, `actions: ReactNode`, `onClick`, plus `className` / `style`.

### `HorizontalCard`
Image on the left, content on the right. Props: `image?`, `imageAlt?`, `imageWidth?: number`, `title` (required), `subtitle`, `description`, `meta: ReactNode`, `actions: ReactNode`, `onClick`, plus `className` / `style`.

### `ActionCard`
Clickable tile with icon. Props: `title` (required), `subtitle?`, `icon?`, `iconColor?: string`, `children?`, `actions` (required, `ReactNode`), `onClick`, plus `className` / `style`.

### `StatCard`
Metric card with optional trend.

| Prop | Type |
|---|---|
| `icon` | `ReactNode` |
| `label` | `string` (required) |
| `value` | `string \| number` (required) |
| `color` | `string` |
| `subtitle` | `string` |
| `change` | `number` (percent, positive or negative) |
| `changeLabel` | `string` |
| `chart` | `ReactNode` (sparkline etc) |
| `onClick` | `() => void` |

### `MiniStat`
Compact stat. Props: `icon` (required), `value` (required), `label` (required), `color` (required), `onClick?`.

### `StatRow`
Row entry used inside a list of stats. Props: `label` (required), `value` (required), `color?`.

### `ProgressCard`
Card showing progress. Props: `title` (required), `value: number` (required), `max: number` (required), `unit` (default `''`), `color` (default `var(--brand-primary)`).

### `InfoCard`
Labeled card with icon. Props: `children` (required), `title?`, `icon?`, `padding` (same full scale as `Card`, default `'md'`).

### `Section` (from Card)
Titled section. Props: `title` (required), `action?: { label, onClick }`, `children` (required), `noPadding?`, `delay?: number` (animation delay in ms).

### `PageHeader`
Page title area. Props: `title` (required), `subtitle?`, `actions?: ReactNode`.

### `EmptyState`
Empty-list placeholder. Props: `icon` (required, `ReactNode`), `title` (required), `description?`, `action?: { label, onClick }`.

### `ProgressBar`
Linear progress. Props: `value: number` (0-100, required), `color?`, `size?: 'sm' \| 'md' \| 'lg' \| 'xl'`, `height?: number` (overrides size), `showLabel?`, `animated?`, `delay?: number`, `label?: string`.

### `PricingCard`
Pricing tier card built on Card + VStack + Heading + Text + Badge + Button + Checkmark icon, so radius / padding / shadow / hover all flow from tokens. Use this for any "Starter / Pro / Scale" pricing strip. Never roll a custom one.

Props: `tier` (required, e.g. `'Pro'`), `price` (required, pre-formatted: `'$24'` or `'Free'`), `period` (e.g. `'/ user / month'`), `tagline`, `features` (`string[]` or `Array<{ text: ReactNode; muted?: boolean }>`), `cta` (`{ label, onClick?, href?, variant? }`), `featured` (highlights the tier with brand outline + "Most popular" badge), `featuredLabel` (default `'Most popular'`), `hoverable` (default `true`).

```tsx
<PricingCard
  tier="Team"
  price="$24"
  period="/ user / month"
  tagline="For product, ops and revenue teams."
  features={['5M events / month', 'Unlimited dashboards', 'AI digest']}
  cta={{ label: 'Start trial', onClick: startTrial }}
  featured
/>
```

Use a `Pills` toggle above a strip of `PricingCard`s for a monthly/yearly switch. Keep the cards stable, swap only the `price` prop.

### `Counter`
Animated number counter. Wraps `useCountUp` so it runs once on mount, respects `prefers-reduced-motion`, and ships with sensible cubic ease-out.

Component props: `value` (required), `duration?: number` (ms, default `800`), `from?: number` (default `0`), `format?: (n: number) => string` (default rounds + locale-formats), `prefix?`, `suffix?`.

```tsx
<Counter value={1247832} duration={900} format={n => fmtUSD(n, 0)} />
<Counter value={87} suffix="%" />
```

Hook variant: `useCountUp(value, duration?, from?)` returns the live tweened number. Use it when you need to drive multiple nodes off the same ticker, or wrap a custom typography element.

```tsx
const animated = useCountUp(stat.value, 900)
<Heading>{fmtUSD(animated)}</Heading>
```

Counter does NOT re-animate on subsequent value changes (avoids flicker when the value updates every keystroke during filtering). Key the consuming component on `value` if you do want a fresh animation each time.

## Forms

<a id="forms-decision"></a>
**Pick (text):**
- `Input`: single-line free text (name, email, URL).
- `Textarea`: multi-line free text (message, description). Pass `autoResize` for chat-style fields.
- `SearchInput`: search-shaped input with leading icon and clearable affordance.

**Pick (choice from a list):**
- `Select`: short fixed list, single value (country, role).
- `Combobox`: long list with type-to-filter, single value (city, asset).
- `ComboboxMulti`: same, multiple values (tags, recipients).
- `Cascader`: hierarchical list (region then city, category then sub-category).
- `SelectDropdown`: form-shaped dropdown when you need icon or color per option.

<a id="selection-decision"></a>
**Pick (boolean or small set):**
- `Checkbox`: multi-select within a list, or single boolean inside a form group.
- `Switch`: instant-effect toggle on a setting (notifications on/off). Never wrap in a submit form.
- `Radio`: pick exactly one from a small set (2 to 5 options) where all options should stay visible.
- `Pills`: pick exactly one from a small set styled as a pill row (filter, period switch).
- `SegmentedControl`: same job as `Pills`, denser, used inside dense toolbars.
- `Tabs`: switch between *views* of the page, not values in a form.
- Avoid: a styled `<input type="checkbox">` or `<select>` with custom CSS.

### `Input`
Text input. Extends `<input>`.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | |
| `error` | `string` | |
| `hint` | `string` | |
| `icon` | `ReactNode` (leading) | |
| `rightIcon` | `ReactNode` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `clearable` | `boolean` | |
| `showCount` | `boolean` | |
| `onChange` | `(value: string) => void` | |
| `className` | `string` | |
| `style` | `CSSProperties` | |

### `Textarea`
Multiline input.

Props: `label`, `error`, `hint`, `size` (xs..xl, default `'md'`), `autoResize`, `showCount`, `onChange: (value: string) => void`, plus native textarea attributes.

### `Select`
Native-like select with search and clear.

| Prop | Type | Default |
|---|---|---|
| `options` | `(string \| { value, label })[]` | required |
| `value` | `string` | |
| `onChange` | `(value: string) => void` | |
| `label` | `string` | |
| `placeholder` | `string` | |
| `error` | `string` | |
| `hint` | `string` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `searchable` | `boolean` | |
| `clearable` | `boolean` | |
| `disabled`, `required` | `boolean` | |
| `className` | `string` | |
| `style` | `CSSProperties` | |

### `SearchInput`
Search field with icon.

Props: `value`, `onChange: (value: string) => void`, `placeholder` (default `'Search...'`), `size` (`'sm' \| 'md'`), `autoFocus`, `onKeyDown`.

### `Checkbox`
Boolean input.

Props: `checked`, `onChange: (checked: boolean) => void`, `label`, `disabled`, `indeterminate`, `size` (xs..xl), `hint`, `error`.

### `FormGroup`
Layout wrapper for form rows.

Props: `row` (boolean), `columns` (number).

Use `Input`, `Textarea`, etc. directly for label/error/hint. `FormGroup` handles horizontal rows and multi-column layouts.

### `Switch`
Toggle.

Props: `checked`, `onChange: (checked: boolean) => void`, `disabled`, `label`, `hint`, `error`, `size` (`'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`).

Sizing: the Switch reserves a `min-height` matching the Forge form-field scale (xs=24, sm=32, md=40, lg=48, xl=56) so its bounding box aligns pixel-perfect with `Input`, `Button`, `Select`, `NumberInput`, etc. of the same `size` when used in an `HStack` or form row. The track stays the same compact dimensions and is centred vertically inside that box.

### `SwitchGroup`
List of switches.

Props: `items: { id, label, hint?, checked }[]`, `onChange: (id: string, checked: boolean) => void`, `disabled`.

### `Radio`
Single radio.

Props: `checked`, `onChange: (checked: boolean) => void`, `label`, `description`, `disabled`, `size` (xs..xl), `name`, `value`.

### `RadioGroup`
Multiple radios.

Props: `value`, `onChange: (value: string) => void`, `options: RadioOption[]`, `name`, `label`, `orientation` (`'horizontal' \| 'vertical'`), `size` (`'sm' \| 'md' \| 'lg'`).

### `RadioCardGroup`
Cards instead of plain radios.

Props: `value`, `onChange`, `options: RadioCardOption[]`, `name`, `label`, `columns` (`1 \| 2 \| 3 \| 4`).

### `Slider`
Single-value slider.

| Prop | Type | Default |
|---|---|---|
| `value` | `number` | required |
| `onChange` | `(value: number) => void` | required |
| `min`, `max`, `step` | `number` | `0, 100, 1` |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `error` | `string` | |
| `showValue` | `boolean` | |
| `formatValue` | `(v: number) => string` | |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `color` | `string` | brand |
| `marks` | `{ value, label? }[]` | |
| `showTooltip` | `boolean \| 'always'` | |
| `animated` | `boolean` | |

### `RangeSlider`
Two-handle slider.

Props: `value: [number, number]`, `onChange: (value: [number, number]) => void`, plus shared `Slider` props (`min`, `max`, `step`, `size`, `marks`, `showTooltip`).

### `NumberInput`
Numeric input with +/- buttons.

Props: `value: number | ''`, `onChange: (v: number | '') => void`, `min`, `max`, `step` (default `1`), `precision`, `label`, `hint`, `error`, `required`, `placeholder`, `disabled`, `readOnly`, `size` (xs..xl), `variant` (`'default' \| 'stepper' \| 'inline'`), `showButtons` (default `true`), `allowEmpty`, `prefix`, `suffix`.

### `PasswordInput`
Password field with visibility toggle.

Props: `label`, `error`, `hint`, `icon`, `size` (xs..xl), `showToggle` (default `true`), `onChange: (value: string) => void`, plus native input attributes.

### `TagInput`
Multi-value input.

Props: `value: string[]`, `onChange: (tags: string[]) => void`, `placeholder`, `label`, `hint`, `error`, `required`, `disabled`, `readOnly`, `maxTags`, `allowDuplicates`, `validateTag: (tag) => boolean | string`, `transformTag: (tag) => string`, `separator` (default Enter and comma), `size` (xs..xl), `variant` (`'default' \| 'pills'`).

### `EmailTagInput`
`TagInput` pre-wired with email validation. Same props minus `validateTag`/`transformTag`.

### `OTPInput`
One-time-code input.

Props: `length` (default `6`), `value`, `onChange: (v: string) => void`, `onComplete: (v: string) => void`, `type` (`'numeric' \| 'alphanumeric'`, default `'numeric'`), `size` (xs..xl), `error`, `disabled`, `autoFocus`, `label`, `hint`, `separator` (boolean), `separatorAfter` (number), `masked`.

### `PINInput`
Password-style PIN.

Props: `length`, `value`, `onChange`, plus `OTPInput` props.

### `PhoneInput`
International phone input.

Props: `value`, `onChange: (value, country) => void`, `defaultCountry` (default `'FR'`), `label`, `placeholder`, `error`, `hint`, `disabled`, `size` (xs..xl).

### `DatePicker`
Date picker with calendar popup.

Props: `value: Date | null`, `onChange: (date: Date | null) => void`, `label`, `placeholder` (default `'Select a date'`), `minDate`, `maxDate`, `locale` (default `'en-US'`), `disabled`, `error`, `hint`, `clearable` (default `true`), `size` (`'sm' \| 'md' \| 'lg'`), `required`.

### `DateTimePicker`
Date + time picker. Composes `DatePicker` and `TimePicker`.

Props: all `DatePicker` props plus `format` (`'12h' \| '24h'`, default `'24h'`), `minuteStep` (default `1`), `showSeconds` (default `false`).

### `DateRangePicker`
Two linked `DatePicker`s for a `{ start, end }` range. End picker's `minDate` is driven by the current start, and clearing the start clears the end.

Props: `value: DateRange` (required), `onChange: (range: DateRange) => void` (required), `label?`, `startPlaceholder?` (default `'Start'`), `endPlaceholder?` (default `'End'`), `minDate?`, `maxDate?`, `locale?`, `disabled?`, `error?`, `hint?`, `clearable?` (default `true`), `size?: 'sm' \| 'md' \| 'lg'` (default `'md'`), `required?`.

`DateRange`: `{ start: Date | null; end: Date | null }`.

### `TimePicker`
Time dropdown.

Props: `value: string` (`"HH:mm"` or `"HH:mm:ss"`), `onChange: (time: string) => void`, `format` (`'12h' \| '24h'`, default `'24h'`), `showSeconds`, `minuteStep` (default `1`), `disabled`, `placeholder` (default `'Select a time'`), `label`, `error`, `hint`.

### `TimeRangePicker`
Start and end time pair. Props: `startTime`, `endTime`, `onChange: (start, end) => void`, `format`, `disabled`, `label`, `error`.

### `ColorPicker`
Color palette picker.

Props: `value: string`, `onChange: (color: string) => void`, `colors` (array, default `PRESET_COLORS`), `label`, `hint`, `error`, `showInput`, `size` (`'sm' \| 'md' \| 'lg'`).

`ColorSwatch`: `color`, `size` (default `24`), `onClick`, `selected`.
`ColorPalette`: `value`, `onChange`, `colors`, `size` (default `24`).

### `FileUpload`
Dropzone / file picker.

Props: `onFilesSelected: (files: File[]) => void`, `accept`, `multiple` (default `false`), `maxFiles` (default `10`), `maxSize` (bytes), `disabled`, `label`, `description`, `showPreview`, `variant` (`'dropzone' \| 'button' \| 'compact'`).

### `AvatarUpload`
Square avatar picker.

Props: `currentImage`, `onImageSelected: (file: File) => void`, `size` (default `100`), `disabled`.

### `Combobox`
Autocomplete select.

Props: `options: ComboboxOption[]`, `value`, `onChange: (value: string) => void`, `placeholder`, `searchPlaceholder`, `label`, `hint`, `error`, `required`, `emptyMessage`, `disabled`, `clearable`, `creatable`, `onCreate: (value) => void`, `renderOption`.

### `MultiCombobox`
Multi-select combobox. Separate interface (not a superset of `Combobox`).

Props: `options: ComboboxOption[]` (required), `value?: string[]`, `onChange?: (value: string[]) => void`, `placeholder?`, `label?`, `emptyMessage?`, `disabled?`, `maxSelections?: number`.

### `Cascader`
Hierarchical picker.

Props: `options: CascaderOption[]`, `value: string[]`, `onChange: (value, labels) => void`, `placeholder`, `label`, `error`, `hint`, `required`, `disabled`, `clearable`, `searchable`, `expandTrigger` (`'click' \| 'hover'`), `displayFormat` (`'path' \| 'label'`).

### `MentionInput`
Textarea with @-mentions.

Props: `value`, `onChange: (value, mentions) => void`, `users: MentionUser[]`, `trigger` (default `'@'`), `placeholder`, `label`, `hint`, `error`, `disabled`, `maxLength`, `rows`.

### `MentionDisplay`
Renders text with mention highlights. Props: `text`, `mentions`, `onMentionClick`.

### `Rating`
Star rating input.

Props: `value`, `onChange`, `max` (default `5`), `size` (`'sm' \| 'md' \| 'lg'`), `color` (default warning), `readOnly`, `allowHalf`, `showValue`, `label`.

### `RatingDisplay`
Read-only rating summary. Props: `value`, `max`, `size` (`'sm' \| 'md'`), `color`, `showCount`.

### `Form`, `FormField`, `FormActions`
Declarative form with validation.

`Form`: `children`, `onSubmit: (values: Record<string, unknown>) => void \| Promise<void>`, `initialValues?: Record<string, unknown>`, `gap?: number \| string` (default `'1rem'`).

`FormField`: render-prop style. Props: `name` (required), `label?`, `description?`, `rules?: FormRule`, `children: (field: { value, onChange, onBlur, error, name }) => ReactNode`.

```tsx
<FormField name="email" rules={{ required: 'Email required' }}>
  {({ value, onChange, error }) => (
    <Input value={value as string} onChange={onChange} error={error ?? undefined} />
  )}
</FormField>
```

`FormActions`: alignment wrapper for buttons. Props: `children` (required), `align?: 'left' \| 'center' \| 'right' \| 'between'` (default `'right'`).

`FormRule`: `required?: boolean \| string`, `minLength?: { value, message }`, `maxLength?: { value, message }`, `pattern?: { value: RegExp, message }`, `validate?: (value) => string \| true`.

### `InputGroup`, `InputAddon`, `GroupInput`, `InputWithAddons`
Compose an input with prefix/suffix addons.

`InputGroup`: wrapper.
`InputAddon`: `position` (`'left' \| 'right'`), `onClick`.
`GroupInput`: input with addon-aware border radius. Extends native input attributes.
`InputWithAddons`: shorthand that combines all three.

## Navigation

**Pick by orientation, not by use case:**
- `Navbar` is the **horizontal** primary nav. Top bar, logo on the left, items in a row. If your menu reads left-to-right, use Navbar.
- `AppSidebar` is the **vertical** primary nav. Side column, logo at the top, items stacked top-to-bottom. If your menu reads top-to-bottom, use AppSidebar. This holds whether the surface is docs, dashboard, settings, admin, or anything else with a vertical menu.
- `BottomNav` is the **horizontal** primary nav for mobile, fixed at the bottom edge.
- The pick is the menu's reading direction. Do not compose a Navbar plus a hand-rolled vertical list to fake a sidebar. Use `AppSidebar`.

### `Navbar`
Top bar with logo, items, actions.

| Prop | Type | Default |
|---|---|---|
| `logo` | `ReactNode \| null` | Webba logo |
| `items` | `NavbarItem[]` | |
| `value` | `string` | `'home'` |
| `onNavigate` | `(id: string) => void` | |
| `actions` | `ReactNode` | |
| `actionsSize` | `ButtonSize` | `'md'` |
| `showSearch` | `boolean` | `true` |
| `onSearchClick` | `() => void` | |
| `sticky` | `boolean` | `true` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` (heights 56 / 64 / 80) |
| `background` | `'solid' \| 'transparent' \| 'glass' \| 'none'` | `'solid'` |
| `itemsAlignment` | `'left' \| 'center' \| 'right'` | `'left'` |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` |
| `hoverEffect` | `'pill' \| 'underline' \| 'highlight' \| 'none'` | `'pill'` |
| `layout` | `'nav' \| 'search'` | `'nav'` |
| `searchInline` | `{ value, onChange, placeholder?, onSubmit?, width? }` | (required when `layout="search"`) |
| `scrollFade` | `boolean` | `false` |
| `scrollFadeThreshold` | `number` | `0` |
| `borderBottom` | `boolean` | `false` |
| `leftContent`, `centerContent`, `rightContent` | `ReactNode` | |
| `forceMobile`, `forceDesktop` | `boolean` | `false` |
| `height` | `number` (raw px override) | |

`NavbarItem` supports `dropdownItems` (simple dropdown) or `mega` (multi-column panel).

`density="compact"` shrinks the whole bar: shorter height, smaller logo, tighter item padding, smaller fontSize and gap. A denser version of the same `size` preset (use it on app top-bars where space is tight).

`hoverEffect` controls how hover and active states are rendered on each nav item. The active item uses the same family (a pill stays pill, an underline stays underline). Pick `pill` for app-like nav with a sliding rounded background indicator, `underline` for editorial nav with an animated bottom bar, `highlight` for minimal text-only nav where the only feedback is a brand-coloured text shift, `none` to disable hover entirely.

`layout="search"` swaps the items row for a real centered `<input>` (logo / input / actions). Nav `items` are ignored in this mode; provide `searchInline.value` + `searchInline.onChange` to drive the controlled input. `onSubmit` fires on Enter. The input is anchored to the viewport center via the same 3-column grid Forge uses for `itemsAlignment="center"`. On mobile, the inline input is hidden and the existing search icon button is shown as the fallback (so `showSearch={true}` still matters on mobile in this mode).

### `BottomNav`
Mobile bottom tab bar. Props: `items?: NavbarItem[]`, `value?: string` (default `'home'`), `onNavigate?: (id) => void`, `variant?: 'fixed' \| 'floating'` (default `'floating'`).

### `TopBar`
Simpler top header. Props: `title?`, `subtitle?`, `leftAction?: ReactNode`, `rightActions?: ReactNode`, `transparent?: boolean`.

### `AppSidebar`
Main nav sidebar.

| Prop | Type | Default |
|---|---|---|
| `mode` | `'inline' \| 'drawer'` | `'inline'` |
| `open` | `boolean` | `true` (drawer) |
| `onClose` | `() => void` | (drawer) |
| `position` | `'left' \| 'right'` | `'left'` (drawer) |
| `logo` | `ReactNode` | |
| `compactLogo` | `ReactNode` | (used when `collapsed` is `true`) |
| `sections` | `NavSection[]` | required |
| `value` | `string` | |
| `onNavigate` | `(id: string) => void` | |
| `showHeader` | `boolean` | `true` |
| `headerContent` | `ReactNode` | |
| `showSearch` | `boolean` | `true` |
| `searchPlaceholder` | `string` | `'Search...'` |
| `searchShortcut` | `string` | `'Ctrl+K'` |
| `onSearchClick` | `() => void` | |
| `footerContent` | `ReactNode` | |
| `bottomItems` | `NavItem[]` | |
| `width` | `number` | `240` |
| `drawerWidth` | `number \| string` | `'calc(100vw - 48px)'` (mobile drawer only) |
| `height` | `string` | `'100dvh'` |
| `accentColor` | `string` | `var(--active-color)` |
| `rounded` | `boolean` | `true` (drawer) |
| `collapsible` | `boolean` | `false` |
| `collapsed` | `boolean` | |
| `onCollapsedChange` | `(collapsed) => void` | |
| `resizable` | `boolean` | `false` |
| `minWidth`, `maxWidth` | `number` | `60`, `480` |
| `onWidthChange` | `(width) => void` | |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` |
| `hoverEffect` | `'bg' \| 'border-left' \| 'dot' \| 'highlight' \| 'none'` | `'bg'` |

When `collapsible` is enabled, the sidebar shrinks to a 60px icon rail. The full `logo` is hidden in that mode because most wordmarks do not fit in 60px. Pass a `compactLogo` (a square mark, ideally 32x32 to 40x40) to keep brand presence visible in the rail. The collapse-toggle button stacks vertically below the compact logo. Without `compactLogo`, only the toggle is shown when collapsed (current behaviour preserved).

`density="compact"` tightens item padding (~40%) and the icon/label gap so ~30% more items fit at the same sidebar width. Icon sizes scale down (20→18 top-level, 16→14 nested) so the row keeps its proportions. Use for dense product sidebars where the user needs to see many sections at a glance.

`hoverEffect` controls the indicator drawn on hover and on the active item:
- `bg` (default): subtle background tint on hover, brand-color text on active.
- `border-left`: 3px left bar (brand on active, muted on hover).
- `dot`: small brand-tinted dot left of the icon (filled on active, ghosted on hover). Reserves an extra ~6-8px of left padding to fit the dot.
- `highlight`: text + icon shift to the brand colour on hover and on active. No bg, no bar. Minimalist editorial look.
- `none`: no hover or active surface feedback. The active item still gets the brand colour so it stays readable. Use sparingly (accessibility risk).
Sliding panels.

`Sheet`: `open` (required), `onClose` (required), `position?: 'left' \| 'right'`, `size?: SheetSize`, `width?: number \| string` (overrides `size`), `title?`, `subtitle?`, `icon?: ReactNode`, `headerAction?: ReactNode`, `children?`, `footer?: ReactNode`.

`SidePanel`: alias for `Sheet` (identical props).

`BottomSheet`: `open` (required), `onClose` (required), `title?`, `children` (required). Slides in from the bottom. No height override; sizing is automatic.

### `Tabs`
Horizontal tab bar.

| Prop | Type | Default |
|---|---|---|
| `tabs` | `{ id, label, icon?, count?, disabled? }[]` | required |
| `value` | `string` | required |
| `onChange` | `(tabId: string) => void` | required |
| `variant` | `'default' \| 'pills' \| 'underline'` | `'underline'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `fullWidth` | `boolean` | `false` |
| `stretchLine` | `boolean` | `true` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |

### `TabPanels`, `TabPanel`
Content host for `Tabs`.

`TabPanels`: `value`, `children`.
`TabPanel`: `id`, `value`, `children`.

### `PillTabs`
Draggable horizontal scroll with pill-shaped tabs.

Props: `tabs: { value, label }[]`, `value`, `onChange: (value) => void`, `size` (xs..xl).

### `ViewToggle`
Icon-only view switcher. Props: `options: { value, icon, label? }[]`, `value`, `onChange`.

### `Pills`
Chip list. Props: `options: { id, label, count? }[]`, `value` (string or string[]), `onChange`, `multiple`.

### `SegmentedControl`
iOS-style segmented buttons.

Props: `options: SegmentedOption[]`, `value`, `onChange`, `size` (xs..xl, default `'md'`), `variant` (`'default' \| 'pill' \| 'ghost'`), `fullWidth`, `disabled`.

### `Breadcrumbs`, `BreadcrumbLink`, `PageBreadcrumb`
Hierarchical trails.

`Breadcrumbs`: `items: BreadcrumbItem[]`, `separator`, `showHome`, `homeHref`, `onHomeClick`, `maxItems`, `size` (`'sm' \| 'md' \| 'lg'`).
`BreadcrumbLink`: `href`, `onClick`, `isActive`.
`PageBreadcrumb`: `items`, `title`, `subtitle`, `actions`.

### `Pagination`
Numbered pagination.

Props: `currentPage`, `totalPages`, `onPageChange`, `siblingCount` (default `1`), `showFirstLast` (default `true`), `size` (`'sm' \| 'md' \| 'lg'`).

### `SimplePagination`, `TablePagination`
Minimal variants.

`SimplePagination`: prev/next only with optional page info.
`TablePagination`: adds page-size selector. Props: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `onPageChange`, `onItemsPerPageChange`, `itemsPerPageOptions` (default `[10, 25, 50, 100]`).

### `Stepper`, `StepContent`, `StepActions`, `useStepper`
Multi-step wizard.

`Stepper`: `steps: StepItem[]`, `currentStep` (controlled), `onStepChange`, `orientation` (`'horizontal' \| 'vertical'`), `variant` (`'default' \| 'simple' \| 'dots'`), `allowClickNavigation` (default `true`), `color` (default brand).

`StepContent`: `step` (index), `children` (renders when active).
`StepActions`: `showPrev`, `showNext`, `showFinish`, `prevLabel`, `nextLabel`, `finishLabel`, `onFinish`, `isNextDisabled`.
`useStepper()`: returns `{ currentStep, totalSteps, goToStep, nextStep, prevStep, isCompleted, orientation, variant }`.

### `Footer`, `SimpleFooter`
Page footers.

`Footer`: `logo`, `logoHref`, `tagline`, `sections: FooterSection[]`, `socialLinks`, `copyright`, `bottomLinks: FooterLink[]`, `variant` (`'default' \| 'minimal' \| 'centered'`).
`SimpleFooter`: `companyName`, `text` (overrides full copyright string), `links`.

### `CommandBar`
Ctrl+K palette with search + AI.

Props: `open`, `onClose`, `placeholder`, `onSearch: (query) => SearchResult[]`, `onResultSelect`, `onAiQuery: (query) => Promise<AIResponse>`, `onAiAction`, `aiAvatar`, `isNaturalLanguage: (query) => boolean`.

### `TableOfContents`, `MiniTOC`
Page TOC.

`TableOfContents`: `items: TOCItem[]`, `value`, `onItemClick`, `title`, `collapsible`, `sticky`, `maxHeight`, `variant` (`'default' \| 'minimal' \| 'bordered'`), `autoTrack`, `scrollOffset`, `smooth`.
`MiniTOC`: compact horizontal TOC. Props: `items: { id, title }[]`, `value`, `onItemClick`, `autoTrack`, `scrollOffset` (default `100`), `smooth`.

### `Toolbar`, `ToolbarGroup`
Action bar.

`Toolbar`: `items: ToolbarItem[]`, `size` (`'sm' \| 'md' \| 'lg'`), `variant` (`'default' \| 'ghost' \| 'floating'`), `orientation`.
`ToolbarGroup`: visual grouping wrapper.

`ToolbarItem`: `id`, `icon?`, `label?`, `tooltip?`, `onClick?`, `active?`, `disabled?`, `type?: 'button' | 'separator' | 'spacer'`.

### `Affix`, `StickyHeader`, `StickySidebar`, `ScrollIndicator`
Sticky helpers.

`Affix`: `offsetTop`, `offsetBottom`, `position` (`'top' \| 'bottom'`), `onChange: (affixed: boolean) => void`, `zIndex`.
`StickyHeader`: `offset`, `shadow` (default `true`), `blur` (default `true`).
`StickySidebar`: `topOffset` (default `80`), `bottomOffset` (default `24`).
`ScrollIndicator`: progress bar at top of page. Props typically include `color`, `height`.

### `NavigationProvider`, `useNavigation`
Lightweight nav-state context used by some components (like `AppSidebar`). Wrap the app when you need shared nav state.

## Overlays and dialogs

<a id="overlay-decision"></a>
**Pick:**
- `Modal`: focused task that interrupts the page (create, edit, confirm flow with form).
- `Sheet`: side panel for detail views or secondary content (row detail, filters). Right edge by default.
- `Drawer` (`AppSidebar mode="drawer"`): primary navigation on mobile. Never wrap a sidebar in a `Sheet`.
- `Popover`: anchored small surface (color picker, mini-form, helper). Closes on outside click.
- `Dropdown`: anchored menu of actions or options (overflow menu, row actions).
- `Tooltip`: hover-triggered label, max 1 line. Never put interactive content inside.
- `HoverCard`: hover-triggered popover when richer content is needed (user card on @mention).
- `ConfirmDialog`: yes/no decision. Use `variant="danger"` for destructive actions.
- `AlertDialog`: single-button acknowledgement (rare, prefer toast).
- Avoid: a hand-rolled fixed-position panel or absolute overlay.

### `Modal`
Dialog overlay.

| Prop | Type | Default |
|---|---|---|
| `open` | `boolean` | required |
| `onClose` | `() => void` | required |
| `title` | `string` | |
| `subtitle` | `string` | |
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` |
| `showCloseButton` | `boolean` | `true` |
| `fullScreen` | `boolean` | `false` |
| `closable` | `boolean` | `true` (Esc + backdrop) |
| `ariaLabel` | `string` | |

Composed children: `Modal.Content`, `Modal.Footer`, `Modal.Section`, `Modal.Tabs`.

### `ConfirmDialog`
Yes/no prompt.

Props: `open`, `onClose`, `onConfirm` (required), `title` (required), `description?`, `confirmText?` (default `'Confirm'`), `cancelText?: string`, `variant?: 'default' \| 'danger' \| 'warning' \| 'success'` (default `'default'`), `icon?`, `loading?: boolean`, `children?: ReactNode`.

### `AlertDialog`
Single-button alert.

Props: `open`, `onClose`, `title`, `description`, `buttonText` (default `'OK'`), `variant` (`'info' \| 'success' \| 'warning' \| 'error'`), `icon`.

### `Dropdown`
Menu via a trigger.

Props: `trigger: ReactNode`, `items?: DropdownItem[]`, `categories?: DropdownCategory[]`, `align` (`'left' \| 'right'`, default `'left'`), `width` (default `220`), `openOnHover`.

### `SelectDropdown`
Form-shaped dropdown. Props: `value`, `options: { value, label, icon?, color? }[]`, plus standard form props.

### `ContextMenu`, `useContextMenu`
Right-click menu. Wrap a surface with `ContextMenu` to attach items. `useContextMenu()` opens one imperatively.

### `Popover`
Generic popover.

Props: `trigger`, `content`, `position` (`'top' \| 'bottom' \| 'left' \| 'right'`, default `'bottom'`), `align` (`'start' \| 'center' \| 'end'`, default `'start'`), `open`, `onOpenChange`, `closeOnClickOutside`, `closeOnEscape`, `width` (`number \| 'trigger' \| 'auto'`), `arrow`.

### `HoverCard`
Hover-triggered popover variant.

### `Tooltip`
Hover label.

Props: `content`, `position` (default `'top'`), `delay` (ms, default `200`), `disabled`, `maxWidth`.

### `InfoTooltip`
Tooltip attached to an info icon. Props: `content`, `position`.

### `Tour`, `useTour`, `TourTooltipStatic`
Onboarding.

`Tour`: `steps: TourStep[]`, `open`, `onClose`, `onComplete`, `startAt` (default `0`), `showSkip` (default `true`), `nextLabel` (default `'Next'`), `doneLabel` (default `'Done'`), `skipLabel` (default `'Skip'`).

`useTour(key: string)`: returns `{ open, hasCompleted, start, close, complete, reset }`. `key` is persisted in `localStorage` so completed tours stay hidden on revisit.

`TourTooltipStatic`: standalone tooltip for marketing-style tour demos. Props: `title`, `content`, `currentStep`, `totalSteps`, `nextLabel`, `skipLabel`, `doneLabel`, `showSkip`, `isLast`, `isFirst`.

### `CookieConsent`, `useCookieConsent`
GDPR banner.

`CookieConsent`: `variant` (`'banner' \| 'modal' \| 'floating'`), `position` (`'bottom' \| 'top' \| 'bottom-left' \| 'bottom-right'`), `title`, `description`, `acceptAllLabel`, `acceptSelectedLabel`, `rejectAllLabel`, `settingsLabel`, `showSettings`, `showRejectAll`, `onAccept: (preferences) => void`, `onReject`, `onChange`.

`useCookieConsent()`: returns `{ consentStatus, preferences, isPreferencesAllowed, isAnalyticsAllowed, isMarketingAllowed, setPreferences, accept, reject, reset }`.

## Feedback

<a id="feedback-decision"></a>
**Pick:**
- `Toast`: transient confirmation of a user action (saved, deleted, copied). Auto-dismisses.
- `Notification`: persistent card the user must dismiss (mention, system event, async result).
- `Banner`: inline alert anchored in page flow (form-level error, contextual hint).
- `AnnouncementBanner`: top-of-app marketing or status announcement.
- `AlertDialog`: single-button hard stop the user must acknowledge before continuing.
- `Spinner` / `Skeleton`: loading state. `Skeleton` matches the final content shape, `Spinner` is the fallback.
- Avoid: a hand-rolled fixed-position div for messages, or `alert()`.

<a id="feedback-toast"></a>
### `Toast` (via `ToastProvider` + `useToast`)

Wrap the app in `ToastProvider`. Read the API with `useToast()`.

`ToastProvider` props: `position` (default `'bottom-right'`, supports top/bottom + left/center/right combos), `maxVisible` (default `5`).

`useToast()` returns `{ toasts, addToast, removeToast, success, error, warning, info }`. Convenience:

```tsx
const { success, error } = useToast()
success('Saved!')
error('Failed', 'Optional detail')
```

`SimpleToast` is exported for custom rendering cases.

### `Notification` (via `NotificationProvider` + `useNotification`)

Persistent notification cards.

`NotificationProvider` props: `position` (default `'top-right'`), `maxVisible` (default `5`).

`useNotification()` returns `{ notifications, notify, dismiss, dismissAll }`.

```tsx
const { notify } = useNotification()
notify({ title: 'New message', message: 'From John', variant: 'info' })
```

`NotificationData`: `id`, `variant` (`NotificationType`), `title`, `message?`, `duration?: number | null` (null = persistent), `actions?: { label, onClick, variant? }[]`, `avatar?`, `icon?`, `onClose?`, `timestamp?`.

### `Banner`, `AnnouncementBanner`

Inline alerts.

`Banner`: `variant` (`'info' \| 'success' \| 'warning' \| 'error' \| 'brand' \| 'neutral'`, default `'info'`), `title`, `icon`, `action: { label, onClick }`, `showCloseButton` (default `false`), `onClose`, `position` (`'top' \| 'bottom' \| 'inline'`, default `'inline'`), `size` (`'sm' \| 'md'`, default `'md'`).

`AnnouncementBanner`: top-of-app announcement. Props: `children`, `href?: string` (turns the whole banner into a link), `onClick?: () => void`, `showCloseButton?: boolean`, `onClose?: () => void`, `gradient?: boolean`.

### `Spinner`, `LoadingOverlay`, `WebbaLoader`, `WebbaThinking`

`Spinner`: `size` (`'xs' \| 'sm' \| 'md' \| 'lg'`, default `'md'`), `color` (default brand), `thickness`, `label`.

`LoadingOverlay`: `visible`, `label`, `blur` (default `true`).

`WebbaLoader`: Webba "W" logo animation. Props: `size` (default `40`), `color`, `duration` (default `2`), `complete`.

`WebbaThinking`: thinking indicator with optional label. Props: `size`, `color`, `label`.

### `SplashScreen`, `LogoSplash`, `MinimalSplash`, `BrandedSplash`

Full-screen branded loaders.

`SplashScreen`: `visible`, `variant` (`'powered-by' \| 'made-with' \| 'built-with' \| 'custom'`), `brandName`, `brandLogo`, `customText`, `backgroundColor`, `textColor`, `onComplete`, `duration`.

`LogoSplash`: `visible`, `backgroundColor`, `textColor`, `onComplete`, `loadingCycles`, `holdTime`.

`MinimalSplash`, `BrandedSplash`: variant presets, same baseline props.

### `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTable`, `SkeletonAvatarGroup`, `SkeletonStatCard`

Loading placeholders that match real content shape.

`Skeleton`: `width`, `height`, `variant` (`'text' \| 'circular' \| 'rectangular' \| 'rounded'`), `animation` (`'pulse' \| 'wave' \| 'none'`).

`SkeletonText`: `lines` (default `3`), `spacing` (default `8`).
`SkeletonCard`: card-shaped skeleton.
`SkeletonTable`: `rows` (default `5`), `columns` (default `4`).
`SkeletonAvatarGroup`: `count` (default `3`), `size` (default `32`).
`SkeletonStatCard`: stat-card shaped skeleton.

## Data display

### `Table`
Full-featured data table.

| Prop | Type | Default |
|---|---|---|
| `data` | `T[]` | required |
| `columns` | `TableColumn<T>[]` | required |
| `keyField` | `keyof T` | `'id'` |
| `title`, `subtitle` | `string` | |
| `searchable` | `boolean` | `true` |
| `searchPlaceholder` | `string` | |
| `searchKeys` | `(keyof T)[]` | all string fields |
| `filters` | `TableFilter[]` | |
| `activeFilters` | `Record<string, string>` | |
| `onFilterChange` | `(key, value) => void` | |
| `selectable` | `boolean` | `false` |
| `selectedKeys` | `string[]` | |
| `onSelectionChange` | `(keys) => void` | |
| `sortable` | `boolean` | `true` |
| `defaultSort` | `{ key, direction }` | |
| `pagination` | `boolean` | `true` |
| `pageSize` | `number` | `10` |
| `striped`, `compact`, `stickyHeader`, `noPadding` | `boolean` | |
| `loading` | `boolean` | `false` |
| `emptyMessage`, `emptyIcon` | | |
| `globalActions` | `ReactNode` | |
| `rowActions` | `(row: T) => DropdownItem[]` | |
| `bulkActions` | `(selectedKeys) => ReactNode` | |
| `onRowClick` | `(row: T) => void` | |

### `SimpleTable`
Static table.

Props: `headers: string[]`, `rows: ReactNode[][]`, `compact`.

### `Avatar`, `AvatarStack`, `AvatarGroup`, `AvatarCard`, `AvatarList`

`Avatar`: `name?`, `src?`, `size?: 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` (default `'md'`), `color?`, `icon?`, `status?: 'online' \| 'offline' \| 'away' \| 'busy'`, `onClick?`.

`AvatarStack`: `users: { name?, src?, status? }[]`, `max?` (default `4`), `size?: 'xs' \| 'sm' \| 'md' \| 'lg'` (default `'sm'`), `onClick?`.

`AvatarGroup`: inline row plus label. `users: { name?, src? }[]`, `label?: string`, `max?: number` (default `3`). Internally renders an `AvatarStack` with fixed `size="xs"`.

`AvatarCard`: `name: string` (required), `src?`, `subtitle?`, `status?: 'online' \| 'offline' \| 'away' \| 'busy'`, `size?: 'sm' \| 'md' \| 'lg'`, `onClick?`, `actions?: ReactNode`.

`AvatarList`: `users: { name: string; src?; subtitle?; status? }[]`, `size?: 'sm' \| 'md' \| 'lg'` (default `'md'`), `onUserClick?: (user, index) => void`.

### `Badge`, `StatusBadge`, `PriorityBadge`, `CountBadge`

`Badge`: `variant?: 'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` (default `'default'`), `size?: 'sm' \| 'md' \| 'lg'` (default `'md'`), `dot?`, `onClose?`, `onClick?`.

`StatusBadge`: `status: 'active' \| 'inactive' \| 'pending' \| 'completed' \| 'error' \| 'draft'` (required), `label?: string`, `onClick?: () => void`. The status drives the underlying `Badge` variant and default label (e.g. `'active'` uses `success`, `'pending'` uses `warning`).

`PriorityBadge`: `priority: 'low' \| 'medium' \| 'high' \| 'urgent'` (required), `onClick?`. Low uses `default`, medium uses `info`, high uses `warning`, urgent uses `error`.

`CountBadge`: `count: number` (required), `max?: number` (default `99`). Renders `null` when `count <= 0`. Values above `max` display as `${max}+`.

### `Timeline`, `ActivityTimeline`

`Timeline`: `items: TimelineItem[]` (required), `variant?: 'default' \| 'compact' \| 'alternate'` (default `'default'`), `showConnector?` (default `true`), `color?` (default `var(--brand-primary)`).

`TimelineItem`: `id`, `title`, `description?`, `date?`, `time?`, `icon?`, `color?`, `status?: 'completed' \| 'current' \| 'upcoming'`, `actions?`, `onClick?`.

`ActivityTimeline`: compact activity-feed variant. Props: `items: ActivityItem[]` (required), `maxItems?: number` (slice to first N).

### `Accordion`, `AccordionItem`, `Collapsible`, `FAQAccordion`, `CollapsibleCard`

`Accordion`: `children` (AccordionItem list), `defaultExpanded?: string \| string[]`, `multiple?: boolean` (default `false`), `onChange?: (expanded: string[]) => void`.

`AccordionItem`: `id` (required), `title` (required), `subtitle?`, `icon?`, `children` (required), `disabled?`, `badge?: ReactNode`.

`Collapsible`: single collapsible block. Props: `title`, `defaultOpen?`, `children`.

`FAQAccordion`: data-driven accordion. Props: `items: { q, a }[]`.

`CollapsibleCard`: card with a collapsible body.

### `TreeView`, `FileTree`

`TreeView`: `data: TreeNode[]`, `defaultExpanded: string[]`, `defaultSelected: string[]`, `onSelect: (node) => void`, `onExpand: (id, expanded) => void`, `selectable`, `multiple`, `checkable`, `onCheck: (ids) => void`, `showLines`, `size` (`'sm' \| 'md'`).

`FileTree`: presets `showLines={true}` and `size="sm"`.

### `Calendar`, `MiniCalendar`

`Calendar`: `events: CalendarEvent[]`, `selectedDate`, `onDateSelect: (date) => void`, `onEventClick`, `onDateDoubleClick`, `defaultView` (`'month' \| 'week' \| 'agenda'`), `showViewToggle`, `showNavigation`, `minDate`, `maxDate`, `weekStartsOn` (`0 = Sunday \| 1 = Monday`), `locale`, `renderEvent`, `renderDayContent`, `color`.

`CalendarEvent`: `id`, `title`, `date`, `endDate?`, `color?`, `icon?`, `allDay?`, `time?`, `data?`.

`MiniCalendar`: small date picker. Props: `selectedDate?`, `onDateSelect?: (date) => void`, `events?: { date: Date \| string; color? }[]`, `weekStartsOn?: 0 \| 1`, `locale?: string`, `color?: string`.

### `Descriptions`, `DescriptionList`

`Descriptions`: `items: DescriptionItem[]`, `title`, `columns` (`1 \| 2 \| 3 \| 4`, default `2`), `layout` (`'horizontal' \| 'vertical'`, default `'horizontal'`), `bordered` (default `true`), `size` (`'sm' \| 'md' \| 'lg'`), `labelWidth`, `colon` (default `true`).

`DescriptionItem`: `label`, `value`, `span?`.

`DescriptionList`: dl-style list. Props: `items: { label, value }[]`, `direction` (`'horizontal' \| 'vertical'`), `gap`.

### `SortableList`, `SimpleSortableList`

`SortableList`: `items: SortableItem[]`, `onReorder`, `onRemove`, `renderItem`, `handle` (default `true`), `removable` (default `false`), `disabled`, `gap`.

`SimpleSortableList`: `items: string[]`, `onReorder`, `onRemove`, `removable`, `disabled`.

## Charts

<a id="charts-decision"></a>
**Pick:**
- `LineChart`: single time series (one metric over time).
- `MultiLineChart`: compare two or more series on the same axis (portfolio vs benchmark).
- `StackedAreaChart`: share-of-total over time (allocation drift, cohort mix). Pass `normalize` for percent mode.
- `BarChart` / `GroupedBarChart`: categorical comparisons (revenue by region, plan adoption).
- `StackedBar`: single horizontal breakdown of a total (asset mix, capacity by team).
- `DonutChart`: share-of-total at one moment, fewer than 6 segments.
- `Sparkline`: inline trend in a row or KPI tile, no axes.
- `ProgressRing`: single percent value (quota, completion).
- `ChartLegend`: drop next to any chart that ships without an opinionated legend.
- Avoid: a third-party chart lib for any of the above; reach out only when none fit.

### `BarChart`, `GroupedBarChart`

`BarChart`: `data: ChartDataPoint[]`, `height` (default `180`), `showLabels` (default `true`), `showValues` (default `true`), `animated` (default `true`), `horizontal` (default `false`), `color` (default brand), `barRadius` (default `6`).

`GroupedBarChart`: clustered bars. Props: `data: GroupedBarDataPoint[]`, `series: { name: string; color: string }[]`, `height` (default `200`), `showLabels`, `showValues`, `animated`, `horizontal`, `barRadius` (default `4`), `showLegend`.

### `LineChart`, `MultiLineChart`

`LineChart`: `data: number[]` (required), `labels?: string[]`, `width?: number \| string`, `height?: number`, `color?`, `fillColor?`, `showDots?`, `animated?`, `smooth?`, `showTooltip?`, `showGrid?`, `gridLines?: number`, `showYLabels?`, `showXLabels?`.

`MultiLineChart`: `series: LineSeriesData[]` (required), `labels?`, `width?`, `height?`, `showDots?`, `animated?`, `smooth?`, `showLegend?`, `showArea?`, `showGrid?`, `gridLines?`, `showYLabels?`, `showXLabels?`.

### `DonutChart`, `Sparkline`, `ProgressRing`

`DonutChart`: `data: ChartDataPoint[]` (required), `size?: number` (default `160`), `thickness?: number` (default `24`), `animated?` (default `true`), `showLegend?` (default `true`), `legendBelow?: boolean`, `centerContent?: ReactNode`. `centerContent` is anchored to the donut SVG bounds (size × size), so it stays centred regardless of `legendBelow` or surrounding layout. For a legend below the donut, prefer `showLegend={false}` + a separate `<ChartLegend>` underneath. Gives more control over the value column.

`Sparkline`: `data: number[]` (required), `width?` (default `120`), `height?` (default `36`), `color?`, `trend?: 'up' \| 'down' \| 'neutral'`, `showTooltip?` (default `false`), `labels?: string[]`, `valueFormatter?: (value, index) => string`. With `showTooltip` the cursor snaps to the nearest data point and shows a small mono tooltip; pass `labels` (one per data point) to add an axis annotation, e.g. a date.

`ProgressRing`: `value: number` (0-100, required), `size?` (default `90`), `thickness?` (default `10`), `color?` (default brand), `showLabel?` (default `true`), `animated?` (default `true`), `label?: string`.

### `StackedAreaChart`

Stacked filled areas over time. Same prop conventions as `MultiLineChart`. Use it for allocation drift, cohort share of total, revenue by segment.

`StackedAreaChart`: `series: { name, data: number[], color }[]` (required), `labels?: string[]`, `height?` (default `240`), `normalize?: boolean` (default `false`, set `true` for percent-of-100 mode), `animated?`, `showGrid?` (default `true`), `gridLines?` (default `4`), `showXLabels?`, `showYLabels?`, `showTooltip?` (default `true`), `valueFormatter?: (value) => string`.

```tsx
<StackedAreaChart
  series={[
    { name: 'Equities', data: equities, color: 'var(--brand-primary)' },
    { name: 'Crypto',   data: crypto,   color: '#C8951E' }
  ]}
  labels={months}
  normalize
  showXLabels
  showTooltip
/>
```

### `StackedBar`

Single horizontal bar with multiple coloured segments. Distinct from the vertical `BarChart` (one bar per category): `StackedBar` shows a single breakdown like asset mix, plan distribution, capacity by team. Percent-based by default.

`StackedBar`: `data: ChartDataPoint[]` (required), `height?` (default `12`), `showLegend?` (default `true`), `animated?` (default `true`), `valueFormatter?: (value, total) => string`, `showTooltip?` (default `true`).

```tsx
<StackedBar
  data={[
    { label: 'Equities', value: 812000, color: 'var(--brand-primary)' },
    { label: 'Crypto',   value: 209000, color: '#C8951E' },
    { label: 'Cash',     value: 175000, color: 'var(--text-muted)' }
  ]}
  height={12}
/>
```

### `ChartLegend`

Reusable legend with colour swatch + label + optional mono value pill. Use it next to any chart that doesn't ship its own legend, or when you want a separate legend with custom layout.

`ChartLegend`: `items: { color, label, value?, shape? }[]` (required), `layout?: 'row' \| 'column'` (default `'row'`), `gap?: number`. Item `shape?: 'square' \| 'dot' \| 'dash'` (default `'square'`; `'dash'` renders as a dashed horizontal rule, ideal for a benchmark reference).

```tsx
<ChartLegend items={[
  { color: 'var(--brand-primary)', label: 'Portfolio' },
  { color: 'var(--color-error)',   label: 'S&P 500', shape: 'dash' }
]} />
```

### `KpiCard`

Lightweight dashboard tile: small uppercase label + big mono value + optional delta line + optional inline sparkline. Distinct from `StatCard` (icon-led larger tile with `change: number` auto-formatting): `KpiCard` accepts pre-formatted strings or React nodes for `value` / `delta`, plus a raw sparkline `number[]`. Use it for KPI strips on dashboards.

`KpiCard`: `label: ReactNode` (required), `value: ReactNode` (required), `delta?: { text, tone?: 'up' \| 'down' \| 'flat' \| 'brand' }`, `sparkline?: number[]`, `sparkColor?: string`, `sparkWidth?: number`, `sparkHeight?: number`, `hoverable?` (default `true`), `padding?: 'sm' \| 'md' \| 'lg'` (default `'md'`), `onClick?`. Tone drives both the delta colour and the sparkline stroke (defaults to brand if no tone).

```tsx
<KpiCard
  label="Net worth"
  value="$1,247,832"
  delta={{ text: '+11.40%', tone: 'up' }}
  sparkline={netWorthSeries}
/>
```

## Media

### `ImageGallery`, `ImageTile`, `Lightbox`, `ImagePreview`

`ImageGallery`: `images: GalleryImage[]` (required), `columns?: 2 \| 3 \| 4 \| 5` (default `3`), `gap?: number` (default `8`), `aspectRatio?: 'square' \| '4/3' \| '16/9' \| 'auto'` (default `'square'`), `rounded?: boolean` (default `true`).

`ImageTile`: `src` (required), `alt?`, `aspectRatio?: string` (default `'1 / 1'`), `rounded?` (default `true`), `onClick?`, `selected?`, `size?: 'sm' \| 'md' \| 'lg'` (default `'md'`).

`Lightbox`: `images: GalleryImage[]` (required), `currentIndex: number` (required), `onClose: () => void` (required), `onNavigate: (index: number) => void` (required).

`ImagePreview`: inline preview with zoom/pan. Props: `src` (required), `alt?`, `width?: number \| string` (default `'100%'`), `height?: number \| string`, `aspectRatio?: string`, `rounded?: boolean` (default `true`).

### `Carousel`, `CarouselSlide`, `ImageCarousel`

`Carousel`: `children` (slides), `variant?: 'default' \| 'plain'` (default `'default'`), `autoPlay?`, `interval?: number` (default `5000`), `showArrows?`, `showDots?`, `showProgress?`, `infinite?`, `pauseOnHover?`, `slidesToShow?: number`, `gap?: number`.

`CarouselSlide`: container for a single slide. Props: `children`, `className?`, `style?`.

`ImageCarousel`: image-first carousel. Separate shape (not `GalleryImage[]`).

Props: `images: { src: string; alt?: string; caption?: string }[]` (required), `aspectRatio?: string`, `autoPlay?`, `interval?: number`, `showCaptions?`, `showDots?`, `showProgress?`.

### `VideoPlayer`
Full-featured video player.

Props: `src` (required), `poster?`, `autoPlay?`, `muted?`, `loop?`, `controls?`, `width?: number \| string`, `height?: number \| string`, `onPlay?`, `onPause?`, `onEnded?`, `onTimeUpdate?: (currentTime, duration) => void`.

### `AudioPlayer`, `MiniAudioPlayer`

`AudioPlayer`: `src` (required), `title?`, `artist?`, `cover?`, `autoPlay?`, `loop?`, `showVolume?`, `onPlay?`, `onPause?`, `onEnded?`, `onTimeUpdate?: (currentTime, duration) => void`.

`MiniAudioPlayer`: leaner variant, not a superset. Props: `src` (required), `title?`, `onPlay?`, `onPause?`.

## Code

### `CodeBlock`, `InlineCode`, `CodeDiff`

`CodeBlock`: `code` (string), `language` (default `'javascript'`), `showLineNumbers` (default `true`), `copyable` (default `true`), `showLanguage` (default `true`), `title`, `highlightLines: number[]`, `maxHeight`.

`InlineCode`: `children` (string), `copyable` (default `false`).

`CodeDiff`: `oldCode`, `newCode`, `language`, `showLineNumbers`.

## Utilities

### `Watermark`
Tiled background watermark. Props: `text`, `fontSize` (default `16`), `color`, `opacity` (default `0.15`), `rotate` (default `-22`), `gap: [x, y]` (default `[100, 100]`).

### `Highlight`
Search-match highlighter. Props: `text`, `query`, `highlightColor`, `highlightBg`, `caseSensitive`.

### `TextTruncate`
Show more / show less truncation.

Props: `text`, `maxLines` (default `3`), `maxLength`, `expandLabel` (default `'Voir plus'`), `collapseLabel` (default `'Voir moins'`).

Source strings are French by default. Pass `expandLabel`/`collapseLabel` for localized UIs.

### `CopyText`
Inline text with copy-on-click.

### `QuoteBox`
Styled blockquote.

Props: `children`, `author`, `source`.

### `ChatBox`, `MiniChat`

`ChatBox`: full chat surface.

Props: `messages: ChatMessage[]` (required), `onSend: (content: string) => void` (required), `onAttach?: () => void`, `title?`, `subtitle?`, `avatar?: ReactNode`, `placeholder?: string`, `loading?: boolean`, `typing?: boolean`, `typingName?: string`, `height?: number \| string`, `headerActions?: ReactNode`.

`MiniChat`: compact chat widget with the same message/send shape.

`ChatMessage`: `id`, `content`, `sender: 'user' \| 'assistant' \| 'system'`, `timestamp: Date`, `status?: 'sending' \| 'sent' \| 'delivered' \| 'read'`, `avatar?: string`, `name?: string`, `attachments?: { name, url, type }[]`.

### `TimeAgo`

Live-updating relative time display. Auto-ticks every second for recent dates, every minute for 1h+, every hour beyond that.

Props: `date: Date \| string \| number` (required), `labels?: TimeAgoLabels`, `interval?: number` (override auto-refresh in ms), `showTitle?: boolean` (default `true`, shows absolute date on hover), `className?`, `style?`.

Also exported: `useTimeAgo(date, labels?, interval?)` hook and `formatTimeAgo(date, labels?, now?)` pure function for one-off formatting.

`TimeAgoLabels`: every string is overridable. Defaults: `now='just now'`, `secondsAgo=(n)=>'${n}s ago'`, etc. Future dates use `in 5m`, `tomorrow`, etc.

### `ErrorBoundary`

React error boundary with a styled default fallback. Catches errors thrown during render in descendants.

Props: `children` (required), `fallback?: (error, reset) => ReactNode`, `onError?: (error, info) => void`, `resetKeys?: unknown[]` (auto-reset when any value changes).

Does not catch errors in event handlers or async callbacks. For those, use try/catch.

### `VirtualList`

Windowed list for large datasets. Only rows inside the viewport (plus `overscan`) are mounted.

Props: `items: T[]` (required), `renderItem: (item, index) => ReactNode` (required), `itemHeight: number \| (index) => number` (required), `height?: number \| string` (default `400`), `overscan?: number` (default `5`), `keyExtractor?: (item, index) => string | number`, `empty?: ReactNode`, `onScroll?: (scrollTop) => void`.

Supports fixed and variable row heights. For variable heights, expect a brief layout pass on first render.

### `Countdown`, `Timer`, `SimpleCountdown`, `PomodoroTimer`

`Countdown`: `targetDate: Date`, `onComplete`, `showDays`, `showHours`, `showMinutes`, `showSeconds` (default all `true`), `labels: { days, hours, minutes, seconds }`, `size` (`'sm' | 'md' | 'lg'`), `variant` (`'default' | 'compact' | 'cards'`).

`Timer`: `initialSeconds` (default `0`), `autoStart`, `countDown`, `onComplete`, `onTick`, `showControls` (default `true`), `size`.

`SimpleCountdown`: `seconds`, `onComplete`, `autoStart` (default `true`).

`PomodoroTimer`: work/break cycle timer with built-in controls.

## Hooks

### Theme
- `useForge()`: returns the full theme context (see [theming.md](theming.md))

### Responsive
- `useIsMobile()`, `useIsTablet()`, `useIsDesktop()`: boolean
- `useBreakpoint()`: current `Breakpoint` key
- `useWindowSize()`: `{ width, height }`
- `useMediaQuery(query)`: boolean
- `useResponsiveValue(values)`: resolves a `ResponsiveValue` to a scalar
- `useResponsiveOverride()`, `ResponsiveOverrideProvider`: override viewport for previews

### Forms / data
- `useStepper()`: inside a `Stepper`, exposes navigation
- `useContextMenu()`: open a context menu imperatively
- `useToast()`, `useNotification()`: feedback APIs
- `useTour(key)`: onboarding tour state
- `useCookieConsent()`: GDPR consent state
- `useAssistant(config)`: AI assistant context for `CommandBar`
- `useNavigation()`: shared navigation state

### Interaction
- `useDraggableScroll()`: returns `{ containerRef, isDragging, handlers }` for drag-to-scroll containers
- `useKeyboardShortcut(keys, handler, options?)`: register a shortcut. Keys like `'Mod+K'` (Cmd on mac, Ctrl elsewhere), `'Escape'`, `'Ctrl+Shift+P'`, or array for multiple. Options: `enabled`, `ignoreInput`.

### Utilities
- `useDebounce(value, delay)`: debounced value
- `useThrottle(value, interval)`: throttled value
- `useLocalStorage(key, initial)` / `useSessionStorage(key, initial)`: `[value, set, remove]`, synced across tabs
- `useClickOutside(ref, handler)`: handler fires on clicks outside `ref.current`
- `usePrevious(value)`: previous-render value

### Motion
- `useReducedMotion()`: boolean
- Plus all hooks documented in [motion.md](motion.md)

## Constants and utilities

Import from `'wss3-forge'`:

- Design tokens: `SHADOWS`, `Z_INDEX`, `COLORS`, `AVATAR_COLORS`, `STATUS_COLORS`, `CHART_COLORS`, `SYNTAX_COLORS`, `PRESET_COLORS`, `PROJECT_COLORS`, `COUNTRIES`
- Spacing: `SPACING`, `SPACING_SEMANTIC`, `resolveSpacing(value)`
- Breakpoints: `BREAKPOINTS`
- Motion: `DURATIONS`, `EASINGS`, `SPRINGS`, `MOTION_SCALES`, `resolveDuration`, `resolveEasing`, `resolveSpring`, `spring`, `springPreset`, `springMulti`, `dampedLerp`, `lerp`, `clamp`, `phase`
- Typing: `ButtonSize`, `ButtonVariant`, `BadgeVariant`, `Breakpoint`, `ResponsiveValue`, `SpacingKey`, `SpacingSemantic`, `SpacingValue`, `ZIndexKey`, `ColorKey`, `StatusColor`, `ShadowSize`, `ShadowHardness`, `ForgeTheme`, `ThemeMode`, `Size`, `Status`, `Priority`, `ProjectColor`, `ThemeColor`
- Types for records: `NavItem`, `NavSection`, `NavbarItem`, `BreadcrumbItem`, `StepItem`, `TimelineItem`, `ActivityItem`, `FooterLink`, `FooterSection`, `TOCItem`, `TableColumn`, `TableProps`, `TableFilter`, `ComboboxOption`, `CascaderOption`, `CalendarEvent`, `SegmentedOption`, `ToolbarItem`, `SortableItem`, `ChatMessage`, `Country`, `UploadedFile`, `TourStep`, `DropdownItem`, `DropdownCategory`, `GalleryImage`, `TreeNode`, `MentionUser`, `MentionData`, `DescriptionItem`, `NotificationData`, `NotificationType`, `ToastData`, `ToastType`, `FormRule`, `AIResponse`, `SearchResult`

## Where to go next

- Design tokens in CSS var form: [tokens.md](tokens.md)
- Theming and `ForgeProvider`: [theming.md](theming.md)
- Motion library: [motion.md](motion.md)
- Composition patterns: [patterns.md](patterns.md)
- Hard rules and design rationale: [design.md](design.md)
