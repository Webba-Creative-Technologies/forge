# Forge - Webba Design System

> **Codename:** WSS3 (Webba Style System 3)
> **Version:** 2.0
> Reusable across all Webba projects

---

## Documentation

| File | Description | Read When |
|------|-------------|-----------|
| **QUICK_REFERENCE.md** | Copy-paste ready snippets | FIRST - Before implementing anything |
| **AI_INTEGRATION_GUIDE.md** | Detailed behaviors & states | When you need to understand component behavior |
| **COMPONENTS.md** | Full component API reference | When you need all props/options |
| **GUIDELINES.md** | Best practices & patterns | When setting up or reviewing |

### For AI Assistants

**CRITICAL:** Read `QUICK_REFERENCE.md` before writing ANY code using Forge.

Key rules:
1. **NEVER add custom CSS hover/transition** - Components include all animations
2. **ALWAYS use CSS variables** - Never hardcode colors
3. **ALWAYS use Forge components** - Never raw HTML for UI elements
4. **NO background behind icons** - Use ghost/transparent icon buttons, never add bg color behind icons
5. **NO gradient abuse** - Gradients are reserved for AI-related features only (GradientButton, AI indicators)

---

## Installation

```bash
npm install wss3-forge
# or
yarn add wss3-forge
# or
pnpm add wss3-forge
```

## Icons

**Fluent UI 2** is the official icon system of Forge (included with the package).

```tsx
import { Add20Regular, Delete20Regular, Settings20Regular } from '@fluentui/react-icons'

// Available sizes: 12, 16, 20, 24, 28, 32, 48
// Variants: Regular, Filled
```

| Size | Usage |
|------|-------|
| 12px | Inline chevrons |
| 16px | Navigation, badges |
| 20px | Buttons, toolbars |
| 24px | Headers, main actions |
| 48px | Empty states |

## Components

### Button
Buttons with variants: primary, secondary, ghost, destructive, icon

```tsx
import { Button, IconButton } from 'wss3-forge'

<Button variant="primary">Create</Button>
<Button variant="destructive">Delete</Button>
<IconButton icon={<Add20Regular />} title="Add" />
```

### Card
Cards with variants: default, stat, project, progress

```tsx
import { Card, StatCard, ProjectCard } from 'wss3-forge'

<Card>Content</Card>
<StatCard icon={<Money20Regular />} label="Total" value="$1000" color="#10b981" />
<ProjectCard name="My Project" color="#A35BFF" progress={75} />
```

### Modal
Modal system with header, content, footer

```tsx
import { Modal } from 'wss3-forge'

<Modal open={open} onClose={() => setOpen(false)} title="Title">
  <Modal.Content>...</Modal.Content>
  <Modal.Footer>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

### CommandBar
AI command bar (Ctrl+K)

```tsx
import { CommandBar } from 'wss3-forge'

<CommandBar
  open={open}
  onClose={() => setOpen(false)}
  onSearch={handleSearch}
  onAiQuery={handleAiQuery}
  results={results}
  aiResponse={aiResponse}
/>
```

### Input
Form fields: text, textarea, select

```tsx
import { Input, Textarea, Select } from 'wss3-forge'

<Input label="Name" value={name} onChange={setName} />
<Textarea label="Description" rows={4} />
<Select label="Status" options={['Active', 'Inactive']} />
```

### Badge
Badges/Tags with color variants

```tsx
import { Badge } from 'wss3-forge'

<Badge>Default</Badge>
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Urgent</Badge>
```

### Avatar
User avatars

```tsx
import { Avatar, AvatarStack } from 'wss3-forge'

<Avatar name="John Doe" />
<AvatarStack users={[...]} max={3} />
```

### Dropdown
Dropdown and context menus

```tsx
import { Dropdown, SelectDropdown, ContextMenu, useContextMenu } from 'wss3-forge'

// Simple dropdown menu
<Dropdown
  trigger={<Button>Options</Button>}
  items={[
    { id: 'edit', label: 'Edit', icon: <Edit20Regular />, onClick: () => {} },
    { id: 'divider', divider: true },
    { id: 'delete', label: 'Delete', onClick: () => {}, destructive: true }
  ]}
/>

// With categories
<Dropdown
  trigger={<Button>Actions</Button>}
  categories={[
    { label: 'File', items: [...] },
    { label: 'Edit', items: [...] }
  ]}
