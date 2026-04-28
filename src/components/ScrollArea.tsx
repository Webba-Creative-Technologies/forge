import { ReactNode, useRef, useState, useEffect, useCallback } from 'react'
import { useInteractionState } from '../hooks/useInteractionState'

// ============================================
// SCROLL AREA (custom scrollbar container)
// ============================================
interface ScrollAreaProps {
  children: ReactNode
  height?: number | string
  maxHeight?: number | string
  orientation?: 'vertical' | 'horizontal' | 'both'
  autoHide?: boolean
  scrollbarSize?: number
  style?: React.CSSProperties
  className?: string
  onScrollEnd?: () => void
}

export function ScrollArea({
  children,
  height,
  maxHeight,
  orientation = 'vertical',
  autoHide = true,
  scrollbarSize = 6,
  style,
  className,
  onScrollEnd
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const { hovered: isHovered, bind } = useInteractionState()
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Vertical scrollbar state
  const [vThumbHeight, setVThumbHeight] = useState(0)
  const [vThumbTop, setVThumbTop] = useState(0)
  const [showVScrollbar, setShowVScrollbar] = useState(false)

  // Horizontal scrollbar state
  const [hThumbWidth, setHThumbWidth] = useState(0)
  const [hThumbLeft, setHThumbLeft] = useState(0)
  const [showHScrollbar, setShowHScrollbar] = useState(false)

  const updateScrollbars = useCallback(() => {
    const el = viewportRef.current
    if (!el) return

    // Vertical
    if (orientation === 'vertical' || orientation === 'both') {
      const ratio = el.clientHeight / el.scrollHeight
      setShowVScrollbar(ratio < 1)
      setVThumbHeight(Math.max(ratio * el.clientHeight, 30))
      setVThumbTop((el.scrollTop / (el.scrollHeight - el.clientHeight)) * (el.clientHeight - Math.max(ratio * el.clientHeight, 30)))
    }

    // Horizontal
    if (orientation === 'horizontal' || orientation === 'both') {
      const ratio = el.clientWidth / el.scrollWidth
      setShowHScrollbar(ratio < 1)
      setHThumbWidth(Math.max(ratio * el.clientWidth, 30))
      setHThumbLeft((el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (el.clientWidth - Math.max(ratio * el.clientWidth, 30)))
    }
  }, [orientation])

  useEffect(() => {
    updateScrollbars()
    const el = viewportRef.current
    if (!el) return
    const observer = new ResizeObserver(updateScrollbars)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [updateScrollbars])

  const handleScroll = useCallback(() => {
    updateScrollbars()
    setIsScrolling(true)

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 800)

    // Scroll end detection
    if (onScrollEnd) {
      const el = viewportRef.current
      if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        onScrollEnd()
      }
    }
  }, [updateScrollbars, onScrollEnd])

  const showScrollbars = autoHide ? (isScrolling || isHovered) : true
  const scrollbarOpacity = showScrollbars ? 1 : 0

  return (
    <div
      style={{
        position: 'relative',
        height,
        maxHeight,
        overflow: 'hidden',
        ...style
      }}
      className={className}
      {...bind}
    >
      {/* Viewport */}
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        style={{
          width: '100%',
          height: '100%',
          overflowX: (orientation === 'horizontal' || orientation === 'both') ? 'scroll' : 'hidden',
          overflowY: (orientation === 'vertical' || orientation === 'both') ? 'scroll' : 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {children}
      </div>

      {/* Vertical scrollbar */}
      {showVScrollbar && (orientation === 'vertical' || orientation === 'both') && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            bottom: 2,
            width: scrollbarSize,
            borderRadius: scrollbarSize,
            opacity: scrollbarOpacity,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: vThumbTop,
              width: '100%',
              height: vThumbHeight,
              backgroundColor: 'var(--text-muted)',
              borderRadius: scrollbarSize,
              opacity: 0.4,
              transition: isScrolling ? 'none' : 'top 0.1s ease'
            }}
          />
        </div>
      )}

      {/* Horizontal scrollbar */}
      {showHScrollbar && (orientation === 'horizontal' || orientation === 'both') && (
        <div
          style={{
            position: 'absolute',
            left: 2,
            right: 2,
            bottom: 2,
            height: scrollbarSize,
            borderRadius: scrollbarSize,
            opacity: scrollbarOpacity,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: hThumbLeft,
              height: '100%',
              width: hThumbWidth,
              backgroundColor: 'var(--text-muted)',
              borderRadius: scrollbarSize,
              opacity: 0.4,
              transition: isScrolling ? 'none' : 'left 0.1s ease'
            }}
          />
        </div>
      )}
    </div>
  )
}
