import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type ElementType
} from 'react'
import { useForge } from '../components/ForgeProvider'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMotionConfig } from './MotionConfig'
import { useLayoutAnimation } from './useLayoutAnimation'
import { layoutIdRegistry } from './LayoutIdRegistry'
import { DURATIONS, EASINGS, MOTION_SCALES } from './tokens'
import type { DurationKey, EasingKey } from './tokens'

// ============================================
// TYPES
// ============================================

export interface DragInfo {
  point: { x: number; y: number }
  offset: { x: number; y: number }
  velocity: { x: number; y: number }
}

type AnimatableNumber = number | number[]
type AnimatableString = string | string[]

export interface MotionProperties {
  opacity?: AnimatableNumber
  x?: AnimatableNumber
  y?: AnimatableNumber
  scale?: AnimatableNumber
  scaleX?: AnimatableNumber
  scaleY?: AnimatableNumber
  rotate?: AnimatableNumber
  backgroundColor?: AnimatableString
  color?: AnimatableString
  borderColor?: AnimatableString
  borderRadius?: number | string | (number | string)[]
  filter?: AnimatableString
  boxShadow?: AnimatableString
}

/** Resolved single-value properties used internally after keyframe detection. */
interface ResolvedMotionProperties {
  opacity?: number
  x?: number
  y?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: number
  backgroundColor?: string
  color?: string
  borderColor?: string
  borderRadius?: number | string
  filter?: string
  boxShadow?: string
}

export interface MotionTransition {
  duration?: DurationKey | number
  easing?: EasingKey | string
  delay?: number
  when?: 'beforeChildren' | 'afterChildren'
  staggerChildren?: number
  delayChildren?: number
}

export type Variants = Record<string, MotionProperties>

export interface ViewportOptions {
  once?: boolean
  threshold?: number
  margin?: string
}

// Variant propagation context
interface VariantContextValue {
  animateVariant: string | null
  transition: MotionTransition | null
  staggerIndex: number
}

const MotionVariantContext = createContext<VariantContextValue>({
  animateVariant: null,
  transition: null,
  staggerIndex: 0,
})

type MotionStateProp = MotionProperties | string | false

type MotionElementProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onAnimationEnd' | 'onTransitionEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>

export interface MotionProps extends MotionElementProps {
  /** Named animation states. When provided, string values on state props reference keys in this map. */
  variants?: Variants
  /** Starting state. Applied before paint on mount. Pass `false` to skip. */
  initial?: MotionStateProp
  /** Target state after mount. Supports keyframe arrays. */
  animate?: MotionStateProp
  /** State played when `isPresent` flips to `false` (AnimatePresence). */
  exit?: MotionStateProp
  /** State while the pointer is over the element. */
  whileHover?: MotionStateProp
  /** State while the element is pressed. */
  whileTap?: MotionStateProp
  /** State while the element is in the viewport. */
  whileInView?: MotionStateProp
  /** State while the element has :focus-visible. */
  whileFocus?: MotionStateProp
  /** State while dragging. */
  whileDrag?: MotionStateProp
  /** Viewport detection options for whileInView. */
  viewport?: ViewportOptions
  /** Transition config. Defaults to `{ duration: 'fast', easing: 'standard' }`. */
  transition?: MotionTransition
  /** Underlying element. Defaults to 'div'. */
  as?: ElementType
  /** Children. */
  children?: ReactNode
  /** Passthrough style merged after animation state. */
  style?: CSSProperties
  /** Passthrough className. */
  className?: string
  /** Set by <AnimatePresence>. false triggers the `exit` transition. */
  isPresent?: boolean
  /** Called once the exit transition finishes. */
  onExitComplete?: () => void
  /** Called when the current transition finishes (debounced across properties). */
  onAnimationComplete?: () => void
  /** Enable drag. true = both axes, 'x' = horizontal only, 'y' = vertical only */
  drag?: boolean | 'x' | 'y'
  /** Constraints for drag movement in px */
  dragConstraints?: { top?: number; bottom?: number; left?: number; right?: number } | React.RefObject<HTMLElement>
  /** Elastic overscroll factor 0-1. 0 = hard stop, 1 = free. @default 0.35 */
  dragElastic?: number
  /** Return to origin on release. @default false */
  dragSnapToOrigin?: boolean
  /** Apply momentum/inertia on release. @default true */
  dragMomentum?: boolean
  /** Called when drag starts */
  onDragStart?: (event: PointerEvent, info: DragInfo) => void
  /** Called on each drag move */
  onDrag?: (event: PointerEvent, info: DragInfo) => void
  /** Called when drag ends */
  onDragEnd?: (event: PointerEvent, info: DragInfo) => void
  /** Animate layout changes automatically via FLIP. */
  layout?: boolean | 'position' | 'size'
  /** Transition config specific to layout animations. Falls back to transition. */
  layoutTransition?: MotionTransition
  /** Shared element transition id. Elements with the same layoutId morph between mounts. */
  layoutId?: string
}

