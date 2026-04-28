# Patterns

Common compositions using Forge. Every example compiles against the current public API. Copy and adapt.

## Recipes (by outcome)

Outcome-indexed recipes. Each snippet is compile-ready against the current API. Pick by what the user wants to ship, not by component name.

<a id="auth"></a>
### Auth: login + signup + forgot-password

One `AuthLayout` shape. Swap fields per route. `Form` handles validation, `Divider` separates the social option, `Button variant="link"` for the route switches.

```tsx
import { Card, VStack, Heading, Text, Form, FormField, FormActions, Input, PasswordInput, Button, Divider } from 'wss3-forge'

type Mode = 'login' | 'signup' | 'forgot'

export function AuthScreen({ mode, onSwitch, onSubmit }: { mode: Mode; onSwitch: (m: Mode) => void; onSubmit: (v: any) => void }) {
  const title = mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Reset password'
  return (
    <div style={{ minHeight: 'var(--block-fill-height, 100vh)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
      <Card variant="elevated" padding="xl" style={{ width: '100%', maxWidth: 420 }}>
        <VStack gap="lg">
          <Heading level={2} align="center">{title}</Heading>
          <Form onSubmit={onSubmit} initialValues={{ email: '', password: '', name: '' }}>
            {mode === 'signup' && (
              <FormField name="name" rules={{ required: 'Required' }}><Input label="Name" /></FormField>
            )}
            <FormField name="email" rules={{ required: 'Required', pattern: { value: /.+@.+/, message: 'Invalid email' } }}>
              <Input label="Email" type="email" />
            </FormField>
            {mode !== 'forgot' && (
              <FormField name="password" rules={{ required: 'Required', minLength: { value: 8, message: 'At least 8 characters' } }}>
                <PasswordInput label="Password" />
              </FormField>
            )}
            <FormActions><Button type="submit" fullWidth>{title}</Button></FormActions>
          </Form>
          {mode !== 'forgot' && (<><Divider label="or" /><Button variant="outline" fullWidth>Continue with Google</Button></>)}
          <VStack gap="xs" align="center">
            {mode === 'login' && <Button variant="link" onClick={() => onSwitch('forgot')}>Forgot password?</Button>}
            {mode === 'login'  && <Button variant="link" onClick={() => onSwitch('signup')}>Create an account</Button>}
            {mode !== 'login'  && <Button variant="link" onClick={() => onSwitch('login')}>Back to sign in</Button>}
          </VStack>
        </VStack>
      </Card>
    </div>
  )
}
```

<a id="auth-forgot"></a>
The same component covers forgot-password by passing `mode="forgot"`. The layout, validation, and route switches stay consistent across all three flows.

<a id="settings"></a>
### Settings: profile + billing + team

`Tabs` switches between sections; each tab owns one `Form`. Keep the chrome stable so the user does not lose their place.

```tsx
import { Card, Tabs, VStack, Form, FormField, FormActions, Input, Button, Table, Badge } from 'wss3-forge'

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing' },
  { id: 'team',    label: 'Team' }
]

export function SettingsPage() {
  const [active, setActive] = useState('profile')
  return (
    <Card padding="lg">
      <VStack gap="lg">
        <Tabs items={tabs} value={active} onChange={setActive} />
        {active === 'profile' && (
          <Form onSubmit={save} initialValues={{ name: '', email: '' }}>
            <FormField name="name" rules={{ required: 'Required' }}><Input label="Display name" /></FormField>
            <FormField name="email"><Input label="Email" type="email" /></FormField>
            <FormActions><Button type="submit">Save changes</Button></FormActions>
          </Form>
        )}
        {active === 'billing' && (
          <Form onSubmit={save} initialValues={{ company: '', vat: '' }}>
            <FormField name="company"><Input label="Company" /></FormField>
            <FormField name="vat"><Input label="VAT number" /></FormField>
            <FormActions><Button type="submit">Update billing</Button></FormActions>
          </Form>
        )}
        {active === 'team' && (
          <Table data={members} columns={teamCols} keyField="id" searchable />
        )}
      </VStack>
    </Card>
  )
}
```

<a id="marketing"></a>
### Marketing: hero + pricing strip + testimonials

Compose `PageSection` + `Hero` content + `PricingCard` strip + a row of testimonial `Card`s. No custom section wrappers.

