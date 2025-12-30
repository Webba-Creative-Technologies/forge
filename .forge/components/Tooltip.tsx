import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { Z_INDEX, SHADOWS } from '../constants'

// ============================================
// TOOLTIP
// ============================================
interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        let x = 0, y = 0

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2
            y = rect.top - 8
            break
          case 'bottom':
            x = rect.left + rect.width / 2
            y = rect.bottom + 8
            break
          case 'left':
            x = rect.left - 8
            y = rect.top + rect.height / 2
            break
          case 'right':
            x = rect.right + 8
            y = rect.top + rect.height / 2
            break
        }

        setCoords({ x, y })
        setVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Close on scroll
  useEffect(() => {
    if (!visible) return
    const handleScroll = () => setVisible(false)
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [visible])

  const getTransform = () => {
    switch (position) {
      case 'top': return 'translate(-50%, -100%)'
      case 'bottom': return 'translate(-50%, 0)'
      case 'left': return 'translate(-100%, -50%)'
      case 'right': return 'translate(0, -50%)'
    }
  }

  const getArrowStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 8,
      height: 8,
      backgroundColor: 'var(--bg-tertiary)',
      transform: 'rotate(45deg)'
    }

    switch (position) {
      case 'top':
        return { ...base, bottom: -4, left: '50%', marginLeft: -4 }
      case 'bottom':
        return { ...base, top: -4, left: '50%', marginLeft: -4 }
      case 'left':
        return { ...base, right: -4, top: '50%', marginTop: -4 }
      case 'right':
        return { ...base, left: -4, top: '50%', marginTop: -4 }
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        style={{ display: 'flex' }}
      >
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y,
            transform: getTransform(),
            zIndex: Z_INDEX.max,
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            boxShadow: SHADOWS.elevation.popover,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {content}
          <div style={getArrowStyle()} />
        </div>
      )}
    </>
  )
}

// ============================================
// INFO TOOLTIP (with icon)
// ============================================
interface InfoTooltipProps {
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function InfoTooltip({ content, position = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-muted)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        cursor: 'help'
      }}>
        ?
      </span>
    </Tooltip>
  )
}
