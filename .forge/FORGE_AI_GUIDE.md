# Forge Design System - Complete AI Integration Guide
### Webba Creative Technologies - 2025 | Version 3.0.2

> **IMPORTANT FOR AI ASSISTANTS**: If a user mentions "Forge", "wss3-forge", or asks you to build UI with this design system, you MUST read this entire document before writing any code. This ensures correct component usage, proper imports, and adherence to design guidelines.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Principles](#core-principles)
3. [Component Aliases](#component-aliases)
4. [Setup & Providers](#setup--providers)
5. [Custom Theming](#custom-theming)
6. [All Components Reference](#all-components-reference)
7. [Hooks Reference](#hooks-reference)
8. [Constants Reference](#constants-reference)
9. [CSS Variables](#css-variables)
10. [Rules & Best Practices](#rules--best-practices)
11. [Common Patterns](#common-patterns)
12. [Troubleshooting](#troubleshooting)

---

## Quick Start

```tsx
// 1. Install
npm install wss3-forge @fluentui/react-icons

// 2. Setup providers
import { ForgeProvider, ToastProvider, NotificationProvider } from 'wss3-forge'

function App() {
  return (
    <ForgeProvider mode="dark">
      <ToastProvider position="bottom-right">
        <NotificationProvider>
          <YourApp />
        </NotificationProvider>
      </ToastProvider>
    </ForgeProvider>
  )
}

// 3. Use components
import { Button, Card, Input, Modal } from 'wss3-forge'
```

---

## Core Principles

### 1. Icons: Fluent UI 2 ONLY
```tsx
// ✅ CORRECT - Use Fluent UI icons
import { Add20Regular, Settings20Regular, Delete20Regular } from '@fluentui/react-icons'

// ❌ WRONG - Never use other icon libraries
import { FaPlus } from 'react-icons/fa'      // NO
import { Plus } from 'lucide-react'           // NO
import { IoAdd } from 'react-icons/io5'       // NO
```

**Icon naming:** `{Name}{Size}{Style}`
- Sizes: `12`, `16`, `20`, `24`, `28`, `32`, `48`
- Styles: `Regular` (outline), `Filled` (solid)
- Example: `Settings20Regular`, `Home24Filled`

### 2. Colors: CSS Variables ONLY
```tsx
// ✅ CORRECT - Use CSS variables
<div style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>

// ❌ WRONG - Never hardcode colors
<div style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
```

### 3. Single Import Source
```tsx
// ✅ CORRECT
import { Button, Card, Modal, Input } from 'wss3-forge'

// ❌ WRONG - No deep imports
import { Button } from 'wss3-forge/components/Button'
```

### 4. NO CUSTOM CSS - CRITICAL RULE

> **⛔ CRITICAL: NEVER add custom CSS to Forge components.**

Forge components are designed to work out-of-the-box. Adding custom CSS breaks:
- Theme consistency
- Dark/light mode switching
- Responsive behavior
- Component updates

```tsx
// ❌ WRONG - Custom CSS on components
<Button style={{ backgroundColor: '#ff0000', borderRadius: '20px' }}>Save</Button>
<Card style={{ boxShadow: '0 10px 20px black', border: '2px solid blue' }}>Content</Card>
<Input style={{ fontSize: '20px', padding: '30px' }} />

// ❌ WRONG - Custom className overrides
<Button className="my-custom-button">Save</Button>
<Card className={styles.customCard}>Content</Card>

// ✅ CORRECT - Use component props
<Button variant="primary" size="lg">Save</Button>
<Card variant="outlined" padding="lg">Content</Card>
<Input label="Name" error="Required" />

// ✅ CORRECT - Use CSS variables for colors if needed
<div style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}>
  Custom container
</div>
```

**What you CAN customize:**
- Layout properties: `margin`, `marginTop`, `marginBottom`, `width`, `maxWidth`, `flex`
- Positioning: `position`, `top`, `left`, `right`, `bottom`
- Display: `display`, `alignSelf`

**What you MUST NOT customize:**
- Colors: `backgroundColor`, `color`, `borderColor` (use CSS variables or variants)
- Typography: `fontSize`, `fontWeight`, `fontFamily` (use component props)
- Spacing inside: `padding`, `gap` (use component props)
- Borders: `border`, `borderRadius`, `boxShadow` (use variants)
- Effects: `opacity`, `transform`, `filter` (use component props)

---

## Component Aliases

> **IMPORTANT**: When users ask for components by names from other UI frameworks, use these Forge equivalents.

| Other Frameworks | Forge Component | Description |
|------------------|-----------------|-------------|
| `Alert`, `Message`, `Callout`, `InlineAlert` | **Banner** | Inline feedback messages (success, error, warning, info) |
| `Snackbar`, `Notification` | **Toast** | Temporary popup notifications |
| `Dialog`, `Popup`, `Overlay` | **Modal** | Full-screen overlay dialogs |
| `AlertDialog`, `ConfirmationModal` | **ConfirmDialog** | Confirmation dialogs with yes/no actions |
| `BottomSheet`, `Drawer`, `ActionSheet` | **Sheet** | Sliding panels from edges |
| `Loader`, `Loading`, `ActivityIndicator` | **Spinner** | Loading spinner indicator |
| `Placeholder`, `Shimmer` | **Skeleton** | Loading placeholder with shimmer |
| `Progress`, `LinearProgress` | **ProgressBar** | Horizontal progress indicator |
| `CircularProgress`, `ProgressCircle` | **ProgressRing** | Circular progress indicator |
| `Menu`, `ContextMenu`, `DropdownMenu` | **Dropdown** | Context/action menus |
| `Popup`, `HoverCard` | **Popover** | Popup content on hover/click |
| `CommandPalette`, `Spotlight`, `kbar`, `cmdk` | **CommandBar** | Search and command palette (Ctrl+K) |
| `Onboarding`, `Walkthrough`, `Joyride` | **Tour** | Step-by-step user guides |
| `TextField`, `TextInput` | **Input** | Text input field |
| `Dropdown`, `Picker`, `Combobox` | **Select** | Dropdown selection |
| `Toggle` | **Switch** | Boolean toggle switch |
| `Calendar`, `DateInput` | **DatePicker** | Date selection |
| `Range`, `RangeSlider` | **Slider** | Value range slider |
| `Stars`, `StarRating` | **Rating** | Star rating input |
| `ChipInput`, `MultiSelect`, `TagsInput` | **TagInput** | Multiple tag input |
| `Dropzone`, `FilePicker`, `Upload` | **FileUpload** | File upload with drag & drop |
| `FAB`, `FloatingActionButton` | **FloatButton** | Floating action button |

### Example Usage

```tsx
// User asks: "I need an Alert component"
// ✅ CORRECT - Use Banner (Forge's equivalent of Alert)
import { Banner } from 'wss3-forge'

<Banner variant="error" title="Error">
  Something went wrong. Please try again.
</Banner>

// User asks: "I need a Snackbar"
// ✅ CORRECT - Use Toast (Forge's equivalent of Snackbar)
import { useToast } from 'wss3-forge'

const { toast } = useToast()
toast.success('Action completed!')
```

---

## Setup & Providers

### ForgeProvider (Required)
Root wrapper that provides theme and CSS variables.

```tsx
import { ForgeProvider } from 'wss3-forge'

// Basic usage
<ForgeProvider mode="dark">
  <App />
</ForgeProvider>

// With custom theme
<ForgeProvider
  mode="dark"
  theme={{
    brandPrimary: '#3B82F6',
    brandSecondary: '#60A5FA'
  }}
>
  <App />
</ForgeProvider>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'dark' \| 'light'` | `'dark'` | Theme mode |
| `theme` | `Partial<ForgeTheme>` | - | Custom theme overrides |
| `shadows` | `boolean` | `true` | Enable/disable shadows globally on all components |
| `children` | `ReactNode` | - | App content |

### ToastProvider (For toast notifications)
```tsx
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-right' \| 'top-center' \| 'bottom-left' \| 'bottom-right' \| 'bottom-center'` | `'bottom-right'` | Toast position |

### NotificationProvider (For persistent notifications)
```tsx
<NotificationProvider position="top-right">
  <App />
</NotificationProvider>
```

### NavigationProvider (For navigation state)
```tsx
<NavigationProvider>
  <App />
</NavigationProvider>
```

### Complete Setup Example
```tsx
import {
  ForgeProvider,
  ToastProvider,
  NotificationProvider,
  NavigationProvider,
  CookieConsent
} from 'wss3-forge'

function Root() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark')

  return (
    <ForgeProvider mode={mode}>
      <NavigationProvider>
        <ToastProvider position="bottom-right">
          <NotificationProvider position="top-right">
            <App />
            <CookieConsent
              variant="floating"
              position="bottom-left"
            />
          </NotificationProvider>
        </ToastProvider>
      </NavigationProvider>
    </ForgeProvider>
  )
}
```

---

## Custom Theming

Forge supports extensive theme customization through the ForgeProvider. You can customize colors, border radius, spacing, and fonts for both light and dark modes.

### Basic Theme Customization

```tsx
<ForgeProvider
  mode="dark"
  theme={{
    // Brand colors
    brandPrimary: '#3B82F6',
    brandSecondary: '#60A5FA',

    // Border radius
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '12px',
    radiusXl: '16px',
    radiusFull: '9999px',

    // Font
    fontFamily: 'Inter, system-ui, sans-serif'
  }}
>
  <App />
</ForgeProvider>
```

### Separate Light/Dark Theme Colors

You can customize colors independently for light and dark modes:

```tsx
<ForgeProvider
  mode="dark"
  theme={{
    // Shared settings (apply to both modes)
    radiusLg: '16px',
    radiusXl: '20px',
    fontFamily: 'Inter, system-ui, sans-serif',

    // Light mode specific colors
    light: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      bgActive: '#e0f2fe',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      brandPrimary: '#2563eb',
      brandSecondary: '#3b82f6',
      borderColor: '#e2e8f0',
      borderSubtle: '#f1f5f9'
    },

    // Dark mode specific colors
    dark: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#141414',
      bgTertiary: '#1f1f1f',
      bgActive: '#1e3a5f',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
      brandPrimary: '#3b82f6',
      brandSecondary: '#60a5fa',
      borderColor: '#27272a',
      borderSubtle: '#1f1f1f'
    }
  }}
>
  <App />
</ForgeProvider>
```

### All Theme Properties

| Property | Type | Description |
|----------|------|-------------|
| `brandPrimary` | `string` | Primary brand color |
| `brandSecondary` | `string` | Secondary brand color |
| `bgPrimary` | `string` | Main background |
| `bgSecondary` | `string` | Secondary background (cards, inputs) |
| `bgTertiary` | `string` | Tertiary background (hover states) |
| `bgActive` | `string` | Active/selected background |
| `textPrimary` | `string` | Primary text color |
| `textSecondary` | `string` | Secondary text color |
| `textMuted` | `string` | Muted/disabled text |
| `borderColor` | `string` | Default border color |
| `borderSubtle` | `string` | Subtle border color |
| `success` | `string` | Success color |
| `warning` | `string` | Warning color |
| `error` | `string` | Error color |
| `info` | `string` | Info color |
| `radiusSm` | `string` | Small radius (buttons, badges) |
| `radiusMd` | `string` | Medium radius |
| `radiusLg` | `string` | Large radius (cards, modals) |
| `radiusXl` | `string` | Extra large radius |
| `radiusFull` | `string` | Full radius (pills, avatars) |
| `fontFamily` | `string` | Font family |

### Pre-built Color Presets

Here are some recommended color combinations:

```tsx
// Purple (Default)
brandPrimary: '#8B5CF6', brandSecondary: '#A78BFA'

// Blue
brandPrimary: '#3B82F6', brandSecondary: '#60A5FA'

// Green
brandPrimary: '#10B981', brandSecondary: '#34D399'

// Orange
brandPrimary: '#F97316', brandSecondary: '#FB923C'

// Red
brandPrimary: '#EF4444', brandSecondary: '#F87171'

// Pink
brandPrimary: '#EC4899', brandSecondary: '#F472B6'

// Cyan
brandPrimary: '#06B6D4', brandSecondary: '#22D3EE'

// Coral
brandPrimary: '#E75C36', brandSecondary: '#FFA490'
```

### Border Radius Presets

```tsx
// Square (0px)
radiusSm: '0px', radiusMd: '0px', radiusLg: '0px', radiusXl: '0px'

// Sharp (4px)
radiusSm: '2px', radiusMd: '4px', radiusLg: '4px', radiusXl: '6px'

// Subtle (8px) - Default
radiusSm: '4px', radiusMd: '6px', radiusLg: '8px', radiusXl: '10px'

// Rounded (12px)
radiusSm: '6px', radiusMd: '8px', radiusLg: '12px', radiusXl: '16px'

// Extra (20px)
radiusSm: '8px', radiusMd: '12px', radiusLg: '20px', radiusXl: '24px'

// Pill (9999px) - For buttons/badges only, containers use Extra
radiusSm: '9999px', radiusMd: '9999px', radiusLg: '20px', radiusXl: '24px'
```

### Font Family Options

```tsx
// System (Default)
fontFamily: 'system-ui, -apple-system, sans-serif'

// Inter
fontFamily: 'Inter, system-ui, sans-serif'

// Geist
fontFamily: 'Geist, system-ui, sans-serif'

// Poppins
fontFamily: 'Poppins, system-ui, sans-serif'

// Space Grotesk
fontFamily: 'Space Grotesk, system-ui, sans-serif'

// Monospace (for code-heavy apps)
fontFamily: 'JetBrains Mono, Fira Code, monospace'
```

### Complete Custom Theme Example

```tsx
import { ForgeProvider, ToastProvider, NotificationProvider } from 'wss3-forge'

function App() {
  return (
    <ForgeProvider
      mode="dark"
      theme={{
        // Border radius - Rounded style
        radiusSm: '6px',
        radiusMd: '8px',
        radiusLg: '12px',
        radiusXl: '16px',
        radiusFull: '9999px',

        // Font
        fontFamily: 'Inter, system-ui, sans-serif',

        // Light mode
        light: {
          bgPrimary: '#ffffff',
          bgSecondary: '#fafafa',
          bgTertiary: '#f4f4f5',
          bgActive: '#dbeafe',
          textPrimary: '#18181b',
          textSecondary: '#52525b',
          textMuted: '#a1a1aa',
          brandPrimary: '#2563eb',
          brandSecondary: '#3b82f6',
          borderColor: '#e4e4e7',
          borderSubtle: '#f4f4f5'
        },

        // Dark mode
        dark: {
          bgPrimary: '#09090b',
          bgSecondary: '#18181b',
          bgTertiary: '#27272a',
          bgActive: '#1e3a5f',
          textPrimary: '#fafafa',
          textSecondary: '#a1a1aa',
          textMuted: '#71717a',
          brandPrimary: '#3b82f6',
          brandSecondary: '#60a5fa',
          borderColor: '#27272a',
          borderSubtle: '#1f1f1f'
        }
      }}
    >
      <ToastProvider position="bottom-right">
        <NotificationProvider>
          <YourApp />
        </NotificationProvider>
      </ToastProvider>
    </ForgeProvider>
  )
}
```

### Theme Creator Tool

Use the Theme Creator at `/create` to visually design your theme and generate the configuration code. The tool provides:
- Real-time preview in light and dark modes
- Color, radius, and font presets
- Advanced mode for fine-grained control
- Copy-paste ready code generation

---

## All Components Reference

### Typography

#### Heading
```tsx
import { Heading } from 'wss3-forge'

<Heading level={1}>H1 Title</Heading>
<Heading level={2} color="muted">H2 Subtitle</Heading>
<Heading level={3}>H3 Section</Heading>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level |
| `color` | `'primary' \| 'secondary' \| 'muted'` | `'primary'` | Text color |
| `style` | `CSSProperties` | - | Custom styles |

#### Text
```tsx
import { Text } from 'wss3-forge'

<Text>Default text</Text>
<Text size="lg" weight="bold">Large bold text</Text>
<Text size="sm" color="muted">Small muted text</Text>
<Text color="secondary">Secondary text</Text>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Text size |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'normal'` | Font weight |
| `color` | `'primary' \| 'secondary' \| 'muted'` | `'primary'` | Text color |
| `as` | `ElementType` | `'p'` | HTML element |

#### Label
```tsx
import { Label } from 'wss3-forge'

<Label htmlFor="email">Email</Label>
<Label htmlFor="name" required>Name</Label>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | - | Associated input ID |
| `required` | `boolean` | `false` | Shows required indicator |

#### Link
```tsx
import { Link } from 'wss3-forge'

<Link href="/about">Internal link</Link>
<Link href="https://example.com" external>External link</Link>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | - | Link URL |
| `external` | `boolean` | `false` | Opens in new tab |

#### Kbd
```tsx
import { Kbd } from 'wss3-forge'

<Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
```

#### Shortcut
```tsx
import { Shortcut } from 'wss3-forge'

<Shortcut keys={['Ctrl', 'Shift', 'P']} />
<Shortcut keys={['⌘', 'K']} />
```

---

### Buttons

#### Button
```tsx
import { Button } from 'wss3-forge'
import { Add20Regular } from '@fluentui/react-icons'

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icon
<Button icon={<Add20Regular />}>Add Item</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | Button style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `disabled` | `boolean` | `false` | Disables button |
| `fullWidth` | `boolean` | `false` | Takes full width |
| `icon` | `ReactNode` | - | Icon element |
| `onClick` | `() => void` | - | Click handler |

#### IconButton
```tsx
import { IconButton } from 'wss3-forge'
import { Settings20Regular } from '@fluentui/react-icons'

<IconButton icon={<Settings20Regular />} onClick={handleClick} />
<IconButton icon={<Settings20Regular />} variant="ghost" />
<IconButton icon={<Settings20Regular />} size="sm" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | Required | Icon element |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'ghost'` | Button style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `onClick` | `() => void` | - | Click handler |

#### GradientButton
Special button for AI features only. Uses brand gradient.

```tsx
import { GradientButton } from 'wss3-forge'
import { Sparkle20Regular } from '@fluentui/react-icons'

<GradientButton icon={<Sparkle20Regular />}>
  AI Generate
</GradientButton>
```

#### FloatButton
Floating action button (FAB).

```tsx
import { FloatButton, FloatButtonGroup, BackToTop } from 'wss3-forge'
import { Add20Regular, Document20Regular, Image20Regular } from '@fluentui/react-icons'

// Single FAB
<FloatButton
  icon={<Add20Regular />}
  onClick={handleClick}
  position="bottom-right"
/>

// FAB with menu
<FloatButtonGroup
  icon={<Add20Regular />}
  position="bottom-right"
  items={[
    { icon: <Document20Regular />, label: 'Document', onClick: () => {} },
    { icon: <Image20Regular />, label: 'Image', onClick: () => {} }
  ]}
/>

// Back to top button
<BackToTop threshold={300} />
```

**FloatButton Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | Required | Icon element |
| `position` | `'bottom-right' \| 'bottom-left' \| 'bottom-center'` | `'bottom-right'` | Position |
| `onClick` | `() => void` | - | Click handler |

#### CopyButton
```tsx
import { CopyButton, CopyField } from 'wss3-forge'

<CopyButton text="Text to copy" />

<CopyField
  value="https://example.com/share/abc123"
  label="Share link"
/>
```

---

### Cards & Layout

#### Card
```tsx
import { Card } from 'wss3-forge'

// Basic card
<Card>Content</Card>

// With props
<Card
  padding="lg"
  hoverable
  onClick={handleClick}
>
  Clickable card
</Card>

// With header
<Card
  title="Card Title"
  subtitle="Card description"
  action={{ label: 'View', onClick: handleClick }}
>
  Card content
</Card>

// Variants
<Card variant="default">Default (bg-secondary)</Card>
<Card variant="subtle">Subtle (bg-tertiary) - for info boxes</Card>
<Card variant="outlined">Outlined (transparent with border)</Card>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'subtle' \| 'outlined'` | `'default'` | Card style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Padding size |
| `hoverable` | `boolean` | `false` | Adds hover effect |
| `onClick` | `() => void` | - | Makes card clickable |
| `title` | `string` | - | Card header title |
| `subtitle` | `string` | - | Card header subtitle |
| `action` | `{ label: string, onClick: () => void }` | - | Header action button |

> **⚠️ Warning:** Don't use `variant="subtle"` with `Button variant="ghost"` inside - they have the same hover background. Use `Button variant="secondary"` instead.

#### ImageCard
```tsx
import { ImageCard, Badge } from 'wss3-forge'

<ImageCard
  image="/photo.jpg"
  imageHeight={180}
  title="Card Title"
  subtitle="Subtitle"
  description="Optional description text"
  badge={<Badge variant="success">New</Badge>}
  actions={<Button size="sm">View</Button>}
  onClick={handleClick}
/>
```

#### HorizontalCard
```tsx
import { HorizontalCard, Badge } from 'wss3-forge'

<HorizontalCard
  image="/photo.jpg"
  imageWidth={120}
  title="Title"
  subtitle="Subtitle"
  description="Description text"
  meta={<Badge>Category</Badge>}
  actions={<Button size="sm">Action</Button>}
/>
```

#### ActionCard
```tsx
import { ActionCard, Button } from 'wss3-forge'
import { Settings20Regular } from '@fluentui/react-icons'

<ActionCard
  title="Settings"
  subtitle="Configure your preferences"
  icon={<Settings20Regular />}
  iconColor="var(--brand-primary)"
  actions={
    <>
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button size="sm">Save</Button>
    </>
  }
>
  Optional content
</ActionCard>
```

#### StatCard
```tsx
import { StatCard } from 'wss3-forge'
import { People20Regular, Money20Regular } from '@fluentui/react-icons'

// Layout: label top-left, icon top-right, change below label, large value at bottom
<StatCard
  label="Revenue"
  value="12,450 EUR"
  change={12}
  changeLabel="vs last month"
  icon={<Money20Regular />}
  color="var(--success)"
/>

<StatCard
  label="Users"
  value="1,234"
  change={-5}
  changeLabel="vs last week"
  icon={<People20Regular />}
/>

<StatCard
  label="Orders"
  value="89"
  subtitle="This month"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Stat name (top-left) |
| `value` | `string \| number` | Required | Large value (bottom-left) |
| `icon` | `ReactNode` | - | Icon element (top-right) |
| `color` | `string` | `'var(--brand-primary)'` | Icon color |
| `change` | `number` | - | Change percentage (positive/negative number) |
| `changeLabel` | `string` | - | Text after change badge (e.g., "vs last month") |
| `subtitle` | `string` | - | Small text below value |
| `onClick` | `() => void` | - | Click handler |

#### MiniStat
```tsx
import { MiniStat } from 'wss3-forge'
import { Folder20Regular } from '@fluentui/react-icons'

<MiniStat
  icon={<Folder20Regular />}
  value={42}
  label="Projects"
  color="var(--brand-primary)"
/>
```

#### InfoCard
```tsx
import { InfoCard } from 'wss3-forge'
import { Info20Regular } from '@fluentui/react-icons'

<InfoCard title="Note" icon={<Info20Regular />}>
  Information content here
</InfoCard>

<InfoCard title="Settings" padding="lg">
  More spacious content
</InfoCard>
```

#### Section
```tsx
import { Section, Button } from 'wss3-forge'

<Section
  title="My Projects"
  actions={<Button size="sm">New Project</Button>}
>
  {/* Section content */}
</Section>
```

#### PageHeader
```tsx
import { PageHeader, Button } from 'wss3-forge'
import { Add20Regular } from '@fluentui/react-icons'

<PageHeader
  title="Dashboard"
  subtitle="Overview of your projects"
  actions={
    <Button icon={<Add20Regular />}>New Project</Button>
  }
/>
```

#### EmptyState
```tsx
import { EmptyState, Button } from 'wss3-forge'
import { Folder20Regular } from '@fluentui/react-icons'

<EmptyState
  icon={<Folder20Regular />}
  title="No projects yet"
  description="Create your first project to get started"
  action={<Button>Create Project</Button>}
/>
```

#### ProgressBar
```tsx
import { ProgressBar } from 'wss3-forge'

<ProgressBar value={65} />
<ProgressBar value={65} max={100} showLabel />
<ProgressBar value={65} color="var(--success)" />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | Required | Current value |
| `max` | `number` | `100` | Maximum value |
| `showLabel` | `boolean` | `false` | Shows percentage |
| `color` | `string` | `'var(--brand-primary)'` | Bar color |

---

### Forms & Inputs

#### Input
```tsx
import { Input } from 'wss3-forge'
import { Mail20Regular, Search20Regular } from '@fluentui/react-icons'

<Input
  placeholder="Enter text..."
  value={value}
  onChange={e => setValue(e.target.value)}
/>

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  icon={<Mail20Regular />}
/>

<Input
  label="Password"
  type="password"
  error="Password is required"
/>

<Input
  placeholder="Search..."
  icon={<Search20Regular />}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `type` | `string` | `'text'` | Input type |
| `value` | `string` | - | Controlled value |
| `onChange` | `ChangeEventHandler` | - | Change handler |
| `icon` | `ReactNode` | - | Left icon |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disables input |

#### Textarea
```tsx
import { Textarea } from 'wss3-forge'

<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
  value={value}
  onChange={e => setValue(e.target.value)}
/>
```

#### Select
```tsx
import { Select } from 'wss3-forge'

<Select
  label="Status"
  value={status}
  onChange={value => setStatus(value)}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ]}
/>

<Select
  label="Country"
  placeholder="Select a country..."
  options={countries}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label |
| `options` | `Array<{ value: string, label: string }>` | Required | Options list |
| `value` | `string` | - | Selected value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `placeholder` | `string` | - | Placeholder text |

#### SearchInput
```tsx
import { SearchInput } from 'wss3-forge'

<SearchInput
  value={search}
  onChange={setSearch}
  onClear={() => setSearch('')}
  placeholder="Search..."
/>
```

#### Checkbox
```tsx
import { Checkbox } from 'wss3-forge'

<Checkbox
  checked={accepted}
  onChange={setAccepted}
  label="I accept the terms"
/>

<Checkbox
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
  description="Receive email notifications for updates"
/>

<Checkbox
  checked={selected}
  onChange={setSelected}
  indeterminate={someSelected}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | Required | Checked state |
| `onChange` | `(checked: boolean) => void` | Required | Change handler |
| `label` | `string` | - | Checkbox label |
| `description` | `string` | - | Additional description |
| `indeterminate` | `boolean` | `false` | Indeterminate state |
| `disabled` | `boolean` | `false` | Disables checkbox |
| `size` | `'sm' \| 'md'` | `'md'` | Checkbox size |

#### Switch
```tsx
import { Switch, SwitchGroup } from 'wss3-forge'

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Dark mode"
/>

<SwitchGroup
  items={[
    { id: 'email', label: 'Email notifications', checked: true },
    { id: 'sms', label: 'SMS notifications', checked: false },
    { id: 'push', label: 'Push notifications', checked: true }
  ]}
  onChange={(id, checked) => handleChange(id, checked)}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | Required | Checked state |
| `onChange` | `(checked: boolean) => void` | Required | Change handler |
| `label` | `string` | - | Switch label |
| `disabled` | `boolean` | `false` | Disables switch |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size |

#### Radio & RadioGroup
```tsx
import { Radio, RadioGroup, RadioCardGroup } from 'wss3-forge'

// Basic radio group
<RadioGroup
  name="priority"
  value={priority}
  onChange={setPriority}
  options={[
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]}
/>

// Card-style radio group
<RadioCardGroup
  value={plan}
  onChange={setPlan}
  options={[
    { value: 'free', label: 'Free', description: '$0/month' },
    { value: 'pro', label: 'Pro', description: '$29/month' },
    { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing' }
  ]}
/>
```

#### FormGroup
Wrapper for consistent form field layout with label and error.

```tsx
import { FormGroup, Input } from 'wss3-forge'

<FormGroup
  label="Email"
  error={errors.email}
  required
>
  <Input
    type="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    placeholder="you@example.com"
  />
</FormGroup>
```

#### Slider
```tsx
import { Slider, RangeSlider } from 'wss3-forge'

// Single value slider
<Slider
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
/>

// Range slider
<RangeSlider
  value={[minPrice, maxPrice]}
  onChange={([min, max]) => {
    setMinPrice(min)
    setMaxPrice(max)
  }}
  min={0}
  max={1000}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | Required | Current value |
| `onChange` | `(value: number) => void` | Required | Change handler |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `animated` | `boolean` | `true` | Enable animation |

#### NumberInput
```tsx
import { NumberInput } from 'wss3-forge'

<NumberInput
  value={quantity}
  onChange={setQuantity}
  min={0}
  max={100}
  step={1}
/>

<NumberInput
  label="Price"
  value={price}
  onChange={setPrice}
  min={0}
  step={0.01}
  prefix="$"
/>
```

#### TagInput
```tsx
import { TagInput, EmailTagInput } from 'wss3-forge'

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add a tag..."
/>

<EmailTagInput
  value={emails}
  onChange={setEmails}
  placeholder="Add email..."
/>
```

#### Combobox
```tsx
import { Combobox, MultiCombobox } from 'wss3-forge'

// Single select combobox
<Combobox
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' }
  ]}
  searchable
  placeholder="Select framework..."
/>

// Multi-select combobox
<MultiCombobox
  value={selectedTags}
  onChange={setSelectedTags}
  options={tagOptions}
  creatable
  placeholder="Select or create tags..."
/>
```

#### DatePicker
```tsx
import { DatePicker, DateTimePicker, DateRangePicker } from 'wss3-forge'

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Select date"
  minDate={new Date()}
  maxDate={new Date('2025-12-31')}
  locale="fr-FR"
/>

<DateTimePicker
  value={datetime}
  onChange={setDatetime}
/>

<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onStartChange={setStartDate}
  onEndChange={setEndDate}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | - | Selected date |
| `onChange` | `(date: Date \| null) => void` | Required | Change handler |
| `placeholder` | `string` | `'Select date'` | Placeholder text |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `locale` | `string` | `'fr-FR'` | Locale for formatting |
| `disabled` | `boolean` | `false` | Disable picker |

#### TimePicker
```tsx
import { TimePicker, TimeRangePicker } from 'wss3-forge'

<TimePicker
  value={time}
  onChange={setTime}
  format="24h"
/>

<TimeRangePicker
  startTime={startTime}
  endTime={endTime}
  onStartChange={setStartTime}
  onEndChange={setEndTime}
/>
```

#### ColorPicker
```tsx
import { ColorPicker, ColorSwatch, ColorPalette, PROJECT_COLORS } from 'wss3-forge'

<ColorPicker
  value={color}
  onChange={setColor}
/>

<ColorSwatch
  color="#A35BFF"
  selected={color === '#A35BFF'}
  onClick={() => setColor('#A35BFF')}
/>

<ColorPalette
  colors={PROJECT_COLORS}
  value={color}
  onChange={setColor}
/>
```

#### FileUpload
```tsx
import { FileUpload, AvatarUpload } from 'wss3-forge'

<FileUpload
  onUpload={handleFiles}
  accept="image/*,.pdf"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
/>

<AvatarUpload
  value={avatarUrl}
  onUpload={handleAvatarUpload}
/>
```

#### OTPInput
```tsx
import { OTPInput, PINInput } from 'wss3-forge'

<OTPInput
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={handleVerify}
/>

<PINInput
  length={4}
  value={pin}
  onChange={setPin}
  masked
/>
```

#### PhoneInput
```tsx
import { PhoneInput } from 'wss3-forge'

<PhoneInput
  value={phone}
  onChange={setPhone}
  defaultCountry="FR"
/>
```

#### Rating
```tsx
import { Rating, RatingDisplay } from 'wss3-forge'

// Interactive rating
<Rating
  value={rating}
  onChange={setRating}
  max={5}
/>

// Display only
<RatingDisplay
  value={4.5}
  showValue
/>
```

---

### Badges & Tags

#### Badge
```tsx
import { Badge } from 'wss3-forge'

<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// With dot indicator
<Badge variant="success" dot>Active</Badge>

// Removable
<Badge onRemove={() => handleRemove()}>Removable</Badge>

// Clickable
<Badge onClick={() => handleClick()}>Clickable</Badge>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Badge style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `dot` | `boolean` | `false` | Shows dot indicator |
| `onRemove` | `() => void` | - | Makes badge removable |
| `onClick` | `() => void` | - | Makes badge clickable |

#### StatusBadge
```tsx
import { StatusBadge } from 'wss3-forge'

<StatusBadge status="active" />
<StatusBadge status="inactive" />
<StatusBadge status="pending" />
<StatusBadge status="completed" />
<StatusBadge status="error" />
<StatusBadge status="draft" />

// With custom label
<StatusBadge status="active" label="En ligne" />
```

**Status Types:** `'active' | 'inactive' | 'pending' | 'completed' | 'error' | 'draft'`

#### PriorityBadge
```tsx
import { PriorityBadge } from 'wss3-forge'

<PriorityBadge priority="low" />
<PriorityBadge priority="medium" />
<PriorityBadge priority="high" />
<PriorityBadge priority="urgent" />
```

#### CountBadge
```tsx
import { CountBadge } from 'wss3-forge'

<CountBadge count={5} />
<CountBadge count={99} max={99} />
<CountBadge count={150} max={99} /> // Shows "99+"
```

---

### Navigation

#### Tabs
```tsx
import { Tabs, TabPanels, TabPanel, PillTabs } from 'wss3-forge'
import { Home20Regular, Settings20Regular } from '@fluentui/react-icons'

const [activeTab, setActiveTab] = useState('overview')

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', icon: <Home20Regular /> },
    { id: 'settings', label: 'Settings', icon: <Settings20Regular /> },
    { id: 'notifications', label: 'Notifications', badge: 5 }
  ]}
  active={activeTab}
  onChange={setActiveTab}
/>

<TabPanels active={activeTab}>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
  <TabPanel id="notifications">Notifications content</TabPanel>
</TabPanels>

// Pill-style tabs
<PillTabs
  tabs={tabs}
  activeTab={filter}
  onChange={setFilter}
/>
```

**Tab Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Array<{ id: string, label: string, icon?: ReactNode, badge?: number }>` | Required | Tab items |
| `active` | `string` | Required | Active tab ID |
| `onChange` | `(id: string) => void` | Required | Change handler |
| `variant` | `'default' \| 'underline' \| 'pills'` | `'default'` | Tab style |

#### Breadcrumbs
```tsx
import { Breadcrumbs } from 'wss3-forge'

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'My Project' }  // Last item has no href (current page)
  ]}
/>
```

#### Stepper
```tsx
import { Stepper, StepContent, StepActions, useStepper } from 'wss3-forge'

const { currentStep, next, prev, goTo, isFirst, isLast } = useStepper(3)

<Stepper
  steps={[
    { label: 'Information', description: 'Enter your details' },
    { label: 'Configuration', description: 'Set preferences' },
    { label: 'Confirmation', description: 'Review and confirm' }
  ]}
  currentStep={currentStep}
/>

<StepContent step={0} currentStep={currentStep}>
  Step 1 content
</StepContent>
<StepContent step={1} currentStep={currentStep}>
  Step 2 content
</StepContent>
<StepContent step={2} currentStep={currentStep}>
  Step 3 content
</StepContent>

<StepActions>
  <Button variant="secondary" onClick={prev} disabled={isFirst}>
    Back
  </Button>
  <Button onClick={next}>
    {isLast ? 'Finish' : 'Next'}
  </Button>
</StepActions>
```

#### Pagination
```tsx
import { Pagination, SimplePagination, TablePagination } from 'wss3-forge'

// Full pagination
<Pagination
  currentPage={page}
  totalPages={10}
  onChange={setPage}
/>

// Simple prev/next
<SimplePagination
  currentPage={page}
  totalPages={10}
  onPrev={() => setPage(p => p - 1)}
  onNext={() => setPage(p => p + 1)}
/>

// Table pagination with page size
<TablePagination
  page={page}
  pageSize={10}
  total={100}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

#### Navbar
```tsx
import { Navbar } from 'wss3-forge'

<Navbar
  logo={<Logo />}
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'about', label: 'About', href: '/about' }
  ]}
  activeItem="home"
  rightContent={<Button size="sm">Login</Button>}
  sticky
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `ReactNode` | - | Logo element |
| `items` | `Array<{ id: string, label: string, href: string }>` | Required | Nav items |
| `activeItem` | `string` | - | Active item ID |
| `rightContent` | `ReactNode` | - | Right side content |
| `sticky` | `boolean` | `true` | Sticky on scroll |

#### AppSidebar
Full-featured sidebar navigation component.

```tsx
import { AppSidebar } from 'wss3-forge'
import { Home20Regular, Settings20Regular, People20Regular } from '@fluentui/react-icons'

<AppSidebar
  mode="inline"
  logo={<Logo />}
  sections={[
    {
      title: 'Main',
      items: [
        { id: 'home', label: 'Home', icon: <Home20Regular /> },
        { id: 'users', label: 'Users', icon: <People20Regular />, badge: 5 },
        {
          id: 'settings-section',
          label: 'Settings',
          icon: <Settings20Regular />,
          children: [
            { id: 'settings/general', label: 'General' },
            { id: 'settings/security', label: 'Security' }
          ],
          defaultOpen: true
        }
      ]
    }
  ]}
  activeId="home"
  onNavigate={(id) => navigate(id)}
  showSearch
  onSearchClick={() => setSearchOpen(true)}
  bottomItems={[
    { id: 'help', label: 'Help', icon: <Question20Regular /> }
  ]}
  footerContent={<Text size="xs">v1.0.0</Text>}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'inline' \| 'drawer'` | `'inline'` | Display mode |
| `open` | `boolean` | `true` | Open state (drawer mode) |
| `onClose` | `() => void` | - | Close handler (drawer mode) |
| `position` | `'left' \| 'right'` | `'left'` | Position (drawer mode) |
| `logo` | `ReactNode` | - | Logo element |
| `sections` | `NavSection[]` | Required | Navigation sections |
| `activeId` | `string` | - | Active item ID |
| `onNavigate` | `(id: string) => void` | - | Navigation handler |
| `showHeader` | `boolean` | `true` | Show logo and search |
| `showSearch` | `boolean` | `true` | Show search button |
| `searchPlaceholder` | `string` | `'Rechercher...'` | Search placeholder |
| `onSearchClick` | `() => void` | - | Search click handler |
| `bottomItems` | `NavItem[]` | - | Bottom navigation items |
| `footerContent` | `ReactNode` | - | Footer content |
| `width` | `number` | `280` | Sidebar width |
| `height` | `string` | `'100dvh'` | Sidebar height |
| `accentColor` | `string` | `'var(--active-color)'` | Active item color |

**NavSection Type:**
```tsx
interface NavSection {
  title?: string
  items: NavItem[]
}

interface NavItem {
  id: string
  label: string
  icon: ReactNode
  badge?: number | string
  onClick?: () => void
  children?: NavItem[]  // For collapsible subitems
  defaultOpen?: boolean
}
```

#### BottomNav
```tsx
import { BottomNav } from 'wss3-forge'
import { Home20Regular, Search20Regular, Person20Regular } from '@fluentui/react-icons'

<BottomNav
  items={[
    { id: 'home', icon: <Home20Regular />, label: 'Home' },
    { id: 'search', icon: <Search20Regular />, label: 'Search' },
    { id: 'profile', icon: <Person20Regular />, label: 'Profile' }
  ]}
  activeItem={activeNav}
  onChange={setActiveNav}
/>
```

#### Footer
```tsx
import { Footer, SimpleFooter } from 'wss3-forge'

// Full footer
<Footer
  logo={<Logo />}
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ]
    }
  ]}
  copyright="© 2024 Company"
/>

// Simple footer (recommended - auto year)
<SimpleFooter companyName="My Company" />
// Output: "© 2025 My Company. All rights reserved."

<SimpleFooter
  companyName="Webba"
  links={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ]}
/>
```

> **Best Practice:** Always use `SimpleFooter` with `companyName` prop - it automatically updates the year.

---

### Overlays & Modals

#### Modal
```tsx
import { Modal, Button } from 'wss3-forge'

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  subtitle="Optional subtitle"
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
  Modal content goes here
</Modal>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | Required | Open state |
| `onClose` | `() => void` | Required | Close handler |
| `title` | `string` | - | Modal title |
| `subtitle` | `string` | - | Modal subtitle |
| `width` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | Modal width |
| `actions` | `ReactNode` | - | Footer actions |
| `showCloseButton` | `boolean` | `true` | Show close button in header |
| `ariaLabel` | `string` | - | Accessible label (for modals without title) |

#### ConfirmDialog
```tsx
import { ConfirmDialog, AlertDialog } from 'wss3-forge'

<ConfirmDialog
  open={open}
  title="Delete Item?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
/>

<AlertDialog
  open={open}
  title="Error"
  message="An error occurred. Please try again."
  onClose={() => setOpen(false)}
/>
```

#### Drawer / Sheet
```tsx
import { Drawer, Sheet, BottomSheet } from 'wss3-forge'

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  position="right"
  size="md"
  title="Drawer Title"
>
  Drawer content
</Drawer>

<Sheet
  open={open}
  onClose={handleClose}
  position="right"
  title="Details"
>
  Sheet content
</Sheet>

<BottomSheet
  open={open}
  onClose={handleClose}
  title="Options"
>
  Mobile-friendly content
</BottomSheet>
```

#### Dropdown
```tsx
import { Dropdown, SelectDropdown } from 'wss3-forge'
import { Edit20Regular, Delete20Regular } from '@fluentui/react-icons'

<Dropdown
  trigger={<Button>Actions</Button>}
  items={[
    { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
    { id: 'duplicate', label: 'Duplicate' },
    { type: 'divider' },
    { id: 'delete', label: 'Delete', icon: <Delete20Regular />, danger: true }
  ]}
  onSelect={handleAction}
/>

<SelectDropdown
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  placeholder="Select..."
/>
```

#### Popover
```tsx
import { Popover, HoverCard } from 'wss3-forge'

<Popover
  trigger={<Button>Open Popover</Button>}
  content={
    <div style={{ padding: 16 }}>
      Popover content
    </div>
  }
  position="bottom"
/>

<HoverCard
  trigger={<span>Hover me</span>}
  content={<div>Additional info on hover</div>}
/>
```

#### Tooltip
```tsx
import { Tooltip, InfoTooltip } from 'wss3-forge'

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>

<Tooltip content="Shortcut: Ctrl+S" position="top">
  <Button>Save</Button>
</Tooltip>

// Info icon with tooltip
<InfoTooltip>
  This is helpful information about this feature.
</InfoTooltip>
```

#### CommandBar
Command palette (Cmd+K / Ctrl+K style).

```tsx
import { CommandBar } from 'wss3-forge'

<CommandBar
  open={open}
  onClose={() => setOpen(false)}
  onSearch={handleSearch}
  onAiQuery={handleAiQuery}
  placeholder="Type a command or search..."
  commands={[
    { id: 'new', label: 'New Project', shortcut: 'N' },
    { id: 'settings', label: 'Settings', shortcut: 'S' }
  ]}
/>
```

---

### Data Display

#### Table
```tsx
import { Table, SimpleTable } from 'wss3-forge'

<Table
  title="Team Members"
  subtitle="Manage your team"
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <Badge variant={value === 'Active' ? 'success' : 'default'}>{value}</Badge>
    },
    {
      key: 'actions',
      header: '',
      render: (value, row) => (
        <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
          Edit
        </Button>
      )
    }
  ]}
  data={users}
  searchable
  pagination
  pageSize={10}
  selectable
  selectedKeys={selectedIds}
  onSelectionChange={setSelectedIds}
  onRowClick={handleRowClick}
  noPadding={false}  // Set to true to remove all padding
  globalActions={    // Action buttons in header (right side)
    <>
      <Button variant="ghost" size="sm" icon={<Filter20Regular />}>Filter</Button>
      <Button variant="primary" size="sm" icon={<Add20Regular />}>Add</Button>
    </>
  }