```tsx
import { PageSection, VStack, HStack, Heading, Text, Button, Pills, PricingCard, Grid, Card, Avatar } from 'wss3-forge'

export function MarketingPage() {
  const [period, setPeriod] = useState('monthly')
  return (
    <>
      <PageSection size="xl">
        <VStack gap="lg" align="center">
          <Heading level={1} align="center">Ship faster, with restraint</Heading>
          <Text size="lg" color="secondary" align="center">A polished design system for product teams who want to focus on the work.</Text>
          <Button size="lg">Get started</Button>
        </VStack>
      </PageSection>
      <PageSection id="pricing" size="lg" tone="subtle">
        <VStack gap="xl" align="center">
          <Pills selected={period} onChange={setPeriod} options={[{ id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly, save 20%' }]} />
          <Grid columns={{ xs: 1, md: 3 }} gap="lg">
            {tiers.map(t => <PricingCard key={t.tier} {...t} price={period === 'yearly' ? t.yearly : t.monthly} />)}
          </Grid>
        </VStack>
      </PageSection>
      <PageSection size="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          {quotes.map(q => (
            <Card key={q.author} padding="lg" variant="outlined">
              <VStack gap="md">
                <Text>{q.text}</Text>
                <HStack gap="sm" align="center">
                  <Avatar src={q.avatar} name={q.author} />
                  <VStack gap="xs"><Text weight="medium">{q.author}</Text><Text size="sm" color="muted">{q.role}</Text></VStack>
                </HStack>
              </VStack>
            </Card>
          ))}
        </Grid>
      </PageSection>
    </>
  )
}
```

<a id="data"></a>
### Data: table-with-filters + master-detail + kanban

`Table` for the list, `Sheet` for the row detail, `SortableList` per column for the kanban board.

```tsx
import { Card, Table, Sheet, VStack, HStack, Heading, Text, Badge, SortableList } from 'wss3-forge'

// table + master-detail
const cols = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'owner', header: 'Owner' },
  { key: 'status', header: 'Status', render: (r: Row) => <Badge variant={r.status === 'open' ? 'success' : 'default'}>{r.status}</Badge> }
]

export function DataScreen() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = rows.find(r => r.id === openId) ?? null
  return (
    <>
      <Card padding="none">
        <Table data={rows} columns={cols} keyField="id" searchable pagination filters={[{ key: 'status', label: 'Status', options: ['open', 'closed'] }]} onRowClick={(r) => setOpenId(r.id)} />
      </Card>
      <Sheet open={!!open} onClose={() => setOpenId(null)} position="right" size="md" title={open?.name}>
        {open && <VStack gap="md"><Text color="muted">Owner</Text><Text>{open.owner}</Text></VStack>}
      </Sheet>
    </>
  )
}

// kanban (one SortableList per column)
export function Kanban({ columns, onMove }: KanbanProps) {
  return (
    <HStack gap="lg" align="start">
      {columns.map(col => (
        <Card key={col.id} padding="md" style={{ flex: 1, minWidth: 280 }}>
          <VStack gap="md">
            <Heading level={5}>{col.title}</Heading>
            <SortableList items={col.items} keyField="id" onReorder={(items) => onMove(col.id, items)} renderItem={(item) => (
              <Card padding="sm" variant="raised"><Text>{item.title}</Text></Card>
            )} />
          </VStack>
        </Card>
      ))}
    </HStack>
  )
}
```

<a id="triad"></a>
### Empty / error / loading triad

One card slot covers all three states. The shape stays identical so the page does not jump.

```tsx
import { Card, EmptyState, Banner, Spinner, VStack, Button } from 'wss3-forge'
import { BoxDismiss24Regular } from '@fluentui/react-icons'

export function ListSlot({ status, items, onRetry, onCreate }: SlotProps) {
  if (status === 'loading') {
    return <Card padding="xl"><VStack align="center" gap="md"><Spinner size="lg" label="Loading" /></VStack></Card>
  }
  if (status === 'error') {
    return <Card padding="xl"><Banner variant="error" title="Something went wrong" action={{ label: 'Retry', onClick: onRetry }}>We could not load this list. Try again.</Banner></Card>
  }
  if (items.length === 0) {
    return <Card padding="xl"><EmptyState icon={<BoxDismiss24Regular />} title="No projects yet" description="Create your first project to get started." action={{ label: 'New project', onClick: onCreate }} /></Card>
  }
  return <ListView items={items} />
}
```

<a id="docs"></a>
### Docs site (Navbar + AppSidebar + main + TOC)

The canonical docs layout used by Forge's own docs, Mantine, Shadcn, Tailwind, MDN. Three zones below a top `Navbar`:

1. `Navbar` at the top, full width, persists across the whole site (landing AND docs). Carries the brand wordmark, primary nav, right-side actions.
2. `AppSidebar` on the left of the docs subtree. Fixed to the viewport (full height under the Navbar, never overlaps it). Sectioned nav of pages. **No `logo` prop** because the Navbar above already owns the logo.
3. Main content in the middle, with a per-page right-rail `TableOfContents` (also fixed to the viewport edge) for in-page section anchors.

