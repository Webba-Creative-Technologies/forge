import { CSSProperties, ReactNode } from 'react'

// ============================================
// CHART LEGEND
// ============================================
// Small reusable legend for charts: a color swatch + label + optional
// value pill per item. Use it next to LineChart, MultiLineChart, BarChart,
// StackedAreaChart, StackedBar, or any custom viz that doesn't ship its
// own legend.
//
// The component is layout-agnostic: row (default, wraps), or column.
//
// @example
//   <ChartLegend items={[
//     { color: '#1B3F6E', label: 'Portfolio' },
//     { color: '#B43426', label: 'S&P 500', shape: 'dash' }
//   ]} />

export interface ChartLegendItem {
  color: string
  label: ReactNode
  /** Optional small monospace value rendered after the label. */
  value?: ReactNode
  /** Swatch shape. Solid square by default; 'dash' renders a thin horizontal rule (use for dashed/dotted reference lines). @default 'square' */
  shape?: 'square' | 'dot' | 'dash'
}

interface ChartLegendProps {
  items: ChartLegendItem[]
  layout?: 'row' | 'column'
  /** Gap between items in px. @default 16 (row) / 8 (column) */
  gap?: number
  className?: string
  style?: CSSProperties
}

export function ChartLegend({ items, layout = 'row', gap, className, style }: ChartLegendProps) {
  const resolvedGap = gap ?? (layout === 'column' ? 8 : 16)

  return (
    <div
      role="list"
      className={className}
      style={{
        display: 'flex',
        flexDirection: layout === 'column' ? 'column' : 'row',
        flexWrap: layout === 'row' ? 'wrap' : 'nowrap',
        gap: resolvedGap,
        ...style
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          role="listitem"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}
        >
          <Swatch color={item.color} shape={item.shape ?? 'square'} />
          <span>{item.label}</span>
          {item.value !== undefined && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}
            >
              {item.value}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

function Swatch({ color, shape }: { color: string; shape: 'square' | 'dot' | 'dash' }) {
  if (shape === 'dot') {
    return (
      <span
        aria-hidden
        style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }}
      />
    )
  }
  if (shape === 'dash') {
    return (
      <span
        aria-hidden
        style={{
          width: 18,
          height: 2,
          backgroundColor: 'transparent',
          borderTop: `2px dashed ${color}`,
          flexShrink: 0
        }}
      />
    )
  }
  return (
    <span
      aria-hidden
      style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color, flexShrink: 0 }}
    />
  )
}