/>

// Simple table without features
<SimpleTable
  headers={['Name', 'Value']}
  rows={[
    ['Item 1', '$100'],
    ['Item 2', '$200']
  ]}
/>
```

**Table Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | Required | Array of data objects |
| `columns` | `Column<T>[]` | Required | Column definitions |
| `keyField` | `keyof T` | `'id'` | Unique key field in data |
| `title` | `string` | - | Table header title |
| `subtitle` | `string` | - | Table header subtitle |
| `searchable` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `searchKeys` | `string[]` | - | Fields to search in |
| `filters` | `FilterConfig[]` | - | Filter dropdown configurations |
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedKeys` | `string[]` | `[]` | Selected row keys |
| `onSelectionChange` | `(keys: string[]) => void` | - | Selection change handler |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `defaultSort` | `{ key: string; direction: 'asc' \| 'desc' }` | - | Default sort configuration |
| `pagination` | `boolean` | `true` | Show pagination |
| `pageSize` | `number` | `10` | Items per page |
| `onRowClick` | `(row: T) => void` | - | Row click handler |
| `rowActions` | `(row: T) => RowAction[]` | - | Per-row action menu |
| `globalActions` | `ReactNode` | - | Header action buttons |
| `loading` | `boolean` | `false` | Show loading state |
| `striped` | `boolean` | `false` | Striped row styling |
| `compact` | `boolean` | `false` | Compact padding |
| `stickyHeader` | `boolean` | `true` | Sticky header on scroll |
| `noPadding` | `boolean` | `false` | Remove container padding |
| `emptyMessage` | `string` | `'No data'` | Empty state message |
| `emptyIcon` | `ReactNode` | - | Empty state icon |

