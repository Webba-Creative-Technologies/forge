# Forge Design System - Guidelines

## Overview

Forge (WSS3 - Webba Style System 3) is a React component library built with TypeScript. It provides a consistent, themeable UI system for all Webba projects.

## Installation

```bash
npm install wss3-forge
# or
yarn add wss3-forge
# or
pnpm add wss3-forge
```

### Icons

Forge uses **Fluent UI 2** icons exclusively. Do not mix with other icon libraries.

```tsx
// Correct
import { Add20Regular, Settings20Filled } from '@fluentui/react-icons'

// Wrong - don't use other libraries
import { FaPlus } from 'react-icons/fa' // NO
import { Plus } from 'lucide-react' // NO
```

**Icon naming convention:**
- `20Regular` - Default outline style (most common)
- `20Filled` - Solid fill style (for active states)
- `24Regular` / `24Filled` - Larger size variant

```tsx
<Button icon={<Add20Regular />}>Add Item</Button>
<IconButton icon={<Settings20Regular />} />
```

## Setup

### Provider

Wrap your app with `ForgeProvider`:

```tsx
import { ForgeProvider, themes } from 'wss3-forge'

function App() {
  return (
    <ForgeProvider theme={themes.dark}>
      <YourApp />
    </ForgeProvider>
  )
}
```

### Available Themes

| Theme | Use Case |
|-------|----------|
| `themes.dark` | Default dark mode |
| `themes.light` | Light mode with purple accent (uses off-white #fcfcfd instead of pure white for easier on eyes) |

### Toast & Notifications

For toasts and notifications, add their providers:

```tsx
import { ForgeProvider, ToastProvider, NotificationProvider, themes } from 'wss3-forge'

<ForgeProvider theme={themes.dark}>
  <ToastProvider position="bottom-right">
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ToastProvider>
</ForgeProvider>
```

## Import Pattern

Import components from `wss3-forge`:

```tsx
// Correct - single import
import { Button, Card, Modal, Input } from 'wss3-forge'
```

## Styling

### CSS Variables

Forge injects CSS variables automatically. Use them in custom styles:

```tsx
const customStyle = {
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)'
}
```

**Available variables:**

```css
/* Brand */
--brand-primary
--brand-secondary

/* Backgrounds */
--bg-primary
--bg-secondary
--bg-tertiary
--bg-hover

/* Text */
--text-primary
--text-secondary
--text-muted

/* Borders */
--border-color

/* Semantic */
--success
--warning
--error
--info

/* Radius */
--radius-sm (4px)
--radius-md (8px)
--radius-lg (12px)
--radius-xl (16px)
```

### Inline Styles

Forge components use inline styles. For custom components, prefer CSS variables:

```tsx
// Good
<div style={{
  padding: 16,
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: 'var(--radius-md)'
}}>

// Avoid hardcoded colors
<div style={{ backgroundColor: '#1a1a1a' }}> // NO
```

## Component Patterns

### Buttons

```tsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icon
<Button icon={<Add20Regular />}>Add</Button>
```

### Forms

Always use `FormGroup` for consistent labeling and error handling:

```tsx
<FormGroup label="Email" error={errors.email} required>
  <Input
    type="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    placeholder="you@example.com"
  />
</FormGroup>
```

### Modals

```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
  actions={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  Modal content here
</Modal>
```

### Feedback

```tsx
// Toast (temporary)
const toast = useToast()
toast.success('Saved!')
toast.error('Failed')

// Notification (persistent)
const notification = useNotification()
notification.show({
  title: 'New message',
  description: 'You have a new notification',
  type: 'info'
})
```

## Responsive Design

### Hooks

```tsx
import { useIsMobile, useBreakpoint, useResponsiveValue } from 'wss3-forge'

// Boolean checks
const isMobile = useIsMobile()
const isDesktop = useIsDesktop()

// Current breakpoint
const breakpoint = useBreakpoint() // 'mobile' | 'tablet' | 'desktop'

// Responsive values
const columns = useResponsiveValue({ mobile: 1, tablet: 2, desktop: 4 })
```

### Components

```tsx
import { Show, Hide, Grid } from 'wss3-forge'

// Conditional rendering
<Show on="mobile"><MobileNav /></Show>
<Hide on="mobile"><DesktopNav /></Hide>

// Responsive grid
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  {items.map(item => <Card key={item.id} />)}
</Grid>
```

## Best Practices

### Do's

- Use Fluent UI icons consistently (including for arrows: `ArrowRight16Regular`, not "→")
- Wrap app with ForgeProvider
- Use CSS variables for colors
- Use semantic color names (success, error, warning)
- Use the provided layout components (Stack, Grid, Flex)
- Handle loading states with `loading` prop or Skeleton components
- Use `Container` component to limit content width on large screens
- Use `ScrollIndicator` for long pages to show reading progress
- Use `SimpleFooter` with `companyName` prop for automatic year in copyright

### Don'ts

- Don't mix icon libraries
- Don't hardcode colors
- Don't import from component subfolders
- Don't create custom modals/dialogs (use Modal, ConfirmDialog)
- Don't create custom form inputs (use Input, Select, etc.)
- Don't use text arrows ("→") - always use Fluent icons
- Don't use `Card variant="subtle"` with `Button variant="ghost"` inside (same hover background)
- Don't hardcode years in copyright - use `SimpleFooter companyName` prop

## Animation

### Entry Animations

```tsx
import { Animate, Stagger } from 'wss3-forge'

// Single element
<Animate type="fadeIn" delay={100}>
  <Card>Content</Card>
</Animate>

// List animation
<Stagger type="slideInUp" stagger={50}>
  {items.map(item => <Card key={item.id} />)}
</Stagger>
```

**Animation types:** `fadeIn`, `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`, `scaleIn`

## TypeScript

Forge exports all necessary types:

```tsx
import type {
  ForgeTheme,
  ButtonVariant,
  Size,
  Status,
  Priority
} from 'wss3-forge'
```
