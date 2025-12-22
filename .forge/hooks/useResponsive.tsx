import React, { useState, useEffect } from 'react'

// ============================================
// SPACING SYSTEM
// ============================================
export const SPACING = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const

// Semantic spacing aliases
export const SPACING_SEMANTIC = {
  none: SPACING[0],
  xs: SPACING[1],      // 4px
  sm: SPACING[2],      // 8px
  md: SPACING[4],      // 16px
  lg: SPACING[6],      // 24px
  xl: SPACING[8],      // 32px
  '2xl': SPACING[12],  // 48px
  '3xl': SPACING[16],  // 64px
  '4xl': SPACING[24],  // 96px
} as const

export type SpacingKey = keyof typeof SPACING
export type SpacingSemantic = keyof typeof SPACING_SEMANTIC
export type SpacingValue = SpacingKey | SpacingSemantic | string | number

// Resolve spacing value to CSS
export function resolveSpacing(value: SpacingValue | undefined): string | undefined {
  if (value === undefined || value === null) return undefined

  // Handle semantic values (xs, sm, md, lg, xl, etc.)
  if (typeof value === 'string') {
    const semantic = SPACING_SEMANTIC[value as keyof typeof SPACING_SEMANTIC]
    if (semantic) return semantic
    // Return as-is if it's a CSS value like '10px' or '1rem'
    return value
  }

  // Handle numeric scale values (1, 2, 4, 6, 8, etc.)
  if (typeof value === 'number') {
    const scaled = SPACING[value as keyof typeof SPACING]
    if (scaled) return scaled
    // Fallback to px if not in scale
    return `${value}px`
  }

  return undefined
}

// ============================================
// BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// ============================================
// useMediaQuery
// ============================================
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ============================================
// useBreakpoint
// ============================================
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= BREAKPOINTS['2xl']) setBreakpoint('2xl')
      else if (width >= BREAKPOINTS.xl) setBreakpoint('xl')
      else if (width >= BREAKPOINTS.lg) setBreakpoint('lg')
      else if (width >= BREAKPOINTS.md) setBreakpoint('md')
      else if (width >= BREAKPOINTS.sm) setBreakpoint('sm')
      else setBreakpoint('xs')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

// ============================================
// useIsMobile / useIsDesktop
// ============================================
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`)
}

export function useIsTablet(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`)
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
}

// ============================================
// useWindowSize
// ============================================
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 1024, height: 768 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

// ============================================
// Responsive Value Helper
// ============================================
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

export function useResponsiveValue<T>(value: ResponsiveValue<T>, defaultValue: T): T {
  const breakpoint = useBreakpoint()

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value as T
  }

  const responsiveValue = value as Partial<Record<Breakpoint, T>>
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpointOrder.indexOf(breakpoint)

  // Find the closest defined value (mobile-first approach)
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (responsiveValue[bp] !== undefined) {
      return responsiveValue[bp] as T
    }
  }

  return defaultValue
}

// ============================================
// Show/Hide Components
// ============================================
interface ShowProps {
  children: React.ReactNode
  above?: Breakpoint
  below?: Breakpoint
  at?: Breakpoint | Breakpoint[]
}

export function Show({ children, above, below, at }: ShowProps): React.ReactNode {
  const breakpoint = useBreakpoint()
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpointOrder.indexOf(breakpoint)

  let shouldShow = true

  if (above) {
    const aboveIndex = breakpointOrder.indexOf(above)
    shouldShow = shouldShow && currentIndex > aboveIndex
  }

  if (below) {
    const belowIndex = breakpointOrder.indexOf(below)
    shouldShow = shouldShow && currentIndex < belowIndex
  }

  if (at) {
    const atBreakpoints = Array.isArray(at) ? at : [at]
    shouldShow = shouldShow && atBreakpoints.includes(breakpoint)
  }

  return shouldShow ? children : null
}

