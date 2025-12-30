# Forge - Quick Reference for AI

> **STOP** - Read this file BEFORE implementing anything with Forge.

---

## 5 Golden Rules

1. **NEVER write custom CSS hover** - Forge components ALREADY include all animations
2. **ALWAYS use CSS variables** - Never hardcode colors
3. **ALWAYS use Forge components** - Never raw HTML elements for UI
4. **NO background behind icons** - Use ghost/transparent icon buttons
5. **NO gradient abuse** - Reserved for AI features only (GradientButton, AI indicators)

---

## Colors - Copy/Paste

```tsx
// ACTIVE STATE (nav, tabs, etc.)
color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)'
backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent'
fontWeight: isActive ? 500 : 400

// BACKGROUNDS
'var(--bg-primary)'    // Page background
'var(--bg-secondary)'  // Cards, sections
'var(--bg-tertiary)'   // Hover states
'var(--bg-hover)'      // Intense hover

// TEXT
'var(--text-primary)'   // Titles, active labels
'var(--text-secondary)' // Descriptions
'var(--text-muted)'     // Placeholders

// BRAND
'var(--brand-primary)'  // #A35BFF - Purple (active, CTA)
'var(--brand-secondary)'// #FD9173 - Orange
```

---

## Navigation - Copy/Paste

### Navbar Desktop
```tsx
import { Navbar } from 'wss3-forge'

<Navbar
  logo={<MyLogo />}
  items={[
    { id: 'home', label: 'Home', icon: <Home20Regular /> },
    { id: 'projects', label: 'Projects', icon: <Folder20Regular />, badge: 5 }
  ]}
  activeId={currentPage}
  onNavigate={setCurrentPage}
  showSearch
  onSearchClick={() => setSearchOpen(true)}
  actions={<Button>New</Button>}
/>
```

### BottomNav Mobile
```tsx
import { BottomNav } from 'wss3-forge'

<BottomNav
  items={[
    { id: 'home', icon: <Home20Regular />, label: 'Home' },
    { id: 'search', icon: <Search20Regular />, label: 'Search' },
    { id: 'profile', icon: <Person20Regular />, label: 'Profile' }
  ]}
  activeId={currentTab}
  onNavigate={setCurrentTab}
/>
```

### Tabs
```tsx
import { Tabs, TabPanels, TabPanel } from 'wss3-forge'

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', icon: <Home20Regular /> },
    { id: 'tasks', label: 'Tasks', badge: 5 }
  ]}
  active={activeTab}
  onChange={setActiveTab}
  variant="default"  // 'default' | 'pills' | 'underline'
/>

<TabPanels active={activeTab}>
  <TabPanel id="overview">Content 1</TabPanel>
  <TabPanel id="tasks">Content 2</TabPanel>
</TabPanels>
```

---

## Buttons - Copy/Paste

```tsx
import { Button, IconButton, GradientButton } from 'wss3-forge'

// VARIANTS (hover/press included automatically)
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// WITH ICON
<Button icon={<Add20Regular />}>Add</Button>

// STATES
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>  // fullWidth={true} because false by default

// SIZES
<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="md">MD</Button>
<Button size="lg">LG</Button>

// ICON ONLY
<IconButton icon={<Settings20Regular />} />

// GRADIENT CTA (AI features only)
<GradientButton>Premium Action</GradientButton>
```

---

## Forms - Copy/Paste

```tsx
import { Input, FormGroup, Select, Switch, Checkbox } from 'wss3-forge'

// INPUT WITH LABEL AND ERROR
<FormGroup label="Email" error={errors.email} required>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="you@example.com"
    icon={<Mail20Regular />}
  />
</FormGroup>

// SELECT
<Select
  label="Status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>

// SWITCH (animation included)
<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable"
/>

// CHECKBOX (animation included)
<Checkbox
  checked={accepted}
  onChange={setAccepted}
  label="I accept"
/>
```

---

## Cards - Copy/Paste

