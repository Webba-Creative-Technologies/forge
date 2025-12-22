import { useParams, useNavigate } from 'react-router-dom'
import { ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  StatCard,
  ImageCard,
  Grid,
  Button,
  IconButton,
  GradientButton,
  FloatButton,
  Badge,
  CodeBlock,
  Divider,
  Tabs,
  TabPanels,
  TabPanel,
  Table,
  Animate,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Slider,
  SearchInput,
  DatePicker,
  ColorPicker,
  TagInput,
  NumberInput,
  OTPInput,
  PhoneInput,
  FileUpload,
  Pagination,
  SimplePagination,
  Breadcrumbs,
  Stepper,
  Navbar,
  Modal,
  ConfirmDialog,
  Sheet,
  Dropdown,
  Tooltip,
  Popover,
  CommandBar,
  Avatar,
  AvatarStack,
  Accordion,
  AccordionItem,
  Timeline,
  TreeView,
  Calendar,
  MiniCalendar,
  Descriptions,
  StatusBadge,
  CountBadge,
  SimpleToast,
  Spinner,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonStatCard,
  Banner,
  AnnouncementBanner,
  Notification,
  useToast,
  useNotification,
  WebbaLoader,
  SplashScreen,
  LogoSplash,
  MinimalSplash,
  BrandedSplash,
  BarChart,
  GroupedBarChart,
  LineChart,
  MultiLineChart,
  Sparkline,
  DonutChart,
  ProgressRing,
  ImageGallery,
  ImagePreview,
  Carousel,
  ImageCarousel,
  VideoPlayer,
  AudioPlayer,
  MiniAudioPlayer,
  VerticalDivider,
  SectionDivider,
  Watermark,
  Highlight,
  TextTruncate,
  CopyText,
  CopyButton,
  Footer,
  SimpleFooter,
  CopyField,
  Countdown,
  Timer,
  Rating,
  RatingDisplay,
  Tour,
  useTour,
  TourTooltipStatic,
  Pills,
  PillTabs,
  ViewToggle
} from '../../../.forge'
import {
  Code20Regular,
  Eye20Regular,
  Document20Regular,
  Play20Regular,
  Add20Regular,
  Filter20Regular,
  DocumentText20Regular,
  Settings20Regular,
  Delete20Regular,
  Edit20Regular,
  Heart20Regular,
  Share20Regular,
  Bookmark20Regular,
  MoreHorizontal20Regular,
  Rocket20Regular,
  ArrowRight20Regular,
  People20Regular,
  Money20Regular,
  Cart20Regular,
  Eye20Filled,
  Copy20Regular,
  Search20Regular,
  Dismiss20Regular,
  Warning20Regular,
  Folder20Regular,
  Star20Regular,
  DocumentText20Filled,
  Grid20Regular,
  List20Regular
} from '@fluentui/react-icons'
import { SectionHeading } from '../../components/SectionHeading'

// Interactive preview components for Toast and Notification
function ToastPreview() {
  const { success, error, warning, info } = useToast()
  return (
    <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm" onClick={() => success('Success!', 'Your changes have been saved')}>
        Success Toast
      </Button>
      <Button variant="secondary" size="sm" onClick={() => error('Error!', 'Something went wrong')}>
        Error Toast
      </Button>
      <Button variant="secondary" size="sm" onClick={() => warning('Warning!', 'Please review your settings')}>
        Warning Toast
      </Button>
      <Button variant="secondary" size="sm" onClick={() => info('Info', 'New update available')}>
        Info Toast
      </Button>
    </HStack>
  )
}

function NotificationPreview() {
  const { notify } = useNotification()
  return (
    <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm" onClick={() => notify({
        type: 'success',
        title: 'Payment Received',
        message: 'Your payment of $99.00 has been processed',
        duration: 5000
      })}>
        Success
      </Button>
      <Button variant="secondary" size="sm" onClick={() => notify({
        type: 'info',
        title: 'New Message',
        message: 'You have a new message from John',
        actions: [{ label: 'View', onClick: () => {} }],
        duration: 8000
      })}>
        With Action
      </Button>
      <Button variant="secondary" size="sm" onClick={() => notify({
        type: 'warning',
        title: 'Storage Warning',
        message: 'Your storage is almost full (90%)',
        duration: null
      })}>
        Persistent
      </Button>
      <Button variant="secondary" size="sm" onClick={() => notify({
        type: 'error',
        title: 'Connection Lost',
        message: 'Please check your internet connection',
        duration: 6000
      })}>
        Error
      </Button>
    </HStack>
  )
}

function SplashScreenPreview() {
  const [showSplash, setShowSplash] = useState<'default' | 'logo' | 'minimal' | 'branded' | null>(null)
  return (
    <>
      <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
        <Button variant="primary" size="sm" onClick={() => setShowSplash('default')}>
          Default Splash
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setShowSplash('logo')}>
          Logo Splash
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setShowSplash('minimal')}>
          Minimal Splash
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setShowSplash('branded')}>
          Branded Splash
        </Button>
      </HStack>
      {createPortal(
        <>
          <SplashScreen
            visible={showSplash === 'default'}
            variant="powered-by"
            brandName="Webba"
            duration={2500}
            onComplete={() => setShowSplash(null)}
          />
          <LogoSplash
            visible={showSplash === 'logo'}
            loadingCycles={1}
            holdTime={1500}
            onComplete={() => setShowSplash(null)}
          />
          <MinimalSplash
            visible={showSplash === 'minimal'}
            text="Loading..."
            duration={2000}
            onComplete={() => setShowSplash(null)}
          />
          <BrandedSplash
            visible={showSplash === 'branded'}
            logo={<WebbaLoader size={64} />}
            appName="My App"
            tagline="Your productivity assistant"
            version="v1.0.0"
            duration={3000}
            onComplete={() => setShowSplash(null)}
          />
        </>,
        document.body
      )}
    </>
  )
}

