import { CSSProperties, ReactNode } from 'react'
import { Container } from '../hooks/useResponsive'

// ============================================
// PAGE SECTION
// ============================================
// Section wrapper for landing pages. Owns the responsive vertical padding
// (clamps so it scales with viewport), the max-width container, and an
// optional accent background. Replaces the
// `<section><Container><VStack>` boilerplate that every marketing page
// re-implements.
//
// @example
//   <PageSection size="lg">
//     <Heading>Section title</Heading>
//     <Text color="secondary">Section copy</Text>
//   </PageSection>
//
//   <PageSection id="features" size="xl" container="lg" tone="subtle">
//     <Grid columns={3}>{/* features */}</Grid>
//   </PageSection>

type SectionSize = 'sm' | 'md' | 'lg' | 'xl'

const PADDING_Y: Record<SectionSize, string> = {
  sm: 'clamp(40px, 6vh, 64px)',
  md: 'clamp(56px, 9vh, 96px)',
  lg: 'clamp(80px, 12vh, 128px)',
  xl: 'clamp(96px, 16vh, 168px)'
}

interface PageSectionProps {
  children: ReactNode
  /** Optional anchor id for nav scroll-to. */
  id?: string
  /** Vertical padding scale. @default 'md' */
  size?: SectionSize
  /** Pass-through to the inner `Container.maxWidth`. @default 'xl' */
  container?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /** Background tone. `subtle` uses `var(--bg-secondary)` for a one-step lift, `tertiary` deeper. @default 'transparent' */
  tone?: 'transparent' | 'subtle' | 'tertiary'
  /** Render the section without the inner Container (full-bleed). Use this when you need edge-to-edge content like a Marquee. @default false */
  fullBleed?: boolean
  /** Render as a `<section>` (default) or override (e.g. `<header>`, `<footer>`). @default 'section' */
  as?: 'section' | 'header' | 'footer' | 'div'
  className?: string
  style?: CSSProperties
}

export function PageSection({
  children,
  id,
  size = 'md',
  container = 'xl',
  tone = 'transparent',
  fullBleed = false,
  as: Component = 'section',
  className,
  style
}: PageSectionProps) {
  const bg = tone === 'subtle'
    ? 'var(--bg-secondary)'
    : tone === 'tertiary'
      ? 'var(--bg-tertiary)'
      : undefined

  return (
    <Component
      id={id}
      className={className}
      style={{
        paddingTop: PADDING_Y[size],
        paddingBottom: PADDING_Y[size],
        backgroundColor: bg,
        position: 'relative',
        ...style
      }}
    >
      {fullBleed ? children : <Container maxWidth={container}>{children}</Container>}
    </Component>
  )
}
