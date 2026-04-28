import { ReactNode, forwardRef } from 'react'

// ============================================
// INPUT GROUP
// ============================================
interface InputGroupProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function InputGroup({ children, className, style }: InputGroupProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        ...style
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// INPUT ADDON (prefix/suffix)
// ============================================
interface InputAddonProps {
  children: ReactNode
  position?: 'left' | 'right'
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export function InputAddon({
  children,
  position = 'left',
  onClick,
  className,
  style
}: InputAddonProps) {
  const isClickable = !!onClick

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        borderRadius: position === 'left'
          ? 'var(--radius-md) 0 0 var(--radius-md)'
          : '0 var(--radius-md) var(--radius-md) 0',
        borderRight: position === 'left' ? 'none' : undefined,
        borderLeft: position === 'right' ? 'none' : undefined,
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        ...style
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
          e.currentTarget.style.color = 'var(--text-muted)'
        }
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// GROUP INPUT (styled input for InputGroup)
// ============================================
interface GroupInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasLeftAddon?: boolean
  hasRightAddon?: boolean
  error?: boolean
}

export const GroupInput = forwardRef<HTMLInputElement, GroupInputProps>(
  ({ hasLeftAddon, hasRightAddon, error, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          flex: 1,
          padding: '10px 12px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderColor: error ? 'var(--error)' : 'var(--border-color)',
          borderRadius: hasLeftAddon && hasRightAddon
            ? '0'
            : hasLeftAddon
              ? '0 var(--radius-md) var(--radius-md) 0'
              : hasRightAddon
                ? 'var(--radius-md) 0 0 var(--radius-md)'
                : 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          minWidth: 0,
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--brand-primary)'
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--border-color)'
          props.onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)

GroupInput.displayName = 'GroupInput'

// ============================================
// INPUT WITH ADDONS (convenience component)
// ============================================
interface InputWithAddonsProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  leftAddon?: ReactNode
  rightAddon?: ReactNode
  leftClickable?: boolean
  rightClickable?: boolean
  onLeftClick?: () => void
  onRightClick?: () => void
  error?: boolean
  className?: string
}

export const InputWithAddons = forwardRef<HTMLInputElement, InputWithAddonsProps>(
  ({
    leftAddon,
    rightAddon,
    leftClickable,
    rightClickable,
    onLeftClick,
    onRightClick,
    error,
    className,
    style,
    ...props
  }, ref) => {
    return (
      <InputGroup className={className} style={style}>
        {leftAddon && (
          <InputAddon
            position="left"
            onClick={leftClickable ? onLeftClick : undefined}
          >
            {leftAddon}
          </InputAddon>
        )}
        <GroupInput
          ref={ref}
          hasLeftAddon={!!leftAddon}
          hasRightAddon={!!rightAddon}
          error={error}
          {...props}
        />
        {rightAddon && (
          <InputAddon
            position="right"
            onClick={rightClickable ? onRightClick : undefined}
          >
            {rightAddon}
          </InputAddon>
        )}
      </InputGroup>
    )
  }
)

InputWithAddons.displayName = 'InputWithAddons'