// ============================================
// HELPERS
// ============================================

function resolveScalar(v: number | number[] | undefined): number | undefined {
  if (v === undefined) return undefined
  if (Array.isArray(v)) return v[v.length - 1]
  return v
}

function resolveScalarStr(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined
  if (Array.isArray(v)) return v[v.length - 1]
  return v
}

function resolveScalarMixed(
  v: number | string | (number | string)[] | undefined
): number | string | undefined {
  if (v === undefined) return undefined
  if (Array.isArray(v)) return v[v.length - 1]
  return v
}

function resolveProps(p: MotionProperties | undefined): ResolvedMotionProperties | undefined {
  if (!p) return undefined
  return {
    opacity: resolveScalar(p.opacity),
    x: resolveScalar(p.x),
    y: resolveScalar(p.y),
    scale: resolveScalar(p.scale),
    scaleX: resolveScalar(p.scaleX),
    scaleY: resolveScalar(p.scaleY),
    rotate: resolveScalar(p.rotate),
    backgroundColor: resolveScalarStr(p.backgroundColor),
    color: resolveScalarStr(p.color),
    borderColor: resolveScalarStr(p.borderColor),
    borderRadius: resolveScalarMixed(p.borderRadius),
    filter: resolveScalarStr(p.filter),
    boxShadow: resolveScalarStr(p.boxShadow),
  }
}

function resolveVariantProp(
  prop: MotionStateProp | undefined,
  variants: Variants | undefined,
  parentVariant: string | null
): MotionProperties | false | undefined {
  if (prop === false) return false
  if (typeof prop === 'string') return variants?.[prop]
  if (prop !== undefined) return prop
  if (parentVariant && variants?.[parentVariant]) return variants[parentVariant]
  return undefined
}

function hasTransformProps(p: MotionProperties | false | undefined): boolean {
  if (!p) return false
  return (
    p.x !== undefined ||
    p.y !== undefined ||
    p.scale !== undefined ||
    p.scaleX !== undefined ||
    p.scaleY !== undefined ||
    p.rotate !== undefined
  )
}

function buildTransform(p: ResolvedMotionProperties | undefined): string {
  const tx = p?.x ?? 0
  const ty = p?.y ?? 0
  const sx = p?.scale ?? p?.scaleX ?? 1
  const sy = p?.scale ?? p?.scaleY ?? 1
  const rot = p?.rotate ?? 0
  return `translate(${tx}px, ${ty}px) scale(${sx}, ${sy}) rotate(${rot}deg)`
}

function propsToStyle(
  p: ResolvedMotionProperties | undefined,
  scaleFactor: number,
  emitTransform: boolean
): CSSProperties {
  if (!p && !emitTransform) return {}
  const scaled: ResolvedMotionProperties = p
    ? {
        ...p,
        x: p.x !== undefined ? p.x * scaleFactor : undefined,
        y: p.y !== undefined ? p.y * scaleFactor : undefined,
        scale: p.scale !== undefined ? 1 + (p.scale - 1) * scaleFactor : undefined,
        scaleX: p.scaleX !== undefined ? 1 + (p.scaleX - 1) * scaleFactor : undefined,
        scaleY: p.scaleY !== undefined ? 1 + (p.scaleY - 1) * scaleFactor : undefined,
      }
    : {}
  const style: CSSProperties = {}
  if (emitTransform) {
    style.transform = buildTransform(scaled)
  }
  if (p?.opacity !== undefined) style.opacity = p.opacity
  if (p?.backgroundColor !== undefined) style.backgroundColor = p.backgroundColor
  if (p?.color !== undefined) style.color = p.color
  if (p?.borderColor !== undefined) style.borderColor = p.borderColor
  if (p?.borderRadius !== undefined) style.borderRadius = p.borderRadius
  if (p?.filter !== undefined) style.filter = p.filter
  if (p?.boxShadow !== undefined) style.boxShadow = p.boxShadow
  return style
}