#### Avatar
```tsx
import { Avatar, AvatarStack, AvatarGroup } from 'wss3-forge'

<Avatar
  src="/user.jpg"
  name="John Doe"
  size="md"
/>

<Avatar
  name="John Doe"
  size="lg"
  status="online"
/>

// Stack of avatars
<AvatarStack
  avatars={[
    { name: 'John', src: '/john.jpg' },
    { name: 'Jane', src: '/jane.jpg' },
    { name: 'Bob' }
  ]}
  max={3}
/>

// Avatar group with +N indicator
<AvatarGroup
  users={users}
  max={5}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image URL |
| `name` | `string` | - | User name (for initials fallback) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | - | Status indicator |

#### Timeline
```tsx
import { Timeline, ActivityTimeline } from 'wss3-forge'

<Timeline
  items={[
    {
      id: '1',
      title: 'Project created',
      date: '2024-01-01',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Development started',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '3',
      title: 'In review',
      date: '2024-02-01',
      status: 'active'
    }
  ]}
/>

<ActivityTimeline
  activities={[
    {
      id: '1',
      user: 'John',
      avatar: '/john.jpg',
      action: 'created the project',
      time: '2 hours ago'
    },
    {
      id: '2',
      user: 'Jane',
      action: 'added a comment',
      time: '1 hour ago'
    }
  ]}