```tsx
// App.tsx: the Navbar lives here so it persists on every route.
import { Routes, Route, Navigate } from 'react-router-dom'

export function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Navigate to="/docs/quick-start" replace />} />
          <Route path=":slug" element={<DocPage />} />
        </Route>
      </Routes>
    </>
  )
}

// DocsLayout.tsx: sidebar on the left, Outlet on the right.
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { AppSidebar } from 'wss3-forge'
import { docsSections } from '../data/docs'

export function DocsLayout() {
  const navigate = useNavigate()
  const { slug } = useParams()

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <AppSidebar
          sections={docsSections}
          value={slug ?? 'quick-start'}
          onNavigate={(id) => navigate(`/docs/${id}`)}
          mode="inline"
          showSearch={false}
          forceDesktop
        />
      </aside>
      <main><Outlet /></main>
    </div>
  )
}
```

Companion CSS (the only place a docs site needs custom styling). The sidebar
and TOC are `position: fixed` so they truly anchor to the viewport and never
pass under the Navbar. The shell reserves room for them via `padding-left`
and `padding-right`, no grid needed:

```css
.docs-shell {
  padding-top: 64px;       /* Navbar height. */
  padding-left: 240px;     /* room for the fixed sidebar. */
  min-height: 100vh;
  box-sizing: border-box;
}
.docs-sidebar {
  position: fixed;
  top: 64px;               /* under the Navbar. */
  left: 0;
  width: 240px;
  height: calc(100vh - 64px);
  border-right: 1px solid var(--border-subtle);
  overflow-y: auto;
  z-index: 10;             /* above page content, below Navbar (z-index 100). */
  background: var(--bg-primary);
  box-sizing: border-box;
}
@media (max-width: 720px) {
  .docs-shell { padding-left: 0; }
  .docs-sidebar { display: none; } /* swap to AppSidebar mode="drawer" + hamburger if needed. */
}

/* DocPage internal layout: content + fixed TOC anchored to the viewport edge. */
.docs-content {
  padding: clamp(2rem, 4vw, 3.5rem) clamp(2rem, 4vw, 4rem);
  padding-right: clamp(260px, 22vw, 300px); /* room for the fixed TOC. */
  max-width: 1080px;
  margin-left: 0;
}
.docs-toc {
  position: fixed;
  top: calc(64px + 32px);
  right: clamp(24px, 4vw, 56px);
  width: 220px;
  max-height: calc(100vh - 64px - 64px);
  overflow-y: auto;
}
@media (max-width: 1100px) {
  .docs-content { padding-right: clamp(2rem, 4vw, 4rem); }
  .docs-toc { display: none; }
}
```

Rules:
- The `Navbar` wraps the whole app at the App level. It does NOT live inside `DocsLayout`. Hoist it one level up so it persists across routes.
- `AppSidebar` does NOT receive a `logo` prop in this pattern. The Navbar above owns the logo. Passing one duplicates the brand mark.
- `TableOfContents` lives inside `DocPage` (the right rail), not inside `DocsLayout`. Each page generates its own TOC from its `<Heading level={2}>` anchors. The right rail is `position: fixed` to the viewport so it truly anchors to the page edge regardless of the article column width or any flex/grid container in between. `position: sticky` collapses inside grids when the parent has no fixed height, which is why fixed wins here.
- The Navbar wordmark links to `/` (the site home). Breadcrumbs inside `DocPage` use `homeHref="/"` so the home crumb also lands on the site home, not on the design system's own home.
- For mobile, swap the inline `AppSidebar` to `mode="drawer"` triggered by a hamburger button in the Navbar's left action slot. Do not redesign the chrome.

## Dashboard (sidebar + content)

Responsive sidebar. Inline on desktop, native drawer on mobile. Never wrap `AppSidebar` in a `Sheet`. Use `mode="drawer"` instead. It ships with overlay, backdrop, Escape, and body-scroll lock.

```tsx
import { useState } from 'react'
import {
  AppSidebar, VStack, HStack, Heading, Text, IconButton, useIsMobile
} from 'wss3-forge'
import { Navigation20Regular } from '@fluentui/react-icons'

const sections = [/* NavSection[] */]

export default function Dashboard() {
  const isMobile = useIsMobile()
  const [active, setActive] = useState('dashboard')
  const [navOpen, setNavOpen] = useState(false)

  const handleNavigate = (id: string) => {
    setActive(id)
    setNavOpen(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {!isMobile && (
        <div style={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start', flexShrink: 0, display: 'flex' }}>
          <AppSidebar
            sections={sections}
            value={active}
            onNavigate={setActive}
            logo={<Text weight="semibold">App</Text>}
            height="100%"
            forceDesktop
          />
        </div>
      )}
      {isMobile && (
        <AppSidebar
          mode="drawer"
          open={navOpen}
          onClose={() => setNavOpen(false)}
          position="left"
          sections={sections}
          value={active}
          onNavigate={handleNavigate}
          logo={<Text weight="semibold">App</Text>}
        />
      )}
      <div style={{ flex: 1, padding: isMobile ? '1rem' : '1.5rem' }}>
        <VStack gap="lg">
          <HStack justify="between" align="center">
            {isMobile && (
              <IconButton icon={<Navigation20Regular />} variant="ghost" size="sm" onClick={() => setNavOpen(true)} />
            )}
            <Heading level={2}>Dashboard</Heading>
          </HStack>
          {/* Content */}
        </VStack>
      </div>
    </div>
  )
}
```

