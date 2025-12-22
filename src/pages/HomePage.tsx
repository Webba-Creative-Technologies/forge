import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Button,
  Card,
  Grid,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Animate,
  GradientButton,
  CodeBlock,
  Avatar,
  Input,
  Switch,
  Footer,
  MultiLineChart
} from '../../.forge'
import {
  Rocket20Regular,
  PuzzlePiece20Regular,
  Accessibility20Regular,
  Code20Regular,
  ArrowRight16Regular,
  Checkmark20Regular,
  Star20Regular,
  Shield20Regular,
  Open20Regular,
  Apps24Regular,
  Copy16Regular,
  Checkmark16Regular,
  Bot20Regular
} from '@fluentui/react-icons'

const stats = [
  { value: '100+', label: 'Components' },
  { value: '30+', label: 'Hooks & Utils' },
  { value: 'AI', label: 'Ready' },
  { value: '100%', label: 'TypeScript' }
]

const installCode = `// 1. Install Forge
npm install wss3-forge

// 2. Wrap your app
import { ForgeProvider } from 'wss3-forge'
import 'wss3-forge/styles'

<ForgeProvider mode="dark">
  <App />
</ForgeProvider>`

function ComponentShowcase() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  return (
    <Grid columns={{ xs: 1, md: 3 }} gap="md">
      {/* User Profile Card */}
      <Card padding="lg">
        <VStack gap="md" style={{ alignItems: 'center', textAlign: 'center' }}>
          <Avatar name="Sarah Chen" size="xl" />
          <VStack gap="xs" style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 600 }}>Sarah Chen</Text>
            <Text size="sm" color="muted">Senior Developer</Text>
          </VStack>
          <HStack gap="lg">
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: 600 }}>128</Text>
              <Text size="xs" color="muted">Projects</Text>
            </VStack>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: 600 }}>12k</Text>
              <Text size="xs" color="muted">Followers</Text>
            </VStack>
          </HStack>
          <Button variant="primary" fullWidth>Follow</Button>
        </VStack>
      </Card>

      {/* Settings Panel */}
      <Card padding="lg">
        <VStack gap="md">
          <Text style={{ fontWeight: 600 }}>Preferences</Text>
          <VStack gap="sm">
            <HStack style={{ justifyContent: 'space-between' }}>
              <VStack gap="xs" style={{ alignItems: 'flex-start' }}>
                <Text size="sm">Dark mode</Text>
                <Text size="xs" color="muted">Use dark theme</Text>
              </VStack>
              <Switch checked={darkMode} onChange={setDarkMode} />
            </HStack>
            <HStack style={{ justifyContent: 'space-between' }}>
              <VStack gap="xs" style={{ alignItems: 'flex-start' }}>
                <Text size="sm">Notifications</Text>
                <Text size="xs" color="muted">Push alerts</Text>
              </VStack>
              <Switch checked={notifications} onChange={setNotifications} />
            </HStack>
          </VStack>
          <Button variant="secondary" fullWidth>Save changes</Button>
        </VStack>
      </Card>

      {/* Newsletter Signup */}
      <Card padding="lg">
        <VStack gap="md">
          <VStack gap="xs">
            <Text style={{ fontWeight: 600 }}>Stay updated</Text>
            <Text size="sm" color="muted">Get the latest news and updates.</Text>
          </VStack>
          <Input placeholder="you@example.com" type="email" />
          <Button variant="primary" fullWidth icon={<Rocket20Regular />}>
            Subscribe
          </Button>
          <Text size="xs" color="muted" style={{ textAlign: 'center' }}>
            No spam. Unsubscribe anytime.
          </Text>
        </VStack>
      </Card>

      {/* Stats Card */}
      <Card padding="lg">
        <VStack gap="md">
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 600 }}>Revenue</Text>
            <Badge variant="success">+12.5%</Badge>
          </HStack>
          <Text style={{ fontSize: '2rem', fontWeight: 700 }}>$48,295</Text>
          <Text size="sm" color="muted">Compared to $42,900 last month</Text>
          <HStack gap="sm">
            <Button variant="secondary" size="sm">Details</Button>
            <Button variant="ghost" size="sm">Export</Button>
          </HStack>
        </VStack>
      </Card>

      {/* Team Card */}
      <Card padding="lg">
        <VStack gap="md">
          <Text style={{ fontWeight: 600 }}>Team members</Text>
          <VStack gap="sm">
            <HStack gap="sm" style={{ alignItems: 'center' }}>
              <Avatar name="Alex Kim" size="sm" />
              <VStack gap="xs" style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text size="sm">Alex Kim</Text>
                <Text size="xs" color="muted">Design Lead</Text>
              </VStack>
              <Badge variant="success">Online</Badge>
            </HStack>
            <HStack gap="sm" style={{ alignItems: 'center' }}>
              <Avatar name="Jordan Lee" size="sm" />
              <VStack gap="xs" style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text size="sm">Jordan Lee</Text>
                <Text size="xs" color="muted">Developer</Text>
              </VStack>
              <Badge variant="default">Away</Badge>
            </HStack>
          </VStack>
          <Button variant="secondary" fullWidth>View all</Button>
        </VStack>
      </Card>

      {/* Analytics Dashboard */}
      <Card padding="lg">
        <VStack gap="md">
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <VStack gap="xs" style={{ alignItems: 'flex-start' }}>
              <Text size="xs" color="muted">Weekly Overview</Text>
              <Text style={{ fontSize: '1.5rem', fontWeight: 700 }}>2,847</Text>
            </VStack>
            <VStack gap="xs" style={{ alignItems: 'flex-end' }}>
              <Badge variant="success">+24%</Badge>
              <Text size="xs" color="muted">vs last week</Text>
            </VStack>
          </HStack>
          <MultiLineChart
            series={[
              { name: 'Users', data: [120, 180, 150, 220, 280, 240, 320], color: 'var(--brand-primary)' },
              { name: 'Sessions', data: [80, 120, 100, 160, 200, 180, 260], color: 'var(--brand-secondary)' }
            ]}
            height={80}
            showLegend={false}
            showDots={false}
            showArea
            showGrid={false}
          />
          <HStack gap="lg" style={{ justifyContent: 'center' }}>
            <HStack gap="xs">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-primary)' }} />
              <Text size="xs" color="muted">Users</Text>
            </HStack>
            <HStack gap="xs">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-secondary)' }} />
              <Text size="xs" color="muted">Sessions</Text>
            </HStack>
          </HStack>
        </VStack>
      </Card>
    </Grid>
  )
}

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

