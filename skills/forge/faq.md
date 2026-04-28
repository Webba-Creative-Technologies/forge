# FAQ

Common gotchas and their fixes.

## Components render unstyled (8 px margin, wrong fonts)

You forgot to wrap your app in `ForgeProvider`. Every Forge component depends on the CSS variables it injects.

```tsx
import { ForgeProvider } from 'wss3-forge'
import 'wss3-forge/styles'

<ForgeProvider mode="dark">
  <App />
</ForgeProvider>
```

Provider must be at the root of your tree. Do not nest multiple providers.

## `import 'wss3-forge/styles/motion.css'` returns 404

You are on an older version of Forge (pre-1.0.19) where `motion.css` was declared in exports but not bundled. Upgrade to the latest, or use `'wss3-forge/styles'` which now includes both.

```bash
npm install wss3-forge@latest
```

## Motion components do not animate

Three possible causes:

1. `prefers-reduced-motion: reduce` is enabled in the OS. Motion intentionally collapses to instant transitions. Force full motion for debugging with `<ForgeProvider reducedMotion="never">`.
2. Both CSS files are not imported. Check you have either `import 'wss3-forge/styles'` or both `animations.css` and `motion.css`.
3. The motion component is wrapping a non-animatable parent (for example a fragment). Wrap a concrete DOM element.

## Dark mode cards look too light-grey

You are probably using `<Card variant="elevated">` on a pre-1.0.19 version where it rendered with `var(--bg-elevated)` (`#323232`). Upgrade to 1.0.19+, where elevated uses `var(--bg-secondary)` plus a stronger shadow.

## Icons not showing

You are missing `@fluentui/react-icons`. Install it as a peer:

```bash
npm install @fluentui/react-icons
```

The naming convention is `{Name}{Size}{Style}`. Sizes: `12 | 16 | 20 | 24 | 28 | 32 | 48`. Styles: `Regular | Filled`. Example: `ArrowRight20Regular`.

## Icons display as rectangles

Your bundler does not ship the fluent icon SVGs. This usually means the package is not installed. Check `node_modules/@fluentui/react-icons/` exists.

## TypeScript error: `size="xs"` not assignable to `"sm" | "md" | "lg"`

You are on a pre-1.0.19 version for that component. Most Forge components have been extended to `xs | sm | md | lg | xl`. Upgrade, or use the supported size.

## `Button onChange` types wrong

Buttons do not have `onChange`. You are confusing with `Input`. For inputs, `onChange` signature is `(value: string) => void`, not the synthetic event.

```tsx
// Wrong
<Input value={email} onChange={(e) => setEmail(e.target.value)} />

// Right
<Input value={email} onChange={setEmail} />
```

## Modal does not close on Escape

Check `closable` is not set to `false`. Default is `true`. Also make sure you handle `onClose`:

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="...">
  ...
</Modal>
```

## Sidebar hamburger does nothing on mobile

You wrapped `AppSidebar` in a `Sheet`. Do not. `AppSidebar` has a native drawer mode:

```tsx
// Wrong
<Sheet open={navOpen} onClose={...}>
  <AppSidebar sections={sections} forceDesktop />
</Sheet>

// Right
<AppSidebar
  mode="drawer"
  open={navOpen}
  onClose={() => setNavOpen(false)}
  sections={sections}
  value={active}
  onNavigate={setActive}
/>
```

Drawer mode ships with overlay, backdrop, Escape key, and body-scroll lock.

## Table search and filters do not work

Table has built-in search, filters, sort, selection, pagination, and row actions. Do not wrap it in a custom search bar.

```tsx
<Table
  data={users}
  columns={columns}
  keyField="id"
  searchable
  searchPlaceholder="Search users..."
  filters={[{ key: 'role', label: 'Role', options: roleOptions }]}
  pagination
  pageSize={20}
  rowActions={(row) => [
    { id: 'edit', label: 'Edit', onClick: () => edit(row) }
  ]}
/>
```

## `useToast()` throws "must be used within ToastProvider"

You forgot the provider. Wrap your app:

```tsx
<ForgeProvider>
  <ToastProvider position="bottom-right">
    <App />
  </ToastProvider>
</ForgeProvider>
```

Same pattern for `useNotification` and `NotificationProvider`.

## Colors look wrong in light mode

Some older Forge versions had hardcoded `rgba(255, 255, 255, ...)` values that assumed dark theme. 1.0.19+ replaces these with theme-aware CSS vars. Upgrade if you see white-on-white in light mode.

If you are writing your own code that uses `rgba(255, ...)`, use `var(--bg-subtle)` or `var(--bg-active)` instead to get a theme-aware value.

## CLI says "skill version: unknown"

You ran `npx wss3-forge init` on a pre-1.0.19 version. Upgrade and re-init:

```bash
npm install wss3-forge@latest
npx wss3-forge upgrade
```

## `<Heading>` size looks wrong

`Heading` picks a size from the `level` prop by default:

| Level | Size |
|---|---|
| 1 | `3xl` (1.875rem, 30px) |
| 2 | `2xl` (1.5rem, 24px) |
| 3 | `xl` (1.25rem, 20px) |
| 4 | `lg` (1.125rem, 18px) |
| 5 | `md` (1rem, 16px) |
| 6 | `sm` (0.875rem, 14px) |

Override with an explicit `size` prop if needed.

## `<Grid columns={{ base: 1, md: 2 }}>` does not work

Forge responsive keys are `xs | sm | md | lg | xl | 2xl`. Not `base`. Use `xs` for the smallest breakpoint.

```tsx
<Grid columns={{ xs: 1, md: 2 }}>
```

## Badge has no hover on close button

Badge's close behavior is triggered by `onClose`, not `dismissed`. The `dismissed`/`onDismiss` prop combo was a documentation fiction in older guides.

```tsx
<Badge variant="error" onClose={handleRemove}>Tag</Badge>
```

## `Tabs` count does not show

The tab object needs a `count` field:

```tsx
<Tabs
  tabs={[
    { id: 'inbox', label: 'Inbox', count: 3 },
    { id: 'sent', label: 'Sent' }
  ]}
  value={active}
  onChange={setActive}
/>
```

`count === 0` hides the badge. For "zero but shown", pass `count` as `null` or omit it.

## AppSidebar active item has no highlight

You forgot to pass `value`. The sidebar compares `value` against each item's `id`:

```tsx
<AppSidebar
  sections={sections}
  value={active}          // this drives the active highlight
  onNavigate={setActive}
/>
```

## Motion `duration="fast"` throws a type error

Duration keys are strings from a union: `instant | micro | fast | snappy | base | relaxed | slow | stately`. Use one of those, or pass a raw number in milliseconds.

```tsx
<Motion transition={{ duration: 'fast', easing: 'standard' }}>
<Motion transition={{ duration: 250, easing: 'standard' }}>
```

## My build ships 13 MB of source maps

That is Forge's sourcemap. In production you usually do not need it. Strip with Vite:

```ts
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: false
  }
})
```

Forge ships sourcemaps by default so errors are debuggable.

## Does Forge work with server components (RSC / Next.js app router)?

Most Forge components are client components (interactive). Add `'use client'` at the top of any file that imports from `wss3-forge` and is rendered inside a server component tree.

## Does Forge work with React 19?

React 18+ is declared as a peer. React 19 passes all type checks; runtime behavior has not been fully battle-tested yet.
