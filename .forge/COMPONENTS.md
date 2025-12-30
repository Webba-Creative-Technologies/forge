# Forge Design System - Components Reference

> **Version:** 2.0
> **Framework:** React + TypeScript
> **Icons:** Fluent UI 2 (`@fluentui/react-icons`)

---

## Table of Contents

1. [Theming](#theming)
2. [Typography](#typography)
3. [Buttons](#buttons)
4. [Cards & Layout](#cards--layout)
5. [Forms & Inputs](#forms--inputs)
6. [Badges & Tags](#badges--tags)
7. [Navigation](#navigation)
8. [Overlays & Modals](#overlays--modals)
9. [Data Display](#data-display)
10. [Feedback & Loading](#feedback--loading)
11. [Charts](#charts)
12. [Media](#media)
13. [Utilities](#utilities)
14. [Layout Components](#layout-components)
15. [Hooks](#hooks)
16. [CSS Variables](#css-variables)
17. [Installation](#installation)

---

## Theming

### ForgeProvider
Root wrapper to inject the theme.

```tsx
import { ForgeProvider, themes } from './.forge'

<ForgeProvider theme={themes.dark}>
  <App />
</ForgeProvider>
```

### Available Themes

| Theme | Variable | Description |
|-------|----------|-------------|
| `darkTheme` | `themes.dark` | Default dark theme |
| `lightTheme` | `themes.light` | Light theme with purple tint |

### createTheme
Create a custom theme.

```tsx
import { createTheme } from './.forge'

const customTheme = createTheme({
  brandPrimary: '#FF6B6B',
  bgPrimary: '#1a1a2e'
}, 'dark')
```

### useForge
Hook to access the theme.

```tsx
const { theme, isDark, mode } = useForge()
```

### Animate
Entry animation.

```tsx
import { Animate } from './.forge'

<Animate type="fadeIn" delay={100}>
  <Card>...</Card>
</Animate>
```

### Stagger
Cascading animation.

```tsx
import { Stagger } from './.forge'

<Stagger type="slideInUp" stagger={50}>
  {items.map(item => <Card key={item.id} />)}
</Stagger>
```

**Types:** `fadeIn`, `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`, `scaleIn`

---

## Typography

### Heading
Headings h1-h6.

```tsx
import { Heading } from './.forge'

<Heading level={1}>Main Title</Heading>
<Heading level={2} color="muted">Subtitle</Heading>
```

### Text
Text with variants.

```tsx
import { Text } from './.forge'

<Text size="lg" weight="bold">Important text</Text>
<Text size="sm" color="muted">Secondary text</Text>
```

### Label
Form label.

```tsx
import { Label } from './.forge'

<Label htmlFor="email" required>Email</Label>
```

### Link
Styled link.

```tsx
import { Link } from './.forge'

<Link href="/about" external>Learn more</Link>
```

### Kbd
Keyboard key.

```tsx
import { Kbd } from './.forge'

<Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
```

### Shortcut
Full keyboard shortcut.

```tsx
import { Shortcut } from './.forge'

<Shortcut keys={['Ctrl', 'Shift', 'P']} />
```

---

## Buttons

### Button
Main button.

```tsx
import { Button } from './.forge'

<Button variant="primary" size="md">Save</Button>
<Button variant="secondary" disabled>Cancel</Button>
<Button variant="ghost" loading>Loading...</Button>
<Button variant="danger">Delete</Button>
```

**Props:** `variant` (primary/secondary/ghost/danger/success), `size` (xs/sm/md/lg), `loading`, `disabled`, `fullWidth`, `icon`

### IconButton
Icon-only button.

```tsx
import { IconButton } from './.forge'

<IconButton icon={<Settings20Regular />} onClick={handleClick} />
```

### GradientButton
Gradient button (AI features only).

```tsx
import { GradientButton } from './.forge'

<GradientButton>AI Action</GradientButton>
```

### FloatButton
Floating action button (FAB).

```tsx
import { FloatButton, FloatButtonGroup, BackToTop } from './.forge'

<FloatButton icon={<Add20Regular />} position="bottom-right" />

<FloatButtonGroup
  icon={<Add20Regular />}
  items={[
    { icon: <Document20Regular />, label: 'Document', onClick: () => {} },
    { icon: <Image20Regular />, label: 'Image', onClick: () => {} }
  ]}
/>

<BackToTop threshold={300} />
```

### CopyButton
Copy button.

```tsx
import { CopyButton, CopyField } from './.forge'

<CopyButton text="Text to copy" />
<CopyField value="https://example.com/share/abc123" />
```

---

## Cards & Layout

### Card
Base card.

```tsx
import { Card } from './.forge'

<Card padding="lg" hoverable onClick={handleClick}>
  Content
</Card>

<Card title="My section" subtitle="Description" action={{ label: 'View', onClick: handleClick }}>
  Content
</Card>

// Variants
<Card variant="default">Standard card (bg-secondary)</Card>
<Card variant="subtle">Subtle background (bg-tertiary) - for info boxes</Card>
<Card variant="outlined">Transparent with border</Card>

// Padding options: none, sm, md, lg, xl
<Card padding="xl">Extra padding for important content</Card>
```

**Props:**
- `variant`: `'default'` | `'subtle'` | `'outlined'` (default: `'default'`)
- `padding`: `'none'` | `'sm'` | `'md'` | `'lg'` | `'xl'` (default: `'md'`)

> **Warning:** Don't use `variant="subtle"` with `Button variant="ghost"` inside - they have the same hover background color (`bg-tertiary`). Use `Button variant="secondary"` instead.

### ImageCard
Card with image header.

```tsx
import { ImageCard, Badge } from './.forge'

<ImageCard
  image="/photo.jpg"
  imageHeight={180}
  title="Title"
  subtitle="Subtitle"
  description="Optional description"
  badge={<Badge variant="success">New</Badge>}
  actions={<Button size="sm">Action</Button>}
  onClick={handleClick}
/>
```

### HorizontalCard
Card with side image.

```tsx
import { HorizontalCard } from './.forge'

<HorizontalCard
  image="/photo.jpg"
  imageWidth={120}
  title="Title"
  subtitle="Subtitle"
  description="Description"
  meta={<Badge>Tag</Badge>}
  actions={<Button size="sm">Action</Button>}
  onClick={handleClick}
/>
```

### ActionCard
Card with action footer.

```tsx
import { ActionCard, Button } from './.forge'

<ActionCard
  title="Title"
  subtitle="Description"
  icon={<Settings20Regular />}
  iconColor="var(--brand-primary)"
  actions={
    <>
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button size="sm">Confirm</Button>
    </>
  }
>
  Optional content
</ActionCard>
```

### StatCard
Statistics card.

```tsx
import { StatCard } from './.forge'

<StatCard
  title="Revenue"
  value="12,450 EUR"
  change="+12%"
  changeType="positive"
  icon={<ChartMultiple20Regular />}
/>
```

### MiniStat
Compact statistic.

```tsx
import { MiniStat } from './.forge'

<MiniStat label="Projects" value={42} />
```

### StatRow
Row of statistics.

```tsx
import { StatRow } from './.forge'

<StatRow
  stats={[
    { label: 'Projects', value: 12 },
    { label: 'Tasks', value: 48 }
  ]}
/>
```

### ProgressCard
Card with progress.

```tsx
import { ProgressCard } from './.forge'

<ProgressCard title="Project X" progress={75} />
```

### InfoCard
Information card with optional icon and title.

```tsx
import { InfoCard } from './.forge'

<InfoCard title="Note" icon={<Info20Regular />}>
  Information content here
</InfoCard>

// With padding options
<InfoCard title="Settings" padding="lg">
  More spacious content
</InfoCard>
```

**Props:**
- `title`: Optional title (not uppercase, normal case)
- `icon`: Optional icon displayed next to title
- `padding`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

### Section
Section with title.

```tsx
import { Section } from './.forge'

<Section title="My projects" actions={<Button size="sm">New</Button>}>
  {/* Content */}
</Section>
```

### PageHeader
Page header.

```tsx
import { PageHeader } from './.forge'

<PageHeader
  title="Dashboard"
  subtitle="Overview"
  actions={<Button>New</Button>}
/>
```

### EmptyState
Empty state.

```tsx
import { EmptyState } from './.forge'

<EmptyState
  icon={<Folder20Regular />}
  title="No projects"
  description="Create your first project"
  action={<Button>Create</Button>}
/>
```

### ProgressBar
Progress bar.

```tsx
import { ProgressBar } from './.forge'

<ProgressBar value={65} max={100} showLabel />
```

---

## Forms & Inputs

### Input
Text input.

```tsx
import { Input } from './.forge'

<Input
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChange={e => setEmail(e.target.value)}
  icon={<Mail20Regular />}
  error="Invalid email"
/>
```

### Textarea
Text area.

```tsx
import { Textarea } from './.forge'

<Textarea label="Description" rows={4} />
```

### Select
Native dropdown.

```tsx
import { Select } from './.forge'

<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>
```

### SearchInput
Search input.

```tsx
import { SearchInput } from './.forge'

<SearchInput
  value={search}
  onChange={setSearch}
  onClear={() => setSearch('')}
/>
```

### Checkbox
Checkbox.

```tsx
import { Checkbox } from './.forge'

<Checkbox checked={accepted} onChange={setAccepted} label="I accept" />
```

### FormGroup
Field group.

```tsx
import { FormGroup } from './.forge'

<FormGroup label="Name" error="Required field" required>
  <Input />
</FormGroup>
```

### Switch
Toggle switch.

```tsx
import { Switch, SwitchGroup } from './.forge'

<Switch checked={enabled} onChange={setEnabled} label="Notifications" />

<SwitchGroup
  items={[
    { id: 'email', label: 'Email', checked: true },
    { id: 'sms', label: 'SMS', checked: false }
  ]}
  onChange={handleChange}
/>
```

### Radio
Radio buttons.

```tsx
import { Radio, RadioGroup, RadioCardGroup } from './.forge'

<RadioGroup
  name="priority"
  value={priority}
  onChange={setPriority}
  options={[
    { value: 'low', label: 'Low' },
    { value: 'high', label: 'High' }
  ]}
/>

<RadioCardGroup
  value={plan}
  onChange={setPlan}
  options={[
    { value: 'free', label: 'Free', description: '$0/month' },
    { value: 'pro', label: 'Pro', description: '$29/month' }
  ]}
/>
```

### Slider
Value slider.

```tsx
import { Slider, RangeSlider } from './.forge'

<Slider value={volume} onChange={setVolume} min={0} max={100} />

<RangeSlider
  value={[minPrice, maxPrice]}
  onChange={([min, max]) => { setMinPrice(min); setMaxPrice(max) }}
/>
```

**Props:** `animated` (false to disable entry animation)

### NumberInput
Numeric input with +/-.

```tsx
import { NumberInput } from './.forge'

<NumberInput value={quantity} onChange={setQuantity} min={0} max={100} />
```

### TagInput
Tag input.

```tsx
import { TagInput, EmailTagInput } from './.forge'

<TagInput value={tags} onChange={setTags} placeholder="Add a tag" />
<EmailTagInput value={emails} onChange={setEmails} />
```

### Combobox
Searchable list.

```tsx
import { Combobox, MultiCombobox } from './.forge'

<Combobox
  value={selected}
  onChange={setSelected}
  options={options}
  searchable
/>

<MultiCombobox
  value={selectedTags}
  onChange={setSelectedTags}
  options={tags}
  creatable
/>
```

### DatePicker
Date picker.

```tsx
import { DatePicker, DateTimePicker } from './.forge'

<DatePicker value={date} onChange={setDate} minDate={new Date()} />
<DateTimePicker value={datetime} onChange={setDatetime} />
```

### TimePicker
Time picker.

```tsx
import { TimePicker, TimeRangePicker } from './.forge'

<TimePicker value={time} onChange={setTime} format="24h" />
<TimeRangePicker
  startTime={start}
  endTime={end}
  onStartChange={setStart}
  onEndChange={setEnd}
/>
```

### ColorPicker
Color picker.

```tsx
import { ColorPicker, ColorSwatch, ColorPalette, PROJECT_COLORS } from './.forge'

<ColorPicker value={color} onChange={setColor} />
<ColorSwatch color="#A35BFF" selected onClick={handleClick} />
<ColorPalette colors={PROJECT_COLORS} value={color} onChange={setColor} />
```

### FileUpload
File upload.

```tsx
import { FileUpload, AvatarUpload } from './.forge'

<FileUpload onUpload={handleFiles} accept="image/*,.pdf" multiple />
<AvatarUpload value={avatarUrl} onUpload={handleUpload} />
```

### OTPInput
Verification code.

```tsx
import { OTPInput, PINInput } from './.forge'

<OTPInput length={6} value={otp} onChange={setOtp} onComplete={handleVerify} />
<PINInput length={4} value={pin} onChange={setPin} masked />
```

### PhoneInput
Phone number.

```tsx
import { PhoneInput } from './.forge'

<PhoneInput value={phone} onChange={setPhone} defaultCountry="FR" />
```

### InputGroup
Input group with addons.

```tsx
import { InputGroup, InputAddon, GroupInput, InputWithAddons } from './.forge'

<InputGroup>
  <InputAddon position="left">https://</InputAddon>
  <GroupInput placeholder="example.com" hasLeftAddon />
</InputGroup>

<InputWithAddons leftAddon="€" rightAddon=".00" placeholder="100" />
```

### Cascader
Hierarchical selection.

```tsx
import { Cascader } from './.forge'

<Cascader
  options={[
    {
      value: 'france',
      label: 'France',
      children: [
        { value: 'paris', label: 'Paris' },
        { value: 'lyon', label: 'Lyon' }
      ]
    }
  ]}
  value={location}
  onChange={setLocation}
/>
```

### MentionInput
Input with @mentions.

```tsx
import { MentionInput, MentionDisplay } from './.forge'

<MentionInput
  value={content}
  onChange={setContent}
  users={[{ id: '1', name: 'Jean', avatar: '/avatar.jpg' }]}
/>

<MentionDisplay content="Hello @john" mentions={mentions} />
```

### Rating
Ratings and reviews.

```tsx
import { Rating, RatingDisplay } from './.forge'

<Rating value={rating} onChange={setRating} max={5} />
<RatingDisplay value={4.5} showValue />
```

---

## Badges & Tags

### Badge
Simple badge.

```tsx
import { Badge } from './.forge'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Urgent</Badge>
```

### Tag
Removable tag.

```tsx
import { Tag } from './.forge'

<Tag color="#A35BFF" onRemove={handleRemove}>Design</Tag>
```

### StatusBadge
Status badge.

```tsx
import { StatusBadge } from './.forge'

<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="completed" />
```

### PriorityBadge
Priority badge.

```tsx
import { PriorityBadge } from './.forge'

<PriorityBadge priority="high" />
<PriorityBadge priority="urgent" />
```

### CountBadge
Count badge.

```tsx
import { CountBadge } from './.forge'

<CountBadge count={99} max={99} />
```

---

## Navigation

### Tabs
Tabs.

```tsx
import { Tabs, TabPanels, TabPanel, PillTabs } from './.forge'

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', icon: <Home20Regular /> },
    { id: 'tasks', label: 'Tasks', badge: 5 }
  ]}
  active={activeTab}
  onChange={setActiveTab}
/>

<TabPanels active={activeTab}>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="tasks">Tasks content</TabPanel>
</TabPanels>

<PillTabs tabs={tabs} activeTab={filter} onChange={setFilter} />
```

### ViewToggle
Toggle between views.

```tsx
import { ViewToggle } from './.forge'

<ViewToggle
  value={viewMode}
  onChange={setViewMode}
  options={[
    { value: 'list', icon: <List20Regular /> },
    { value: 'grid', icon: <Grid20Regular /> }
  ]}
/>
```

### Pills
Filter pills.

```tsx
import { Pills } from './.forge'

<Pills
  options={[
    { id: 'all', label: 'All', count: 42 },
    { id: 'active', label: 'Active', count: 30 }
  ]}
  selected={filter}
  onChange={setFilter}
/>
```

### Breadcrumbs
Breadcrumb trail.

```tsx
import { Breadcrumbs, BreadcrumbLink, PageBreadcrumb } from './.forge'

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'My project' }
  ]}
/>
```

### Stepper
Process steps.

```tsx
import { Stepper, StepContent, StepActions, useStepper } from './.forge'

const { currentStep, next, prev, goTo } = useStepper(3)

<Stepper
  steps={[
    { label: 'Information' },
    { label: 'Configuration' },
    { label: 'Confirmation' }
  ]}
  currentStep={currentStep}
/>

<StepContent step={0} currentStep={currentStep}>
  Step 1 content
</StepContent>

<StepActions>
  <Button onClick={prev}>Back</Button>
  <Button onClick={next}>Next</Button>
</StepActions>
```

### Navbar
Navigation bar.

```tsx
import { Navbar, BottomNav, TopBar } from './.forge'

<Navbar
  logo={<Logo />}
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'projects', label: 'Projects', href: '/projects' }
  ]}
/>

<TopBar title="My App" backButton onBack={() => navigate(-1)} />

<BottomNav
  items={[
    { id: 'home', icon: <Home20Regular />, label: 'Home' },
    { id: 'profile', icon: <Person20Regular />, label: 'Profile' }
  ]}
  activeItem={activeNav}
  onChange={setActiveNav}
/>
```

### AppSidebar
Application sidebar with navigation. Supports inline mode (always visible) or drawer mode (slide-in panel). Auto-adapts to mobile with built-in responsive behavior.

```tsx
import { AppSidebar } from './.forge'
import type { NavSection } from './.forge'

const sections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', icon: <Home20Regular />, label: 'Dashboard' },
      { id: 'projects', icon: <Folder20Regular />, label: 'Projects', badge: 5 },
      {
        id: 'settings',
        icon: <Settings20Regular />,
        label: 'Settings',
        defaultOpen: true,
        children: [
          { id: 'profile', icon: <Person20Regular />, label: 'Profile' },
          { id: 'security', icon: <Shield20Regular />, label: 'Security' }
        ]
      }
    ]
  }
]

// Inline mode (default) - sidebar always visible on desktop, auto mobile menu
<AppSidebar
  mode="inline"
  logo={<Logo />}
  sections={sections}
  activeId={activeNav}
  onNavigate={(id) => setActiveNav(id)}
  showSearch
  searchPlaceholder="Search..."
  searchShortcut="Ctrl+K"
  onSearchClick={() => setSearchOpen(true)}
  footerContent={<Text size="xs">v1.0.0</Text>}
/>

// Drawer mode - slide-in panel
<AppSidebar
  mode="drawer"
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  position="left"
  sections={sections}
  activeId={activeNav}
  onNavigate={(id) => setActiveNav(id)}
  rounded
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'inline' \| 'drawer'` | `'inline'` | Display mode |
| `open` | `boolean` | `true` | Open state (drawer mode) |
| `onClose` | `() => void` | - | Close handler (drawer mode) |
| `position` | `'left' \| 'right'` | `'left'` | Position (drawer mode) |
| `logo` | `ReactNode` | - | Logo content |
| `sections` | `NavSection[]` | - | Navigation sections |
| `activeId` | `string` | - | Active item ID |
| `onNavigate` | `(id: string) => void` | - | Navigation handler |
| `showHeader` | `boolean` | `true` | Show logo + search |
| `showSearch` | `boolean` | `true` | Show search button |
| `searchPlaceholder` | `string` | `'Rechercher...'` | Search placeholder |
| `searchShortcut` | `string` | `'Ctrl+K'` | Keyboard shortcut hint |
| `onSearchClick` | `() => void` | - | Search click handler |
| `footerContent` | `ReactNode` | - | Footer content |
| `bottomItems` | `NavItem[]` | - | Bottom navigation items |
| `width` | `number` | `280` | Sidebar width |
| `height` | `string` | `'100dvh'` | Sidebar height |
| `accentColor` | `string` | `var(--active-color)` | Active item color |
| `rounded` | `boolean` | `true` | Rounded corners (drawer mode) |

**Types:**
```tsx
interface NavItem {
  id: string
  icon: ReactNode
  label: string
  badge?: number | string
  onClick?: () => void
  children?: NavItem[]
  defaultOpen?: boolean
}

interface NavSection {
  title?: string
  items: NavItem[]
}
```

### Pagination
Paginated navigation.

```tsx
import { Pagination, SimplePagination, TablePagination } from './.forge'

<Pagination currentPage={page} totalPages={10} onChange={setPage} />
<SimplePagination currentPage={page} totalPages={10} onPrev={handlePrev} onNext={handleNext} />
<TablePagination page={page} pageSize={10} total={100} onPageChange={setPage} />
```

### Footer
Footer.

```tsx
import { Footer, SimpleFooter } from './.forge'

<Footer
  logo={<Logo />}
  sections={[{ title: 'Product', links: [{ label: 'Features', href: '/features' }] }]}
  copyright="© 2024 Webba"
/>

// SimpleFooter with automatic year (recommended)
<SimpleFooter
  companyName="My Company"
  links={[{ label: 'Legal', href: '/legal' }]}
/>
// Output: "© 2025 My Company. All rights reserved."

// Or just company name for minimal footer
<SimpleFooter companyName="Webba" />
// Output: "© 2025 Webba. All rights reserved."

// Or minimal (year only)
<SimpleFooter />
// Output: "© 2025"

// Custom text (no auto year)
<SimpleFooter text="Custom footer text" />
```

**SimpleFooter Props:**
- `companyName`: Company name - generates "© {year} {name}. All rights reserved."
- `text`: Override full text (won't auto-add year)
- `links`: Array of `{ label, href?, onClick? }`

> **Best Practice:** Always use `companyName` prop instead of hardcoding the year.

---

## Overlays & Modals

### Modal
Modal window.

```tsx
import { Modal } from './.forge'

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm"
  size="md"
  actions={<><Button variant="secondary">Cancel</Button><Button>Confirm</Button></>}
>
  Modal content
</Modal>
```

**Props:** `size` (sm/md/lg/xl/full), `closeOnOverlay`, `closeOnEscape`

### ConfirmDialog
Confirmation dialog.

```tsx
import { ConfirmDialog, AlertDialog } from './.forge'

<ConfirmDialog
  open={open}
  title="Delete?"
  message="This action is irreversible"
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
/>

<AlertDialog open={open} title="Error" message="An error occurred" onClose={handleClose} />
```

### Sheet
Side panel.

```tsx
import { Sheet, SidePanel, BottomSheet } from './.forge'

<Sheet open={open} onClose={handleClose} position="right" size="md" title="Details">
  Content
</Sheet>

<SidePanel open={open} onClose={handleClose}>Content</SidePanel>

<BottomSheet open={open} onClose={handleClose} title="Options">
  Mobile content
</BottomSheet>
```

### Dropdown
Dropdown menu.

```tsx
import { Dropdown, SelectDropdown, ContextMenu, useContextMenu } from './.forge'

<Dropdown
  trigger={<Button>Actions</Button>}
  items={[
    { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
    { id: 'delete', label: 'Delete', danger: true }
  ]}
  onSelect={handleAction}
/>

<SelectDropdown
  value={selected}
  onChange={setSelected}
  options={[{ value: 'a', label: 'Option A' }]}
/>

// Context menu
const { showContextMenu, ContextMenuComponent } = useContextMenu()
<div onContextMenu={(e) => showContextMenu(e, items)}>Right click</div>
{ContextMenuComponent}
```

### Popover
Popover with content.

```tsx
import { Popover, HoverCard } from './.forge'

<Popover trigger={<Button>Open</Button>} content={<div>Content</div>} />

<HoverCard trigger={<span>Hover</span>} content={<div>Info</div>} />
```

### Tooltip
Tooltip.

```tsx
import { Tooltip, InfoTooltip } from './.forge'

<Tooltip content="Help"><Button>Hover</Button></Tooltip>
<InfoTooltip>Detailed explanation</InfoTooltip>
```

### CommandBar
Command bar (Cmd+K).

```tsx
import { CommandBar } from './.forge'

<CommandBar
  open={open}
  onClose={handleClose}
  onSearch={handleSearch}
  onAiQuery={handleAiQuery}
/>
```

### Tour
Guided tour.

```tsx
import { Tour, useTour } from './.forge'

const { startTour, endTour, isActive, currentStep } = useTour()

<Tour
  steps={[
    { target: '#step1', title: 'Welcome', content: 'Description', placement: 'bottom' }
  ]}
  active={isActive}
  currentStep={currentStep}
  onClose={endTour}
/>
```

---

## Data Display

### Table
Data table.

```tsx
import { Table, SimpleTable } from './.forge'

<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ]}
  data={items}
  selectable
  onRowClick={handleClick}
/>

<SimpleTable columns={columns} data={data} />
```

### Calendar
Calendar.

```tsx
import { Calendar, MiniCalendar } from './.forge'

<Calendar
  events={[{ id: '1', title: 'Meeting', date: '2024-01-15', color: '#A35BFF' }]}
  onEventClick={handleEventClick}
  onDateClick={handleDateClick}
/>

<MiniCalendar value={date} onChange={setDate} markedDates={['2024-01-15']} />
```

### Timeline
Timeline.

```tsx
import { Timeline, ActivityTimeline } from './.forge'

<Timeline
  items={[
    { id: '1', title: 'Created', date: '2024-01-01', status: 'completed' },
    { id: '2', title: 'In progress', date: '2024-01-15', status: 'active' }
  ]}
/>

<ActivityTimeline
  activities={[
    { id: '1', user: 'John', action: 'created the project', time: '2h ago' }
  ]}
/>
```

### Avatar
User avatars.

```tsx
import { Avatar, AvatarStack, AvatarGroup, AvatarCard, AvatarList } from './.forge'

<Avatar src="/user.jpg" name="Jean" size="md" status="online" />
<AvatarStack avatars={[{ name: 'Jean' }, { name: 'Marie' }]} max={3} />
<AvatarGroup users={users} max={5} />
<AvatarCard user={user} />
<AvatarList users={users} />
```

### Accordion
Collapsible panels.

```tsx
import { Accordion, AccordionItem, Collapsible, FAQAccordion, CollapsibleCard } from './.forge'

<Accordion>
  <AccordionItem title="Section 1" defaultOpen>Content 1</AccordionItem>
  <AccordionItem title="Section 2">Content 2</AccordionItem>
</Accordion>

<Collapsible title="Details">Hidden content</Collapsible>

<FAQAccordion items={[{ question: 'How?', answer: 'Answer' }]} />

<CollapsibleCard title="Options" defaultOpen={false}>Content</CollapsibleCard>
```

### TableOfContents
Table of contents.

```tsx
import { TableOfContents, MiniTOC } from './.forge'

<TableOfContents
  items={[
    { id: 'intro', label: 'Introduction', level: 1 },
    { id: 'features', label: 'Features', level: 2 }
  ]}
  activeId={activeSection}
/>

<MiniTOC items={items} />
```

### CodeBlock
Code display.

```tsx
import { CodeBlock, InlineCode, CodeDiff } from './.forge'

<CodeBlock code={`const x = 1`} language="javascript" showLineNumbers copyable />

<p>Use <InlineCode>npm install</InlineCode></p>

<CodeDiff before={`const x = 1`} after={`const x = 2`} />
```

### Descriptions
Key-value lists.

```tsx
import { Descriptions, DescriptionList } from './.forge'

<Descriptions
  items={[
    { label: 'Name', value: 'John' },
    { label: 'Email', value: 'john@example.com' }
  ]}
  columns={2}
  bordered
/>

<DescriptionList items={[{ term: 'Created', description: 'Jan 15' }]} />
```

### SortableList
Reorderable lists.

```tsx
import { SortableList, SimpleSortableList } from './.forge'

<SortableList
  items={tasks}
  onReorder={setTasks}
  renderItem={(item) => <Card>{item.title}</Card>}
/>

<SimpleSortableList items={['A', 'B', 'C']} onReorder={setItems} />
```

**Features:** Drop indicator (blue bar), smooth animations

### TreeView
Tree structure.

```tsx
import { TreeView, FileTree } from './.forge'

<TreeView
  data={[
    { id: '1', label: 'Folder', children: [{ id: '2', label: 'File' }] }
  ]}
  onSelect={handleSelect}
/>

<FileTree
  files={[{ path: 'src/index.ts', type: 'file' }]}
  onFileClick={handleClick}
/>
```

### QuoteBox
Quote.

```tsx
import { QuoteBox } from './.forge'

<QuoteBox author="Steve Jobs">Stay hungry, stay foolish.</QuoteBox>
```

### ChatBox
Chat interface.

```tsx
import { ChatBox, MiniChat } from './.forge'

<ChatBox
  messages={[
    { id: '1', content: 'Hello', sender: 'user', timestamp: new Date() }
  ]}
  onSend={handleSend}
  loading={isTyping}
/>

<MiniChat messages={messages} onSend={handleSend} />
```

---

## Feedback & Loading

### Toast
Temporary notifications.

```tsx
import { ToastProvider, useToast, SimpleToast } from './.forge'

// Provider
<ToastProvider position="bottom-right"><App /></ToastProvider>

// Usage
const toast = useToast()
toast.success('Saved!')
toast.error('Error')
toast.info('Info')
toast.warning('Warning')
```

### Notification
Persistent notifications.

```tsx
import { NotificationProvider, useNotification } from './.forge'

<NotificationProvider><App /></NotificationProvider>

const notification = useNotification()
notification.show({
  title: 'New task',
  description: 'John assigned you a task',
  type: 'info',
  action: { label: 'View', onClick: handleView }
})
```

### Banner
Alert banners.

```tsx
import { Banner, Alert, AnnouncementBanner } from './.forge'

<Banner type="info" title="Info">Message</Banner>
<Alert type="warning" dismissible>Warning</Alert>
<AnnouncementBanner>New feature!</AnnouncementBanner>
```

### Spinner
Loading indicators.

```tsx
import { Spinner, LoadingOverlay, WebbaLoader, WebbaThinking } from './.forge'

<Spinner size="md" />
<LoadingOverlay visible={loading}><Content /></LoadingOverlay>
<WebbaLoader />
<WebbaThinking />
```

### SplashScreen
Startup screens.

```tsx
import { SplashScreen, LogoSplash, MinimalSplash, BrandedSplash } from './.forge'

<SplashScreen visible={loading} />
<LogoSplash logo={<Logo />} />
<MinimalSplash />
<BrandedSplash tagline="Your assistant" />
```

### Skeleton
Placeholders.

```tsx
import { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonAvatarGroup, SkeletonStatCard } from './.forge'

<Skeleton width={200} height={20} />
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonTable rows={5} columns={4} />
<SkeletonAvatarGroup count={3} />
<SkeletonStatCard />
```

### Countdown
Counters.

```tsx
import { Countdown, Timer, SimpleCountdown, PomodoroTimer } from './.forge'

<Countdown targetDate={new Date('2024-12-31')} onComplete={handleComplete} />
<Timer initialTime={300} onComplete={handleComplete} />
<SimpleCountdown seconds={60} />
<PomodoroTimer workDuration={25} breakDuration={5} />
```

---

## Charts

### BarChart
Bar chart.

```tsx
import { BarChart, GroupedBarChart } from './.forge'

<BarChart data={[{ label: 'Jan', value: 100 }]} height={200} />

<GroupedBarChart
  data={[{ label: 'Q1', values: [100, 80] }]}
  series={['Revenue', 'Expenses']}
/>
```

### LineChart
Line chart.

```tsx
import { LineChart, MultiLineChart } from './.forge'

<LineChart data={[{ label: 'Jan', value: 100 }]} height={200} />

<MultiLineChart
  data={[{ label: 'Jan', values: [100, 80] }]}
  series={[{ name: 'A', color: '#A35BFF' }]}
/>
```

### DonutChart
Donut chart.

```tsx
import { DonutChart } from './.forge'

<DonutChart
  data={[
    { label: 'Active', value: 60, color: '#10b981' },
    { label: 'Inactive', value: 40, color: '#6b7280' }
  ]}
  showLegend
/>
```

### Sparkline
Mini chart.

```tsx
import { Sparkline } from './.forge'

<Sparkline data={[10, 15, 8, 20]} width={100} height={30} />
```

### ProgressRing
Progress ring.

```tsx
import { ProgressRing } from './.forge'

<ProgressRing value={75} size={80} label="75%" />
```

---

## Media

### ImageGallery
Image gallery.

```tsx
import { ImageGallery, ImageTile, Lightbox, ImagePreview } from './.forge'

<ImageGallery
  images={[{ id: '1', src: '/img.jpg', alt: 'Image' }]}
  columns={3}
  onImageClick={handleClick}
/>

<Lightbox
  images={images}
  currentIndex={index}
  open={open}
  onClose={handleClose}
/>

<ImagePreview src="/img.jpg" zoom />
```

### Carousel
Carousel.

```tsx
import { Carousel, CarouselSlide, ImageCarousel } from './.forge'

<Carousel autoPlay interval={5000} showDots showArrows>
  <CarouselSlide><img src="/1.jpg" /></CarouselSlide>
  <CarouselSlide><img src="/2.jpg" /></CarouselSlide>
</Carousel>

<ImageCarousel images={[{ src: '/1.jpg' }]} />
```

### VideoPlayer
Video player.

```tsx
import { VideoPlayer } from './.forge'

<VideoPlayer
  src="/video.mp4"
  poster="/poster.jpg"
  onPlay={handlePlay}
  onPause={handlePause}
/>
```

**Features:**
- Draggable progress bar
- Volume control (Forge Slider horizontal)
- Speed control (0.5x - 2x)
- Picture-in-Picture
- Double-click = fullscreen
- Shortcuts: `k` play/pause, `f` fullscreen, `m` mute, `j`/`l` ±10s

### AudioPlayer
Audio player.

```tsx
import { AudioPlayer, MiniAudioPlayer } from './.forge'

<AudioPlayer
  src="/audio.mp3"
  title="Title"
  artist="Artist"
  cover="/cover.jpg"
/>

<MiniAudioPlayer src="/audio.mp3" title="Podcast" />
```

**Features:** Draggable bar, volume Slider, skip ±10s, loop

---

## Utilities

### Divider
Separators.

```tsx
import { Divider, VerticalDivider, SectionDivider } from './.forge'

<Divider />
<Divider label="or" />
<VerticalDivider />
<SectionDivider label="Section" />
```

### Affix
Fixed elements on scroll.

```tsx
import { Affix, StickyHeader, StickySidebar, ScrollIndicator } from './.forge'

<Affix offsetTop={100}><Card>Fixed after 100px</Card></Affix>
<StickyHeader><Navbar /></StickyHeader>
<StickySidebar top={80}><TOC /></StickySidebar>
<ScrollIndicator />
```

### Watermark
Watermark.

```tsx
import { Watermark } from './.forge'

<Watermark text="CONFIDENTIAL" opacity={0.1} rotate={-22}>
  <div>Content</div>
</Watermark>
```

### Highlight
Text highlighting.

```tsx
import { Highlight } from './.forge'

<Highlight text="Example text" query="example" />
```

### TextTruncate
Truncated text.

```tsx
import { TextTruncate } from './.forge'

<TextTruncate text={longText} maxLines={3} expandLabel="Show more" />
```

### CopyText
Copy on click.

```tsx
import { CopyText } from './.forge'

<CopyText text="secret-code">Click to copy</CopyText>
```

---

## Layout Components

### Container
**Max-width centered container for page content.** Use this to prevent content from stretching too wide on large screens.

```tsx
import { Container } from './.forge'

// Default (xl breakpoint = 1280px)
<Container>
  <PageContent />
</Container>

// With custom max-width
<Container maxWidth={1400}>Wide content</Container>
<Container maxWidth="lg">Standard (1024px)</Container>
<Container maxWidth="full">Full width</Container>

// With padding
<Container maxWidth={1400} padding="1.5rem">
  Padded content
</Container>

// Disable centering
<Container center={false}>Left-aligned</Container>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `Breakpoint \| 'full' \| number` | `'xl'` | Max-width (breakpoint name or px value) |
| `padding` | `ResponsiveValue<string \| number>` | `'1rem'` | Horizontal padding |
| `py` | `ResponsiveValue<string \| number>` | - | Vertical padding |
| `center` | `boolean` | `true` | Center container with auto margins |

> **Best Practice:** Always wrap your page content in a Container to ensure consistent layout on all screen sizes.

### Stack
Stacking.

```tsx
import { Stack, VStack, HStack } from './.forge'

<Stack direction="column" gap="md">...</Stack>
<VStack gap="sm">...</VStack>
<HStack gap="lg">...</HStack>
```

### Grid
CSS Grid.

```tsx
import { Grid } from './.forge'

<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  {items.map(item => <Card />)}
</Grid>
```

### Flex
Flexbox.

```tsx
import { Flex, Center, Spacer } from './.forge'

<Flex align="center" justify="between">...</Flex>
<Center>Centered</Center>
<Flex><div>Left</div><Spacer /><div>Right</div></Flex>
```

### Box
Generic container.

```tsx
import { Box } from './.forge'

<Box padding="md" margin="lg">Content</Box>
```

### AspectRatio
Fixed ratio.

```tsx
import { AspectRatio } from './.forge'

<AspectRatio ratio={16/9}><img src="/img.jpg" /></AspectRatio>
```

### Show / Hide
Conditional display.

```tsx
import { Show, Hide } from './.forge'

<Show on="mobile"><MobileNav /></Show>
<Hide on="mobile"><DesktopNav /></Hide>
```

---

## Hooks

### useForge
Theme access.

```tsx
const { theme, isDark, mode } = useForge()
```

### useToast
Show toasts.

```tsx
const toast = useToast()
toast.success('Message')
```

### useNotification
Show notifications.

```tsx
const notification = useNotification()
notification.show({ title: 'Title', type: 'info' })
```

### useStepper
Step management.

```tsx
const { currentStep, next, prev, goTo, isFirst, isLast } = useStepper(totalSteps)
```

### useContextMenu
Context menu.

```tsx
const { showContextMenu, ContextMenuComponent } = useContextMenu()
```

### useTour
Guided tour.

```tsx
const { startTour, endTour, isActive, currentStep } = useTour()
```

### useMediaQuery
Media query.

```tsx
const isWide = useMediaQuery('(min-width: 1024px)')
```

### useBreakpoint
Current breakpoint.

```tsx
const breakpoint = useBreakpoint() // 'mobile' | 'tablet' | 'desktop'
```

### useIsMobile / useIsTablet / useIsDesktop
Device detection.

```tsx
const isMobile = useIsMobile()
const isTablet = useIsTablet()
const isDesktop = useIsDesktop()
```

### useWindowSize
Window size.

```tsx
const { width, height } = useWindowSize()
```

### useResponsiveValue
Value based on breakpoint.

```tsx
const columns = useResponsiveValue({ mobile: 1, tablet: 2, desktop: 4 })
```

### useAssistant
AI Assistant.

```tsx
import { useAssistant, isNaturalLanguageQuery, findEntityByIdOrName } from './.forge'

const { processQuery } = useAssistant({ projects, clients, tasks })
```

---

## CSS Variables

```css
/* Brand */
--brand-primary: #A35BFF
--brand-secondary: #FD9173

/* Backgrounds */
--bg-primary: #070707
--bg-secondary: #0c0c0c
--bg-tertiary: #1a1a1a
--bg-hover: #2a2a2a

/* Text */
--text-primary: #fafafa
--text-secondary: #a3a3a3
--text-muted: #737373

/* Borders */
--border-color: #404040

/* Semantic */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6

/* Radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
```

---

## Installation

```bash
# Dependencies
npm install @fluentui/react-icons

# Import
import { Button, Card, Modal } from './.forge'
```