export function Hide({ children, above, below, at }: ShowProps): React.ReactNode {
  const breakpoint = useBreakpoint()
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpointOrder.indexOf(breakpoint)

  let shouldHide = false

  if (above) {
    const aboveIndex = breakpointOrder.indexOf(above)
    shouldHide = shouldHide || currentIndex > aboveIndex
  }

  if (below) {
    const belowIndex = breakpointOrder.indexOf(below)
    shouldHide = shouldHide || currentIndex < belowIndex
  }

  if (at) {
    const atBreakpoints = Array.isArray(at) ? at : [at]
    shouldHide = shouldHide || atBreakpoints.includes(breakpoint)
  }

  return shouldHide ? null : children
}

// ============================================
// Container Component
// ============================================
interface ContainerProps {
  children: React.ReactNode
  maxWidth?: Breakpoint | 'full' | number
  padding?: ResponsiveValue<string | number>
  py?: ResponsiveValue<string | number>
  center?: boolean
  style?: React.CSSProperties
}

export function Container({
  children,
  maxWidth = 'xl',
  padding = '1rem',
  py,
  center = true,
  style
}: ContainerProps): React.ReactNode {
  const resolvedPadding = useResponsiveValue(padding, '1rem')
  const resolvedPaddingY = useResponsiveValue(py, undefined)

  const maxWidthValue = maxWidth === 'full'
    ? '100%'
    : typeof maxWidth === 'number'
      ? maxWidth
      : BREAKPOINTS[maxWidth]

  return (
    <div style={{
      width: '100%',
      maxWidth: maxWidthValue,
      marginLeft: center ? 'auto' : undefined,
      marginRight: center ? 'auto' : undefined,
      paddingLeft: resolvedPadding,
      paddingRight: resolvedPadding,
      paddingTop: resolvedPaddingY,
      paddingBottom: resolvedPaddingY,
      ...style
    }}>
      {children}
    </div>
  )
}

// ============================================
// Stack Component (responsive flex)
// ============================================
interface StackProps {
  children: React.ReactNode
  direction?: ResponsiveValue<'row' | 'column'>
  gap?: ResponsiveValue<string | number>
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch'>
  justify?: ResponsiveValue<'start' | 'center' | 'end' | 'between' | 'around'>
  wrap?: boolean
  style?: React.CSSProperties
}

export function Stack({
  children,
  direction = 'column',
  gap = '1rem',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  style
}: StackProps): React.ReactNode {
  const resolvedDirection = useResponsiveValue(direction, 'column')
  const resolvedGap = useResponsiveValue(gap, '1rem')
  const resolvedAlign = useResponsiveValue(align, 'stretch')
  const resolvedJustify = useResponsiveValue(justify, 'start')

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  }

  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around'
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: resolvedDirection,
      gap: resolvedGap,
      alignItems: alignMap[resolvedAlign],
      justifyContent: justifyMap[resolvedJustify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style
    }}>
      {children}
    </div>
  )
}

// ============================================
// Grid Component (responsive grid)
// ============================================
interface GridProps {
  children: React.ReactNode
  columns?: ResponsiveValue<number | string>
  gap?: SpacingValue
  rowGap?: SpacingValue
  columnGap?: SpacingValue
  style?: React.CSSProperties
}

export function Grid({
  children,
  columns = 1,
  gap = 'md',
  rowGap,
  columnGap,
  style
}: GridProps): React.ReactNode {
  const resolvedColumns = useResponsiveValue(columns, 1)

  const gridTemplateColumns = typeof resolvedColumns === 'number'
    ? `repeat(${resolvedColumns}, minmax(0, 1fr))`
    : resolvedColumns

  // Inline gap resolution
  const getGap = (g: SpacingValue): string => {
    if (typeof g === 'string') {
      const map: Record<string, string> = {
        none: '0', xs: '0.25rem', sm: '0.5rem', md: '1rem',
        lg: '1.5rem', xl: '2rem', '2xl': '3rem'
      }
      return map[g] || g
    }
    if (typeof g === 'number') {
      const scale: Record<number, string> = {
        0: '0', 1: '0.25rem', 2: '0.5rem', 4: '1rem',
        6: '1.5rem', 8: '2rem', 12: '3rem'
      }
      return scale[g] || `${g}px`
    }
    return '1rem'
  }

  // Build style object
  const finalStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns,
    ...style,
    gap: getGap(gap),
  }

  // Only add row/column gap if specified
  if (rowGap) finalStyle.rowGap = getGap(rowGap)
  if (columnGap) finalStyle.columnGap = getGap(columnGap)

  return (
    <div style={finalStyle}>
      {children}
    </div>
  )
}