/>
```

#### Accordion
```tsx
import { Accordion, AccordionItem, Collapsible, FAQAccordion } from 'wss3-forge'

<Accordion>
  <AccordionItem title="Section 1" defaultOpen>
    Content for section 1
  </AccordionItem>
  <AccordionItem title="Section 2">
    Content for section 2
  </AccordionItem>
  <AccordionItem title="Section 3">
    Content for section 3
  </AccordionItem>
</Accordion>

// Simple collapsible
<Collapsible title="Details">
  Hidden content that can be expanded
</Collapsible>

// FAQ style
<FAQAccordion
  items={[
    { question: 'What is Forge?', answer: 'A design system...' },
    { question: 'How do I install it?', answer: 'Run npm install...' }
  ]}
/>
```

#### CodeBlock
```tsx
import { CodeBlock, InlineCode, CodeDiff } from 'wss3-forge'

<CodeBlock
  code={`const greeting = "Hello, World!";
console.log(greeting);`}
  language="javascript"
  showLineNumbers
  copyable
/>

<p>
  Run <InlineCode>npm install</InlineCode> to install dependencies.
</p>

<CodeDiff
  before={`const x = 1;`}
  after={`const x = 2;`}
  language="javascript"
/>
```

#### TreeView
```tsx
import { TreeView, FileTree } from 'wss3-forge'

