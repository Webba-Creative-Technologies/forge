import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Container,
  VStack,
  HStack,
  Grid,
  Heading,
  Text,
  Card,
  Button,
  Input,
  Badge,
  Tabs,
  TabPanels,
  TabPanel,
  CodeBlock,
  Divider,
  Animate,
  Footer,
  Avatar,
  Switch,
  Checkbox,
  ProgressBar
} from '../../.forge'
import {
  Color20Regular,
  Copy20Regular,
  Checkmark20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
  Eye20Regular,
  Code20Regular,
  Options20Regular,
  Settings20Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
  TextFont20Regular,
  BorderOutside20Regular,
  SlideSize20Regular,
  Drop20Regular
} from '@fluentui/react-icons'

// Footer sections
const footerSections = [
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Components', href: '/docs/components' },
      { label: 'Blocks', href: '/blocks' },
      { label: 'Changelog', href: '/docs/changelog' }
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'Discord', href: 'https://discord.gg/P9aFbP7gY6' },
      { label: 'Twitter', href: 'https://x.com/DeguinLuca16510' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility: Partially compliant', href: '/terms#accessibility' }
    ]
  },
  {
    title: 'Webba',
    links: [
      { label: 'My Webba iD', href: 'https://account.webba-creative.com' },
      { label: 'Our website', href: 'https://webba-creative.com' }
    ]
  }
]

// Default radius values
const defaultRadius = {
  radiusXs: '4px',
  radiusSm: '6px',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusXl: '16px',
  radiusFull: '9999px'
}

// Default spacing values
const defaultSpacing = {
  spacingXs: '4px',
  spacingSm: '8px',
  spacingMd: '12px',
  spacingLg: '16px',
  spacingXl: '24px',
  spacing2xl: '32px'
}

// Default font
const defaultFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

// Radius presets for Simple mode
const radiusPresets = [
  {
    id: 'square',
    label: 'Square',
    description: 'No rounding',
    values: { radiusXs: '0px', radiusSm: '0px', radiusMd: '0px', radiusLg: '0px', radiusXl: '0px', radiusFull: '0px' }
  },
  {
    id: 'sharp',
    label: 'Sharp',
    description: 'Minimal',
    values: { radiusXs: '0px', radiusSm: '2px', radiusMd: '4px', radiusLg: '6px', radiusXl: '8px', radiusFull: '9999px' }
  },
  {
    id: 'subtle',
    label: 'Subtle',
    description: 'Soft',
    values: { radiusXs: '2px', radiusSm: '4px', radiusMd: '6px', radiusLg: '8px', radiusXl: '12px', radiusFull: '9999px' }
  },
  {
    id: 'rounded',
    label: 'Rounded',
    description: 'Default',
    values: { radiusXs: '4px', radiusSm: '6px', radiusMd: '8px', radiusLg: '12px', radiusXl: '16px', radiusFull: '9999px' }
  },
  {
    id: 'extra',
    label: 'Extra',
    description: 'Very round',
    values: { radiusXs: '6px', radiusSm: '10px', radiusMd: '14px', radiusLg: '20px', radiusXl: '28px', radiusFull: '9999px' }
  },
  {
    id: 'pill',
    label: 'Pill',
    description: 'Full round',
    values: { radiusXs: '99px', radiusSm: '99px', radiusMd: '99px', radiusLg: '20px', radiusXl: '28px', radiusFull: '9999px' }
  }
]

// Color presets for Simple mode
const colorPresets = [
  // Vibrant
  {
    id: 'purple',
    label: 'Purple',
    primary: '#A35BFF',
    secondary: '#FD9173'
  },
  {
    id: 'blue',
    label: 'Blue',
    primary: '#3B82F6',
    secondary: '#60A5FA'
  },
  {
    id: 'green',
    label: 'Green',
    primary: '#10B981',
    secondary: '#34D399'
  },
  {
    id: 'orange',
    label: 'Orange',
    primary: '#F97316',
    secondary: '#FB923C'
  },
  {
    id: 'coral',
    label: 'Coral',
    primary: '#E75C36',
    secondary: '#FFA490'
  },
  {
    id: 'red',
    label: 'Red',
    primary: '#EF4444',
    secondary: '#F87171'
  },
  {
    id: 'pink',
    label: 'Pink',
    primary: '#EC4899',
    secondary: '#F472B6'
  },
  {
    id: 'cyan',
    label: 'Cyan',
    primary: '#06B6D4',
    secondary: '#22D3EE'
  },
  {
    id: 'amber',
    label: 'Amber',
    primary: '#F59E0B',
    secondary: '#FBBF24'
  },
  // Elegant
  {
    id: 'indigo',
    label: 'Indigo',
    primary: '#6366F1',
    secondary: '#818CF8'
  },
  {
    id: 'violet',
    label: 'Violet',
    primary: '#8B5CF6',
    secondary: '#A78BFA'
  },
  {
    id: 'rose',
    label: 'Rose',
    primary: '#F43F5E',
    secondary: '#FB7185'
  },
  {
    id: 'teal',
    label: 'Teal',
    primary: '#14B8A6',
    secondary: '#2DD4BF'
  },
  // Neutral
  {
    id: 'slate',
    label: 'Slate',
    primary: '#64748B',
    secondary: '#94A3B8'
  },
  {
    id: 'zinc',
    label: 'Zinc',
    primary: '#71717A',
    secondary: '#A1A1AA'
  },
  // Bold
  {
    id: 'lime',
    label: 'Lime',
    primary: '#84CC16',
    secondary: '#A3E635'
  },
  {
    id: 'fuchsia',
    label: 'Fuchsia',
    primary: '#D946EF',
    secondary: '#E879F9'
  }
]

