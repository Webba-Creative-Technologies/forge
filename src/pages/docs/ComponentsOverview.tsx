import { useNavigate } from 'react-router-dom'
import {
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  Badge,
  Divider,
  SearchInput,
  Animate,
  Stagger
} from '../../../.forge'
import {
  Apps24Regular,
  CursorClick20Regular,
  LayoutColumnTwo20Regular,
  TextboxSettings20Regular,
  Navigation20Regular,
  PanelRight20Regular,
  Table20Regular,
  AlertOn20Regular,
  DataPie20Regular,
  Video20Regular,
  Wrench20Regular,
  ArrowRight16Regular
} from '@fluentui/react-icons'
import { useState } from 'react'
import { SectionHeading } from '../../components/SectionHeading'

const componentCategories = [
  {
    id: 'buttons',
    title: 'Buttons',
    icon: <CursorClick20Regular />,
    description: 'Interactive buttons for actions and navigation',
    components: ['Button', 'IconButton', 'GradientButton', 'FloatButton', 'CopyButton']
  },
  {
    id: 'cards',
    title: 'Cards & Layout',
    icon: <LayoutColumnTwo20Regular />,
    description: 'Content containers and layout primitives',
    components: ['Card', 'ImageCard', 'StatCard', 'ProgressCard', 'Section', 'PageHeader']
  },
  {
    id: 'forms',
    title: 'Forms & Inputs',
    icon: <TextboxSettings20Regular />,
    description: 'Form controls and input elements',
    components: ['Input', 'Textarea', 'Select', 'Checkbox', 'Switch', 'Slider', 'DatePicker', 'ColorPicker', 'TagInput', 'NumberInput', 'OTPInput', 'PhoneInput', 'FileUpload']
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: <Navigation20Regular />,
    description: 'Navigation components and menus',
    components: ['Navbar', 'Tabs', 'Breadcrumbs', 'Pagination', 'Stepper', 'AppSidebar']
  },
  {
    id: 'overlays',
    title: 'Overlays & Modals',
    icon: <PanelRight20Regular />,
    description: 'Modals, dialogs, and floating elements',
    components: ['Modal', 'ConfirmDialog', 'Sheet', 'Dropdown', 'Tooltip', 'Popover', 'CommandBar']
  },
  {
    id: 'data-display',
    title: 'Data Display',
    icon: <Table20Regular />,
    description: 'Components for displaying data and content',
    components: ['Table', 'Badge', 'Avatar', 'Timeline', 'Accordion', 'CodeBlock', 'TreeView']
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: <AlertOn20Regular />,
    description: 'User feedback and loading states',
    components: ['Toast', 'Notification', 'Spinner', 'Skeleton', 'Banner', 'Alert']
  },
  {
    id: 'charts',
    title: 'Charts',
    icon: <DataPie20Regular />,
    description: 'Data visualization components',
    components: ['BarChart', 'LineChart', 'DonutChart', 'Sparkline', 'ProgressRing']
  },
  {
    id: 'media',
    title: 'Media',
    icon: <Video20Regular />,
    description: 'Image, video, and audio components',
    components: ['ImageGallery', 'Carousel', 'VideoPlayer', 'AudioPlayer', 'Lightbox']
  },
  {
    id: 'utilities',
    title: 'Utilities',
    icon: <Wrench20Regular />,
    description: 'Helper components and utilities',
    components: ['Divider', 'Watermark', 'Affix', 'Countdown', 'CopyText']
  }
]

export function ComponentsOverview() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filteredCategories = componentCategories.filter(cat => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      cat.title.toLowerCase().includes(searchLower) ||
      cat.components.some(c => c.toLowerCase().includes(searchLower))
    )
  })

  return (
    <VStack gap="xl">
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <Apps24Regular style={{ color: 'var(--brand-primary)', fontSize: 36 }} />
            <Heading level={1}>Components</Heading>
          </HStack>
          <Text size="lg" color="secondary">
            Explore over 100 production-ready components organized by category.
          </Text>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={100}>
        <div id="search">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search components..."
          />
        </div>
      </Animate>

      <Divider />

      <VStack gap="lg">
          <SectionHeading id="categories" level={2}>Categories</SectionHeading>
          <Stagger type="slideInUp" stagger={50}>
            {filteredCategories.map((category) => (
            <Card
              key={category.id}
              padding="lg"
              hoverable
              onClick={() => navigate(`/docs/components/${category.components[0].toLowerCase()}`)}
            >
              <HStack gap="lg" style={{ alignItems: 'flex-start' }}>
                <div style={{
                  color: 'var(--brand-primary)',
                  flexShrink: 0
                }}>
                  {category.icon}
                </div>
                <VStack gap="sm" style={{ flex: 1 }}>
                  <HStack gap="md" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Heading level={3}>{category.title}</Heading>
                    <Badge>{category.components.length} components</Badge>
                  </HStack>
                  <Text color="secondary">{category.description}</Text>
                  <HStack gap="xs" style={{ flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {category.components.slice(0, 5).map((comp) => (
                      <Badge key={comp} variant="default">
                        {comp}
                      </Badge>
                    ))}
                    {category.components.length > 5 && (
                      <Text size="sm" color="muted">
                        +{category.components.length - 5} more
                      </Text>
                    )}
                  </HStack>
                </VStack>
                <ArrowRight16Regular style={{ color: 'var(--text-muted)' }} />
              </HStack>
            </Card>
          ))}
        </Stagger>
      </VStack>
    </VStack>
  )
}
