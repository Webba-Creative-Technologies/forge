import { ReactNode, useState, useRef, useEffect } from 'react'
import { useInteractionState } from '../hooks/useInteractionState'

// ============================================
// SEGMENTED CONTROL (iOS-style toggle)
// ============================================
export interface SegmentedOption {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'pill' | 'ghost'
  fullWidth?: boolean
  disabled?: boolean
}

const sizeConfig = {
  xs: { padding: '0.125rem 0.5rem',    fontSize: '0.7rem',    height: 28, outerPadding: 2 },
  sm: { padding: '0.25rem 0.625rem',   fontSize: '0.75rem',   height: 32, outerPadding: 3 },
  md: { padding: '0.375rem 0.875rem',  fontSize: '0.8125rem', height: 38, outerPadding: 4 },
  lg: { padding: '0.5rem 1.125rem',    fontSize: '0.875rem',  height: 44, outerPadding: 4 },
  xl: { padding: '0.625rem 1.375rem',  fontSize: '0.9375rem', height: 52, outerPadding: 4 }
}

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  disabled = false
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  useEffect(() => {
    const activeButton = optionRefs.current.get(value)
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        opacity: 1
      })
    }
  }, [value, options])

  const config = sizeConfig[size]

  const bgColor = variant === 'ghost' ? 'transparent' : 'var(--bg-tertiary)'
  const indicatorBg = variant === 'ghost' ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: bgColor,
        borderRadius: variant === 'pill' ? 99 : 'var(--radius-md)',
        padding: config.outerPadding,
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : undefined
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: 'absolute',
          top: config.outerPadding,
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          height: `calc(100% - ${config.outerPadding * 2}px)`,
          backgroundColor: indicatorBg,
          borderRadius: variant === 'pill' ? 99 : 'var(--radius-sm)',
          border: variant !== 'ghost' ? '1px solid var(--border-subtle)' : undefined,
          boxShadow: variant !== 'ghost' ? '0 1px 3px rgba(0,0,0,0.15)' : undefined,
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: indicatorStyle.opacity,
          zIndex: 0
        }}
      />

      {options.map(option => {
        const isActive = option.id === value
        return (
          <SegmentedButton
            key={option.id}
            option={option}
            isActive={isActive}
            size={size}
            fullWidth={fullWidth}
            onClick={() => !option.disabled && onChange(option.id)}
            buttonRef={el => {
              if (el) optionRefs.current.set(option.id, el)
              else optionRefs.current.delete(option.id)
            }}
          />
        )
      })}
    </div>
  )
}

// ============================================
// SEGMENTED BUTTON (individual option)
// ============================================
interface SegmentedButtonProps {
  option: SegmentedOption
  isActive: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth: boolean
  onClick: () => void
  buttonRef: (el: HTMLButtonElement | null) => void
}

function SegmentedButton({ option, isActive, size, fullWidth, onClick, buttonRef }: SegmentedButtonProps) {
  const { hovered, bind } = useInteractionState({ enabled: !option.disabled })
  const config = sizeConfig[size]

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      {...bind}
      disabled={option.disabled}
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        padding: config.padding,
        fontSize: config.fontSize,
        fontWeight: isActive ? 500 : 400,
        color: isActive
          ? 'var(--text-primary)'
          : hovered
            ? 'var(--text-primary)'
            : 'var(--text-secondary)',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: option.disabled ? 'not-allowed' : 'pointer',
        opacity: option.disabled ? 0.4 : 1,
        flex: fullWidth ? 1 : undefined,
        whiteSpace: 'nowrap',
        transition: 'color 0.15s ease, font-weight 0.15s ease',
        userSelect: 'none'
      }}
    >
      {option.icon && (
        <span style={{ display: 'flex', fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18 }}>
          {option.icon}
        </span>
      )}
      {option.label}
    </button>
  )
}
