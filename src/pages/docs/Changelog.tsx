import {
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  Badge,
  Divider,
  Animate,
  Button,
  Banner
} from '../../../.forge'
import {
  History24Regular,
  Rocket20Regular,
  Wrench20Regular,
  Bug20Regular,
  Warning20Regular,
  Open16Regular,
  Info20Regular
} from '@fluentui/react-icons'

interface ChangelogEntry {
  version: string
  codename?: string
  date: string
  type: 'major' | 'minor' | 'patch'
  changes: {
    category: 'feature' | 'improvement' | 'fix' | 'breaking'
    description: string
  }[]
}

const changelog: ChangelogEntry[] = [
  {
    version: '3.0.1',
    date: 'December 2025',
    type: 'patch',
    changes: [
      { category: 'fix', description: 'Navbar no longer shows sidebar menu items when sidebar is already visible on tablet' },
      { category: 'fix', description: 'Fixed horizontal scroll issue in Navbar mobile menu and Sidebar drawer' },
      { category: 'fix', description: 'DatePicker calendar dropdown now renders via portal to fix z-index stacking issues' },
      { category: 'fix', description: 'Removed unnecessary arrow icon from AnnouncementBanner component' },
      { category: 'improvement', description: 'DatePicker calendar position now updates on scroll and resize' }
    ]
  },
  {
    version: '3.0.0',
    codename: 'WSS3 Forge',
    date: 'December 2025',
    type: 'major',
    changes: [
      { category: 'feature', description: 'Complete redesign with modern UI/UX' },
      { category: 'feature', description: 'Over 100 production-ready components' },
      { category: 'feature', description: 'Complete documentation website with live examples' },
      { category: 'feature', description: 'New components: Tour, Rating, Countdown, Timer' },
      { category: 'feature', description: 'Charts: BarChart, LineChart, DonutChart, ProgressRing' },
      { category: 'feature', description: 'Media: ImageGallery, Carousel, VideoPlayer, AudioPlayer' },
      { category: 'improvement', description: 'Full TypeScript rewrite with strict types' },
      { category: 'breaking', description: 'New API - not backwards compatible with WSS2' }
    ]
  },
  {
    version: '2.0.0',
    codename: 'WSS2 Orant',
    date: '2023',
    type: 'major',
    changes: [
      { category: 'feature', description: 'Major architecture overhaul' },
      { category: 'feature', description: 'Introduced dark mode support' },
      { category: 'feature', description: 'Added form components: Select, Checkbox, Radio, Switch' },
      { category: 'feature', description: 'Added navigation: Tabs, Breadcrumbs, Pagination' },
      { category: 'feature', description: 'Added overlays: Modal, Dropdown, Tooltip' },
      { category: 'improvement', description: 'Improved component API consistency' },
      { category: 'breaking', description: 'New theming system - migration required from v1' }
    ]
  },
  {
    version: '1.0.0',
    codename: 'WSS',
    date: '2021',
    type: 'major',
    changes: [
      { category: 'feature', description: 'Initial release of the design system' },
      { category: 'feature', description: 'Core components: Button, Card, Input, Text' },
      { category: 'feature', description: 'Basic layout primitives: VStack, HStack, Grid' },
      { category: 'feature', description: 'CSS-in-JS styling approach' }
    ]
  }
]

const categoryConfig = {
  feature: { icon: <Rocket20Regular />, color: 'var(--status-success)', label: 'New' },
  improvement: { icon: <Wrench20Regular />, color: 'var(--brand-primary)', label: 'Improved' },
  fix: { icon: <Bug20Regular />, color: 'var(--status-warning)', label: 'Fixed' },
  breaking: { icon: <Warning20Regular />, color: 'var(--status-error)', label: 'Breaking' }
}

const typeColors = {
  major: 'success',
  minor: 'primary',
  patch: 'default'
} as const

export function Changelog() {
  return (
    <VStack gap="xl">
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <History24Regular style={{ color: 'var(--brand-primary)', fontSize: 36 }} />
            <Heading level={1}>Changelog</Heading>
          </HStack>
          <Text size="lg" color="secondary">
            Track all updates, new features, improvements, and bug fixes across Forge versions.
          </Text>
        </VStack>
      </Animate>

      <Divider />

      <VStack gap="xl">
        {changelog.map((entry, index) => (
          <Animate key={entry.version} type="slideInUp" delay={index * 50}>
            <div id={`v${entry.version}`}>
              <Card padding="lg">
                <VStack gap="lg">
                  <HStack gap="md" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <HStack gap="md" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Heading level={2} style={{ margin: 0 }}>v{entry.version}</Heading>
                      {entry.codename && (
                        <Text color="muted" style={{ fontStyle: 'italic' }}>{entry.codename}</Text>
                      )}
                      <Badge variant={typeColors[entry.type]}>
                        {entry.type.toUpperCase()}
                      </Badge>
                    </HStack>
                    <HStack gap="md" style={{ alignItems: 'center' }}>
                      <Text color="muted">{entry.date}</Text>
                      {entry.version === '1.0.0' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Open16Regular />}
                          onClick={() => window.open('/legacy/en/index.html', '_blank')}
                        >
                          WSS1 Documentation
                        </Button>
                      )}
                    </HStack>
                  </HStack>

                  {entry.version === '2.0.0' && (
                    <Banner
                      variant="info"
                      icon={<Info20Regular />}
                      position="inline"
                    >
                      WSS2 Orant was an internal version and was never publicly released. No public documentation is available.
                    </Banner>
                  )}

                  <VStack gap="sm">
                    {entry.changes.map((change, i) => {
                      const config = categoryConfig[change.category]
                      return (
                        <HStack key={i} gap="md" style={{ alignItems: 'flex-start' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
                            color: config.color,
                            flexShrink: 0
                          }}>
                            {config.icon}
                          </div>
                          <VStack gap="xs" style={{ flex: 1 }}>
                            <Text>{change.description}</Text>
                          </VStack>
                        </HStack>
                      )
                    })}
                  </VStack>
                </VStack>
              </Card>
            </div>
          </Animate>
        ))}
      </VStack>
    </VStack>
  )
}