function resolveDurationMs(value: DurationKey | number | undefined): number {
  if (value === undefined) return DURATIONS.fast
  if (typeof value === 'number') return value
  return DURATIONS[value]
}

function resolveEasingString(value: EasingKey | string | undefined): string {
  if (value === undefined) return EASINGS.standard
  if (value in EASINGS) return EASINGS[value as EasingKey]
  return value
}

function buildTransitionString(t: MotionTransition | undefined): string {
  const duration = resolveDurationMs(t?.duration)
  const easing = resolveEasingString(t?.easing)
  const delay = t?.delay ?? 0
  return `all ${duration}ms ${easing} ${delay}ms`
}

// ============================================
// KEYFRAMES HELPERS
// ============================================

let keyframeCounter = 0

function hasArrayValues(p: MotionProperties | undefined): boolean {
  if (!p) return false
  return Object.values(p).some((v) => Array.isArray(v))
}

function buildKeyframeTransformAt(
  p: MotionProperties,
  index: number,
  scaleFactor: number
): string {
  const getAt = (v: AnimatableNumber | undefined, fallback: number): number => {
    if (v === undefined) return fallback
    if (Array.isArray(v)) return index < v.length ? v[index] : v[v.length - 1]
    return v
  }

  const rawX = getAt(p.x, 0)
  const rawY = getAt(p.y, 0)
  const rawScale = getAt(p.scale, undefined as unknown as number)
  const rawScaleX = getAt(p.scaleX, undefined as unknown as number)
  const rawScaleY = getAt(p.scaleY, undefined as unknown as number)
  const rot = getAt(p.rotate, 0)

  const tx = rawX * scaleFactor
  const ty = rawY * scaleFactor

  const sxRaw = rawScale !== undefined ? rawScale : (rawScaleX !== undefined ? rawScaleX : 1)
  const syRaw = rawScale !== undefined ? rawScale : (rawScaleY !== undefined ? rawScaleY : 1)
  const sx = sxRaw !== undefined ? 1 + (sxRaw - 1) * scaleFactor : 1
  const sy = syRaw !== undefined ? 1 + (syRaw - 1) * scaleFactor : 1

  return `translate(${tx}px, ${ty}px) scale(${sx}, ${sy}) rotate(${rot}deg)`
}

function getStringAt(v: AnimatableString | undefined, index: number): string | undefined {
  if (v === undefined) return undefined
  if (Array.isArray(v)) return index < v.length ? v[index] : v[v.length - 1]
  return v
}

function getNumberAt(v: AnimatableNumber | undefined, index: number): number | undefined {
  if (v === undefined) return undefined
  if (Array.isArray(v)) return index < v.length ? v[index] : v[v.length - 1]
  return v
}

function getMixedAt(
  v: number | string | (number | string)[] | undefined,
  index: number
): number | string | undefined {
  if (v === undefined) return undefined
  if (Array.isArray(v)) return index < v.length ? v[index] : v[v.length - 1]
  return v
}

function getMaxArrayLength(p: MotionProperties): number {
  let max = 0
  for (const val of Object.values(p)) {
    if (Array.isArray(val) && val.length > max) max = val.length
  }
  return max
}

function buildKeyframeCSS(
  name: string,
  p: MotionProperties,
  emitTransform: boolean,
  scaleFactor: number
): string {
  const steps = getMaxArrayLength(p)
  if (steps < 2) return ''

  const frames: string[] = []
  for (let i = 0; i < steps; i++) {
    const pct = steps === 1 ? 100 : Math.round((i / (steps - 1)) * 100)
    const rules: string[] = []

    if (emitTransform) {
      rules.push(`transform: ${buildKeyframeTransformAt(p, i, scaleFactor)}`)
    }

    const opacity = getNumberAt(p.opacity, i)
    if (opacity !== undefined) rules.push(`opacity: ${opacity}`)

    const bg = getStringAt(p.backgroundColor, i)
    if (bg !== undefined) rules.push(`background-color: ${bg}`)

    const col = getStringAt(p.color, i)
    if (col !== undefined) rules.push(`color: ${col}`)

    const bc = getStringAt(p.borderColor, i)
    if (bc !== undefined) rules.push(`border-color: ${bc}`)

    const br = getMixedAt(p.borderRadius, i)
    if (br !== undefined) {
      rules.push(`border-radius: ${typeof br === 'number' ? `${br}px` : br}`)
    }

    const f = getStringAt(p.filter, i)
    if (f !== undefined) rules.push(`filter: ${f}`)

    const bs = getStringAt(p.boxShadow, i)
    if (bs !== undefined) rules.push(`box-shadow: ${bs}`)

    frames.push(`  ${pct}% { ${rules.join('; ')}; }`)
  }

  return `@keyframes ${name} {\n${frames.join('\n')}\n}`
}