<TreeView
  data={[
    {
      id: '1',
      label: 'src',
      children: [
        { id: '2', label: 'components' },
        { id: '3', label: 'pages' }
      ]
    }
  ]}
  onSelect={handleSelect}
/>

<FileTree
  files={[
    { path: 'src/index.ts', type: 'file' },
    { path: 'src/components/', type: 'folder' }
  ]}
  onFileClick={handleFileClick}
/>
```

---

### Feedback & Loading

#### Toast
```tsx
import { useToast } from 'wss3-forge'

function MyComponent() {
  const toast = useToast()

  const handleSuccess = () => {
    toast.success('Successfully saved!')
  }

  const handleError = () => {
    toast.error('An error occurred')
  }

  const handleInfo = () => {
    toast.info('Here is some information')
  }

  const handleWarning = () => {
    toast.warning('Please be careful')
  }
}
```

#### Notification
```tsx
import { useNotification } from 'wss3-forge'

function MyComponent() {
  const notification = useNotification()

  const showNotification = () => {
    notification.show({
      title: 'New Message',
      description: 'You have received a new message',
      type: 'info',
      action: {
        label: 'View',
        onClick: () => handleView()
      }
    })
  }
}
```

#### Banner
```tsx
import { Banner, AnnouncementBanner } from 'wss3-forge'

