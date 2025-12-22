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
  Badge,
  Animate
} from '../../../.forge'
import {
  ArrowDownload24Regular,
  Checkmark20Regular,
  Warning20Regular,
  ArrowRight16Regular
} from '@fluentui/react-icons'
import { SectionHeading } from '../../components/SectionHeading'

const step1Code = `npm install wss3-forge
# or
yarn add wss3-forge
# or
pnpm add wss3-forge`

const step2Code = `// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ForgeProvider, ToastProvider } from 'wss3-forge'
import 'wss3-forge/styles'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ForgeProvider mode="dark">
      <ToastProvider position="bottom-right">
        <App />
      </ToastProvider>
    </ForgeProvider>
  </React.StrictMode>
)`

const step3Code = `import { Button, Card, Modal, Input } from 'wss3-forge'

function MyComponent() {
  return (
    <Card padding="lg">
      <Button variant="primary">Click me</Button>
    </Card>
  )
}`

const cssVariablesCode = `:root {
  --brand-primary: #A35BFF;
  --brand-secondary: #FD9173;
  --bg-primary: #070707;
  --bg-secondary: #0c0c0c;
  --bg-tertiary: #1a1a1a;
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --border-color: #404040;
}`

export function Installation() {
  const navigate = useNavigate()

  return (
    <VStack gap="xl">
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <ArrowDownload24Regular style={{ color: 'var(--brand-primary)', fontSize: 36 }} />
            <Heading level={1}>Installation</Heading>
          </HStack>
          <Text size="lg" color="secondary">
            Follow these steps to add Forge to your React project.
          </Text>
        </VStack>
      </Animate>

      <Divider />

      <Animate type="slideInUp" delay={100}>
        <div id="prerequisites">
          <Card padding="lg" variant="subtle">
            <VStack gap="md">
              <HStack gap="sm">
                <Warning20Regular style={{ color: 'var(--warning)' }} />
                <Heading level={4}>Prerequisites</Heading>
              </HStack>
              <VStack gap="xs">
                <HStack gap="sm">
                  <Checkmark20Regular style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <Text>React 18 or higher</Text>
                </HStack>
                <HStack gap="sm">
                  <Checkmark20Regular style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <Text>TypeScript (recommended)</Text>
                </HStack>
                <HStack gap="sm">
                  <Checkmark20Regular style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <Text>Node.js 16+</Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>
        </div>
      </Animate>

      <Animate type="slideInUp" delay={200}>
        <VStack gap="lg">
          {/* Step 1 */}
          <div id="step-1">
            <Card padding="lg">
              <VStack gap="md">
                <HStack gap="sm">
                  <Badge variant="primary">Step 1</Badge>
                  <Heading level={3}>Install Forge</Heading>
                </HStack>
                <Text color="secondary">
                  Install the <code style={{ color: 'var(--brand-primary)' }}>wss3-forge</code> package via npm, yarn, or pnpm.
                  Fluent UI icons are included as a dependency.
                </Text>
                <CodeBlock code={step1Code} language="bash" showCopyButton />
              </VStack>
            </Card>
          </div>

          {/* Step 2 */}
          <div id="step-2">
            <Card padding="lg">
              <VStack gap="md">
                <HStack gap="sm">
                  <Badge variant="primary">Step 2</Badge>
                  <Heading level={3}>Set Up ForgeProvider</Heading>
                </HStack>
                <Text color="secondary">
                  Wrap your app with <code style={{ color: 'var(--brand-primary)' }}>ForgeProvider</code> to inject the theme
                  and make components work correctly.
                </Text>
                <CodeBlock code={step2Code} language="tsx" showLineNumbers showCopyButton />
              </VStack>
            </Card>
          </div>

          {/* Step 3 */}
          <div id="step-3">
            <Card padding="lg">
              <VStack gap="md">
                <HStack gap="sm">
                  <Badge variant="primary">Step 3</Badge>
                  <Heading level={3}>Start Using Components</Heading>
                </HStack>
                <Text color="secondary">
                  Import and use any component from <code style={{ color: 'var(--brand-primary)' }}>wss3-forge</code>:
                </Text>
                <CodeBlock code={step3Code} language="tsx" showLineNumbers showCopyButton />
              </VStack>
            </Card>
          </div>
        </VStack>
      </Animate>

      <Divider />

      <Animate type="slideInUp" delay={300}>
        <VStack gap="md">
          <SectionHeading id="css-variables" level={2}>CSS Variables</SectionHeading>
          <Text color="secondary">
            Forge uses CSS variables for theming. These are automatically injected
            by the ForgeProvider, but you can also use them in your custom styles:
          </Text>
          <CodeBlock code={cssVariablesCode} language="css" showLineNumbers showCopyButton />
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={400}>
        <Card padding="lg">
          <HStack gap="lg" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <VStack gap="xs" style={{ minWidth: 200, flex: 1 }}>
              <Heading level={4}>Ready to explore components?</Heading>
              <Text color="secondary">Browse the full component library.</Text>
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
