import { useRef, useState, useCallback } from 'react'

/**
 * Hook for enabling horizontal drag-to-scroll on a container.
 * Useful for scrollable tabs, carousels, and other horizontal scroll areas.
 *
 * @example
 * ```tsx
 * function ScrollableList() {
 *   const { containerRef, isDragging, handlers } = useDraggableScroll()
 *
 *   return (
 *     <div
 *       ref={containerRef}
 *       style={{ overflowX: 'auto', cursor: isDragging ? 'grabbing' : 'grab' }}
 *       {...handlers}
 *     >
 *       {items.map(item => <Item key={item.id} />)}
 *     </div>
 *   )
 * }
 * ```
 */
export function useDraggableScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
    containerRef.current.style.cursor = 'grabbing'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    containerRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab'
      }
    }
  }, [isDragging])

  return {
    containerRef,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave
    }
  }
}
