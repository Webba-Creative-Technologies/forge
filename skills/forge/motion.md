# Forge Motion

Animation library that ships inside `wss3-forge`. All exports come from the main package, no separate import path.

```tsx
import { Motion, AnimatePresence, Stagger, Magnetic, Tilt } from 'wss3-forge'
import 'wss3-forge/styles/animations.css'
import 'wss3-forge/styles/motion.css'
```

Both CSS imports are required for motion to render correctly.

Motion respects `ForgeProvider`'s `motionScale` prop (scales every translate/scale delta) and `reducedMotion` policy (collapses to instant transitions when the user requests reduced motion). Always wrap the app in `ForgeProvider` when using motion components.

## Core

### `Motion`

Animatable element wrapper. The most general motion primitive.

| Prop | Type | Default |
|---|---|---|
| `initial` | `MotionProperties \| string \| false` | none |
| `animate` | `MotionProperties \| string \| false` | none |
| `exit` | `MotionProperties \| string \| false` | none |
| `whileHover` | `MotionProperties \| string \| false` | none |
| `whileTap` | `MotionProperties \| string \| false` | none |
| `whileInView` | `MotionProperties \| string \| false` | none |
| `whileFocus` | `MotionProperties \| string \| false` | none |
| `whileDrag` | `MotionProperties \| string \| false` | none |
| `viewport` | `{ once?, threshold?, margin? }` | `{ once: false, threshold: 0 }` |
| `transition` | `MotionTransition` | `{ duration: 'fast', easing: 'standard' }` |
| `variants` | `Record<string, MotionProperties>` | none |
| `as` | `ElementType` | `'div'` |
| `drag` | `boolean \| 'x' \| 'y'` | `false` |
| `dragConstraints` | `{ top?, bottom?, left?, right? } \| RefObject` | none |
| `dragElastic` | `number` (0-1) | `0.35` |
| `dragSnapToOrigin` | `boolean` | `false` |
| `dragMomentum` | `boolean` | `true` |
| `onDragStart`, `onDrag`, `onDragEnd` | `(event, info) => void` | none |
| `layout` | `boolean \| 'position' \| 'size'` | `false` |
| `layoutId` | `string` | none |
| `layoutTransition` | `MotionTransition` | inherits |
| `onAnimationComplete` | `() => void` | none |
| `onExitComplete` | `() => void` | none |

`MotionProperties`: `opacity`, `x`, `y`, `scale`, `scaleX`, `scaleY`, `rotate`, `backgroundColor`, `color`, `borderColor`, `borderRadius`, `filter`, `boxShadow`. Each accepts a single value or an array (keyframes).

`MotionTransition`: `duration` (DurationKey or number ms), `easing` (EasingKey or string), `delay`, `when`, `staggerChildren`, `delayChildren`.

```tsx
<Motion
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 'snappy', easing: 'swift' }}
>
  Hello
</Motion>
```

### `AnimatePresence`

Animates children out when they unmount. Wrap the conditional.

| Prop | Type | Default |
|---|---|---|
| `children` | `ReactNode` | required |
| `mode` | `'sync' \| 'wait' \| 'popLayout'` | `'sync'` |
| `initial` | `boolean` | `true` (first children animate in) |
| `onExitComplete` | `() => void` | none |

```tsx
<AnimatePresence mode="wait">
  {isOpen && (
    <Motion key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      Panel
    </Motion>
  )}
</AnimatePresence>
```

### `MotionConfig`

Sets a default `transition` for every descendant `Motion`.

| Prop | Type |
|---|---|
| `transition` | `MotionTransition` |
| `children` | `ReactNode` |

```tsx
<MotionConfig transition={{ duration: 'relaxed', easing: 'swift' }}>
  <AppTree />
</MotionConfig>
```

`useMotionConfig()` reads the current default.

<a id="stagger"></a>
### `Stagger`

Animates children one after another. No per-child wrapping needed.

| Prop | Type | Default |
|---|---|---|
| `from` | `MotionProperties` | `{ opacity: 0, y: 20 }` |
| `to` | `MotionProperties` | `{ opacity: 1, y: 0 }` |
| `transition` | `MotionTransition` | `{ duration: 'snappy', easing: 'swift' }` |
| `stagger` | `number` (ms between children) | `60` |
| `baseDelay` | `number` (ms before first child) | `0` |

```tsx
<Stagger stagger={80}>
  {items.map(item => <Card key={item.id}>{item.title}</Card>)}
</Stagger>
```

### `ViewTransition`

Tags a child with `view-transition-name` for the native View Transitions API. No-op on unsupported browsers.

| Prop | Type |
|---|---|
| `name` | `string` (required) |
| `children` | `ReactNode` |

`useViewTransition()` returns a callback to trigger a transition imperatively.

## Scroll components

### `RevealOnScroll`

Fades and translates a child when it enters the viewport.