## Dashboard KPI strip + chart card

The canonical multi-page dashboard layout: a row of `KpiCard` tiles, then
chart cards that wrap a Forge `LineChart` / `MultiLineChart` /
`StackedAreaChart` / `DonutChart`, then a `Table` for the data list, with
`Sheet` for row-click detail. Built entirely from Forge primitives, no
custom card / pill / drawer.

```tsx
import {
  Card, Grid, VStack, HStack, Text, Pills,
  KpiCard, LineChart, MultiLineChart, StackedAreaChart, StackedBar,
  DonutChart, ChartLegend, Sparkline, Badge,
  Table, type TableColumn, Sheet
} from 'wss3-forge'

// 1. KPI strip. Never reinvent a "stat tile" with a custom div.
<Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
  <KpiCard
    label="Net worth"
    value="$1,247,832"
    delta={{ text: '+11.40%', tone: 'up' }}
    sparkline={netWorthSeries}
  />
  <KpiCard
    label="MoM change"
    value="+$24,180"
    delta={{ text: '+1.94%', tone: 'up' }}
    sparkline={momSeries}
  />
  {/* ... */}
</Grid>

// 2. Chart card. Forge Card padding="lg" + VStack, never a custom .vlt-chart-card div.
<Card padding="lg">
  <VStack gap="md">
    <HStack justify="between" align="start" wrap gap="md">
      <VStack gap="xs">
        <Text weight="semibold" style={{ fontSize: 17 }}>Portfolio value</Text>
        <Text size="sm" color="secondary">+$120K (+11.4%) over 1Y</Text>
      </VStack>
      <Pills selected={range} onChange={setRange} options={ranges} />
    </HStack>
    <div style={{ height: 320 }}>
      <LineChart
        data={series}
        height={320}
        showTooltip
        showGrid
        showYLabels
        color="var(--brand-primary)"
        fillColor="var(--bg-subtle)"
      />
    </div>
  </VStack>
</Card>

// 3. Multi-line chart with a clean legend (use ChartLegend, not a hand-rolled HStack).
<Card padding="lg">
  <VStack gap="md">
    <HStack justify="between" align="start" wrap gap="md">
      <Text weight="semibold">Portfolio vs S&P 500</Text>
      <ChartLegend items={[
        { color: 'var(--brand-primary)', label: 'Portfolio' },
        { color: 'var(--color-error)',   label: 'S&P 500', shape: 'dash' }
      ]} />
    </HStack>
    <MultiLineChart series={[
      { name: 'Portfolio', data: port, color: 'var(--brand-primary)' },
      { name: 'S&P 500',   data: bench, color: 'var(--color-error)' }
    ]} height={320} showArea showTooltip showLegend={false} />
  </VStack>
</Card>

// 4. Allocation breakdown. StackedBar in a card, never a hand-rolled segmented div.
<Card padding="lg">
  <VStack gap="md">
    <Text weight="semibold">Asset mix</Text>
    <StackedBar
      data={allocation.map(a => ({ label: a.label, value: a.value, color: a.color }))}
      animated
      showLegend
    />
  </VStack>
</Card>

// 5. Allocation drift. StackedAreaChart with normalize for %-of-total.
<StackedAreaChart
  series={[
    { name: 'Equities',     color: 'var(--brand-primary)', data: [...] },
    { name: 'Crypto',       color: '#C8951E',              data: [...] }
  ]}
  labels={months}
  height={260}
  normalize
  showXLabels
  showTooltip
/>

// 6. Donut with the center anchored to the SVG bounds.
<Card padding="lg">
  <VStack gap="lg">
    <Text weight="semibold">Allocation</Text>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <DonutChart
        data={allocation.map(a => ({ label: a.label, value: a.value, color: a.color }))}
        size={240}
        thickness={28}
        showLegend={false}
        centerContent={<>...</>}
      />
    </div>
    {/* Render the legend OUTSIDE the donut for layout clarity. */}
    <ChartLegend items={allocation.map(a => ({ color: a.color, label: a.label, value: '32%' }))} />
  </VStack>
</Card>

// 7. Data list. Forge Table, never a hand-rolled <table>.
const columns: TableColumn<HoldingRow>[] = [
  { key: 'ticker', header: 'Ticker', width: 90, render: (_, r) => <span className="mono">{r.ticker}</span> },
  { key: 'name',   header: 'Name' },
  { key: 'value',  header: 'Value', align: 'right', render: (_, r) => fmtUSD(r.value, 0) },
  { key: 'gain',   header: 'Gain', align: 'right', render: (_, r) => (
    <span style={{ color: r.gain >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
      {fmtSignedUSD(r.gain, 0)}
    </span>
  )}
]

<Card padding="none">
  <Table<HoldingRow>
    data={rows}
    columns={columns}
    keyField="id"
    searchable
    sortable
    pagination
    pageSize={20}
    onRowClick={(row) => setOpenId(row.id)}
  />
</Card>

// 8. Detail drawer. Sheet, never a custom slide panel.
<Sheet open={!!open} onClose={() => setOpenId(null)} position="right" size="md" title={open?.name}>
  {open && <DetailContent row={open} />}
</Sheet>
```

