import { CSSProperties, ReactNode } from 'react'
import { Checkmark16Filled } from '@fluentui/react-icons'
import { Card } from './Card'
import { Heading, Text } from './Typography'
import { Badge } from './Badge'
import { Button } from './Button'
import { VStack, HStack } from '../hooks/useResponsive'

// ============================================
// PRICING CARD
// ============================================
// Composable pricing tier card. Built on top of Card + VStack + Heading +
// Text + Badge + Button + Checkmark icon, so it inherits the design
// system (radius, padding, shadow, hover) and a featured-tier highlight
// works without literal hex.
//
// @example
//   <PricingCard
//     tier="Pro"
//     price="$12"
//     period="/ user / month"
//     tagline="For growing product teams."
//     features={['Unlimited workspaces', 'Async standups', 'SSO']}
//     cta={{ label: 'Start free', onClick: () => {} }}
//     featured
//   />

export interface PricingCardFeature {
  /** Bullet text. Pre-formatted, can be a node for inline emphasis. */
  text: ReactNode
  /** Render this bullet muted (e.g. an "everything in Pro plus..." separator). @default false */
  muted?: boolean
}

interface PricingCardProps {
  /** Tier name (Free / Pro / Team / Enterprise). Rendered as a small uppercase label. */
  tier: ReactNode
  /** Pre-formatted price string ("$0", "$12", "Contact us"). */
  price: ReactNode
  /** Optional unit caption shown next to the price ("/ month", "/ user / mo"). */
  period?: ReactNode
  /** One-line tagline below the price. */
  tagline?: ReactNode
  /** Feature bullets. Pass strings or `{ text, muted }`. */
  features: Array<ReactNode | PricingCardFeature>
  /** Primary CTA. Set `variant` to override the default (primary on featured, secondary otherwise). */
  cta: {
    label: ReactNode
    onClick?: () => void
    href?: string
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  /** Highlight this tier as the featured pick. Adds a brand-coloured border, a "Most popular" badge, and lifts the card. @default false */
  featured?: boolean
  /** Badge label shown when `featured` is true. @default 'Most popular' */
  featuredLabel?: ReactNode
  /** Hover effect on the card. @default true */
  hoverable?: boolean
  className?: string
  style?: CSSProperties
}

function normalizeFeature(item: ReactNode | PricingCardFeature): PricingCardFeature {
  if (item != null && typeof item === 'object' && 'text' in (item as PricingCardFeature)) {
    return item as PricingCardFeature
  }
  return { text: item as ReactNode }
}

export function PricingCard({
  tier,
  price,
  period,
  tagline,
  features,
  cta,
  featured = false,
  featuredLabel = 'Most popular',
  hoverable = true,
  className,
  style
}: PricingCardProps) {
  const ctaVariant = cta.variant ?? (featured ? 'primary' : 'secondary')

  return (
    <Card
      padding="lg"
      hoverable={hoverable}
      variant={featured ? 'elevated' : 'default'}
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderColor: featured ? 'var(--brand-primary)' : undefined,
        borderWidth: featured ? 2 : undefined,
        // Featured tier lifts above siblings so the absolute "Most popular"
        // badge (top: -12px) renders on top of neighbouring cards.
        zIndex: featured ? 2 : 1,
        ...style
      }}
    >
      {featured && (
        <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
          <Badge
            variant="primary"
            size="sm"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
          >
            {featuredLabel}
          </Badge>
        </div>
      )}
      <VStack gap="lg" style={{ height: '100%' }}>
        <VStack gap="md">
          <Text
            size="xs"
            weight="semibold"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: featured ? 'var(--brand-primary)' : 'var(--text-muted)'
            }}
          >
            {tier}
          </Text>
          <HStack align="baseline" gap="xs">
            <Heading
              level={2}
              style={{
                margin: 0,
                fontSize: 'clamp(36px, 4vw, 48px)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {price}
            </Heading>
            {period && <Text size="sm" color="muted">{period}</Text>}
          </HStack>
          {tagline && <Text size="sm" color="secondary">{tagline}</Text>}
        </VStack>

        <VStack gap="sm" style={{ flex: 1 }}>
          {features.map((raw, i) => {
            const f = normalizeFeature(raw)
            return (
              <HStack key={i} gap="sm" align="start">
                <Checkmark16Filled
                  style={{
                    color: featured ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    flexShrink: 0,
                    marginTop: 2
                  }}
                />
                <Text size="sm" color={f.muted ? 'muted' : 'primary'}>
                  {f.text}
                </Text>
              </HStack>
            )
          })}
        </VStack>

        <Button
          variant={ctaVariant}
          size="md"
          fullWidth
          onClick={cta.href ? () => { window.location.href = cta.href! } : cta.onClick}
        >
          {cta.label}
        </Button>
      </VStack>
    </Card>
  )
}