// Spacing presets for Simple mode
const spacingPresets = [
  {
    id: 'compact',
    label: 'Compact',
    description: 'Tight spacing',
    values: { spacingXs: '2px', spacingSm: '4px', spacingMd: '8px', spacingLg: '12px', spacingXl: '16px', spacing2xl: '24px' }
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    description: 'Default',
    values: { spacingXs: '4px', spacingSm: '8px', spacingMd: '12px', spacingLg: '16px', spacingXl: '24px', spacing2xl: '32px' }
  },
  {
    id: 'spacious',
    label: 'Spacious',
    description: 'Relaxed',
    values: { spacingXs: '6px', spacingSm: '12px', spacingMd: '16px', spacingLg: '24px', spacingXl: '32px', spacing2xl: '48px' }
  },
  {
    id: 'airy',
    label: 'Airy',
    description: 'Maximum room',
    values: { spacingXs: '8px', spacingSm: '16px', spacingMd: '24px', spacingLg: '32px', spacingXl: '48px', spacing2xl: '64px' }
  }
]

// Font presets for Simple mode
const fontPresets = [
  // Sans-serif
  {
    id: 'system',
    label: 'System',
    description: 'Native',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  {
    id: 'inter',
    label: 'Inter',
    description: 'Modern',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'geist',
    label: 'Geist',
    description: 'Vercel',
    fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'poppins',
    label: 'Poppins',
    description: 'Friendly',
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'roboto',
    label: 'Roboto',
    description: 'Google',
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'manrope',
    label: 'Manrope',
    description: 'Geometric',
    fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'outfit',
    label: 'Outfit',
    description: 'Clean',
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'space',
    label: 'Space Grotesk',
    description: 'Tech',
    fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'dmSans',
    label: 'DM Sans',
    description: 'Elegant',
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  {
    id: 'plusJakarta',
    label: 'Plus Jakarta',
    description: 'Premium',
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  // Serif
  {
    id: 'merriweather',
    label: 'Merriweather',
    description: 'Serif',
    fontFamily: '"Merriweather", Georgia, serif'
  },
  {
    id: 'playfair',
    label: 'Playfair',
    description: 'Luxury',
    fontFamily: '"Playfair Display", Georgia, serif'
  },
  // Mono
  {
    id: 'jetbrains',
    label: 'JetBrains',
    description: 'Code',
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace'
  },
  {
    id: 'firaCode',
    label: 'Fira Code',
    description: 'Dev',
    fontFamily: '"Fira Code", Consolas, monospace'
  }
]

// Default dark theme values
const darkThemeDefaults = {
  brandPrimary: '#A35BFF',
  brandSecondary: '#FD9173',
  activeColor: '#BF8DFF',
  bgPrimary: '#070707',
  bgSecondary: '#0c0c0c',
  bgTertiary: '#1a1a1a',
  bgDropdown: '#141414',
  bgHover: '#2a2a2a',
  bgActive: 'rgba(163, 91, 255, 0.15)',
  textPrimary: '#fafafa',
  textSecondary: '#a3a3a3',
  textMuted: '#737373',
  borderColor: '#404040',
  borderSubtle: '#262626',
  success: '#34d399',
  warning: '#fb923c',
  error: '#f87171',
  info: '#60a5fa'
}

// Default light theme values
const lightThemeDefaults = {
  brandPrimary: '#A35BFF',
  brandSecondary: '#FD9173',
  activeColor: '#8B5CF6',
  bgPrimary: '#f9f8fc',
  bgSecondary: '#ffffff',
  bgTertiary: '#f3f0fa',
  bgDropdown: '#ffffff',
  bgHover: '#ebe6f5',
  bgActive: 'rgba(163, 91, 255, 0.12)',
  textPrimary: '#1a1625',
  textSecondary: '#4a4458',
  textMuted: '#6b6680',
  borderColor: '#d8d4e3',
  borderSubtle: '#e8e5f0',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#2563eb'
}

interface RadiusValues {
  radiusXs: string
  radiusSm: string
  radiusMd: string
  radiusLg: string
  radiusXl: string
  radiusFull: string
}

type RadiusKey = keyof RadiusValues

interface SpacingValues {
  spacingXs: string
  spacingSm: string
  spacingMd: string
  spacingLg: string
  spacingXl: string
  spacing2xl: string
}

type SpacingKey = keyof SpacingValues

interface ThemeColors {
  brandPrimary: string
  brandSecondary: string
  activeColor: string
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  bgDropdown: string
  bgHover: string
  bgActive: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  borderColor: string
  borderSubtle: string
  success: string
  warning: string
  error: string
  info: string
}

type ThemeColorKey = keyof ThemeColors

interface ColorGroup {
  title: string
  colors: { key: ThemeColorKey; label: string }[]
}

const colorGroups: ColorGroup[] = [
  {
    title: 'Brand',
    colors: [
      { key: 'brandPrimary', label: 'Primary' },
      { key: 'brandSecondary', label: 'Secondary' },
      { key: 'activeColor', label: 'Active' }
    ]
  },
  {
    title: 'Backgrounds',
    colors: [
      { key: 'bgPrimary', label: 'Primary' },
      { key: 'bgSecondary', label: 'Secondary' },
      { key: 'bgTertiary', label: 'Tertiary' },
      { key: 'bgDropdown', label: 'Dropdown' },
      { key: 'bgHover', label: 'Hover' }
    ]
  },
  {
    title: 'Text',
    colors: [
      { key: 'textPrimary', label: 'Primary' },
      { key: 'textSecondary', label: 'Secondary' },
      { key: 'textMuted', label: 'Muted' }
    ]
  },
  {
    title: 'Borders',
    colors: [
      { key: 'borderColor', label: 'Default' },
      { key: 'borderSubtle', label: 'Subtle' }
    ]
  },
  {
    title: 'Semantic',
    colors: [
      { key: 'success', label: 'Success' },
      { key: 'warning', label: 'Warning' },
      { key: 'error', label: 'Error' },
      { key: 'info', label: 'Info' }
    ]
  }
]

// Collapsible Section for Advanced mode
function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="interactive"
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontFamily: 'inherit',
          color: 'var(--text-primary)',
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{ color: 'var(--brand-primary)', display: 'flex' }}>{icon}</span>
        <Text weight="medium" style={{ flex: 1, textAlign: 'left' }}>{title}</Text>
        {isOpen ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// HSL conversion utilities
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 50 }

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// Compact Color Input with HSL sliders
function ColorInput({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)
  const isRgba = value.startsWith('rgba')

  const hsl = hexToHsl(isRgba ? '#A35BFF' : value)
  const [h, setH] = useState(hsl.h)
  const [s, setS] = useState(hsl.s)
  const [l, setL] = useState(hsl.l)

  // Sync HSL when value changes externally
  useEffect(() => {
    if (!isRgba) {
      const newHsl = hexToHsl(value)
      setH(newHsl.h)
      setS(newHsl.s)
      setL(newHsl.l)
      setInputValue(value)
    }
  }, [value, isRgba])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const updateColor = (newH: number, newS: number, newL: number) => {
    setH(newH)
    setS(newS)
    setL(newL)
    const hex = hslToHex(newH, newS, newL)
    setInputValue(hex)
    onChange(hex)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(val)
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <HStack gap="sm" style={{ alignItems: 'center', padding: '0.375rem 0' }}>
        <button
          onClick={() => !isRgba && setIsOpen(!isOpen)}
          disabled={isRgba}
          style={{
            width: 28,
            height: 28,
            padding: 0,
            border: `2px solid ${isOpen ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-sm)',
            cursor: isRgba ? 'not-allowed' : 'pointer',
            background: value,
            opacity: isRgba ? 0.5 : 1,
            flexShrink: 0,
            transition: 'border-color 0.15s'
          }}
        />
        <Text size="sm" style={{ flex: 1, minWidth: 60 }}>{label}</Text>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isRgba}
          style={{
            width: 90,
            padding: '0.25rem 0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            opacity: isRgba ? 0.5 : 1
          }}
        />
      </HStack>

      {isOpen && !isRgba && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 100,
          marginTop: 4,
          padding: '1rem',
          backgroundColor: 'var(--bg-dropdown)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          minWidth: 240
        }}>
          <VStack gap="md">
            {/* Color preview */}
            <div style={{
              width: '100%',
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: value,
              border: '1px solid var(--border-subtle)'
            }} />

            {/* Hue slider */}
            <VStack gap="xs">
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text size="sm" color="secondary">Hue</Text>
                <Text size="sm" color="muted" style={{ fontFamily: 'monospace' }}>{h}°</Text>
              </HStack>
              <input
                type="range"
                min="0"
                max="360"
                value={h}
                onChange={(e) => updateColor(parseInt(e.target.value), s, l)}
                style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                  appearance: 'none',
                  outline: 'none'
                }}
              />
            </VStack>

            {/* Saturation slider */}
            <VStack gap="xs">
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text size="sm" color="secondary">Saturation</Text>
                <Text size="sm" color="muted" style={{ fontFamily: 'monospace' }}>{s}%</Text>
              </HStack>
              <input
                type="range"
                min="0"
                max="100"
                value={s}
                onChange={(e) => updateColor(h, parseInt(e.target.value), l)}
                style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: `linear-gradient(to right, ${hslToHex(h, 0, l)}, ${hslToHex(h, 100, l)})`,
                  appearance: 'none',
                  outline: 'none'
                }}
              />
            </VStack>

            {/* Lightness slider */}
            <VStack gap="xs">
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text size="sm" color="secondary">Lightness</Text>
                <Text size="sm" color="muted" style={{ fontFamily: 'monospace' }}>{l}%</Text>
              </HStack>
              <input
                type="range"
                min="0"
                max="100"
                value={l}
                onChange={(e) => updateColor(h, s, parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: `linear-gradient(to right, #000000, ${hslToHex(h, s, 50)}, #ffffff)`,
                  appearance: 'none',
                  outline: 'none'
                }}
              />
            </VStack>
          </VStack>
        </div>
      )}
    </div>
  )
}

// Compact Radius Input
function RadiusInput({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const numValue = parseInt(value) || 0

  return (
    <HStack gap="sm" style={{ alignItems: 'center', padding: '0.25rem 0' }}>
      <Text size="sm" style={{ width: 32 }}>{label}</Text>
      <input
        type="range"
        min="0"
        max={label === 'Full' ? 100 : 32}
        value={label === 'Full' ? (numValue > 100 ? 100 : numValue) : numValue}
        onChange={(e) => {
          const val = parseInt(e.target.value)
          if (label === 'Full' && val >= 100) {
            onChange('9999px')
          } else {
            onChange(`${val}px`)
          }
        }}
        style={{
          flex: 1,
          height: 4,
          accentColor: 'var(--brand-primary)',
          cursor: 'pointer'
        }}
      />
      <div
        style={{
          width: 24,
          height: 24,
          backgroundColor: 'var(--brand-primary)',
          borderRadius: value,
          flexShrink: 0
        }}
      />
      <Text size="sm" color="muted" style={{ fontFamily: 'monospace', width: 50, textAlign: 'right', fontSize: '0.7rem' }}>
        {value}
      </Text>
    </HStack>
  )
}

// Compact Spacing Input
function SpacingInput({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const numValue = parseInt(value) || 0

  return (
    <HStack gap="sm" style={{ alignItems: 'center', padding: '0.25rem 0' }}>
      <Text size="sm" style={{ width: 32 }}>{label}</Text>
      <input
        type="range"
        min="0"
        max="64"
        value={numValue}
        onChange={(e) => onChange(`${e.target.value}px`)}
        style={{
          flex: 1,
          height: 4,
          accentColor: 'var(--brand-primary)',
          cursor: 'pointer'
        }}
      />
      <div
        style={{
          width: Math.max(numValue, 4),
          height: 16,
          backgroundColor: 'var(--brand-primary)',
          borderRadius: 'var(--radius-xs)',
          maxWidth: 48,
          transition: 'width 0.15s ease',
          flexShrink: 0
        }}
      />
      <Text size="sm" color="muted" style={{ fontFamily: 'monospace', width: 40, textAlign: 'right', fontSize: '0.7rem' }}>
        {value}
      </Text>
    </HStack>
  )
}

// Simple Editor Component - Compact horizontal selectors
function SimpleEditor({
  selectedColorPreset,
  selectedRadiusPreset,
  selectedSpacingPreset,
  selectedFontPreset,
  shadowsEnabled,
  onColorPresetChange,
  onRadiusPresetChange,
  onSpacingPresetChange,
  onFontPresetChange,
  onShadowsChange
}: {
  selectedColorPreset: string
  selectedRadiusPreset: string
  selectedSpacingPreset: string
  selectedFontPreset: string
  shadowsEnabled: boolean
  onColorPresetChange: (presetId: string) => void
  onRadiusPresetChange: (presetId: string) => void
  onSpacingPresetChange: (presetId: string) => void
  onFontPresetChange: (presetId: string) => void
  onShadowsChange: (enabled: boolean) => void
}) {
  return (
    <VStack gap="md">
      {/* Color Presets - Row of colored circles */}
      <VStack gap="md">
        <Text size="sm" weight="medium" color="secondary">Brand Color</Text>
        <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
          {colorPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onColorPresetChange(preset.id)}
              title={preset.label}
              style={{
                width: 40,
                height: 40,
                padding: 0,
                border: 'none',
                borderRadius: 'var(--radius-full)',
                background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedColorPreset === preset.id
                  ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${preset.primary}`
                  : '0 2px 4px rgba(0,0,0,0.1)',
                transform: selectedColorPreset === preset.id ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          ))}
        </HStack>
      </VStack>

      {/* Corner Style - Pill buttons with visual preview */}
      <VStack gap="sm">
        <Text size="sm" weight="medium" color="secondary">Corner Style</Text>
        <HStack gap="xs" style={{
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)'
        }}>
          {radiusPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onRadiusPresetChange(preset.id)}
              className="interactive"
              style={{
                padding: '0.5rem 0.875rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedRadiusPreset === preset.id ? 'var(--bg-secondary)' : 'transparent',
                color: selectedRadiusPreset === preset.id ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: selectedRadiusPreset === preset.id ? 500 : 400,
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                boxShadow: selectedRadiusPreset === preset.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: 16,
                height: 16,
                backgroundColor: selectedRadiusPreset === preset.id ? 'var(--brand-primary)' : 'var(--text-muted)',
                borderRadius: preset.values.radiusSm,
                opacity: selectedRadiusPreset === preset.id ? 1 : 0.5
              }} />
              {preset.label}
            </button>
          ))}
        </HStack>
      </VStack>

      {/* Spacing - Pill buttons */}
      <VStack gap="sm">
        <Text size="sm" weight="medium" color="secondary">Spacing</Text>
        <HStack gap="xs" style={{
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)'
        }}>
          {spacingPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSpacingPresetChange(preset.id)}
              className="interactive"
              style={{
                padding: '0.5rem 0.875rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedSpacingPreset === preset.id ? 'var(--bg-secondary)' : 'transparent',
                color: selectedSpacingPreset === preset.id ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: selectedSpacingPreset === preset.id ? 500 : 400,
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                boxShadow: selectedSpacingPreset === preset.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <HStack gap="xs" style={{ alignItems: 'flex-end', height: 14 }}>
                {[4, 6, 8, 10].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: h * (preset.id === 'compact' ? 0.7 : preset.id === 'comfortable' ? 0.85 : preset.id === 'spacious' ? 1 : 1.15),
                      backgroundColor: selectedSpacingPreset === preset.id ? 'var(--brand-primary)' : 'currentColor',
                      borderRadius: 1,
                      opacity: selectedSpacingPreset === preset.id ? 1 : 0.5
                    }}
                  />
                ))}
              </HStack>
              {preset.label}
            </button>
          ))}
        </HStack>
      </VStack>

      {/* Font Family - Pill buttons showing font preview */}
      <VStack gap="sm">
        <Text size="sm" weight="medium" color="secondary">Font Family</Text>
        <HStack gap="xs" style={{
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)'
        }}>
          {fontPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onFontPresetChange(preset.id)}
              className="interactive"
              style={{
                padding: '0.5rem 0.875rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedFontPreset === preset.id ? 'var(--bg-secondary)' : 'transparent',
                color: selectedFontPreset === preset.id ? 'var(--brand-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: preset.fontFamily,
                fontWeight: selectedFontPreset === preset.id ? 600 : 400,
                fontSize: '0.875rem',
                boxShadow: selectedFontPreset === preset.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {preset.label}
            </button>
          ))}
        </HStack>
      </VStack>

      {/* Shadows Toggle */}
      <VStack gap="sm">
        <Text size="sm" weight="medium" color="secondary">Shadows</Text>
        <HStack gap="sm" style={{ alignItems: 'center' }}>
          <Switch checked={shadowsEnabled} onChange={onShadowsChange} />
          <Text size="sm" color={shadowsEnabled ? 'primary' : 'muted'}>
            {shadowsEnabled ? 'Shadows enabled' : 'Shadows disabled'}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  )
}

function ThemePreview({
  colors,
  radius,
  spacing,
  fontFamily,
  isDark,
  shadowsEnabled
}: {
  colors: ThemeColors
  radius: RadiusValues
  spacing: SpacingValues
  fontFamily: string
  isDark: boolean
  shadowsEnabled: boolean
}) {
  const [switchValue, setSwitchValue] = useState(true)
  const [checkValue, setCheckValue] = useState(true)

  const previewStyle = {
    '--brand-primary': colors.brandPrimary,
    '--brand-secondary': colors.brandSecondary,
    '--active-color': colors.activeColor,
    '--bg-primary': colors.bgPrimary,
    '--bg-secondary': colors.bgSecondary,
    '--bg-tertiary': colors.bgTertiary,
    '--bg-dropdown': colors.bgDropdown,
    '--bg-hover': colors.bgHover,
    '--bg-active': colors.bgActive,
    '--text-primary': colors.textPrimary,
    '--text-secondary': colors.textSecondary,
    '--text-muted': colors.textMuted,
    '--border-color': colors.borderColor,
    '--border-subtle': colors.borderSubtle,
    '--success': colors.success,
    '--warning': colors.warning,
    '--error': colors.error,
    '--info': colors.info,
    '--radius-xs': radius.radiusXs,
    '--radius-sm': radius.radiusSm,
    '--radius-md': radius.radiusMd,
    '--radius-lg': radius.radiusLg,
    '--radius-xl': radius.radiusXl,
    '--radius-full': radius.radiusFull,
    '--spacing-xs': spacing.spacingXs,
    '--spacing-sm': spacing.spacingSm,
    '--spacing-md': spacing.spacingMd,
    '--spacing-lg': spacing.spacingLg,
    '--spacing-xl': spacing.spacingXl,
    '--spacing-2xl': spacing.spacing2xl
  } as React.CSSProperties

  return (
    <div style={{
      ...previewStyle,
      backgroundColor: colors.bgPrimary,
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      fontFamily
    }}>
      <VStack gap="lg">
        {/* Header */}
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Heading level={4} style={{ margin: 0 }}>Preview</Heading>
          <Badge variant="primary">{isDark ? 'Dark' : 'Light'}</Badge>
        </HStack>

        <Divider />

        {/* Buttons */}
        <VStack gap="sm">
          <Text size="sm" color="muted" weight="medium">Buttons</Text>
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </HStack>
        </VStack>

        {/* Card with Avatar */}
        <Card padding="md" style={{ boxShadow: shadowsEnabled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <Avatar name="John Doe" size="md" />
            <VStack gap="xs">
              <Text weight="medium">John Doe</Text>
              <Text size="sm" color="muted">john@example.com</Text>
            </VStack>
            <div style={{ marginLeft: 'auto' }}>
              <Badge variant="success" dot>Active</Badge>
            </div>
          </HStack>
        </Card>

        {/* Form elements */}
        <VStack gap="sm">
          <Text size="sm" color="muted" weight="medium">Form Elements</Text>
          <Input placeholder="Enter your email..." />
          <HStack gap="lg" style={{ alignItems: 'center' }}>
            <HStack gap="sm" style={{ alignItems: 'center' }}>
              <Switch checked={switchValue} onChange={setSwitchValue} />
              <Text size="sm">Notifications</Text>
            </HStack>
            <HStack gap="sm" style={{ alignItems: 'center' }}>
              <Checkbox checked={checkValue} onChange={setCheckValue} />
              <Text size="sm">Remember me</Text>
            </HStack>
          </HStack>
        </VStack>

        {/* Progress */}
        <VStack gap="sm">
          <Text size="sm" color="muted" weight="medium">Progress</Text>
          <ProgressBar value={65} showLabel />
        </VStack>

        {/* Badges */}
        <VStack gap="sm">
          <Text size="sm" color="muted" weight="medium">Badges</Text>
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="primary">Primary</Badge>
          </HStack>
        </VStack>

        {/* Stats Cards */}
        <Grid columns={{ xs: 2 }} gap="sm">
          <Card padding="md" style={{ boxShadow: shadowsEnabled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
            <VStack gap="xs" style={{ textAlign: 'center' }}>
              <Text size="lg" weight="bold" style={{ color: 'var(--brand-primary)' }}>128</Text>
              <Text size="sm" color="muted">Projects</Text>
            </VStack>
          </Card>
          <Card padding="md" style={{ boxShadow: shadowsEnabled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
            <VStack gap="xs" style={{ textAlign: 'center' }}>
              <Text size="lg" weight="bold" style={{ color: 'var(--brand-secondary)' }}>12k</Text>
              <Text size="sm" color="muted">Followers</Text>
            </VStack>
          </Card>
        </Grid>
      </VStack>
    </div>
  )
}

export function CreatePage() {
  // Preview mode (just for viewing, doesn't affect code generation)
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark')

  // Separate states for light and dark theme colors
  const [lightColors, setLightColors] = useState<ThemeColors>(lightThemeDefaults)
  const [darkColors, setDarkColors] = useState<ThemeColors>(darkThemeDefaults)

  // Which theme are we editing
  const [editingTheme, setEditingTheme] = useState<'light' | 'dark'>('dark')

  const [radius, setRadius] = useState<RadiusValues>(defaultRadius)
  const [spacing, setSpacing] = useState<SpacingValues>(defaultSpacing)
  const [fontFamily, setFontFamily] = useState(defaultFont)
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced'>('simple')
  const [selectedColorPreset, setSelectedColorPreset] = useState('purple')
  const [selectedRadiusPreset, setSelectedRadiusPreset] = useState('rounded')
  const [selectedSpacingPreset, setSelectedSpacingPreset] = useState('comfortable')
  const [selectedFontPreset, setSelectedFontPreset] = useState('system')
  const [shadowsEnabled, setShadowsEnabled] = useState(true)

  // Get current colors based on editing theme
  const colors = editingTheme === 'dark' ? darkColors : lightColors
  const setColors = editingTheme === 'dark' ? setDarkColors : setLightColors

  // Get preview colors based on preview mode
  const previewColors = previewMode === 'dark' ? darkColors : lightColors

  // Update single color
  const updateColor = (key: ThemeColorKey, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }))
  }

  // Update single radius
  const updateRadius = (key: RadiusKey, value: string) => {
    setRadius(prev => ({ ...prev, [key]: value }))
  }

  // Update single spacing
  const updateSpacing = (key: SpacingKey, value: string) => {
    setSpacing(prev => ({ ...prev, [key]: value }))
  }

  // Apply color preset (applies to both themes for brand colors)
  const applyColorPreset = (presetId: string) => {
    const preset = colorPresets.find(p => p.id === presetId)
    if (preset) {
      setSelectedColorPreset(presetId)
      // Apply brand colors to both themes
      const brandUpdate = {
        brandPrimary: preset.primary,
        brandSecondary: preset.secondary,
        activeColor: preset.primary,
        bgActive: `${preset.primary}20`
      }
      setLightColors(prev => ({ ...prev, ...brandUpdate }))
      setDarkColors(prev => ({ ...prev, ...brandUpdate }))
    }
  }

  // Apply radius preset
  const applyRadiusPreset = (presetId: string) => {
    const preset = radiusPresets.find(p => p.id === presetId)
    if (preset) {
      setSelectedRadiusPreset(presetId)
      setRadius(preset.values)
    }
  }

  // Apply spacing preset
  const applySpacingPreset = (presetId: string) => {
    const preset = spacingPresets.find(p => p.id === presetId)
    if (preset) {
      setSelectedSpacingPreset(presetId)
      setSpacing(preset.values)
    }
  }

  // Apply font preset
  const applyFontPreset = (presetId: string) => {
    const preset = fontPresets.find(p => p.id === presetId)
    if (preset) {
      setSelectedFontPreset(presetId)
      setFontFamily(preset.fontFamily)
    }
  }

  // Reset to defaults
  const resetColors = () => {
    setLightColors(lightThemeDefaults)
    setDarkColors(darkThemeDefaults)
    setRadius(defaultRadius)
    setSpacing(defaultSpacing)
    setFontFamily(defaultFont)
    setSelectedColorPreset('purple')
    setSelectedRadiusPreset('rounded')
    setSelectedSpacingPreset('comfortable')
    setSelectedFontPreset('system')
    setShadowsEnabled(true)
  }

  // Generate theme code
  const themeCode = useMemo(() => {
    // Find changed colors for each theme
    const getChangedColors = (themeColors: ThemeColors, defaults: ThemeColors) => {
      return (Object.keys(themeColors) as ThemeColorKey[]).filter(
        key => themeColors[key] !== defaults[key]
      )
    }

    const changedLightColors = getChangedColors(lightColors, lightThemeDefaults)
    const changedDarkColors = getChangedColors(darkColors, darkThemeDefaults)

    const changedRadius = Object.entries(radius).filter(
      ([key, value]) => value !== defaultRadius[key as RadiusKey]
    )
    const changedSpacing = Object.entries(spacing).filter(
      ([key, value]) => value !== defaultSpacing[key as SpacingKey]
    )
    const fontChanged = fontFamily !== defaultFont
    const shadowsChanged = !shadowsEnabled

    const hasLightChanges = changedLightColors.length > 0
    const hasDarkChanges = changedDarkColors.length > 0
    const hasGlobalChanges = changedRadius.length > 0 || changedSpacing.length > 0 || fontChanged

    if (!hasLightChanges && !hasDarkChanges && !hasGlobalChanges && !shadowsChanged) {
      return `<ForgeProvider>
  <App />
</ForgeProvider>`
    }

    // If only shadows changed
    if (!hasLightChanges && !hasDarkChanges && !hasGlobalChanges && shadowsChanged) {
      return `<ForgeProvider shadows={false}>
  <App />
</ForgeProvider>`
    }

    // Build global entries (radius, spacing, font)
    const globalEntries: string[] = []
    changedRadius.forEach(([key, value]) => globalEntries.push(`    ${key}: '${value}'`))
    changedSpacing.forEach(([key, value]) => globalEntries.push(`    ${key}: '${value}'`))
    if (fontChanged) {
      globalEntries.push(`    fontFamily: '${fontFamily}'`)
    }

    // Build light theme entries
    const lightEntries = changedLightColors.map(key => `      ${key}: '${lightColors[key]}'`)

    // Build dark theme entries
    const darkEntries = changedDarkColors.map(key => `      ${key}: '${darkColors[key]}'`)

    let themeContent = ''

    // Add global properties
    if (globalEntries.length > 0) {
      themeContent += globalEntries.join(',\n')
    }

    // Add light theme if has changes
    if (hasLightChanges) {
      if (themeContent) themeContent += ',\n'
      themeContent += `    light: {\n${lightEntries.join(',\n')}\n    }`
    }

    // Add dark theme if has changes
    if (hasDarkChanges) {
      if (themeContent) themeContent += ',\n'
      themeContent += `    dark: {\n${darkEntries.join(',\n')}\n    }`
    }

    const shadowsProp = shadowsChanged ? '\n  shadows={false}' : ''
    return `<ForgeProvider${shadowsProp}
  theme={{
${themeContent}
  }}
>
  <App />
</ForgeProvider>`
  }, [lightColors, darkColors, radius, spacing, fontFamily, shadowsEnabled])

  // Copy to clipboard
  const copyCode = async () => {
    await navigator.clipboard.writeText(themeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        padding: '3rem 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <Container>
          <Animate type="fadeIn">
            <VStack gap="md" style={{ textAlign: 'center' }}>
              <HStack gap="sm" style={{ justifyContent: 'center' }}>
                <Color20Regular style={{ color: 'var(--brand-primary)', fontSize: 28 }} />
                <Heading level={1}>Theme Creator</Heading>
              </HStack>
              <Text size="lg" color="secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
                Customize Forge colors to match your brand. Preview changes in real-time
                and copy the configuration for your ForgeProvider.
              </Text>
            </VStack>
          </Animate>
        </Container>
      </section>

      {/* Main Content */}
      <section style={{ padding: '2rem 0' }}>
        <Container>
          <Grid columns={{ xs: 1, lg: 2 }} gap="xl">
            {/* Editor Panel */}
            <Animate type="slideInUp" delay={100}>
              <Card padding="lg">
                <VStack gap="md">
                  {/* Card Title */}
                  <VStack gap="xs">
                    <Heading level={4} style={{ margin: 0 }}>Customize Theme</Heading>
                    <Text size="sm" color="muted">Configure colors, radius, spacing and fonts</Text>
                  </VStack>

                  {/* Header with mode toggle */}
                  <HStack style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <HStack gap="sm" style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      padding: '4px',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      <button
                        onClick={() => setEditorMode('simple')}
                        className="interactive"
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: editorMode === 'simple' ? 'var(--bg-secondary)' : 'transparent',
                          color: editorMode === 'simple' ? 'var(--text-primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          boxShadow: editorMode === 'simple' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Options20Regular />
                        Simple
                      </button>
                      <button
                        onClick={() => setEditorMode('advanced')}
                        className="interactive"
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: editorMode === 'advanced' ? 'var(--bg-secondary)' : 'transparent',
                          color: editorMode === 'advanced' ? 'var(--text-primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          boxShadow: editorMode === 'advanced' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Settings20Regular />
                        Advanced
                      </button>
                    </HStack>
                    <Button variant="ghost" size="sm" onClick={resetColors}>
                      Reset
                    </Button>
                  </HStack>

                  <Divider />

                  {/* Simple Mode */}
                  {editorMode === 'simple' && (
                    <SimpleEditor
                      selectedColorPreset={selectedColorPreset}
                      selectedRadiusPreset={selectedRadiusPreset}
                      selectedSpacingPreset={selectedSpacingPreset}
                      selectedFontPreset={selectedFontPreset}
                      shadowsEnabled={shadowsEnabled}
                      onColorPresetChange={applyColorPreset}
                      onRadiusPresetChange={applyRadiusPreset}
                      onSpacingPresetChange={applySpacingPreset}
                      onFontPresetChange={applyFontPreset}
                      onShadowsChange={setShadowsEnabled}
                    />
                  )}

                  {/* Advanced Mode */}
                  {editorMode === 'advanced' && (
                    <VStack gap="md">
                      {/* Colors Section */}
                      <CollapsibleSection title="Colors" icon={<Color20Regular />} defaultOpen={true}>
                        <VStack gap="md">
                          {/* Light/Dark theme selector */}
                          <HStack gap="sm" style={{
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '4px',
                            borderRadius: 'var(--radius-md)'
                          }}>
                            <button
                              onClick={() => setEditingTheme('light')}
                              className="interactive"
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: editingTheme === 'light' ? 'var(--brand-primary)' : 'transparent',
                                color: editingTheme === 'light' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.375rem',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <WeatherSunny20Regular />
                              Light Theme
                            </button>
                            <button
                              onClick={() => setEditingTheme('dark')}
                              className="interactive"
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: editingTheme === 'dark' ? 'var(--brand-primary)' : 'transparent',
                                color: editingTheme === 'dark' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.375rem',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <WeatherMoon20Regular />
                              Dark Theme
                            </button>
                          </HStack>

                          {colorGroups.map((group) => (
                            <VStack key={group.title} gap="xs">
                              <Text size="sm" weight="medium" color="muted" style={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                {group.title}
                              </Text>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '0.25rem'
                              }}>
                                {group.colors.map(({ key, label }) => (
                                  <ColorInput
                                    key={`${editingTheme}-${key}`}
                                    label={label}
                                    value={colors[key]}
                                    onChange={(value) => updateColor(key, value)}
                                  />
                                ))}
                              </div>
                            </VStack>
                          ))}
                        </VStack>
                      </CollapsibleSection>

                      {/* Border Radius Section */}
                      <CollapsibleSection title="Border Radius" icon={<BorderOutside20Regular />} defaultOpen={false}>
                        <VStack gap="xs">
                          <RadiusInput label="XS" value={radius.radiusXs} onChange={(value) => updateRadius('radiusXs', value)} />
                          <RadiusInput label="SM" value={radius.radiusSm} onChange={(value) => updateRadius('radiusSm', value)} />
                          <RadiusInput label="MD" value={radius.radiusMd} onChange={(value) => updateRadius('radiusMd', value)} />
                          <RadiusInput label="LG" value={radius.radiusLg} onChange={(value) => updateRadius('radiusLg', value)} />
                          <RadiusInput label="XL" value={radius.radiusXl} onChange={(value) => updateRadius('radiusXl', value)} />
                          <RadiusInput label="Full" value={radius.radiusFull} onChange={(value) => updateRadius('radiusFull', value)} />
                        </VStack>
                      </CollapsibleSection>

                      {/* Spacing Section */}
                      <CollapsibleSection title="Spacing" icon={<SlideSize20Regular />} defaultOpen={false}>
                        <VStack gap="xs">
                          <SpacingInput label="XS" value={spacing.spacingXs} onChange={(value) => updateSpacing('spacingXs', value)} />
                          <SpacingInput label="SM" value={spacing.spacingSm} onChange={(value) => updateSpacing('spacingSm', value)} />
                          <SpacingInput label="MD" value={spacing.spacingMd} onChange={(value) => updateSpacing('spacingMd', value)} />
                          <SpacingInput label="LG" value={spacing.spacingLg} onChange={(value) => updateSpacing('spacingLg', value)} />
                          <SpacingInput label="XL" value={spacing.spacingXl} onChange={(value) => updateSpacing('spacingXl', value)} />
                          <SpacingInput label="2XL" value={spacing.spacing2xl} onChange={(value) => updateSpacing('spacing2xl', value)} />
                        </VStack>
                      </CollapsibleSection>

                      {/* Font Family Section */}
                      <CollapsibleSection title="Font Family" icon={<TextFont20Regular />} defaultOpen={false}>
                        <VStack gap="md">
                          <HStack gap="xs" style={{ flexWrap: 'wrap' }}>
                            {fontPresets.map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => applyFontPreset(preset.id)}
                                className="interactive"
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  border: 'none',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: selectedFontPreset === preset.id ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                                  color: selectedFontPreset === preset.id ? 'white' : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  fontFamily: preset.fontFamily,
                                  fontSize: '0.875rem',
                                  fontWeight: selectedFontPreset === preset.id ? 600 : 400,
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </HStack>
                          <Input
                            value={fontFamily}
                            onChange={(val) => {
                              setFontFamily(val)
                              setSelectedFontPreset('')
                            }}
                            placeholder="Custom font family stack..."
                          />
                        </VStack>
                      </CollapsibleSection>

                      {/* Shadows Section */}
                      <CollapsibleSection title="Shadows" icon={<Drop20Regular />} defaultOpen={false}>
                        <VStack gap="sm">
                          <Text size="sm" color="secondary">
                            Enable or disable box shadows on cards and other components.
                          </Text>
                          <HStack gap="sm" style={{ alignItems: 'center' }}>
                            <Switch checked={shadowsEnabled} onChange={setShadowsEnabled} />
                            <Text size="sm" color={shadowsEnabled ? 'primary' : 'muted'}>
                              {shadowsEnabled ? 'Shadows enabled' : 'Shadows disabled'}
                            </Text>
                          </HStack>
                        </VStack>
                      </CollapsibleSection>
                    </VStack>
                  )}
                </VStack>
              </Card>
            </Animate>

            {/* Preview & Code Panel */}
            <Animate type="slideInUp" delay={200}>
              <VStack gap="lg">
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tabs
                    variant="underline"
                    stretchLine
                    tabs={[
                      { id: 'preview', label: 'Preview', icon: <Eye20Regular /> },
                      { id: 'code', label: 'Code', icon: <Code20Regular /> }
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                  />
                  <HStack gap="sm" style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '4px',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    <button
                      onClick={() => setPreviewMode('light')}
                      className="interactive"
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: previewMode === 'light' ? 'var(--bg-secondary)' : 'transparent',
                        color: previewMode === 'light' ? 'var(--text-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        boxShadow: previewMode === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <WeatherSunny20Regular />
                      Light
                    </button>
                    <button
                      onClick={() => setPreviewMode('dark')}
                      className="interactive"
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: previewMode === 'dark' ? 'var(--bg-secondary)' : 'transparent',
                        color: previewMode === 'dark' ? 'var(--text-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        boxShadow: previewMode === 'dark' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <WeatherMoon20Regular />
                      Dark
                    </button>
                  </HStack>
                </HStack>

                <TabPanels active={activeTab}>
                  <TabPanel id="preview" active={activeTab}>
                    <ThemePreview colors={previewColors} radius={radius} spacing={spacing} fontFamily={fontFamily} isDark={previewMode === 'dark'} shadowsEnabled={shadowsEnabled} />
                  </TabPanel>

                  <TabPanel id="code" active={activeTab}>
                    <Card padding="lg">
                      <VStack gap="md">
                        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text weight="medium">ForgeProvider Configuration</Text>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={copied ? <Checkmark20Regular /> : <Copy20Regular />}
                            onClick={copyCode}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                        </HStack>
                        <CodeBlock code={themeCode} language="tsx" />
                        <Text size="sm" color="muted">
                          Paste this configuration in your app to apply the custom theme to all Forge components.
                        </Text>
                      </VStack>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </VStack>
            </Animate>
          </Grid>
        </Container>
      </section>

      {/* Footer */}
      <Footer
        logoHref="https://webba-creative.com"
        tagline="A modern React component library built for speed and developer experience."
        sections={footerSections}
        copyright="© 2025 Webba. All rights reserved."
      />
    </div>
  )
}