// ============================================
// Box Component (base layout primitive)
// ============================================
interface BoxProps {
  children?: React.ReactNode
  // Padding
  p?: SpacingValue
  px?: SpacingValue
  py?: SpacingValue
  pt?: SpacingValue
  pr?: SpacingValue
  pb?: SpacingValue
  pl?: SpacingValue
  // Margin
  m?: SpacingValue
  mx?: SpacingValue
  my?: SpacingValue
  mt?: SpacingValue
  mr?: SpacingValue
  mb?: SpacingValue
  ml?: SpacingValue
  // Sizing
  w?: string | number
  h?: string | number
  minW?: string | number
  maxW?: string | number
  minH?: string | number
  maxH?: string | number
  // Display
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none'
  // Other
  bg?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number
  border?: boolean | string
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
  onClick?: () => void
}

const RADIUS_MAP = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999
}

const SHADOW_MAP = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.15)'
}

export function Box({
  children,
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  w, h, minW, maxW, minH, maxH,
  display,
  bg,
  rounded,
  border,
  shadow,
  className,
  style,
  as: Component = 'div',
  onClick
}: BoxProps): React.ReactNode {
  const boxStyle: React.CSSProperties = {
    // Padding
    padding: resolveSpacing(p),
    paddingLeft: resolveSpacing(pl) || resolveSpacing(px),
    paddingRight: resolveSpacing(pr) || resolveSpacing(px),
    paddingTop: resolveSpacing(pt) || resolveSpacing(py),
    paddingBottom: resolveSpacing(pb) || resolveSpacing(py),
    // Margin
    margin: resolveSpacing(m),
    marginLeft: resolveSpacing(ml) || resolveSpacing(mx),
    marginRight: resolveSpacing(mr) || resolveSpacing(mx),
    marginTop: resolveSpacing(mt) || resolveSpacing(my),
    marginBottom: resolveSpacing(mb) || resolveSpacing(my),
    // Sizing
    width: w,
    height: h,
    minWidth: minW,
    maxWidth: maxW,
    minHeight: minH,
    maxHeight: maxH,
    // Display
    display,
    // Other
    backgroundColor: bg,
    borderRadius: rounded !== undefined
      ? (typeof rounded === 'number' ? rounded : RADIUS_MAP[rounded])
      : undefined,
    border: border === true ? '1px solid var(--border-color)' : border || undefined,
    boxShadow: shadow ? SHADOW_MAP[shadow] : undefined,
    ...style
  }

  // Remove undefined values
  Object.keys(boxStyle).forEach(key => {
    if (boxStyle[key as keyof React.CSSProperties] === undefined) {
      delete boxStyle[key as keyof React.CSSProperties]
    }
  })

  return (
    <Component style={boxStyle} className={className} onClick={onClick}>
      {children}
    </Component>
  )
}

// ============================================
// Flex Component (flexbox primitive)
// ============================================
interface FlexProps extends Omit<BoxProps, 'display'> {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | boolean
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: SpacingValue
  rowGap?: SpacingValue
  colGap?: SpacingValue
  inline?: boolean
}

export function Flex({
  children,
  direction = 'row',
  wrap = 'nowrap',
  align,
  justify,
  gap,
  rowGap,
  colGap,
  inline = false,
  style,
  ...boxProps
}: FlexProps): React.ReactNode {
  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline'
  }

  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  }

  const flexStyle: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: direction,
    flexWrap: wrap === true ? 'wrap' : wrap === false ? 'nowrap' : wrap,
    alignItems: align ? alignMap[align] : undefined,
    justifyContent: justify ? justifyMap[justify] : undefined,
    gap: resolveSpacing(gap),
    rowGap: resolveSpacing(rowGap),
    columnGap: resolveSpacing(colGap),
    ...style
  }

  return (
    <Box {...boxProps} style={flexStyle}>
      {children}
    </Box>
  )
}