// Borderless banners with colored backgrounds
<Banner variant="info" title="Information">
  This is an informational message.
</Banner>

<Banner variant="warning" title="Critical">
  Please review your settings immediately.
</Banner>

<Banner variant="error" title="Error" dismissible onDismiss={handleDismiss}>
  An error occurred while processing.
</Banner>

<Banner variant="success" title="Success">
  Your changes have been saved.
</Banner>

<Banner variant="brand" title="New Feature">
  Check out our latest update!
</Banner>

// With action button
<Banner
  variant="info"
  title="Update Available"
  action={{ label: 'Update Now', onClick: handleUpdate }}
  dismissible
>
  A new version is ready to install.
</Banner>

// Promo banner (full-width gradient)
<AnnouncementBanner href="/new-feature" dismissible>
  New feature available! Check it out.
</AnnouncementBanner>
```

**Banner Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Banner content |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error' \| 'brand' \| 'neutral'` | `'info'` | Style variant |
| `title` | `string` | - | Bold title text |
| `icon` | `ReactNode` | - | Custom icon (default based on variant) |
| `action` | `{ label: string; onClick: () => void }` | - | Action button |
| `dismissible` | `boolean` | `false` | Show close button |
| `onDismiss` | `() => void` | - | Close callback |
| `position` | `'top' \| 'bottom' \| 'inline'` | `'inline'` | Fixed or inline position |
| `size` | `'sm' \| 'md'` | `'md'` | Banner size |

#### Spinner
```tsx
import { Spinner, LoadingOverlay } from 'wss3-forge'

<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />

<LoadingOverlay visible={isLoading}>
  <Content />
</LoadingOverlay>
```

#### Skeleton
```tsx
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar
} from 'wss3-forge'

// Basic shapes
<Skeleton width={200} height={20} />
<Skeleton width={40} height={40} circle />

// Text placeholder
<SkeletonText lines={3} />

// Component placeholders
<SkeletonCard />
<SkeletonTable rows={5} columns={4} />
<SkeletonAvatar size="md" />
```

---

### Charts

#### BarChart
```tsx
import { BarChart, GroupedBarChart } from 'wss3-forge'

<BarChart
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 120 }
  ]}
  height={200}
/>

<GroupedBarChart
  data={[
    { label: 'Q1', values: [100, 80] },
    { label: 'Q2', values: [120, 90] }
  ]}
  series={['Revenue', 'Expenses']}
  colors={['var(--brand-primary)', 'var(--brand-secondary)']}
/>
```

#### LineChart
```tsx
import { LineChart, MultiLineChart } from 'wss3-forge'

<LineChart
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 120 }
  ]}
  height={200}
/>

<MultiLineChart
  data={[
    { label: 'Jan', values: [100, 80] },
    { label: 'Feb', values: [150, 90] }
  ]}
  series={[
    { name: 'Revenue', color: 'var(--brand-primary)' },
    { name: 'Expenses', color: 'var(--error)' }
  ]}
/>
```

#### DonutChart
```tsx
import { DonutChart } from 'wss3-forge'

<DonutChart
  data={[
    { label: 'Active', value: 60, color: 'var(--success)' },
    { label: 'Pending', value: 25, color: 'var(--warning)' },
    { label: 'Inactive', value: 15, color: 'var(--text-muted)' }
  ]}
  size={200}
  showLegend
/>
```

#### Sparkline
```tsx
import { Sparkline } from 'wss3-forge'

<Sparkline
  data={[10, 15, 8, 20, 14, 18]}
  width={100}
  height={30}
  color="var(--brand-primary)"
/>
```

#### ProgressRing
```tsx
import { ProgressRing } from 'wss3-forge'

<ProgressRing
  value={75}
  size={80}
  label="75%"
/>
```

---

### Media

#### ImageGallery
```tsx
import { ImageGallery, Lightbox } from 'wss3-forge'

<ImageGallery
  images={[
    { id: '1', src: '/img1.jpg', alt: 'Image 1' },
    { id: '2', src: '/img2.jpg', alt: 'Image 2' }
  ]}
  columns={3}
  gap="md"
  onImageClick={(image, index) => openLightbox(index)}
/>

<Lightbox
  images={images}
  currentIndex={currentIndex}
  open={lightboxOpen}
  onClose={() => setLightboxOpen(false)}
  onNext={() => setCurrentIndex(i => i + 1)}
  onPrev={() => setCurrentIndex(i => i - 1)}
/>
```

#### Carousel
```tsx
import { Carousel, CarouselSlide, ImageCarousel } from 'wss3-forge'

<Carousel
  autoPlay
  interval={5000}
  showDots
  showArrows
>
  <CarouselSlide>
    <img src="/slide1.jpg" alt="Slide 1" />
  </CarouselSlide>
  <CarouselSlide>
    <img src="/slide2.jpg" alt="Slide 2" />
  </CarouselSlide>
</Carousel>

<ImageCarousel
  images={[
    { src: '/img1.jpg', alt: 'Image 1' },
    { src: '/img2.jpg', alt: 'Image 2' }
  ]}
/>
```

#### VideoPlayer
```tsx
import { VideoPlayer } from 'wss3-forge'

<VideoPlayer
  src="/video.mp4"
  poster="/poster.jpg"
  onPlay={handlePlay}
  onPause={handlePause}
  onEnded={handleEnded}
/>
```

**Keyboard shortcuts:** `k` play/pause, `f` fullscreen, `m` mute, `j`/`l` ±10s

#### AudioPlayer
```tsx
import { AudioPlayer, MiniAudioPlayer } from 'wss3-forge'

<AudioPlayer
  src="/audio.mp3"
  title="Track Title"
  artist="Artist Name"
  cover="/cover.jpg"
/>

<MiniAudioPlayer src="/audio.mp3" title="Podcast Episode" />
```

---

### Layout Components

#### Container
Constrains content width and centers it.

```tsx
import { Container } from 'wss3-forge'

<Container>
  {/* Content max-width: 1280px (xl breakpoint) */}
</Container>

<Container maxWidth="lg">
  {/* Max-width: 1024px */}
</Container>

<Container maxWidth={800}>
  {/* Max-width: 800px */}
</Container>

<Container maxWidth="full">
  {/* Full width */}
</Container>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' \| number` | `'xl'` | Maximum width |
| `padding` | `string \| number` | `'1rem'` | Horizontal padding |
| `center` | `boolean` | `true` | Center with auto margins |

#### Stack / VStack / HStack
```tsx
import { Stack, VStack, HStack } from 'wss3-forge'

// Vertical stack
<VStack gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</VStack>

// Horizontal stack
<HStack gap="sm" style={{ alignItems: 'center' }}>
  <Avatar name="John" />
  <Text>John Doe</Text>
</HStack>

// Generic stack
<Stack direction="column" gap="lg">
  {items.map(item => <Card key={item.id} />)}
</Stack>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Space between items |
| `direction` | `'row' \| 'column'` | - | Stack direction |

#### Grid
```tsx
import { Grid } from 'wss3-forge'

<Grid
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap="md"
>
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</Grid>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number \| ResponsiveValue<number>` | Required | Number of columns |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Gap between items |

#### Flex
```tsx
import { Flex, Center, Spacer } from 'wss3-forge'

<Flex align="center" justify="between">
  <Logo />
  <Navigation />
</Flex>

<Center style={{ height: 200 }}>
  Centered content
</Center>

<Flex>
  <div>Left</div>
  <Spacer />
  <div>Right</div>
</Flex>
```

#### Divider
```tsx
import { Divider, VerticalDivider, SectionDivider } from 'wss3-forge'

<Divider />
<Divider label="or" />
<VerticalDivider />
<SectionDivider label="New Section" />
```

#### Show / Hide
```tsx
import { Show, Hide } from 'wss3-forge'

<Show on="mobile">
  <MobileNavigation />
</Show>

<Hide on="mobile">
  <DesktopNavigation />
</Hide>

<Show on={['tablet', 'desktop']}>
  <Sidebar />
</Show>
```

---

### Animation

#### Animate
```tsx
import { Animate } from 'wss3-forge'

<Animate type="fadeIn">
  <Card>Fades in</Card>
</Animate>

<Animate type="slideInUp" delay={100}>
  <Card>Slides up with delay</Card>
</Animate>

<Animate type="scaleIn" duration={300}>
  <Card>Scales in</Card>
</Animate>
```

**Animation Types:** `fadeIn`, `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`, `scaleIn`

#### Stagger
```tsx
import { Stagger } from 'wss3-forge'

<Stagger type="slideInUp" stagger={50}>
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</Stagger>
```

---

## Hooks Reference

### useForge
Access theme context and global settings.

```tsx
import { useForge } from 'wss3-forge'

function MyComponent() {
  const { theme, isDark, mode, shadows } = useForge()

  return (
    <div style={{
      color: theme.textPrimary,
      boxShadow: shadows ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
    }}>
      Current mode: {mode}
    </div>
  )
}
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `theme` | `ForgeTheme` | Current theme object with all color values |
| `isDark` | `boolean` | `true` if dark mode is active |
| `mode` | `'dark' \| 'light'` | Current theme mode |
| `shadows` | `boolean` | Whether shadows are enabled globally |

### useToast
Show toast notifications.

```tsx
import { useToast } from 'wss3-forge'

function MyComponent() {
  const toast = useToast()

  toast.success('Saved!')
  toast.error('Error occurred')
  toast.info('Information')
  toast.warning('Warning')
}
```

### useNotification
Show persistent notifications.

```tsx
import { useNotification } from 'wss3-forge'

function MyComponent() {
  const notification = useNotification()

  notification.show({
    title: 'New Task',
    description: 'You have been assigned a task',
    type: 'info',
    action: { label: 'View', onClick: () => {} }
  })
}
```

### useStepper
Manage stepper state.