**Spacing rules** (apply across every dashboard page so density stays consistent):
- Card padding: `padding="lg"` on chart cards, `padding="md"` on KPI tiles, `padding="none"` on cards that wrap a `Table`
- KPI strip: `Grid gap="md"`
- Section gap (between rows of cards): `VStack gap="2xl"`
- Inside-card gap (header → chart): `VStack gap="md"`

**Chart sizing rules** (the bit that breaks visually if ignored):
- Hero chart in a card: explicit `height: 320` on the `<div>` wrapping the chart, never `100%` (charts collapse in a flex column)
- Sparkline in `KpiCard`: default 88×36, fits without crushing
- Sparkline in a `Table` row: 80×26
- DonutChart: `size={240}`, `thickness={28}` minimum so segments read
- StackedAreaChart: `height={260}`
- StackedBar: `height={12}`

## Form with validation

`Form` + `FormField` provides built-in validation and error rendering.

```tsx
import { Form, FormField, FormActions, Input, Textarea, Button } from 'wss3-forge'

<Form onSubmit={(values) => console.log(values)} initialValues={{ email: '', message: '' }}>
  <FormField name="email" rules={{ required: 'Email is required', pattern: { value: /.+@.+/, message: 'Invalid email' } }}>
    <Input label="Email" type="email" />
  </FormField>

  <FormField name="message" rules={{ minLength: { value: 10, message: 'At least 10 characters' } }}>
    <Textarea label="Message" rows={4} />
  </FormField>

  <FormActions>
    <Button type="submit">Send</Button>
  </FormActions>
</Form>
```

Without `Form`, individual inputs still expose `label`, `error`, `hint`, `required` so you can manage state yourself.

```tsx
import { Card, VStack, Grid, Heading, Input, Button } from 'wss3-forge'

<Card padding="lg">
  <VStack gap="md">
    <Heading level={3}>Profile</Heading>
    <Grid columns={{ xs: 1, md: 2 }} gap="md">
      <Input label="First name" value={first} onChange={setFirst} />
      <Input label="Last name" value={last} onChange={setLast} />
    </Grid>
    <Input label="Email" type="email" value={email} onChange={setEmail} error={emailError} />
    <Button onClick={save} loading={saving}>Save</Button>
  </VStack>
</Card>
```

## Modal with form

```tsx
import { useState } from 'react'
import { Modal, Button, Input, Textarea, VStack } from 'wss3-forge'

function EditModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <Modal open={open} onClose={onClose} title="New post" size="md">
      <VStack gap="md">
        <Input label="Title" value={title} onChange={setTitle} />
        <Textarea label="Body" value={body} onChange={setBody} autoResize />
      </VStack>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave({ title, body })}>Publish</Button>
      </Modal.Footer>
    </Modal>
  )
}
```

## List with actions

```tsx
import { VStack, HStack, Card, Avatar, Text, Badge } from 'wss3-forge'

<VStack gap="sm">
  {items.map(item => (
    <Card key={item.id} padding="md" hoverable>
      <HStack justify="between" align="center">
        <HStack gap="md" align="center">
          <Avatar src={item.avatar} name={item.name} />
          <VStack gap="xs">
            <Text weight="medium">{item.name}</Text>
            <Text size="sm" color="muted">{item.email}</Text>
          </VStack>
        </HStack>
        <Badge variant={item.active ? 'success' : 'default'}>
          {item.active ? 'Active' : 'Inactive'}
        </Badge>
      </HStack>
    </Card>
  ))}
</VStack>
```

## Page layout (marketing)

Use `PageSection` rather than re-implementing `<section><Container>` boilerplate. `PageSection` already owns responsive vertical padding, the inner `Container`, and the optional accent background.

