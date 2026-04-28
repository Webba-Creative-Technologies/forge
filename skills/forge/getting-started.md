# Getting Started

A five-minute guide to shipping your first Forge screen.

## 1. Install

```bash
npm install wss3-forge @fluentui/react-icons
npx wss3-forge init
```

The `init` command copies the `/forge` skill into `.claude/skills/forge/`, so Claude Code auto-loads it when you ask for UI work.

## 2. Wrap your app

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ForgeProvider } from 'wss3-forge'
import 'wss3-forge/styles'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ForgeProvider mode="dark">
      <App />
    </ForgeProvider>
  </React.StrictMode>
)
```

`import 'wss3-forge/styles'` pulls in both `animations.css` and `motion.css`. Without it, motion primitives render without their baseline keyframes.

`ForgeProvider` injects every CSS variable Forge needs. Without it, components render unstyled.

## 3. Write your first page

```tsx
// src/App.tsx
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  Button,
  Input
} from 'wss3-forge'
import { ArrowRight20Regular } from '@fluentui/react-icons'

export default function App() {
  return (
    <Container maxWidth="md" py="xl">
      <VStack gap="lg">
        <VStack gap="sm">
          <Heading level={1}>Welcome</Heading>
          <Text color="secondary">A Forge-only starter. Zero custom CSS.</Text>
        </VStack>

        <Card padding="lg">
          <VStack gap="md">
            <Input label="Email" placeholder="you@example.com" />
            <HStack gap="sm" justify="end">
              <Button variant="secondary">Cancel</Button>
              <Button rightIcon={<ArrowRight20Regular />}>Continue</Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </Container>
  )
}
```

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:5173`. Dark theme by default, brand purple, responsive out of the box.

## 5. Common next steps

### Toggle dark and light mode

`ForgeProvider` is not stateful. Hold the mode in your own state:

```tsx
import { useState } from 'react'
import { ForgeProvider } from 'wss3-forge'

function Root() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark')
  return (
    <ForgeProvider mode={mode}>
      <App onToggle={() => setMode(m => m === 'dark' ? 'light' : 'dark')} />
    </ForgeProvider>
  )
}
```

### Customize the theme

Pass a flat `theme` object. See [theming.md](theming.md) for every field.

```tsx
<ForgeProvider
  mode="dark"
  fontFamily="'Inter', system-ui, sans-serif"
  theme={{
    brandPrimary: '#3B82F6',
    brandSecondary: '#60A5FA',
    radiusMd: '10px'
  }}
>
```

### Add toasts

```tsx
import { ForgeProvider, ToastProvider, useToast, Button } from 'wss3-forge'

function Root() {
  return (
    <ForgeProvider>
      <ToastProvider position="bottom-right">
        <App />
      </ToastProvider>
    </ForgeProvider>
  )
}

function SaveButton() {
  const { success, error } = useToast()
  return <Button onClick={() => success('Saved!')}>Save</Button>
}
```

### Add a Ctrl+K command palette

```tsx
import { CommandBar } from 'wss3-forge'

const [open, setOpen] = useState(false)

<CommandBar
  open={open}
  onClose={() => setOpen(false)}
  onSearch={(q) => myResults(q)}
/>
```

### Add motion

```tsx
import { Motion, Stagger } from 'wss3-forge'

<Motion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 'snappy', easing: 'swift' }}>
  <Card>Hello</Card>
</Motion>

<Stagger stagger={80}>
  {items.map(i => <Card key={i.id}>{i.title}</Card>)}
</Stagger>
```

Respect `prefers-reduced-motion`: Forge handles it automatically.

## 6. Where to go next

| Task | Read |
|---|---|
| Pick a component | [components.md](components.md) |
| Look up a prop | [components.md](components.md) |
| Use a CSS variable | [tokens.md](tokens.md) |
| Build a full dashboard | [patterns.md](patterns.md) |
| Create a block template | [patterns.md](patterns.md#block-creation) |
| Tune motion | [motion.md](motion.md) |
| Understand the rules | [../../AGENTS.md](../../AGENTS.md) + [design.md](design.md) |

## 7. The rules

Short version:

1. Import only from `'wss3-forge'`. No deep imports.
2. Icons only from `@fluentui/react-icons`. Naming: `{Name}{Size}{Style}`.
3. Colors via `var(--...)`. No hardcoded hex or RGB.
4. Spacing via gap/padding props on Forge primitives. No raw `px`/`rem`.
5. Layout via `VStack`, `HStack`, `Grid`, `Stack`, `Flex`, `Box`. No flex divs.
6. Responsive via `useIsMobile`, `useBreakpoint`, or responsive object props. No `@media` queries.
7. Typography via `Heading`, `Text`, `Label`. Never style `<h1>` manually.
8. No em-dashes anywhere.
9. No emojis in UI.
10. No colored backgrounds behind plain icons.

Full list with reasoning: [../../AGENTS.md](../../AGENTS.md).