```tsx
import { useStepper } from 'wss3-forge'

function MyComponent() {
  const {
    currentStep,
    next,
    prev,
    goTo,
    isFirst,
    isLast
  } = useStepper(totalSteps)
}
```

### useMediaQuery
Check media query.

```tsx
import { useMediaQuery } from 'wss3-forge'

function MyComponent() {
  const isWide = useMediaQuery('(min-width: 1024px)')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
}
```

### useBreakpoint
Get current breakpoint.

```tsx
import { useBreakpoint } from 'wss3-forge'

function MyComponent() {
  const breakpoint = useBreakpoint()
  // Returns: 'mobile' | 'tablet' | 'desktop'
}
```

### useIsMobile / useIsTablet / useIsDesktop
Device detection.

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from 'wss3-forge'

function MyComponent() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
}
```

### useResponsiveValue
Get value based on current breakpoint.

```tsx
import { useResponsiveValue } from 'wss3-forge'

function MyComponent() {
  const columns = useResponsiveValue({
    mobile: 1,
    tablet: 2,
    desktop: 4
  })
}
```

### useDraggableScroll
Enable drag-to-scroll on horizontal containers (like tabs, carousels).

```tsx
import { useDraggableScroll } from 'wss3-forge'

function HorizontalScroller() {
  const { containerRef, isDragging, handlers } = useDraggableScroll()

  return (
    <div
      ref={containerRef}
      {...handlers}
      style={{
        display: 'flex',
        overflowX: 'auto',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {items.map(item => <Card key={item.id}>{item.name}</Card>)}
    </div>
  )
}
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `containerRef` | `RefObject<HTMLDivElement>` | Ref to attach to scroll container |
| `isDragging` | `boolean` | Whether user is currently dragging |
| `handlers` | `object` | Mouse event handlers (onMouseDown, onMouseMove, etc.) |

---

## Constants Reference

Forge exports useful constants for consistent styling:

```tsx
import {
  Z_INDEX,
  SHADOWS,
  COLORS,
  AVATAR_COLORS,
  STATUS_COLORS,
  CHART_COLORS
} from 'wss3-forge'
```

### Z_INDEX
Consistent z-index values for layering:

```tsx
Z_INDEX.base        // 0 - Default
Z_INDEX.dropdown    // 1000 - Dropdowns, tooltips
Z_INDEX.sticky      // 1100 - Sticky headers
Z_INDEX.fixed       // 1200 - Fixed elements
Z_INDEX.modalBackdrop // 1300 - Modal overlay
Z_INDEX.modal       // 1400 - Modal content
Z_INDEX.popover     // 1500 - Popovers
Z_INDEX.tooltip     // 1600 - Tooltips
Z_INDEX.toast       // 1700 - Toast notifications
Z_INDEX.drawer      // 1800 - Side drawers
Z_INDEX.max         // 9999 - Maximum z-index
```

### SHADOWS
Consistent shadow presets:

```tsx
// Elevation presets (common use cases)
SHADOWS.elevation.card     // Subtle card shadow
SHADOWS.elevation.dropdown // Dropdown menus
SHADOWS.elevation.modal    // Modal dialogs
SHADOWS.elevation.popover  // Popovers
SHADOWS.elevation.toast    // Toast notifications

// By size and hardness
SHADOWS.soft.sm    // Small soft shadow
SHADOWS.soft.md    // Medium soft shadow
SHADOWS.soft.lg    // Large soft shadow
SHADOWS.medium.sm  // Small medium shadow
SHADOWS.medium.md  // Medium shadow
SHADOWS.hard.sm    // Small hard shadow

SHADOWS.none       // No shadow
```

### COLOR CONSTANTS
```tsx
// General colors
COLORS.purple, COLORS.blue, COLORS.green, etc.

// Avatar background colors (pastel)
AVATAR_COLORS // Array of 12 colors

// Status colors
STATUS_COLORS.online, STATUS_COLORS.offline, STATUS_COLORS.busy, STATUS_COLORS.away

// Chart colors (for data visualization)
CHART_COLORS // Array of 8 distinct colors
```

---

## CSS Variables

All CSS variables are automatically injected by ForgeProvider.

### Brand Colors
```css
--brand-primary: #A35BFF    /* Primary brand color */
--brand-secondary: #FD9173  /* Secondary brand color */
--active-color: #BF8DFF     /* Active/selected state */
```

### Backgrounds
```css
--bg-primary: #070707       /* Main background */
--bg-secondary: #0c0c0c     /* Card backgrounds */
--bg-tertiary: #1a1a1a      /* Subtle backgrounds */
--bg-dropdown: #1f1f1f      /* Dropdown/popover */
--bg-hover: #2a2a2a         /* Hover states */
--bg-active: rgba(163, 91, 255, 0.12)  /* Active item background */
```

### Text Colors
```css
--text-primary: #fafafa     /* Primary text */
--text-secondary: #a3a3a3   /* Secondary text */
--text-muted: #737373       /* Muted/disabled text */
```

### Borders
```css
--border-color: #404040     /* Default borders */
--border-subtle: #404040    /* Subtle borders */
```

### Semantic Colors
```css
--success: #34d399          /* Success states */
--warning: #fb923c          /* Warning states */
--error: #f87171            /* Error states */
--info: #60a5fa             /* Info states */
```

### Border Radius
```css
--radius-xs: 4px
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

### Usage Example
```tsx
<div style={{
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '16px'
}}>
  Content
</div>
```

---

## Rules & Best Practices

### ✅ DO's

1. **Always wrap with ForgeProvider**
   ```tsx
   <ForgeProvider mode="dark">
     <App />
   </ForgeProvider>
   ```

2. **Use Fluent UI icons exclusively**
   ```tsx
   import { Add20Regular } from '@fluentui/react-icons'
   <Button icon={<Add20Regular />}>Add</Button>
   ```

3. **Use CSS variables for colors**
   ```tsx
   style={{ color: 'var(--text-primary)' }}
   ```

4. **Use semantic component variants**
   ```tsx
   <Badge variant="success">Active</Badge>
   <Button variant="danger">Delete</Button>
   ```

5. **Use Container for page content**
   ```tsx
   <Container>
     <PageContent />
   </Container>
   ```

6. **Use SimpleFooter with companyName**
   ```tsx
   <SimpleFooter companyName="Company" />
   ```

7. **Use FormGroup for form fields**
   ```tsx
   <FormGroup label="Email" error={error} required>
     <Input />
   </FormGroup>
   ```

8. **Handle loading states properly**
   ```tsx
   <Button loading={isLoading}>Save</Button>
   // or
   {isLoading ? <SkeletonCard /> : <Card />}
   ```

### ❌ DON'Ts

1. **⛔ NEVER add custom CSS to Forge components**
   ```tsx
   // ❌ WRONG - Custom styles on components
   <Button style={{ backgroundColor: '#ff0000' }}>Save</Button>
   <Card style={{ boxShadow: '0 10px 20px black' }}>Content</Card>
   <Input style={{ fontSize: '20px' }} />

   // ✅ CORRECT - Use component props and variants
   <Button variant="danger">Delete</Button>
   <Card variant="outlined" padding="lg">Content</Card>
   <Input label="Name" />
   ```

2. **Don't use other icon libraries**
   ```tsx
   // ❌ WRONG
   import { FaPlus } from 'react-icons/fa'
   ```

3. **Don't hardcode colors**
   ```tsx
   // ❌ WRONG
   style={{ backgroundColor: '#1a1a1a' }}

   // ✅ CORRECT - Use CSS variables
   style={{ backgroundColor: 'var(--bg-secondary)' }}
   ```

4. **Don't use text arrows or emoji**
   ```tsx
   // ❌ WRONG
   <span>Next →</span>
   <span>✓ Done</span>

   // ✅ CORRECT
   import { ArrowRight20Regular, Checkmark20Regular } from '@fluentui/react-icons'
   <span>Next <ArrowRight20Regular /></span>
   <span><Checkmark20Regular /> Done</span>
   ```

5. **Don't hardcode years in copyright**
   ```tsx
   // ❌ WRONG
   <Footer copyright="© 2024 Company" />

   // ✅ CORRECT
   <SimpleFooter companyName="Company" />
   ```

6. **Don't combine subtle Card with ghost Button**
   ```tsx
   // ❌ WRONG - Same hover background
   <Card variant="subtle">
     <Button variant="ghost">Action</Button>
   </Card>

   // ✅ CORRECT
   <Card variant="subtle">
     <Button variant="secondary">Action</Button>
   </Card>
   ```

7. **Don't create custom modals/dialogs/overlays**
   ```tsx
   // ❌ WRONG - Custom modal
   <div className="my-modal">...</div>

   // ✅ CORRECT - Use Forge Modal
   <Modal open={open} onClose={close}>...</Modal>
   ```

8. **Don't add custom className to override styles**
   ```tsx
   // ❌ WRONG
   <Button className="my-button">Save</Button>
   <Card className={styles.card}>Content</Card>

   // ✅ CORRECT - Use props
   <Button variant="primary" size="lg">Save</Button>
   <Card variant="outlined">Content</Card>
   ```

### 🎯 Usage Guidelines

These guidelines help you use components correctly and avoid common mistakes.

#### 1. Navbar + AppSidebar: Hide Sidebar Header
When using both `Navbar` and `AppSidebar` together, disable the sidebar header to avoid duplicate logos/search:

```tsx
// ❌ WRONG - Duplicate header elements
<Navbar logo={<Logo />} />
<AppSidebar logo={<Logo />} showSearch sections={sections} />

// ✅ CORRECT - Sidebar header hidden when navbar exists
<Navbar logo={<Logo />} onSearchClick={openSearch} />
<AppSidebar
  showHeader={false}  // Hide logo and search from sidebar
  sections={sections}
/>
```

#### 2. TOC (Table of Contents): Always Fixed
The `TOC` component should use `position="fixed"` for documentation pages:

```tsx
// ❌ WRONG - TOC scrolls with content
<TOC items={headings} />

// ✅ CORRECT - TOC stays fixed while scrolling
<TOC items={headings} position="fixed" />
```

#### 3. Tabs: Use lineStretch for Full-Width
When tabs should span the full container width, use `lineStretch`:

```tsx
// ❌ WRONG - Tabs bunched on the left
<Tabs tabs={tabs} value={tab} onChange={setTab} />

// ✅ CORRECT - Tabs stretch to fill container
<Tabs tabs={tabs} value={tab} onChange={setTab} lineStretch />
```

#### 4. Table: Use Built-in Features, Don't Duplicate
The `Table` component has built-in support for title, search, filters, and actions. Don't add external wrappers:

```tsx
// ❌ WRONG - External search bar and title
<VStack gap="md">
  <HStack justify="space-between">
    <Heading>Users</Heading>
    <Input placeholder="Search..." value={search} onChange={setSearch} />
  </HStack>
  <Table data={filteredData} columns={columns} searchable={false} />
</VStack>

// ✅ CORRECT - Use Table's built-in props
<Table
  data={data}
  columns={columns}
  title="Users"
  subtitle="Manage your team members"
  searchable
  searchPlaceholder="Search users..."
  globalActions={
    <Button icon={<Add20Regular />}>Add User</Button>
  }
/>
```

#### 5. Table: Use Built-in Actions
Don't wrap tables with external action buttons:

```tsx
// ❌ WRONG - External action buttons
<VStack gap="md">
  <HStack justify="end" gap="sm">
    <Button>Export</Button>
    <Button>Add New</Button>
  </HStack>
  <Table data={data} columns={columns} />
</VStack>

// ✅ CORRECT - Use globalActions prop
<Table
  data={data}
  columns={columns}
  globalActions={
    <HStack gap="sm">
      <Button variant="secondary" icon={<ArrowDownload20Regular />}>Export</Button>
      <Button icon={<Add20Regular />}>Add New</Button>
    </HStack>
  }
/>
```

#### 6. Table: Use Built-in Row Actions
For per-row actions, use the `rowActions` prop:

```tsx
// ❌ WRONG - Custom action column
const columns = [
  { key: 'name', header: 'Name' },
  {
    key: 'actions',
    header: '',
    render: (row) => (
      <HStack gap="xs">
        <IconButton icon={<Edit20Regular />} onClick={() => edit(row)} />
        <IconButton icon={<Delete20Regular />} onClick={() => remove(row)} />
      </HStack>
    )
  }
]

// ✅ CORRECT - Use rowActions prop
<Table
  data={data}
  columns={[{ key: 'name', header: 'Name' }]}
  rowActions={(row) => [
    { label: 'Edit', icon: <Edit20Regular />, onClick: () => edit(row) },
    { label: 'Delete', icon: <Delete20Regular />, onClick: () => remove(row), danger: true }
  ]}
/>
```

#### 7. Card: Use Appropriate Variant for Context
Choose card variants based on their container:

```tsx
// On primary background (--bg-primary)
<Card variant="default">Content</Card>  // Has bg-secondary

// On secondary background (--bg-secondary)
<Card variant="outlined">Content</Card>  // Transparent with border

// For interactive items (buttons, links inside)
<Card variant="subtle">Content</Card>  // Subtle hover effect
```

#### 8. Modal: Provide Accessible Labels
Always provide title or ariaLabel for screen readers:

```tsx
// ❌ WRONG - No accessible label
<Modal open={open} onClose={close}>
  <p>Are you sure?</p>
</Modal>

// ✅ CORRECT - With title
<Modal open={open} onClose={close} title="Confirm Action">
  <p>Are you sure?</p>
</Modal>

// ✅ CORRECT - With ariaLabel (when no visible title)
<Modal open={open} onClose={close} ariaLabel="Confirmation dialog">
  <p>Are you sure?</p>
</Modal>
```

#### 9. Dropdown: Use SelectDropdown for Forms
For form inputs, use `SelectDropdown` instead of `Dropdown`:

```tsx
// ❌ WRONG - Dropdown for form selection
<Dropdown trigger={<Button>{selected}</Button>}>
  <DropdownItem onClick={() => setSelected('Option 1')}>Option 1</DropdownItem>
  <DropdownItem onClick={() => setSelected('Option 2')}>Option 2</DropdownItem>
</Dropdown>

// ✅ CORRECT - SelectDropdown for forms
<SelectDropdown
  label="Choose option"
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ]}
/>
```

#### 10. Loading States: Component-Specific
Use the component's built-in loading prop when available:

```tsx
// ❌ WRONG - External spinner
{isLoading ? <Spinner /> : <Button onClick={save}>Save</Button>}

