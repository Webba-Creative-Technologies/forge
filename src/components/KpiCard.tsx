import { CSSProperties, ReactNode } from 'react'
import { Card } from './Card'
import { VStack, HStack } from '../hooks/useResponsive'
import { Sparkline } from './Charts'

// ============================================
// KPI CARD
// ============================================
// Compact dashboard tile: label + big numeric value + optional delta line
// + optional inline sparkline. Used in KPI strips on every dashboard.
//
// Distinct from `StatCard` (icon-led larger card with `change: number`
// auto-formatting). KpiCard is the lighter, modern dashboard tile and
// accepts pre-formatted strings or React nodes for `value` / `delta`,
// plus a raw sparkline `number[]` array.
//
// The component owns layout (Card padding, VStack rhythm, footer row with
// delta + spark) so call sites stay small. Tone on the delta drives the
// colour against semantic tokens, not literal hex.
//
// @example
//   <KpiCard
//     label="Net worth"
//     value="$1,247,832"
//     delta={{ text: '+11.4%', tone: 'up' }}
//     sparkline={[100, 102, 101, 105, 110, 108, 114]}
//   />

export type KpiTone = 'up' | 'down' | 'flat' | 'brand'

const TONE_COLOR: Record<KpiTone, string> = {
  up: 'var(--color-success)',
  down: 'var(--color-error)',
  flat: 'var(--text-muted)',
  brand: 'var(--brand-primary)'
}

interface KpiCardProps {
  /** Small uppercase label above the value. */
  label: ReactNode
  /** The headline figure. Pass a string (already formatted) or a node for custom typography. */
  value: ReactNode
  /** Optional delta caption rendered in the footer row. `tone` colours it. */
  delta?: { text: ReactNode; tone?: KpiTone }
  /** Optional sparkline data. */
  sparkline?: number[]
  /** Sparkline stroke colour. Defaults to the delta tone, or brand if no delta. */
  sparkColor?: string
  /** Sparkline width in px. @default 88 */
  sparkWidth?: number
  /** Sparkline height in px. @default 36 */
  sparkHeight?: number
  /** Pass-through to Card. @default true */
  hoverable?: boolean
  /** Padding on the underlying Card. @default 'md' */
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export function KpiCard({
  label,
  value,
  delta,
  sparkline,
  sparkColor,
  sparkWidth = 88,
  sparkHeight = 36,
  hoverable = true,
  padding = 'md',
  className,
  style,
  onClick
}: KpiCardProps) {
  const deltaColor = delta?.tone ? TONE_COLOR[delta.tone] : 'var(--text-secondary)'
  const sparkStroke = sparkColor ?? (delta?.tone ? TONE_COLOR[delta.tone] : 'var(--brand-primary)')

  return (
    <Card
      padding={padding}
      hoverable={hoverable}
      className={className}
      style={{ minHeight: 144, display: 'flex', flexDirection: 'column', ...style }}
      onClick={onClick}
    >
      <VStack gap="xs" style={{ height: '100%' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}
        >
          {label}
        </span>
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums lining-nums'
          }}
        >
          {value}
        </div>
        <HStack
          justify="between"
          align="end"
          style={{ marginTop: 'auto', paddingTop: 8, gap: 12 }}
        >
          {delta ? (
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: deltaColor,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {delta.text}
            </span>
          ) : <span />}
          {sparkline && sparkline.length > 1 && (
            <Sparkline
              data={sparkline}
              width={sparkWidth}
              height={sparkHeight}
              color={sparkStroke}
            />
          )}
        </HStack>
      </VStack>
    </Card>
  )
}