```tsx
import { Card, ImageCard, HorizontalCard, ActionCard, StatCard } from 'wss3-forge'

// BASIC CARD
<Card>Content</Card>

// CARD WITH TITLE + SUBTITLE + ACTION
<Card
  title="My Section"
  subtitle="Description"
  action={{ label: 'View all', onClick: handleClick }}
>
  Content
</Card>

// IMAGE CARD (image header)
<ImageCard
  image="/photo.jpg"
  title="Title"
  subtitle="Subtitle"
  description="Description"
  onClick={handleClick}
/>

// HORIZONTAL CARD (image on left)
<HorizontalCard
  image="/photo.jpg"
  title="Title"
  subtitle="Subtitle"
  description="Description"
/>

// ACTION CARD (with footer)
<ActionCard
  title="Confirm"
  subtitle="Description"
  actions={<><Button variant="ghost">Cancel</Button><Button>OK</Button></>}
/>

// STAT CARD
<StatCard
  label="Revenue"
  value="12,450 EUR"
  color="var(--brand-primary)"
  icon={<ChartMultiple20Regular />}
/>
```

---

## Modals - Copy/Paste

```tsx
import { Modal, ConfirmDialog, Sheet } from 'wss3-forge'

// MODAL
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Title"
  size="md"
  actions={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  Modal content
</Modal>

// QUICK CONFIRMATION
<ConfirmDialog
  open={showConfirm}
  title="Delete?"
  message="This action is irreversible."
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>

// SIDE PANEL
<Sheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  position="right"
  size="md"
  title="Details"
>
  Content
</Sheet>
```

---

## Feedback - Copy/Paste

```tsx
import { useToast, Spinner, LoadingOverlay, Skeleton } from 'wss3-forge'

// TOAST
const toast = useToast()
toast.success('Saved!')
toast.error('Error')
toast.info('Information')
toast.warning('Warning')

// SPINNER
<Spinner size="md" />

// LOADING OVERLAY
<LoadingOverlay visible={isLoading}>
  <Content />
</LoadingOverlay>

// SKELETON
<Skeleton width={200} height={20} />
<SkeletonText lines={3} />
<SkeletonCard />
```

---

## Animations - Copy/Paste

```tsx
import { Animate, Stagger } from 'wss3-forge'

// SINGLE ELEMENT
<Animate type="fadeIn" delay={100}>
  <Card>Animated</Card>
</Animate>

// LIST WITH STAGGER
<Stagger type="slideInUp" stagger={50}>
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</Stagger>

// TYPES: fadeIn, slideInUp, slideInDown, slideInLeft, slideInRight, scaleIn
```

---

## Layout - Copy/Paste

```tsx
import { VStack, HStack, Grid, Flex, Spacer } from 'wss3-forge'

// VERTICAL
<VStack gap="md">
  <Element1 />
  <Element2 />
</VStack>

// HORIZONTAL
<HStack gap="sm">
  <Icon />
  <Text />
</HStack>

// RESPONSIVE GRID
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  {items.map(item => <Card key={item.id} />)}
</Grid>

// FLEX WITH SPACER
<Flex align="center">
  <Logo />
  <Spacer />
  <Actions />
</Flex>
```

---

## Dropdown - Copy/Paste

```tsx
import { Dropdown } from 'wss3-forge'

<Dropdown
  trigger={<Button variant="secondary">Actions</Button>}
  items={[
    { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
    { id: 'duplicate', label: 'Duplicate', icon: <Copy20Regular /> },
    { id: 'divider', divider: true },
    { id: 'delete', label: 'Delete', icon: <Delete20Regular />, danger: true }
  ]}
  onSelect={(id) => handleAction(id)}
/>
```

---

## Common Mistakes - AVOID

```tsx
// BAD - Hardcoded color
style={{ color: '#A35BFF' }}
// GOOD
style={{ color: 'var(--brand-primary)' }}

// BAD - Custom CSS hover
<button style={{ ':hover': { bg: '#333' } }}>
// GOOD - Use the component
<Button variant="secondary">

// BAD - Raw HTML for UI
<button className="my-button">
// GOOD
<Button variant="primary">

// BAD - Missing animation
{isOpen && <Content />}
// GOOD
<Animate type="fadeIn" when={isOpen}>
  <Content />
</Animate>

// BAD - Background behind icon
<div style={{ backgroundColor: `${color}20` }}><Icon /></div>
// GOOD - Just the color
<div style={{ color }}><Icon /></div>
```

---

## Checklist Before Submission

- [ ] No hardcoded colors (use CSS vars)
- [ ] No custom CSS hover (components include it)
- [ ] Use Forge components (no raw HTML)
- [ ] Active state uses `var(--brand-primary)`
- [ ] Entry animations with `<Animate>` or `<Stagger>`
- [ ] No background behind icons
- [ ] No gradients (except AI features)