// ✅ CORRECT - Built-in loading state
<Button loading={isLoading} onClick={save}>Save</Button>

// ❌ WRONG - External skeleton
{isLoading ? <Skeleton /> : <Table data={data} columns={columns} />}

// ✅ CORRECT - Built-in loading state
<Table data={data} columns={columns} loading={isLoading} />
```

---

## Common Patterns

### Page Layout
```tsx
import { Container, PageHeader, VStack, Grid, Card } from 'wss3-forge'

function DashboardPage() {
  return (
    <Container>
      <VStack gap="lg">
        <PageHeader
          title="Dashboard"
          actions={<Button>New Project</Button>}
        />

        <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="md">
          <StatCard label="Users" value="1,234" change={12} changeLabel="vs last month" />
          <StatCard label="Revenue" value="$12,450" change={8} />
          <StatCard label="Orders" value="89" change={-3} changeLabel="vs last week" />
          <StatCard label="Conversion" value="12%" subtitle="This month" />
        </Grid>

        <Card title="Recent Activity">
          <ActivityTimeline activities={activities} />
        </Card>
      </VStack>
    </Container>
  )
}
```

### Form Pattern
```tsx
import { Card, VStack, FormGroup, Input, Button } from 'wss3-forge'

function ContactForm() {
  const [errors, setErrors] = useState({})

  return (
    <Card padding="lg">
      <VStack gap="md">
        <FormGroup label="Name" error={errors.name} required>
          <Input placeholder="Your name" />
        </FormGroup>

        <FormGroup label="Email" error={errors.email} required>
          <Input type="email" placeholder="you@example.com" />
        </FormGroup>

        <FormGroup label="Message" error={errors.message}>
          <Textarea rows={4} placeholder="Your message..." />
        </FormGroup>

        <Button fullWidth>Send Message</Button>
      </VStack>
    </Card>
  )
}
```

### Modal with Form
```tsx
import { Modal, VStack, FormGroup, Input, Button } from 'wss3-forge'

function CreateProjectModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Project"
      size="md"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </>
      }
    >
      <VStack gap="md">
        <FormGroup label="Project Name" required>
          <Input placeholder="My Project" />
        </FormGroup>
        <FormGroup label="Description">
          <Textarea rows={3} />
        </FormGroup>
      </VStack>
    </Modal>
  )
}
```

### List with Actions
```tsx
import { Card, HStack, VStack, Text, Button, Avatar, Badge } from 'wss3-forge'

function UserList({ users }) {
  return (
    <VStack gap="sm">
      {users.map(user => (
        <Card key={user.id} padding="md">
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <HStack gap="md" style={{ alignItems: 'center' }}>
              <Avatar src={user.avatar} name={user.name} />
              <VStack gap="xs">
                <Text weight="medium">{user.name}</Text>
                <Text size="sm" color="muted">{user.email}</Text>
              </VStack>
            </HStack>
            <HStack gap="sm">
              <Badge variant={user.active ? 'success' : 'default'}>
                {user.active ? 'Active' : 'Inactive'}
              </Badge>
              <Button size="sm" variant="ghost">Edit</Button>
            </HStack>
          </HStack>
        </Card>
      ))}
    </VStack>
  )
}
```

---

## Troubleshooting

### Components not styled correctly
- Ensure `ForgeProvider` wraps your app
- Check that CSS variables are being injected (inspect element)

### Icons not showing
- Install `@fluentui/react-icons`
- Import icons with correct naming: `{Name}{Size}{Style}`

### Toasts not appearing
- Ensure `ToastProvider` wraps your app
- Call `toast.success()` etc. inside a component

### Modal/Dropdown clipped
- Check for `overflow: hidden` on parent elements
- Forge uses portals, but parent styles can still affect positioning

### Dark/Light mode not switching
- Pass `mode` prop to `ForgeProvider`
- Use `useForge()` hook to access current mode

---

## Version Info

- **Package:** wss3-forge v1.0.14
- **React:** 18+
- **TypeScript:** 5+
- **Icons:** @fluentui/react-icons

---

## Recent Changes (v3.0.1)

### Fixes
- **AppSidebar**: Hover effects now work without external CSS dependencies
- **DatePicker**: Calendar no longer closes when clicking inside it
- **Banner**: Improved styling and borderless design

### New Features
- **Typography category**: New component category in documentation
- **AppSidebar**: Full props documentation with collapsible children support

---

## Quick Reference Card

### Essential Imports
```tsx
// Providers (wrap your app)
import { ForgeProvider, ToastProvider, NotificationProvider } from 'wss3-forge'

// Layout
import { Container, VStack, HStack, Grid, Card } from 'wss3-forge'

// Typography
import { Heading, Text } from 'wss3-forge'

// Forms
import { Input, Select, Checkbox, Switch, Button } from 'wss3-forge'

// Feedback
import { useToast, Banner, Modal, Spinner } from 'wss3-forge'

// Navigation
import { Navbar, AppSidebar, Tabs, Breadcrumbs } from 'wss3-forge'

// Icons (always from Fluent UI)
import { Add20Regular, Settings20Regular } from '@fluentui/react-icons'
```

### Golden Rules Summary
1. ⛔ **NO custom CSS** on Forge components
2. 🎨 **CSS variables** for all colors
3. 🔷 **Fluent UI icons** only
4. 📦 **Single import** from 'wss3-forge'
5. 🎯 **Use component props** for customization

---

> **For AI Assistants:** This document contains everything needed to correctly use the Forge design system. Always reference this guide when implementing UI with Forge components. When in doubt, use the documented patterns and follow the rules strictly. **NEVER add custom CSS to components.**
