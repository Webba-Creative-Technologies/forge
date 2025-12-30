import { useState, useRef, useEffect } from 'react'
import { ChevronDown20Regular, Search20Regular } from '@fluentui/react-icons'
import { Z_INDEX, SHADOWS } from '../constants'

// ============================================
// COUNTRY DATA
// ============================================
const COUNTRIES = [
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'LU', name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
  { code: 'MC', name: 'Monaco', dial: '+377', flag: '🇲🇨' },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'SN', name: 'Senegal', dial: '+221', flag: '🇸🇳' },
  { code: 'CI', name: "Ivory Coast", dial: '+225', flag: '🇨🇮' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' }
]

export type Country = typeof COUNTRIES[number]

// ============================================
// PHONE INPUT
// ============================================
interface PhoneInputProps {
  value?: string
  onChange?: (value: string, country: Country) => void
  defaultCountry?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export function PhoneInput({
  value = '',
  onChange,
  defaultCountry = 'FR',
  label,
  placeholder = '6 12 34 56 78',
  error,
  disabled = false,
  size = 'md',
  className,
  style
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find(c => c.code === defaultCountry) || COUNTRIES[0]
  )
  const [phone, setPhone] = useState(value)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const sizeConfig = {
    sm: { height: 32, fontSize: '0.8125rem', flagSize: '1rem', dialWidth: 38 },
    md: { height: 40, fontSize: '0.875rem', flagSize: '1.125rem', dialWidth: 42 },
    lg: { height: 48, fontSize: '0.9375rem', flagSize: '1.25rem', dialWidth: 46 }
  }

  const config = sizeConfig[size]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (dropdownOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [dropdownOpen])

  const formatPhoneNumber = (input: string): string => {
    const digits = input.replace(/\D/g, '')
    if (selectedCountry.code === 'FR' && digits.length > 0) {
      const parts = []
      for (let i = 0; i < digits.length && i < 10; i += 2) {
        parts.push(digits.slice(i, i + 2))
      }
      return parts.join(' ')
    }
    return digits
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    onChange?.(selectedCountry.dial + formatted.replace(/\s/g, ''), selectedCountry)
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setDropdownOpen(false)
    setSearch('')
    onChange?.(country.dial + phone.replace(/\s/g, ''), country)
  }

  const filteredCountries = search
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '0.375rem'
        }}>
          {label}
        </label>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        height: config.height,
        border: `1px solid ${error ? 'var(--error)' : focused ? 'var(--brand-primary)' : 'var(--border-color)'}`,
        borderRadius: 'var(--radius-md)',
        backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        boxShadow: focused ? '0 0 0 3px rgba(163, 91, 255, 0.1)' : 'none',
        transition: 'all 0.15s ease',
        overflow: 'visible'
      }}>
        {/* Country Selector */}
        <button
          type="button"
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0 0.625rem',
            border: 'none',
            borderRight: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            fontSize: config.fontSize,
            cursor: disabled ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            minWidth: 90
          }}
        >
          <span style={{
            color: 'var(--text-secondary)',
            fontSize: config.fontSize,
            fontWeight: 500
          }}>
            {selectedCountry.dial}
          </span>
          <ChevronDown20Regular style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s ease',
            flexShrink: 0
          }} />
        </button>

        {/* Phone Input */}
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            height: '100%',
            padding: '0 0.75rem',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: config.fontSize,
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          backgroundColor: 'var(--bg-dropdown)',
          borderRadius: 'var(--radius-md)',
          boxShadow: SHADOWS.elevation.dropdown,
          zIndex: Z_INDEX.dropdown,
          maxHeight: 320,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <Search20Regular style={{ fontSize: 16, color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                flex: 1,
                padding: 0,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Countries list */}
          <div style={{ overflowY: 'auto', flex: 1 }} className="forge-scrollbar-thin">
            {filteredCountries.map(country => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  border: 'none',
                  backgroundColor: country.code === selectedCountry.code ? 'var(--bg-active)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  lineHeight: 1.4
                }}
                className="interactive-row"
              >
                <span style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>{country.flag}</span>
                <span style={{ flex: 1, fontWeight: country.code === selectedCountry.code ? 500 : 400, display: 'flex', alignItems: 'center' }}>
                  {country.name}
                </span>
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  fontFamily: 'monospace',
                  minWidth: 42,
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}>
                  {country.dial}
                </span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div style={{
                padding: '1rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem'
              }}>
                No country found
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p style={{
          margin: '0.375rem 0 0',
          fontSize: '0.75rem',
          color: 'var(--error)'
        }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================
// EXPORT COUNTRIES LIST
// ============================================
export { COUNTRIES }
