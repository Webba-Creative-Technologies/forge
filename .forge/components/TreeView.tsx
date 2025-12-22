import { useState, ReactNode } from 'react'
import {
  ChevronRight20Regular,
  Folder20Regular,
  Folder20Filled,
  Document20Regular
} from '@fluentui/react-icons'
import { Checkbox } from './Input'

// ============================================
// TYPES
// ============================================
export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
  disabled?: boolean
  data?: unknown
}

// ============================================
// TREE VIEW
// ============================================
interface TreeViewProps {
  data: TreeNode[]
  defaultExpanded?: string[]
  defaultSelected?: string[]
  onSelect?: (node: TreeNode) => void
  onExpand?: (nodeId: string, expanded: boolean) => void
  selectable?: boolean
  multiSelect?: boolean
  checkable?: boolean
  onCheck?: (checkedIds: string[]) => void
  showLines?: boolean
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
}

export function TreeView({
  data,
  defaultExpanded,
  defaultSelected = [],
  onSelect,
  onExpand,
  selectable = true,
  multiSelect = false,
  checkable = false,
  onCheck,
  showLines = true,
  size = 'md',
  className,
  style
}: TreeViewProps) {
  // Auto-expand first level nodes by default
  const autoExpanded = defaultExpanded ?? data.filter(n => n.children?.length).map(n => n.id)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(autoExpanded))
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected))
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpanded(newExpanded)
    onExpand?.(nodeId, newExpanded.has(nodeId))
  }

  const handleSelect = (node: TreeNode) => {
    if (!selectable || node.disabled) return

    if (multiSelect) {
      const newSelected = new Set(selected)
      if (newSelected.has(node.id)) {
        newSelected.delete(node.id)
      } else {
        newSelected.add(node.id)
      }
      setSelected(newSelected)
    } else {
      setSelected(new Set([node.id]))
    }
    onSelect?.(node)
  }

  const handleCheck = (node: TreeNode) => {
    const newChecked = new Set(checked)

    const toggleWithChildren = (n: TreeNode, check: boolean) => {
      if (check) {
        newChecked.add(n.id)
      } else {
        newChecked.delete(n.id)
      }
      n.children?.forEach(child => toggleWithChildren(child, check))
    }

    const isChecked = checked.has(node.id)
    toggleWithChildren(node, !isChecked)

    setChecked(newChecked)
    onCheck?.(Array.from(newChecked))
  }

  const sizeConfig = {
    sm: { fontSize: '0.8125rem', padding: '0.25rem 0.5rem', iconSize: 16, indent: 16 },
    md: { fontSize: '0.875rem', padding: '0.375rem 0.5rem', iconSize: 18, indent: 20 }
  }

  const config = sizeConfig[size]

  const renderNode = (node: TreeNode, level: number = 0, isLast: boolean = true, parentLines: boolean[] = []) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isChecked = checked.has(node.id)
    const [hovered, setHovered] = useState(false)

    // Track which parent levels need continuation lines
    const currentLines = [...parentLines]
    if (level > 0) {
      currentLines[level - 1] = !isLast
    }

    return (
      <div key={node.id}>
        <div
          onClick={() => {
            handleSelect(node)
            if (hasChildren) toggleExpand(node.id)
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: config.padding,
            paddingLeft: `calc(${config.padding.split(' ')[1]} + ${level * config.indent}px)`,
            fontSize: config.fontSize,
            color: node.disabled ? 'var(--text-muted)' : 'var(--text-primary)',
            backgroundColor: hovered ? 'var(--bg-tertiary)' : 'transparent',
            borderRadius: 'var(--radius-sm)',
            cursor: node.disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s ease',
            position: 'relative'
          }}
        >
          {/* Tree lines */}
          {showLines && level > 0 && (
            <>
              {/* Vertical continuation lines for ancestors */}
              {parentLines.map((showLine, idx) => showLine && (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: 8 + idx * config.indent + config.iconSize / 2,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: 'var(--border-subtle)'
                  }}
                />
              ))}
              {/* Vertical line from parent to this node */}
              <div style={{
                position: 'absolute',
                left: 8 + (level - 1) * config.indent + config.iconSize / 2,
                top: 0,
                height: isLast ? '50%' : '100%',
                width: 1,
                backgroundColor: 'var(--border-subtle)'
              }} />
              {/* Horizontal line to node */}
              <div style={{
                position: 'absolute',
                left: 8 + (level - 1) * config.indent + config.iconSize / 2,
                top: '50%',
                width: config.indent / 2 + 4,
                height: 1,
                backgroundColor: 'var(--border-subtle)'
              }} />
            </>
          )}

          {/* Expand arrow */}
          <span
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) toggleExpand(node.id)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: config.iconSize,
              height: config.iconSize,
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'var(--text-muted)',
              visibility: hasChildren ? 'visible' : 'hidden',
              cursor: hasChildren ? 'pointer' : 'default'
            }}
          >
            <ChevronRight20Regular style={{ fontSize: config.iconSize }} />
          </span>

          {/* Checkbox */}
          {checkable && (
            <span onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isChecked}
                onChange={() => handleCheck(node)}
                size="sm"
              />
            </span>
          )}

          {/* Icon */}
          <span style={{
            display: 'flex',
            color: hasChildren
              ? isExpanded ? '#f59e0b' : 'var(--text-muted)'
              : 'var(--text-secondary)',
            transition: 'color 0.2s ease'
          }}>
            {node.icon || (hasChildren
              ? isExpanded ? <Folder20Filled style={{ fontSize: config.iconSize }} /> : <Folder20Regular style={{ fontSize: config.iconSize }} />
              : <Document20Regular style={{ fontSize: config.iconSize }} />
            )}
          </span>

          {/* Label */}
          <span style={{ flex: 1 }}>{node.label}</span>
        </div>

        {/* Children */}
        {hasChildren && (
          <div
            style={{
              overflow: 'hidden',
              maxHeight: isExpanded ? '1000px' : '0px',
              opacity: isExpanded ? 1 : 0,
              transition: isExpanded
                ? 'max-height 0.3s ease-out, opacity 0.2s ease-out'
                : 'max-height 0.2s ease-in, opacity 0.15s ease-in'
            }}
          >
            {node.children!.map((child, idx) => renderNode(
              child,
              level + 1,
              idx === node.children!.length - 1,
              currentLines
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem',
        ...style
      }}
    >
      {data.map((node, idx) => renderNode(node, 0, idx === data.length - 1, []))}
    </div>
  )
}

// ============================================
// FILE TREE (Preset for file system)
// ============================================
interface FileTreeProps {
  data: TreeNode[]
  onSelect?: (node: TreeNode) => void
  className?: string
  style?: React.CSSProperties
}

export function FileTree({
  data,
  onSelect,
  className,
  style
}: FileTreeProps) {
  return (
    <TreeView
      data={data}
      onSelect={onSelect}
      showLines={true}
      size="sm"
      className={className}
      style={style}
    />
  )
}
