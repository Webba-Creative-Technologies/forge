import { useNavigate } from 'react-router-dom'
import {
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  Button,
  CodeBlock,
  Divider,
  Grid,
  Animate
} from '../../../.forge'
import {
  Rocket24Regular,
  Checkmark20Regular,
  ArrowRight16Regular,
  Bot20Regular,
  Apps20Regular,
  Color20Regular,
  Accessibility20Regular,
  Code20Regular
} from '@fluentui/react-icons'
import { SectionHeading } from '../../components/SectionHeading'

const features = [
  'React 18+ with TypeScript',
  'Fluent UI 2 icons integration',
  'Dark & Light theme support',
  '100+ production-ready components',
  'CSS variables for easy customization',
  'Responsive hooks and utilities',
  'Accessible by default',
  'Zero configuration needed',
  'AI-Ready with dedicated guide'
]

const quickExample = `import { ForgeProvider, Button, Card } from 'wss3-forge'
import 'wss3-forge/styles'

function App() {
  return (
    <ForgeProvider mode="dark">
      <Card padding="lg">
        <Button variant="primary">
          Hello Forge!
        </Button>
      </Card>
    </ForgeProvider>
  )
}`

export function GettingStarted() {
  const navigate = useNavigate()

  return (
    <VStack gap="xl">
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <Rocket24Regular style={{ color: 'var(--brand-primary)', fontSize: 36 }} />
            <Heading level={1}>Getting Started</Heading>
          </HStack>
          <Text size="lg" color="secondary">
            Forge is an AI-ready React component library designed for building
            modern web applications. Built for developers and AI assistants alike,
            with consistent styling and predictable patterns.
          </Text>
        </VStack>
      </Animate>

      <Divider />

      <Animate type="slideInUp" delay={100}>
        <VStack gap="md">
          <SectionHeading id="what-is-forge" level={2}>What is Forge?</SectionHeading>
          <Text color="secondary">
            Forge (WSS3 - Webba Style System 3) is an AI-ready design system that provides
            pre-built, production-ready React components. It's built with TypeScript,
            uses Fluent UI 2 icons, and includes a comprehensive AI integration guide
            that enables AI assistants to generate correct component code instantly.
          </Text>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={200}>
        <VStack gap="md">
          <SectionHeading id="key-features" level={3}>Key Features</SectionHeading>
          <Card padding="lg" variant="subtle">
            <Grid columns={{ xs: 1, md: 2 }} gap="sm">
              {features.map((feature) => (
                <HStack key={feature} gap="sm">
                  <Checkmark20Regular style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <Text size="sm">{feature}</Text>
                </HStack>
              ))}
            </Grid>
          </Card>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={300}>
        <VStack gap="md">
          <SectionHeading id="quick-example" level={2}>Quick Example</SectionHeading>
          <Text color="secondary">
            Here's a minimal example to get you started with Forge:
          </Text>
          <CodeBlock
            code={quickExample}
            language="tsx"
            showLineNumbers
            showCopyButton
          />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={400}>
        <Card padding="lg">
          <HStack gap="lg" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <VStack gap="xs" style={{ minWidth: 200, flex: 1 }}>
              <Heading level={4}>Ready to install?</Heading>
              <Text color="secondary">Follow our installation guide to get started.</Text>
            </VStack>
            <Button
              variant="primary"
              onClick={() => navigate('/docs/installation')}
              icon={<ArrowRight16Regular />}
            >
              Installation Guide
            </Button>
          </HStack>
        </Card>
      </Animate>

      <Animate type="slideInUp" delay={500}>
        <VStack gap="md">
          <SectionHeading id="design-principles" level={2}>Design Principles</SectionHeading>

          <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md">
            <Card padding="md">
              <VStack gap="sm">
                <Apps20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={4} style={{ margin: 0 }}>Component-First</Heading>
                <Text size="sm" color="secondary">
                  Every UI element is a component. No custom CSS needed - just import and use.
                </Text>
              </VStack>
            </Card>

            <Card padding="md">
              <VStack gap="sm">
                <Color20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={4} style={{ margin: 0 }}>Consistent Theming</Heading>
                <Text size="sm" color="secondary">
                  CSS variables power the design system. Dark, light, or custom themes.
                </Text>
              </VStack>
            </Card>

            <Card padding="md">
              <VStack gap="sm">
                <Accessibility20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={4} style={{ margin: 0 }}>Accessibility</Heading>
                <Text size="sm" color="secondary">
                  Keyboard navigation, focus management, and ARIA attributes by default.
                </Text>
              </VStack>
            </Card>

            <Card padding="md">
              <VStack gap="sm">
                <Code20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={4} style={{ margin: 0 }}>Type-Safe</Heading>
                <Text size="sm" color="secondary">
                  Full TypeScript support with autocomplete and type checking.
                </Text>
              </VStack>
            </Card>

            <Card padding="md" style={{ border: '1px solid var(--brand-primary)' }}>
              <VStack gap="sm">
                <Bot20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={4} style={{ margin: 0 }}>AI-Ready</Heading>
                <Text size="sm" color="secondary">
                  Designed for AI assistants. Consistent patterns and dedicated AI guide.
                </Text>
              </VStack>
            </Card>
          </Grid>
        </VStack>
      </Animate>
    </VStack>
  )
}
