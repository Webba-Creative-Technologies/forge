import {
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  Grid,
  Badge,
  Divider,
  Animate,
  CodeBlock
} from '../../../.forge'
import {
  Color24Regular,
  TextFont20Regular,
  ArrowBidirectionalLeftRight20Regular,
  BorderAll20Regular,
  Layer20Regular,
  WeatherMoon20Regular
} from '@fluentui/react-icons'
import { SectionHeading } from '../../components/SectionHeading'

const colors = {
  brand: [
    { name: 'Primary', var: '--brand-primary', hex: '#A35BFF' },
    { name: 'Secondary', var: '--brand-secondary', hex: '#7C3AED' }
  ],
  semantic: [
    { name: 'Success', var: '--success', hex: '#10B981' },
    { name: 'Warning', var: '--warning', hex: '#F59E0B' },
    { name: 'Error', var: '--error', hex: '#EF4444' },
    { name: 'Info', var: '--info', hex: '#3B82F6' }
  ],
  neutral: [
    { name: 'Text Primary', var: '--text-primary', desc: 'Main text color' },
    { name: 'Text Secondary', var: '--text-secondary', desc: 'Secondary text' },
    { name: 'Text Muted', var: '--text-muted', desc: 'Subtle text' },
    { name: 'Background Primary', var: '--bg-primary', desc: 'Main background' },
    { name: 'Background Secondary', var: '--bg-secondary', desc: 'Card backgrounds' },
    { name: 'Background Tertiary', var: '--bg-tertiary', desc: 'Subtle backgrounds' },
    { name: 'Border Color', var: '--border-color', desc: 'Default borders' },
    { name: 'Border Subtle', var: '--border-subtle', desc: 'Subtle separators' }
  ]
}

const typography = [
  { name: 'Heading 1', size: '2.25rem', weight: '700', usage: 'Page titles' },
  { name: 'Heading 2', size: '1.75rem', weight: '600', usage: 'Section titles' },
  { name: 'Heading 3', size: '1.25rem', weight: '600', usage: 'Card titles' },
  { name: 'Heading 4', size: '1rem', weight: '600', usage: 'Subsections' },
  { name: 'Body Large', size: '1.125rem', weight: '400', usage: 'Intro text' },
  { name: 'Body', size: '1rem', weight: '400', usage: 'Default text' },
  { name: 'Body Small', size: '0.875rem', weight: '400', usage: 'Secondary info' },
  { name: 'Caption', size: '0.75rem', weight: '400', usage: 'Labels, hints' }
]

const spacing = [
  { name: 'xs', value: '0.25rem', px: '4px' },
  { name: 'sm', value: '0.5rem', px: '8px' },
  { name: 'md', value: '1rem', px: '16px' },
  { name: 'lg', value: '1.5rem', px: '24px' },
  { name: 'xl', value: '2rem', px: '32px' },
  { name: '2xl', value: '3rem', px: '48px' }
]

const radii = [
  { name: 'None', var: '--radius-none', value: '0' },
  { name: 'XS', var: '--radius-xs', value: '2px' },
  { name: 'SM', var: '--radius-sm', value: '4px' },
  { name: 'MD', var: '--radius-md', value: '8px' },
  { name: 'LG', var: '--radius-lg', value: '12px' },
  { name: 'XL', var: '--radius-xl', value: '16px' },
  { name: 'Full', var: '--radius-full', value: '9999px' }
]

