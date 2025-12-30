import { ReactNode, useState } from 'react'
import { useIsMobile } from '../hooks/useResponsive'

// ============================================
// RADIO (with built-in hover/press animations)
// ============================================
interface RadioProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  name?: string
  value?: string
}

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  name,
  value
}: RadioProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const dimension = size === 'sm' ? 16 : 20
  const dotSize = size === 'sm' ? 8 : 10

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <span
        style={{
          position: 'relative',
          width: dimension,
          height: dimension,
          flexShrink: 0,
          marginTop: 2
        }}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: disabled ? 'not-allowed' : 'pointer',
            margin: 0
          }}
        />
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: dimension,
            height: dimension,
            borderRadius: '50%',
            border: `2px solid ${checked ? 'var(--brand-primary)' : hovered && !disabled ? 'var(--brand-primary)' : 'var(--border-color)'}`,
            backgroundColor: 'transparent',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: pressed && !disabled ? 'scale(0.85)' : hovered && !disabled ? 'scale(1.1)' : 'scale(1)',
            boxShadow: checked
              ? hovered && !disabled
                ? '0 0 0 4px color-mix(in srgb, var(--brand-primary) 25%, transparent), 0 2px 8px color-mix(in srgb, var(--brand-primary) 30%, transparent)'
                : '0 2px 6px color-mix(in srgb, var(--brand-primary) 25%, transparent)'
              : hovered && !disabled
                ? '0 0 0 4px color-mix(in srgb, var(--brand-primary) 10%, transparent)'
                : 'none'
          }}
        >
          <span
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              transform: checked ? 'scale(1)' : 'scale(0)',
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: checked ? '0 0 4px color-mix(in srgb, var(--brand-primary) 50%, transparent)' : 'none'
            }}
          />
        </span>
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          {label && (
            <span style={{
              fontSize: size === 'sm' ? '0.8125rem' : '0.875rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              transition: 'color 0.15s ease'
            }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{
              fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
              color: 'var(--text-muted)'
            }}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}

// ============================================
// RADIO GROUP
// ============================================
interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  name: string
  label?: string
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md'
}

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  label,
  direction = 'vertical',
  size = 'md'
}: RadioGroupProps) {
  return (
    <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
      {label && (
        <legend style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          {label}
        </legend>
      )}
      <div style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: direction === 'horizontal' ? '1.5rem' : '0.75rem'
      }}>
        {options.map(option => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
          />
        ))}
      </div>
    </fieldset>
  )
}

// ============================================
// RADIO CARD GROUP
// ============================================
interface RadioCardOption {
  value: string
  label: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
}

interface RadioCardGroupProps {
  value: string
  onChange: (value: string) => void
  options: RadioCardOption[]
  name: string
  label?: string
  columns?: 1 | 2 | 3 | 4
}

// Radio Card Item with built-in animations
function RadioCardItem({
  option,
  isSelected,
  name,
  onChange
}: {
  option: RadioCardOption
  isSelected: boolean
  name: string
  onChange: (value: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '1rem',
        backgroundColor: isSelected
          ? 'var(--bg-tertiary)'
          : hovered && !option.disabled
            ? 'var(--bg-tertiary)'
            : 'var(--bg-secondary)',
        border: `2px solid ${isSelected ? 'var(--brand-primary)' : hovered && !option.disabled ? 'var(--border-color)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: option.disabled ? 'not-allowed' : 'pointer',
        opacity: option.disabled ? 0.5 : 1,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed && !option.disabled ? 'scale(0.98)' : 'scale(1)',
        boxShadow: isSelected
          ? '0 0 0 1px var(--brand-primary), 0 4px 12px color-mix(in srgb, var(--brand-primary) 15%, transparent)'
          : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={isSelected}
        onChange={() => onChange(option.value)}
        disabled={option.disabled}
        style={{ display: 'none' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {option.icon && (
          <span style={{
            display: 'flex',
            color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
            transition: 'all 0.15s ease',
            transform: hovered && !option.disabled ? 'scale(1.1)' : 'scale(1)'
          }}>
            {option.icon}
          </span>
        )}
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}>
          {option.label}
        </span>
      </div>
      {option.description && (
        <span style={{
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4
        }}>
          {option.description}
        </span>
      )}
    </label>
  )
}

export function RadioCardGroup({
  value,
  onChange,
  options,
  name,
  label,
  columns = 2
}: RadioCardGroupProps) {
  const isMobile = useIsMobile()
  const responsiveColumns = isMobile ? 1 : columns

  return (
    <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
      {label && (
        <legend style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          {label}
        </legend>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gap: '0.75rem'
      }}>
        {options.map(option => (
          <RadioCardItem
            key={option.value}
            option={option}
            isSelected={value === option.value}
            name={name}
            onChange={onChange}
          />
        ))}
      </div>
    </fieldset>
  )
}