// ============================================
// COMPONENT
// ============================================

export const Motion = forwardRef<HTMLElement, MotionProps>(function Motion(
  {
    variants,
    initial: initialProp,
    animate: animateProp,
    exit: exitProp,
    whileHover: whileHoverProp,
    whileTap: whileTapProp,
    whileInView: whileInViewProp,
    whileFocus: whileFocusProp,
    whileDrag: whileDragProp,
    viewport,
    transition,
    as: Tag = 'div',
    children,
    style,
    className,
    isPresent = true,
    onExitComplete,
    onAnimationComplete,
    drag,
    dragConstraints,
    dragElastic = 0.35,
    dragSnapToOrigin = false,
    dragMomentum = true,
    onDragStart: onDragStartProp,
    onDrag: onDragProp,
    onDragEnd: onDragEndProp,
    layout,
    layoutTransition,
    layoutId,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    ...rest
  },
  ref
) {
  const { motionScale } = useForge()
  const reducedMotion = useReducedMotion()
  const scaleFactor = reducedMotion ? 0 : MOTION_SCALES[motionScale]
  const config = useMotionConfig()
  const parentCtx = useContext(MotionVariantContext)

  const initial = resolveVariantProp(initialProp, variants, null)
  const animate = resolveVariantProp(
    animateProp,
    variants,
    animateProp === undefined ? parentCtx.animateVariant : null
  )
  const exit = resolveVariantProp(exitProp, variants, null)
  const whileHover = resolveVariantProp(whileHoverProp, variants, null)
  const whileTap = resolveVariantProp(whileTapProp, variants, null)
  const whileInView = resolveVariantProp(whileInViewProp, variants, null)
  const whileFocus = resolveVariantProp(whileFocusProp, variants, null)
  const whileDrag = resolveVariantProp(whileDragProp, variants, null)

  const activeVariantName: string | null =
    typeof animateProp === 'string'
      ? animateProp
      : animateProp === undefined && parentCtx.animateVariant
        ? parentCtx.animateVariant
        : null

  const inheritedDelay =
    parentCtx.staggerIndex > 0 && parentCtx.transition
      ? (parentCtx.transition.delayChildren ?? 0) +
        parentCtx.staggerIndex * (parentCtx.transition.staggerChildren ?? 0)
      : parentCtx.transition?.delayChildren ?? 0

  const resolvedTransition: MotionTransition | undefined =
    transition || config.transition
      ? { ...config.transition, ...transition }
      : undefined

  const effectiveTransition: MotionTransition | undefined =
    inheritedDelay > 0
      ? { ...resolvedTransition, delay: (resolvedTransition?.delay ?? 0) + inheritedDelay }
      : resolvedTransition

  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [inView, setInView] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const innerRef = useRef<HTMLElement | null>(null)
  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
    },
    [ref]
  )

  useLayoutAnimation(
    innerRef,
    layout,
    layoutTransition || resolvedTransition,
    reducedMotion
  )

  // layoutId: shared element transitions via FLIP
  const layoutIdSnapshotRef = useRef<{ rect: DOMRect; opacity: number } | null>(null)

  useLayoutEffect(() => {
    if (!layoutId || reducedMotion) return
    const el = innerRef.current
    if (!el) return

    // Check if the registry has a previous snapshot for this layoutId
    const prev = layoutIdRegistry.snapshot(layoutId)
    if (prev) {
      layoutIdSnapshotRef.current = { rect: prev.rect, opacity: prev.opacity }
    }

    // Register this element
    layoutIdRegistry.register(layoutId, el)

    // If a previous snapshot exists, run FLIP morph
    if (layoutIdSnapshotRef.current) {
      const oldRect = layoutIdSnapshotRef.current.rect
      const newRect = el.getBoundingClientRect()

      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top
      const sw = oldRect.width / newRect.width
      const sh = oldRect.height / newRect.height

      // INVERT: place the element where the old one was
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sw}, ${sh})`
      el.style.transformOrigin = '0 0'
      el.style.opacity = '0'

      // Force reflow so the inverse transform is painted
      el.getBoundingClientRect()

      // PLAY: animate to identity with cross-fade
      const duration = resolveDurationMs(
        (layoutTransition || resolvedTransition)?.duration
      )
      const easing = resolveEasingString(
        (layoutTransition || resolvedTransition)?.easing
      )

      el.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`
      el.style.transform = 'none'
      el.style.opacity = '1'

      const cleanup = () => {
        el.style.transition = ''
        el.style.transform = ''
        el.style.transformOrigin = ''
        el.style.opacity = ''
        el.removeEventListener('transitionend', cleanup)
      }
      el.addEventListener('transitionend', cleanup, { once: true })

      layoutIdSnapshotRef.current = null
    }

    return () => {
      // Before unmount: snapshot the current rect, then unregister after a delay
      // so the next mount of the same layoutId can read the snapshot
      layoutIdRegistry.snapshot(layoutId)
      setTimeout(() => layoutIdRegistry.unregister(layoutId), 100)
    }
  }, [layoutId, reducedMotion, layoutTransition, resolvedTransition])

  const hasInitial = initial !== false && initial !== undefined
  const [mounted, setMounted] = useState(!hasInitial)
  useLayoutEffect(() => {
    if (!hasInitial) return
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [hasInitial])

  // Exit coordination
  const exitScheduled = useRef(false)
  useEffect(() => {
    if (isPresent || exitScheduled.current) return
    exitScheduled.current = true
    const duration =
      resolveDurationMs(effectiveTransition?.duration) + (effectiveTransition?.delay ?? 0)
    const timeout = reducedMotion ? 0 : duration
    const id = window.setTimeout(() => onExitComplete?.(), timeout)
    return () => window.clearTimeout(id)
  }, [isPresent, effectiveTransition?.duration, effectiveTransition?.delay, reducedMotion, onExitComplete])

  // IntersectionObserver for whileInView
  useEffect(() => {
    if (!whileInView) return
    const node = innerRef.current
    if (!node) return

    const opts = viewport ?? {}
    const once = opts.once ?? true
    const threshold = opts.threshold ?? 0.15
    const margin = opts.margin ?? '0px'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin: margin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [whileInView, viewport?.once, viewport?.threshold, viewport?.margin])

  // onAnimationComplete via transitionend debounce
  useEffect(() => {
    if (!onAnimationComplete) return
    const node = innerRef.current
    if (!node) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const handler = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        onAnimationComplete()
        timer = null
      }, 50)
    }

    node.addEventListener('transitionend', handler)
    node.addEventListener('animationend', handler)
    return () => {
      node.removeEventListener('transitionend', handler)
      node.removeEventListener('animationend', handler)
      if (timer) clearTimeout(timer)
    }
  }, [onAnimationComplete])

  // ---- Drag handling ----
  const dragStartRef = useRef({ x: 0, y: 0 })
  const dragBaseRef = useRef({ x: 0, y: 0 })
  const dragHistoryRef = useRef<Array<{ x: number; y: number; t: number }>>([])
  const dragRafRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  // Keep ref in sync with state for use inside pointer handlers
  useEffect(() => {
    dragOffsetRef.current = dragOffset
  }, [dragOffset])

  const getDragConstraintBounds = useCallback(() => {
    if (!dragConstraints) return null
    if ('current' in dragConstraints) {
      const parent = dragConstraints.current
      const child = innerRef.current
      if (!parent || !child) return null
      const pr = parent.getBoundingClientRect()
      const cr = child.getBoundingClientRect()
      return {
        top: pr.top - cr.top,
        bottom: pr.bottom - cr.bottom,
        left: pr.left - cr.left,
        right: pr.right - cr.right,
      }
    }
    return dragConstraints as { top?: number; bottom?: number; left?: number; right?: number }
  }, [dragConstraints])

  const applyElasticValue = useCallback(
    (offset: number, min: number | undefined, max: number | undefined, elastic: number): number => {
      if (min !== undefined && offset < min) {
        return min + (offset - min) * elastic
      }
      if (max !== undefined && offset > max) {
        return max + (offset - max) * elastic
      }
      return offset
    },
    []
  )

  const clampValue = useCallback(
    (val: number, min: number | undefined, max: number | undefined): number => {
      if (min !== undefined && val < min) return min
      if (max !== undefined && val > max) return max
      return val
    },
    []
  )

  useEffect(() => {
    if (!drag) return
    const node = innerRef.current
    if (!node) return

    const handlePointerDown = (e: PointerEvent) => {
      node.setPointerCapture(e.pointerId)
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      dragBaseRef.current = { ...dragOffsetRef.current }
      dragHistoryRef.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
      cancelAnimationFrame(dragRafRef.current)
      setDragging(true)

      const info: DragInfo = {
        point: { x: e.clientX, y: e.clientY },
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
      }
      onDragStartProp?.(e, info)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return

      const rawX = dragBaseRef.current.x + (e.clientX - dragStartRef.current.x)
      const rawY = dragBaseRef.current.y + (e.clientY - dragStartRef.current.y)

      const bounds = getDragConstraintBounds()
      let ox = drag === 'y' ? dragBaseRef.current.x : rawX
      let oy = drag === 'x' ? dragBaseRef.current.y : rawY

      if (bounds) {
        if (drag !== 'y') ox = applyElasticValue(ox, bounds.left, bounds.right, dragElastic)
        if (drag !== 'x') oy = applyElasticValue(oy, bounds.top, bounds.bottom, dragElastic)
      }

      setDragOffset({ x: ox, y: oy })

      const now = performance.now()
      dragHistoryRef.current.push({ x: e.clientX, y: e.clientY, t: now })
      if (dragHistoryRef.current.length > 3) dragHistoryRef.current.shift()

      const first = dragHistoryRef.current[0]
      const dt = (now - first.t) / 1000
      const vx = dt > 0 ? (e.clientX - first.x) / dt : 0
      const vy = dt > 0 ? (e.clientY - first.y) / dt : 0

      const info: DragInfo = {
        point: { x: e.clientX, y: e.clientY },
        offset: { x: ox, y: oy },
        velocity: { x: vx, y: vy },
      }
      onDragProp?.(e, info)
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setDragging(false)

      const hist = dragHistoryRef.current
      const first = hist[0]
      const last = hist[hist.length - 1]
      const dt = (last.t - first.t) / 1000
      let vx = dt > 0 ? (last.x - first.x) / dt : 0
      let vy = dt > 0 ? (last.y - first.y) / dt : 0

      if (drag === 'y') vx = 0
      if (drag === 'x') vy = 0

      const latestX = dragBaseRef.current.x + (e.clientX - dragStartRef.current.x)
      const latestY = dragBaseRef.current.y + (e.clientY - dragStartRef.current.y)
      const bounds = getDragConstraintBounds()
      let endX = drag === 'y' ? dragOffsetRef.current.x : latestX
      let endY = drag === 'x' ? dragOffsetRef.current.y : latestY
      if (bounds) {
        if (drag !== 'y') endX = applyElasticValue(endX, bounds.left, bounds.right, dragElastic)
        if (drag !== 'x') endY = applyElasticValue(endY, bounds.top, bounds.bottom, dragElastic)
      }

      const info: DragInfo = {
        point: { x: e.clientX, y: e.clientY },
        offset: { x: endX, y: endY },
        velocity: { x: vx, y: vy },
      }
      onDragEndProp?.(e, info)

      if (dragSnapToOrigin) {
        let posX = endX
        let posY = endY
        const animateSnap = () => {
          posX += (0 - posX) * 0.15
          posY += (0 - posY) * 0.15
          if (Math.abs(posX) < 0.5 && Math.abs(posY) < 0.5) {
            setDragOffset({ x: 0, y: 0 })
            return
          }
          setDragOffset({ x: posX, y: posY })
          dragRafRef.current = requestAnimationFrame(animateSnap)
        }
        dragRafRef.current = requestAnimationFrame(animateSnap)
      } else if (dragMomentum) {
        let posX = endX
        let posY = endY
        let velX = vx / 60
        let velY = vy / 60
        const FRICTION = 0.95

        const animateInertia = () => {
          posX += velX
          posY += velY
          velX *= FRICTION
          velY *= FRICTION

          if (bounds) {
            if (drag !== 'y') posX = clampValue(posX, bounds.left, bounds.right)
            if (drag !== 'x') posY = clampValue(posY, bounds.top, bounds.bottom)
          }

          if (Math.abs(velX) < 0.5 / 60 && Math.abs(velY) < 0.5 / 60) {
            setDragOffset({ x: posX, y: posY })
            return
          }
          setDragOffset({ x: posX, y: posY })
          dragRafRef.current = requestAnimationFrame(animateInertia)
        }
        dragRafRef.current = requestAnimationFrame(animateInertia)
      } else if (bounds) {
        let clampedX = endX
        let clampedY = endY
        if (drag !== 'y') clampedX = clampValue(clampedX, bounds.left, bounds.right)
        if (drag !== 'x') clampedY = clampValue(clampedY, bounds.top, bounds.bottom)
        setDragOffset({ x: clampedX, y: clampedY })
      }
    }

    node.addEventListener('pointerdown', handlePointerDown)
    node.addEventListener('pointermove', handlePointerMove)
    node.addEventListener('pointerup', handlePointerUp)
    node.addEventListener('pointercancel', handlePointerUp)

    return () => {
      node.removeEventListener('pointerdown', handlePointerDown)
      node.removeEventListener('pointermove', handlePointerMove)
      node.removeEventListener('pointerup', handlePointerUp)
      node.removeEventListener('pointercancel', handlePointerUp)
      cancelAnimationFrame(dragRafRef.current)
    }
  }, [drag, dragElastic, dragSnapToOrigin, dragMomentum, getDragConstraintBounds, applyElasticValue, clampValue, onDragStartProp, onDragProp, onDragEndProp])

  // Priority: exit > drag > tap > focus > hover > inView > animate > initial
  let target: MotionProperties | undefined
  let useKeyframes = false

  if (!isPresent && exit) {
    target = exit as MotionProperties
  } else if (dragging && whileDrag) {
    target = whileDrag as MotionProperties
  } else if (pressed && whileTap) {
    target = whileTap as MotionProperties
  } else if (focused && whileFocus) {
    target = whileFocus as MotionProperties
  } else if (hovered && whileHover) {
    target = whileHover as MotionProperties
  } else if (inView && whileInView) {
    target = whileInView as MotionProperties
  } else if (!mounted && initial) {
    target = initial as MotionProperties
  } else if (animate) {
    target = animate as MotionProperties
    useKeyframes = hasArrayValues(target)
  } else if (whileInView && !inView && initial) {
    // Hold at initial state while waiting for viewport entry
    target = initial as MotionProperties
  }

  const emitTransform =
    !!drag ||
    hasTransformProps(initial) ||
    hasTransformProps(animate) ||
    hasTransformProps(exit) ||
    hasTransformProps(whileHover) ||
    hasTransformProps(whileTap) ||
    hasTransformProps(whileDrag) ||
    hasTransformProps(whileInView) ||
    hasTransformProps(whileFocus)

  // Keyframe animation handling
  const keyframeNameRef = useRef<string | null>(null)
  const styleTagRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    return () => {
      if (styleTagRef.current) {
        styleTagRef.current.remove()
        styleTagRef.current = null
      }
    }
  }, [])

  // Orchestration: child delay offset for `when` mode
  const parentDuration = resolveDurationMs(effectiveTransition?.duration)
  const when = effectiveTransition?.when
  let childDelayOffset = 0
  if (when === 'beforeChildren') {
    childDelayOffset = parentDuration + (effectiveTransition?.delay ?? 0)
  }

  let mergedStyle: CSSProperties

  if (useKeyframes && target && !reducedMotion) {
    const animName = `forge-motion-kf-${++keyframeCounter}`
    keyframeNameRef.current = animName

    const css = buildKeyframeCSS(
      animName,
      target,
      emitTransform,
      Math.max(scaleFactor, 1)
    )

    if (css) {
      if (styleTagRef.current) styleTagRef.current.remove()
      const tag = document.createElement('style')
      tag.setAttribute('data-forge-motion', animName)
      tag.textContent = css
      document.head.appendChild(tag)
      styleTagRef.current = tag
    }

    const duration = resolveDurationMs(effectiveTransition?.duration)
    const easing = resolveEasingString(effectiveTransition?.easing)
    const delay = effectiveTransition?.delay ?? 0

    const resolved = resolveProps(target)
    const finalStyle = propsToStyle(
      resolved,
      Math.max(scaleFactor, reducedMotion ? 0 : 1),
      emitTransform
    )

    mergedStyle = {
      animation: `${animName} ${duration}ms ${easing} ${delay}ms both`,
      ...finalStyle,
      ...style,
    }
  } else {
    if (styleTagRef.current) {
      styleTagRef.current.remove()
      styleTagRef.current = null
    }

    let parentExtraDelay = 0
    if (when === 'afterChildren' && effectiveTransition) {
      const count = React.Children.count(children)
      const stagger = effectiveTransition.staggerChildren ?? 0
      const childDel = effectiveTransition.delayChildren ?? 0
      parentExtraDelay = childDel + stagger * Math.max(0, count - 1) + parentDuration
    }

    const resolved = resolveProps(target)
    const animatedStyle = propsToStyle(
      resolved,
      Math.max(scaleFactor, reducedMotion ? 0 : 1),
      emitTransform
    )

    const finalTransition = parentExtraDelay > 0
      ? {
          ...effectiveTransition,
          delay: (effectiveTransition?.delay ?? 0) + parentExtraDelay,
        }
      : effectiveTransition

    const transitionString = reducedMotion ? 'none' : buildTransitionString(finalTransition)

    mergedStyle = {
      transition: transitionString,
      ...animatedStyle,
      ...style,
    }
  }

  // Apply drag offset on top of animated transform
  if (drag && (dragOffset.x !== 0 || dragOffset.y !== 0)) {
    const existingTransform = mergedStyle.transform ?? ''
    const dragTranslate = `translate(${dragOffset.x}px, ${dragOffset.y}px)`
    mergedStyle.transform = existingTransform
      ? `${dragTranslate} ${existingTransform}`
      : dragTranslate
  }

  // Drag-specific styles
  if (drag) {
    mergedStyle.touchAction = 'none'
    mergedStyle.userSelect = 'none'
    mergedStyle.cursor = dragging ? 'grabbing' : 'grab'
  }

  // Build context for child variant propagation
  const hasOrchestration = variants && effectiveTransition &&
    (effectiveTransition.staggerChildren || effectiveTransition.delayChildren || when)

  const childTransition: MotionTransition | null = hasOrchestration
    ? {
        delayChildren: (effectiveTransition!.delayChildren ?? 0) + childDelayOffset,
        staggerChildren: effectiveTransition!.staggerChildren,
      }
    : null

  const ctxValue: VariantContextValue = {
    animateVariant: activeVariantName,
    transition: childTransition,
    staggerIndex: 0,
  }

  const wrappedChildren =
    variants && hasOrchestration
      ? React.Children.map(children, (child, index) => (
          <MotionVariantContext.Provider
            value={{ ...ctxValue, staggerIndex: index }}
          >
            {child}
          </MotionVariantContext.Provider>
        ))
      : variants
        ? (
          <MotionVariantContext.Provider value={ctxValue}>
            {children}
          </MotionVariantContext.Provider>
        )
        : children

  return (
    <Tag
      ref={mergedRef}
      className={className}
      style={mergedStyle}
      onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
        if (whileHover) setHovered(true)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLElement>) => {
        if (whileHover) setHovered(false)
        if (whileTap) setPressed(false)
        onPointerLeave?.(e)
      }}
      onPointerDown={(e: React.PointerEvent<HTMLElement>) => {
        if (whileTap) setPressed(true)
        onPointerDown?.(e)
      }}
      onPointerUp={(e: React.PointerEvent<HTMLElement>) => {
        if (whileTap) setPressed(false)
        onPointerUp?.(e)
      }}
      onPointerCancel={(e: React.PointerEvent<HTMLElement>) => {
        if (whileTap) setPressed(false)
        onPointerCancel?.(e)
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        if (whileFocus) {
          try {
            if (e.target.matches(':focus-visible')) setFocused(true)
          } catch {
            setFocused(true)
          }
        }
        onFocusProp?.(e)
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        if (whileFocus) setFocused(false)
        onBlurProp?.(e)
      }}
      {...rest}
    >
      {wrappedChildren}
    </Tag>
  )
})