/>

// Controlled select
<SelectDropdown
  value={status}
  onChange={setStatus}
  options={[
    { value: 'active', label: 'Active', icon: <CheckCircle20Regular /> },
    { value: 'inactive', label: 'Inactive' }
  ]}
  placeholder="Select..."
/>

// Context menu (right click)
const { showContextMenu, ContextMenuComponent } = useContextMenu()

<div onContextMenu={(e) => showContextMenu(e, menuItems)}>
  Right click here
</div>
{ContextMenuComponent}
```

### Tabs
Tabs with variants: default, pills, underline

```tsx
import { Tabs, TabPanels, TabPanel, Pills } from 'wss3-forge'

// Tabs with variants
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', icon: <Home20Regular /> },
    { id: 'tasks', label: 'Tasks', badge: 5 },
    { id: 'settings', label: 'Settings', disabled: true }
  ]}
  active={activeTab}
  onChange={setActiveTab}
  variant="pills" // 'default' | 'pills' | 'underline'
  size="md" // 'sm' | 'md' | 'lg'
  fullWidth={false}
/>

<TabPanels active={activeTab}>
  <TabPanel id="overview" active={activeTab}>Overview content</TabPanel>
  <TabPanel id="tasks" active={activeTab}>Tasks content</TabPanel>
</TabPanels>

// Pills for filtering
<Pills
  options={[
    { id: 'all', label: 'All', count: 42 },
    { id: 'active', label: 'Active', count: 30 },
    { id: 'completed', label: 'Completed', count: 12 }
  ]}
  selected={filter}
  onChange={setFilter}
  multiple={false}
/>
```

### DatePicker
Date and datetime pickers

```tsx
import { DatePicker, DateTimePicker } from 'wss3-forge'

// Date picker with calendar
<DatePicker
  value={date}
  onChange={setDate}
  label="Due date"
  placeholder="Select a date"
  minDate={new Date()}
  maxDate={new Date('2025-12-31')}
  locale="en-US"
/>

// Datetime picker (native input)
<DateTimePicker
  value={datetime}
  onChange={setDatetime}
  label="Date and time"
/>
```

## Hooks

### useAssistant
Hook for AI integration

```tsx
import { useAssistant } from 'wss3-forge'

const { query, response, loading, submit } = useAssistant({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  context: getAppContext()
})
```

## Styles

### CSS Animations

```css
@import 'wss3-forge/styles';
```

Available animations:
- `fadeIn` / `fadeOut`
- `scaleIn` / `scaleOut`
- `slideIn` / `slideOut`
- `spin`
- `pulse`
- `glowPulse`
- `borderSweepIn`

### Scrollbars

CSS classes to style scrollbars:

```tsx
// Standard (8px)
<div className="forge-scrollbar" style={{ overflow: 'auto' }}>...</div>

// Thin (6px)
<div className="forge-scrollbar-thin" style={{ overflow: 'auto' }}>...</div>

// Minimal (4px, very subtle)
<div className="forge-scrollbar-minimal" style={{ overflow: 'auto' }}>...</div>

// Auto-hide (appears on hover)
<div className="forge-scrollbar-auto" style={{ overflow: 'auto' }}>...</div>

// Hidden (scrollable but invisible)
<div className="forge-scrollbar-hidden" style={{ overflow: 'auto' }}>...</div>

// Global (applies to all children)
<div className="forge-scrollbar-global">...</div>
```

| Class | Width | Description |
|-------|-------|-------------|
| `forge-scrollbar` | 8px | Standard, visible |
| `forge-scrollbar-thin` | 6px | Thinner |
| `forge-scrollbar-minimal` | 4px | Very subtle |
| `forge-scrollbar-auto` | 8px | Appears on hover |
| `forge-scrollbar-hidden` | - | Invisible but scrollable |
| `forge-scrollbar-global` | 8px | Applies to all descendants |
| `forge-scrollbar-gutter` | - | Reserves space (prevents shift) |

## Required CSS Variables

The design system uses these CSS variables:

```css
:root {
  --brand-primary: #A35BFF;
  --brand-secondary: #FD9173;
  --bg-primary: #070707;
  --bg-secondary: #0c0c0c;
  --bg-tertiary: #1a1a1a;
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --text-muted: #737373;
  --border-color: #404040;
}
```
