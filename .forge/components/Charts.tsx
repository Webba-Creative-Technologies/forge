import { useState, useEffect, useRef, ReactNode } from 'react'

// ============================================
// TYPES
// ============================================
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

// ============================================
// RICH TOOLTIP COMPONENT
// ============================================
interface ChartTooltipProps {
  visible: boolean
  children: ReactNode
}

function ChartTooltip({ visible, children }: ChartTooltipProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        marginBottom: 8,
        backgroundColor: 'var(--bg-dropdown)',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.75rem',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
        zIndex: 2000,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        transform: 'translateX(-50%) scale(1)',
        opacity: 1,
        transformOrigin: 'center bottom'
      }}
    >
      {children}
      <div style={{
        position: 'absolute',
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid var(--bg-dropdown)'
      }} />
    </div>
  )
}

// ============================================
// BAR CHART
// ============================================
interface BarChartProps {
  data: ChartDataPoint[]
  height?: number
  showLabels?: boolean
  showValues?: boolean
  animated?: boolean
  horizontal?: boolean
  color?: string
  barRadius?: number
}

export function BarChart({
  data,
  height = 180,
  showLabels = true,
  showValues = true,
  animated = true,
  horizontal = false,
  color = 'var(--brand-primary)',
  barRadius = 6
}: BarChartProps) {
  const [hasAnimated, setHasAnimated] = useState(!animated)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const maxValue = Math.max(...data.map(d => d.value))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setHasAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  if (horizontal) {
    return (
      <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'visible', position: 'relative' }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          const isHovered = hoveredIndex === index

          const percentOfTotal = ((item.value / total) * 100).toFixed(0)

          return (
            <div
              key={item.label}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {showLabels && (
                <span style={{
                  width: 80,
                  fontSize: '0.75rem',
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textAlign: 'right',
                  flexShrink: 0,
                  transition: 'color 0.2s ease'
                }}>
                  {item.label}
                </span>
              )}
              <div style={{
                flex: 1,
                height: 28,
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: barRadius,
                overflow: 'visible',
                position: 'relative'
              }}>
                <div style={{
                  width: hasAnimated ? `${percentage}%` : '0%',
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: barRadius,
                  transition: `width 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 60}ms, transform 0.2s ease`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: showValues ? '0.625rem' : 0,
                  transform: isHovered ? 'scaleY(1.08)' : 'scaleY(1)',
                  transformOrigin: 'left center',
                  boxShadow: isHovered ? `0 0 16px ${color}50` : 'none'
                }}>
                  {showValues && percentage > 20 && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'white',
                      opacity: hasAnimated ? 1 : 0,
                      transition: 'opacity 0.3s ease 0.4s'
                    }}>
                      {item.value}
                    </span>
                  )}
                </div>

                {/* Tooltip centré sur la barre */}
                <ChartTooltip visible={isHovered}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {percentOfTotal}% du total
                  </div>
                </ChartTooltip>
              </div>
              {showValues && percentage <= 20 && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isHovered ? 600 : 400,
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                  minWidth: 36,
                  transition: 'all 0.2s ease'
                }}>
                  {item.value}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="animate-fadeIn" style={{ height, overflow: 'visible', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: showLabels ? height - 36 : height,
        gap: '0.75rem',
        padding: '0 0.5rem'
      }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          const percentOfTotal = ((item.value / total) * 100).toFixed(0)
          const isHovered = hoveredIndex === index

          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                maxWidth: 56,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={{
                width: '100%',
                borderRadius: barRadius,
                height: showLabels ? height - 40 : height - 4,
                position: 'relative'
              }}>
                {/* Tooltip at bar height */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${percentage}%`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 8,
                    backgroundColor: 'var(--bg-dropdown)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 0.75rem',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
                    zIndex: 2000,
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {percentOfTotal}% du total
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: -6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid var(--bg-dropdown)'
                    }} />
                  </div>
                )}

                <div style={{
                  width: '100%',
                  height: hasAnimated ? `${percentage}%` : '0%',
                  backgroundColor: color,
                  borderRadius: barRadius,
                  transition: `height 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 60}ms, transform 0.2s ease`,
                  position: 'absolute',
                  bottom: 0,
                  transform: isHovered ? 'scaleX(1.1)' : 'scaleX(1)',
                  boxShadow: isHovered ? `0 -4px 20px ${color}60` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '0.375rem'
                }}>
                  {showValues && !isHovered && (
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'white',
                      opacity: hasAnimated ? 1 : 0,
                      transition: `opacity 0.3s ease ${index * 60 + 400}ms`
                    }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {showLabels && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '0.625rem',
          padding: '0 0.5rem'
        }}>
          {data.map((item, index) => (
            <span key={item.label} style={{
              flex: 1,
              maxWidth: 56,
              fontSize: '0.6875rem',
              color: hoveredIndex === index ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: hoveredIndex === index ? 500 : 400,
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}>
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// LINE CHART (Smooth monotone curves)
// ============================================
interface LineChartProps {
  data: number[]
  labels?: string[]
  width?: number | string
  height?: number
  color?: string
  fillColor?: string
  showDots?: boolean
  animated?: boolean
  smooth?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  gridLines?: number
  showYLabels?: boolean
  showXLabels?: boolean
}

// Monotone cubic interpolation - prevents overshooting
function monotonePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]

    // Control point distance (1/3 of horizontal distance)
    const dx = (p1.x - p0.x) / 3

    // Simple horizontal control points for smooth but non-overshooting curves
    const cp1x = p0.x + dx
    const cp1y = p0.y
    const cp2x = p1.x - dx
    const cp2y = p1.y

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
  }

  return path
}

export function LineChart({
  data,
  labels = [],
  width = '100%',
  height = 140,
  color = 'var(--brand-primary)',
  fillColor,
  showDots = true,
  animated = true,
  smooth = true,
  showTooltip = true,
  showGrid = true,
  gridLines = 5,
  showYLabels = false,
  showXLabels = false
}: LineChartProps) {
  const [hasAnimated, setHasAnimated] = useState(!animated)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setHasAnimated(true), 50)
      return () => clearTimeout(timer)
    }
  }, [animated])

  // Padding en pourcentage
  const paddingX = 4
  const paddingY = 12

  const points = data.map((value, index) => {
    const xPercent = paddingX + (index / (data.length - 1)) * (100 - paddingX * 2)
    const yPercent = paddingY + (1 - (value - minValue) / range) * (100 - paddingY * 2)
    return { x: xPercent, y: yPercent, value }
  })

  const pathData = smooth ? monotonePath(points) : points.map((p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  ).join(' ')

  const areaPath = `${pathData} L ${points[points.length - 1].x} ${100 - paddingY + 8} L ${points[0].x} ${100 - paddingY + 8} Z`

  const uniqueId = `line-${Math.random().toString(36).substr(2, 9)}`

  // Generate Y axis values
  const yLabels = Array.from({ length: gridLines }).map((_, i) => {
    const value = maxValue - (i / (gridLines - 1)) * range
    return Math.round(value)
  })

  return (
    <div className="animate-fadeIn" style={{ width, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {/* Y axis labels */}
        {showYLabels && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height,
            paddingTop: `${paddingY * height / 100}px`,
            paddingBottom: `${paddingY * height / 100}px`,
            minWidth: 28
          }}>
            {yLabels.map((val, i) => (
              <span key={i} style={{
                fontSize: '0.625rem',
                color: 'var(--text-muted)',
                textAlign: 'right',
                lineHeight: 1
              }}>
                {val}
              </span>
            ))}
          </div>
        )}

        {/* Chart area */}
        <div style={{ flex: 1, height, position: 'relative' }}>
          {/* Grid SVG (no animation) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            {/* Horizontal grid lines */}
            {showGrid && (
              <g>
                {Array.from({ length: gridLines }).map((_, i) => {
                  const yPercent = paddingY + (i / (gridLines - 1)) * (100 - paddingY * 2)
                  return (
                    <line
                      key={`h-${i}`}
                      x1={0}
                      y1={yPercent}
                      x2={100}
                      y2={yPercent}
                      stroke="var(--border-subtle)"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  )
                })}
              </g>
            )}
          </svg>

          {/* Line and fill SVG with clip animation */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              clipPath: hasAnimated ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
              transition: animated ? 'clip-path 1.2s ease-out' : 'none'
            }}
          >
            <defs>
              <linearGradient id={`${uniqueId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={fillColor || color} stopOpacity="0.3" />
                <stop offset="70%" stopColor={fillColor || color} stopOpacity="0.05" />
                <stop offset="100%" stopColor={fillColor || color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={areaPath}
              fill={`url(#${uniqueId}-fill)`}
              style={{
                opacity: hasAnimated ? 1 : 0,
                transition: 'opacity 0.6s ease 0.4s'
              }}
            />

            {/* Main line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

      {/* Dots en HTML pour garder leur forme ronde */}
      {showDots && points.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: hoveredIndex === index ? 10 : 1
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Hit area */}
          <div style={{
            width: 28,
            height: 28,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer'
          }} />

          {/* Visible dot */}
          <div style={{
            width: hoveredIndex === index ? 12 : 8,
            height: hoveredIndex === index ? 12 : 8,
            borderRadius: '50%',
            backgroundColor: hoveredIndex === index ? 'white' : color,
            border: `2.5px solid ${color}`,
            opacity: hasAnimated ? 1 : 0,
            transform: `scale(${hasAnimated ? 1 : 0})`,
            transition: `all 0.2s ease, opacity 0.25s ease ${(index / (data.length - 1)) * 1000 + 200}ms, transform 0.3s ease ${(index / (data.length - 1)) * 1000 + 200}ms`,
            boxShadow: hoveredIndex === index ? `0 0 12px ${color}` : `0 2px 4px rgba(0,0,0,0.2)`
          }} />

          {/* Tooltip */}
          <ChartTooltip visible={showTooltip && hoveredIndex === index}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {labels[index] && (
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {labels[index]}
                </span>
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {data[index]}
              </span>
            </div>
          </ChartTooltip>
        </div>
      ))}
        </div>
      </div>

      {/* X axis labels */}
      {showXLabels && labels.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: showYLabels ? 36 : 0,
          paddingLeft: `${paddingX}%`,
          paddingRight: `${paddingX}%`
        }}>
          {labels.map((label, i) => (
            <span key={i} style={{
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// DONUT CHART
// ============================================
interface DonutChartProps {
  data: ChartDataPoint[]
  size?: number
  thickness?: number
  animated?: boolean
  showLegend?: boolean
  legendBelow?: boolean
  centerContent?: ReactNode
}

export function DonutChart({
  data,
  size = 160,
  thickness = 24,
  animated = true,
  showLegend = true,
  legendBelow = false,
  centerContent
}: DonutChartProps) {
  const [hasAnimated, setHasAnimated] = useState(!animated)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setHasAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  const defaultColors = [
    'var(--brand-primary)',
    '#10b981',
    '#06b6d4',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6'
  ]

  let currentOffset = 0
  const segments = data.map((item, index) => {
    const percentage = item.value / total
    const strokeLength = circumference * percentage
    const offset = currentOffset
    currentOffset += strokeLength
    return { ...item, percentage, strokeLength, offset, index }
  })

  return (
    <div
      ref={containerRef}
      className="animate-fadeIn"
      style={{
        display: 'flex',
        flexDirection: legendBelow ? 'column' : 'row',
        alignItems: 'center',
        gap: '1.5rem',
        overflow: 'visible',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      <div style={{ position: 'relative', width: size + 16, height: size + 16, overflow: 'visible', padding: 8 }}>

        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible', display: 'block' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth={thickness}
          />

          {/* Data segments */}
          {segments.map((segment) => {
            const isHovered = hoveredIndex === segment.index
            const segmentColor = segment.color || defaultColors[segment.index % defaultColors.length]

            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segmentColor}
                strokeWidth={isHovered ? thickness + 6 : thickness}
                strokeDasharray={`${hasAnimated ? segment.strokeLength : 0} ${circumference}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="butt"
                style={{
                  transition: `stroke-dasharray 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${segment.index * 120}ms, stroke-width 0.2s ease`,
                  cursor: 'pointer',
                  filter: isHovered ? `drop-shadow(0 0 8px ${segmentColor})` : 'none'
                }}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )
          })}
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          {hoveredIndex !== null ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                {(segments[hoveredIndex].percentage * 100).toFixed(0)}%
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.125rem'
              }}>
                {segments[hoveredIndex].label}
              </div>
            </div>
          ) : centerContent || (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                {total}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.125rem'
              }}>
                Total
              </div>
            </div>
          )}
        </div>

        {/* Tooltip en bas quand pas de légende */}
        {!showLegend && hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -12,
              transform: 'translateX(-50%) translateY(100%)',
              backgroundColor: 'var(--bg-dropdown)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.75rem',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.08)',
              zIndex: 2000,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: segments[hoveredIndex].color || defaultColors[hoveredIndex % defaultColors.length]
              }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {segments[hoveredIndex].label}
              </span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {segments[hoveredIndex].value} ({(segments[hoveredIndex].percentage * 100).toFixed(0)}%)
            </div>
            <div style={{
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid var(--bg-dropdown)'
            }} />
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div style={{
          display: 'flex',
          flexDirection: legendBelow ? 'row' : 'column',
          flexWrap: legendBelow ? 'wrap' : 'nowrap',
          justifyContent: legendBelow ? 'center' : 'flex-start',
          gap: '0.5rem',
          overflow: 'visible'
        }}>
          {segments.map((segment) => {
            const segmentColor = segment.color || defaultColors[segment.index % defaultColors.length]
            const isHovered = hoveredIndex === segment.index

            return (
              <div
                key={segment.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.625rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isHovered ? 'var(--bg-tertiary)' : 'transparent',
                  opacity: hasAnimated ? 1 : 0,
                  transform: hasAnimated ? 'translateX(0)' : 'translateX(-12px)',
                  transition: `all 0.4s ease ${segment.index * 80 + 500}ms`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <ChartTooltip visible={isHovered}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {segment.value}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {(segment.percentage * 100).toFixed(1)}% du total
                  </div>
                </ChartTooltip>

                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: segmentColor,
                  boxShadow: isHovered ? `0 0 8px ${segmentColor}` : 'none',
                  transition: 'box-shadow 0.2s ease'
                }} />
                <span style={{
                  fontSize: '0.8125rem',
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease'
                }}>
                  {segment.label}
                </span>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginLeft: 'auto'
                }}>
                  {segment.value}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================
// SPARKLINE (Mini inline chart)
// ============================================
interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color,
  trend
}: SparklineProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [uniqueId] = useState(() => `spark-${Math.random().toString(36).slice(2, 9)}`)

  // Handle empty or single data point
  if (!data || data.length < 2) {
    return (
      <svg style={{ width, height }}>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--border-color)" strokeWidth="1" />
      </svg>
    )
  }

  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Use semantic colors from theme
  const trendColor = trend === 'up'
    ? 'var(--success)'
    : trend === 'down'
      ? 'var(--error)'
      : color || 'var(--brand-primary)'

  const padding = 4
  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1)) * (100 - padding * 2),
    y: padding + (1 - (value - minValue) / range) * (100 - padding * 2)
  }))

  const pathData = monotonePath(points)

  const lastPoint = points[points.length - 1]

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          clipPath: hasAnimated ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 0.8s ease-out'
        }}
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={`${pathData} L ${lastPoint.x} ${100 - padding} L ${points[0].x} ${100 - padding} Z`}
          fill={`url(#${uniqueId})`}
          style={{
            opacity: hasAnimated ? 1 : 0,
            transition: 'opacity 0.4s ease 0.3s'
          }}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={trendColor}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* End dot - positioned outside SVG to avoid stretching */}
      <div
        style={{
          position: 'absolute',
          left: `${lastPoint.x}%`,
          top: `${lastPoint.y}%`,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: trendColor,
          transform: `translate(-50%, -50%) scale(${hasAnimated ? 1 : 0})`,
          opacity: hasAnimated ? 1 : 0,
          transition: 'opacity 0.2s ease 0.7s, transform 0.3s ease 0.7s'
        }}
      />
    </div>
  )
}

// ============================================
// PROGRESS RING (Bigger default size)
// ============================================
interface ProgressRingProps {
  value: number // 0-100
  size?: number
  thickness?: number
  color?: string
  showValue?: boolean
  animated?: boolean
  label?: string
}

export function ProgressRing({
  value,
  size = 90,
  thickness = 10,
  color = 'var(--brand-primary)',
  showValue = true,
  animated = true,
  label
}: ProgressRingProps) {
  const [hasAnimated, setHasAnimated] = useState(!animated)
  const [displayValue, setDisplayValue] = useState(0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setHasAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  // Animate counter
  useEffect(() => {
    if (!hasAnimated) return

    const duration = 800
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(startValue + (value - startValue) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [hasAnimated, value])

  const innerSize = size - thickness * 2
  const glowPadding = 8

  return (
    <div className="animate-fadeIn" style={{
      position: 'relative',
      width: size + glowPadding * 2,
      height: size + glowPadding * 2,
      padding: glowPadding
    }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={thickness}
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={hasAnimated ? strokeDashoffset : circumference}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: `drop-shadow(0 0 4px ${color})`
          }}
        />
      </svg>

      {/* Center content */}
      {(showValue || label) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: innerSize,
          height: innerSize,
          textAlign: 'center'
        }}>
          {showValue && (
            <span style={{
              fontSize: size >= 100 ? '1.5rem' : size >= 80 ? '1.125rem' : size >= 60 ? '0.875rem' : '0.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1
            }}>
              {displayValue}%
            </span>
          )}
          {label && (
            <span style={{
              fontSize: size >= 100 ? '0.75rem' : size >= 80 ? '0.6875rem' : '0.5rem',
              color: 'var(--text-muted)',
              marginTop: '0.125rem',
              lineHeight: 1
            }}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// GROUPED BAR CHART (Multiple series side by side)
// ============================================
export interface GroupedBarDataPoint {
  label: string
  values: number[]
}

interface GroupedBarChartProps {
  data: GroupedBarDataPoint[]
  series: { name: string; color: string }[]
  height?: number
  showLabels?: boolean
  showValues?: boolean
  animated?: boolean
  horizontal?: boolean
  barRadius?: number
  showLegend?: boolean
}

export function GroupedBarChart({
  data,
  series,
  height = 200,
  showLabels = true,
  showValues = true,
  animated = true,
  horizontal = false,
  barRadius = 4,
  showLegend = true
}: GroupedBarChartProps) {
  const [hasAnimated, setHasAnimated] = useState(!animated)
  const [hoveredBar, setHoveredBar] = useState<{ groupIndex: number; seriesIndex: number } | null>(null)

  const allValues = data.flatMap(d => d.values)
  const maxValue = Math.max(...allValues)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setHasAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  if (horizontal) {
    return (
      <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Legend */}
        {showLegend && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {series.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: 'var(--radius-xs)', backgroundColor: s.color }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.map((group, groupIndex) => (
            <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {showLabels && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  {group.label}
                </span>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {group.values.map((value, seriesIndex) => {
                  const percentage = (value / maxValue) * 100
                  const isHovered = hoveredBar?.groupIndex === groupIndex && hoveredBar?.seriesIndex === seriesIndex

                  return (
                    <div
                      key={seriesIndex}
                      style={{ height: 20, backgroundColor: 'var(--bg-tertiary)', borderRadius: barRadius, position: 'relative', overflow: 'hidden' }}
                      onMouseEnter={() => setHoveredBar({ groupIndex, seriesIndex })}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div style={{
                        width: hasAnimated ? `${percentage}%` : '0%',
                        height: '100%',
                        backgroundColor: series[seriesIndex]?.color || 'var(--brand-primary)',
                        borderRadius: barRadius,
                        transition: `width 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${(groupIndex * series.length + seriesIndex) * 40}ms`,
                        transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                        boxShadow: isHovered ? `0 0 12px ${series[seriesIndex]?.color}50` : 'none'
                      }} />

                      {/* Tooltip */}
                      {isHovered && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: Math.max(percentage, 20) + '%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'var(--bg-dropdown)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          whiteSpace: 'nowrap',
                          zIndex: 10
                        }}>
                          {series[seriesIndex]?.name}: {value}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Vertical grouped bars
  return (
    <div className="animate-fadeIn" style={{ height, display: 'flex', flexDirection: 'column' }}>
      {/* Legend */}
      {showLegend && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {series.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: 'var(--radius-xs)', backgroundColor: s.color }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chart area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          gap: '1rem',
          padding: '0 0.5rem'
        }}>
          {data.map((group, groupIndex) => (
            <div
              key={group.label}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '0.25rem',
                height: '100%'
              }}
            >
              {group.values.map((value, seriesIndex) => {
                const percentage = (value / maxValue) * 100
                const isHovered = hoveredBar?.groupIndex === groupIndex && hoveredBar?.seriesIndex === seriesIndex

                return (
                  <div
                    key={seriesIndex}
                    style={{
                      width: `${100 / series.length - 4}%`,
                      maxWidth: 32,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      position: 'relative'
                    }}
                    onMouseEnter={() => setHoveredBar({ groupIndex, seriesIndex })}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        bottom: `${percentage + 5}%`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--bg-dropdown)',
                        padding: '0.375rem 0.625rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        whiteSpace: 'nowrap',
                        zIndex: 10
                      }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{series[seriesIndex]?.name}</div>
                      </div>
                    )}

                    {showValues && !isHovered && (
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem',
                        opacity: hasAnimated ? 1 : 0,
                        transition: 'opacity 0.3s ease 0.5s'
                      }}>
                        {value}
                      </span>
                    )}

                    <div style={{
                      width: '100%',
                      borderRadius: barRadius,
                      height: showLabels ? 'calc(100% - 24px)' : '100%',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '100%',
                        height: hasAnimated ? `${percentage}%` : '0%',
                        backgroundColor: series[seriesIndex]?.color || 'var(--brand-primary)',
                        borderRadius: barRadius,
                        transition: `height 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${(groupIndex * series.length + seriesIndex) * 40}ms`,
                        position: 'absolute',
                        bottom: 0,
                        transform: isHovered ? 'scaleX(1.15)' : 'scaleX(1)',
                        boxShadow: isHovered ? `0 -4px 16px ${series[seriesIndex]?.color}60` : 'none'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Labels */}
        {showLabels && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '0.5rem',
            gap: '1rem',
            padding: '0 0.5rem'
          }}>
            {data.map((group, index) => (
              <span key={group.label} style={{
                flex: 1,
                fontSize: '0.6875rem',
                color: hoveredBar?.groupIndex === index ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: hoveredBar?.groupIndex === index ? 500 : 400,
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}>
                {group.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MULTI LINE CHART (Multiple series)
// ============================================
export interface LineSeriesData {
  name: string
  data: number[]
  color: string
}

interface MultiLineChartProps {
  series: LineSeriesData[]
  labels?: string[]
  width?: number | string
  height?: number
  showDots?: boolean
  animated?: boolean
  smooth?: boolean
  showLegend?: boolean
  showArea?: boolean
  showGrid?: boolean
  gridLines?: number
  showYLabels?: boolean
  showXLabels?: boolean
}

export function MultiLineChart({
  series,
  labels = [],
  width = '100%',
  height = 180,
  showDots = true,
  animated = true,
  smooth = true,
  showLegend = true,
  showArea = true,
  showGrid = true,
  gridLines = 5,
  showYLabels = false,
  showXLabels = false
}: MultiLineChartProps) {
  const [hasAnimated, setHasAnimated] = useState(!animated)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const allValues = series.flatMap(s => s.data)
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  const range = maxValue - minValue || 1
  const dataLength = Math.max(...series.map(s => s.data.length))

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setHasAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  const paddingX = 2
  const paddingY = 10

  const getPoints = (data: number[]) => data.map((value, index) => {
    const xPercent = paddingX + (index / (dataLength - 1)) * (100 - paddingX * 2)
    const yPercent = paddingY + (1 - (value - minValue) / range) * (100 - paddingY * 2)
    return { x: xPercent, y: yPercent, value }
  })

  const getPath = (points: { x: number; y: number }[]) => {
    if (smooth) {
      return monotonePath(points)
    }
    return points.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ')
  }

  const uniqueId = `multiline-${Math.random().toString(36).substr(2, 9)}`

  // Handle mouse move to find nearest data point
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return
    const rect = chartRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const relativeX = x / rect.width

    // Account for paddingX
    const chartWidth = 100 - paddingX * 2
    const adjustedX = (relativeX * 100 - paddingX) / chartWidth

    // Find nearest index
    const index = Math.round(adjustedX * (dataLength - 1))
    const clampedIndex = Math.max(0, Math.min(dataLength - 1, index))
    setHoveredIndex(clampedIndex)
  }

  // Get X position for an index
  const getXPercent = (index: number) => paddingX + (index / (dataLength - 1)) * (100 - paddingX * 2)

  // Generate Y axis values
  const yLabels = Array.from({ length: gridLines }).map((_, i) => {
    const value = maxValue - (i / (gridLines - 1)) * range
    return Math.round(value)
  })

  return (
    <div className="animate-fadeIn" style={{ width, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Legend */}
      {showLegend && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {series.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: 12, height: 3, borderRadius: 'var(--radius-xs)', backgroundColor: s.color }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chart with axis labels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* Y axis labels */}
          {showYLabels && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height,
              paddingTop: `${paddingY * height / 100}px`,
              paddingBottom: `${paddingY * height / 100}px`,
              minWidth: 28
            }}>
              {yLabels.map((val, i) => (
                <span key={i} style={{
                  fontSize: '0.625rem',
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                  lineHeight: 1
                }}>
                  {val}
                </span>
              ))}
            </div>
          )}

          {/* Chart area */}
          <div
            ref={chartRef}
            style={{ flex: 1, height, position: 'relative', overflow: 'visible', cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Grid SVG (no animation) */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            >
              {/* Horizontal grid lines */}
              {showGrid && (
                <g>
                  {Array.from({ length: gridLines }).map((_, i) => {
                    const yPercent = paddingY + (i / (gridLines - 1)) * (100 - paddingY * 2)
                    return (
                      <line
                        key={`h-${i}`}
                        x1={0}
                        y1={yPercent}
                        x2={100}
                        y2={yPercent}
                        stroke="var(--border-subtle)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    )
                  })}
                </g>
              )}
            </svg>

            {/* Lines and areas SVG with clip animation */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'visible',
                pointerEvents: 'none',
                clipPath: hasAnimated ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transition: animated ? 'clip-path 1.2s ease-out' : 'none'
              }}
            >
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={i} id={`${uniqueId}-fill-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {/* Areas (if enabled) */}
              {showArea && series.map((s, seriesIndex) => {
                const points = getPoints(s.data)
                const pathData = getPath(points)
                const areaPath = `${pathData} L ${points[points.length - 1].x} ${100 - paddingY + 8} L ${points[0].x} ${100 - paddingY + 8} Z`

                return (
                  <path
                    key={`area-${seriesIndex}`}
                    d={areaPath}
                    fill={`url(#${uniqueId}-fill-${seriesIndex})`}
                    style={{
                      opacity: hasAnimated ? 1 : 0,
                      transition: `opacity 0.6s ease 0.4s`
                    }}
                  />
                )
              })}

              {/* Lines */}
              {series.map((s, seriesIndex) => {
                const points = getPoints(s.data)
                const pathData = getPath(points)

                return (
                  <path
                    key={`line-${seriesIndex}`}
                    d={pathData}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )
              })}
            </svg>

        {/* Vertical indicator line */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${getXPercent(hoveredIndex)}%`,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: 'var(--text-muted)',
              opacity: 0.4,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Dots at hovered position */}
        {hoveredIndex !== null && series.map((s, seriesIndex) => {
          const points = getPoints(s.data)
          const point = points[hoveredIndex]
          if (!point) return null

          return (
            <div
              key={seriesIndex}
              style={{
                position: 'absolute',
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 5
              }}
            >
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: s.color,
                border: '2px solid var(--bg-primary)',
                boxShadow: `0 0 8px ${s.color}`
              }} />
            </div>
          )
        })}

        {/* Combined tooltip */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${getXPercent(hoveredIndex)}%`,
              top: 8,
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg-dropdown)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              zIndex: 20,
              minWidth: 120,
              pointerEvents: 'none'
            }}
          >
            {/* Label */}
            {labels[hoveredIndex] && (
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
                paddingBottom: '0.375rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                {labels[hoveredIndex]}
              </div>
            )}

            {/* Values */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {series.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {s.data[hoveredIndex]?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Static dots (when not hovering) */}
        {showDots && hoveredIndex === null && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {series.map((s, seriesIndex) => {
              const points = getPoints(s.data)
              return points.map((point, pointIndex) => (
                <div
                  key={`${seriesIndex}-${pointIndex}`}
                  style={{
                    position: 'absolute',
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: s.color,
                    border: '2px solid var(--bg-primary)',
                    opacity: hasAnimated ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }} />
                </div>
              ))
            })}
          </div>
        )}
          </div>
        </div>

        {/* X axis labels */}
        {showXLabels && labels.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: showYLabels ? 36 : 0,
            paddingLeft: `${paddingX}%`,
            paddingRight: `${paddingX}%`
          }}>
            {labels.map((label, i) => (
              <span key={i} style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                textAlign: 'center'
              }}>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

