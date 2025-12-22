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
  Animate,
  Badge,
  Banner
} from '../../../.forge'
import {
  Bot24Regular,
  Checkmark20Regular,
  Dismiss20Regular,
  Code20Regular,
  Color20Regular,
  Library20Regular,
  Lightbulb20Regular,
  DocumentText20Regular,
  ArrowRight16Regular,
  ArrowDownload20Regular
} from '@fluentui/react-icons'
import { SectionHeading } from '../../components/SectionHeading'

const doRules = [
  'Always use Fluent UI 2 icons (@fluentui/react-icons)',
  'Use CSS variables for all colors (var(--text-primary), etc.)',
  'Import all components from a single source',
  'Wrap your app with ForgeProvider',
  'Use ToastProvider and NotificationProvider for feedback',
  'Follow the component API exactly as documented',
  'Use responsive hooks (useIsMobile, useBreakpoint)',
  'Test in both light and dark modes'
]

const dontRules = [
  'Never use other icon libraries (Lucide, react-icons, etc.)',
  'Never hardcode colors (#ffffff, rgb(), etc.)',
  'Never deep import from component paths',
  'Never mix Forge with other UI libraries',
  'Never create custom components when Forge has one',
  'Never skip the ForgeProvider wrapper',
  'Never use inline colors for theming',
  'Never ignore TypeScript errors on props'
]

const quickSetup = `import { ForgeProvider, ToastProvider, NotificationProvider } from 'wss3-forge'

function App() {
  return (
    <ForgeProvider mode="dark">
      <ToastProvider position="bottom-right">
        <NotificationProvider>
          <YourApp />
        </NotificationProvider>
      </ToastProvider>
    </ForgeProvider>
  )
}`

const iconExample = `// Correct - Fluent UI 2 icons
import {
  Add20Regular,      // Outline style
  Add20Filled,       // Solid style
  Settings24Regular, // Different size
  Home16Regular      // Small size
} from '@fluentui/react-icons'

// Icon naming: {Name}{Size}{Style}
// Sizes: 12, 16, 20, 24, 28, 32, 48
// Styles: Regular (outline), Filled (solid)

<Button icon={<Add20Regular />}>Add Item</Button>
<IconButton icon={<Settings24Regular />} />`

const colorExample = `// Correct - CSS Variables
<div style={{
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border-color)'
}}>

// Available color variables:
// --bg-primary, --bg-secondary, --bg-tertiary, --bg-active
// --text-primary, --text-secondary, --text-muted
// --brand-primary, --brand-secondary
// --border-color, --border-subtle
// --success, --warning, --error, --info`

const componentExample = `import {
  Button, Card, Input, Modal,
  VStack, HStack, Grid,
  Text, Heading, Badge,
  useToast, useNotification
} from 'wss3-forge'

function MyComponent() {
  const { toast } = useToast()

  return (
    <Card padding="lg">
      <VStack gap="md">
        <Heading level={3}>Form Title</Heading>
        <Input
          label="Email"
          placeholder="Enter email"
          type="email"
        />
        <Button
          variant="primary"
          onClick={() => toast.success('Saved!')}
        >
          Submit
        </Button>
      </VStack>
    </Card>
  )
}`

const promptTemplate = `When using Forge design system:

1. Read the AI guide first: packages/wss3-forge/FORGE_AI_GUIDE.md
2. Only use Fluent UI 2 icons from @fluentui/react-icons
3. Use CSS variables for colors, never hardcode
4. Import components from 'wss3-forge' (single source)
5. Always wrap with ForgeProvider
6. Check component props in documentation before using`