```tsx
import { PageSection, VStack, Heading, Text, Grid, Card, Button } from 'wss3-forge'

<PageSection size="xl">
  <VStack gap="xl" align="center">
    <VStack gap="md" align="center">
      <Heading level={1} align="center">Ship fast</Heading>
      <Text size="lg" color="secondary" align="center">
        Everything you need to go from idea to production.
      </Text>
      <Button size="lg">Get started</Button>
    </VStack>
  </VStack>
</PageSection>

<PageSection id="features" size="lg" tone="subtle">
  <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="lg">
    {features.map(f => (
      <Card key={f.title} padding="lg" variant="outlined">
        <VStack gap="sm">
          <Heading level={4}>{f.title}</Heading>
          <Text color="muted">{f.description}</Text>
        </VStack>
      </Card>
    ))}
  </Grid>
</PageSection>
```

<a id="pricing"></a>
## Pricing strip with monthly/yearly toggle

`PricingCard` carries the heavy lifting. Toggle the period with `Pills` and swap the `price` prop. Keep the cards stable so the user can scan across tiers.

```tsx
import { useState } from 'react'
import { PageSection, Pills, PricingCard } from 'wss3-forge'

const TIERS = [
  { tier: 'Starter', monthly: 0,  yearly: 0,  features: [...] },
  { tier: 'Team',    monthly: 24, yearly: 19, features: [...], featured: true },
  { tier: 'Scale',   monthly: 96, yearly: 79, features: [...] }
]

const [period, setPeriod] = useState('monthly')

<PageSection id="pricing" size="xl">
  <Pills
    selected={period}
    onChange={setPeriod}
    options={[
      { id: 'monthly', label: 'Monthly' },
      { id: 'yearly',  label: 'Yearly · save 20%' }
    ]}
  />
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
    {TIERS.map(t => (
      <PricingCard
        key={t.tier}
        tier={t.tier}
        price={(period === 'yearly' ? t.yearly : t.monthly) === 0 ? 'Free' : `$${period === 'yearly' ? t.yearly : t.monthly}`}
        period={t.monthly === 0 ? '' : `/ user / month`}
        features={t.features}
        cta={{ label: 'Start trial' }}
        featured={t.featured}
      />
    ))}
  </div>
</PageSection>
```

## Hero KPIs with Counter

Animated count-up gives the hero proof-points motion without distracting from the headline. `Counter` mounts once, no re-animation when the value changes.

```tsx
import { Counter, KpiCard } from 'wss3-forge'

<KpiCard
  label="Active signals"
  value={<Counter value={2847} duration={1100} />}
  delta={{ text: '+12.4% week', tone: 'up' }}
/>
<KpiCard
  label="Spend reclaimed"
  value={<Counter value={184320} duration={1300} format={n => `$${Math.round(n).toLocaleString()}`} />}
  delta={{ text: '+$24K this month', tone: 'up' }}
/>
```

## Logo strip / "trusted by"

`Marquee` with `fadeEdges` is the right call: pure CSS scroll, edges dissolve into the bg, no hard-cropped logos. Keep `pauseOnHover={false}` for a non-interactive logo wall.

```tsx
import { Marquee, PageSection } from 'wss3-forge'

<PageSection size="md">
  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Trusted by teams shipping at speed</p>
  <Marquee duration={42} gap={64} fadeEdges={120} pauseOnHover={false}>
    {LOGOS.map(name => (
      <span key={name} style={{ fontSize: 22, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {name}
      </span>
    ))}
  </Marquee>
</PageSection>
```

## Navbar + hero + content

```tsx
import { Navbar, Container, VStack, Heading, Text, Button } from 'wss3-forge'

const items = [
  { id: 'home', label: 'Home' },
  { id: 'docs', label: 'Docs' },
  { id: 'pricing', label: 'Pricing' }
]

<Navbar
  items={items}
  value="home"
  background="glass"
  scrollFade
  actions={<Button>Sign in</Button>}
/>

<Container maxWidth="lg" py="xl">
  <VStack gap="lg" align="center">
    <Heading level={1}>Welcome</Heading>
    <Text size="lg" color="secondary">Build beautiful apps, fast.</Text>
  </VStack>
</Container>
```

## Empty state

```tsx
import { Card, EmptyState, Button } from 'wss3-forge'
import { BoxDismiss24Regular } from '@fluentui/react-icons'

<Card padding="xl">
  <EmptyState
    icon={<BoxDismiss24Regular />}
    title="No projects yet"
    description="Create your first project to get started."
    action={<Button>New project</Button>}
  />
</Card>
```

## Table with search, filters, and pagination

