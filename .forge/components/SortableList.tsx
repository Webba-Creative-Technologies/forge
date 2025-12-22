import { useState, useRef, ReactNode } from 'react'
import { ReOrderDotsVertical16Regular, Dismiss16Regular } from '@fluentui/react-icons'
import { Text } from './Typography'

// ============================================
// TYPES
// ============================================
export interface SortableItem {
  id: string
  content: ReactNode
  disabled?: boolean
}

// ============================================
// DROP INDICATOR
// ============================================
function DropIndicator({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      style={{
        height: isVisible ? 3 : 0,
        backgroundColor: 'var(--brand-primary)',
        borderRadius: 2,
        margin: isVisible ? '4px 0' : 0,
        transition: 'all 0.15s ease',
        opacity: isVisible ? 1 : 0,
        boxShadow: isVisible ? '0 0 8px var(--brand-primary)' : 'none'
      }}
    />
  )
}

// ============================================
// SORTABLE LIST
// ============================================
interface SortableListProps {
  items: SortableItem[]
  onReorder: (items: SortableItem[]) => void
  onRemove?: (id: string) => void
  renderItem?: (item: SortableItem, index: number) => ReactNode
  handle?: boolean
  removable?: boolean
  disabled?: boolean
  gap?: number
  className?: string
  style?: React.CSSProperties
}

export function SortableList({
  items,
  onReorder,
  onRemove,
  renderItem,
  handle = true,
  removable = false,
  disabled = false,
  gap = 8,
  className,
  style
}: SortableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropPosition, setDropPosition] = useState<{ index: number; position: 'before' | 'after' } | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled || items[index].disabled) {
      e.preventDefault()
      return
    }

    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())

    // Add drag image
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDropPosition(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex === null || draggedIndex === index) {
      setDropPosition(null)
      return
    }

    // Determine if we're in the top or bottom half of the element
    const rect = e.currentTarget.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const position = e.clientY < midY ? 'before' : 'after'

    setDropPosition({ index, position })
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the container entirely
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!e.currentTarget.contains(relatedTarget)) {
      setDropPosition(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (draggedIndex === null || dropPosition === null) {
      handleDragEnd()
      return
    }

    let dropIndex = dropPosition.index
    if (dropPosition.position === 'after') {
      dropIndex += 1
    }

    // Adjust for removal of dragged item
    if (draggedIndex < dropIndex) {
      dropIndex -= 1
    }

    if (draggedIndex === dropIndex) {
      handleDragEnd()
      return
    }

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    onReorder(newItems)
    handleDragEnd()
  }

  const handleRemove = (id: string) => {
    onRemove?.(id)
  }

  return (
    <div
      className={className}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        ...style
      }}
    >
      {items.map((item, index) => {
        const isDragging = draggedIndex === index
        const isDisabled = disabled || item.disabled
        const showIndicatorBefore = dropPosition?.index === index && dropPosition?.position === 'before'
        const showIndicatorAfter = dropPosition?.index === index && dropPosition?.position === 'after'
        const isLastItem = index === items.length - 1

        return (
          <div key={item.id}>
            {/* Drop indicator before item */}
            <DropIndicator isVisible={showIndicatorBefore && draggedIndex !== index} />

            {/* Item */}
            <div
              ref={isDragging ? dragNodeRef : null}
              draggable={!isDisabled && handle ? false : !isDisabled}
              onDragStart={(e) => !handle && handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                marginBottom: isLastItem ? 0 : gap,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                opacity: isDragging ? 0.4 : isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : handle ? 'default' : 'grab',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                transform: isDragging ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              {/* Drag handle */}
              {handle && (
                <div
                  draggable={!isDisabled}
                  onDragStart={(e) => handleDragStart(e, index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    cursor: isDisabled ? 'not-allowed' : 'grab',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color 0.1s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <ReOrderDotsVertical16Regular />
                </div>
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {renderItem ? renderItem(item, index) : item.content}
              </div>

              {/* Remove button */}
              {removable && onRemove && (
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isDisabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.1s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                      e.currentTarget.style.color = '#ef4444'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  <Dismiss16Regular />
                </button>
              )}
            </div>

            {/* Drop indicator after last item */}
            {isLastItem && <DropIndicator isVisible={showIndicatorAfter && draggedIndex !== index} />}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// SIMPLE SORTABLE LIST (with string items)
// ============================================
interface SimpleSortableListProps {
  items: string[]
  onReorder: (items: string[]) => void
  onRemove?: (index: number) => void
  removable?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function SimpleSortableList({
  items,
  onReorder,
  onRemove,
  removable = false,
  disabled = false,
  className,
  style
}: SimpleSortableListProps) {
  const sortableItems: SortableItem[] = items.map((item, index) => ({
    id: `item-${index}`,
    content: <Text size="sm">{item}</Text>
  }))

  const handleReorder = (newItems: SortableItem[]) => {
    const reorderedItems: string[] = []
    newItems.forEach(item => {
      const originalIndex = parseInt(item.id.replace('item-', ''))
      reorderedItems.push(items[originalIndex])
    })
    onReorder(reorderedItems)
  }

  const handleRemove = (id: string) => {
    const index = parseInt(id.replace('item-', ''))
    onRemove?.(index)
  }

  return (
    <SortableList
      items={sortableItems}
      onReorder={handleReorder}
      onRemove={removable ? handleRemove : undefined}
      removable={removable}
      disabled={disabled}
      className={className}
      style={style}
    />
  )
}