export function AIIntegration() {
  const navigate = useNavigate()

  return (
    <VStack gap="xl">
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <Bot24Regular style={{ color: 'var(--brand-primary)', fontSize: 36 }} />
            <Heading level={1}>AI Integration</Heading>
            <Badge variant="info">For AI Assistants</Badge>
          </HStack>
          <Text size="lg" color="secondary">
            Guide for using Forge with AI assistants like Claude, GPT, and others.
            This page explains best practices for generating Forge code with AI.
          </Text>
        </VStack>
      </Animate>

      <Divider />

      <Animate type="slideInUp" delay={100}>
        <VStack gap="md">
          <SectionHeading id="overview" level={2}>Overview</SectionHeading>
          <Text color="secondary">
            Forge is designed to be AI-friendly. The design system provides a comprehensive
            guide document that AI assistants should read before generating code. This ensures
            consistent, correct, and maintainable output.
          </Text>
          <Card padding="lg" variant="subtle">
            <HStack gap="lg" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <HStack gap="md" style={{ alignItems: 'flex-start', flex: 1, minWidth: 200 }}>
                <DocumentText20Regular style={{ color: 'var(--brand-primary)', fontSize: 24, flexShrink: 0 }} />
                <VStack gap="xs">
                  <Text style={{ fontWeight: 600 }}>AI Integration Guide</Text>
                  <Text size="sm" color="secondary">
                    Complete markdown documentation (2500+ lines) with all components, examples, and rules.
                  </Text>
                </VStack>
              </HStack>
              <Button
                variant="primary"
                icon={<ArrowDownload20Regular />}
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = '/FORGE_AI_GUIDE.md'
                  link.download = 'FORGE_AI_GUIDE.md'
                  link.click()
                }}
              >
                Download Guide
              </Button>
            </HStack>
          </Card>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={150}>
        <VStack gap="md">
          <SectionHeading id="quick-setup" level={2}>Quick Setup</SectionHeading>
          <Text color="secondary">
            The basic structure every Forge app needs:
          </Text>
          <CodeBlock
            code={quickSetup}
            language="tsx"
            showLineNumbers
            showCopyButton
          />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={200}>
        <VStack gap="md">
          <SectionHeading id="rules" level={2}>Rules for AI</SectionHeading>

          <Grid columns={{ xs: 1, md: 2 }} gap="lg">
            <Card padding="lg">
              <VStack gap="md">
                <HStack gap="sm" style={{ alignItems: 'center' }}>
                  <Checkmark20Regular style={{ color: 'var(--success)' }} />
                  <Text style={{ fontWeight: 600, color: 'var(--success)' }}>DO</Text>
                </HStack>
                <VStack gap="sm">
                  {doRules.map((rule) => (
                    <HStack key={rule} gap="sm" style={{ alignItems: 'flex-start' }}>
                      <Checkmark20Regular style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                      <Text size="sm">{rule}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Card>

            <Card padding="lg">
              <VStack gap="md">
                <HStack gap="sm" style={{ alignItems: 'center' }}>
                  <Dismiss20Regular style={{ color: 'var(--error)' }} />
                  <Text style={{ fontWeight: 600, color: 'var(--error)' }}>DON'T</Text>
                </HStack>
                <VStack gap="sm">
                  {dontRules.map((rule) => (
                    <HStack key={rule} gap="sm" style={{ alignItems: 'flex-start' }}>
                      <Dismiss20Regular style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                      <Text size="sm">{rule}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Card>
          </Grid>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={250}>
        <VStack gap="md">
          <SectionHeading id="icons" level={2}>Icons</SectionHeading>
          <Banner variant="warning" title="Critical">
            Only use Fluent UI 2 icons. Other icon libraries will break visual consistency.
          </Banner>
          <CodeBlock
            code={iconExample}
            language="tsx"
            showLineNumbers
            showCopyButton
          />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={300}>
        <VStack gap="md">
          <SectionHeading id="colors" level={2}>Colors</SectionHeading>
          <Text color="secondary">
            Always use CSS variables for colors. This ensures themes work correctly.
          </Text>
          <CodeBlock
            code={colorExample}
            language="tsx"
            showLineNumbers
            showCopyButton
          />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={350}>
        <VStack gap="md">
          <SectionHeading id="components" level={2}>Using Components</SectionHeading>
          <Text color="secondary">
            Import all components from a single source. Check the documentation for correct props.
          </Text>
          <CodeBlock
            code={componentExample}
            language="tsx"
            showLineNumbers
            showCopyButton
          />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={400}>
        <VStack gap="md">
          <SectionHeading id="prompt-template" level={2}>Prompt Template</SectionHeading>
          <Text color="secondary">
            Add this to your AI instructions or system prompt when working with Forge:
          </Text>
          <CodeBlock
            code={promptTemplate}
            language="text"
            showCopyButton
          />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={450}>
        <VStack gap="md">
          <SectionHeading id="best-practices" level={2}>Best Practices</SectionHeading>

          <VStack gap="lg">
            <Card padding="lg">
              <HStack gap="md" style={{ alignItems: 'flex-start' }}>
                <Library20Regular style={{ color: 'var(--brand-primary)', fontSize: 24, flexShrink: 0 }} />
                <VStack gap="xs">
                  <Text style={{ fontWeight: 600 }}>Read the Guide First</Text>
                  <Text size="sm" color="secondary">
                    Before generating any code, AI should read FORGE_AI_GUIDE.md for the complete
                    component reference. This prevents errors and ensures correct API usage.
                  </Text>
                </VStack>
              </HStack>
            </Card>

            <Card padding="lg">
              <HStack gap="md" style={{ alignItems: 'flex-start' }}>
                <Code20Regular style={{ color: 'var(--brand-primary)', fontSize: 24, flexShrink: 0 }} />
                <VStack gap="xs">
                  <Text style={{ fontWeight: 600 }}>Check Props Before Using</Text>
                  <Text size="sm" color="secondary">
                    Each component has specific props. Don't assume - check the documentation.
                    For example, Button has variant, size, icon props but not color or type.
                  </Text>
                </VStack>
              </HStack>
            </Card>

            <Card padding="lg">
              <HStack gap="md" style={{ alignItems: 'flex-start' }}>
                <Color20Regular style={{ color: 'var(--brand-primary)', fontSize: 24, flexShrink: 0 }} />
                <VStack gap="xs">
                  <Text style={{ fontWeight: 600 }}>Use Theme Creator for Custom Themes</Text>
                  <Text size="sm" color="secondary">
                    Need custom colors? Use the Theme Creator to generate ForgeProvider configuration
                    instead of manually defining CSS variables.
                  </Text>
                </VStack>
              </HStack>
            </Card>

            <Card padding="lg">
              <HStack gap="md" style={{ alignItems: 'flex-start' }}>
                <Lightbulb20Regular style={{ color: 'var(--brand-primary)', fontSize: 24, flexShrink: 0 }} />
                <VStack gap="xs">
                  <Text style={{ fontWeight: 600 }}>Leverage Existing Components</Text>
                  <Text size="sm" color="secondary">
                    Forge has 100+ components. Before creating custom UI, check if a component
                    already exists. StatCard, ImageCard, Timeline, etc. cover many use cases.
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={500}>
        <Card padding="lg">
          <HStack gap="lg" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <VStack gap="xs" style={{ minWidth: 200, flex: 1 }}>
              <Heading level={4}>Explore Components</Heading>
              <Text color="secondary">See all available components in the documentation.</Text>
            </VStack>
            <Button
              variant="primary"
              onClick={() => navigate('/docs/components')}
              icon={<ArrowRight16Regular />}
            >
              View Components
            </Button>
          </HStack>
        </Card>
      </Animate>
    </VStack>
  )
}