export function DesignLanguage() {
  return (
    <VStack gap="xl">
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <Color24Regular style={{ color: 'var(--brand-primary)', fontSize: 36 }} />
            <Heading level={1}>Design Language</Heading>
          </HStack>
          <Text size="lg" color="secondary">
            Forge's design system is built on consistent principles that create cohesive, accessible interfaces.
          </Text>
        </VStack>
      </Animate>

      <Divider />

      {/* Colors */}
      <VStack gap="lg">
        <SectionHeading id="colors" level={2}>
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <Color24Regular />
            Colors
          </HStack>
        </SectionHeading>

        <Text color="secondary">
          Our color palette is designed for both light and dark modes, with semantic colors that communicate meaning.
        </Text>

        <VStack gap="md">
          <Heading level={4}>Brand Colors</Heading>
          <Grid columns={{ xs: 2, md: 4 }} gap="md">
            {colors.brand.map((color) => (
              <Card key={color.name} padding="none" style={{ overflow: 'hidden' }}>
                <div style={{
                  height: 80,
                  backgroundColor: `var(${color.var})`
                }} />
                <VStack gap="xs" style={{ padding: '0.75rem' }}>
                  <Text weight="medium">{color.name}</Text>
                  <Text size="xs" color="muted" style={{ fontFamily: 'monospace' }}>{color.var}</Text>
                </VStack>
              </Card>
            ))}
          </Grid>
        </VStack>

        <VStack gap="md">
          <Heading level={4}>Semantic Colors</Heading>
          <Grid columns={{ xs: 2, md: 4 }} gap="md">
            {colors.semantic.map((color) => (
              <Card key={color.name} padding="none" style={{ overflow: 'hidden' }}>
                <div style={{
                  height: 80,
                  backgroundColor: `var(${color.var})`
                }} />
                <VStack gap="xs" style={{ padding: '0.75rem' }}>
                  <Text weight="medium">{color.name}</Text>
                  <Text size="xs" color="muted" style={{ fontFamily: 'monospace' }}>{color.var}</Text>
                </VStack>
              </Card>
            ))}
          </Grid>
        </VStack>

        <VStack gap="md">
          <Heading level={4}>Neutral Colors</Heading>
          <Grid columns={{ xs: 1, md: 2 }} gap="sm">
            {colors.neutral.map((color) => (
              <HStack key={color.name} gap="md" style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: `var(${color.var})`,
                  border: '1px solid var(--border-color)'
                }} />
                <VStack gap="xs" style={{ flex: 1 }}>
                  <Text weight="medium" size="sm">{color.name}</Text>
                  <Text size="xs" color="muted" style={{ fontFamily: 'monospace' }}>{color.var}</Text>
                </VStack>
              </HStack>
            ))}
          </Grid>
        </VStack>
      </VStack>

      <Divider />

      {/* Typography */}
      <VStack gap="lg">
        <SectionHeading id="typography" level={2}>
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <TextFont20Regular />
            Typography
          </HStack>
        </SectionHeading>

        <Text color="secondary">
          We use a system font stack for optimal performance and native feel across platforms.
        </Text>

        <Card padding="lg">
          <CodeBlock
            code={`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;`}
            language="css"
          />
        </Card>

        <VStack gap="sm">
          {typography.map((type) => (
            <HStack key={type.name} gap="lg" style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: type.size,
                  fontWeight: type.weight as any,
                  color: 'var(--text-primary)'
                }}>
                  {type.name}
                </span>
              </div>
              <HStack gap="md" style={{ flexWrap: 'wrap' }}>
                <Badge variant="default">{type.size}</Badge>
                <Badge variant="default">{type.weight}</Badge>
                <Text size="sm" color="muted">{type.usage}</Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </VStack>

      <Divider />

      {/* Spacing */}
      <VStack gap="lg">
        <SectionHeading id="spacing" level={2}>
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <ArrowBidirectionalLeftRight20Regular />
            Spacing
          </HStack>
        </SectionHeading>

        <Text color="secondary">
          Consistent spacing creates visual rhythm and hierarchy. We use a base-4 scale.
        </Text>

        <Grid columns={{ xs: 2, md: 3, lg: 6 }} gap="md">
          {spacing.map((space) => (
            <Card key={space.name} padding="md" style={{ textAlign: 'center' }}>
              <VStack gap="sm">
                <div style={{
                  width: space.value,
                  height: 40,
                  backgroundColor: 'var(--brand-primary)',
                  borderRadius: 'var(--radius-sm)',
                  margin: '0 auto'
                }} />
                <Text weight="medium">{space.name}</Text>
                <Text size="xs" color="muted">{space.px}</Text>
              </VStack>
            </Card>
          ))}
        </Grid>

        <Card padding="lg">
          <CodeBlock
            code={`<VStack gap="md">  {/* 16px gap */}
  <HStack gap="sm"> {/* 8px gap */}
    <Button />
    <Button />
  </HStack>
</VStack>`}
            language="tsx"
          />
        </Card>
      </VStack>

      <Divider />

      {/* Border Radius */}
      <VStack gap="lg">
        <SectionHeading id="radius" level={2}>
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <BorderAll20Regular />
            Border Radius
          </HStack>
        </SectionHeading>

        <Text color="secondary">
          Rounded corners soften the interface and create a friendly, modern feel.
        </Text>

        <Grid columns={{ xs: 3, md: 7 }} gap="md">
          {radii.map((radius) => (
            <Card key={radius.name} padding="md" style={{ textAlign: 'center' }}>
              <VStack gap="sm">
                <div style={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'var(--brand-primary)',
                  borderRadius: `var(${radius.var})`,
                  margin: '0 auto'
                }} />
                <Text weight="medium" size="sm">{radius.name}</Text>
                <Text size="xs" color="muted">{radius.value}</Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>

      <Divider />

      {/* Shadows */}
      <VStack gap="lg">
        <SectionHeading id="shadows" level={2}>
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <Layer20Regular />
            Shadows & Elevation
          </HStack>
        </SectionHeading>

        <Text color="secondary">
          Shadows create depth and establish visual hierarchy between elements.
        </Text>

        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Card padding="lg" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <VStack gap="sm" style={{ textAlign: 'center' }}>
              <Text weight="medium">Small</Text>
              <Text size="xs" color="muted" style={{ fontFamily: 'monospace' }}>--shadow-sm</Text>
              <Text size="sm" color="secondary">Subtle elevation for buttons, inputs</Text>
            </VStack>
          </Card>
          <Card padding="lg" style={{ boxShadow: 'var(--shadow-md)' }}>
            <VStack gap="sm" style={{ textAlign: 'center' }}>
              <Text weight="medium">Medium</Text>
              <Text size="xs" color="muted" style={{ fontFamily: 'monospace' }}>--shadow-md</Text>
              <Text size="sm" color="secondary">Cards, dropdowns, popovers</Text>
            </VStack>
          </Card>
          <Card padding="lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <VStack gap="sm" style={{ textAlign: 'center' }}>
              <Text weight="medium">Large</Text>
              <Text size="xs" color="muted" style={{ fontFamily: 'monospace' }}>--shadow-lg</Text>
              <Text size="sm" color="secondary">Modals, floating elements</Text>
            </VStack>
          </Card>
        </Grid>
      </VStack>

      <Divider />

      {/* Dark Mode */}
      <VStack gap="lg">
        <SectionHeading id="dark-mode" level={2}>
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <WeatherMoon20Regular />
            Dark Mode
          </HStack>
        </SectionHeading>

        <Text color="secondary">
          All components automatically adapt to dark mode. Colors are carefully adjusted to maintain contrast and readability.
        </Text>

        <Card padding="lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <VStack gap="md">
            <Text>
              Forge uses CSS custom properties for theming. Wrap your app with <code style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.125rem 0.375rem',
                borderRadius: 'var(--radius-sm)'
              }}>ForgeProvider</code> and use the theme context to toggle between modes.
            </Text>
            <CodeBlock
              code={`import { ForgeProvider, useTheme } from 'wss3-forge'

function App() {
  return (
    <ForgeProvider theme="dark">
      <YourApp />
    </ForgeProvider>
  )
}

// Toggle theme
const { mode, toggleTheme } = useTheme()`}
              language="tsx"
              showCopyButton
            />
          </VStack>
        </Card>
      </VStack>
    </VStack>
  )
}