// ============================================
// Center Component
// ============================================
interface CenterProps extends Omit<FlexProps, 'align' | 'justify'> {
  inline?: boolean
}

export function Center({ children, inline, ...props }: CenterProps): React.ReactNode {
  return (
    <Flex align="center" justify="center" inline={inline} {...props}>
      {children}
    </Flex>
  )
}

// ============================================
// Spacer Component
// ============================================
interface SpacerProps {
  size?: SpacingValue
  axis?: 'horizontal' | 'vertical' | 'both'
  flex?: boolean | number
}

export function Spacer({ size, axis = 'both', flex }: SpacerProps): React.ReactNode {
  const resolvedSize = resolveSpacing(size)

  if (flex !== undefined && flex !== false) {
    return (
      <div style={{ flex: flex === true ? 1 : flex }} />
    )
  }

  return (
    <div
      style={{
        width: axis === 'horizontal' || axis === 'both' ? resolvedSize : undefined,
        height: axis === 'vertical' || axis === 'both' ? resolvedSize : undefined,
        flexShrink: 0
      }}
    />
  )
}

// ============================================
// VStack / HStack shortcuts
// ============================================
interface StackShortcutProps extends Omit<BoxProps, 'display'> {
  children: React.ReactNode
  gap?: SpacingValue
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean | 'nowrap' | 'wrap' | 'wrap-reverse'
  inline?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
}

export function VStack({
  children,
  gap = 'md',
  align,
  justify,
  wrap,
  inline,
  fullWidth,
  fullHeight,
  style,
  ...boxProps
}: StackShortcutProps): React.ReactNode {
  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline'
  }

  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  }

  // Resolve gap with inline map
  const getGap = (g: SpacingValue): string => {
    if (typeof g === 'string') {
      const map: Record<string, string> = {
        none: '0', xs: '0.25rem', sm: '0.5rem', md: '1rem',
        lg: '1.5rem', xl: '2rem', '2xl': '3rem'
      }
      return map[g] || g
    }
    return typeof g === 'number' ? `${g}px` : '1rem'
  }

  return (
    <Box
      {...boxProps}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: 'column',
        alignItems: align ? alignMap[align] : undefined,
        justifyContent: justify ? justifyMap[justify] : undefined,
        flexWrap: wrap === true ? 'wrap' : wrap === false ? 'nowrap' : wrap || undefined,
        width: fullWidth ? '100%' : undefined,
        height: fullHeight ? '100%' : undefined,
        ...style,
        gap: getGap(gap),  // After spread to prevent override
      }}
    >
      {children}
    </Box>
  )
}

export function HStack({
  children,
  gap = 'md',
  align = 'center',
  justify,
  wrap,
  inline,
  fullWidth,
  fullHeight,
  style,
  ...boxProps
}: StackShortcutProps): React.ReactNode {
  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline'
  }

  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  }

  // Resolve gap with inline map
  const getGap = (g: SpacingValue): string => {
    if (typeof g === 'string') {
      const map: Record<string, string> = {
        none: '0', xs: '0.25rem', sm: '0.5rem', md: '1rem',
        lg: '1.5rem', xl: '2rem', '2xl': '3rem'
      }
      return map[g] || g
    }
    return typeof g === 'number' ? `${g}px` : '1rem'
  }

  return (
    <Box
      {...boxProps}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: 'row',
        alignItems: align ? alignMap[align] : undefined,
        justifyContent: justify ? justifyMap[justify] : undefined,
        flexWrap: wrap === true ? 'wrap' : wrap === false ? 'nowrap' : wrap || undefined,
        width: fullWidth ? '100%' : undefined,
        height: fullHeight ? '100%' : undefined,
        ...style,
        gap: getGap(gap),  // After spread to prevent override
      }}
    >
      {children}
    </Box>
  )
}