// Component data for documentation
const componentDocs: Record<string, {
  name: string
  description: string
  importCode: string
  basicUsage: string
  usage: string[]
  props: { name: string; type: string; default: string; description: string }[]
  examples: { title: string; code: string; render: ReactNode }[]
}> = {
  button: {
    name: 'Button',
    description: 'Buttons trigger actions and events. Use the variant prop to change the visual style.',
    importCode: `import { Button } from 'wss3-forge'`,
    basicUsage: `<Button variant="primary">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>`,
    usage: [
      'Use primary buttons for main actions like "Save", "Submit", "Confirm"',
      'Use secondary buttons for less important actions',
      'Use ghost buttons for tertiary actions or in toolbars',
      'Use danger buttons for destructive actions like "Delete"',
      'Add icons to improve visual recognition of actions'
    ],
    props: [
      { name: 'variant', type: '"primary" | "secondary" | "ghost" | "danger"', default: '"primary"', description: 'Visual style of the button' },
      { name: 'size', type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: 'Size of the button' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Button takes full width' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Icon to display before text' },
      { name: 'iconRight', type: 'ReactNode', default: '-', description: 'Icon to display after text' }
    ],
    examples: [
      {
        title: 'With Icon',
        code: `<Button icon={<Add20Regular />}>Add Item</Button>`,
        render: <Button icon={<Add20Regular />}>Add Item</Button>
      },
      {
        title: 'Loading State',
        code: `<Button loading>Saving...</Button>`,
        render: <Button loading>Saving...</Button>
      },
      {
        title: 'Full Width',
        code: `<Button fullWidth>Submit Form</Button>`,
        render: <Button fullWidth>Submit Form</Button>
      },
      {
        title: 'Different Sizes',
        code: `<HStack gap="sm">
  <Button size="xs">Extra Small</Button>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</HStack>`,
        render: (
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </HStack>
        )
      },
      {
        title: 'Disabled State',
        code: `<Button disabled>Disabled Button</Button>`,
        render: <Button disabled>Disabled Button</Button>
      },
      {
        title: 'Button Group',
        code: `<HStack gap="sm">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</HStack>`,
        render: (
          <HStack gap="sm">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save</Button>
          </HStack>
        )
      }
    ]
  },
  iconbutton: {
    name: 'IconButton',
    description: 'A button that displays only an icon. Perfect for toolbars, action menus, and compact UI elements.',
    importCode: `import { IconButton } from 'wss3-forge'`,
    basicUsage: `<IconButton icon={<Settings20Regular />} />
<IconButton icon={<Delete20Regular />} variant="danger" />
<IconButton icon={<Edit20Regular />} variant="subtle" />`,
    usage: [
      'Use for actions where the icon is self-explanatory',
      'Always add a title/tooltip for accessibility',
      'Use ghost variant for minimal visual weight',
      'Use subtle variant when button needs a background',
      'Use danger variant for destructive actions'
    ],
    props: [
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Icon to display (required)' },
      { name: 'size', type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: 'Size of the button' },
      { name: 'variant', type: '"ghost" | "subtle" | "danger" | "inverted"', default: '"ghost"', description: 'Visual style' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' }
    ],
    examples: [
      {
        title: 'Variants',
        code: `<HStack gap="sm">
  <IconButton icon={<Settings20Regular />} variant="ghost" title="Settings" />
  <IconButton icon={<Edit20Regular />} variant="subtle" title="Edit" />
  <IconButton icon={<Delete20Regular />} variant="danger" title="Delete" />
</HStack>`,
        render: (
          <HStack gap="sm">
            <IconButton icon={<Settings20Regular />} variant="ghost" title="Settings" />
            <IconButton icon={<Edit20Regular />} variant="subtle" title="Edit" />
            <IconButton icon={<Delete20Regular />} variant="danger" title="Delete" />
          </HStack>
        )
      },
      {
        title: 'Sizes',
        code: `<HStack gap="sm" style={{ alignItems: 'center' }}>
  <IconButton icon={<Heart20Regular />} size="xs" title="Like" />
  <IconButton icon={<Heart20Regular />} size="sm" title="Like" />
  <IconButton icon={<Heart20Regular />} size="md" title="Like" />
  <IconButton icon={<Heart20Regular />} size="lg" title="Like" />
</HStack>`,
        render: (
          <HStack gap="sm" style={{ alignItems: 'center' }}>
            <IconButton icon={<Heart20Regular />} size="xs" title="Like" />
            <IconButton icon={<Heart20Regular />} size="sm" title="Like" />
            <IconButton icon={<Heart20Regular />} size="md" title="Like" />
            <IconButton icon={<Heart20Regular />} size="lg" title="Like" />
          </HStack>
        )
      },
      {
        title: 'Toolbar Example',
        code: `<Card padding="sm">
  <HStack gap="xs">
    <IconButton icon={<Edit20Regular />} variant="ghost" title="Edit" />
    <IconButton icon={<Share20Regular />} variant="ghost" title="Share" />
    <IconButton icon={<Bookmark20Regular />} variant="ghost" title="Bookmark" />
    <IconButton icon={<MoreHorizontal20Regular />} variant="ghost" title="More" />
  </HStack>
</Card>`,
        render: (
          <Card padding="sm">
            <HStack gap="xs">
              <IconButton icon={<Edit20Regular />} variant="ghost" title="Edit" />
              <IconButton icon={<Share20Regular />} variant="ghost" title="Share" />
              <IconButton icon={<Bookmark20Regular />} variant="ghost" title="Bookmark" />
              <IconButton icon={<MoreHorizontal20Regular />} variant="ghost" title="More" />
            </HStack>
          </Card>
        )
      },
      {
        title: 'Disabled State',
        code: `<IconButton icon={<Delete20Regular />} disabled title="Delete" />`,
        render: <IconButton icon={<Delete20Regular />} disabled title="Delete" />
      }
    ]
  },
  gradientbutton: {
    name: 'GradientButton',
    description: 'A premium button with gradient background. Use for important CTAs and hero sections.',
    importCode: `import { GradientButton } from 'wss3-forge'`,
    basicUsage: `<GradientButton>Get Started</GradientButton>
<GradientButton icon={<Rocket20Regular />}>Launch</GradientButton>`,
    usage: [
      'Use sparingly for primary call-to-action buttons',
      'Great for hero sections and landing pages',
      'Avoid using multiple gradient buttons in the same view',
      'The gradient uses brand colors for consistency'
    ],
    props: [
      { name: 'size', type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: 'Size of the button' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Icon to display before text' },
      { name: 'iconRight', type: 'ReactNode', default: '-', description: 'Icon to display after text' }
    ],
    examples: [
      {
        title: 'With Icon',
        code: `<GradientButton icon={<Rocket20Regular />}>
  Launch Project
</GradientButton>`,
        render: <GradientButton icon={<Rocket20Regular />}>Launch Project</GradientButton>
      },
      {
        title: 'Icon on Right',
        code: `<GradientButton iconRight={<ArrowRight20Regular />}>
  Get Started
</GradientButton>`,
        render: <GradientButton iconRight={<ArrowRight20Regular />}>Get Started</GradientButton>
      },
      {
        title: 'Different Sizes',
        code: `<HStack gap="sm" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
  <GradientButton size="xs">Extra Small</GradientButton>
  <GradientButton size="sm">Small</GradientButton>
  <GradientButton size="md">Medium</GradientButton>
  <GradientButton size="lg">Large</GradientButton>
</HStack>`,
        render: (
          <HStack gap="sm" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <GradientButton size="xs">Extra Small</GradientButton>
            <GradientButton size="sm">Small</GradientButton>
            <GradientButton size="md">Medium</GradientButton>
            <GradientButton size="lg">Large</GradientButton>
          </HStack>
        )
      },
      {
        title: 'Loading State',
        code: `<GradientButton loading>Processing...</GradientButton>`,
        render: <GradientButton loading>Processing...</GradientButton>
      },
      {
        title: 'Disabled State',
        code: `<GradientButton disabled>Unavailable</GradientButton>`,
        render: <GradientButton disabled>Unavailable</GradientButton>
      },
      {
        title: 'Hero Section Example',
        code: `<VStack gap="md" style={{ alignItems: 'center', padding: '2rem' }}>
  <Heading level={2}>Start Building Today</Heading>
  <Text color="secondary">Join thousands of developers using Forge</Text>
  <HStack gap="md">
    <GradientButton size="lg" icon={<Rocket20Regular />}>
      Get Started Free
    </GradientButton>
    <Button variant="secondary" size="lg">
      View Documentation
    </Button>
  </HStack>
</VStack>`,
        render: (
          <VStack gap="md" style={{ alignItems: 'center', padding: '2rem' }}>
            <Heading level={2}>Start Building Today</Heading>
            <Text color="secondary">Join thousands of developers using Forge</Text>
            <HStack gap="md" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              <GradientButton size="lg" icon={<Rocket20Regular />}>
                Get Started Free
              </GradientButton>
              <Button variant="secondary" size="lg">
                View Documentation
              </Button>
            </HStack>
          </VStack>
        )
      }
    ]
  },
  card: {
    name: 'Card',
    description: 'Cards are containers for content and actions. Use different variants and padding sizes.',
    importCode: `import { Card } from 'wss3-forge'`,
    basicUsage: `<Card>Basic card content</Card>
<Card padding="lg">With more padding</Card>
<Card variant="subtle">Subtle variant</Card>
<Card hoverable onClick={handleClick}>Clickable</Card>`,
    usage: [
      'Use cards to group related content together',
      'Use subtle variant for nested cards or less prominent sections',
      'Add hoverable prop for interactive cards that navigate somewhere',
      'Use title and subtitle props for consistent header styling'
    ],
    props: [
      { name: 'variant', type: '"default" | "subtle" | "outlined"', default: '"default"', description: 'Visual style' },
      { name: 'padding', type: '"none" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Internal padding' },
      { name: 'hoverable', type: 'boolean', default: 'false', description: 'Adds hover effect' },
      { name: 'title', type: 'string', default: '-', description: 'Card title' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Card subtitle' },
      { name: 'action', type: '{ label: string; onClick: () => void }', default: '-', description: 'Action button' }
    ],
    examples: [
      {
        title: 'With Title and Action',
        code: `<Card
  title="My Card"
  subtitle="Description"
  action={{ label: 'View all', onClick: () => {} }}
>
  Content here
</Card>`,
        render: (
          <Card
            title="My Card"
            subtitle="Description"
            action={{ label: 'View all', onClick: () => {} }}
          >
            Content here
          </Card>
        )
      },
      {
        title: 'Hoverable Card',
        code: `<Card hoverable onClick={() => console.log('clicked')}>
  Click me!
</Card>`,
        render: (
          <Card hoverable onClick={() => console.log('clicked')}>
            Click me!
          </Card>
        )
      },
      {
        title: 'Subtle Variant',
        code: `<Card variant="subtle" padding="lg">
  Subtle background for nested content
</Card>`,
        render: (
          <Card variant="subtle" padding="lg">
            Subtle background for nested content
          </Card>
        )
      }
    ]
  },
  statcard: {
    name: 'StatCard',
    description: 'Display key metrics and statistics with optional trend indicators.',
    importCode: `import { StatCard } from 'wss3-forge'`,
    basicUsage: `<StatCard
  icon={<People20Regular />}
  label="Total Users"
  value="1,234"
  color="var(--brand-primary)"
  change={12.5}
  changeLabel="vs last month"
/>`,
    usage: [
      'Use for dashboard metrics and KPIs',
      'Include change percentage to show trends',
      'Color code icons to match the metric meaning',
      'Keep labels short and descriptive'
    ],
    props: [
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Icon representing the metric' },
      { name: 'label', type: 'string', default: '-', description: 'Metric label' },
      { name: 'value', type: 'string | number', default: '-', description: 'Metric value' },
      { name: 'color', type: 'string', default: '-', description: 'Icon/accent color' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Additional context' },
      { name: 'change', type: 'number', default: '-', description: 'Percentage change (shows trend)' },
      { name: 'changeLabel', type: 'string', default: '-', description: 'Label for the change' },
      { name: 'onClick', type: '() => void', default: '-', description: 'Click handler' }
    ],
    examples: [
      {
        title: 'With Positive Trend',
        code: `<StatCard
  icon={<People20Regular />}
  label="Total Users"
  value="1,234"
  color="var(--brand-primary)"
  change={12.5}
  changeLabel="vs last month"
/>`,
        render: (
          <StatCard
            icon={<People20Regular />}
            label="Total Users"
            value="1,234"
            color="var(--brand-primary)"
            change={12.5}
            changeLabel="vs last month"
          />
        )
      },
      {
        title: 'With Negative Trend',
        code: `<StatCard
  icon={<Cart20Regular />}
  label="Orders"
  value="856"
  color="var(--color-warning)"
  change={-5.2}
  changeLabel="vs last week"
/>`,
        render: (
          <StatCard
            icon={<Cart20Regular />}
            label="Orders"
            value="856"
            color="var(--color-warning)"
            change={-5.2}
            changeLabel="vs last week"
          />
        )
      },
      {
        title: 'Dashboard Grid',
        code: `<Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
  <StatCard icon={<People20Regular />} label="Users" value="1,234" color="var(--brand-primary)" change={12.5} />
  <StatCard icon={<Money20Regular />} label="Revenue" value="$45,678" color="var(--color-success)" change={8.3} />
  <StatCard icon={<Cart20Regular />} label="Orders" value="856" color="var(--color-warning)" change={-2.1} />
  <StatCard icon={<Eye20Filled />} label="Views" value="12.4K" color="var(--color-info)" change={15.7} />
</Grid>`,
        render: (
          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            <StatCard icon={<People20Regular />} label="Users" value="1,234" color="var(--brand-primary)" change={12.5} />
            <StatCard icon={<Money20Regular />} label="Revenue" value="$45,678" color="var(--color-success)" change={8.3} />
            <StatCard icon={<Cart20Regular />} label="Orders" value="856" color="var(--color-warning)" change={-2.1} />
            <StatCard icon={<Eye20Filled />} label="Views" value="12.4K" color="var(--color-info)" change={15.7} />
          </Grid>
        )
      }
    ]
  },
  imagecard: {
    name: 'ImageCard',
    description: 'Card with an image header. Perfect for product cards, blog posts, and media content.',
    importCode: `import { ImageCard } from 'wss3-forge'`,
    basicUsage: `<ImageCard
  image="/path/to/image.jpg"
  title="Product Name"
  subtitle="$99.00"
  description="A brief description of the product"
  onClick={() => navigate('/product')}
/>`,
    usage: [
      'Use for content that is visually represented by an image',
      'Keep title short, use description for details',
      'Add badge for status indicators (new, sale, etc.)',
      'Image height can be customized'
    ],
    props: [
      { name: 'image', type: 'string', default: '-', description: 'Image URL' },
      { name: 'imageAlt', type: 'string', default: '-', description: 'Image alt text' },
      { name: 'imageHeight', type: 'number', default: '160', description: 'Image height in pixels' },
      { name: 'title', type: 'string', default: '-', description: 'Card title' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Card subtitle' },
      { name: 'description', type: 'string', default: '-', description: 'Card description' },
      { name: 'badge', type: 'ReactNode', default: '-', description: 'Badge overlay on image' },
      { name: 'actions', type: 'ReactNode', default: '-', description: 'Action buttons' },
      { name: 'onClick', type: '() => void', default: '-', description: 'Click handler' }
    ],
    examples: [
      {
        title: 'Basic Product Card',
        code: `<ImageCard
  image="https://picsum.photos/400/200"
  title="Premium Headphones"
  subtitle="$299.00"
  description="High-quality wireless headphones with noise cancellation"
/>`,
        render: (
          <ImageCard
            image="https://picsum.photos/400/200?random=1"
            title="Premium Headphones"
            subtitle="$299.00"
            description="High-quality wireless headphones with noise cancellation"
          />
        )
      },
      {
        title: 'With Badge',
        code: `<ImageCard
  image="https://picsum.photos/400/200"
  title="Limited Edition"
  subtitle="$199.00"
  badge={<Badge variant="success">New</Badge>}
  description="Exclusive limited edition product"
/>`,
        render: (
          <ImageCard
            image="https://picsum.photos/400/200?random=2"
            title="Limited Edition"
            subtitle="$199.00"
            badge={<Badge variant="success">New</Badge>}
            description="Exclusive limited edition product"
          />
        )
      },
      {
        title: 'With Actions',
        code: `<ImageCard
  image="https://picsum.photos/400/200"
  title="Blog Post Title"
  subtitle="5 min read"
  description="An interesting article about web development"
  actions={
    <HStack gap="sm">
      <Button size="sm" variant="primary">Read More</Button>
      <IconButton icon={<Bookmark20Regular />} variant="ghost" />
    </HStack>
  }
/>`,
        render: (
          <ImageCard
            image="https://picsum.photos/400/200?random=3"
            title="Blog Post Title"
            subtitle="5 min read"
            description="An interesting article about web development"
            actions={
              <HStack gap="sm">
                <Button size="sm" variant="primary">Read More</Button>
                <IconButton icon={<Bookmark20Regular />} variant="ghost" />
              </HStack>
            }
          />
        )
      },
      {
        title: 'Product Grid',
        code: `<Grid columns={{ xs: 1, sm: 2, md: 3 }} gap="md">
  <ImageCard image="..." title="Product 1" subtitle="$99" />
  <ImageCard image="..." title="Product 2" subtitle="$149" badge={<Badge variant="error">Sale</Badge>} />
  <ImageCard image="..." title="Product 3" subtitle="$199" />
</Grid>`,
        render: (
          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            <ImageCard image="https://picsum.photos/400/200?random=4" title="Product 1" subtitle="$99.00" />
            <ImageCard image="https://picsum.photos/400/200?random=5" title="Product 2" subtitle="$149.00" badge={<Badge variant="error">Sale</Badge>} />
          </Grid>
        )
      }
    ]
  },
  input: {
    name: 'Input',
    description: 'Text input for forms. Supports icons, error states, and various input types.',
    importCode: `import { Input } from 'wss3-forge'`,
    basicUsage: `<Input placeholder="Enter text..." />
<Input label="Email" error="Invalid email" required />`,
    usage: [
      'Always use labels for accessibility',
      'Show error messages below the input when validation fails',
      'Use appropriate input types (email, password, number, etc.)',
      'Add icons to provide visual context'
    ],
    props: [
      { name: 'type', type: 'string', default: '"text"', description: 'Input type' },
      { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Left icon' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'error', type: 'string', default: '-', description: 'Error message' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables input' }
    ],
    examples: [
      {
        title: 'With Label and Error',
        code: `<Input
  label="Email"
  type="email"
  error="Invalid email address"
  required
/>`,
        render: (
          <Input
            label="Email"
            type="email"
            error="Invalid email address"
            required
          />
        )
      },
      {
        title: 'Basic Input',
        code: `<Input placeholder="Enter your name..." />`,
        render: <Input placeholder="Enter your name..." />
      },
      {
        title: 'Disabled Input',
        code: `<Input label="Disabled" value="Cannot edit" disabled />`,
        render: <Input label="Disabled" value="Cannot edit" disabled />
      }
    ]
  },
  switch: {
    name: 'Switch',
    description: 'Toggle switch for boolean settings. Use instead of checkboxes for immediate effect settings.',
    importCode: `import { Switch } from 'wss3-forge'`,
    basicUsage: `<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
/>`,
    usage: [
      'Use for settings that take effect immediately',
      'Use checkboxes instead for form submissions',
      'Add description for complex settings',
      'Group related switches with SwitchGroup'
    ],
    props: [
      { name: 'checked', type: 'boolean', default: '-', description: 'Controlled state' },
      { name: 'onChange', type: '(checked: boolean) => void', default: '-', description: 'Change handler' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'description', type: 'string', default: '-', description: 'Helper description' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Switch size' }
    ],
    examples: [
      {
        title: 'Basic Switch',
        code: `<Switch label="Enable notifications" checked={enabled} onChange={setEnabled} />`,
        render: <Switch label="Enable notifications" checked={false} onChange={() => {}} />
      },
      {
        title: 'With Description',
        code: `<Switch
  label="Dark mode"
  description="Enable dark theme"
  checked={darkMode}
  onChange={setDarkMode}
/>`,
        render: <Switch label="Dark mode" description="Enable dark theme across the application" checked={true} onChange={() => {}} />
      },
      {
        title: 'Sizes',
        code: `<VStack gap="md">
  <Switch size="sm" label="Small" checked={...} onChange={...} />
  <Switch size="md" label="Medium" checked={...} onChange={...} />
  <Switch size="lg" label="Large" checked={...} onChange={...} />
</VStack>`,
        render: (
          <VStack gap="md">
            <Switch size="sm" label="Small" checked={false} onChange={() => {}} />
            <Switch size="md" label="Medium (default)" checked={true} onChange={() => {}} />
            <Switch size="lg" label="Large" checked={false} onChange={() => {}} />
          </VStack>
        )
      },
      {
        title: 'Settings Panel',
        code: `<Card padding="lg">
  <VStack gap="lg">
    <Switch label="Email" checked={email} onChange={setEmail} />
    <Switch label="Push" checked={push} onChange={setPush} />
    <Switch label="Marketing" checked={false} onChange={() => {}} disabled />
  </VStack>
</Card>`,
        render: (
          <Card padding="lg" style={{ width: '100%' }}>
            <VStack gap="lg">
              <Switch label="Email notifications" description="Receive email updates" checked={true} onChange={() => {}} />
              <Switch label="Push notifications" description="Receive push alerts" checked={false} onChange={() => {}} />
              <Switch label="Marketing emails" checked={false} onChange={() => {}} disabled />
            </VStack>
          </Card>
        )
      }
    ]
  },
  slider: {
    name: 'Slider',
    description: 'Range slider for selecting numeric values. Supports marks, tooltips, and custom formatting.',
    importCode: `import { Slider, RangeSlider } from 'wss3-forge'`,
    basicUsage: `<Slider
  value={50}
  onChange={setValue}
  min={0}
  max={100}
  label="Volume"
/>`,
    usage: [
      'Use for numeric values within a range',
      'Add marks for predefined stops',
      'Use formatValue for custom display (%, €, etc.)',
      'RangeSlider for selecting a range'
    ],
    props: [
      { name: 'value', type: 'number', default: '-', description: 'Current value' },
      { name: 'onChange', type: '(value: number) => void', default: '-', description: 'Change handler' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
      { name: 'step', type: 'number', default: '1', description: 'Step increment' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'showValue', type: 'boolean', default: 'true', description: 'Show current value' },
      { name: 'formatValue', type: '(value: number) => string', default: '-', description: 'Value formatter' },
      { name: 'marks', type: '{ value: number; label?: string }[]', default: '-', description: 'Mark points' },
      { name: 'showTooltip', type: 'boolean | "always"', default: 'true', description: 'Show value tooltip' },
      { name: 'size', type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Slider size' },
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Accent color' }
    ],
    examples: [
      {
        title: 'Basic Slider',
        code: `<Slider label="Volume" value={volume} onChange={setVolume} />`,
        render: <Slider label="Volume" value={50} onChange={() => {}} />
      },
      {
        title: 'With Custom Range',
        code: `<Slider
  label="Price"
  min={0}
  max={1000}
  step={50}
  value={price}
  onChange={setPrice}
  formatValue={(v) => \`$\${v}\`}
/>`,
        render: <Slider label="Price" min={0} max={1000} step={50} value={500} onChange={() => {}} formatValue={(v) => `$${v}`} />
      },
      {
        title: 'Sizes',
        code: `<VStack gap="lg">
  <Slider size="sm" label="Small" value={30} onChange={...} />
  <Slider size="md" label="Medium" value={50} onChange={...} />
  <Slider size="lg" label="Large" value={70} onChange={...} />
</VStack>`,
        render: (
          <VStack gap="lg" style={{ width: '100%' }}>
            <Slider size="sm" label="Small" value={30} onChange={() => {}} />
            <Slider size="md" label="Medium" value={50} onChange={() => {}} />
            <Slider size="lg" label="Large" value={70} onChange={() => {}} />
          </VStack>
        )
      },
      {
        title: 'Custom Color',
        code: `<Slider
  label="Progress"
  value={progress}
  onChange={setProgress}
  color="var(--color-success)"
/>`,
        render: <Slider label="Progress" value={75} onChange={() => {}} color="var(--color-success)" />
      }
    ]
  },
  badge: {
    name: 'Badge',
    description: 'Small labels for status, counts, and categories. Supports multiple variants and removable state.',
    importCode: `import { Badge, StatusBadge, PriorityBadge, CountBadge } from 'wss3-forge'`,
    basicUsage: `<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning" dot>Warning</Badge>
<Badge onRemove={() => {}}>Removable</Badge>`,
    usage: [
      'Use for status indicators and labels',
      'Add dot prop for status indicators',
      'Use semantic variants (success, error, warning)',
      'StatusBadge for predefined status types',
      'CountBadge for notification counts'
    ],
    props: [
      { name: 'variant', type: '"default" | "primary" | "success" | "warning" | "error" | "info"', default: '"default"', description: 'Visual style' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Badge size' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Show status dot' },
      { name: 'onRemove', type: '() => void', default: '-', description: 'Makes badge removable' },
      { name: 'onClick', type: '() => void', default: '-', description: 'Click handler' }
    ],
    examples: [
      {
        title: 'Variants',
        code: `<HStack gap="sm">
  <Badge>Default</Badge>
  <Badge variant="primary">Primary</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
  <Badge variant="info">Info</Badge>
</HStack>`,
        render: (
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </HStack>
        )
      },
      {
        title: 'With Dot Indicator',
        code: `<HStack gap="sm">
  <Badge dot variant="success">Online</Badge>
  <Badge dot variant="warning">Away</Badge>
  <Badge dot variant="error">Busy</Badge>
</HStack>`,
        render: (
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <Badge dot variant="success">Online</Badge>
            <Badge dot variant="warning">Away</Badge>
            <Badge dot variant="error">Busy</Badge>
          </HStack>
        )
      },
      {
        title: 'Status Badges',
        code: `<HStack gap="sm">
  <StatusBadge status="active" />
  <StatusBadge status="pending" />
  <StatusBadge status="completed" />
  <StatusBadge status="error" />
</HStack>`,
        render: (
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <StatusBadge status="active" />
            <StatusBadge status="pending" />
            <StatusBadge status="completed" />
            <StatusBadge status="error" />
          </HStack>
        )
      },
      {
        title: 'Count Badges',
        code: `<HStack gap="md">
  <CountBadge count={5} />
  <CountBadge count={99} />
  <CountBadge count={150} max={99} />
</HStack>`,
        render: (
          <HStack gap="md">
            <CountBadge count={5} />
            <CountBadge count={99} />
            <CountBadge count={150} max={99} />
          </HStack>
        )
      },
      {
        title: 'Removable Badges',
        code: `<HStack gap="sm">
  <Badge onRemove={() => console.log('removed')}>React</Badge>
  <Badge variant="primary" onRemove={() => {}}>TypeScript</Badge>
  <Badge variant="success" onRemove={() => {}}>Vite</Badge>
</HStack>`,
        render: (
          <HStack gap="sm" style={{ flexWrap: 'wrap' }}>
            <Badge onRemove={() => {}}>React</Badge>
            <Badge variant="primary" onRemove={() => {}}>TypeScript</Badge>
            <Badge variant="success" onRemove={() => {}}>Vite</Badge>
          </HStack>
        )
      }
    ]
  },
  tabs: {
    name: 'Tabs',
    description: 'Navigation tabs with sliding indicator. Use for switching between related content views.',
    importCode: `import { Tabs, TabPanels, TabPanel } from 'wss3-forge'`,
    basicUsage: `<Tabs
  tabs={[
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Details' },
    { id: 'tab3', label: 'Settings' }
  ]}
  active={activeTab}
  onChange={setActiveTab}
/>

<TabPanels active={activeTab}>
  <TabPanel id="tab1" active={activeTab}>Overview content</TabPanel>
  <TabPanel id="tab2" active={activeTab}>Details content</TabPanel>
  <TabPanel id="tab3" active={activeTab}>Settings content</TabPanel>
</TabPanels>`,
    usage: [
      'Use underline variant for page-level navigation',
      'Use pills variant for compact sections',
      'Add icons for visual recognition',
      'Use count for notification indicators',
      'fullWidth distributes tabs evenly'
    ],
    props: [
      { name: 'tabs', type: 'Tab[]', default: '-', description: 'Array of tab definitions' },
      { name: 'active', type: 'string', default: '-', description: 'Active tab ID' },
      { name: 'onChange', type: '(tabId: string) => void', default: '-', description: 'Change handler' },
      { name: 'variant', type: '"default" | "pills" | "underline"', default: '"underline"', description: 'Tab style' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Tab size' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Tabs fill width equally' },
      { name: 'stretchLine', type: 'boolean', default: 'false', description: 'Indicator line stretches to full width' }
    ],
    examples: [
      {
        title: 'Underline Tabs with Stretch Line',
        code: `<Tabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' }
  ]}
  active="overview"
  onChange={setActiveTab}
  stretchLine
/>`,
        render: <Tabs tabs={[{ id: 'overview', label: 'Overview' }, { id: 'features', label: 'Features' }, { id: 'pricing', label: 'Pricing' }]} active="overview" onChange={() => {}} stretchLine />
      },
      {
        title: 'Pills Variant',
        code: `<Tabs
  tabs={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ]}
  active="all"
  onChange={setActiveTab}
  variant="pills"
/>`,
        render: <Tabs tabs={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' }, { id: 'completed', label: 'Completed' }]} active="all" onChange={() => {}} variant="pills" />
      },
      {
        title: 'Full Width',
        code: `<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' }
  ]}
  active="tab1"
  onChange={setActiveTab}
  fullWidth
  stretchLine
/>`,
        render: <Tabs tabs={[{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }, { id: 'tab3', label: 'Tab 3' }]} active="tab1" onChange={() => {}} fullWidth stretchLine />
      }
    ]
  },
  pills: {
    name: 'Pills',
    description: 'Filter pills and toggle components for compact selection. Includes Pills for filter selection, PillTabs for tab-like navigation, and ViewToggle for icon-based options.',
    importCode: `import { Pills, PillTabs, ViewToggle } from 'wss3-forge'`,
    basicUsage: `<Pills
  options={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active', count: 5 },
    { id: 'archived', label: 'Archived' }
  ]}
  selected="all"
  onChange={setSelected}
/>`,
    usage: [
      'Use Pills for filter selections with optional counts',
      'Use PillTabs for compact tab navigation with sliding indicator',
      'Use ViewToggle for icon-based view switches (grid/list)',
      'Pills support multiple selection with multiple prop',
      'All variants have smooth animated transitions'
    ],
    props: [
      { name: 'options', type: 'PillOption[]', default: '-', description: 'Array of pill options (id, label, count?)' },
      { name: 'selected', type: 'string | string[]', default: '-', description: 'Selected pill ID(s)' },
      { name: 'onChange', type: '(id: string) => void', default: '-', description: 'Selection change handler' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple selections (Pills only)' }
    ],
    examples: [
      {
        title: 'Filter Pills',
        code: `<Pills
  options={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active', count: 12 },
    { id: 'pending', label: 'Pending', count: 3 },
    { id: 'archived', label: 'Archived' }
  ]}
  selected="all"
  onChange={setFilter}
/>`,
        render: <Pills options={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active', count: 12 }, { id: 'pending', label: 'Pending', count: 3 }, { id: 'archived', label: 'Archived' }]} selected="all" onChange={() => {}} />
      },
      {
        title: 'PillTabs with Sliding Indicator',
        code: `<PillTabs
  tabs={[
    { value: 'overview', label: 'Overview' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'reports', label: 'Reports' },
    { value: 'settings', label: 'Settings' }
  ]}
  value="overview"
  onChange={setTab}
/>`,
        render: <PillTabs tabs={[{ value: 'overview', label: 'Overview' }, { value: 'analytics', label: 'Analytics' }, { value: 'reports', label: 'Reports' }, { value: 'settings', label: 'Settings' }]} value="overview" onChange={() => {}} />
      },
      {
        title: 'ViewToggle for Icons',
        code: `<ViewToggle
  options={[
    { value: 'grid', icon: <GridIcon />, label: 'Grid view' },
    { value: 'list', icon: <ListIcon />, label: 'List view' }
  ]}
  value="grid"
  onChange={setView}
/>`,
        render: <ViewToggle options={[{ value: 'grid', icon: <Grid20Regular />, label: 'Grid view' }, { value: 'list', icon: <List20Regular />, label: 'List view' }]} value="grid" onChange={() => {}} />
      }
    ]
  },
  table: {
    name: 'Table',
    description: 'Full-featured data table with sorting, filtering, pagination, and selection.',
    importCode: `import { Table, SimpleTable } from 'wss3-forge'`,
    basicUsage: `<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ]}
  searchable
  pagination
/>`,
    usage: [
      'Use for displaying tabular data',
      'Enable searchable for data filtering',
      'Add pagination for large datasets',
      'Use render prop for custom cell content',
      'SimpleTable for basic static tables'
    ],
    props: [
      { name: 'data', type: 'T[]', default: '-', description: 'Array of data objects' },
      { name: 'columns', type: 'TableColumn<T>[]', default: '-', description: 'Column definitions' },
      { name: 'title', type: 'string', default: '-', description: 'Table header title' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Table header subtitle' },
      { name: 'searchable', type: 'boolean', default: 'true', description: 'Enable search' },
      { name: 'pagination', type: 'boolean', default: 'true', description: 'Enable pagination' },
      { name: 'pageSize', type: 'number', default: '10', description: 'Rows per page' },
      { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row selection' },
      { name: 'sortable', type: 'boolean', default: 'true', description: 'Enable sorting' },
      { name: 'striped', type: 'boolean', default: 'false', description: 'Striped rows' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Compact row height' },
      { name: 'noPadding', type: 'boolean', default: 'false', description: 'Remove all padding around table' },
      { name: 'globalActions', type: 'ReactNode', default: '-', description: 'Action buttons displayed in header (right side)' },
      { name: 'onRowClick', type: '(row: T) => void', default: '-', description: 'Row click handler' }
    ],
    examples: [
      {
        title: 'Basic Table',
        code: `<Table
  data={[
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
  ]}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ]}
  pagination={false}
  searchable={false}
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' }
            ]}
            pagination={false}
            searchable={false}
          />
        )
      },
      {
        title: 'With Title & Subtitle',
        code: `<Table
  title="Team Members"
  subtitle="Manage your team access and roles"
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ]}
  searchable
  pagination={false}
/>`,
        render: (
          <Table
            title="Team Members"
            subtitle="Manage your team access and roles"
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' }
            ]}
            searchable
            pagination={false}
          />
        )
      },
      {
        title: 'With Global Actions',
        code: `<Table
  title="Users"
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' }
  ]}
  globalActions={
    <>
      <Button variant="ghost" size="sm" icon={<Filter20Regular />}>Filter</Button>
      <Button variant="primary" size="sm" icon={<Add20Regular />}>Add User</Button>
    </>
  }
  searchable
  pagination={false}
/>`,
        render: (
          <Table
            title="Users"
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' }
            ]}
            globalActions={
              <>
                <Button variant="ghost" size="sm" icon={<Filter20Regular />}>Filter</Button>
                <Button variant="primary" size="sm" icon={<Add20Regular />}>Add User</Button>
              </>
            }
            searchable
            pagination={false}
          />
        )
      },
      {
        title: 'With Custom Cell Render',
        code: `<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', render: (row) => (
      <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
        {row.status}
      </Badge>
    )}
  ]}
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'John Doe', status: 'Active' },
              { id: 2, name: 'Jane Smith', status: 'Inactive' },
              { id: 3, name: 'Bob Wilson', status: 'Active' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'status', header: 'Status', render: (value: string) => (
                <Badge variant={value === 'Active' ? 'success' : 'default'}>
                  {value}
                </Badge>
              )}
            ]}
            pagination={false}
            searchable={false}
          />
        )
      },
      {
        title: 'Striped & Compact',
        code: `<Table
  data={users}
  columns={columns}
  striped
  compact
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'Alice', email: 'alice@example.com' },
              { id: 2, name: 'Bob', email: 'bob@example.com' },
              { id: 3, name: 'Charlie', email: 'charlie@example.com' },
              { id: 4, name: 'Diana', email: 'diana@example.com' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' }
            ]}
            striped
            compact
            pagination={false}
            searchable={false}
          />
        )
      },
      {
        title: 'With Search',
        code: `<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ]}
  searchable
  pagination={false}
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' },
              { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
              { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' }
            ]}
            searchable
            pagination={false}
          />
        )
      },
      {
        title: 'With Pagination',
        code: `<Table
  data={users}
  columns={columns}
  pagination
  pageSize={3}
  searchable={false}
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
              { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
              { id: 5, name: 'Charlie Davis', email: 'charlie@example.com' },
              { id: 6, name: 'Diana Miller', email: 'diana@example.com' },
              { id: 7, name: 'Eve Johnson', email: 'eve@example.com' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' }
            ]}
            pagination
            pageSize={3}
            searchable={false}
          />
        )
      },
      {
        title: 'Full Featured',
        code: `<Table
  data={users}
  columns={columns}
  searchable
  pagination
  pageSize={5}
  sortable
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' },
              { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
              { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer' },
              { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'Admin' },
              { id: 7, name: 'Eve Johnson', email: 'eve@example.com', role: 'User' },
              { id: 8, name: 'Frank White', email: 'frank@example.com', role: 'Editor' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' }
            ]}
            searchable
            pagination
            pageSize={5}
            sortable
          />
        )
      },
      {
        title: 'With Actions',
        code: `<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (row) => (
      <Badge variant={row.role === 'Admin' ? 'primary' : 'default'}>{row.role}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: () => (
      <HStack gap="xs">
        <IconButton icon={<Edit20Regular />} size="sm" variant="ghost" />
        <IconButton icon={<Delete20Regular />} size="sm" variant="danger" />
      </HStack>
    )}
  ]}
/>`,
        render: (
          <Table
              data={[
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
                { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
              ]}
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'role', header: 'Role', render: (value: string) => (
                  <Badge variant={value === 'Admin' ? 'primary' : value === 'Editor' ? 'warning' : 'default'}>{value}</Badge>
                )},
                { key: 'actions', header: 'Actions', render: () => (
                  <HStack gap="xs">
                    <IconButton icon={<Edit20Regular />} size="sm" variant="ghost" title="Edit" />
                    <IconButton icon={<Delete20Regular />} size="sm" variant="danger" title="Delete" />
                  </HStack>
                )}
              ]}
              pagination={false}
              searchable={false}
            />
        )
      },
      {
        title: 'No Padding',
        code: `<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ]}
  noPadding
  pagination={false}
  searchable={false}
/>`,
        render: (
          <Table
            data={[
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
              { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
            ]}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' }
            ]}
            noPadding
            pagination={false}
            searchable={false}
          />
        )
      }
    ]
  },
  tooltip: {
    name: 'Tooltip',
    description: 'Display additional information on hover. Use for explaining icons and providing context.',
    importCode: `import { Tooltip, InfoTooltip } from 'wss3-forge'`,
    basicUsage: `<Tooltip content="This is helpful information">
  <Button>Hover me</Button>
</Tooltip>

<InfoTooltip content="Explanation of this field" />`,
    usage: [
      'Use for non-essential supplementary information',
      'Keep content short and focused',
      'InfoTooltip adds a ? icon with tooltip',
      'Adjust position to avoid overflow'
    ],
    props: [
      { name: 'content', type: 'ReactNode', default: '-', description: 'Tooltip content' },
      { name: 'children', type: 'ReactNode', default: '-', description: 'Trigger element' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Tooltip position' },
      { name: 'delay', type: 'number', default: '200', description: 'Show delay in ms' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable tooltip' }
    ],
    examples: [
      {
        title: 'Different Positions',
        code: `<HStack gap="lg">
  <Tooltip content="Top tooltip" position="top">
    <Button variant="secondary">Top</Button>
  </Tooltip>
  <Tooltip content="Bottom tooltip" position="bottom">
    <Button variant="secondary">Bottom</Button>
  </Tooltip>
  <Tooltip content="Left tooltip" position="left">
    <Button variant="secondary">Left</Button>
  </Tooltip>
  <Tooltip content="Right tooltip" position="right">
    <Button variant="secondary">Right</Button>
  </Tooltip>
</HStack>`,
        render: (
          <div style={{ padding: '2rem 3rem' }}>
            <HStack gap="lg" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              <Tooltip content="Top tooltip" position="top"><Button variant="secondary">Top</Button></Tooltip>
              <Tooltip content="Bottom tooltip" position="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
              <Tooltip content="Left tooltip" position="left"><Button variant="secondary">Left</Button></Tooltip>
              <Tooltip content="Right tooltip" position="right"><Button variant="secondary">Right</Button></Tooltip>
            </HStack>
          </div>
        )
      },
      {
        title: 'On Icons',
        code: `<HStack gap="md">
  <Tooltip content="Edit item">
    <IconButton icon={<Edit20Regular />} />
  </Tooltip>
  <Tooltip content="Delete item">
    <IconButton icon={<Delete20Regular />} variant="danger" />
  </Tooltip>
  <Tooltip content="Share">
    <IconButton icon={<Share20Regular />} />
  </Tooltip>
</HStack>`,
        render: (
          <div style={{ padding: '2rem' }}>
            <HStack gap="md" style={{ justifyContent: 'center' }}>
              <Tooltip content="Edit item"><IconButton icon={<Edit20Regular />} /></Tooltip>
              <Tooltip content="Delete item"><IconButton icon={<Delete20Regular />} variant="danger" /></Tooltip>
              <Tooltip content="Share"><IconButton icon={<Share20Regular />} /></Tooltip>
            </HStack>
          </div>
        )
      }
    ]
  },
  dropdown: {
    name: 'Dropdown',
    description: 'Action menu and select dropdown. Use for actions and selection from a list.',
    importCode: `import { Dropdown, SelectDropdown } from 'wss3-forge'`,
    basicUsage: `<Dropdown
  trigger={<Button>Actions</Button>}
  items={[
    { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
    { id: 'delete', label: 'Delete', destructive: true }
  ]}
/>

<SelectDropdown
  value={selected}
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ]}
  onChange={setSelected}
/>`,
    usage: [
      'Dropdown for action menus',
      'SelectDropdown for form selection',
      'Add icons for visual recognition',
      'Use destructive for dangerous actions',
      'Group related items with categories'
    ],
    props: [
      { name: 'trigger', type: 'ReactNode', default: '-', description: 'Trigger element' },
      { name: 'items', type: 'DropdownItem[]', default: '-', description: 'Menu items' },
      { name: 'categories', type: 'DropdownCategory[]', default: '-', description: 'Grouped items' },
      { name: 'align', type: '"left" | "right"', default: '"left"', description: 'Menu alignment' },
      { name: 'width', type: 'string | number', default: '220', description: 'Menu width' },
      { name: 'openOnHover', type: 'boolean', default: 'false', description: 'Open on hover' }
    ],
    examples: [
      {
        title: 'Action Menu',
        code: `<Dropdown
  trigger={<Button variant="secondary">Actions</Button>}
  items={[
    { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
    { id: 'copy', label: 'Copy', icon: <Copy20Regular /> },
    { id: 'share', label: 'Share', icon: <Share20Regular /> },
    { id: 'divider', divider: true },
    { id: 'delete', label: 'Delete', icon: <Delete20Regular />, destructive: true }
  ]}
/>`,
        render: (
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Dropdown
              trigger={<Button variant="secondary">Actions</Button>}
              items={[
                { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
                { id: 'copy', label: 'Copy', icon: <Copy20Regular /> },
                { id: 'share', label: 'Share', icon: <Share20Regular /> },
                { id: 'divider', label: '', divider: true },
                { id: 'delete', label: 'Delete', icon: <Delete20Regular />, destructive: true }
              ]}
            />
          </div>
        )
      },
      {
        title: 'With Categories',
        code: `<Dropdown
  trigger={<IconButton icon={<MoreHorizontal20Regular />} />}
  categories={[
    {
      label: 'Edit',
      items: [
        { id: 'edit', label: 'Edit' },
        { id: 'duplicate', label: 'Duplicate' }
      ]
    },
    {
      label: 'Danger Zone',
      items: [
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete', destructive: true }
      ]
    }
  ]}
/>`,
        render: (
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Dropdown
              trigger={<IconButton icon={<MoreHorizontal20Regular />} />}
              categories={[
                { label: 'Edit', items: [{ id: 'edit', label: 'Edit' }, { id: 'duplicate', label: 'Duplicate' }] },
                { label: 'Danger Zone', items: [{ id: 'archive', label: 'Archive' }, { id: 'delete', label: 'Delete', destructive: true }] }
              ]}
            />
          </div>
        )
      }
    ]
  },
  modal: {
    name: 'Modal',
    description: 'Modal dialogs for important content that requires user attention.',
    importCode: `import { Modal } from 'wss3-forge'`,
    basicUsage: `const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  subtitle="Update your information"
>
  <VStack gap="md">
    <Input label="Name" />
    <Input label="Email" type="email" />
  </VStack>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button>Save Changes</Button>
  </Modal.Footer>
</Modal>`,
    usage: [
      'Use modals for important actions that require user confirmation',
      'Always provide a way to close the modal (close button, backdrop click)',
      'Keep modal content focused and concise',
      'Use Modal.Footer for action buttons',
      'Use Modal.Section for grouped content'
    ],
    props: [
      { name: 'open', type: 'boolean', default: 'false', description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', default: '-', description: 'Close handler' },
      { name: 'title', type: 'string', default: '-', description: 'Modal title' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Modal subtitle' },
      { name: 'width', type: '"sm" | "md" | "lg" | number', default: '"md"', description: 'Modal width' },
      { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Show X button' }
    ],
    examples: [
      {
        title: 'Default Modal with Form',
        code: `<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  subtitle="Update your information"
>
  <VStack gap="md">
    <Input label="Name" />
    <Input label="Email" type="email" />
  </VStack>
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button>Save Changes</Button>
  </Modal.Footer>
</Modal>`,
        render: (
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Edit Profile</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Update your information</p>
              </div>
              <button style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dismiss20Regular />
              </button>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <VStack gap="md">
                <Input label="Name" placeholder="John Doe" />
                <Input label="Email" type="email" placeholder="john@example.com" />
              </VStack>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <Button variant="secondary">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  confirmdialog: {
    name: 'ConfirmDialog',
    description: 'Confirmation dialog for destructive or important actions.',
    importCode: `import { ConfirmDialog } from 'wss3-forge'`,
    basicUsage: `const [isOpen, setIsOpen] = useState(false)

<Button variant="danger" onClick={() => setIsOpen(true)}>
  Delete Item
</Button>

<ConfirmDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={() => { deleteItem(); setIsOpen(false); }}
  title="Delete this item?"
  description="This action cannot be undone."
  variant="danger"
  confirmText="Delete"
/>`,
    usage: [
      'Use for destructive actions like delete',
      'Variant changes icon and button color',
      'Shows loading state during async operations',
      'Supports custom content via children'
    ],
    props: [
      { name: 'open', type: 'boolean', default: 'false', description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', default: '-', description: 'Close/cancel handler' },
      { name: 'onConfirm', type: '() => void', default: '-', description: 'Confirm handler' },
      { name: 'title', type: 'string', default: '-', description: 'Dialog title' },
      { name: 'description', type: 'string', default: '-', description: 'Dialog description' },
      { name: 'variant', type: '"default" | "danger" | "warning" | "success"', default: '"default"', description: 'Dialog style' },
      { name: 'confirmText', type: 'string', default: '"Confirm"', description: 'Confirm button text' },
      { name: 'cancelText', type: 'string', default: '"Cancel"', description: 'Cancel button text' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state' }
    ],
    examples: [
      {
        title: 'Danger Variant - Delete Confirmation',
        code: `<ConfirmDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Delete this item?"
  description="This action cannot be undone. All data will be permanently removed."
  variant="danger"
  confirmText="Delete"
/>`,
        render: (
          <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error)', fontSize: 20, flexShrink: 0, height: '1.5rem', marginTop: '0.0625rem' }}>
                <Delete20Regular />
              </span>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.5rem' }}>Delete this item?</h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>This action cannot be undone. All data will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button style={{ flex: 1, padding: '0.625rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Cancel</button>
              <button style={{ flex: 1, padding: '0.625rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: 'white', backgroundColor: 'var(--error)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        )
      },
      {
        title: 'Warning Variant - Unsaved Changes',
        code: `<ConfirmDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDiscard}
  title="Unsaved changes"
  description="You have unsaved changes. Are you sure you want to leave?"
  variant="warning"
  confirmText="Discard"
/>`,
        render: (
          <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', fontSize: 20, flexShrink: 0, height: '1.5rem', marginTop: '0.0625rem' }}>
                <Warning20Regular />
              </span>
              <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.5rem' }}>Unsaved changes</h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>You have unsaved changes. Are you sure you want to leave?</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button style={{ flex: 1, padding: '0.625rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Cancel</button>
              <button style={{ flex: 1, padding: '0.625rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a', backgroundColor: 'var(--warning)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Discard</button>
            </div>
          </div>
        )
      }
    ]
  },
  toast: {
    name: 'Toast',
    description: 'Brief notifications that appear temporarily. Use for feedback on user actions.',
    importCode: `import { ToastProvider, useToast } from 'wss3-forge'

// Wrap app with ToastProvider
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>`,
    basicUsage: `const { success, error, warning, info } = useToast()

success('Saved successfully')
error('Failed to save', 'Please try again')
warning('Session expiring soon')
info('New version available')`,
    usage: [
      'Wrap app with ToastProvider',
      'Use success for completed actions',
      'Use error for failures with explanation',
      'Toasts auto-dismiss after a few seconds',
      'Position can be customized'
    ],
    props: [
      { name: 'position', type: '"top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"', default: '"bottom-right"', description: 'Toast position' },
      { name: 'maxToasts', type: 'number', default: '5', description: 'Maximum visible toasts' }
    ],
    examples: [
      {
        title: 'Toast Variants',
        code: `<VStack gap="md">
  <SimpleToast type="success" title="Success" message="Operation completed" />
  <SimpleToast type="error" title="Error" message="Something went wrong" />
  <SimpleToast type="warning" title="Warning" message="Please review" />
  <SimpleToast type="info" title="Info" message="New update available" />
</VStack>`,
        render: (
          <VStack gap="md">
            <SimpleToast type="success" title="Success" message="Operation completed" />
            <SimpleToast type="error" title="Error" message="Something went wrong" />
            <SimpleToast type="warning" title="Warning" message="Please review" />
            <SimpleToast type="info" title="Info" message="New update available" />
          </VStack>
        )
      },
      {
        title: 'Title Only',
        code: `<VStack gap="md">
  <SimpleToast type="success" title="Changes saved successfully" />
  <SimpleToast type="error" title="Failed to delete item" />
</VStack>`,
        render: (
          <VStack gap="md">
            <SimpleToast type="success" title="Changes saved successfully" />
            <SimpleToast type="error" title="Failed to delete item" />
          </VStack>
        )
      }
    ]
  },
  spinner: {
    name: 'Spinner',
    description: 'Loading indicator for async operations. Use when content is being loaded.',
    importCode: `import { Spinner, LoadingOverlay, WebbaLoader } from 'wss3-forge'`,
    basicUsage: `<Spinner />
<Spinner size="lg" label="Loading..." />
<LoadingOverlay visible={isLoading} label="Saving..." />
<WebbaLoader size={48} />`,
    usage: [
      'Use for short loading states',
      'Add label for context on longer operations',
      'LoadingOverlay for full container loading',
      'WebbaLoader for branded loading animation'
    ],
    props: [
      { name: 'size', type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: 'Spinner size' },
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Spinner color' },
      { name: 'thickness', type: 'number', default: '2', description: 'Border thickness' },
      { name: 'label', type: 'string', default: '-', description: 'Loading label' }
    ],
    examples: [
      {
        title: 'Sizes',
        code: `<HStack gap="lg" align="center">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</HStack>`,
        render: (
          <HStack gap="lg" style={{ alignItems: 'center' }}>
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </HStack>
        )
      },
      {
        title: 'With Label',
        code: `<VStack gap="lg">
  <Spinner size="md" label="Loading..." />
  <Spinner size="lg" label="Processing your request..." />
</VStack>`,
        render: (
          <VStack gap="lg">
            <Spinner size="md" label="Loading..." />
            <Spinner size="lg" label="Processing your request..." />
          </VStack>
        )
      },
      {
        title: 'Custom Colors',
        code: `<HStack gap="lg" align="center">
  <Spinner color="var(--color-success)" />
  <Spinner color="var(--color-error)" />
  <Spinner color="var(--color-warning)" />
</HStack>`,
        render: (
          <HStack gap="lg" style={{ alignItems: 'center' }}>
            <Spinner color="var(--color-success)" />
            <Spinner color="var(--color-error)" />
            <Spinner color="var(--color-warning)" />
          </HStack>
        )
      },
      {
        title: 'WebbaLoader',
        code: `<HStack gap="xl" align="center">
  <WebbaLoader size={32} />
  <WebbaLoader size={48} />
  <WebbaLoader size={64} />
</HStack>`,
        render: (
          <HStack gap="xl" style={{ alignItems: 'center' }}>
            <WebbaLoader size={32} />
            <WebbaLoader size={48} />
            <WebbaLoader size={64} />
          </HStack>
        )
      },
      {
        title: 'WebbaLoader Colors',
        code: `<HStack gap="xl" align="center">
  <WebbaLoader size={40} color="var(--brand-primary)" />
  <WebbaLoader size={40} color="var(--color-success)" />
  <WebbaLoader size={40} color="var(--color-error)" />
</HStack>`,
        render: (
          <HStack gap="xl" style={{ alignItems: 'center' }}>
            <WebbaLoader size={40} color="var(--brand-primary)" />
            <WebbaLoader size={40} color="var(--color-success)" />
            <WebbaLoader size={40} color="var(--color-error)" />
          </HStack>
        )
      }
    ]
  },
  avatar: {
    name: 'Avatar',
    description: 'User avatar with image, initials, or icon. Supports status indicators.',
    importCode: `import { Avatar, AvatarStack, AvatarCard } from 'wss3-forge'`,
    basicUsage: `<Avatar name="John Doe" />
<Avatar src="/path/to/image.jpg" name="Jane" />
<Avatar name="Online User" status="online" />
<AvatarStack users={users} max={4} />`,
    usage: [
      'Shows initials when no image provided',
      'Color is generated from name',
      'Add status for online indicators',
      'AvatarStack for groups of users',
      'AvatarCard for detailed user info'
    ],
    props: [
      { name: 'name', type: 'string', default: '-', description: 'User name (for initials)' },
      { name: 'src', type: 'string', default: '-', description: 'Image URL' },
      { name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Avatar size' },
      { name: 'color', type: 'string', default: '-', description: 'Background color' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Custom icon' },
      { name: 'status', type: '"online" | "offline" | "away" | "busy"', default: '-', description: 'Status indicator' },
      { name: 'onClick', type: '() => void', default: '-', description: 'Click handler' }
    ],
    examples: [
      {
        title: 'Sizes',
        code: `<HStack gap="md" align="center">
  <Avatar name="John Doe" size="xs" />
  <Avatar name="John Doe" size="sm" />
  <Avatar name="John Doe" size="md" />
  <Avatar name="John Doe" size="lg" />
  <Avatar name="John Doe" size="xl" />
</HStack>`,
        render: (
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <Avatar name="John Doe" size="xs" />
            <Avatar name="John Doe" size="sm" />
            <Avatar name="John Doe" size="md" />
            <Avatar name="John Doe" size="lg" />
            <Avatar name="John Doe" size="xl" />
          </HStack>
        )
      },
      {
        title: 'With Status',
        code: `<HStack gap="md">
  <Avatar name="Online User" status="online" />
  <Avatar name="Away User" status="away" />
  <Avatar name="Busy User" status="busy" />
  <Avatar name="Offline User" status="offline" />
</HStack>`,
        render: (
          <HStack gap="md">
            <Avatar name="Online User" status="online" />
            <Avatar name="Away User" status="away" />
            <Avatar name="Busy User" status="busy" />
            <Avatar name="Offline User" status="offline" />
          </HStack>
        )
      },
      {
        title: 'Avatar Stack',
        code: `<AvatarStack
  users={[
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' },
    { name: 'Diana' },
    { name: 'Eve' }
  ]}
  max={4}
/>`,
        render: (
          <AvatarStack
            users={[
              { name: 'Alice' },
              { name: 'Bob' },
              { name: 'Charlie' },
              { name: 'Diana' },
              { name: 'Eve' }
            ]}
            max={4}
          />
        )
      }
    ]
  },
  divider: {
    name: 'Divider',
    description: 'Visual separator for content sections. Supports labels and different styles.',
    importCode: `import { Divider, VerticalDivider, SectionDivider } from 'wss3-forge'`,
    basicUsage: `<Divider />
<Divider label="Or continue with" />
<VerticalDivider />
<SectionDivider label="Advanced" icon={<Settings20Regular />} />`,
    usage: [
      'Use to separate content sections',
      'Add label for contextual separation',
      'VerticalDivider for inline separation',
      'SectionDivider for prominent breaks'
    ],
    props: [
      { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Divider direction' },
      { name: 'variant', type: '"solid" | "dashed" | "dotted"', default: '"solid"', description: 'Line style' },
      { name: 'color', type: 'string', default: 'var(--border-color)', description: 'Line color' },
      { name: 'spacing', type: '"none" | "sm" | "md" | "lg"', default: '"md"', description: 'Vertical margin' },
      { name: 'label', type: 'ReactNode', default: '-', description: 'Center label' },
      { name: 'labelPosition', type: '"left" | "center" | "right"', default: '"center"', description: 'Label alignment' }
    ],
    examples: [
      {
        title: 'Basic Dividers',
        code: `<VStack gap={16}>
  <Text>Content above</Text>
  <Divider />
  <Text>Content below</Text>
</VStack>`,
        render: (
          <VStack gap={16}>
            <Text>Content above</Text>
            <Divider />
            <Text>Content below</Text>
          </VStack>
        )
      },
      {
        title: 'With Label',
        code: `<Divider label="Or continue with" />
<Divider label="Section" labelPosition="left" />`,
        render: (
          <VStack gap={24}>
            <Divider label="Or continue with" />
            <Divider label="Section" labelPosition="left" />
          </VStack>
        )
      },
      {
        title: 'Variants',
        code: `<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />`,
        render: (
          <VStack gap={24}>
            <Divider variant="solid" />
            <Divider variant="dashed" />
            <Divider variant="dotted" />
          </VStack>
        )
      },
      {
        title: 'Section Divider',
        code: `<SectionDivider label="Features" icon={<Star20Regular />} />`,
        render: (
          <SectionDivider label="Features" icon={<Star20Regular />} />
        )
      },
      {
        title: 'Vertical Divider',
        code: `<HStack gap={16} style={{ height: 40 }}>
  <Text>Item 1</Text>
  <VerticalDivider />
  <Text>Item 2</Text>
  <VerticalDivider />
  <Text>Item 3</Text>
</HStack>`,
        render: (
          <HStack gap={16} style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Item 1</Text>
            <VerticalDivider />
            <Text>Item 2</Text>
            <VerticalDivider />
            <Text>Item 3</Text>
          </HStack>
        )
      }
    ]
  },
  copybutton: {
    name: 'CopyButton',
    description: 'Button to copy text to clipboard with visual feedback.',
    importCode: `import { CopyButton, CopyField } from 'wss3-forge'`,
    basicUsage: `<CopyButton text="Text to copy" />
<CopyButton text="Copy me" variant="button" label="Copy Code" />
<CopyField value="https://example.com/invite/abc123" label="Invite Link" />`,
    usage: [
      'Use icon variant for compact buttons',
      'Use button variant for prominent actions',
      'CopyField for input with copy button',
      'Shows checkmark on successful copy'
    ],
    props: [
      { name: 'text', type: 'string', default: '-', description: 'Text to copy' },
      { name: 'variant', type: '"icon" | "button" | "minimal"', default: '"icon"', description: 'Button style' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Button size' },
      { name: 'label', type: 'string', default: '"Copier"', description: 'Button label' },
      { name: 'successLabel', type: 'string', default: '"Copié !"', description: 'Success message' },
      { name: 'timeout', type: 'number', default: '2000', description: 'Success state duration' },
      { name: 'onCopy', type: '() => void', default: '-', description: 'Copy callback' }
    ],
    examples: [
      {
        title: 'Button Variants',
        code: `<CopyButton text="Text to copy" variant="icon" />
<CopyButton text="Copy me" variant="button" label="Copy Code" />
<CopyButton text="Minimal" variant="minimal" />`,
        render: (
          <HStack gap="md" style={{ alignItems: 'center' }}>
            <CopyButton text="Text to copy" variant="icon" />
            <CopyButton text="Copy me" variant="button" label="Copy Code" />
            <CopyButton text="Minimal" variant="minimal" />
          </HStack>
        )
      },
      {
        title: 'Copy Field',
        code: `<CopyField
  value="https://example.com/invite/abc123"
  label="Invite Link"
/>`,
        render: (
          <CopyField
            value="https://example.com/invite/abc123"
            label="Invite Link"
          />
        )
      }
    ]
  },
  accordion: {
    name: 'Accordion',
    description: 'Collapsible content panels for organizing long content into expandable sections.',
    importCode: `import { Accordion, AccordionItem, Collapsible, FAQAccordion } from 'wss3-forge'`,
    basicUsage: `<Accordion>
  <AccordionItem id="1" title="Section 1">
    Content for section 1
  </AccordionItem>
  <AccordionItem id="2" title="Section 2">
    Content for section 2
  </AccordionItem>
</Accordion>`,
    usage: [
      'Use for content that can be hidden to reduce visual complexity',
      'Set multiple={true} to allow multiple panels open',
      'AccordionItem supports icon, subtitle, and badge',
      'Collapsible for standalone collapsible sections',
      'FAQAccordion for pre-styled FAQ sections'
    ],
    props: [
      { name: 'defaultExpanded', type: 'string | string[]', default: '-', description: 'Initially expanded item(s)' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple items open' },
      { name: 'onChange', type: '(expanded: string[]) => void', default: '-', description: 'Change callback' }
    ],
    examples: [
      {
        title: 'Basic Accordion',
        code: `<Accordion>
  <AccordionItem id="1" title="What is Forge?">
    Forge is a modern React component library.
  </AccordionItem>
  <AccordionItem id="2" title="How to install?">
    Copy the .forge folder to your project.
  </AccordionItem>
  <AccordionItem id="3" title="Is it free?">
    Yes, Forge is completely free to use.
  </AccordionItem>
</Accordion>`,
        render: (
          <Accordion>
            <AccordionItem id="1" title="What is Forge?">
              <Text color="secondary">Forge is a modern React component library designed for dark-mode first applications.</Text>
            </AccordionItem>
            <AccordionItem id="2" title="How to install?">
              <Text color="secondary">Copy the .forge folder to your project and import components from it.</Text>
            </AccordionItem>
            <AccordionItem id="3" title="Is it free?">
              <Text color="secondary">Yes, Forge is completely free to use in personal and commercial projects.</Text>
            </AccordionItem>
          </Accordion>
        )
      },
      {
        title: 'With Default Expanded',
        code: `<Accordion defaultExpanded="1">
  <AccordionItem id="1" title="Expanded by default">
    This section starts expanded.
  </AccordionItem>
  <AccordionItem id="2" title="Collapsed">
    Click to expand.
  </AccordionItem>
</Accordion>`,
        render: (
          <Accordion defaultExpanded="1">
            <AccordionItem id="1" title="Expanded by default">
              <Text color="secondary">This section starts expanded when the page loads.</Text>
            </AccordionItem>
            <AccordionItem id="2" title="Collapsed">
              <Text color="secondary">Click the header to expand this section.</Text>
            </AccordionItem>
          </Accordion>
        )
      }
    ]
  },
  timeline: {
    name: 'Timeline',
    description: 'Display a sequence of events in chronological order with status indicators.',
    importCode: `import { Timeline, ActivityTimeline } from 'wss3-forge'`,
    basicUsage: `<Timeline
  items={[
    { id: '1', title: 'Order placed', status: 'completed', date: 'Jan 1' },
    { id: '2', title: 'Processing', status: 'current', date: 'Jan 2' },
    { id: '3', title: 'Shipped', status: 'upcoming', date: 'Jan 3' }
  ]}
/>`,
    usage: [
      'Use for progress tracking and event history',
      'Three variants: default, compact, alternate',
      'Status colors indicate completion state',
      'Add actions for interactive timelines',
      'ActivityTimeline for activity feeds'
    ],
    props: [
      { name: 'items', type: 'TimelineItem[]', default: '-', description: 'Array of timeline items' },
      { name: 'variant', type: '"default" | "compact" | "alternate"', default: '"default"', description: 'Visual layout' },
      { name: 'showConnector', type: 'boolean', default: 'true', description: 'Show connecting line' },
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Accent color' }
    ],
    examples: [
      {
        title: 'Order Tracking',
        code: `<Timeline
  items={[
    { id: '1', title: 'Order placed', description: 'Your order has been confirmed', status: 'completed', date: 'Jan 15, 10:30' },
    { id: '2', title: 'Processing', description: 'Preparing your items', status: 'completed', date: 'Jan 15, 14:00' },
    { id: '3', title: 'Shipped', description: 'Package in transit', status: 'current', date: 'Jan 16, 09:00' },
    { id: '4', title: 'Delivered', status: 'upcoming', date: 'Expected Jan 18' }
  ]}
/>`,
        render: (
          <Timeline
            items={[
              { id: '1', title: 'Order placed', description: 'Your order has been confirmed', status: 'completed', date: 'Jan 15, 10:30' },
              { id: '2', title: 'Processing', description: 'Preparing your items', status: 'completed', date: 'Jan 15, 14:00' },
              { id: '3', title: 'Shipped', description: 'Package in transit', status: 'current', date: 'Jan 16, 09:00' },
              { id: '4', title: 'Delivered', status: 'upcoming', date: 'Expected Jan 18' }
            ]}
          />
        )
      },
      {
        title: 'Project Milestones',
        code: `<Timeline
  items={[
    { id: '1', title: 'Project kickoff', status: 'completed', date: 'Week 1' },
    { id: '2', title: 'Design phase', status: 'completed', date: 'Week 2-3' },
    { id: '3', title: 'Development', status: 'current', date: 'Week 4-8' },
    { id: '4', title: 'Testing', status: 'upcoming', date: 'Week 9-10' },
    { id: '5', title: 'Launch', status: 'upcoming', date: 'Week 11' }
  ]}
/>`,
        render: (
          <Timeline
            items={[
              { id: '1', title: 'Project kickoff', status: 'completed', date: 'Week 1' },
              { id: '2', title: 'Design phase', status: 'completed', date: 'Week 2-3' },
              { id: '3', title: 'Development', status: 'current', date: 'Week 4-8' },
              { id: '4', title: 'Testing', status: 'upcoming', date: 'Week 9-10' },
              { id: '5', title: 'Launch', status: 'upcoming', date: 'Week 11' }
            ]}
          />
        )
      },
      {
        title: 'Compact Variant',
        code: `<Timeline
  items={[
    { id: '1', title: 'Created account', status: 'completed', date: '2 hours ago' },
    { id: '2', title: 'Verified email', status: 'completed', date: '1 hour ago' },
    { id: '3', title: 'Setup profile', status: 'current', date: 'Now' },
    { id: '4', title: 'Invite team', status: 'upcoming' }
  ]}
  variant="compact"
/>`,
        render: (
          <Timeline
            items={[
              { id: '1', title: 'Created account', status: 'completed', date: '2 hours ago' },
              { id: '2', title: 'Verified email', status: 'completed', date: '1 hour ago' },
              { id: '3', title: 'Setup profile', status: 'current', date: 'Now' },
              { id: '4', title: 'Invite team', status: 'upcoming' }
            ]}
            variant="compact"
          />
        )
      }
    ]
  },
  skeleton: {
    name: 'Skeleton',
    description: 'Placeholder loading states that mimic content layout while data is loading.',
    importCode: `import { Skeleton, SkeletonText, SkeletonCard, SkeletonTable } from 'wss3-forge'`,
    basicUsage: `<Skeleton width="100%" height={20} />
<Skeleton variant="circular" width={40} />
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonTable rows={5} columns={4} />`,
    usage: [
      'Use to indicate content is loading',
      'Match skeleton shape to actual content',
      'SkeletonCard/SkeletonTable for common patterns',
      'Pulse animation by default',
      'Better UX than spinners for content areas'
    ],
    props: [
      { name: 'width', type: 'string | number', default: '"100%"', description: 'Skeleton width' },
      { name: 'height', type: 'string | number', default: '16', description: 'Skeleton height' },
      { name: 'variant', type: '"text" | "circular" | "rectangular" | "rounded"', default: '"text"', description: 'Shape style' },
      { name: 'animation', type: '"pulse" | "wave" | "none"', default: '"pulse"', description: 'Animation type' }
    ],
    examples: [
      {
        title: 'Basic Variants',
        code: `<VStack gap="md">
  <Skeleton width="100%" height={20} />
  <Skeleton variant="rounded" width="60%" height={16} />
  <HStack gap="md" align="center">
    <Skeleton variant="circular" width={40} height={40} />
    <VStack gap="sm" style={{ flex: 1 }}>
      <Skeleton width="50%" height={14} />
      <Skeleton width="30%" height={12} />
    </VStack>
  </HStack>
</VStack>`,
        render: (
          <VStack gap="md">
            <Skeleton width="100%" height={20} />
            <Skeleton variant="rounded" width="60%" height={16} />
            <HStack gap="md" style={{ alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <VStack gap="sm" style={{ flex: 1 }}>
                <Skeleton width="50%" height={14} />
                <Skeleton width="30%" height={12} />
              </VStack>
            </HStack>
          </VStack>
        )
      },
      {
        title: 'Skeleton Text',
        code: `<SkeletonText lines={4} />`,
        render: <SkeletonText lines={4} />
      },
      {
        title: 'Skeleton Card',
        code: `<SkeletonCard />`,
        render: <SkeletonCard />
      },
      {
        title: 'Skeleton Table',
        code: `<SkeletonTable rows={3} columns={4} />`,
        render: <SkeletonTable rows={3} columns={4} />
      },
      {
        title: 'Skeleton Stat Card',
        code: `<SkeletonStatCard />`,
        render: <SkeletonStatCard />
      }
    ]
  },
  codeblock: {
    name: 'CodeBlock',
    description: 'Syntax-highlighted code display with copy functionality and line numbers.',
    importCode: `import { CodeBlock } from 'wss3-forge'`,
    basicUsage: `<CodeBlock
  code={\`const greeting = "Hello World"\`}
  language="typescript"
  showLineNumbers
  showCopyButton
/>`,
    usage: [
      'Use for displaying code snippets',
      'Supports multiple languages (tsx, js, css, bash, etc.)',
      'Add showLineNumbers for longer code',
      'Copy button enabled by default',
      'Optional title for context'
    ],
    props: [
      { name: 'code', type: 'string', default: '-', description: 'Code to display' },
      { name: 'language', type: 'string', default: '"tsx"', description: 'Programming language' },
      { name: 'showLineNumbers', type: 'boolean', default: 'false', description: 'Show line numbers' },
      { name: 'showCopyButton', type: 'boolean', default: 'true', description: 'Show copy button' },
      { name: 'title', type: 'string', default: '-', description: 'Code block title' },
      { name: 'maxHeight', type: 'number', default: '-', description: 'Maximum height with scroll' }
    ],
    examples: [
      {
        title: 'Basic Code Block',
        code: `<CodeBlock
  code={\`const greeting = "Hello World"
console.log(greeting)\`}
  language="typescript"
/>`,
        render: (
          <CodeBlock
            code={`const greeting = "Hello World"
console.log(greeting)`}
            language="typescript"
          />
        )
      },
      {
        title: 'With Line Numbers',
        code: `<CodeBlock
  code={code}
  language="tsx"
  showLineNumbers
  title="MyComponent.tsx"
/>`,
        render: (
          <CodeBlock
            code={`function MyComponent() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}`}
            language="tsx"
            showLineNumbers
            title="MyComponent.tsx"
          />
        )
      }
    ]
  },
  searchinput: {
    name: 'SearchInput',
    description: 'Specialized input for search functionality with clear button and keyboard shortcuts.',
    importCode: `import { SearchInput } from 'wss3-forge'`,
    basicUsage: `<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Search..."
/>`,
    usage: [
      'Use for filtering content or global search',
      'Includes search icon and clear button',
      'Debounce onChange for performance',
      'Supports keyboard shortcuts'
    ],
    props: [
      { name: 'value', type: 'string', default: '-', description: 'Search query' },
      { name: 'onChange', type: '(value: string) => void', default: '-', description: 'Change handler' },
      { name: 'placeholder', type: 'string', default: '"Search..."', description: 'Placeholder text' },
      { name: 'size', type: '"sm" | "md"', default: '"md"', description: 'Input size' },
      { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Auto focus on mount' }
    ],
    examples: [
      {
        title: 'Basic Search',
        code: `const [query, setQuery] = useState('')

<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Search..."
/>`,
        render: <SearchInput value="" onChange={() => {}} placeholder="Search..." />
      },
      {
        title: 'Small Size',
        code: `<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Quick search..."
  size="sm"
/>`,
        render: <SearchInput value="" onChange={() => {}} placeholder="Quick search..." size="sm" />
      },
      {
        title: 'With Pre-filled Value',
        code: `<SearchInput
  value="React components"
  onChange={setQuery}
  placeholder="Search..."
/>`,
        render: <SearchInput value="React components" onChange={() => {}} placeholder="Search..." />
      }
    ]
  },
  pagination: {
    name: 'Pagination',
    description: 'Navigate through paginated content with page numbers and navigation buttons.',
    importCode: `import { Pagination, SimplePagination } from 'wss3-forge'`,
    basicUsage: `<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={setPage}
/>`,
    usage: [
      'Use for multi-page content navigation',
      'Shows page numbers with ellipsis for large ranges',
      'SimplePagination for prev/next only',
      'Supports custom page size selection'
    ],
    props: [
      { name: 'currentPage', type: 'number', default: '-', description: 'Current page (1-indexed)' },
      { name: 'totalPages', type: 'number', default: '-', description: 'Total number of pages' },
      { name: 'onPageChange', type: '(page: number) => void', default: '-', description: 'Page change handler' },
      { name: 'siblingCount', type: 'number', default: '1', description: 'Pages shown around current' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Button size' }
    ],
    examples: [
      {
        title: 'Basic Pagination',
        code: `<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={setPage}
/>`,
        render: <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
      },
      {
        title: 'Middle Page',
        code: `<Pagination
  currentPage={5}
  totalPages={10}
  onPageChange={setPage}
/>`,
        render: <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
      },
      {
        title: 'Simple Pagination',
        code: `<SimplePagination
  currentPage={3}
  totalPages={10}
  onPageChange={setPage}
/>`,
        render: <SimplePagination currentPage={3} totalPages={10} onPageChange={() => {}} />
      }
    ]
  },
  breadcrumbs: {
    name: 'Breadcrumbs',
    description: 'Show navigation hierarchy and allow quick navigation to parent pages.',
    importCode: `import { Breadcrumbs } from 'wss3-forge'`,
    basicUsage: `<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Components' }
  ]}
/>`,
    usage: [
      'Use for hierarchical navigation',
      'Last item has no href (current page)',
      'Keep breadcrumb trail short (3-5 levels)',
      'Supports maxItems for collapsing'
    ],
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', default: '-', description: 'Array of breadcrumb items' },
      { name: 'separator', type: 'ReactNode', default: 'ChevronRight', description: 'Separator between items' },
      { name: 'maxItems', type: 'number', default: '-', description: 'Max visible items before collapse' },
      { name: 'showHome', type: 'boolean', default: 'false', description: 'Show home icon' }
    ],
    examples: [
      {
        title: 'Basic Breadcrumbs',
        code: `<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Components' }
  ]}
/>`,
        render: <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Components' }]} />
      },
      {
        title: 'Deep Navigation',
        code: `<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Smartphones' }
  ]}
/>`,
        render: <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Products', href: '#' }, { label: 'Electronics', href: '#' }, { label: 'Smartphones' }]} />
      }
    ]
  },
  vstack: {
    name: 'VStack & HStack',
    description: 'Flex containers for vertical (VStack) and horizontal (HStack) layouts with consistent spacing.',
    importCode: `import { VStack, HStack } from 'wss3-forge'`,
    basicUsage: `<VStack gap="md">
  <div>First item</div>
  <div>Second item</div>
  <div>Third item</div>
</VStack>

<HStack gap="md">
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</HStack>`,
    usage: [
      'VStack for vertical layouts, HStack for horizontal',
      'Gap supports size tokens (xs, sm, md, lg, xl)',
      'Use align for cross-axis alignment',
      'Use justify for main-axis distribution'
    ],
    props: [
      { name: 'gap', type: '"xs" | "sm" | "md" | "lg" | "xl" | string', default: '"md"', description: 'Space between children' },
      { name: 'align', type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: 'Cross-axis alignment' },
      { name: 'justify', type: '"start" | "center" | "end" | "between" | "around"', default: '"start"', description: 'Main-axis alignment' }
    ],
    examples: [
      {
        title: 'VStack - Vertical Layout',
        code: `<VStack gap="md">
  <Card padding="md">Item 1</Card>
  <Card padding="md">Item 2</Card>
  <Card padding="md">Item 3</Card>
</VStack>`,
        render: (
          <VStack gap="md">
            <Card padding="md">Item 1</Card>
            <Card padding="md">Item 2</Card>
            <Card padding="md">Item 3</Card>
          </VStack>
        )
      },
      {
        title: 'HStack - Horizontal Layout',
        code: `<HStack gap="md">
  <Card padding="md">Left</Card>
  <Card padding="md">Center</Card>
  <Card padding="md">Right</Card>
</HStack>`,
        render: (
          <HStack gap="md" style={{ flexWrap: 'wrap' }}>
            <Card padding="md">Left</Card>
            <Card padding="md">Center</Card>
            <Card padding="md">Right</Card>
          </HStack>
        )
      },
      {
        title: 'Gap Sizes',
        code: `<VStack gap="xs">...</VStack>  // Extra small
<VStack gap="sm">...</VStack>  // Small
<VStack gap="md">...</VStack>  // Medium (default)
<VStack gap="lg">...</VStack>  // Large
<VStack gap="xl">...</VStack>  // Extra large`,
        render: (
          <HStack gap="lg" style={{ flexWrap: 'wrap' }}>
            <VStack gap="xs">
              <Text size="xs" color="muted">gap="xs"</Text>
              <Badge>1</Badge>
              <Badge>2</Badge>
            </VStack>
            <VStack gap="sm">
              <Text size="xs" color="muted">gap="sm"</Text>
              <Badge>1</Badge>
              <Badge>2</Badge>
            </VStack>
            <VStack gap="md">
              <Text size="xs" color="muted">gap="md"</Text>
              <Badge>1</Badge>
              <Badge>2</Badge>
            </VStack>
            <VStack gap="lg">
              <Text size="xs" color="muted">gap="lg"</Text>
              <Badge>1</Badge>
              <Badge>2</Badge>
            </VStack>
          </HStack>
        )
      },
      {
        title: 'Alignment',
        code: `<HStack gap="md" justify="between">
  <Button>Left</Button>
  <Button>Right</Button>
</HStack>`,
        render: (
          <Card padding="md" style={{ width: '100%' }}>
            <HStack gap="md" style={{ justifyContent: 'space-between' }}>
              <Button variant="secondary">Left</Button>
              <Button variant="primary">Right</Button>
            </HStack>
          </Card>
        )
      }
    ]
  },
  heading: {
    name: 'Heading',
    description: 'Typography component for headings with consistent styling.',
    importCode: `import { Heading, Text } from 'wss3-forge'`,
    basicUsage: `<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection</Heading>
<Text size="lg" color="secondary">Body text</Text>`,
    usage: [
      'Use semantic heading levels (1-6)',
      'Level 1 for page titles only',
      'Text component for body copy',
      'Supports color variants'
    ],
    props: [
      { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Heading level (h1-h6)' },
      { name: 'color', type: '"primary" | "secondary" | "muted"', default: '"primary"', description: 'Text color' }
    ],
    examples: [
      {
        title: 'Heading Levels',
        code: `<Heading level={1}>H1 Page Title</Heading>
<Heading level={2}>H2 Section Title</Heading>
<Heading level={3}>H3 Subsection</Heading>
<Heading level={4}>H4 Small Heading</Heading>`,
        render: (
          <VStack gap="sm" style={{ alignItems: 'flex-start' }}>
            <Heading level={1}>H1 Page Title</Heading>
            <Heading level={2}>H2 Section Title</Heading>
            <Heading level={3}>H3 Subsection</Heading>
            <Heading level={4}>H4 Small Heading</Heading>
          </VStack>
        )
      },
      {
        title: 'Text Variants',
        code: `<Text size="lg">Large text</Text>
<Text size="md">Medium text (default)</Text>
<Text size="sm">Small text</Text>
<Text color="muted">Muted color</Text>`,
        render: (
          <VStack gap="xs" style={{ alignItems: 'flex-start' }}>
            <Text size="lg">Large text</Text>
            <Text size="md">Medium text (default)</Text>
            <Text size="sm">Small text</Text>
            <Text color="muted">Muted color</Text>
          </VStack>
        )
      }
    ]
  },
  animate: {
    name: 'Animate',
    description: 'Add entrance animations to elements with customizable timing.',
    importCode: `import { Animate, Stagger } from 'wss3-forge'`,
    basicUsage: `<Animate type="fadeIn" delay={100}>
  <Card>Animated content</Card>
</Animate>

<Stagger type="slideInUp" stagger={50}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Stagger>`,
    usage: [
      'Use for entrance animations',
      'Stagger for lists and grids',
      'Available: fadeIn, slideInUp, slideInDown, scaleIn',
      'Delay in milliseconds'
    ],
    props: [
      { name: 'type', type: '"fadeIn" | "slideInUp" | "slideInDown" | "scaleIn"', default: '"fadeIn"', description: 'Animation type' },
      { name: 'delay', type: 'number', default: '0', description: 'Animation delay (ms)' },
      { name: 'duration', type: 'number', default: '300', description: 'Animation duration (ms)' }
    ],
    examples: [
      {
        title: 'Animate Types',
        code: `<Animate type="fadeIn"><Card>Fade In</Card></Animate>
<Animate type="slideInUp"><Card>Slide Up</Card></Animate>
<Animate type="scaleIn"><Card>Scale In</Card></Animate>`,
        render: (
          <HStack gap="md">
            <Animate type="fadeIn"><Card padding="md">Fade In</Card></Animate>
            <Animate type="slideInUp"><Card padding="md">Slide Up</Card></Animate>
            <Animate type="scaleIn"><Card padding="md">Scale In</Card></Animate>
          </HStack>
        )
      }
    ]
  },
  floatbutton: {
    name: 'FloatButton',
    description: 'Floating action button (FAB) for primary actions. Stays fixed on screen.',
    importCode: `import { FloatButton, FloatButtonGroup, BackToTop } from 'wss3-forge'`,
    basicUsage: `<FloatButton icon={<Add20Regular />} onClick={handleClick} />
<FloatButtonGroup>
  <FloatButton icon={<Edit20Regular />} />
  <FloatButton icon={<Delete20Regular />} />
</FloatButtonGroup>
<BackToTop threshold={400} />`,
    usage: [
      'Use for primary actions like "Add" or "Compose"',
      'FloatButtonGroup for multiple related actions',
      'BackToTop for long scrollable pages',
      'Position in bottom-right by default'
    ],
    props: [
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Button icon' },
      { name: 'onClick', type: '() => void', default: '-', description: 'Click handler' },
      { name: 'variant', type: '"primary" | "secondary" | "gradient"', default: '"primary"', description: 'Visual style' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Button size' },
      { name: 'inline', type: 'boolean', default: 'true', description: 'If false, button is fixed positioned' },
      { name: 'position', type: '"bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left"', default: '"bottom-right"', description: 'Screen position (when inline=false)' },
      { name: 'tooltip', type: 'string', default: '-', description: 'Tooltip text (appears on left)' },
      { name: 'badge', type: 'number | string', default: '-', description: 'Badge content' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' }
    ],
    examples: [
      {
        title: 'Basic FloatButton',
        code: `<FloatButton
  icon={<Add20Regular />}
  onClick={() => console.log('Add clicked')}
/>`,
        render: (
          <VStack gap="md" style={{ alignItems: 'center' }}>
            <Text size="sm" color="muted">
              By default, FloatButton is inline. Use inline=false for fixed positioning.
            </Text>
            <FloatButton icon={<Add20Regular />} />
          </VStack>
        )
      },
      {
        title: 'Variants',
        code: `<FloatButton variant="primary" icon={<Add20Regular />} />
<FloatButton variant="secondary" icon={<Edit20Regular />} />
<FloatButton variant="gradient" icon={<Rocket20Regular />} />`,
        render: (
          <HStack gap="lg" style={{ justifyContent: 'center' }}>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <FloatButton variant="primary" icon={<Add20Regular />} />
              <Text size="xs" color="muted">Primary</Text>
            </VStack>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <FloatButton variant="secondary" icon={<Edit20Regular />} />
              <Text size="xs" color="muted">Secondary</Text>
            </VStack>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <FloatButton variant="gradient" icon={<Rocket20Regular />} />
              <Text size="xs" color="muted">Gradient</Text>
            </VStack>
          </HStack>
        )
      },
      {
        title: 'Sizes',
        code: `<FloatButton size="sm" icon={<Add20Regular />} />
<FloatButton size="md" icon={<Add20Regular />} />
<FloatButton size="lg" icon={<Add20Regular />} />`,
        render: (
          <HStack gap="lg" style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <FloatButton size="sm" icon={<Add20Regular />} />
              <Text size="xs" color="muted">Small</Text>
            </VStack>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <FloatButton size="md" icon={<Add20Regular />} />
              <Text size="xs" color="muted">Medium</Text>
            </VStack>
            <VStack gap="xs" style={{ alignItems: 'center' }}>
              <FloatButton size="lg" icon={<Add20Regular />} />
              <Text size="xs" color="muted">Large</Text>
            </VStack>
          </HStack>
        )
      },
      {
        title: 'Fixed Position Usage',
        code: `// Use inline={false} for fixed positioning
<FloatButton
  icon={<Add20Regular />}
  tooltip="Create new item"
  inline={false}
  position="bottom-right"
  onClick={() => setShowModal(true)}
/>`,
        render: (
          <VStack gap="md" style={{ alignItems: 'center' }}>
            <Text size="sm" color="muted">
              Set inline=false to fix the button to a screen corner
            </Text>
            <FloatButton icon={<Add20Regular />} variant="gradient" />
          </VStack>
        )
      }
    ]
  },
  grid: {
    name: 'Grid',
    description: 'Responsive grid layout with customizable columns per breakpoint.',
    importCode: `import { Grid, Container, Box } from 'wss3-forge'`,
    basicUsage: `<Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>`,
    usage: [
      'Use for responsive layouts',
      'Columns can vary by breakpoint',
      'Gap supports size tokens',
      'Container for max-width content'
    ],
    props: [
      { name: 'columns', type: 'number | ResponsiveValue<number>', default: '1', description: 'Number of columns' },
      { name: 'gap', type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Gap between items' },
      { name: 'rowGap', type: 'string', default: '-', description: 'Vertical gap override' },
      { name: 'columnGap', type: 'string', default: '-', description: 'Horizontal gap override' }
    ],
    examples: [
      {
        title: 'Fixed Columns',
        code: `<Grid columns={3} gap="md">
  <Card padding="md">1</Card>
  <Card padding="md">2</Card>
  <Card padding="md">3</Card>
  <Card padding="md">4</Card>
  <Card padding="md">5</Card>
  <Card padding="md">6</Card>
</Grid>`,
        render: (
          <Grid columns={3} gap="md" style={{ textAlign: 'center' }}>
            <Card padding="md">1</Card>
            <Card padding="md">2</Card>
            <Card padding="md">3</Card>
            <Card padding="md">4</Card>
            <Card padding="md">5</Card>
            <Card padding="md">6</Card>
          </Grid>
        )
      },
      {
        title: 'Responsive Columns',
        code: `<Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
  <Card padding="md">Item 1</Card>
  <Card padding="md">Item 2</Card>
  <Card padding="md">Item 3</Card>
  <Card padding="md">Item 4</Card>
</Grid>`,
        render: (
          <Grid columns={{ xs: 1, sm: 2 }} gap="md" style={{ textAlign: 'center' }}>
            <Card padding="md">Item 1</Card>
            <Card padding="md">Item 2</Card>
            <Card padding="md">Item 3</Card>
            <Card padding="md">Item 4</Card>
          </Grid>
        )
      },
      {
        title: 'Gap Variations',
        code: `<Grid columns={2} gap="lg">
  <Card padding="lg">Large gap</Card>
  <Card padding="lg">Between items</Card>
</Grid>`,
        render: (
          <Grid columns={2} gap="lg" style={{ textAlign: 'center' }}>
            <Card padding="lg">Large gap</Card>
            <Card padding="lg">Between items</Card>
          </Grid>
        )
      },
      {
        title: 'Dashboard Layout',
        code: `<Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="md">
  <StatCard icon={<People20Regular />} label="Users" value="1,234" color="var(--brand-primary)" />
  <StatCard icon={<Money20Regular />} label="Revenue" value="$45K" color="var(--color-success)" />
  <StatCard icon={<Cart20Regular />} label="Orders" value="856" color="var(--color-warning)" />
</Grid>`,
        render: (
          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            <StatCard icon={<People20Regular />} label="Users" value="1,234" color="var(--brand-primary)" />
            <StatCard icon={<Money20Regular />} label="Revenue" value="$45K" color="var(--color-success)" />
          </Grid>
        )
      }
    ]
  },
  textarea: {
    name: 'Textarea',
    description: 'Multi-line text input for longer content like comments and descriptions.',
    importCode: `import { Textarea } from 'wss3-forge'`,
    basicUsage: `<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
/>`,
    usage: [
      'Use for multi-line text input',
      'Set rows for initial height',
      'Add maxLength for character limits',
      'Use resize prop to control resizing'
    ],
    props: [
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text' },
      { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows' },
      { name: 'maxLength', type: 'number', default: '-', description: 'Maximum characters' },
      { name: 'resize', type: '"none" | "vertical" | "horizontal" | "both"', default: '"vertical"', description: 'Resize behavior' },
      { name: 'error', type: 'string', default: '-', description: 'Error message' }
    ],
    examples: [
      {
        title: 'Basic Textarea',
        code: `<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
/>`,
        render: <Textarea label="Description" placeholder="Enter description..." rows={4} />
      },
      {
        title: 'With Character Limit',
        code: `<Textarea
  label="Bio"
  placeholder="Tell us about yourself..."
  maxLength={200}
  rows={3}
/>`,
        render: <Textarea label="Bio" placeholder="Tell us about yourself..." maxLength={200} rows={3} />
      },
      {
        title: 'With Error',
        code: `<Textarea
  label="Comment"
  error="Comment is required"
  rows={3}
/>`,
        render: <Textarea label="Comment" error="Comment is required" rows={3} />
      },
      {
        title: 'Disabled',
        code: `<Textarea
  label="Notes"
  value="This field is disabled"
  disabled
  rows={2}
/>`,
        render: <Textarea label="Notes" value="This field is disabled" disabled rows={2} />
      }
    ]
  },
  select: {
    name: 'Select',
    description: 'Dropdown select for choosing from a list of options.',
    importCode: `import { Select } from 'wss3-forge'`,
    basicUsage: `<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
  value={country}
  onChange={setCountry}
/>`,
    usage: [
      'Use for selecting from predefined options',
      'Add placeholder for empty state',
      'Use Dropdown for action menus instead',
      'Supports disabled options'
    ],
    props: [
      { name: 'options', type: 'SelectOption[]', default: '-', description: 'Array of options' },
      { name: 'value', type: 'string', default: '-', description: 'Selected value' },
      { name: 'onChange', type: '(value: string) => void', default: '-', description: 'Change handler' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text' },
      { name: 'error', type: 'string', default: '-', description: 'Error message' }
    ],
    examples: [
      {
        title: 'Basic Select',
        code: `<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
/>`,
        render: (
          <Select
            label="Country"
            placeholder="Select a country"
            options={[
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'uk', label: 'United Kingdom' }
            ]}
          />
        )
      },
      {
        title: 'With Error',
        code: `<Select
  label="Category"
  error="Please select a category"
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' }
  ]}
/>`,
        render: (
          <Select
            label="Category"
            error="Please select a category"
            options={[
              { value: 'tech', label: 'Technology' },
              { value: 'design', label: 'Design' }
            ]}
          />
        )
      },
      {
        title: 'Disabled',
        code: `<Select
  label="Status"
  disabled
  value="active"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>`,
        render: (
          <Select
            label="Status"
            disabled
            value="active"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        )
      }
    ]
  },
  checkbox: {
    name: 'Checkbox',
    description: 'Checkbox input for boolean or multiple selection in forms.',
    importCode: `import { Checkbox, FormGroup } from 'wss3-forge'`,
    basicUsage: `<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label="I agree to the terms"
/>

<FormGroup label="Select options">
  <Checkbox label="Option A" />
  <Checkbox label="Option B" />
  <Checkbox label="Option C" />
</FormGroup>`,
    usage: [
      'Use for boolean options in forms',
      'FormGroup for grouping multiple checkboxes',
      'Use Switch for immediate effect settings',
      'Supports indeterminate state'
    ],
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state' },
      { name: 'onChange', type: '(checked: boolean) => void', default: '-', description: 'Change handler' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Indeterminate state' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' }
    ],
    examples: [
      {
        title: 'Basic Checkbox',
        code: `<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={setAgreed}
/>`,
        render: <Checkbox label="I agree to the terms" checked={false} onChange={() => {}} />
      },
      {
        title: 'Multiple Checkboxes',
        code: `<VStack gap="sm">
  <Checkbox label="Email" checked={email} onChange={setEmail} />
  <Checkbox label="SMS" checked={sms} onChange={setSms} />
  <Checkbox label="Push" checked={push} onChange={setPush} />
</VStack>`,
        render: (
          <VStack gap="sm">
            <Checkbox label="Email notifications" checked={false} onChange={() => {}} />
            <Checkbox label="SMS notifications" checked={false} onChange={() => {}} />
            <Checkbox label="Push notifications" checked={true} onChange={() => {}} />
          </VStack>
        )
      },
      {
        title: 'States',
        code: `<Checkbox label="Unchecked" checked={false} onChange={...} />
<Checkbox label="Checked" checked={true} onChange={...} />
<Checkbox label="Disabled" checked={false} onChange={...} disabled />`,
        render: (
          <VStack gap="sm">
            <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
            <Checkbox label="Checked" checked={true} onChange={() => {}} />
            <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
          </VStack>
        )
      }
    ]
  },
  radio: {
    name: 'Radio',
    description: 'Radio buttons for single selection from multiple options.',
    importCode: `import { Radio, RadioGroup, RadioCardGroup } from 'wss3-forge'`,
    basicUsage: `<RadioGroup
  value={plan}
  onChange={setPlan}
  label="Select a plan"
>
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
  <Radio value="enterprise" label="Enterprise" />
</RadioGroup>`,
    usage: [
      'Use RadioGroup to manage selection',
      'RadioCardGroup for card-style selection',
      'Use for mutually exclusive options',
      'Prefer Select for many options'
    ],
    props: [
      { name: 'value', type: 'string', default: '-', description: 'Selected value' },
      { name: 'onChange', type: '(value: string) => void', default: '-', description: 'Change handler' },
      { name: 'label', type: 'string', default: '-', description: 'Group label' },
      { name: 'orientation', type: '"horizontal" | "vertical"', default: '"vertical"', description: 'Layout direction' }
    ],
    examples: [
      {
        title: 'Basic Radio Group',
        code: `<VStack gap="sm">
  <Radio name="plan" label="Free" value="free" checked={plan === 'free'} onChange={() => setPlan('free')} />
  <Radio name="plan" label="Pro" value="pro" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
  <Radio name="plan" label="Enterprise" value="enterprise" checked={plan === 'enterprise'} onChange={() => setPlan('enterprise')} />
</VStack>`,
        render: (
          <VStack gap="sm">
            <Radio name="plan" label="Free" value="free" checked={false} onChange={() => {}} />
            <Radio name="plan" label="Pro" value="pro" checked={true} onChange={() => {}} />
            <Radio name="plan" label="Enterprise" value="enterprise" checked={false} onChange={() => {}} />
          </VStack>
        )
      },
      {
        title: 'Horizontal Layout',
        code: `<HStack gap="lg">
  <Radio name="size" label="Small" value="sm" checked={size === 'sm'} onChange={...} />
  <Radio name="size" label="Medium" value="md" checked={size === 'md'} onChange={...} />
  <Radio name="size" label="Large" value="lg" checked={size === 'lg'} onChange={...} />
</HStack>`,
        render: (
          <HStack gap="lg" style={{ flexWrap: 'wrap' }}>
            <Radio name="size" label="Small" value="sm" checked={false} onChange={() => {}} />
            <Radio name="size" label="Medium" value="md" checked={true} onChange={() => {}} />
            <Radio name="size" label="Large" value="lg" checked={false} onChange={() => {}} />
          </HStack>
        )
      },
      {
        title: 'Disabled State',
        code: `<Radio name="opt" label="Available" value="a" checked={true} onChange={...} />
<Radio name="opt" label="Disabled" value="b" checked={false} onChange={...} disabled />`,
        render: (
          <VStack gap="sm">
            <Radio name="disabled" label="Available" value="a" checked={true} onChange={() => {}} />
            <Radio name="disabled" label="Disabled option" value="b" checked={false} onChange={() => {}} disabled />
          </VStack>
        )
      }
    ]
  },
  datepicker: {
    name: 'DatePicker',
    description: 'Date selection with calendar popup. Supports date ranges and time.',
    importCode: `import { DatePicker, DateTimePicker } from 'wss3-forge'`,
    basicUsage: `<DatePicker
  value={date}
  onChange={setDate}
  label="Select date"
/>

<DateTimePicker
  value={datetime}
  onChange={setDatetime}
  label="Select date and time"
/>`,
    usage: [
      'Use DatePicker for date-only selection',
      'DateTimePicker includes time selection',
      'Supports min/max date constraints',
      'Format customizable'
    ],
    props: [
      { name: 'value', type: 'Date | null', default: '-', description: 'Selected date' },
      { name: 'onChange', type: '(date: Date | null) => void', default: '-', description: 'Change handler' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'minDate', type: 'Date', default: '-', description: 'Minimum selectable date' },
      { name: 'maxDate', type: 'Date', default: '-', description: 'Maximum selectable date' },
      { name: 'format', type: 'string', default: '"dd/MM/yyyy"', description: 'Date format' }
    ],
    examples: [
      {
        title: 'Basic DatePicker',
        code: `const [date, setDate] = useState<Date | null>(null)

<DatePicker
  value={date}
  onChange={setDate}
  label="Select date"
/>`,
        render: <DatePicker value={null} onChange={() => {}} label="Select date" />
      },
      {
        title: 'With Placeholder',
        code: `<DatePicker
  value={date}
  onChange={setDate}
  label="Birthday"
  placeholder="Choose your birthday"
/>`,
        render: <DatePicker value={null} onChange={() => {}} label="Birthday" placeholder="Choose your birthday" />
      },
      {
        title: 'Pre-selected Date',
        code: `<DatePicker
  value={new Date()}
  onChange={setDate}
  label="Event date"
/>`,
        render: <DatePicker value={new Date()} onChange={() => {}} label="Event date" />
      }
    ]
  },
  colorpicker: {
    name: 'ColorPicker',
    description: 'Color selection with preset colors and custom color input.',
    importCode: `import { ColorPicker, ColorSwatch, ColorPalette } from 'wss3-forge'`,
    basicUsage: `<ColorPicker
  value={color}
  onChange={setColor}
  label="Choose a color"
/>

<ColorPalette
  colors={['#FF0000', '#00FF00', '#0000FF']}
  selected={color}
  onSelect={setColor}
/>`,
    usage: [
      'Includes preset color swatches',
      'Supports custom hex input',
      'ColorPalette for simple color selection',
      'ColorSwatch for displaying a color'
    ],
    props: [
      { name: 'value', type: 'string', default: '-', description: 'Selected color (hex)' },
      { name: 'onChange', type: '(color: string) => void', default: '-', description: 'Change handler' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' },
      { name: 'colors', type: 'string[]', default: 'PRESET_COLORS', description: 'Preset color options' },
      { name: 'showInput', type: 'boolean', default: 'false', description: 'Show hex input field' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Swatch size' }
    ],
    examples: [
      {
        title: 'Basic ColorPicker',
        code: `const [color, setColor] = useState('#A35BFF')

<ColorPicker
  value={color}
  onChange={setColor}
  label="Brand color"
/>`,
        render: <ColorPicker value="#A35BFF" onChange={() => {}} label="Brand color" />
      },
      {
        title: 'With Hex Input',
        code: `<ColorPicker
  value={color}
  onChange={setColor}
  label="Custom color"
  showInput
/>`,
        render: <ColorPicker value="#10b981" onChange={() => {}} label="Custom color" showInput />
      },
      {
        title: 'Custom Colors',
        code: `<ColorPicker
  value={color}
  onChange={setColor}
  label="Theme color"
  colors={['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']}
/>`,
        render: <ColorPicker value="#ff0000" onChange={() => {}} label="Theme color" colors={['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']} />
      }
    ]
  },
  fileupload: {
    name: 'FileUpload',
    description: 'File upload with drag-and-drop support and preview.',
    importCode: `import { FileUpload, AvatarUpload } from 'wss3-forge'`,
    basicUsage: `<FileUpload
  onFilesSelected={handleFiles}
  accept="image/*"
  multiple
/>

<AvatarUpload
  value={avatarUrl}
  onChange={setAvatarUrl}
/>`,
    usage: [
      'Supports drag-and-drop',
      'AvatarUpload for profile pictures',
      'Set accept for file type filtering',
      'multiple for multi-file upload'
    ],
    props: [
      { name: 'onFilesSelected', type: '(files: File[]) => void', default: '-', description: 'Upload handler' },
      { name: 'accept', type: 'string', default: '-', description: 'Accepted file types' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
      { name: 'maxSize', type: 'number', default: '-', description: 'Max file size in bytes' },
      { name: 'maxFiles', type: 'number', default: '10', description: 'Max number of files' },
      { name: 'variant', type: '"dropzone" | "button" | "compact"', default: '"dropzone"', description: 'Upload style' },
      { name: 'showPreview', type: 'boolean', default: 'true', description: 'Show file preview' }
    ],
    examples: [
      {
        title: 'Dropzone (Default)',
        code: `<FileUpload
  onFilesSelected={(files) => console.log(files)}
  accept="image/*"
  label="Drop images here"
  description="or click to browse"
/>`,
        render: <FileUpload onFilesSelected={() => {}} accept="image/*" label="Drop images here" description="or click to browse" />
      },
      {
        title: 'Multiple Files',
        code: `<FileUpload
  onFilesSelected={(files) => console.log(files)}
  multiple
  maxFiles={5}
  label="Upload documents"
/>`,
        render: <FileUpload onFilesSelected={() => {}} multiple maxFiles={5} label="Upload documents" />
      },
      {
        title: 'Button Variant',
        code: `<FileUpload
  onFilesSelected={(files) => console.log(files)}
  variant="button"
  accept=".pdf,.doc,.docx"
/>`,
        render: <FileUpload onFilesSelected={() => {}} variant="button" accept=".pdf,.doc,.docx" />
      },
      {
        title: 'Compact Variant',
        code: `<FileUpload
  onFilesSelected={(files) => console.log(files)}
  variant="compact"
  accept="image/*"
/>`,
        render: <FileUpload onFilesSelected={() => {}} variant="compact" accept="image/*" />
      }
    ]
  },
  taginput: {
    name: 'TagInput',
    description: 'Input for entering multiple tags or values.',
    importCode: `import { TagInput, EmailTagInput } from 'wss3-forge'`,
    basicUsage: `<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add tags..."
/>

<EmailTagInput
  value={emails}
  onChange={setEmails}
  placeholder="Add email addresses..."
/>`,
    usage: [
      'Press Enter or comma to add tag',
      'EmailTagInput validates email format',
      'Tags can be removed by clicking X',
      'Supports max tags limit'
    ],
    props: [
      { name: 'value', type: 'string[]', default: '[]', description: 'Array of tags' },
      { name: 'onChange', type: '(tags: string[]) => void', default: '-', description: 'Change handler' },
      { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text' },
      { name: 'maxTags', type: 'number', default: '-', description: 'Maximum number of tags' }
    ],
    examples: [
      {
        title: 'Basic TagInput',
        code: `const [tags, setTags] = useState<string[]>([])

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add tags..."
/>`,
        render: <TagInput value={['React', 'TypeScript']} onChange={() => {}} placeholder="Add tags..." />
      },
      {
        title: 'With Max Tags',
        code: `<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add up to 5 tags..."
  maxTags={5}
/>`,
        render: <TagInput value={['Design', 'UI', 'UX']} onChange={() => {}} placeholder="Add up to 5 tags..." maxTags={5} />
      }
    ]
  },
  numberinput: {
    name: 'NumberInput',
    description: 'Numeric input with increment/decrement buttons.',
    importCode: `import { NumberInput } from 'wss3-forge'`,
    basicUsage: `<NumberInput
  value={quantity}
  onChange={setQuantity}
  min={0}
  max={100}
  step={1}
  label="Quantity"
/>`,
    usage: [
      'Use for numeric values',
      'Set min/max for constraints',
      'Step controls increment amount',
      'Keyboard arrows work'
    ],
    props: [
      { name: 'value', type: 'number', default: '-', description: 'Current value' },
      { name: 'onChange', type: '(value: number) => void', default: '-', description: 'Change handler' },
      { name: 'min', type: 'number', default: '-', description: 'Minimum value' },
      { name: 'max', type: 'number', default: '-', description: 'Maximum value' },
      { name: 'step', type: 'number', default: '1', description: 'Increment step' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' }
    ],
    examples: [
      {
        title: 'Basic NumberInput',
        code: `const [quantity, setQuantity] = useState(1)

<NumberInput
  value={quantity}
  onChange={setQuantity}
  label="Quantity"
/>`,
        render: <NumberInput value={1} onChange={() => {}} label="Quantity" />
      },
      {
        title: 'With Min/Max',
        code: `<NumberInput
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={5}
  label="Volume"
/>`,
        render: <NumberInput value={50} onChange={() => {}} min={0} max={100} step={5} label="Volume" />
      }
    ]
  },
  otpinput: {
    name: 'OTPInput',
    description: 'One-time password / verification code input with auto-focus.',
    importCode: `import { OTPInput, PINInput } from 'wss3-forge'`,
    basicUsage: `<OTPInput
  length={6}
  onComplete={handleVerify}
/>

<PINInput
  length={4}
  masked
  onComplete={handlePIN}
/>`,
    usage: [
      'Auto-focuses next input on entry',
      'PINInput for masked PIN codes',
      'Supports paste from clipboard',
      'onComplete fires when all digits entered'
    ],
    props: [
      { name: 'length', type: 'number', default: '6', description: 'Number of digits' },
      { name: 'onComplete', type: '(code: string) => void', default: '-', description: 'Complete handler' },
      { name: 'onChange', type: '(code: string) => void', default: '-', description: 'Change handler' },
      { name: 'masked', type: 'boolean', default: 'false', description: 'Hide digits' }
    ],
    examples: [
      {
        title: 'Verification Code (6 digits)',
        code: `<OTPInput
  length={6}
  onComplete={(code) => console.log('Code:', code)}
/>`,
        render: <OTPInput length={6} onComplete={() => {}} />
      },
      {
        title: 'PIN Code (4 digits)',
        code: `<OTPInput
  length={4}
  onComplete={(pin) => console.log('PIN:', pin)}
/>`,
        render: <OTPInput length={4} onComplete={() => {}} />
      }
    ]
  },
  phoneinput: {
    name: 'PhoneInput',
    description: 'Phone number input with country code selector.',
    importCode: `import { PhoneInput, COUNTRIES } from 'wss3-forge'`,
    basicUsage: `<PhoneInput
  value={phone}
  onChange={setPhone}
  defaultCountry="US"
  label="Phone number"
/>`,
    usage: [
      'Includes country code dropdown',
      'Formats number as you type',
      'Validates phone format',
      'Supports all countries'
    ],
    props: [
      { name: 'value', type: 'string', default: '-', description: 'Phone number value' },
      { name: 'onChange', type: '(value: string) => void', default: '-', description: 'Change handler' },
      { name: 'defaultCountry', type: 'string', default: '"US"', description: 'Default country code' },
      { name: 'label', type: 'string', default: '-', description: 'Label text' }
    ],
    examples: [
      {
        title: 'Basic PhoneInput',
        code: `const [phone, setPhone] = useState('')

<PhoneInput
  value={phone}
  onChange={setPhone}
  label="Phone number"
/>`,
        render: <PhoneInput value="" onChange={() => {}} label="Phone number" />
      },
      {
        title: 'With Default Country',
        code: `<PhoneInput
  value={phone}
  onChange={setPhone}
  defaultCountry="FR"
  label="Numéro de téléphone"
/>`,
        render: <PhoneInput value="" onChange={() => {}} defaultCountry="FR" label="Numéro de téléphone" />
      }
    ]
  },
  navbar: {
    name: 'Navbar',
    description: 'Top navigation bar with logo, links, and actions.',
    importCode: `import { Navbar, BottomNav, TopBar } from 'wss3-forge'`,
    basicUsage: `<Navbar
  logo={<Logo />}
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'docs', label: 'Docs', href: '/docs' }
  ]}
  actions={<Button>Sign In</Button>}
/>`,
    usage: [
      'Use for main site navigation',
      'BottomNav for mobile tab bar',
      'TopBar for simpler app headers',
      'Sticky by default'
    ],
    props: [
      { name: 'logo', type: 'ReactNode', default: 'Webba logo', description: 'Logo element' },
      { name: 'items', type: 'NavbarItem[]', default: '[]', description: 'Navigation items' },
      { name: 'activeId', type: 'string', default: '"home"', description: 'Active item ID' },
      { name: 'onNavigate', type: '(id: string) => void', default: '-', description: 'Navigation handler' },
      { name: 'actions', type: 'ReactNode', default: '-', description: 'Right-side actions' },
      { name: 'showSearch', type: 'boolean', default: 'true', description: 'Show search button' },
      { name: 'sticky', type: 'boolean', default: 'true', description: 'Stick to top' },
      { name: 'transparent', type: 'boolean', default: 'false', description: 'Transparent background' },
      { name: 'variant', type: '"default" | "centered" | "minimal"', default: '"default"', description: 'Navbar style' }
    ],
    examples: [
      {
        title: 'Default Navbar',
        code: `<Navbar
  items={[
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' }
  ]}
  activeId="home"
  onNavigate={(id) => console.log(id)}
/>`,
        render: <Navbar items={[{ id: 'home', label: 'Home' }, { id: 'products', label: 'Products' }, { id: 'about', label: 'About' }]} activeId="home" onNavigate={() => {}} sticky={false} />
      },
      {
        title: 'Without Search',
        code: `<Navbar
  items={[
    { id: 'home', label: 'Home' },
    { id: 'docs', label: 'Docs' },
    { id: 'contact', label: 'Contact' }
  ]}
  activeId="docs"
  showSearch={false}
/>`,
        render: <Navbar items={[{ id: 'home', label: 'Home' }, { id: 'docs', label: 'Docs' }, { id: 'contact', label: 'Contact' }]} activeId="docs" showSearch={false} sticky={false} />
      }
    ]
  },
  stepper: {
    name: 'Stepper',
    description: 'Multi-step wizard with progress indicator.',
    importCode: `import { Stepper, StepContent, StepActions, useStepper } from 'wss3-forge'`,
    basicUsage: `const { currentStep, next, prev } = useStepper(3)

<Stepper
  steps={[
    { id: 'account', title: 'Account' },
    { id: 'profile', title: 'Profile' },
    { id: 'review', title: 'Review' }
  ]}
  currentStep={currentStep}
/>

<StepContent step={0} currentStep={currentStep}>
  Account form...
</StepContent>`,
    usage: [
      'useStepper hook for step management',
      'StepContent for conditional rendering',
      'StepActions for navigation buttons',
      'Supports vertical orientation'
    ],
    props: [
      { name: 'steps', type: 'StepItem[]', default: '-', description: 'Step definitions' },
      { name: 'currentStep', type: 'number', default: '0', description: 'Active step index' },
      { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction' }
    ],
    examples: [
      {
        title: 'Horizontal Stepper',
        code: `<Stepper
  steps={[
    { id: 'account', title: 'Account' },
    { id: 'profile', title: 'Profile' },
    { id: 'review', title: 'Review' }
  ]}
  currentStep={0}
/>`,
        render: <Stepper steps={[{ id: 'account', title: 'Account' }, { id: 'profile', title: 'Profile' }, { id: 'review', title: 'Review' }]} currentStep={0} />
      },
      {
        title: 'Step 2 Active',
        code: `<Stepper
  steps={[
    { id: 'account', title: 'Account' },
    { id: 'profile', title: 'Profile' },
    { id: 'review', title: 'Review' }
  ]}
  currentStep={1}
/>`,
        render: <Stepper steps={[{ id: 'account', title: 'Account' }, { id: 'profile', title: 'Profile' }, { id: 'review', title: 'Review' }]} currentStep={1} />
      },
      {
        title: 'Completed Steps',
        code: `<Stepper
  steps={[
    { id: 'account', title: 'Account' },
    { id: 'profile', title: 'Profile' },
    { id: 'review', title: 'Review' }
  ]}
  currentStep={2}
/>`,
        render: <Stepper steps={[{ id: 'account', title: 'Account' }, { id: 'profile', title: 'Profile' }, { id: 'review', title: 'Review' }]} currentStep={2} />
      }
    ]
  },
  footer: {
    name: 'Footer',
    description: 'Page footer with logo, navigation links, social links, and copyright.',
    importCode: `import { Footer, SimpleFooter } from 'wss3-forge'`,
    basicUsage: `<Footer
  tagline="A modern React component library."
  sections={[
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Components', href: '/docs/components' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', href: 'https://discord.gg/xxx' },
        { label: 'Twitter', href: 'https://twitter.com/xxx' }
      ]
    }
  ]}
  copyright="© 2025 My Company. All rights reserved."
/>`,
    usage: [
      'Use at the bottom of every page',
      'Default variant shows logo, tagline, and link sections',
      'Minimal variant for simple one-line footer',
      'Centered variant for marketing pages',
      'SimpleFooter for quick copyright-only footer',
      'logoHref makes the logo clickable'
    ],
    props: [
      { name: 'logo', type: 'ReactNode', default: 'Webba logo', description: 'Logo element' },
      { name: 'logoHref', type: 'string', default: '-', description: 'URL to link logo to' },
      { name: 'tagline', type: 'string', default: '-', description: 'Brand tagline text' },
      { name: 'sections', type: 'FooterSection[]', default: '[]', description: 'Link sections with title and links' },
      { name: 'socialLinks', type: 'ReactNode', default: '-', description: 'Social media icons' },
      { name: 'copyright', type: 'string', default: 'Auto-generated', description: 'Copyright text' },
      { name: 'bottomLinks', type: 'FooterLink[]', default: '-', description: 'Bottom bar links' },
      { name: 'variant', type: '"default" | "minimal" | "centered"', default: '"default"', description: 'Footer style' }
    ],
    examples: [
      {
        title: 'Default Footer',
        code: `<Footer
  tagline="Building the future of web development."
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    }
  ]}
  copyright="© 2025 My Company."
/>`,
        render: <Footer tagline="Building the future of web development." sections={[{ title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }] }, { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Contact', href: '#' }] }]} copyright="© 2025 My Company." />
      },
      {
        title: 'Minimal Footer',
        code: `<Footer
  variant="minimal"
  copyright="© 2025 My App"
  bottomLinks={[
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' }
  ]}
/>`,
        render: <Footer variant="minimal" copyright="© 2025 My App" bottomLinks={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }]} />
      },
      {
        title: 'Centered Footer',
        code: `<Footer
  variant="centered"
  tagline="Made with love by developers, for developers."
  copyright="© 2025 DevCo"
/>`,
        render: <Footer variant="centered" tagline="Made with love by developers, for developers." copyright="© 2025 DevCo" />
      },
      {
        title: 'Simple Footer',
        code: `<SimpleFooter
  companyName="Webba"
  links={[
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' }
  ]}
/>`,
        render: <SimpleFooter companyName="Webba" links={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }]} />
      }
    ]
  },
  sheet: {
    name: 'Sheet',
    description: 'Slide-in panel from the edge of the screen for secondary content.',
    importCode: `import { Sheet, SidePanel, BottomSheet } from 'wss3-forge'`,
    basicUsage: `const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Open Sheet</Button>

<Sheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  position="right"
  title="Settings"
  subtitle="Manage your preferences"
>
  <VStack gap="md">
    <Switch label="Dark Mode" />
    <Switch label="Notifications" />
  </VStack>
</Sheet>`,
    usage: [
      'Use for secondary content, forms, and settings',
      'SidePanel alias for Sheet',
      'BottomSheet for mobile-friendly bottom panels',
      'Closes on backdrop click and Escape key'
    ],
    props: [
      { name: 'open', type: 'boolean', default: 'false', description: 'Open state' },
      { name: 'onClose', type: '() => void', default: '-', description: 'Close handler' },
      { name: 'position', type: '"left" | "right"', default: '"right"', description: 'Slide direction' },
      { name: 'size', type: '"sm" | "md" | "lg" | "xl" | "full"', default: '"md"', description: 'Sheet width' },
      { name: 'title', type: 'string', default: '-', description: 'Sheet title' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Sheet subtitle' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Header icon' },
      { name: 'footer', type: 'ReactNode', default: '-', description: 'Footer content' }
    ],
    examples: [
      {
        title: 'Settings Sheet (Right Position)',
        code: `<Sheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  position="right"
  title="Settings"
  subtitle="Manage your preferences"
>
  <VStack gap="lg">
    <Switch label="Dark Mode" />
    <Switch label="Notifications" />
    <Switch label="Auto-save" />
  </VStack>
</Sheet>`,
        render: (
          <div style={{ width: '100%', maxWidth: 440, marginLeft: 'auto', height: 400, borderRadius: '16px 0 0 16px', background: 'var(--bg-secondary)', boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem 1.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>Settings</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.125rem 0 0', lineHeight: 1.4 }}>Manage your preferences</p>
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Dismiss20Regular />
              </button>
            </div>
            <div style={{ padding: '0.5rem 1.75rem 1.5rem', flex: 1 }}>
              <VStack gap="lg">
                <VStack gap="sm">
                  <Text weight="medium">Appearance</Text>
                  <Switch label="Dark Mode" checked={true} onChange={() => {}} />
                </VStack>
                <VStack gap="sm">
                  <Text weight="medium">Notifications</Text>
                  <Switch label="Email notifications" checked={true} onChange={() => {}} />
                  <Switch label="Push notifications" checked={false} onChange={() => {}} />
                </VStack>
              </VStack>
            </div>
          </div>
        )
      },
      {
        title: 'Sheet with Footer Actions',
        code: `<Sheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  footer={
    <HStack gap="sm" style={{ justifyContent: 'flex-end' }}>
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </HStack>
  }
>
  <Input label="Name" />
  <Input label="Email" />
</Sheet>`,
        render: (
          <div style={{ width: '100%', maxWidth: 440, marginLeft: 'auto', height: 400, borderRadius: '16px 0 0 16px', background: 'var(--bg-secondary)', boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem 1.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>Edit Profile</h2>
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Dismiss20Regular />
              </button>
            </div>
            <div style={{ padding: '0.5rem 1.75rem 1.5rem', flex: 1 }}>
              <VStack gap="md">
                <Input label="Name" placeholder="John Doe" />
                <Input label="Email" placeholder="john@example.com" />
              </VStack>
            </div>
            <div style={{ padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button variant="secondary">Cancel</Button>
              <Button>Save</Button>
            </div>
          </div>
        )
      }
    ]
  },
  popover: {
    name: 'Popover',
    description: 'Floating content triggered by click, like a mini dialog.',
    importCode: `import { Popover, HoverCard } from 'wss3-forge'`,
    basicUsage: `<Popover
  trigger={<Button>Click me</Button>}
  content={
    <VStack gap="sm">
      <Text weight="medium">Quick Actions</Text>
      <Button size="sm" fullWidth>Edit</Button>
      <Button size="sm" fullWidth variant="secondary">Share</Button>
    </VStack>
  }
/>`,
    usage: [
      'Use for interactive floating content',
      'HoverCard for hover-triggered content',
      'Closes on outside click and Escape',
      'Position and align control placement'
    ],
    props: [
      { name: 'trigger', type: 'ReactNode', default: '-', description: 'Trigger element' },
      { name: 'content', type: 'ReactNode', default: '-', description: 'Popover content' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: 'Popover position' },
      { name: 'align', type: '"start" | "center" | "end"', default: '"start"', description: 'Popover alignment' },
      { name: 'open', type: 'boolean', default: '-', description: 'Controlled open state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '-', description: 'Open state handler' },
      { name: 'width', type: 'number | "trigger" | "auto"', default: '"auto"', description: 'Popover width' }
    ],
    examples: [
      {
        title: 'User Profile Popover',
        code: `<Popover
  trigger={<Button variant="secondary">View Profile</Button>}
  content={
    <VStack gap="sm" style={{ minWidth: 200 }}>
      <HStack gap="sm">
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>JD</div>
        <VStack gap="xs">
          <Text weight="medium">John Doe</Text>
          <Text size="sm" color="muted">john@example.com</Text>
        </VStack>
      </HStack>
      <Divider />
      <Button size="sm" fullWidth variant="secondary">View Full Profile</Button>
    </VStack>
  }
/>`,
        render: (
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Popover
              trigger={<Button variant="secondary">View Profile</Button>}
              content={
                <VStack gap="sm" style={{ minWidth: 200 }}>
                  <HStack gap="sm">
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>JD</div>
                    <VStack gap="xs">
                      <Text weight="medium">John Doe</Text>
                      <Text size="sm" color="muted">john@example.com</Text>
                    </VStack>
                  </HStack>
                  <Divider />
                  <Button size="sm" fullWidth variant="secondary">View Full Profile</Button>
                </VStack>
              }
            />
          </div>
        )
      }
    ]
  },
  commandbar: {
    name: 'CommandBar',
    description: 'Command palette / spotlight search with AI integration. Supports two modes: search mode and AI mode.',
    importCode: `import { CommandBar } from 'wss3-forge'`,
    basicUsage: `<CommandBar
  open={open}
  onClose={() => setOpen(false)}
  placeholder="Search or ask..."
  onSearch={(query) => searchItems(query)}
  onResultSelect={(result) => navigate(result.route)}
  onAiQuery={async (query) => {
    const response = await askAI(query)
    return { type: 'info', message: response }
  }}
  onAiAction={(response) => handleAiAction(response)}
/>`,
    usage: [
      'SEARCH MODE: Type keywords like "dashboard" → shows matching results',
      'AI MODE: Type questions or commands like "how do I add a user?" → activates AI',
      'AI triggers: questions (how/what/where), commands (show/create/add), or ending with ?',
      'Keyboard: Cmd+K to open, arrows to navigate, Enter to select, ESC to close'
    ],
    props: [
      { name: 'open', type: 'boolean', default: 'false', description: 'Open state' },
      { name: 'onClose', type: '() => void', default: '-', description: 'Close handler' },
      { name: 'placeholder', type: 'string', default: '"Search..."', description: 'Input placeholder' },
      { name: 'onSearch', type: '(query: string) => SearchResult[]', default: '-', description: 'Search function (for search mode)' },
      { name: 'onResultSelect', type: '(result: SearchResult) => void', default: '-', description: 'Result selection handler' },
      { name: 'onAiQuery', type: '(query: string) => Promise<AIResponse>', default: '-', description: 'AI query handler (for AI mode)' },
      { name: 'onAiAction', type: '(response: AIResponse) => void', default: '-', description: 'Handler when user clicks AI action button' },
      { name: 'isNaturalLanguage', type: '(query: string) => boolean', default: 'auto-detect', description: 'Custom function to detect AI mode' }
    ],
    examples: [
      {
        title: 'Search Mode - Triggered by keywords (e.g. "dashboard", "settings")',
        code: `// User types: "dash"
// → Search icon shown, results appear below

<CommandBar
  open={true}
  onSearch={(query) => items.filter(i => i.title.includes(query))}
  onResultSelect={(result) => navigate(result.route)}
/>`,
        render: (
          <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <Search20Regular style={{ color: 'var(--text-muted)' }} />
              <span style={{ flex: 1, color: 'var(--text-primary)' }}>dash</span>
              <kbd style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESC</kbd>
            </div>
            <div>
              <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Dashboard</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Main dashboard</div>
                </div>
                <span style={{ padding: '0.125rem 0.5rem', background: 'var(--bg-secondary)', borderRadius: 4, fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>page</span>
              </div>
              <div style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Dashboard Settings</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Configure dashboard</div>
                </div>
                <span style={{ padding: '0.125rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>settings</span>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'AI Mode - Triggered by natural language (questions, commands)',
        code: `// User types: "how do I create a modal?"
// → Sparkle icon shown with glow effect, "Ask" button appears

<CommandBar
  open={true}
  onAiQuery={async (query) => {
    const response = await askAI(query)
    return { type: 'info', message: response }
  }}
/>`,
        render: (
          <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-secondary)', boxShadow: '0 0 25px rgba(163, 91, 255, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem' }}>
              <span style={{ color: 'var(--brand-primary)', filter: 'drop-shadow(0 0 6px rgba(163, 91, 255, 0.5))' }}>✦</span>
              <span style={{ flex: 1, color: 'var(--text-primary)' }}>how do I create a modal?</span>
              <button style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', border: 'none', borderRadius: 8, color: 'white', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span>✦</span> Ask
              </button>
              <kbd style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESC</kbd>
            </div>
          </div>
        )
      },
      {
        title: 'AI Mode with Response',
        code: `// After AI responds
// → Shows response with action button

<CommandBar
  onAiQuery={async (query) => ({
    type: 'navigate',
    message: 'Use the Modal component with open and onClose props.'
  })}
  onAiAction={(response) => navigate('/docs/modal')}
/>`,
        render: (
          <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-secondary)', boxShadow: '0 0 25px rgba(163, 91, 255, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--brand-primary)', filter: 'drop-shadow(0 0 6px rgba(163, 91, 255, 0.5))' }}>✦</span>
              <span style={{ flex: 1, color: 'var(--text-primary)' }}>how do I create a modal?</span>
              <kbd style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESC</kbd>
            </div>
            <div style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>W</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    To create a modal, use the Modal component with the <code style={{ background: 'var(--bg-tertiary)', padding: '0.125rem 0.375rem', borderRadius: 4 }}>open</code> and <code style={{ background: 'var(--bg-tertiary)', padding: '0.125rem 0.375rem', borderRadius: 4 }}>onClose</code> props. Would you like to see the documentation?
                  </div>
                  <button style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.875rem', cursor: 'pointer' }}>
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  treeview: {
    name: 'TreeView',
    description: 'Hierarchical tree structure for nested data.',
    importCode: `import { TreeView, FileTree } from 'wss3-forge'`,
    basicUsage: `<TreeView
  data={[
    { id: '1', label: 'Folder', children: [
      { id: '2', label: 'File.txt' }
    ]}
  ]}
  onSelect={handleSelect}
/>

<FileTree
  files={fileStructure}
  onFileClick={openFile}
/>`,
    usage: [
      'Use for hierarchical data',
      'FileTree for file/folder structures',
      'Supports expand/collapse',
      'Custom icons per node'
    ],
    props: [
      { name: 'data', type: 'TreeNode[]', default: '-', description: 'Tree structure data' },
      { name: 'onSelect', type: '(node: TreeNode) => void', default: '-', description: 'Selection handler' },
      { name: 'defaultExpanded', type: 'string[]', default: '[]', description: 'Initially expanded nodes' }
    ],
    examples: [
      {
        title: 'File Explorer',
        code: `<TreeView
  data={[
    {
      id: 'src',
      label: 'src',
      icon: <Folder20Regular />,
      children: [
        { id: 'components', label: 'components', icon: <Folder20Regular />, children: [
          { id: 'Button.tsx', label: 'Button.tsx', icon: <DocumentText20Filled /> },
          { id: 'Card.tsx', label: 'Card.tsx', icon: <DocumentText20Filled /> }
        ]},
        { id: 'index.tsx', label: 'index.tsx', icon: <DocumentText20Filled /> }
      ]
    },
    { id: 'package.json', label: 'package.json', icon: <DocumentText20Filled /> }
  ]}
  defaultExpanded={['src', 'components']}
/>`,
        render: (
          <TreeView
            data={[
              {
                id: 'src',
                label: 'src',
                icon: <Folder20Regular />,
                children: [
                  { id: 'components', label: 'components', icon: <Folder20Regular />, children: [
                    { id: 'Button.tsx', label: 'Button.tsx', icon: <DocumentText20Filled /> },
                    { id: 'Card.tsx', label: 'Card.tsx', icon: <DocumentText20Filled /> }
                  ]},
                  { id: 'index.tsx', label: 'index.tsx', icon: <DocumentText20Filled /> }
                ]
              },
              { id: 'package.json', label: 'package.json', icon: <DocumentText20Filled /> }
            ]}
            defaultExpanded={['src', 'components']}
          />
        )
      },
      {
        title: 'Navigation Menu',
        code: `<TreeView
  data={[
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'settings', label: 'Settings', children: [
      { id: 'profile', label: 'Profile' },
      { id: 'security', label: 'Security' },
      { id: 'notifications', label: 'Notifications' }
    ]}
  ]}
/>`,
        render: (
          <TreeView
            data={[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'settings', label: 'Settings', children: [
                { id: 'profile', label: 'Profile' },
                { id: 'security', label: 'Security' },
                { id: 'notifications', label: 'Notifications' }
              ]}
            ]}
          />
        )
      }
    ]
  },
  calendar: {
    name: 'Calendar',
    description: 'Calendar view for displaying events and date selection.',
    importCode: `import { Calendar, MiniCalendar } from 'wss3-forge'`,
    basicUsage: `<Calendar
  events={events}
  onDateClick={handleDateClick}
  onEventClick={handleEventClick}
/>

<MiniCalendar
  selected={date}
  onChange={setDate}
/>`,
    usage: [
      'Full calendar for event management',
      'MiniCalendar for compact date picker',
      'Supports month/week/day views',
      'Events can have colors'
    ],
    props: [
      { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Calendar events' },
      { name: 'onDateClick', type: '(date: Date) => void', default: '-', description: 'Date click handler' },
      { name: 'onEventClick', type: '(event: CalendarEvent) => void', default: '-', description: 'Event click handler' },
      { name: 'view', type: '"month" | "week" | "day"', default: '"month"', description: 'Calendar view' }
    ],
    examples: [
      {
        title: 'Mini Calendar',
        code: `<MiniCalendar
  selectedDate={new Date()}
  onDateSelect={(date) => console.log(date)}
/>`,
        render: (
          <MiniCalendar
            selectedDate={new Date()}
            onDateSelect={() => {}}
          />
        )
      },
      {
        title: 'Full Calendar with Events',
        code: `<Calendar
  events={[
    { id: '1', title: 'Team Meeting', date: new Date(), color: 'var(--brand-primary)' },
    { id: '2', title: 'Project Review', date: new Date(Date.now() + 86400000), color: 'var(--color-success)' }
  ]}
  onDateSelect={(date) => console.log('Date:', date)}
  onEventClick={(event) => console.log('Event:', event)}
/>`,
        render: (
          <div style={{ height: 600 }}>
            <Calendar
              events={[
                { id: '1', title: 'Team Meeting', date: new Date(), color: 'var(--brand-primary)' },
                { id: '2', title: 'Project Review', date: new Date(Date.now() + 86400000), color: 'var(--color-success)' }
              ]}
              onDateSelect={() => {}}
              onEventClick={() => {}}
            />
          </div>
        )
      }
    ]
  },
  descriptions: {
    name: 'Descriptions',
    description: 'Display labeled data in key-value pairs.',
    importCode: `import { Descriptions, DescriptionList } from 'wss3-forge'`,
    basicUsage: `<Descriptions
  items={[
    { label: 'Name', value: 'John Doe' },
    { label: 'Email', value: 'john@example.com' },
    { label: 'Status', value: <Badge>Active</Badge> }
  ]}
/>`,
    usage: [
      'Use for displaying entity details',
      'Values can be any ReactNode',
      'Supports horizontal and vertical layouts',
      'Good for profile pages and detail views'
    ],
    props: [
      { name: 'items', type: 'DescriptionItem[]', default: '-', description: 'Description items' },
      { name: 'columns', type: 'number', default: '2', description: 'Number of columns' },
      { name: 'layout', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Label position' }
    ],
    examples: [
      {
        title: 'User Profile',
        code: `<Descriptions
  items={[
    { label: 'Name', value: 'John Doe' },
    { label: 'Email', value: 'john@example.com' },
    { label: 'Role', value: 'Administrator' },
    { label: 'Status', value: <Badge variant="success">Active</Badge> }
  ]}
  columns={2}
/>`,
        render: (
          <Descriptions
            items={[
              { label: 'Name', value: 'John Doe' },
              { label: 'Email', value: 'john@example.com' },
              { label: 'Role', value: 'Administrator' },
              { label: 'Status', value: <Badge variant="success">Active</Badge> }
            ]}
            columns={2}
          />
        )
      },
      {
        title: 'Order Details',
        code: `<Descriptions
  items={[
    { label: 'Order ID', value: '#ORD-2024-001' },
    { label: 'Date', value: 'January 15, 2024' },
    { label: 'Total', value: '$149.99' },
    { label: 'Payment', value: 'Credit Card' },
    { label: 'Shipping', value: 'Express Delivery' },
    { label: 'Status', value: <Badge variant="warning">Processing</Badge> }
  ]}
  columns={3}
/>`,
        render: (
          <Descriptions
            items={[
              { label: 'Order ID', value: '#ORD-2024-001' },
              { label: 'Date', value: 'January 15, 2024' },
              { label: 'Total', value: '$149.99' },
              { label: 'Payment', value: 'Credit Card' },
              { label: 'Shipping', value: 'Express Delivery' },
              { label: 'Status', value: <Badge variant="warning">Processing</Badge> }
            ]}
            columns={3}
          />
        )
      }
    ]
  },
  banner: {
    name: 'Banner',
    description: 'Prominent message banner for announcements and alerts.',
    importCode: `import { Banner, AnnouncementBanner } from 'wss3-forge'`,
    basicUsage: `<Banner
  type="info"
  title="New feature available"
  description="Check out our latest update."
  onClose={() => {}}
/>

<AnnouncementBanner
  message="🎉 Version 2.0 is here!"
  link={{ label: 'Learn more', href: '/changelog' }}
/>`,
    usage: [
      'Use for important announcements',
      'AnnouncementBanner for top-of-page alerts',
      'Supports dismissible state',
      'Types: info, success, warning, error'
    ],
    props: [
      { name: 'type', type: '"info" | "success" | "warning" | "error"', default: '"info"', description: 'Banner type' },
      { name: 'title', type: 'string', default: '-', description: 'Banner title' },
      { name: 'description', type: 'string', default: '-', description: 'Banner description' },
      { name: 'onClose', type: '() => void', default: '-', description: 'Close handler (makes dismissible)' }
    ],
    examples: [
      {
        title: 'Banner Variants',
        code: `<VStack gap="md">
  <Banner variant="info" title="Information">
    This is an informational message.
  </Banner>
  <Banner variant="success" title="Success">
    Your changes have been saved.
  </Banner>
  <Banner variant="warning" title="Warning">
    Please review your settings.
  </Banner>
  <Banner variant="error" title="Error">
    Something went wrong.
  </Banner>
</VStack>`,
        render: (
          <VStack gap="md">
            <Banner variant="info" title="Information">
              This is an informational message.
            </Banner>
            <Banner variant="success" title="Success">
              Your changes have been saved.
            </Banner>
            <Banner variant="warning" title="Warning">
              Please review your settings.
            </Banner>
            <Banner variant="error" title="Error">
              Something went wrong.
            </Banner>
          </VStack>
        )
      },
      {
        title: 'With Action',
        code: `<Banner
  variant="brand"
  title="New feature available"
  action={{ label: 'Learn more', onClick: () => {} }}
>
  We've added new customization options.
</Banner>`,
        render: (
          <Banner
            variant="brand"
            title="New feature available"
            action={{ label: 'Learn more', onClick: () => {} }}
          >
            We've added new customization options.
          </Banner>
        )
      },
      {
        title: 'Dismissible',
        code: `<Banner variant="info" dismissible>
  This banner can be dismissed by clicking the X button.
</Banner>`,
        render: (
          <Banner variant="info" dismissible>
            This banner can be dismissed by clicking the X button.
          </Banner>
        )
      },
      {
        title: 'Announcement Banner',
        code: `<AnnouncementBanner href="#">
  🎉 Version 2.0 is here! Check out the new features.
</AnnouncementBanner>`,
        render: (
          <AnnouncementBanner onClick={() => {}}>
            🎉 Version 2.0 is here! Check out the new features.
          </AnnouncementBanner>
        )
      }
    ]
  },
  notification: {
    name: 'Notification',
    description: 'Rich notification system with actions and persistence.',
    importCode: `import { NotificationProvider, useNotification } from 'wss3-forge'

// Wrap app
<NotificationProvider>
  <App />
</NotificationProvider>`,
    basicUsage: `const { notify } = useNotification()

notify({
  title: 'New message',
  description: 'You have a new message from John',
  type: 'info',
  action: { label: 'View', onClick: openMessage }
})`,
    usage: [
      'Richer than Toast for complex notifications',
      'Supports actions and custom content',
      'Can persist until dismissed',
      'Use Toast for simple feedback'
    ],
    props: [
      { name: 'title', type: 'string', default: '-', description: 'Notification title' },
      { name: 'description', type: 'string', default: '-', description: 'Notification description' },
      { name: 'type', type: '"info" | "success" | "warning" | "error"', default: '"info"', description: 'Notification type' },
      { name: 'action', type: '{ label: string; onClick: () => void }', default: '-', description: 'Action button' }
    ],
    examples: [
      {
        title: 'Notification Types',
        code: `<VStack gap="md">
  <Notification type="info" title="New Update" message="A new version is available" />
  <Notification type="success" title="Payment Received" message="Your payment has been processed" />
  <Notification type="warning" title="Low Storage" message="Your storage is almost full" />
  <Notification type="error" title="Connection Lost" message="Please check your internet connection" />
</VStack>`,
        render: (
          <VStack gap="md">
            <Notification type="info" title="New Update" message="A new version is available" />
            <Notification type="success" title="Payment Received" message="Your payment has been processed" />
            <Notification type="warning" title="Low Storage" message="Your storage is almost full" />
            <Notification type="error" title="Connection Lost" message="Please check your internet connection" />
          </VStack>
        )
      },
      {
        title: 'With Actions',
        code: `<Notification
  type="info"
  title="New message from John"
  message="Hey, are you available for a quick call?"
  actions={[
    { label: 'Reply', onClick: () => {} },
    { label: 'Dismiss', onClick: () => {}, variant: 'ghost' }
  ]}
/>`,
        render: (
          <Notification
            type="info"
            title="New message from John"
            message="Hey, are you available for a quick call?"
            actions={[
              { label: 'Reply', onClick: () => {} },
              { label: 'Dismiss', onClick: () => {}, variant: 'ghost' }
            ]}
          />
        )
      },
      {
        title: 'Dismissible',
        code: `<Notification
  type="success"
  title="File uploaded"
  message="document.pdf has been uploaded successfully"
  onClose={() => {}}
/>`,
        render: (
          <Notification
            type="success"
            title="File uploaded"
            message="document.pdf has been uploaded successfully"
            onClose={() => {}}
          />
        )
      }
    ]
  },
  splashscreen: {
    name: 'SplashScreen',
    description: 'Full-screen loading splash for app initialization. Multiple variants available.',
    importCode: `import { SplashScreen, LogoSplash, MinimalSplash, BrandedSplash } from 'wss3-forge'`,
    basicUsage: `<SplashScreen
  visible={isLoading}
  variant="powered-by"
  brandName="MyApp"
  duration={2500}
  onComplete={() => setIsLoading(false)}
/>

<LogoSplash
  visible={isLoading}
  loadingCycles={2}
  holdTime={1500}
  onComplete={() => setIsLoading(false)}
/>

<BrandedSplash
  visible={isLoading}
  logo={<MyAppLogo />}
  appName="My App"
  tagline="Your productivity assistant"
  version="v1.0.0"
  duration={3000}
  onComplete={() => setIsLoading(false)}
/>`,
    usage: [
      'Use during app initialization',
      'SplashScreen for "Powered by" branding',
      'LogoSplash for animated Webba logo reveal',
      'MinimalSplash for simple loading state',
      'BrandedSplash for full app branding'
    ],
    props: [
      { name: 'visible', type: 'boolean', default: 'true', description: 'Show/hide the splash screen' },
      { name: 'variant', type: '"powered-by" | "made-with" | "built-with"', default: '"powered-by"', description: 'Text variant for SplashScreen' },
      { name: 'brandName', type: 'string', default: '"Webba"', description: 'Brand name to display' },
      { name: 'duration', type: 'number', default: '2500', description: 'Total display duration (ms)' },
      { name: 'onComplete', type: '() => void', default: '-', description: 'Callback when splash finishes' },
      { name: 'logo', type: 'ReactNode', default: '-', description: 'Logo element (BrandedSplash)' },
      { name: 'appName', type: 'string', default: '-', description: 'App name (BrandedSplash)' },
      { name: 'tagline', type: 'string', default: '-', description: 'App tagline (BrandedSplash)' },
      { name: 'version', type: 'string', default: '-', description: 'Version number (BrandedSplash)' },
      { name: 'loadingCycles', type: 'number', default: '1', description: 'Animation cycles before reveal (LogoSplash)' },
      { name: 'holdTime', type: 'number', default: '1500', description: 'Time to hold revealed state (LogoSplash)' }
    ],
    examples: [
      {
        title: 'Interactive Demo',
        code: `const [showSplash, setShowSplash] = useState(false)

<Button onClick={() => setShowSplash(true)}>
  Show Splash
</Button>

<SplashScreen
  visible={showSplash}
  variant="powered-by"
  brandName="Webba"
  duration={2500}
  onComplete={() => setShowSplash(false)}
/>`,
        render: <SplashScreenPreview />
      }
    ]
  },
  barchart: {
    name: 'BarChart',
    description: 'Bar chart for comparing categorical data with animated bars and tooltips.',
    importCode: `import { BarChart, GroupedBarChart } from 'wss3-forge'`,
    basicUsage: `<BarChart
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 200 },
    { label: 'Apr', value: 120 }
  ]}
  height={180}
/>`,
    usage: [
      'Use for comparing values across categories',
      'GroupedBarChart for multiple series comparison',
      'Supports horizontal orientation',
      'Animated on mount with hover tooltips'
    ],
    props: [
      { name: 'data', type: 'ChartDataPoint[]', default: '-', description: 'Array of { label, value, color? }' },
      { name: 'height', type: 'number', default: '180', description: 'Chart height in pixels' },
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Bar color' },
      { name: 'horizontal', type: 'boolean', default: 'false', description: 'Display bars horizontally' },
      { name: 'showLabels', type: 'boolean', default: 'true', description: 'Show category labels' },
      { name: 'showValues', type: 'boolean', default: 'true', description: 'Show values on bars' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount' },
      { name: 'barRadius', type: 'number', default: '6', description: 'Bar border radius' }
    ],
    examples: [
      {
        title: 'Vertical Bar Chart',
        code: `<BarChart
  data={[
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 85 },
    { label: 'Mar', value: 120 },
    { label: 'Apr', value: 90 },
    { label: 'May', value: 150 }
  ]}
  height={180}
  color="var(--brand-primary)"
/>`,
        render: (
          <BarChart
            data={[
              { label: 'Jan', value: 65 },
              { label: 'Feb', value: 85 },
              { label: 'Mar', value: 120 },
              { label: 'Apr', value: 90 },
              { label: 'May', value: 150 }
            ]}
            height={180}
          />
        )
      },
      {
        title: 'Horizontal Bar Chart',
        code: `<BarChart
  data={[
    { label: 'Chrome', value: 65 },
    { label: 'Safari', value: 19 },
    { label: 'Firefox', value: 10 },
    { label: 'Edge', value: 6 }
  ]}
  horizontal
  color="#10b981"
/>`,
        render: (
          <BarChart
            data={[
              { label: 'Chrome', value: 65 },
              { label: 'Safari', value: 19 },
              { label: 'Firefox', value: 10 },
              { label: 'Edge', value: 6 }
            ]}
            horizontal
            color="#10b981"
          />
        )
      },
      {
        title: 'Grouped Bar Chart',
        code: `<GroupedBarChart
  data={[
    { label: 'Q1', values: [120, 90] },
    { label: 'Q2', values: [150, 110] },
    { label: 'Q3', values: [180, 140] },
    { label: 'Q4', values: [200, 160] }
  ]}
  series={[
    { name: '2023', color: 'var(--brand-primary)' },
    { name: '2024', color: '#10b981' }
  ]}
  height={200}
/>`,
        render: (
          <GroupedBarChart
            data={[
              { label: 'Q1', values: [120, 90] },
              { label: 'Q2', values: [150, 110] },
              { label: 'Q3', values: [180, 140] },
              { label: 'Q4', values: [200, 160] }
            ]}
            series={[
              { name: '2023', color: 'var(--brand-primary)' },
              { name: '2024', color: '#10b981' }
            ]}
            height={200}
          />
        )
      }
    ]
  },
  linechart: {
    name: 'LineChart',
    description: 'Line chart for showing trends over time with smooth curves and tooltips.',
    importCode: `import { LineChart, MultiLineChart, Sparkline } from 'wss3-forge'`,
    basicUsage: `<LineChart
  data={[100, 150, 130, 180, 160, 200]}
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  height={160}
/>

<Sparkline data={[1, 3, 2, 4, 3, 5]} trend="up" />`,
    usage: [
      'Use for trend visualization over time',
      'MultiLineChart for comparing multiple series',
      'Sparkline for compact inline charts',
      'Automatic area gradient fill'
    ],
    props: [
      { name: 'data', type: 'number[]', default: '-', description: 'Array of numeric values' },
      { name: 'labels', type: 'string[]', default: '[]', description: 'X-axis labels' },
      { name: 'height', type: 'number', default: '140', description: 'Chart height in pixels' },
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Line and fill color' },
      { name: 'showDots', type: 'boolean', default: 'true', description: 'Show data points' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Show grid lines' },
      { name: 'showXLabels', type: 'boolean', default: 'false', description: 'Show X-axis labels' },
      { name: 'showYLabels', type: 'boolean', default: 'false', description: 'Show Y-axis labels' },
      { name: 'gridLines', type: 'number', default: '5', description: 'Number of horizontal grid lines' },
      { name: 'smooth', type: 'boolean', default: 'true', description: 'Smooth curve interpolation' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount' }
    ],
    examples: [
      {
        title: 'Simple Line Chart',
        code: `<LineChart
  data={[30, 45, 35, 60, 50, 75, 65]}
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
  height={160}
  color="var(--brand-primary)"
/>`,
        render: (
          <LineChart
            data={[30, 45, 35, 60, 50, 75, 65]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            height={160}
          />
        )
      },
      {
        title: 'With Axis Labels',
        code: `<LineChart
  data={[120, 180, 150, 220, 190, 250, 230]}
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
  height={180}
  showXLabels
  showYLabels
  gridLines={5}
/>`,
        render: (
          <LineChart
            data={[120, 180, 150, 220, 190, 250, 230]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
            height={180}
            showXLabels
            showYLabels
            gridLines={5}
          />
        )
      },
      {
        title: 'Without Grid',
        code: `<LineChart
  data={[40, 65, 50, 80, 70, 95]}
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  height={140}
  showGrid={false}
  color="#10b981"
/>`,
        render: (
          <LineChart
            data={[40, 65, 50, 80, 70, 95]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            height={140}
            showGrid={false}
            color="#10b981"
          />
        )
      },
      {
        title: 'Multi-Line Chart',
        code: `<MultiLineChart
  series={[
    { name: 'Revenue', data: [100, 120, 140, 130, 160, 180], color: 'var(--brand-primary)' },
    { name: 'Expenses', data: [80, 90, 100, 95, 110, 120], color: '#ef4444' }
  ]}
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  height={180}
/>`,
        render: (
          <MultiLineChart
            series={[
              { name: 'Revenue', data: [100, 120, 140, 130, 160, 180], color: 'var(--brand-primary)' },
              { name: 'Expenses', data: [80, 90, 100, 95, 110, 120], color: '#ef4444' }
            ]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            height={180}
          />
        )
      },
      {
        title: 'Sparklines',
        code: `<HStack gap="xl" style={{ alignItems: 'center' }}>
  <VStack gap="xs">
    <Text size="sm" color="muted">Revenue</Text>
    <HStack gap="sm" style={{ alignItems: 'center' }}>
      <Sparkline data={[20, 35, 25, 45, 40, 60]} trend="up" />
      <Text size="sm" style={{ color: 'var(--success)' }}>+12%</Text>
    </HStack>
  </VStack>
  <VStack gap="xs">
    <Text size="sm" color="muted">Churn</Text>
    <HStack gap="sm" style={{ alignItems: 'center' }}>
      <Sparkline data={[50, 45, 55, 40, 35, 30]} trend="down" />
      <Text size="sm" style={{ color: 'var(--error)' }}>-8%</Text>
    </HStack>
  </VStack>
</HStack>`,
        render: (
          <HStack gap="xl" style={{ alignItems: 'center' }}>
            <VStack gap="xs">
              <Text size="sm" color="muted">Revenue</Text>
              <HStack gap="sm" style={{ alignItems: 'center' }}>
                <Sparkline data={[20, 35, 25, 45, 40, 60]} trend="up" />
                <Text size="sm" style={{ color: 'var(--success)' }}>+12%</Text>
              </HStack>
            </VStack>
            <VStack gap="xs">
              <Text size="sm" color="muted">Churn</Text>
              <HStack gap="sm" style={{ alignItems: 'center' }}>
                <Sparkline data={[50, 45, 55, 40, 35, 30]} trend="down" />
                <Text size="sm" style={{ color: 'var(--error)' }}>-8%</Text>
              </HStack>
            </VStack>
          </HStack>
        )
      }
    ]
  },
  donutchart: {
    name: 'DonutChart',
    description: 'Donut/pie chart for showing proportions with interactive legend.',
    importCode: `import { DonutChart } from 'wss3-forge'`,
    basicUsage: `<DonutChart
  data={[
    { label: 'Desktop', value: 60, color: '#A35BFF' },
    { label: 'Mobile', value: 30, color: '#FD9173' },
    { label: 'Tablet', value: 10, color: '#10B981' }
  ]}
  size={160}
/>`,
    usage: [
      'Use for showing parts of a whole',
      'Interactive hover on segments and legend',
      'Center displays total or hovered percentage',
      'Animated segments on mount',
      'Responsive: legend moves below on small containers'
    ],
    props: [
      { name: 'data', type: 'ChartDataPoint[]', default: '-', description: 'Array of { label, value, color? }' },
      { name: 'size', type: 'number', default: '160', description: 'Chart diameter in pixels' },
      { name: 'thickness', type: 'number', default: '24', description: 'Ring thickness' },
      { name: 'showLegend', type: 'boolean', default: 'true', description: 'Show legend beside chart' },
      { name: 'legendBelow', type: 'boolean', default: 'false', description: 'Force legend below chart' },
      { name: 'centerContent', type: 'ReactNode', default: '-', description: 'Custom center content' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount' }
    ],
    examples: [
      {
        title: 'Traffic Sources',
        code: `<DonutChart
  data={[
    { label: 'Direct', value: 45, color: '#A35BFF' },
    { label: 'Organic', value: 30, color: '#10b981' },
    { label: 'Referral', value: 15, color: '#3b82f6' },
    { label: 'Social', value: 10, color: '#f59e0b' }
  ]}
  size={160}
/>`,
        render: (
          <DonutChart
            data={[
              { label: 'Direct', value: 45, color: '#A35BFF' },
              { label: 'Organic', value: 30, color: '#10b981' },
              { label: 'Referral', value: 15, color: '#3b82f6' },
              { label: 'Social', value: 10, color: '#f59e0b' }
            ]}
            size={160}
          />
        )
      },
      {
        title: 'Compact (No Legend)',
        code: `<DonutChart
  data={[
    { label: 'Used', value: 75, color: 'var(--brand-primary)' },
    { label: 'Free', value: 25, color: 'var(--bg-tertiary)' }
  ]}
  size={120}
  thickness={16}
  showLegend={false}
/>`,
        render: (
          <DonutChart
            data={[
              { label: 'Used', value: 75, color: 'var(--brand-primary)' },
              { label: 'Free', value: 25, color: 'var(--bg-tertiary)' }
            ]}
            size={120}
            thickness={16}
            showLegend={false}
          />
        )
      },
      {
        title: 'Legend Below',
        code: `<DonutChart
  data={[
    { label: 'Desktop', value: 60, color: '#A35BFF' },
    { label: 'Mobile', value: 30, color: '#FD9173' },
    { label: 'Tablet', value: 10, color: '#10B981' }
  ]}
  size={140}
  legendBelow
/>`,
        render: (
          <DonutChart
            data={[
              { label: 'Desktop', value: 60, color: '#A35BFF' },
              { label: 'Mobile', value: 30, color: '#FD9173' },
              { label: 'Tablet', value: 10, color: '#10B981' }
            ]}
            size={140}
            legendBelow
          />
        )
      }
    ]
  },
  progressring: {
    name: 'ProgressRing',
    description: 'Circular progress indicator with animated value and glow effect.',
    importCode: `import { ProgressRing } from 'wss3-forge'`,
    basicUsage: `<ProgressRing
  value={75}
  size={90}
  label="Complete"
/>`,
    usage: [
      'Use for completion percentage display',
      'Animated counter and ring fill',
      'Optional label below percentage',
      'Glow effect on progress arc'
    ],
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Progress value (0-100)' },
      { name: 'size', type: 'number', default: '90', description: 'Ring diameter in pixels' },
      { name: 'thickness', type: 'number', default: '10', description: 'Ring thickness' },
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Progress color' },
      { name: 'showValue', type: 'boolean', default: 'true', description: 'Show percentage in center' },
      { name: 'label', type: 'string', default: '-', description: 'Label below percentage' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'Animate on mount' }
    ],
    examples: [
      {
        title: 'Progress Rings',
        code: `<HStack gap="xl" style={{ alignItems: 'center' }}>
  <ProgressRing value={25} size={80} color="#ef4444" label="Storage" />
  <ProgressRing value={60} size={90} color="#f59e0b" label="Memory" />
  <ProgressRing value={85} size={100} color="#10b981" label="CPU" />
</HStack>`,
        render: (
          <HStack gap="xl" style={{ alignItems: 'center' }}>
            <ProgressRing value={25} size={80} color="#ef4444" label="Storage" />
            <ProgressRing value={60} size={90} color="#f59e0b" label="Memory" />
            <ProgressRing value={85} size={100} color="#10b981" label="CPU" />
          </HStack>
        )
      },
      {
        title: 'Compact Ring',
        code: `<ProgressRing
  value={72}
  size={60}
  thickness={6}
  showValue={true}
/>`,
        render: (
          <ProgressRing
            value={72}
            size={60}
            thickness={6}
          />
        )
      }
    ]
  },
  imagegallery: {
    name: 'ImageGallery',
    description: 'Image grid with lightbox viewer featuring zoom, pan, and keyboard navigation.',
    importCode: `import { ImageGallery, ImagePreview, Lightbox } from 'wss3-forge'`,
    basicUsage: `<ImageGallery
  images={[
    { src: '/img1.jpg', alt: 'Image 1', title: 'Photo 1' },
    { src: '/img2.jpg', alt: 'Image 2', title: 'Photo 2' },
    { src: '/img3.jpg', alt: 'Image 3', title: 'Photo 3' }
  ]}
  columns={3}
  aspectRatio="square"
/>`,
    usage: [
      'Click images to open full-screen lightbox',
      'Lightbox supports zoom, pan, and keyboard navigation',
      'ImagePreview for single image with lightbox',
      'Customizable grid columns and aspect ratio'
    ],
    props: [
      { name: 'images', type: 'GalleryImage[]', default: '-', description: 'Array of { src, alt?, thumbnail?, title?, description? }' },
      { name: 'columns', type: '2 | 3 | 4 | 5', default: '3', description: 'Number of grid columns' },
      { name: 'gap', type: 'number', default: '8', description: 'Gap between images in pixels' },
      { name: 'aspectRatio', type: '"square" | "4/3" | "16/9" | "auto"', default: '"square"', description: 'Image aspect ratio' },
      { name: 'rounded', type: 'boolean', default: 'true', description: 'Rounded corners on images' }
    ],
    examples: [
      {
        title: 'Image Gallery',
        code: `<ImageGallery
  images={[
    { src: 'https://picsum.photos/seed/1/800/600', title: 'Mountain View' },
    { src: 'https://picsum.photos/seed/2/800/600', title: 'Ocean Sunset' },
    { src: 'https://picsum.photos/seed/3/800/600', title: 'Forest Path' },
    { src: 'https://picsum.photos/seed/4/800/600', title: 'City Lights' },
    { src: 'https://picsum.photos/seed/5/800/600', title: 'Desert Dunes' },
    { src: 'https://picsum.photos/seed/6/800/600', title: 'Lake Reflection' }
  ]}
  columns={3}
  aspectRatio="4/3"
/>`,
        render: (
          <ImageGallery
            images={[
              { src: 'https://picsum.photos/seed/1/800/600', title: 'Mountain View' },
              { src: 'https://picsum.photos/seed/2/800/600', title: 'Ocean Sunset' },
              { src: 'https://picsum.photos/seed/3/800/600', title: 'Forest Path' },
              { src: 'https://picsum.photos/seed/4/800/600', title: 'City Lights' },
              { src: 'https://picsum.photos/seed/5/800/600', title: 'Desert Dunes' },
              { src: 'https://picsum.photos/seed/6/800/600', title: 'Lake Reflection' }
            ]}
            columns={3}
            aspectRatio="4/3"
          />
        )
      },
      {
        title: 'Single Image Preview',
        code: `<ImagePreview
  src="https://picsum.photos/seed/preview/1200/800"
  alt="Preview image"
  aspectRatio="16 / 9"
  width={400}
/>`,
        render: (
          <ImagePreview
            src="https://picsum.photos/seed/preview/1200/800"
            alt="Preview image"
            aspectRatio="16 / 9"
            width={400}
          />
        )
      }
    ]
  },
  carousel: {
    name: 'Carousel',
    description: 'Sliding carousel for images or content with auto-play and navigation.',
    importCode: `import { Carousel, ImageCarousel } from 'wss3-forge'`,
    basicUsage: `<Carousel autoPlay interval={5000} showProgress>
  <div>Slide 1 Content</div>
  <div>Slide 2 Content</div>
  <div>Slide 3 Content</div>
</Carousel>`,
    usage: [
      'Auto-play with progress indicator',
      'ImageCarousel for image slideshows',
      'Keyboard navigation (arrows)',
      'Dot indicators and navigation arrows'
    ],
    props: [
      { name: 'children', type: 'ReactNode', default: '-', description: 'Slide content' },
      { name: 'variant', type: '"default" | "plain"', default: '"default"', description: 'Carousel style' },
      { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto advance slides' },
      { name: 'interval', type: 'number', default: '5000', description: 'Auto-play interval (ms)' },
      { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show navigation arrows' },
      { name: 'showDots', type: 'boolean', default: 'true', description: 'Show dot indicators' },
      { name: 'showProgress', type: 'boolean', default: 'false', description: 'Show progress bar' },
      { name: 'infinite', type: 'boolean', default: 'true', description: 'Loop infinitely' },
      { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause auto-play on hover' }
    ],
    examples: [
      {
        title: 'Content Carousel',
        code: `<Carousel autoPlay interval={4000} showProgress>
  <Text size="lg" weight="medium">Welcome to our platform</Text>
  <Text size="lg" weight="medium">Discover new features</Text>
  <Text size="lg" weight="medium">Start building today</Text>
</Carousel>`,
        render: (
          <Carousel autoPlay interval={4000} showProgress>
            <Text size="lg" weight="medium">Welcome to our platform</Text>
            <Text size="lg" weight="medium">Discover new features</Text>
            <Text size="lg" weight="medium">Start building today</Text>
          </Carousel>
        )
      },
      {
        title: 'Image Carousel',
        code: `<ImageCarousel
  images={[
    { src: 'https://picsum.photos/seed/c1/800/400', caption: 'Beautiful landscape' },
    { src: 'https://picsum.photos/seed/c2/800/400', caption: 'City skyline' },
    { src: 'https://picsum.photos/seed/c3/800/400', caption: 'Nature photography' }
  ]}
  autoPlay
  interval={5000}
/>`,
        render: (
          <ImageCarousel
            images={[
              { src: 'https://picsum.photos/seed/c1/800/400', caption: 'Beautiful landscape' },
              { src: 'https://picsum.photos/seed/c2/800/400', caption: 'City skyline' },
              { src: 'https://picsum.photos/seed/c3/800/400', caption: 'Nature photography' }
            ]}
            autoPlay
            interval={5000}
          />
        )
      },
      {
        title: 'Without Progress Bar',
        code: `<ImageCarousel
  images={[
    { src: 'https://picsum.photos/seed/c4/800/400', caption: 'Ocean waves' },
    { src: 'https://picsum.photos/seed/c5/800/400', caption: 'Mountain view' },
    { src: 'https://picsum.photos/seed/c6/800/400', caption: 'Forest path' }
  ]}
  autoPlay
  showProgress={false}
/>`,
        render: (
          <ImageCarousel
            images={[
              { src: 'https://picsum.photos/seed/c4/800/400', caption: 'Ocean waves' },
              { src: 'https://picsum.photos/seed/c5/800/400', caption: 'Mountain view' },
              { src: 'https://picsum.photos/seed/c6/800/400', caption: 'Forest path' }
            ]}
            autoPlay
            showProgress={false}
          />
        )
      }
    ]
  },
  videoplayer: {
    name: 'VideoPlayer',
    description: 'Full-featured video player with custom controls, speed selection, and Picture-in-Picture.',
    importCode: `import { VideoPlayer } from 'wss3-forge'`,
    basicUsage: `<VideoPlayer
  src="https://example.com/video.mp4"
  poster="https://example.com/thumbnail.jpg"
/>`,
    usage: [
      'Custom styled controls with grouped buttons',
      'Playback speed selection (0.5x to 2x)',
      'Volume control with inline slider',
      'Fullscreen and Picture-in-Picture support',
      'Keyboard shortcuts (space, arrows, f, m)'
    ],
    props: [
      { name: 'src', type: 'string', default: '-', description: 'Video source URL' },
      { name: 'poster', type: 'string', default: '-', description: 'Poster image URL' },
      { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto-play video' },
      { name: 'muted', type: 'boolean', default: 'false', description: 'Start muted' },
      { name: 'loop', type: 'boolean', default: 'false', description: 'Loop video' },
      { name: 'controls', type: 'boolean', default: 'true', description: 'Show controls' },
      { name: 'onPlay', type: '() => void', default: '-', description: 'Play callback' },
      { name: 'onPause', type: '() => void', default: '-', description: 'Pause callback' },
      { name: 'onEnded', type: '() => void', default: '-', description: 'Video ended callback' }
    ],
    examples: [
      {
        title: 'Video Player',
        code: `<VideoPlayer
  src="https://www.w3schools.com/html/mov_bbb.mp4"
  poster="https://picsum.photos/seed/video/640/360"
/>`,
        render: (
          <VideoPlayer
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            poster="https://picsum.photos/seed/video/640/360"
          />
        )
      }
    ]
  },
  audioplayer: {
    name: 'AudioPlayer',
    description: 'Audio player with cover art, track info, progress bar, and volume control.',
    importCode: `import { AudioPlayer, MiniAudioPlayer } from 'wss3-forge'`,
    basicUsage: `<AudioPlayer
  src="https://example.com/audio.mp3"
  title="Track Name"
  artist="Artist Name"
  cover="https://example.com/cover.jpg"
/>

<MiniAudioPlayer
  src="https://example.com/audio.mp3"
  title="Track Name"
/>`,
    usage: [
      'Full player with cover art and track info',
      'MiniAudioPlayer for compact inline use',
      'Draggable progress bar with seek',
      'Volume slider with mute toggle',
      'Loop and skip controls'
    ],
    props: [
      { name: 'src', type: 'string', default: '-', description: 'Audio source URL' },
      { name: 'title', type: 'string', default: '-', description: 'Track title' },
      { name: 'artist', type: 'string', default: '-', description: 'Artist name' },
      { name: 'cover', type: 'string', default: '-', description: 'Cover image URL' },
      { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto-play audio' },
      { name: 'loop', type: 'boolean', default: 'false', description: 'Loop audio' },
      { name: 'showVolume', type: 'boolean', default: 'true', description: 'Show volume control' },
      { name: 'onPlay', type: '() => void', default: '-', description: 'Play callback' },
      { name: 'onPause', type: '() => void', default: '-', description: 'Pause callback' }
    ],
    examples: [
      {
        title: 'Full Audio Player',
        code: `<AudioPlayer
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  title="SoundHelix Song 1"
  artist="T. Schürger"
  cover="https://picsum.photos/seed/audio/200/200"
/>`,
        render: (
          <AudioPlayer
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            title="SoundHelix Song 1"
            artist="T. Schürger"
            cover="https://picsum.photos/seed/audio/200/200"
          />
        )
      },
      {
        title: 'Mini Audio Player',
        code: `<MiniAudioPlayer
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  title="SoundHelix Song 2"
/>`,
        render: (
          <MiniAudioPlayer
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            title="SoundHelix Song 2"
          />
        )
      }
    ]
  },
  scrollindicator: {
    name: 'ScrollIndicator',
    description: 'Progress bar showing page scroll position.',
    importCode: `import { ScrollIndicator } from 'wss3-forge'`,
    basicUsage: `<ScrollIndicator />

<ScrollIndicator
  color="var(--brand-secondary)"
  height={4}
  position="bottom"
/>`,
    usage: [
      'Fixed progress bar at top or bottom',
      'Customizable color and height',
      'Updates smoothly on scroll'
    ],
    props: [
      { name: 'color', type: 'string', default: 'var(--brand-primary)', description: 'Progress bar color' },
      { name: 'height', type: 'number', default: '3', description: 'Bar height in pixels' },
      { name: 'position', type: '"top" | "bottom"', default: '"top"', description: 'Fixed position' },
      { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index value' }
    ],
    examples: [
      {
        title: 'Scroll Indicator Preview',
        code: `<ScrollIndicator color="var(--brand-primary)" />`,
        render: (
          <Card style={{ padding: '1rem' }}>
            <Text size="sm" color="muted">
              Le ScrollIndicator est une barre fixe en haut ou en bas de la page qui indique la progression du scroll.
              Scrollez cette page pour voir l'effet (si activé globalement).
            </Text>
          </Card>
        )
      }
    ]
  },
  affix: {
    name: 'Affix',
    description: 'Pin content on scroll with sticky positioning. Includes StickyHeader and StickySidebar helpers.',
    importCode: `import { Affix, StickyHeader, StickySidebar } from 'wss3-forge'`,
    basicUsage: `<Affix offsetTop={80}>
  <Card>Sticky content</Card>
</Affix>

<StickyHeader>
  <Navbar />
</StickyHeader>

<StickySidebar topOffset={80}>
  <nav>Sidebar content</nav>
</StickySidebar>`,
    usage: [
      'Affix for custom sticky positioning',
      'StickyHeader for fixed navigation bars',
      'StickySidebar for side navigation',
      'Callback when sticky state changes'
    ],
    props: [
      { name: 'children', type: 'ReactNode', default: '-', description: 'Content to make sticky' },
      { name: 'offsetTop', type: 'number', default: '0', description: 'Distance from top when sticky' },
      { name: 'offsetBottom', type: 'number', default: '-', description: 'Distance from bottom' },
      { name: 'position', type: '"top" | "bottom"', default: '"top"', description: 'Sticky position' },
      { name: 'onChange', type: '(affixed: boolean) => void', default: '-', description: 'Sticky state callback' },
      { name: 'zIndex', type: 'number', default: '100', description: 'Z-index value' }
    ],
    examples: [
      {
        title: 'Affix / Sticky Components',
        code: `<Affix offsetTop={80}>
  <Card>This becomes sticky when scrolled</Card>
</Affix>

<StickyHeader shadow blur>
  <Navbar />
</StickyHeader>

<StickySidebar topOffset={80} bottomOffset={24}>
  <nav>Sidebar navigation</nav>
</StickySidebar>`,
        render: (
          <Card style={{ padding: '1.5rem' }}>
            <Text size="sm" color="muted">
              Affix, StickyHeader and StickySidebar components allow you to pin content on scroll.
              They are used in this documentation for the sidebar and header.
            </Text>
          </Card>
        )
      }
    ]
  },
  watermark: {
    name: 'Watermark',
    description: 'Overlay watermark pattern on content for branding or protection.',
    importCode: `import { Watermark } from 'wss3-forge'`,
    basicUsage: `<Watermark text="CONFIDENTIAL">
  <div>Protected content here</div>
</Watermark>`,
    usage: [
      'Repeating watermark pattern',
      'Customizable text, size, and rotation',
      'Adjustable opacity and spacing'
    ],
    props: [
      { name: 'children', type: 'ReactNode', default: '-', description: 'Content to watermark' },
      { name: 'text', type: 'string', default: '-', description: 'Watermark text' },
      { name: 'fontSize', type: 'number', default: '16', description: 'Text size' },
      { name: 'color', type: 'string', default: 'var(--text-muted)', description: 'Text color' },
      { name: 'opacity', type: 'number', default: '0.15', description: 'Watermark opacity' },
      { name: 'rotate', type: 'number', default: '-22', description: 'Rotation angle' },
      { name: 'gap', type: '[number, number]', default: '[100, 100]', description: 'Spacing between repeats' }
    ],
    examples: [
      {
        title: 'Confidential Watermark',
        code: `<Watermark text="CONFIDENTIAL" opacity={0.1}>
  <Card style={{ padding: '2rem', minHeight: 200 }}>
    <Heading size="sm">Secret Document</Heading>
    <Text>This content is protected with a watermark overlay.</Text>
  </Card>
</Watermark>`,
        render: (
          <Watermark text="CONFIDENTIAL" opacity={0.1}>
            <Card style={{ padding: '2rem', minHeight: 200 }}>
              <Heading size="sm">Secret Document</Heading>
              <Text style={{ marginTop: 8 }}>This content is protected with a watermark overlay.</Text>
            </Card>
          </Watermark>
        )
      },
      {
        title: 'Draft Watermark',
        code: `<Watermark text="DRAFT" fontSize={20} rotate={-30} opacity={0.08}>
  <Card style={{ padding: '2rem', minHeight: 150 }}>
    <Text>Work in progress document...</Text>
  </Card>
</Watermark>`,
        render: (
          <Watermark text="DRAFT" fontSize={20} rotate={-30} opacity={0.08}>
            <Card style={{ padding: '2rem', minHeight: 150 }}>
              <Text>Work in progress document...</Text>
            </Card>
          </Watermark>
        )
      }
    ]
  },
  highlight: {
    name: 'Highlight',
    description: 'Highlight matching text within a string for search results.',
    importCode: `import { Highlight } from 'wss3-forge'`,
    basicUsage: `<Highlight
  text="The quick brown fox jumps over the lazy dog"
  query="fox"
/>`,
    usage: [
      'Highlight search query in text',
      'Case-sensitive or insensitive matching',
      'Customizable highlight colors'
    ],
    props: [
      { name: 'text', type: 'string', default: '-', description: 'Full text content' },
      { name: 'query', type: 'string', default: '-', description: 'Text to highlight' },
      { name: 'highlightColor', type: 'string', default: 'var(--text-primary)', description: 'Highlighted text color' },
      { name: 'highlightBg', type: 'string', default: 'rgba(255, 220, 0, 0.4)', description: 'Highlight background' },
      { name: 'caseSensitive', type: 'boolean', default: 'false', description: 'Case-sensitive match' }
    ],
    examples: [
      {
        title: 'Search Highlight',
        code: `<Highlight
  text="The quick brown fox jumps over the lazy dog"
  query="fox"
/>`,
        render: (
          <Text>
            <Highlight
              text="The quick brown fox jumps over the lazy dog"
              query="fox"
            />
          </Text>
        )
      },
      {
        title: 'Multiple Matches',
        code: `<Highlight
  text="React is a JavaScript library. React makes UI development easy."
  query="React"
/>`,
        render: (
          <Text>
            <Highlight
              text="React is a JavaScript library. React makes UI development easy."
              query="React"
            />
          </Text>
        )
      },
      {
        title: 'Custom Colors',
        code: `<Highlight
  text="Important: This action cannot be undone"
  query="cannot be undone"
  highlightBg="rgba(239, 68, 68, 0.3)"
  highlightColor="var(--error)"
/>`,
        render: (
          <Text>
            <Highlight
              text="Important: This action cannot be undone"
              query="cannot be undone"
              highlightBg="rgba(239, 68, 68, 0.3)"
              highlightColor="var(--error)"
            />
          </Text>
        )
      }
    ]
  },
  texttruncate: {
    name: 'TextTruncate',
    description: 'Truncate long text with expand/collapse functionality.',
    importCode: `import { TextTruncate } from 'wss3-forge'`,
    basicUsage: `<TextTruncate
  text="Very long text content that needs to be truncated..."
  maxLines={3}
/>`,
    usage: [
      'Truncate by line count or character limit',
      'Expand/collapse toggle button',
      'Customizable labels'
    ],
    props: [
      { name: 'text', type: 'string', default: '-', description: 'Text content' },
      { name: 'maxLines', type: 'number', default: '3', description: 'Max visible lines' },
      { name: 'maxLength', type: 'number', default: '-', description: 'Max character count' },
      { name: 'expandLabel', type: 'string', default: '"Voir plus"', description: 'Expand button text' },
      { name: 'collapseLabel', type: 'string', default: '"Voir moins"', description: 'Collapse button text' }
    ],
    examples: [
      {
        title: 'Truncate by Lines',
        code: `<TextTruncate
  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  maxLines={2}
/>`,
        render: (
          <TextTruncate
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            maxLines={2}
          />
        )
      },
      {
        title: 'Truncate by Length',
        code: `<TextTruncate
  text="This is a long description that will be cut off after a certain number of characters to keep the UI clean and compact."
  maxLength={80}
  expandLabel="Show more"
  collapseLabel="Show less"
/>`,
        render: (
          <TextTruncate
            text="This is a long description that will be cut off after a certain number of characters to keep the UI clean and compact."
            maxLength={80}
            expandLabel="Show more"
            collapseLabel="Show less"
          />
        )
      }
    ]
  },
  copytext: {
    name: 'CopyText',
    description: 'Clickable text that copies to clipboard with feedback.',
    importCode: `import { CopyText } from 'wss3-forge'`,
    basicUsage: `<CopyText text="npm install wss3-forge">
  npm install wss3-forge
</CopyText>`,
    usage: [
      'Click to copy any text',
      'Visual feedback on success',
      'Custom success message'
    ],
    props: [
      { name: 'text', type: 'string', default: '-', description: 'Text to copy' },
      { name: 'children', type: 'ReactNode', default: '-', description: 'Display content' },
      { name: 'onCopy', type: '() => void', default: '-', description: 'Copy callback' },
      { name: 'successMessage', type: 'string', default: '"Copié !"', description: 'Success message' }
    ],
    examples: [
      {
        title: 'Copy Command',
        code: `<CopyText text="npm install wss3-forge">
  <code style={{
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)'
  }}>
    npm install wss3-forge
  </code>
</CopyText>`,
        render: (
          <CopyText text="npm install wss3-forge">
            <code style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}>
              npm install wss3-forge
            </code>
          </CopyText>
        )
      },
      {
        title: 'Copy ID',
        code: `<CopyText text="USR-12345-ABCDE" successMessage="ID copied!">
  <Text color="muted" style={{ cursor: 'pointer' }}>
    ID: USR-12345-ABCDE (click to copy)
  </Text>
</CopyText>`,
        render: (
          <CopyText text="USR-12345-ABCDE" successMessage="ID copied!">
            <Text color="muted" style={{ cursor: 'pointer' }}>
              ID: USR-12345-ABCDE (click to copy)
            </Text>
          </CopyText>
        )
      }
    ]
  },
  countdown: {
    name: 'Countdown',
    description: 'Countdown timer for events or deadlines.',
    importCode: `import { Countdown, Timer, SimpleCountdown } from 'wss3-forge'`,
    basicUsage: `<Countdown
  targetDate={new Date('2025-12-31')}
  onComplete={() => console.log('Happy New Year!')}
/>

<Timer
  duration={60}
  onComplete={handleTimerEnd}
/>`,
    usage: [
      'Countdown to future date',
      'Timer for duration countdown',
      'SimpleCountdown for minimal display',
      'Callback on completion'
    ],
    props: [
      { name: 'targetDate', type: 'Date', default: '-', description: 'Target date/time' },
      { name: 'onComplete', type: '() => void', default: '-', description: 'Completion callback' },
      { name: 'format', type: '"full" | "compact"', default: '"full"', description: 'Display format' }
    ],
    examples: [
      {
        title: 'Countdown to Date',
        code: `<Countdown
  targetDate={new Date('2025-12-31')}
  onComplete={() => console.log('Done!')}
/>`,
        render: (
          <Countdown
            targetDate={new Date('2025-12-31T00:00:00')}
          />
        )
      },
      {
        title: 'Timer',
        code: `<Timer initialSeconds={120} countDown autoStart />`,
        render: (
          <Timer initialSeconds={120} countDown autoStart />
        )
      }
    ]
  },
  rating: {
    name: 'Rating',
    description: 'Star rating input and display component.',
    importCode: `import { Rating, RatingDisplay } from 'wss3-forge'`,
    basicUsage: `<Rating
  value={rating}
  onChange={setRating}
  max={5}
/>

<RatingDisplay value={4.5} />`,
    usage: [
      'Use for user ratings/reviews',
      'RatingDisplay for read-only display',
      'Supports half stars',
      'Customizable max value'
    ],
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current rating' },
      { name: 'onChange', type: '(value: number) => void', default: '-', description: 'Change handler' },
      { name: 'max', type: 'number', default: '5', description: 'Maximum rating' },
      { name: 'allowHalf', type: 'boolean', default: 'false', description: 'Allow half values' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Star size' }
    ],
    examples: [
      {
        title: 'Interactive Rating',
        code: `<Rating value={3} onChange={setRating} max={5} />`,
        render: (
          <Rating value={3} onChange={() => {}} max={5} />
        )
      },
      {
        title: 'Rating Display',
        code: `<RatingDisplay value={4.5} />
<RatingDisplay value={3} size="sm" />`,
        render: (
          <VStack gap="md" style={{ alignItems: 'flex-start' }}>
            <RatingDisplay value={4.5} />
            <RatingDisplay value={3} size="sm" />
          </VStack>
        )
      }
    ]
  },
  tour: {
    name: 'Tour',
    description: 'Guided product tour with step-by-step tooltips.',
    importCode: `import { Tour, useTour } from 'wss3-forge'`,
    basicUsage: `const { startTour, isActive } = useTour()

<Tour
  steps={[
    { target: '#step1', title: 'Welcome', content: 'This is the first step' },
    { target: '#step2', title: 'Next', content: 'Here is another feature' }
  ]}
  isActive={isActive}
  onComplete={() => console.log('Tour completed')}
/>

<Button onClick={startTour}>Start Tour</Button>`,
    usage: [
      'Use for onboarding new users',
      'Steps target elements by selector',
      'Supports skip and previous',
      'Persists completion state'
    ],
    props: [
      { name: 'steps', type: 'TourStep[]', default: '-', description: 'Tour steps' },
      { name: 'isActive', type: 'boolean', default: 'false', description: 'Tour active state' },
      { name: 'onComplete', type: '() => void', default: '-', description: 'Completion callback' },
      { name: 'onSkip', type: '() => void', default: '-', description: 'Skip callback' }
    ],
    examples: [
      {
        title: 'Tour Tooltip',
        code: `<Tour
  steps={[
    { target: '#feature', title: 'Welcome!', content: 'This guides users through features.' },
    { target: '#settings', title: 'Settings', content: 'Configure your preferences here.' }
  ]}
  isActive={isActive}
  onComplete={() => setIsActive(false)}
/>`,
        render: (
          <TourTooltipStatic
            title="Welcome to Forge!"
            content="This is how tour step tooltips look. They guide users through your app with clear instructions and navigation."
            currentStep={0}
            totalSteps={3}
            nextLabel="Next"
            skipLabel="Skip"
          />
        )
      }
    ]
  }
}

// Default fallback for unknown components
const defaultDocs = {
  name: 'Component',
  description: 'Documentation for this component is coming soon.',
  importCode: `import { Component } from 'wss3-forge'`,
  basicUsage: `<Component />`,
  usage: [] as string[],
  props: [],
  examples: [] as { title: string; code: string; render: ReactNode }[]
}

export function ComponentPage() {
  const { componentId } = useParams<{ componentId: string }>()
  const [activeTab, setActiveTab] = useState('preview')

  // Interactive preview states
  const [previewTabActive, setPreviewTabActive] = useState('tab1')
  const [previewPillsSelected, setPreviewPillsSelected] = useState('all')
  const [previewPillTabsValue, setPreviewPillTabsValue] = useState('overview')
  const [previewViewToggle, setPreviewViewToggle] = useState('grid')
  const [previewPage, setPreviewPage] = useState(3)
  const [previewStep, setPreviewStep] = useState(1)
  const [previewNavActive, setPreviewNavActive] = useState('home')
  const [previewSearch, setPreviewSearch] = useState('')
  const [previewColor, setPreviewColor] = useState('#A35BFF')
  const [previewTags, setPreviewTags] = useState(['React', 'TypeScript', 'Forge'])
  const [previewNumber, setPreviewNumber] = useState(10)
  const [previewDate, setPreviewDate] = useState<Date | null>(null)
  const [previewPhone, setPreviewPhone] = useState('')
  const [previewSlider, setPreviewSlider] = useState(50)
  const [previewCheckbox, setPreviewCheckbox] = useState(false)
  const [previewSwitch, setPreviewSwitch] = useState(true)
  const [previewRadio, setPreviewRadio] = useState('b')
  // Overlay states
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewConfirmOpen, setPreviewConfirmOpen] = useState(false)
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false)
  const [previewCommandBarOpen, setPreviewCommandBarOpen] = useState(false)

  // Tour state
  const docsTour = useTour('forge-docs-tour')
  const tourSteps = [
    {
      target: '#docs-sidebar',
      title: 'Documentation Sidebar',
      content: 'Browse all available components organized by category. Click on any component to view its documentation.',
      placement: 'right' as const
    },
    {
      target: '[data-tab-id="preview"]',
      title: 'Preview Tab',
      content: 'See live interactive previews of each component. You can interact with them directly!',
      placement: 'bottom' as const
    },
    {
      target: '[data-tab-id="code"]',
      title: 'Code Examples',
      content: 'View code snippets and copy them directly to your project.',
      placement: 'bottom' as const
    }
  ]

  const docs = componentId && componentDocs[componentId] ? componentDocs[componentId] : defaultDocs
  const displayName = componentId
    ? componentId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    : 'Component'

  const navigate = useNavigate()

  // Components that have a playground
  const playgroundComponents = [
    'button', 'iconbutton', 'gradientbutton',
    'input', 'textarea', 'select', 'checkbox', 'switch', 'slider', 'datepicker', 'rating', 'taginput', 'searchinput',
    'badge', 'avatar', 'card', 'statcard', 'accordion', 'table', 'codeblock', 'kbd',
    'tabs', 'breadcrumbs', 'stepper',
    'spinner', 'tooltip', 'modal', 'toast', 'alert', 'banner', 'skeleton',
    'progressring', 'barchart', 'linechart', 'multilinechart', 'donutchart'
  ]

  const hasPlayground = componentId && playgroundComponents.includes(componentId)

  const generateMarkdown = () => {
    let md = `# ${docs.name}\n\n`
    md += `${docs.description}\n\n`
    md += `## Installation\n\n\`\`\`bash\nnpm install wss3-forge\n\`\`\`\n\n`
    md += `## Import\n\n\`\`\`tsx\n${docs.importCode}\n\`\`\`\n\n`

    if (docs.usage.length > 0) {
      md += `## Usage\n\n`
      docs.usage.forEach(item => {
        md += `- ${item}\n`
      })
      md += `\n`
    }

    md += `## Basic Example\n\n\`\`\`tsx\n${docs.basicUsage}\n\`\`\`\n\n`

    if (docs.props.length > 0) {
      md += `## API Reference\n\n`
      md += `| Prop | Type | Default | Description |\n`
      md += `|------|------|---------|-------------|\n`
      docs.props.forEach(prop => {
        md += `| ${prop.name} | \`${prop.type}\` | ${prop.default} | ${prop.description} |\n`
      })
      md += `\n`
    }

    if (docs.examples.length > 0) {
      md += `## Examples\n\n`
      docs.examples.forEach(example => {
        md += `### ${example.title}\n\n\`\`\`tsx\n${example.code}\n\`\`\`\n\n`
      })
    }

    return md
  }

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown()
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docs.name}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Global overlays - rendered at page level */}
      <Modal open={previewModalOpen} onClose={() => setPreviewModalOpen(false)} title="Edit Profile" subtitle="Update your information">
        <VStack gap="md">
          <Input label="Name" placeholder="John Doe" />
          <Input label="Email" type="email" placeholder="john@example.com" />
        </VStack>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setPreviewModalOpen(false)}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDialog
        open={previewConfirmOpen}
        onClose={() => setPreviewConfirmOpen(false)}
        onConfirm={() => setPreviewConfirmOpen(false)}
        title="Delete this item?"
        description="This action cannot be undone. All associated data will be permanently removed."
        variant="danger"
        confirmText="Delete"
      />

      <Sheet open={previewSheetOpen} onClose={() => setPreviewSheetOpen(false)} title="Settings" subtitle="Manage your preferences">
        <VStack gap="lg">
          <VStack gap="sm">
            <Text weight="medium">Appearance</Text>
            <Switch label="Dark Mode" checked={true} onChange={() => {}} />
          </VStack>
          <VStack gap="sm">
            <Text weight="medium">Notifications</Text>
            <Switch label="Email notifications" checked={true} onChange={() => {}} />
            <Switch label="Push notifications" checked={false} onChange={() => {}} />
          </VStack>
        </VStack>
      </Sheet>

      <CommandBar
        open={previewCommandBarOpen}
        onClose={() => setPreviewCommandBarOpen(false)}
        placeholder="Search or ask..."
        onSearch={(query) => [
          { id: '1', type: 'page', title: 'Dashboard', subtitle: 'Main dashboard' },
          { id: '2', type: 'page', title: 'Settings', subtitle: 'App settings' },
          { id: '3', type: 'doc', title: 'Button', subtitle: 'Button component' },
          { id: '4', type: 'doc', title: 'Modal', subtitle: 'Modal dialog component' },
          { id: '5', type: 'doc', title: 'Card', subtitle: 'Card container component' }
        ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()))}
        onResultSelect={() => setPreviewCommandBarOpen(false)}
        onAiQuery={async (query) => {
          await new Promise(resolve => setTimeout(resolve, 800))
          if (query.toLowerCase().includes('modal')) {
            return { type: 'navigate', message: 'To create a modal, use the Modal component with open and onClose props. Would you like to see the documentation?' }
          }
          if (query.toLowerCase().includes('create') || query.toLowerCase().includes('add')) {
            return { type: 'create', message: 'I can help you create this component. Click the button to get started.' }
          }
          return { type: 'info', message: `Here is what I know about "${query}": This component is part of the Forge library and can be imported directly.` }
        }}
        onAiAction={() => setPreviewCommandBarOpen(false)}
      />

      <VStack gap="2rem" style={{ gap: '3rem' }}>
      <Animate type="fadeIn">
        <VStack gap="md">
          <HStack gap="sm" style={{ justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
            <Badge variant="primary">Component</Badge>
            <HStack gap="sm">
              {hasPlayground && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Play20Regular />}
                  onClick={() => navigate(`/playground?component=${componentId}`)}
                >
                  Playground
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                icon={<DocumentText20Regular />}
                onClick={handleDownloadMarkdown}
              >
                Download .md
              </Button>
            </HStack>
          </HStack>
          <Heading level={1}>{docs.name || displayName}</Heading>
          <Text size="lg" color="secondary">
            {docs.description}
          </Text>
        </VStack>
      </Animate>

      <Animate type="slideInUp" delay={100}>
        <div id="import">
          <CodeBlock code={docs.importCode} language="tsx" showCopyButton showLineNumbers={false} />
        </div>
      </Animate>

      {/* Usage Section */}
      {docs.usage.length > 0 && (
        <Animate type="slideInUp" delay={150}>
          <div id="usage-guidelines">
            <VStack gap="md">
              <SectionHeading id="usage-guidelines" level={2}>Usage</SectionHeading>
              <Card padding="lg" variant="subtle">
                <VStack gap="sm">
                  {docs.usage.map((item, index) => (
                    <HStack key={index} gap="sm" style={{ alignItems: 'flex-start' }}>
                      <Text color="primary" style={{ lineHeight: 1.6 }}>•</Text>
                      <Text color="secondary" style={{ lineHeight: 1.6 }}>{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Card>
            </VStack>
          </div>
        </Animate>
      )}

      <Divider />

      <Animate type="slideInUp" delay={200}>
        <div id="usage">
          <Tabs
          tabs={[
            { id: 'preview', label: 'Preview', icon: <Eye20Regular /> },
            { id: 'code', label: 'Code', icon: <Code20Regular /> },
            { id: 'props', label: 'API Reference', icon: <Document20Regular /> }
          ]}
          active={activeTab}
          onChange={setActiveTab}
          stretchLine
        />

        <TabPanels active={activeTab}>
          <TabPanel id="preview" active={activeTab}>
            <Card padding="lg" style={{ marginTop: '1rem', paddingTop: '4rem', paddingBottom: '4rem', position: 'relative', zIndex: 10, overflow: 'visible', backgroundColor: componentId && ['pills', 'footer', 'skeleton', 'copytext', 'copybutton', 'fileupload', 'stepper', 'slider'].includes(componentId) ? 'var(--bg-secondary)' : 'var(--bg-tertiary)' }}>
              <div style={{ width: '100%', maxWidth: componentId && ['navbar', 'table', 'calendar', 'footer'].includes(componentId) ? '100%' : componentId && ['card', 'statcard', 'imagecard', 'horizontalcard', 'actioncard'].includes(componentId) ? '500px' : '600px', margin: '0 auto' }}>
                <VStack gap="md" style={{ alignItems: componentId && ['input', 'textarea', 'select', 'slider', 'searchinput', 'datepicker', 'taginput', 'numberinput', 'phoneinput', 'fileupload', 'tabs', 'stepper', 'navbar', 'card', 'statcard', 'imagecard', 'horizontalcard', 'actioncard', 'grid', 'table', 'timeline', 'accordion', 'treeview', 'descriptions', 'calendar', 'toast', 'skeleton', 'banner', 'notification', 'barchart', 'linechart', 'imagegallery', 'carousel', 'videoplayer', 'audioplayer', 'divider', 'texttruncate', 'codeblock', 'footer'].includes(componentId) ? 'stretch' : 'center' }}>
                  {componentId === 'button' && (
                    <HStack gap="sm" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="danger">Danger</Button>
                    </HStack>
                  )}
                  {componentId === 'iconbutton' && (
                    <HStack gap="md" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                      <IconButton icon={<Settings20Regular />} variant="ghost" title="Settings" />
                      <IconButton icon={<Edit20Regular />} variant="subtle" title="Edit" />
                      <IconButton icon={<Delete20Regular />} variant="danger" title="Delete" />
                      <IconButton icon={<Heart20Regular />} variant="ghost" title="Like" />
                      <IconButton icon={<Share20Regular />} variant="ghost" title="Share" />
                    </HStack>
                  )}
                  {componentId === 'gradientbutton' && (
                    <VStack gap="md" style={{ alignItems: 'center' }}>
                      <GradientButton icon={<Rocket20Regular />}>Get Started</GradientButton>
                      <HStack gap="sm" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                        <GradientButton size="sm">Small</GradientButton>
                        <GradientButton size="md">Medium</GradientButton>
                        <GradientButton size="lg">Large</GradientButton>
                      </HStack>
                    </VStack>
                  )}
                  {componentId === 'floatbutton' && (
                    <VStack gap="lg" style={{ alignItems: 'center' }}>
                      <HStack gap="lg" style={{ justifyContent: 'center' }}>
                        <VStack gap="xs" style={{ alignItems: 'center' }}>
                          <FloatButton variant="primary" icon={<Add20Regular />} />
                          <Text size="xs" color="muted">Primary</Text>
                        </VStack>
                        <VStack gap="xs" style={{ alignItems: 'center' }}>
                          <FloatButton variant="secondary" icon={<Edit20Regular />} />
                          <Text size="xs" color="muted">Secondary</Text>
                        </VStack>
                        <VStack gap="xs" style={{ alignItems: 'center' }}>
                          <FloatButton variant="gradient" icon={<Rocket20Regular />} />
                          <Text size="xs" color="muted">Gradient</Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  )}
                  {componentId === 'card' && (
                    <VStack gap="md" style={{ width: '100%' }}>
                      <Card padding="lg">Default card with content</Card>
                      <Card padding="lg" variant="subtle">Subtle variant</Card>
                      <Card padding="lg" hoverable>Hoverable card</Card>
                    </VStack>
                  )}
                  {componentId === 'statcard' && (
                    <Grid columns={{ xs: 1, sm: 2 }} gap="md" style={{ width: '100%' }}>
                      <StatCard icon={<People20Regular />} label="Users" value="1,234" color="var(--brand-primary)" change={12.5} />
                      <StatCard icon={<Money20Regular />} label="Revenue" value="$45K" color="var(--color-success)" change={8.3} />
                    </Grid>
                  )}
                  {componentId === 'imagecard' && (
                    <ImageCard
                      image="https://picsum.photos/400/200?random=10"
                      title="Product Name"
                      subtitle="$99.00"
                      description="A brief description of the product"
                      badge={<Badge variant="success">New</Badge>}
                    />
                  )}
                  {componentId === 'vstack' && (
                    <HStack gap="xl" style={{ width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <VStack gap="sm">
                        <Text size="sm" color="muted">VStack</Text>
                        <Card padding="sm">1</Card>
                        <Card padding="sm">2</Card>
                        <Card padding="sm">3</Card>
                      </VStack>
                      <VStack gap="sm">
                        <Text size="sm" color="muted">HStack</Text>
                        <HStack gap="sm">
                          <Card padding="sm">A</Card>
                          <Card padding="sm">B</Card>
                          <Card padding="sm">C</Card>
                        </HStack>
                      </VStack>
                    </HStack>
                  )}
                  {componentId === 'grid' && (
                    <Grid columns={3} gap="sm" style={{ width: '100%', textAlign: 'center' }}>
                      <Card padding="md">1</Card>
                      <Card padding="md">2</Card>
                      <Card padding="md">3</Card>
                      <Card padding="md">4</Card>
                      <Card padding="md">5</Card>
                      <Card padding="md">6</Card>
                    </Grid>
                  )}
                  {componentId === 'input' && (
                    <VStack gap="md" style={{ width: '100%' }}>
                      <Input label="Name" placeholder="Enter your name..." />
                      <Input label="Email" type="email" placeholder="Enter your email..." />
                      <Input label="Password" type="password" placeholder="Enter password..." />
                    </VStack>
                  )}
                  {componentId === 'textarea' && (
                    <VStack gap="md" style={{ width: '100%' }}>
                      <Textarea label="Description" placeholder="Enter description..." rows={4} />
                    </VStack>
                  )}
                  {componentId === 'select' && (
                    <VStack gap="md" style={{ width: '100%' }}>
                      <Select
                        label="Country"
                        placeholder="Select a country"
                        options={[
                          { value: 'us', label: 'United States' },
                          { value: 'ca', label: 'Canada' },
                          { value: 'uk', label: 'United Kingdom' }
                        ]}
                      />
                    </VStack>
                  )}
                  {componentId === 'checkbox' && (
                    <Checkbox label="Accept terms and conditions" checked={previewCheckbox} onChange={setPreviewCheckbox} />
                  )}
                  {componentId === 'radio' && (
                    <VStack gap="sm">
                      <Radio name="preview" label="Option A" value="a" checked={previewRadio === 'a'} onChange={() => setPreviewRadio('a')} />
                      <Radio name="preview" label="Option B" value="b" checked={previewRadio === 'b'} onChange={() => setPreviewRadio('b')} />
                      <Radio name="preview" label="Option C" value="c" checked={previewRadio === 'c'} onChange={() => setPreviewRadio('c')} />
                    </VStack>
                  )}
                  {componentId === 'switch' && (
                    <Switch label="Enable notifications" checked={previewSwitch} onChange={setPreviewSwitch} />
                  )}
                  {componentId === 'slider' && (
                    <Slider label="Volume" value={previewSlider} onChange={setPreviewSlider} />
                  )}
                  {componentId === 'searchinput' && (
                    <SearchInput placeholder="Search..." value={previewSearch} onChange={setPreviewSearch} />
                  )}
                  {componentId === 'datepicker' && (
                    <DatePicker value={previewDate} onChange={setPreviewDate} label="Select date" />
                  )}
                  {componentId === 'colorpicker' && (
                    <ColorPicker value={previewColor} onChange={setPreviewColor} label="Choose color" />
                  )}
                  {componentId === 'taginput' && (
                    <TagInput value={previewTags} onChange={setPreviewTags} placeholder="Add tags..." />
                  )}
                  {componentId === 'numberinput' && (
                    <NumberInput value={previewNumber} onChange={(val) => setPreviewNumber(val === '' ? 0 : val)} label="Quantity" min={0} max={100} />
                  )}
                  {componentId === 'otpinput' && (
                    <OTPInput length={6} onComplete={(code) => console.log('OTP:', code)} />
                  )}
                  {componentId === 'phoneinput' && (
                    <PhoneInput value={previewPhone} onChange={setPreviewPhone} label="Phone number" />
                  )}
                  {componentId === 'fileupload' && (
                    <FileUpload onFilesSelected={() => {}} accept="image/*" label="Drop files here" description="or click to browse" />
                  )}
                  {componentId === 'tabs' && (
                    <Tabs tabs={[{ id: 'tab1', label: 'Overview' }, { id: 'tab2', label: 'Features' }, { id: 'tab3', label: 'Pricing' }]} active={previewTabActive} onChange={setPreviewTabActive} stretchLine />
                  )}
                  {componentId === 'pills' && (
                    <VStack gap="xl" style={{ width: '100%', alignItems: 'center' }}>
                      <VStack gap="sm" style={{ alignItems: 'center' }}>
                        <Text size="sm" color="muted">Pills (Filter)</Text>
                        <Pills
                          options={[
                            { id: 'all', label: 'All' },
                            { id: 'active', label: 'Active', count: 12 },
                            { id: 'pending', label: 'Pending', count: 3 },
                            { id: 'archived', label: 'Archived' }
                          ]}
                          selected={previewPillsSelected}
                          onChange={setPreviewPillsSelected}
                        />
                      </VStack>
                      <VStack gap="sm" style={{ alignItems: 'center' }}>
                        <Text size="sm" color="muted">PillTabs (Navigation)</Text>
                        <PillTabs
                          tabs={[
                            { value: 'overview', label: 'Overview' },
                            { value: 'analytics', label: 'Analytics' },
                            { value: 'reports', label: 'Reports' },
                            { value: 'settings', label: 'Settings' }
                          ]}
                          value={previewPillTabsValue}
                          onChange={setPreviewPillTabsValue}
                        />
                      </VStack>
                      <VStack gap="sm" style={{ alignItems: 'center' }}>
                        <Text size="sm" color="muted">ViewToggle (Icons)</Text>
                        <ViewToggle
                          options={[
                            { value: 'grid', icon: <Grid20Regular />, label: 'Grid view' },
                            { value: 'list', icon: <List20Regular />, label: 'List view' }
                          ]}
                          value={previewViewToggle}
                          onChange={setPreviewViewToggle}
                        />
                      </VStack>
                    </VStack>
                  )}
                  {componentId === 'pagination' && (
                    <Pagination currentPage={previewPage} totalPages={10} onPageChange={setPreviewPage} />
                  )}
                  {componentId === 'breadcrumbs' && (
                    <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Components' }]} />
                  )}
                  {componentId === 'stepper' && (
                    <VStack gap="md" style={{ width: '100%' }}>
                      <Stepper steps={[{ id: 'account', title: 'Account' }, { id: 'profile', title: 'Profile' }, { id: 'review', title: 'Review' }]} currentStep={previewStep} />
                      <HStack gap="sm" style={{ justifyContent: 'center' }}>
                        <Button variant="secondary" size="sm" onClick={() => setPreviewStep(Math.max(0, previewStep - 1))} disabled={previewStep === 0}>Previous</Button>
                        <Button variant="primary" size="sm" onClick={() => setPreviewStep(Math.min(2, previewStep + 1))} disabled={previewStep === 2}>Next</Button>
                      </HStack>
                    </VStack>
                  )}
                  {componentId === 'navbar' && (
                    <Navbar items={[{ id: 'home', label: 'Home' }, { id: 'products', label: 'Products' }, { id: 'about', label: 'About' }]} activeId={previewNavActive} onNavigate={setPreviewNavActive} sticky={false} />
                  )}
                  {componentId === 'footer' && (
                    <Footer tagline="A modern React component library." sections={[{ title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'Components', href: '#' }] }, { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Contact', href: '#' }] }]} copyright="© 2025 Webba. All rights reserved." />
                  )}
                  {componentId === 'modal' && (
                    <Button onClick={() => setPreviewModalOpen(true)}>Open Modal</Button>
                  )}
                  {componentId === 'confirmdialog' && (
                    <Button variant="danger" onClick={() => setPreviewConfirmOpen(true)}>Delete Item</Button>
                  )}
                  {componentId === 'sheet' && (
                    <Button onClick={() => setPreviewSheetOpen(true)}>Open Sheet</Button>
                  )}
                  {componentId === 'dropdown' && (
                    <Dropdown
                      trigger={<Button variant="secondary">Actions</Button>}
                      items={[
                        { id: 'edit', label: 'Edit', icon: <Edit20Regular /> },
                        { id: 'copy', label: 'Copy', icon: <Copy20Regular /> },
                        { id: 'share', label: 'Share', icon: <Share20Regular /> },
                        { id: 'divider', label: '', divider: true },
                        { id: 'delete', label: 'Delete', icon: <Delete20Regular />, destructive: true }
                      ]}
                    />
                  )}
                  {componentId === 'tooltip' && (
                    <HStack gap="lg">
                      <Tooltip content="Edit this item" position="top"><IconButton icon={<Edit20Regular />} /></Tooltip>
                      <Tooltip content="Delete permanently" position="bottom"><IconButton icon={<Delete20Regular />} variant="danger" /></Tooltip>
                      <Tooltip content="Share with others" position="right"><IconButton icon={<Share20Regular />} /></Tooltip>
                    </HStack>
                  )}
                  {componentId === 'popover' && (
                    <Popover
                      trigger={<Button variant="secondary">View Profile</Button>}
                      content={
                        <VStack gap="sm" style={{ minWidth: 200 }}>
                          <HStack gap="sm">
                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>JD</div>
                            <VStack gap="xs">
                              <Text weight="medium">John Doe</Text>
                              <Text size="sm" color="muted">john@example.com</Text>
                            </VStack>
                          </HStack>
                          <Divider />
                          <Button size="sm" fullWidth variant="secondary">View Full Profile</Button>
                        </VStack>
                      }
                    />
                  )}
                  {componentId === 'commandbar' && (
                    <Button onClick={() => setPreviewCommandBarOpen(true)} icon={<Search20Regular />}>Open Command Bar</Button>
                  )}
                  {componentId === 'badge' && (
                    <VStack gap="lg" style={{ width: '100%' }}>
                      <HStack gap="sm" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Badge>Default</Badge>
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="error">Error</Badge>
                      </HStack>
                      <HStack gap="sm" style={{ justifyContent: 'center' }}>
                        <Badge dot variant="success">Online</Badge>
                        <Badge dot variant="warning">Away</Badge>
                        <Badge dot variant="error">Busy</Badge>
                      </HStack>
                    </VStack>
                  )}
                  {componentId === 'table' && (
                    <Table
                      title="Team Members"
                      data={[
                        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
                        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
                        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' },
                        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' }
                      ]}
                      columns={[
                        { key: 'name', header: 'Name' },
                        { key: 'email', header: 'Email' },
                        { key: 'role', header: 'Role', render: (value: string) => (
                          <Badge variant={value === 'Admin' ? 'primary' : value === 'Editor' ? 'warning' : 'default'}>{value}</Badge>
                        )},
                        { key: 'actions', header: 'Actions', render: () => (
                          <HStack gap="xs">
                            <IconButton icon={<Edit20Regular />} size="sm" variant="ghost" title="Edit" />
                            <IconButton icon={<Delete20Regular />} size="sm" variant="danger" title="Delete" />
                          </HStack>
                        )}
                      ]}
                      searchable
                      pagination={false}
                      globalActions={
                        <>
                          <Button variant="ghost" size="sm" icon={<Filter20Regular />}>Filter</Button>
                          <Button variant="primary" size="sm" icon={<Add20Regular />}>Add</Button>
                        </>
                      }
                    />
                  )}
                  {componentId === 'avatar' && (
                    <VStack gap="lg">
                      <HStack gap="md" style={{ alignItems: 'center' }}>
                        <Avatar name="John Doe" size="xs" />
                        <Avatar name="Jane Smith" size="sm" />
                        <Avatar name="Bob Wilson" size="md" />
                        <Avatar name="Alice Brown" size="lg" />
                      </HStack>
                      <HStack gap="md">
                        <Avatar name="Online" status="online" />
                        <Avatar name="Away" status="away" />
                        <Avatar name="Busy" status="busy" />
                      </HStack>
                      <AvatarStack users={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }, { name: 'Diana' }]} max={3} />
                    </VStack>
                  )}
                  {componentId === 'timeline' && (
                    <Timeline
                      items={[
                        { id: '1', title: 'Order placed', status: 'completed', date: 'Jan 15' },
                        { id: '2', title: 'Processing', status: 'completed', date: 'Jan 16' },
                        { id: '3', title: 'Shipped', status: 'current', date: 'Jan 17' },
                        { id: '4', title: 'Delivered', status: 'upcoming', date: 'Jan 18' }
                      ]}
                    />
                  )}
                  {componentId === 'accordion' && (
                    <Accordion>
                      <AccordionItem id="1" title="What is Forge?">
                        <Text color="secondary">Forge is a modern React component library.</Text>
                      </AccordionItem>
                      <AccordionItem id="2" title="How to install?">
                        <Text color="secondary">Copy the .forge folder to your project.</Text>
                      </AccordionItem>
                      <AccordionItem id="3" title="Is it free?">
                        <Text color="secondary">Yes, completely free to use.</Text>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {componentId === 'treeview' && (
                    <TreeView
                      data={[
                        {
                          id: 'src',
                          label: 'src',
                          icon: <Folder20Regular />,
                          children: [
                            { id: 'components', label: 'components', icon: <Folder20Regular />, children: [
                              { id: 'Button.tsx', label: 'Button.tsx', icon: <DocumentText20Filled /> },
                              { id: 'Card.tsx', label: 'Card.tsx', icon: <DocumentText20Filled /> }
                            ]},
                            { id: 'index.tsx', label: 'index.tsx', icon: <DocumentText20Filled /> }
                          ]
                        }
                      ]}
                      defaultExpanded={['src', 'components']}
                    />
                  )}
                  {componentId === 'calendar' && (
                    <MiniCalendar selectedDate={new Date()} onDateSelect={() => {}} />
                  )}
                  {componentId === 'descriptions' && (
                    <Descriptions
                      items={[
                        { label: 'Name', value: 'John Doe' },
                        { label: 'Email', value: 'john@example.com' },
                        { label: 'Role', value: 'Administrator' },
                        { label: 'Status', value: <Badge variant="success">Active</Badge> }
                      ]}
                      columns={2}
                    />
                  )}
                  {componentId === 'toast' && (
                    <ToastPreview />
                  )}
                  {componentId === 'spinner' && (
                    <HStack gap="xl" style={{ alignItems: 'center' }}>
                      <Spinner size="xs" />
                      <Spinner size="sm" />
                      <Spinner size="md" />
                      <Spinner size="lg" />
                      <Spinner size="md" label="Loading..." />
                    </HStack>
                  )}
                  {componentId === 'skeleton' && (
                    <VStack gap="lg">
                      <HStack gap="md" style={{ alignItems: 'center' }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <VStack gap="sm" style={{ flex: 1 }}>
                          <Skeleton width="60%" height={16} />
                          <Skeleton width="40%" height={12} />
                        </VStack>
                      </HStack>
                      <SkeletonText lines={3} />
                    </VStack>
                  )}
                  {componentId === 'banner' && (
                    <VStack gap="md">
                      <Banner variant="info" title="Information">
                        This is an informational message for your users.
                      </Banner>
                      <Banner variant="success" title="Success">
                        Your operation completed successfully.
                      </Banner>
                      <Banner variant="warning" title="Warning" dismissible>
                        Please review your settings before continuing.
                      </Banner>
                    </VStack>
                  )}
                  {componentId === 'notification' && (
                    <NotificationPreview />
                  )}
                  {componentId === 'splashscreen' && (
                    <SplashScreenPreview />
                  )}
                  {componentId === 'barchart' && (
                    <BarChart
                      data={[
                        { label: 'Jan', value: 65 },
                        { label: 'Feb', value: 85 },
                        { label: 'Mar', value: 120 },
                        { label: 'Apr', value: 90 },
                        { label: 'May', value: 150 }
                      ]}
                      height={180}
                    />
                  )}
                  {componentId === 'linechart' && (
                    <LineChart
                      data={[30, 45, 35, 60, 50, 75, 65]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                      height={160}
                    />
                  )}
                  {componentId === 'donutchart' && (
                    <DonutChart
                      data={[
                        { label: 'Direct', value: 45, color: '#A35BFF' },
                        { label: 'Organic', value: 30, color: '#10b981' },
                        { label: 'Referral', value: 15, color: '#3b82f6' },
                        { label: 'Social', value: 10, color: '#f59e0b' }
                      ]}
                      size={160}
                    />
                  )}
                  {componentId === 'progressring' && (
                    <HStack gap="xl" style={{ alignItems: 'center' }}>
                      <ProgressRing value={25} size={80} color="#ef4444" label="Storage" />
                      <ProgressRing value={60} size={90} color="#f59e0b" label="Memory" />
                      <ProgressRing value={85} size={100} color="#10b981" label="CPU" />
                    </HStack>
                  )}
                  {componentId === 'imagegallery' && (
                    <ImageGallery
                      images={[
                        { src: 'https://picsum.photos/seed/1/800/600', title: 'Mountain View' },
                        { src: 'https://picsum.photos/seed/2/800/600', title: 'Ocean Sunset' },
                        { src: 'https://picsum.photos/seed/3/800/600', title: 'Forest Path' },
                        { src: 'https://picsum.photos/seed/4/800/600', title: 'City Lights' },
                        { src: 'https://picsum.photos/seed/5/800/600', title: 'Desert Dunes' },
                        { src: 'https://picsum.photos/seed/6/800/600', title: 'Lake Reflection' }
                      ]}
                      columns={3}
                      aspectRatio="4/3"
                    />
                  )}
                  {componentId === 'carousel' && (
                    <ImageCarousel
                      images={[
                        { src: 'https://picsum.photos/seed/c1/800/400', caption: 'Beautiful landscape' },
                        { src: 'https://picsum.photos/seed/c2/800/400', caption: 'City skyline' },
                        { src: 'https://picsum.photos/seed/c3/800/400', caption: 'Nature photography' }
                      ]}
                      autoPlay
                      interval={5000}
                    />
                  )}
                  {componentId === 'videoplayer' && (
                    <VideoPlayer
                      src="https://www.w3schools.com/html/mov_bbb.mp4"
                      poster="https://picsum.photos/seed/video/640/360"
                    />
                  )}
                  {componentId === 'audioplayer' && (
                    <VStack gap="md">
                      <AudioPlayer
                        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                        title="SoundHelix Song 1"
                        artist="T. Schürger"
                        cover="https://picsum.photos/seed/audio/200/200"
                      />
                      <MiniAudioPlayer
                        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                        title="SoundHelix Song 2"
                      />
                    </VStack>
                  )}
                  {componentId === 'divider' && (
                    <VStack gap="lg">
                      <VStack gap="md">
                        <Text>Content above</Text>
                        <Divider />
                        <Text>Content below</Text>
                      </VStack>
                      <Divider label="Or continue with" />
                      <HStack gap={16} style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Item 1</Text>
                        <VerticalDivider />
                        <Text>Item 2</Text>
                        <VerticalDivider />
                        <Text>Item 3</Text>
                      </HStack>
                      <SectionDivider label="Features" icon={<Star20Regular />} />
                    </VStack>
                  )}
                  {componentId === 'scrollindicator' && (
                    <Card style={{ padding: '1.5rem' }}>
                      <Text size="sm" color="muted">
                        Le ScrollIndicator est une barre fixe en haut ou en bas de la page qui indique la progression du scroll.
                        Scrollez cette page pour voir l'effet (si activé globalement).
                      </Text>
                    </Card>
                  )}
                  {componentId === 'watermark' && (
                    <Watermark text="CONFIDENTIAL" opacity={0.1}>
                      <Card style={{ padding: '2rem', minHeight: 200 }}>
                        <Heading size="sm">Secret Document</Heading>
                        <Text style={{ marginTop: 8 }}>This content is protected with a watermark overlay.</Text>
                      </Card>
                    </Watermark>
                  )}
                  {componentId === 'highlight' && (
                    <VStack gap="md">
                      <Text>
                        <Highlight
                          text="The quick brown fox jumps over the lazy dog"
                          query="fox"
                        />
                      </Text>
                      <Text>
                        <Highlight
                          text="React is a JavaScript library. React makes UI development easy."
                          query="React"
                        />
                      </Text>
                      <Text>
                        <Highlight
                          text="Important: This action cannot be undone"
                          query="cannot be undone"
                          highlightBg="rgba(239, 68, 68, 0.3)"
                          highlightColor="var(--error)"
                        />
                      </Text>
                    </VStack>
                  )}
                  {componentId === 'texttruncate' && (
                    <VStack gap="lg">
                      <TextTruncate
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                        maxLines={2}
                      />
                      <TextTruncate
                        text="This is a long description that will be cut off after a certain number of characters to keep the UI clean and compact."
                        maxLength={80}
                        expandLabel="Show more"
                        collapseLabel="Show less"
                      />
                    </VStack>
                  )}
                  {componentId === 'copytext' && (
                    <VStack gap="lg">
                      <CopyText text="npm install wss3-forge">
                        <code style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}>
                          npm install wss3-forge
                        </code>
                      </CopyText>
                      <CopyText text="USR-12345-ABCDE" successMessage="ID copied!">
                        <Text color="muted" style={{ cursor: 'pointer' }}>
                          ID: USR-12345-ABCDE (click to copy)
                        </Text>
                      </CopyText>
                    </VStack>
                  )}
                  {componentId === 'affix' && (
                    <Card style={{ padding: '1.5rem' }}>
                      <Text size="sm" color="muted">
                        Affix, StickyHeader and StickySidebar components allow you to pin content on scroll.
                        They are used in this documentation for the sidebar and header.
                      </Text>
                    </Card>
                  )}
                  {componentId === 'codeblock' && (
                    <VStack gap="md">
                      <CodeBlock
                        code={`const greeting = "Hello World"
console.log(greeting)`}
                        language="typescript"
                      />
                      <CodeBlock
                        code={`function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
}`}
                        language="tsx"
                        showLineNumbers
                        title="MyComponent.tsx"
                      />
                    </VStack>
                  )}
                  {componentId === 'copybutton' && (
                    <VStack gap="lg">
                      <HStack gap="md" style={{ alignItems: 'center' }}>
                        <CopyButton text="Text to copy" variant="icon" />
                        <CopyButton text="Copy me" variant="button" label="Copy Code" />
                        <CopyButton text="Minimal" variant="minimal" />
                      </HStack>
                      <CopyField
                        value="https://example.com/invite/abc123"
                        label="Invite Link"
                      />
                    </VStack>
                  )}
                  {componentId === 'heading' && (
                    <VStack gap="md" style={{ alignItems: 'flex-start' }}>
                      <Heading level={1}>H1 Page Title</Heading>
                      <Heading level={2}>H2 Section Title</Heading>
                      <Heading level={3}>H3 Subsection</Heading>
                      <Divider />
                      <Text size="lg">Large text</Text>
                      <Text size="md">Medium text (default)</Text>
                      <Text size="sm">Small text</Text>
                      <Text color="muted">Muted color</Text>
                    </VStack>
                  )}
                  {componentId === 'animate' && (
                    <HStack gap="md">
                      <Animate type="fadeIn"><Card padding="md">Fade In</Card></Animate>
                      <Animate type="slideInUp"><Card padding="md">Slide Up</Card></Animate>
                      <Animate type="scaleIn"><Card padding="md">Scale In</Card></Animate>
                    </HStack>
                  )}
                  {componentId === 'countdown' && (
                    <VStack gap="lg">
                      <Countdown targetDate={new Date('2025-12-31T00:00:00')} />
                      <Timer initialSeconds={120} countDown autoStart />
                    </VStack>
                  )}
                  {componentId === 'rating' && (
                    <VStack gap="md" style={{ alignItems: 'flex-start' }}>
                      <Rating value={3} onChange={() => {}} max={5} />
                      <RatingDisplay value={4.5} />
                      <RatingDisplay value={3} size="sm" />
                    </VStack>
                  )}
                  {componentId === 'tour' && (
                    <VStack gap="lg" style={{ alignItems: 'center' }}>
                      <Button variant="primary" onClick={docsTour.start}>
                        Start Forge Docs Tour
                      </Button>
                      <Text size="sm" color="muted" style={{ textAlign: 'center' }}>
                        Click the button above to start an interactive tour of the Forge documentation.
                      </Text>
                    </VStack>
                  )}
                  {componentId && !['button', 'iconbutton', 'gradientbutton', 'floatbutton', 'card', 'statcard', 'imagecard', 'vstack', 'grid', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'slider', 'searchinput', 'datepicker', 'colorpicker', 'taginput', 'numberinput', 'otpinput', 'phoneinput', 'fileupload', 'tabs', 'pills', 'pagination', 'breadcrumbs', 'stepper', 'navbar', 'footer', 'modal', 'confirmdialog', 'sheet', 'dropdown', 'tooltip', 'popover', 'commandbar', 'badge', 'table', 'avatar', 'timeline', 'accordion', 'treeview', 'calendar', 'descriptions', 'toast', 'spinner', 'skeleton', 'banner', 'notification', 'splashscreen', 'barchart', 'linechart', 'donutchart', 'progressring', 'imagegallery', 'carousel', 'videoplayer', 'audioplayer', 'divider', 'scrollindicator', 'affix', 'watermark', 'highlight', 'texttruncate', 'copytext', 'codeblock', 'copybutton', 'heading', 'animate', 'countdown', 'rating', 'tour'].includes(componentId) && (
                    <></>
                  )}
                </VStack>
              </div>
            </Card>
          </TabPanel>

          <TabPanel id="code" active={activeTab}>
            <div style={{ marginTop: '1rem' }}>
              <CodeBlock
                code={docs.basicUsage}
                language="tsx"
                showLineNumbers
                showCopyButton
              />
            </div>
          </TabPanel>

          <TabPanel id="props" active={activeTab}>
            <Card padding="none" style={{ marginTop: '1rem', overflow: 'hidden' }}>
              {docs.props.length > 0 ? (
                <Table
                  columns={[
                    { key: 'name', header: 'Prop', width: '20%' },
                    { key: 'type', header: 'Type', width: '30%' },
                    { key: 'default', header: 'Default', width: '15%' },
                    { key: 'description', header: 'Description', width: '35%' }
                  ]}
                  data={docs.props}
                  pagination={false}
                  searchable={false}
                  noPadding
                />
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <Text color="muted">Props documentation coming soon.</Text>
                </div>
              )}
            </Card>
          </TabPanel>
        </TabPanels>
        </div>
      </Animate>

      {docs.examples.length > 0 && (
        <Animate type="slideInUp" delay={300}>
          <div id="examples" style={{ position: 'relative', zIndex: 10 }}>
            <VStack gap="xl">
              <SectionHeading id="examples" level={2}>Examples</SectionHeading>
              {docs.examples.map((example, index) => (
                <VStack key={index} gap="md" style={{ marginBottom: '1rem', position: 'relative', zIndex: docs.examples.length - index }}>
                  <Heading level={4}>{example.title}</Heading>
                  <Card padding="lg" style={{ paddingTop: '3rem', paddingBottom: '3rem', overflow: 'visible', backgroundColor: componentId && ['pills', 'footer', 'skeleton', 'copytext', 'copybutton', 'fileupload', 'stepper', 'slider'].includes(componentId) ? 'var(--bg-secondary)' : 'var(--bg-tertiary)' }}>
                    <div style={{ width: '100%', maxWidth: componentId && ['navbar', 'table', 'calendar', 'footer'].includes(componentId) ? '100%' : componentId && ['card', 'statcard', 'imagecard', 'horizontalcard', 'actioncard'].includes(componentId) ? '500px' : '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: componentId && ['input', 'textarea', 'select', 'slider', 'searchinput', 'datepicker', 'taginput', 'numberinput', 'phoneinput', 'fileupload', 'tabs', 'stepper', 'navbar', 'card', 'statcard', 'imagecard', 'horizontalcard', 'actioncard', 'grid', 'table', 'timeline', 'accordion', 'treeview', 'descriptions', 'calendar', 'toast', 'skeleton', 'banner', 'notification', 'barchart', 'linechart', 'imagegallery', 'carousel', 'videoplayer', 'audioplayer', 'divider', 'footer'].includes(componentId) ? 'stretch' : 'center' }}>
                      {example.render}
                    </div>
                  </Card>
                  <CodeBlock code={example.code} language="tsx" showCopyButton />
                </VStack>
              ))}
            </VStack>
          </div>
        </Animate>
      )}
      </VStack>

      {/* Tour for demo */}
      <Tour
        steps={tourSteps}
        isOpen={docsTour.isOpen}
        onClose={docsTour.close}
        onComplete={docsTour.complete}
        nextLabel="Next"
        doneLabel="Done"
        skipLabel="Skip"
      />
    </>
  )
}