| Prop | Type | Default |
|---|---|---|
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | `'up'` |
| `distance` | `number` (px) | `40` |
| `duration` | `DurationKey \| number` | `'relaxed'` |
| `easing` | `EasingKey \| string` | `'swift'` |
| `delay` | `number` (ms) | `0` |
| `offset` | `number` (px, positive reveals earlier) | `0` |
| `once` | `boolean` | `true` |

### `Parallax`

Translates a child as the user scrolls.

| Prop | Type | Default |
|---|---|---|
| `speed` | `number` (0 none, 0.3 subtle, 1 match scroll, negative reverses) | `0.3` |
| `axis` | `'x' \| 'y'` | `'y'` |
| `as` | `ElementType` | `'div'` |

<a id="sticky-section"></a>
### `StickySection`

Tall container with a 100vh inner sticky frame. Useful for scroll-jacked phases.

| Prop | Type | Default |
|---|---|---|
| `heightVh` | `number` (total scroll length in viewport heights) | `3` |
| `children` | `(render: { progress: number }) => ReactNode` | required |

```tsx
<StickySection heightVh={5}>
  {({ progress }) => (
    <Motion animate={{ opacity: phase(progress, 0.2, 0.8) }}>Phased</Motion>
  )}
</StickySection>
```

## Gesture components

### `Magnetic`

Pulls its child toward the cursor inside a radius.

| Prop | Type | Default |
|---|---|---|
| `radius` | `number` (px) | `120` |
| `strength` | `number` (fraction of radius) | `0.3` |
| `damping` | `number` (0-1, lower = smoother) | `0.08` |

### `Tilt`

3D perspective tilt following the cursor.

| Prop | Type | Default |
|---|---|---|
| `intensity` | `number` (degrees) | `10` |
| `perspective` | `number` (px) | `800` |
| `damping` | `number` | `0.15` |
| `scale` | `boolean` | `true` |
| `shine` | `boolean` | `false` |
| `shineColor` | `string` | `'rgba(255,255,255,0.15)'` |
| `borderRadius` | `string \| number` | `'var(--radius-lg)'` |

### `Spotlight`

Follows the cursor with a soft tinted halo.

| Prop | Type | Default |
|---|---|---|
| `radius` | `number` (px) | `240` |
| `color` | `string` | `'rgba(163,91,255,0.35)'` |
| `damping` | `number` | `0.15` |
| `blendMode` | CSS `mixBlendMode` | `'screen'` |
| `borderRadius` | `string \| number` | `'var(--radius-lg)'` |

## Text effects

Every text effect takes `children` (the text or ReactNode) and component-specific options. Full props are exported as TypeScript types.

| Component | Prop types exported |
|---|---|
| `GradientText` | `GradientTextProps` |
| `Typewriter` | `TypewriterProps` |
| `Kinetic` | `KineticProps` |
| `Cipher` | `CipherProps` |
| `TextShimmer` | `TextShimmerProps` |
| `NumberCounter` | `NumberCounterProps` |
| `CircularText` | `CircularTextProps` |

## Visual effects

| Component | Prop types exported | Purpose |
|---|---|---|
| `Marquee` | `MarqueeProps` | Infinite horizontal/vertical scroll. Props: `duration` (s, default 30), `direction` (`'ltr'` / `'rtl'`), `gap` (px, default 32), `pauseOnHover` (default `true`), `fadeEdges` (`true` for default 64px fade, or a number for custom width). Fades the left/right edges into the surrounding bg via CSS mask. Use this on logo strips so they melt into the page instead of hard-cropping at the edges. |
| `GlowArea` | `GlowAreaProps` | Soft glow wrapper |
| `Shimmer` | `ShimmerProps` | Linear shimmer pass |
| `Aura` | `AuraProps` | Pulsing halo |
| `Breathe` | `BreatheProps` | Slow scale breathe |
| `Orbital` | `OrbitalProps` | Children orbit a center point |
| `Confetti` | `ConfettiProps` | Burst of particles |
| `Shine` | `ShineProps` | Diagonal highlight sweep |
| `FlipCard` | `FlipCardProps` | Two-sided card flip |
| `ScratchCard` | `ScratchCardProps` | Drag-to-reveal surface |
| `HoloEffect` | `HoloEffectProps` | Holographic sheen |
| `MatteEffect` | `MatteEffectProps` | Matte finish wrapper |
| `CardStack` | `CardStackProps` | Swipeable card deck |
| `SpinCard` | `SpinCardProps` | Rotate-on-hover card |
| `Sticker` | `StickerProps` | Peel/stick interaction |
| `InteractiveSticker` | `InteractiveStickerProps` | Draggable sticker |

## Canvas backgrounds

Rendered on a `<canvas>`. Respect reduced motion.

