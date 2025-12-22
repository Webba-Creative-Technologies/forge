import { ReactNode } from 'react'
import { Text } from './Typography'

// ============================================
// TYPES
// ============================================
export interface DescriptionItem {
  label: string
  value: ReactNode
  span?: number // Column span
}

// ============================================
// DESCRIPTIONS
// ============================================
interface DescriptionsProps {
  items: DescriptionItem[]
  title?: string
  columns?: 1 | 2 | 3 | 4
  layout?: 'horizontal' | 'vertical'
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
  labelWidth?: number | string
  colon?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Descriptions({
  items,
  title,
  columns = 2,
  layout = 'horizontal',
  bordered = true,
  size = 'md',
  labelWidth,
  colon = true,
  className,
  style
}: DescriptionsProps) {
  const sizeStyles = {
    sm: { padding: '8px 12px', fontSize: '0.75rem', labelFontSize: '0.7rem' },
    md: { padding: '12px 16px', fontSize: '0.875rem', labelFontSize: '0.8125rem' },
    lg: { padding: '16px 20px', fontSize: '1rem', labelFontSize: '0.875rem' }
  }

  const s = sizeStyles[size]

  // Group items into rows based on column span
  const rows: DescriptionItem[][] = []
  let currentRow: DescriptionItem[] = []
  let currentSpan = 0

  items.forEach(item => {
    const itemSpan = item.span || 1
    if (currentSpan + itemSpan > columns) {
      rows.push(currentRow)
      currentRow = [item]
      currentSpan = itemSpan
    } else {
      currentRow.push(item)
      currentSpan += itemSpan
    }
  })
  if (currentRow.length > 0) {
    rows.push(currentRow)
  }

  if (bordered) {
    return (
      <div className={className} style={style}>
        {title && (
          <Text weight="semibold" style={{ marginBottom: 12 }}>
            {title}
          </Text>
        )}
        <div
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                borderBottom: rowIndex < rows.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}
            >
              {row.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  style={{
                    gridColumn: `span ${item.span || 1}`,
                    display: layout === 'horizontal' ? 'flex' : 'block',
                    borderRight: itemIndex < row.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  <div
                    style={{
                      padding: s.padding,
                      backgroundColor: 'var(--bg-tertiary)',
                      fontSize: s.labelFontSize,
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      width: layout === 'horizontal' ? (labelWidth || '40%') : '100%',
                      flexShrink: 0,
                      borderRight: layout === 'horizontal' ? '1px solid var(--border-color)' : 'none',
                      borderBottom: layout === 'vertical' ? '1px solid var(--border-color)' : 'none'
                    }}
                  >
                    {item.label}{colon ? ' :' : ''}
                  </div>
                  <div
                    style={{
                      padding: s.padding,
                      fontSize: s.fontSize,
                      color: 'var(--text-primary)',
                      flex: 1
                    }}
                  >
                    {item.value || '-'}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Non-bordered layout
  return (
    <div className={className} style={style}>
      {title && (
        <Text weight="semibold" style={{ marginBottom: 16 }}>
          {title}
        </Text>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: layout === 'horizontal' ? '12px 24px' : '16px 24px'
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              gridColumn: `span ${item.span || 1}`,
              display: layout === 'horizontal' ? 'flex' : 'block',
              gap: layout === 'horizontal' ? 8 : 4
            }}
          >
            <div
              style={{
                fontSize: s.labelFontSize,
                color: 'var(--text-muted)',
                fontWeight: 500,
                width: layout === 'horizontal' ? (labelWidth || 'auto') : '100%',
                flexShrink: 0
              }}
            >
              {item.label}{colon ? ' :' : ''}
            </div>
            <div
              style={{
                fontSize: s.fontSize,
                color: 'var(--text-primary)'
              }}
            >
              {item.value || '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// DESCRIPTION LIST (simpler variant)
// ============================================
interface DescriptionListProps {
  items: Array<{ label: string; value: ReactNode }>
  direction?: 'horizontal' | 'vertical'
  gap?: number
  className?: string
  style?: React.CSSProperties
}

export function DescriptionList({
  items,
  direction = 'vertical',
  gap = 12,
  className,
  style
}: DescriptionListProps) {
  return (
    <dl
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap',
        gap,
        margin: 0,
        ...style
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <dt style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}>
            {item.label}
          </dt>
          <dd style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'var(--text-primary)'
          }}>
            {item.value || '-'}
          </dd>
        </div>
      ))}
    </dl>
  )
}