```tsx
import { Table, Badge, IconButton } from 'wss3-forge'
import { MoreVertical20Regular } from '@fluentui/react-icons'

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'default'}>
        {row.status}
      </Badge>
    )
  }
]

<Table
  data={users}
  columns={columns}
  keyField="id"
  searchable
  pagination
  pageSize={20}
  filters={[{ key: 'role', label: 'Role', options: ['admin', 'editor', 'viewer'] }]}
  rowActions={(row) => [
    { id: 'edit', label: 'Edit', onClick: () => edit(row) },
    { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => remove(row) }
  ]}
/>
```

## Animated entrance

```tsx
import { Motion, Stagger, Card } from 'wss3-forge'

<Stagger stagger={80}>
  {items.map(item => (
    <Card key={item.id} padding="md">{item.title}</Card>
  ))}
</Stagger>
```

Or manual per-item:

```tsx
<Motion
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, threshold: 0.1 }}
  transition={{ duration: 'snappy', easing: 'swift' }}
>
  <Card padding="md">...</Card>
</Motion>
```

## Quality gates per pattern

Before shipping, verify these for each pattern:

- **Dashboard**: mobile drawer closes on navigate (handled by Forge), focus returns to the trigger, sticky sidebar does not block content scroll; `tsc --noEmit` clean.
- **Form with validation**: every field has a `label`; errors go through the `error` prop (not a sibling `<p>`) so `role="alert"` fires; submit button `loading` during async work; no default browser tooltip (`noValidate` or trust Forge messages).
- **Modal with form**: `title` prop set (becomes `aria-label`); Escape and outside click close; focus traps in the modal; focus returns to the trigger on close.
- **List with actions**: row actions reachable by keyboard; `Avatar` has `name`; `Badge variant` matches status semantic (`success` only for actually-good states, `error` for failures).
- **Page layout (marketing)**: hero `Heading level={1}` is the only level-1 on the page; `Container maxWidth` matches the content density; motion respects reduced-motion (automatic via `ForgeProvider`).
- **Navbar + hero + content**: sticky navbar does not cover the main heading on scroll; mobile menu trigger has `aria-label`; actions buttons are not icon-only without `aria-label`.
- **Empty state**: `title` is a verb-first sentence, `description` is actionable; primary action is a `Button`, not a link.
- **Table**: `searchable` and `pagination` enabled for lists over about 50 rows; `keyField` matches a stable unique id; destructive row actions use `variant: 'danger'`; every column `header` is a readable string.
- **Animated entrance**: `whileInView` with `viewport={{ once: true }}` for offscreen content; duration in the `var(--duration-snappy)` to `var(--duration-slow)` range; reduced-motion users get no motion (automatic via `ForgeProvider`).

---

# Block creation

Block templates live under `src/pages/blocks/blocks/{category}/{slug}/`. They are shadcn-style: a multi-file folder with a manifest, a registry entry, and one or more components. The docs site's `/blocks` page previews them and lets users copy the full source.

## Folder structure

```
src/pages/blocks/blocks/{category}/{slug}/
├── _manifest.ts          Exports Component + files array with ?raw imports
├── app/
│   └── page.tsx          Main component (default export, PascalCase)
└── components/           Optional sub-components (use when block > ~150 lines)
    ├── data.ts           Static data (arrays, objects, configs)
    └── {section}.tsx     Sub-components
```

## Categories

`marketing` | `dashboard` | `auth` | `commerce` | `settings` | `content` | `utility`

## Rules for block code

- Import only from `'wss3-forge'` and `'@fluentui/react-icons'`
- Default export must be PascalCase: `export default function PricingTable()`
- Use `useIsMobile()` for responsive behavior
- Use `var(--block-fill-height, 100vh)` instead of `100vh` for full-height layouts so the preview frame can override height
- Never use `<ForgeProvider>` inside a block, the preview system wraps it
- No custom CSS files in a block folder
- When a block exceeds about 150 lines, extract sections into `components/` and keep orchestration in `app/page.tsx`
- `data.ts` is pure data (only type imports from Forge, no component imports)

## Creating a block

1. Create the folder. Block name is kebab-case, category must be one of the valid categories.

   ```bash
   mkdir -p src/pages/blocks/blocks/{category}/{slug}/app
   ```

2. Write `app/page.tsx`:

   ```tsx
   import { Card, VStack, Heading, Text, Button, useIsMobile } from 'wss3-forge'

   export default function MyBlock() {
     const isMobile = useIsMobile()
     return (
       <Card padding="xl" style={{ maxWidth: 420, margin: '0 auto' }}>
         <VStack gap="md">
           <Heading level={3}>Title</Heading>
           <Text color="muted">Body copy.</Text>
           <Button fullWidth={isMobile}>Action</Button>
         </VStack>
       </Card>
     )
   }
   ```