| Component | Prop types exported | Purpose |
|---|---|---|
| `Starfield` | `StarfieldProps` | Star dots, drift and parallax |
| `ConstellationGrid` | `ConstellationGridProps` | Connected nodes grid |
| `ParticleField` | `ParticleFieldProps` | Drifting particles |
| `MeshGradient` | `MeshGradientProps` | Animated gradient mesh |
| `NetworkGraph` | `NetworkGraphProps` | Interactive node/edge graph |

## Hooks

### `useMotionValue<T>(initial)`

Reactive value that Motion components consume without re-rendering.

```tsx
const x = useMotionValue(0)
x.set(100)
x.get()               // 100
const unsub = x.on('change', v => console.log(v))
```

### `useMotionValueState<T>(motionValue)`

Subscribe to a `MotionValue` as React state (re-renders on change).

### `useTransform(motionValue, input, output)`

Derive one motion value from another.

```tsx
const scroll = useMotionValue(0)
const opacity = useTransform(scroll, [0, 300], [1, 0])
```

### `useSpring(value, options?)`

Spring-smoothed `MotionValue`. `options: UseSpringOptions`.

### `useAnimate()`

Imperative animation hook. Returns `[scope, animate]`.

```tsx
const [scope, animate] = useAnimate()
animate(scope.current, { opacity: 1 }, { duration: 'fast' })
```

### Scroll hooks

| Hook | Returns | Purpose |
|---|---|---|
| `useInView(ref, options?)` | `boolean` | True when `ref` enters the viewport |
| `useScrollReveal(options?)` | `{ ref, state, isVisible }` | Scroll-reveal state for a single element |
| `useScrollProgress(ref?)` | `MotionValue<number>` | 0..1 progress of `ref` through the viewport (or page scroll) |
| `useParallax(ref, speed)` | `MotionValue<number>` | Translate offset based on scroll |
| `usePageScroll()` | `{ progress, velocity }` | Page-level scroll state |
| `useScrollMotion(ref, options?)` | `ScrollMotionValues` | Full scroll-motion set for a ref |
| `useScrollVelocity()` | `MotionValue<number>` | Page scroll velocity |
| `scrollPhase(progress, from, to)` | `number` | Clamp 0..1 between two thresholds |

### Gesture hooks

| Hook | Purpose |
|---|---|
| `useCursorPosition(ref, options?)` | Smoothed cursor coords relative to a ref |
| `useMagneticAttraction(ref, options?)` | Underlying math behind `Magnetic` |
| `useTilt(ref, options?)` | Underlying math behind `Tilt` |

### `useReducedMotion()`

```tsx
const reduced = useReducedMotion()   // boolean
```

Reads from `ForgeProvider`'s `reducedMotion` policy and the system `prefers-reduced-motion` query. Use it to short-circuit custom animations.

## Tokens and helpers

Imported from the main package. See [tokens.md](tokens.md) for full table.

```tsx
import {
  DURATIONS, EASINGS, SPRINGS, MOTION_SCALES,
  resolveDuration, resolveEasing, resolveSpring,
  spring, springPreset, springMulti,
  dampedLerp, lerp, clamp, phase
} from 'wss3-forge'
```

- `DURATIONS`: `instant=0`, `micro=100`, `fast=150`, `snappy=200`, `base=300`, `relaxed=500`, `slow=800`, `stately=1200` (ms)
- `EASINGS`: `linear, standard, emphasized, decelerate, accelerate, overshoot, anticipate, elastic, swift, gentle, bounce, smooth`
- `SPRINGS`: `stiff, bouncy, gentle, wobbly, molasses`
- `MOTION_SCALES`: `subtle=0.5, normal=1, dramatic=1.8`
- `spring(state, target, config, dt)`: one-frame spring step
- `lerp(a, b, t)`: linear interpolation
- `dampedLerp(current, target, rate, dt)`: exponential smoothing
- `clamp(value, min, max)`
- `phase(progress, from, to)`: maps `progress` in `[from, to]` to `[0, 1]`, clamped

## `MorphIcon`

SVG icon that morphs between shapes.

```tsx
import { MorphIcon, ICON_PATHS } from 'wss3-forge'

<MorphIcon path={isOpen ? ICON_PATHS.menu : ICON_PATHS.close} size={24} />
```

`ICON_PATHS` exposes the bundled paths. `usePathMorph(from, to, progress)` interpolates between them.

## Rules for AI

1. Do not reimplement motion logic. Use `Motion`, `AnimatePresence`, `Stagger`, and `RevealOnScroll` for 90% of animation needs.
2. Respect `useReducedMotion()` in any custom animation you build on top of motion primitives.
3. Use named duration and easing keys (`'fast'`, `'swift'`) not raw numbers unless the source explicitly requires ms.
4. Do not chain CSS `transition` outside the motion system for values that motion components already animate (opacity, transform).
5. `motionScale` on `ForgeProvider` is global. Do not scale motion manually per component.
