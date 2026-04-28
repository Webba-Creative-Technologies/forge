import React, { useState, useRef, useEffect, useLayoutEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Z_INDEX } from '../constants'

// ============================================
// POPOVER
// ============================================
interface PopoverProps {
  trigger: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  width?: number | 'trigger' | 'auto'
  arrow?: boolean
}

export function Popover({
  trigger,
  content,
  position = 'bottom',
  align = 'start',
  open: controlledOpen,
  onOpenChange,
  closeOnClickOutside = true,
  closeOnEscape = true,
  width = 'auto',
  arrow
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  // Position calculation — useLayoutEffect so the popover is placed
  // before the browser paints, avoiding a visible flicker from the
  // initial (0, 0) coords.
  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      let top = 0
      let left = 0

      // Vertical position
      if (position === 'top') {
        top = rect.top - 8
      } else if (position === 'bottom') {
        top = rect.bottom + 8
      } else {
        top = rect.top + rect.height / 2
      }

      // Horizontal position
      if (position === 'left') {
        left = rect.left - 8
      } else if (position === 'right') {
        left = rect.right + 8
      } else {
        if (align === 'start') left = rect.left
        else if (align === 'end') left = rect.right
        else left = rect.left + rect.width / 2
      }

      setCoords({ top, left })
    }
  }, [open, position, align])

  // Close on outside click
  useEffect(() => {
    if (!open || !closeOnClickOutside) return
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        contentRef.current && !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, closeOnClickOutside, setOpen])

  // Close on Escape
  useEffect(() => {
    if (!open || !closeOnEscape) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, setOpen])

  // Only close on document/window scroll, not inner container scroll
  useEffect(() => {
    if (!open) return
    const handleScroll = (e: Event) => {
      const target = e.target
      if (target === document || target === document.documentElement || target === document.body) {
        setOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [open, setOpen])

  const getTranslate = (): { x: string; y: string } => {
    if (position === 'top') {
      if (align === 'center') return { x: '-50%', y: '-100%' }
      if (align === 'end') return { x: '-100%', y: '-100%' }
      return { x: '0', y: '-100%' }
    }
    if (position === 'bottom') {
      if (align === 'center') return { x: '-50%', y: '0' }
      if (align === 'end') return { x: '-100%', y: '0' }
      return { x: '0', y: '0' }
    }
    if (position === 'left') return { x: '-100%', y: '-50%' }
    if (position === 'right') return { x: '0', y: '-50%' }
    return { x: '0', y: '0' }
  }

  const getWidth = () => {
    if (width === 'auto') return undefined
    if (width === 'trigger' && triggerRef.current) {
      return triggerRef.current.getBoundingClientRect().width
    }
    return width
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{ display: 'flex', cursor: 'pointer' }}
      >
        {trigger}
      </div>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={contentRef}
          role="dialog"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            translate: `${getTranslate().x} ${getTranslate().y}`,
            zIndex: Z_INDEX.popover,
            width: getWidth(),
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'min(var(--radius-md), 12px)',
            boxShadow: 'var(--shadow-popover)',
            padding: '0.75rem',
            animation: 'scaleIn 0.15s ease-out'
          }}
        >
          {content}
          {arrow && (() => {
            const base: React.CSSProperties = {
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              transform: 'rotate(45deg)'
            }
            const arrowPos: Record<string, React.CSSProperties> = {
              top: { ...base, bottom: -5, left: '50%', marginLeft: -4, borderTop: 'none', borderLeft: 'none' },
              bottom: { ...base, top: -5, left: '50%', marginLeft: -4, borderBottom: 'none', borderRight: 'none' },
              left: { ...base, right: -5, top: '50%', marginTop: -4, borderLeft: 'none', borderBottom: 'none' },
              right: { ...base, left: -5, top: '50%', marginTop: -4, borderRight: 'none', borderTop: 'none' }
            }
            return <div style={arrowPos[position]} />
          })()}
        </div>,
        document.body
      )}
    </>
  )
}

// ============================================
// POPOVER CONTENT HELPERS
// ============================================
interface PopoverContentProps {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

Popover.Content = function PopoverContent({ children, padding = 'md' }: PopoverContentProps) {
  const paddingStyles = {
    none: 0,
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem'
  }

  return (
    <div style={{ padding: paddingStyles[padding] }}>
      {children}
    </div>
  )
}

interface PopoverHeaderProps {
  children: ReactNode
}

Popover.Header = function PopoverHeader({ children }: PopoverHeaderProps) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderBottom: '1px solid var(--border-color)',
      fontWeight: 600,
      fontSize: '0.875rem'
    }}>
      {children}
    </div>
  )
}

// ============================================
// HOVER CARD (Popover on hover)
// ============================================
interface HoverCardProps {
  trigger: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function HoverCard({
  trigger,
  content,
  position = 'bottom',
  delay = 300
}: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const show = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        let top = position === 'top' ? rect.top - 8 : rect.bottom + 8
        let left = rect.left + rect.width / 2

        setCoords({ top, left })
        setOpen(true)
      }
    }, delay)
  }

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Only close on document/window scroll, not inner container scroll
  useEffect(() => {
    if (!open) return
    const handleScroll = (e: Event) => {
      const target = e.target
      if (target === document || target === document.documentElement || target === document.body) {
        setOpen(false)
      }
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [open])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{ display: 'flex' }}
      >
        {trigger}
      </div>

      {open && (
        <div
          onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }}
          onMouseLeave={hide}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            zIndex: Z_INDEX.popover,
            minWidth: 150,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'min(var(--radius-md), 12px)',
            boxShadow: 'var(--shadow-popover)',
            padding: '0.75rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}