3. Create `_manifest.ts`. Order: `app/page.tsx` first, then `data.ts`/`data.tsx`, then alphabetical components.

   Single-file block:

   ```tsx
   import Component from './app/page'
   import pageSrc from './app/page.tsx?raw'
   import type { BlockFile } from '../../../types'

   export const files: BlockFile[] = [
     { path: 'app/page.tsx', content: pageSrc }
   ]

   export { Component }
   ```

   Multi-file block:

   ```tsx
   import Component from './app/page'
   import pageSrc from './app/page.tsx?raw'
   import dataSrc from './components/data.ts?raw'
   import sectionSrc from './components/section-name.tsx?raw'
   import type { BlockFile } from '../../../types'

   export const files: BlockFile[] = [
     { path: 'app/page.tsx', content: pageSrc },
     { path: 'components/data.ts', content: dataSrc },
     { path: 'components/section-name.tsx', content: sectionSrc }
   ]

   export { Component }
   ```

   The type import path `'../../../types'` is 3 levels up from the manifest.

4. Register in `src/pages/blocks/registry.ts`:

   ```tsx
   import { Component as MyBlock, files as myBlockFiles } from './blocks/{category}/{slug}/_manifest'

   // Add into the allBlocks array:
   {
     id: '{slug}',
     title: 'Human-readable title',
     description: 'One sentence.',
     category: '{category}',
     tags: ['tag1', 'tag2'],
     Component: MyBlock,
     files: myBlockFiles,
     fullBleed: true   // only when the block has its own navbar or sidebar layout
   }
   ```

5. Verify the build:

   ```bash
   npx vite build
   ```

## Auditing blocks

Open any block folder and check:

1. Every folder has `_manifest.ts` with `?raw` imports for ALL source files
2. No custom CSS classes, only inline styles with CSS vars
3. Default export is PascalCase
4. Registered in `registry.ts`
5. No reimplementation of Forge primitives (no custom Card-like `<div style={{...}}>`)
6. `data.ts` stays pure data
7. Manifest file ordering: page first, data second, components alphabetical

Then run `npx vite build` and fix any build failures.

## Existing blocks (20 total)

- **marketing**: `hero-classic`, `hero-split`, `feature-grid`, `cta-banner`, `landing-page`
- **dashboard**: `admin-overview`, `analytics`, `inbox`, `empty-state`
- **auth**: `login-simple`, `login-split`, `register`
- **commerce**: `checkout`, `pricing-3-tier`, `product-listing`
- **content**: `blog-index`, `docs-layout`
- **settings**: `account-settings`, `billing`
- **utility**: `not-found`

## Block composition templates

### Centered card (auth)

```tsx
import { Card, VStack, Input, PasswordInput, Button, Heading } from 'wss3-forge'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: 'var(--block-fill-height, 100vh)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-xl)'
    }}>
      <Card padding="xl" style={{ width: '100%', maxWidth: 420 }}>
        <VStack gap="lg">
          <Heading level={2} align="center">Sign in</Heading>
          <Input label="Email" type="email" />
          <PasswordInput label="Password" />
          <Button fullWidth>Sign in</Button>
        </VStack>
      </Card>
    </div>
  )
}
```

### Split layout (auth / marketing)

```tsx
import { Card, VStack, useIsMobile, Heading, Text, Input, PasswordInput, Button } from 'wss3-forge'

export default function LoginSplit() {
  const isMobile = useIsMobile()
  return (
    <div style={{ display: 'flex', minHeight: 'var(--block-fill-height, 100vh)' }}>
      {!isMobile && (
        <div style={{
          flex: 1,
          backgroundColor: 'var(--brand-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem'
        }}>
          <VStack gap="lg" align="center">
            <Heading level={2} style={{ color: 'white' }}>Welcome back</Heading>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Sign in to continue.</Text>
          </VStack>
        </div>
      )}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '1.5rem' : '3rem'
      }}>
        <Card padding="xl" style={{ width: '100%', maxWidth: 420 }}>
          <VStack gap="md">
            <Input label="Email" type="email" />
            <PasswordInput label="Password" />
            <Button fullWidth>Sign in</Button>
          </VStack>
        </Card>
      </div>
    </div>
  )
}
```

### Feature grid (marketing)

```tsx
import { Container, VStack, Heading, Grid, Card, IconBox, Text } from 'wss3-forge'

export default function FeatureGrid() {
  return (
    <Container maxWidth="lg" py={{ xs: '3rem', md: '5rem' }}>
      <VStack gap="xl" align="center">
        <Heading level={2} align="center">Features</Heading>
        <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="lg">
          {features.map(f => (
            <Card key={f.title} padding="lg" variant="outlined">
              <VStack gap="sm">
                <IconBox color={f.color}>{f.icon}</IconBox>
                <Heading level={4}>{f.title}</Heading>
                <Text color="muted">{f.description}</Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </Container>
  )
}
```
