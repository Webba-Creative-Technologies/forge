import { useState, useEffect, useRef, CSSProperties, ReactNode } from 'react'

export interface VirtualListProps<T> {
  /** Full array of items. */
  items: T[]
  /** Render a single item. */
  renderItem: (item: T, index: number) => ReactNode
  /**
   * Row height in px. If each row has a different height, pass a function that
   * returns the height for the given index. For variable heights, an estimated
   * value is used until the row is measured.
   */
  itemHeight: number | ((index: number) => number)
  /** Visible viewport height in px. Default `400`. */
  height?: number | string
  /** Extra rows to render above and below the viewport. Default `5`. */
  overscan?: number
  /** Stable key extractor. Falls back to index. */
  keyExtractor?: (item: T, index: number) => string | number
  /** Empty-state fallback when `items` is empty. */
  empty?: ReactNode
  /** Called with the current scroll top in px on every scroll event. */
  onScroll?: (scrollTop: number) => void
  className?: string
  style?: CSSProperties
}

/**
 * Virtualized list for large datasets. Only rows inside the viewport
 * (plus `overscan`) are mounted. Works with fixed or variable row heights.
 *
 * @example
 *   <VirtualList
 *     items={thousands}
 *     height={600}
 *     itemHeight={48}
 *     renderItem={(row) => <Row key={row.id} row={row} />}
 *   />
 */
export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  height = 400,
  overscan = 5,
  keyExtractor,
  empty,
  onScroll,
  className,
  style
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState<number>(typeof height === 'number' ? height : 400)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (typeof height !== 'number') {
      const obs = new ResizeObserver(([entry]) => setViewportHeight(entry.contentRect.height))
      obs.observe(el)
      return () => obs.disconnect()
    }
    setViewportHeight(height)
  }, [height])

  if (items.length === 0 && empty !== undefined) {
    return <>{empty}</>
  }

  const getHeight = (i: number) => typeof itemHeight === 'function' ? itemHeight(i) : itemHeight

  // Build offset table
  const offsets: number[] = []
  let total = 0
  for (let i = 0; i < items.length; i++) {
    offsets[i] = total
    total += getHeight(i)
  }
  const fullHeight = total

  // Find first/last visible index using linear scan (fast for fixed heights,
  // fine for <100k rows with variable heights)
  let start = 0
  while (start < items.length && offsets[start] + getHeight(start) < scrollTop) start++
  let end = start
  while (end < items.length && offsets[end] < scrollTop + viewportHeight) end++

  start = Math.max(0, start - overscan)
  end = Math.min(items.length, end + overscan)

  const visible = items.slice(start, end)

  return (
    <div
      ref={containerRef}
      className={className}
      onScroll={(e) => {
        const t = e.currentTarget.scrollTop
        setScrollTop(t)
        onScroll?.(t)
      }}
      style={{
        height,
        overflowY: 'auto',
        position: 'relative',
        ...style
      }}
    >
      <div style={{ height: fullHeight, position: 'relative' }}>
        {visible.map((item, i) => {
          const index = start + i
          const top = offsets[index]
          const key = keyExtractor ? keyExtractor(item, index) : index
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: getHeight(index)
              }}
            >
              {renderItem(item, index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