// ============================================
// AspectRatio Component
// ============================================
interface AspectRatioProps {
  children: React.ReactNode
  ratio?: number // width / height (e.g., 16/9)
  maxW?: string | number
  className?: string
  style?: React.CSSProperties
}

export function AspectRatio({
  children,
  ratio = 1,
  maxW,
  className,
  style
}: AspectRatioProps): React.ReactNode {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: maxW,
        ...style
      }}
    >
      <div style={{ paddingBottom: `${100 / ratio}%` }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ============================================
// Page Component (full page layout)
// ============================================
interface PageProps {
  children: React.ReactNode
  padding?: SpacingValue
  bg?: string
  maxWidth?: Breakpoint | 'full' | number
  center?: boolean
  minHeight?: string
  style?: React.CSSProperties
}

export function Page({
  children,
  padding = 'lg',
  bg = 'var(--bg-primary)',
  maxWidth,
  center,
  minHeight = '100vh',
  style
}: PageProps): React.ReactNode {
  const maxWidthValue = maxWidth === 'full'
    ? '100%'
    : typeof maxWidth === 'number'
      ? maxWidth
      : maxWidth
        ? BREAKPOINTS[maxWidth]
        : undefined

  return (
    <div style={{
      minHeight,
      backgroundColor: bg,
      padding: resolveSpacing(padding),
      width: '100%',
      maxWidth: maxWidthValue,
      marginLeft: center ? 'auto' : undefined,
      marginRight: center ? 'auto' : undefined,
      boxSizing: 'border-box',
      ...style
    }}>
      {children}
    </div>
  )
}

// ============================================
// Section Component (page sections)
// ============================================
interface SectionProps {
  children: React.ReactNode
  padding?: SpacingValue
  bg?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  style?: React.CSSProperties
}

export function Section({
  children,
  padding = 'lg',
  bg = 'var(--bg-secondary)',
  rounded = 'lg',
  border,
  style
}: SectionProps): React.ReactNode {
  const radiusMap = {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  }

  return (
    <div style={{
      padding: resolveSpacing(padding),
      backgroundColor: bg,
      borderRadius: radiusMap[rounded],
      border: border ? '1px solid var(--border-color)' : undefined,
      ...style
    }}>
      {children}
    </div>
  )
}

// ============================================
// ActionItem Component (clickable item)
// ============================================
interface ActionItemProps {
  children?: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  label?: string
  color?: string
  padding?: SpacingValue
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  bg?: string
  hoverBg?: string
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end'
  gap?: SpacingValue
  disabled?: boolean
  style?: React.CSSProperties
}

export function ActionItem({
  children,
  onClick,
  icon,
  label,
  color,
  padding = 'md',
  rounded = 'md',
  bg = 'var(--bg-tertiary)',
  hoverBg = 'var(--bg-hover)',
  direction = 'column',
  align = 'center',
  gap = 'sm',
  disabled,
  style
}: ActionItemProps): React.ReactNode {
  const [hovered, setHovered] = React.useState(false)

  const radiusMap = {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  }

  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end'
  }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: alignMap[align],
        justifyContent: direction === 'column' ? 'center' : undefined,
        gap: resolveSpacing(gap),
        padding: resolveSpacing(padding),
        borderRadius: radiusMap[rounded],
        backgroundColor: hovered && !disabled ? hoverBg : bg,
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.15s ease',
        ...style
      }}
    >
      {icon && <div style={{ color: color || 'var(--text-secondary)' }}>{icon}</div>}
      {label && (
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}>
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

// ============================================
// IconBox Component (icon container)
// ============================================
interface IconBoxProps {
  children: React.ReactNode
  size?: number
  color?: string
  bg?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  style?: React.CSSProperties
}

export function IconBox({
  children,
  size = 40,
  color = 'var(--text-secondary)',
  bg = 'var(--bg-tertiary)',
  rounded = 'md',
  style
}: IconBoxProps): React.ReactNode {
  const radiusMap = {
    sm: 6,
    md: 10,
    lg: 12,
    full: '50%'
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: radiusMap[rounded],
      backgroundColor: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      flexShrink: 0,
      ...style
    }}>
      {children}
    </div>
  )
}
