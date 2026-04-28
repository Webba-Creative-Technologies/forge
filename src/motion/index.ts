// Forge Motion — public entry point
// Everything re-exported here is available via both the main `wss3-forge`
// import and (later, once subpath exports are wired) `wss3-forge/motion`.

export {
  DURATIONS,
  EASINGS,
  SPRINGS,
  MOTION_SCALES,
  resolveDuration,
  resolveEasing,
  resolveSpring
} from './tokens'

export type {
  DurationKey,
  EasingKey,
  SpringKey,
  SpringConfig,
  MotionScaleKey,
  ReducedMotionPolicy
} from './tokens'

export {
  spring,
  springPreset,
  springMulti,
  dampedLerp,
  lerp,
  clamp,
  phase
} from './spring'

export type {
  SpringState,
  SpringHandle,
  SpringMultiHandle,
  SpringOptions
} from './spring'

export { Motion } from './Motion'
export type {
  MotionProps,
  MotionProperties,
  MotionTransition,
  ViewportOptions,
  Variants,
  DragInfo
} from './Motion'

export { MotionConfig, useMotionConfig } from './MotionConfig'
export type { MotionConfigProps } from './MotionConfig'

export { AnimatePresence } from './AnimatePresence'
export type { AnimatePresenceProps } from './AnimatePresence'

export { Stagger } from './Stagger'
export type { StaggerProps } from './Stagger'

export { ViewTransition, useViewTransition } from './ViewTransition'
export type { ViewTransitionProps } from './ViewTransition'

// Motion hooks (reactive state + physics)
export {
  MotionValue,
  useMotionValue,
  useMotionValueState,
  useTransform
} from './hooks/useMotionValue'
export type { MotionValueListener } from './hooks/useMotionValue'

export { useSpring } from './hooks/useSpring'
export type { UseSpringOptions } from './hooks/useSpring'

export {
  useCursorPosition,
  useMagneticAttraction,
  useTilt
} from './hooks/useCursorPosition'
export type {
  CursorPosition,
  UseCursorPositionOptions
} from './hooks/useCursorPosition'

// Gesture wrapper components
export { Magnetic } from './Magnetic'
export type { MagneticProps } from './Magnetic'

export { Tilt } from './Tilt'
export type { TiltProps } from './Tilt'

export { Spotlight } from './Spotlight'
export type { SpotlightProps } from './Spotlight'

// Scroll hooks
export {
  useInView,
  useScrollReveal,
  useScrollProgress,
  useParallax,
  usePageScroll,
  scrollPhase,
  useScrollMotion,
  useScrollVelocity
} from './hooks/useScroll'
export type {
  UseInViewOptions,
  UseScrollRevealOptions,
  ScrollRevealState,
  PageScroll,
  UseScrollMotionOptions,
  ScrollMotionValues
} from './hooks/useScroll'

// Scroll components
export { RevealOnScroll } from './RevealOnScroll'
export type { RevealOnScrollProps } from './RevealOnScroll'

export { Parallax } from './Parallax'
export type { ParallaxProps } from './Parallax'

export { StickySection } from './StickySection'
export type { StickySectionProps, StickySectionRenderProps } from './StickySection'

// Text effects
export { GradientText } from './text/GradientText'
export type { GradientTextProps } from './text/GradientText'
export { Typewriter } from './text/Typewriter'
export type { TypewriterProps } from './text/Typewriter'
export { Kinetic } from './text/Kinetic'
export type { KineticProps } from './text/Kinetic'
export { Cipher } from './text/Cipher'
export type { CipherProps } from './text/Cipher'
export { TextShimmer } from './text/TextShimmer'
export type { TextShimmerProps } from './text/TextShimmer'
export { NumberCounter } from './text/NumberCounter'
export type { NumberCounterProps } from './text/NumberCounter'

// Visual effects
export { Marquee } from './effects/Marquee'
export type { MarqueeProps } from './effects/Marquee'
export { GlowArea } from './effects/GlowArea'
export type { GlowAreaProps } from './effects/GlowArea'
export { Shimmer } from './effects/Shimmer'
export type { ShimmerProps } from './effects/Shimmer'
export { Aura } from './effects/Aura'
export type { AuraProps } from './effects/Aura'
export { Breathe } from './effects/Breathe'
export type { BreatheProps } from './effects/Breathe'
export { Orbital } from './effects/Orbital'
export type { OrbitalProps } from './effects/Orbital'
export { Confetti } from './effects/Confetti'
export type { ConfettiProps } from './effects/Confetti'

export { Shine } from './effects/Shine'
export type { ShineProps } from './effects/Shine'

export { FlipCard } from './effects/FlipCard'
export type { FlipCardProps } from './effects/FlipCard'

export { ScratchCard } from './effects/ScratchCard'
export type { ScratchCardProps } from './effects/ScratchCard'

export { HoloEffect } from './effects/HoloEffect'
export type { HoloEffectProps } from './effects/HoloEffect'

export { MatteEffect } from './effects/MatteEffect'
export type { MatteEffectProps } from './effects/MatteEffect'

export { CardStack } from './effects/CardStack'
export type { CardStackProps } from './effects/CardStack'

export { SpinCard } from './effects/SpinCard'
export type { SpinCardProps } from './effects/SpinCard'

export { Sticker } from './effects/Sticker'
export type { StickerProps } from './effects/Sticker'

export { InteractiveSticker } from './effects/InteractiveSticker'
export type { InteractiveStickerProps } from './effects/InteractiveSticker'

export { CircularText } from './text/CircularText'
export type { CircularTextProps } from './text/CircularText'

// SVG path morphing
export { usePathMorph, ICON_PATHS } from './hooks/usePathMorph'
export type { MorphIconProps } from './hooks/usePathMorph'
export { MorphIcon } from './MorphIcon'

// Imperative animation hook
export { useAnimate } from './hooks/useAnimate'
export type { AnimateOptions, AnimationControls } from './hooks/useAnimate'

// Canvas primitives
export { Starfield } from './canvas/Starfield'
export type { StarfieldProps } from './canvas/Starfield'
export { ConstellationGrid } from './canvas/ConstellationGrid'
export type { ConstellationGridProps } from './canvas/ConstellationGrid'
export { ParticleField } from './canvas/ParticleField'
export type { ParticleFieldProps } from './canvas/ParticleField'
export { MeshGradient } from './canvas/MeshGradient'
export type { MeshGradientProps } from './canvas/MeshGradient'
export { NetworkGraph } from './canvas/NetworkGraph'
export type {
  NetworkGraphProps,
  NetworkNode,
  NetworkEdge
} from './canvas/NetworkGraph'