function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const command = 'npm install wss3-forge'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        maxWidth: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--brand-primary)'
        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)'
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
      }}
    >
      <code style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap'
      }}>
        <span style={{ color: 'var(--text-muted)' }}>$</span>{' '}
        <span style={{ color: 'var(--brand-primary)' }}>npm</span>{' '}
        <span>install</span>{' '}
        <span style={{ color: 'var(--brand-secondary)' }}>wss3-forge</span>
      </code>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        color: copied ? 'var(--color-success)' : 'var(--text-muted)',
        fontSize: '0.75rem',
        transition: 'color 0.15s ease'
      }}>
        {copied ? (
          <>
            <Checkmark16Regular />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy16Regular />
            <span>Copy</span>
          </>
        )}
      </div>
    </div>
  )
}

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 0',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(163, 91, 255, 0.15) 0%, var(--bg-primary) 60%)'
      }}>
        <Container maxWidth={1100}>
          <Animate type="fadeIn">
            <HStack gap="sm" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Badge variant="primary">
                <HStack gap="xs">
                  <Star20Regular style={{ fontSize: 12 }} />
                  <span>WSS3 is now available!</span>
                </HStack>
              </Badge>
            </HStack>
          </Animate>

          <Animate type="slideInUp" delay={100}>
            <Heading level={1} style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              lineHeight: 1.1,
              marginBottom: '1.5rem'
            }}>
              Build faster with
              <br />
              <span style={{
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>beautiful</span> components
            </Heading>
          </Animate>

          <Animate type="slideInUp" delay={200}>
            <Text size="lg" color="secondary" style={{
              maxWidth: 600,
              margin: '0 auto 1.5rem',
              padding: '0 1rem',
              lineHeight: 1.6
            }}>
              Forge is an AI-ready React UI kit with 100+ production-ready components.
              Built for developers and AI assistants alike. Ship stunning interfaces in hours, not weeks.
            </Text>
          </Animate>

          <Animate type="slideInUp" delay={300}>
            <HStack gap="md" style={{ justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
              <GradientButton
                size="lg"
                onClick={() => navigate('/docs/getting-started')}
              >
                <HStack gap="sm">
                  <Rocket20Regular />
                  <span>Get Started Free</span>
                </HStack>
              </GradientButton>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.open('https://discord.gg/P9aFbP7gY6', '_blank')}
                icon={<Open20Regular />}
              >
                Join our community
              </Button>
            </HStack>
          </Animate>

          {/* Stats */}
          <Animate type="fadeIn" delay={500}>
            <HStack gap="xl" style={{
              justifyContent: 'center',
              marginTop: '4rem',
              flexWrap: 'wrap'
            }}>
              {stats.map((stat) => (
                <VStack key={stat.label} gap="xs" style={{ minWidth: 80 }}>
                  <Text style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--brand-primary)'
                  }}>
                    {stat.value}
                  </Text>
                  <Text size="sm" color="muted">{stat.label}</Text>
                </VStack>
              ))}
            </HStack>
          </Animate>

          {/* Install Command */}
          <Animate type="fadeIn" delay={600}>
            <div style={{ marginTop: '3rem' }}>
              <InstallCommand />
            </div>
          </Animate>
        </Container>
      </section>

      {/* Why Forge */}
      <section style={{
        padding: '6rem 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth={1200}>
          <Grid columns={{ xs: 1, lg: 2 }} gap="xl" style={{ alignItems: 'center' }}>
            {/* Left side - Text content */}
            <Animate type="slideInLeft">
              <VStack gap="xl" style={{ alignItems: 'flex-start' }}>
                <VStack gap="md" style={{ alignItems: 'flex-start' }}>
                  <Badge variant="primary">
                    <HStack gap="xs">
                      <Code20Regular style={{ fontSize: 14 }} />
                      <span>Why Forge?</span>
                    </HStack>
                  </Badge>
                  <Heading level={2}>
                    Built{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>for developers</span>
                    {' '}who value their time
                  </Heading>
                  <Text color="secondary" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Stop wasting hours on boilerplate. Forge gives you production-ready components that just work.
                  </Text>
                </VStack>

                <Grid columns={{ xs: 1, sm: 2 }} gap="md" style={{ width: '100%' }}>
                  <Card padding="md" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <VStack gap="sm">
                      <PuzzlePiece20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                      <Text style={{ fontWeight: 600 }}>Zero Configuration</Text>
                      <Text size="sm" color="secondary">Install, import, build. No webpack or babel config needed.</Text>
                    </VStack>
                  </Card>

                  <Card padding="md" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <VStack gap="sm">
                      <Code20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                      <Text style={{ fontWeight: 600 }}>TypeScript Native</Text>
                      <Text size="sm" color="secondary">Fully typed components with autocomplete.</Text>
                    </VStack>
                  </Card>

                  <Card padding="md" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <VStack gap="sm">
                      <Accessibility20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                      <Text style={{ fontWeight: 600 }}>Accessible by Default</Text>
                      <Text size="sm" color="secondary">WCAG compliant with keyboard navigation.</Text>
                    </VStack>
                  </Card>

                  <Card padding="md" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--brand-primary)' }}>
                    <VStack gap="sm">
                      <Bot20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                      <HStack gap="sm">
                        <Text style={{ fontWeight: 600 }}>AI-Ready</Text>
                        <Badge variant="primary" size="sm">New</Badge>
                      </HStack>
                      <Text size="sm" color="secondary">Designed for AI assistants with dedicated guide.</Text>
                    </VStack>
                  </Card>
                </Grid>
              </VStack>
            </Animate>

            {/* Right side - Code preview */}
            <Animate type="slideInRight" delay={200}>
              <div style={{ position: 'relative' }}>
                {/* Purple glow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120%',
                  height: '120%',
                  background: 'var(--brand-primary)',
                  opacity: 0.2,
                  borderRadius: '50%',
                  filter: 'blur(100px)',
                  zIndex: 0
                }} />

                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                  {/* Window header */}
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-secondary)'
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
                    <Text size="xs" color="muted" style={{ marginLeft: '0.5rem' }}>App.tsx</Text>
                  </div>
                  {/* Code content */}
                  <div style={{ padding: '1.5rem', overflow: 'auto' }}>
                    <pre style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      lineHeight: 1.8,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                    }}>
                      <code>
                        <span style={{ color: '#c586c0' }}>import</span>
                        <span style={{ color: '#9cdcfe' }}> {'{ '}</span>
                        <span style={{ color: '#4ec9b0' }}>Button</span>
                        <span style={{ color: '#9cdcfe' }}>, </span>
                        <span style={{ color: '#4ec9b0' }}>Card</span>
                        <span style={{ color: '#9cdcfe' }}>, </span>
                        <span style={{ color: '#4ec9b0' }}>Text</span>
                        <span style={{ color: '#9cdcfe' }}> {'}'}</span>
                        <span style={{ color: '#c586c0' }}> from</span>
                        <span style={{ color: '#ce9178' }}> 'wss3-forge'</span>
                        {'\n\n'}
                        <span style={{ color: '#c586c0' }}>function</span>
                        <span style={{ color: '#dcdcaa' }}> App</span>
                        <span style={{ color: '#9cdcfe' }}>() {'{'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'  '}</span>
                        <span style={{ color: '#c586c0' }}>return</span>
                        <span style={{ color: '#9cdcfe' }}> (</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'    '}</span>
                        <span style={{ color: '#808080' }}>{'<'}</span>
                        <span style={{ color: '#4ec9b0' }}>Card</span>
                        <span style={{ color: '#9cdcfe' }}> padding</span>
                        <span style={{ color: '#9cdcfe' }}>=</span>
                        <span style={{ color: '#ce9178' }}>"lg"</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'      '}</span>
                        <span style={{ color: '#808080' }}>{'<'}</span>
                        <span style={{ color: '#4ec9b0' }}>Text</span>
                        <span style={{ color: '#9cdcfe' }}> size</span>
                        <span style={{ color: '#9cdcfe' }}>=</span>
                        <span style={{ color: '#ce9178' }}>"xl"</span>
                        <span style={{ color: '#9cdcfe' }}> weight</span>
                        <span style={{ color: '#9cdcfe' }}>=</span>
                        <span style={{ color: '#ce9178' }}>"bold"</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'        '}</span>
                        <span style={{ color: '#d4d4d4' }}>Welcome to Forge</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'      '}</span>
                        <span style={{ color: '#808080' }}>{'</'}</span>
                        <span style={{ color: '#4ec9b0' }}>Text</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'      '}</span>
                        <span style={{ color: '#808080' }}>{'<'}</span>
                        <span style={{ color: '#4ec9b0' }}>Text</span>
                        <span style={{ color: '#9cdcfe' }}> color</span>
                        <span style={{ color: '#9cdcfe' }}>=</span>
                        <span style={{ color: '#ce9178' }}>"secondary"</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'        '}</span>
                        <span style={{ color: '#d4d4d4' }}>Build UIs in minutes.</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'      '}</span>
                        <span style={{ color: '#808080' }}>{'</'}</span>
                        <span style={{ color: '#4ec9b0' }}>Text</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'      '}</span>
                        <span style={{ color: '#808080' }}>{'<'}</span>
                        <span style={{ color: '#4ec9b0' }}>Button</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        <span style={{ color: '#d4d4d4' }}>Get Started</span>
                        <span style={{ color: '#808080' }}>{'</'}</span>
                        <span style={{ color: '#4ec9b0' }}>Button</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'    '}</span>
                        <span style={{ color: '#808080' }}>{'</'}</span>
                        <span style={{ color: '#4ec9b0' }}>Card</span>
                        <span style={{ color: '#808080' }}>{'>'}</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'  '})</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>{'}'}</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </Animate>
          </Grid>
        </Container>
      </section>

      {/* Component Preview */}
      <section style={{ padding: '6rem 0' }}>
        <Container maxWidth={1200}>
          <Animate type="fadeIn">
            <VStack gap="md" style={{ textAlign: 'center', marginBottom: '3rem', alignItems: 'center' }}>
              <Badge variant="primary">
                <HStack gap="xs">
                  <Apps24Regular style={{ fontSize: 14 }} />
                  <span>Live Preview</span>
                </HStack>
              </Badge>
              <Heading level={2} style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                See what you can{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>build</span>
              </Heading>
              <Text color="secondary" style={{ maxWidth: 450, margin: '0 auto' }}>
                Real components with real interactions. Copy, paste, and customize.
              </Text>
              <HStack gap="sm" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="primary" size="sm" onClick={() => navigate('/docs/components')}>
                  Explore All Components
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/playground')}>
                  Try in Playground
                </Button>
              </HStack>
            </VStack>
          </Animate>

          <Animate type="scaleIn" delay={200}>
            <ComponentShowcase />
          </Animate>
        </Container>
      </section>

      {/* Quick Install */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <Container maxWidth={1200}>
          <Grid columns={{ xs: 1, lg: 2 }} gap="xl" style={{ alignItems: 'center' }}>
            <Animate type="slideInLeft">
              <VStack gap="lg" style={{ minWidth: 0, alignItems: 'flex-start' }}>
                <Badge variant="primary">
                  <HStack gap="xs">
                    <Shield20Regular style={{ fontSize: 14 }} />
                    <span>Simple Setup</span>
                  </HStack>
                </Badge>
                <Heading level={2}>
                  Up and running{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>in minutes</span>
                </Heading>
                <Text color="secondary" style={{ wordBreak: 'break-word', lineHeight: 1.6 }}>
                  No complex configuration. No build tool headaches. Just install the package
                  and start building beautiful interfaces.
                </Text>
                <VStack gap="sm">
                  {[
                    'Zero configuration required',
                    'Works with any React setup',
                    'Full TypeScript support',
                    'Tree-shakeable exports'
                  ].map((feature) => (
                    <HStack key={feature} gap="sm">
                      <Checkmark20Regular style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      <Text size="sm">{feature}</Text>
                    </HStack>
                  ))}
                </VStack>
                <Button
                  variant="primary"
                  onClick={() => navigate('/docs/installation')}
                  icon={<ArrowRight16Regular />}
                >
                  Installation Guide
                </Button>
              </VStack>
            </Animate>

            <Animate type="slideInRight" delay={200}>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <CodeBlock
                  code={installCode}
                  language="tsx"
                  showLineNumbers
                  showCopyButton
                />
              </div>
            </Animate>
          </Grid>
        </Container>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <Container maxWidth={1000}>
          <Animate type="fadeIn">
            <Card padding="xl" style={{
              background: 'linear-gradient(135deg, rgba(163, 91, 255, 0.15) 0%, rgba(163, 91, 255, 0.05) 100%)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>

              <HStack style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem',
                position: 'relative',
                zIndex: 1
              }}>
                <VStack gap="sm" style={{ alignItems: 'flex-start', flex: 1, minWidth: 280 }}>
                  <Heading level={3} style={{ margin: 0 }}>Ready to build something amazing?</Heading>
                  <Text color="secondary">
                    Start shipping faster with Forge. Free and open source.
                  </Text>
                </VStack>
                <HStack gap="sm" style={{ flexShrink: 0 }}>
                  <Button variant="primary" onClick={() => navigate('/docs')}>
                    Get Started
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.open('https://discord.gg/P9aFbP7gY6', '_blank')}
                  >
                    Discord
                  </Button>
                </HStack>
              </HStack>
            </Card>
          </Animate>
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
