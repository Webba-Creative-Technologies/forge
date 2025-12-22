import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppSidebar, Container, TableOfContents, TOCItem, HStack, VStack, Text, Divider, Card, Pills, BackToTop } from '../../../.forge'
import { useTheme } from '../../main'
import {
  Rocket20Regular,
  ArrowDownload20Regular,
  Grid20Regular,
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
  History20Regular,
  ArrowLeft20Regular,
  ArrowRight20Regular,
  WeatherMoon16Regular,
  WeatherSunny16Regular,
  Color20Regular,
  Bot20Regular
} from '@fluentui/react-icons'

// Flat list of all navigable pages in order
const allPages = [
  { id: 'getting-started', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'design-language', label: 'Design Language' },
  { id: 'components', label: 'Components Overview' },
  // Buttons
  { id: 'components/button', label: 'Button' },
  { id: 'components/iconbutton', label: 'IconButton' },
  { id: 'components/gradientbutton', label: 'GradientButton' },
  { id: 'components/floatbutton', label: 'FloatButton' },
  // Cards & Layout
  { id: 'components/card', label: 'Card' },
  { id: 'components/statcard', label: 'StatCard' },
  { id: 'components/imagecard', label: 'ImageCard' },
  { id: 'components/vstack', label: 'VStack' },
  { id: 'components/grid', label: 'Grid' },
  // Forms
  { id: 'components/input', label: 'Input' },
  { id: 'components/textarea', label: 'Textarea' },
  { id: 'components/select', label: 'Select' },
  { id: 'components/checkbox', label: 'Checkbox' },
  { id: 'components/radio', label: 'Radio' },
  { id: 'components/switch', label: 'Switch' },
  { id: 'components/slider', label: 'Slider' },
  { id: 'components/searchinput', label: 'SearchInput' },
  { id: 'components/datepicker', label: 'DatePicker' },
  { id: 'components/colorpicker', label: 'ColorPicker' },
  { id: 'components/fileupload', label: 'FileUpload' },
  { id: 'components/taginput', label: 'TagInput' },
  { id: 'components/numberinput', label: 'NumberInput' },
  { id: 'components/otpinput', label: 'OTPInput' },
  { id: 'components/phoneinput', label: 'PhoneInput' },
  // Navigation
  { id: 'components/navbar', label: 'Navbar' },
  { id: 'components/tabs', label: 'Tabs' },
  { id: 'components/pills', label: 'Pills' },
  { id: 'components/breadcrumbs', label: 'Breadcrumbs' },
  { id: 'components/pagination', label: 'Pagination' },
  { id: 'components/stepper', label: 'Stepper' },
  { id: 'components/footer', label: 'Footer' },
  // Overlays
  { id: 'components/modal', label: 'Modal' },
  { id: 'components/dropdown', label: 'Dropdown' },
  { id: 'components/tooltip', label: 'Tooltip' },
  { id: 'components/sheet', label: 'Sheet' },
  { id: 'components/popover', label: 'Popover' },
  { id: 'components/commandbar', label: 'CommandBar' },
  // Data Display
  { id: 'components/table', label: 'Table' },
  { id: 'components/badge', label: 'Badge' },
  { id: 'components/avatar', label: 'Avatar' },
  { id: 'components/timeline', label: 'Timeline' },
  { id: 'components/accordion', label: 'Accordion' },
  { id: 'components/treeview', label: 'TreeView' },
  { id: 'components/calendar', label: 'Calendar' },
  { id: 'components/descriptions', label: 'Descriptions' },
  // Feedback
  { id: 'components/toast', label: 'Toast' },
  { id: 'components/spinner', label: 'Spinner' },
  { id: 'components/skeleton', label: 'Skeleton' },
  { id: 'components/banner', label: 'Banner' },
  { id: 'components/notification', label: 'Notification' },
  { id: 'components/splashscreen', label: 'SplashScreen' },
  // Charts
  { id: 'components/barchart', label: 'BarChart' },
  { id: 'components/linechart', label: 'LineChart' },
  { id: 'components/donutchart', label: 'DonutChart' },
  { id: 'components/progressring', label: 'ProgressRing' },
  // Media
  { id: 'components/imagegallery', label: 'ImageGallery' },
  { id: 'components/carousel', label: 'Carousel' },
  { id: 'components/videoplayer', label: 'VideoPlayer' },
  { id: 'components/audioplayer', label: 'AudioPlayer' },
  // Utilities
  { id: 'components/divider', label: 'Divider' },
  { id: 'components/scrollindicator', label: 'ScrollIndicator' },
  { id: 'components/affix', label: 'Affix' },
  { id: 'components/watermark', label: 'Watermark' },
  { id: 'components/highlight', label: 'Highlight' },
  { id: 'components/texttruncate', label: 'TextTruncate' },
  { id: 'components/copytext', label: 'CopyText' },
  { id: 'components/codeblock', label: 'CodeBlock' },
  { id: 'components/copybutton', label: 'CopyButton' },
  { id: 'components/heading', label: 'Heading' },
  { id: 'components/animate', label: 'Animate' },
  { id: 'components/countdown', label: 'Countdown' },
  { id: 'components/rating', label: 'Rating' },
  { id: 'components/tour', label: 'Tour' },
  { id: 'ai-integration', label: 'AI Integration' },
  { id: 'changelog', label: 'Changelog' }
]

const sidebarSections = [
  {
    title: 'Getting Started',
    items: [
      { id: 'getting-started', label: 'Introduction', icon: <Rocket20Regular /> },
      { id: 'installation', label: 'Installation', icon: <ArrowDownload20Regular /> },
      { id: 'design-language', label: 'Design Language', icon: <Color20Regular /> }
    ]
  },
  {
    title: 'Components',
    items: [
      { id: 'components', label: 'Overview', icon: <Grid20Regular /> },
      {
        id: 'buttons-section',
        label: 'Buttons',
        icon: <CursorClick20Regular />,
        children: [
          { id: 'components/button', label: 'Button', icon: null },
          { id: 'components/iconbutton', label: 'IconButton', icon: null },
          { id: 'components/gradientbutton', label: 'GradientButton', icon: null },
          { id: 'components/floatbutton', label: 'FloatButton', icon: null }
        ]
      },
      {
        id: 'cards-section',
        label: 'Cards & Layout',
        icon: <LayoutColumnTwo20Regular />,
        children: [
          { id: 'components/card', label: 'Card', icon: null },
          { id: 'components/statcard', label: 'StatCard', icon: null },
          { id: 'components/imagecard', label: 'ImageCard', icon: null },
          { id: 'components/vstack', label: 'VStack / HStack', icon: null },
          { id: 'components/grid', label: 'Grid', icon: null }
        ]
      },
      {
        id: 'forms-section',
        label: 'Forms',
        icon: <TextboxSettings20Regular />,
        children: [
          { id: 'components/input', label: 'Input', icon: null },
          { id: 'components/textarea', label: 'Textarea', icon: null },
          { id: 'components/select', label: 'Select', icon: null },
          { id: 'components/checkbox', label: 'Checkbox', icon: null },
          { id: 'components/radio', label: 'Radio', icon: null },
          { id: 'components/switch', label: 'Switch', icon: null },
          { id: 'components/slider', label: 'Slider', icon: null },
          { id: 'components/searchinput', label: 'SearchInput', icon: null },
          { id: 'components/datepicker', label: 'DatePicker', icon: null },
          { id: 'components/colorpicker', label: 'ColorPicker', icon: null },
          { id: 'components/fileupload', label: 'FileUpload', icon: null },
          { id: 'components/taginput', label: 'TagInput', icon: null },
          { id: 'components/numberinput', label: 'NumberInput', icon: null },
          { id: 'components/otpinput', label: 'OTPInput', icon: null },
          { id: 'components/phoneinput', label: 'PhoneInput', icon: null }
        ]
      },
      {
        id: 'navigation-section',
        label: 'Navigation',
        icon: <Navigation20Regular />,
        children: [
          { id: 'components/navbar', label: 'Navbar', icon: null },
          { id: 'components/tabs', label: 'Tabs', icon: null },
          { id: 'components/pills', label: 'Pills', icon: null },
          { id: 'components/breadcrumbs', label: 'Breadcrumbs', icon: null },
          { id: 'components/pagination', label: 'Pagination', icon: null },
          { id: 'components/stepper', label: 'Stepper', icon: null },
          { id: 'components/footer', label: 'Footer', icon: null }
        ]
      },
      {
        id: 'overlays-section',
        label: 'Overlays',
        icon: <PanelRight20Regular />,
        children: [
          { id: 'components/modal', label: 'Modal', icon: null },
          { id: 'components/dropdown', label: 'Dropdown', icon: null },
          { id: 'components/tooltip', label: 'Tooltip', icon: null },
          { id: 'components/sheet', label: 'Sheet', icon: null },
          { id: 'components/popover', label: 'Popover', icon: null },
          { id: 'components/commandbar', label: 'CommandBar', icon: null }
        ]
      },
      {
        id: 'data-section',
        label: 'Data Display',
        icon: <Table20Regular />,
        children: [
          { id: 'components/table', label: 'Table', icon: null },
          { id: 'components/badge', label: 'Badge', icon: null },
          { id: 'components/avatar', label: 'Avatar', icon: null },
          { id: 'components/timeline', label: 'Timeline', icon: null },
          { id: 'components/accordion', label: 'Accordion', icon: null },
          { id: 'components/treeview', label: 'TreeView', icon: null },
          { id: 'components/calendar', label: 'Calendar', icon: null },
          { id: 'components/descriptions', label: 'Descriptions', icon: null }
        ]
      },
      {
        id: 'feedback-section',
        label: 'Feedback',
        icon: <AlertOn20Regular />,
        children: [
          { id: 'components/toast', label: 'Toast', icon: null },
          { id: 'components/spinner', label: 'Spinner', icon: null },
          { id: 'components/skeleton', label: 'Skeleton', icon: null },
          { id: 'components/banner', label: 'Banner', icon: null },
          { id: 'components/notification', label: 'Notification', icon: null },
          { id: 'components/splashscreen', label: 'SplashScreen', icon: null }
        ]
      },
      {
        id: 'charts-section',
        label: 'Charts',
        icon: <DataPie20Regular />,
        children: [
          { id: 'components/barchart', label: 'BarChart', icon: null },
          { id: 'components/linechart', label: 'LineChart', icon: null },
          { id: 'components/donutchart', label: 'DonutChart', icon: null },
          { id: 'components/progressring', label: 'ProgressRing', icon: null }
        ]
      },
      {
        id: 'media-section',
        label: 'Media',
        icon: <Video20Regular />,
        children: [
          { id: 'components/imagegallery', label: 'ImageGallery', icon: null },
          { id: 'components/carousel', label: 'Carousel', icon: null },
          { id: 'components/videoplayer', label: 'VideoPlayer', icon: null },
          { id: 'components/audioplayer', label: 'AudioPlayer', icon: null }
        ]
      },
      {
        id: 'utilities-section',
        label: 'Utilities',
        icon: <Wrench20Regular />,
        children: [
          { id: 'components/divider', label: 'Divider', icon: null },
          { id: 'components/scrollindicator', label: 'ScrollIndicator', icon: null },
          { id: 'components/affix', label: 'Affix', icon: null },
          { id: 'components/watermark', label: 'Watermark', icon: null },
          { id: 'components/highlight', label: 'Highlight', icon: null },
          { id: 'components/texttruncate', label: 'TextTruncate', icon: null },
          { id: 'components/copytext', label: 'CopyText', icon: null },
          { id: 'components/codeblock', label: 'CodeBlock', icon: null },
          { id: 'components/copybutton', label: 'CopyButton', icon: null },
          { id: 'components/heading', label: 'Heading / Text', icon: null },
          { id: 'components/animate', label: 'Animate', icon: null },
          { id: 'components/countdown', label: 'Countdown', icon: null },
          { id: 'components/rating', label: 'Rating', icon: null },
          { id: 'components/tour', label: 'Tour', icon: null }
        ]
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      { id: 'ai-integration', label: 'AI Integration', icon: <Bot20Regular /> },
      { id: 'changelog', label: 'Changelog', icon: <History20Regular /> }
    ]
  }
]

// TOC items for each page
const pageTOC: Record<string, TOCItem[]> = {
  'getting-started': [
    { id: 'what-is-forge', title: 'What is Forge?', level: 2 },
    { id: 'key-features', title: 'Key Features', level: 2 },
    { id: 'quick-example', title: 'Quick Example', level: 2 },
    { id: 'design-principles', title: 'Design Principles', level: 2 }
  ],
  'installation': [
    { id: 'prerequisites', title: 'Prerequisites', level: 2 },
    { id: 'step-1', title: 'Step 1: Copy Forge', level: 2 },
    { id: 'step-2', title: 'Step 2: Install Icons', level: 2 },
    { id: 'step-3', title: 'Step 3: Setup Provider', level: 2 },
    { id: 'step-4', title: 'Step 4: Start Building', level: 2 },
    { id: 'css-variables', title: 'CSS Variables', level: 2 }
  ],
  'design-language': [
    { id: 'colors', title: 'Colors', level: 2 },
    { id: 'typography', title: 'Typography', level: 2 },
    { id: 'spacing', title: 'Spacing', level: 2 },
    { id: 'radius', title: 'Border Radius', level: 2 },
    { id: 'shadows', title: 'Shadows', level: 2 },
    { id: 'dark-mode', title: 'Dark Mode', level: 2 }
  ],
  'components': [
    { id: 'search', title: 'Search', level: 2 },
    { id: 'categories', title: 'Categories', level: 2 }
  ],
  'component-page': [
    { id: 'import', title: 'Import', level: 2 },
    { id: 'usage', title: 'Usage', level: 2 },
    { id: 'examples', title: 'Examples', level: 2 }
  ],
  'ai-integration': [
    { id: 'overview', title: 'Overview', level: 2 },
    { id: 'quick-setup', title: 'Quick Setup', level: 2 },
    { id: 'rules', title: 'Rules for AI', level: 2 },
    { id: 'icons', title: 'Icons', level: 2 },
    { id: 'colors', title: 'Colors', level: 2 },
    { id: 'components', title: 'Using Components', level: 2 },
    { id: 'prompt-template', title: 'Prompt Template', level: 2 },
    { id: 'best-practices', title: 'Best Practices', level: 2 }
  ],
  'changelog': [
    { id: 'v3.0.0', title: 'v3.0.0 - WSS3 Forge', level: 2 },
    { id: 'v2.0.0', title: 'v2.0.0 - WSS2 Orant', level: 2 },
    { id: 'v1.0.0', title: 'v1.0.0 - WSS', level: 2 }
  ]
}

export function DocsLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { mode, toggleTheme } = useTheme()
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll to hash or top on page change
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getActiveId = () => {
    const path = location.pathname.replace('/docs/', '').replace('/docs', '')
    if (!path || path === '') return 'getting-started'
    return path
  }

  const handleNavigate = (id: string) => {
    if (id === 'changelog') {
      navigate('/docs/changelog')
    } else if (id.endsWith('-section')) {
      return
    } else {
      navigate(`/docs/${id}`)
    }
  }

  const activeId = getActiveId()
  // Use component-page TOC for individual component pages
  const tocKey = activeId.startsWith('components/') ? 'component-page' : activeId
  const currentTOC = pageTOC[tocKey] || []
  const showTOC = currentTOC.length > 0

  // Get prev/next pages
  const currentIndex = allPages.findIndex(p => p.id === activeId)
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null

  return (
    <div style={{
      display: 'flex',
      minHeight: '100%',
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Scroll Progress Indicator */}
      <div style={{
        position: 'fixed',
        top: 70,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'var(--border-subtle)',
        zIndex: 999
      }}>
        <div style={{
          height: '100%',
          width: `${scrollProgress}%`,
          backgroundColor: 'var(--brand-primary)',
          transition: 'width 0.1s ease-out'
        }} />
      </div>

      {/* Back to Top Button */}
      <BackToTop threshold={400} />
      {/* Sidebar - fixed position */}
      <div
        id="docs-sidebar"
        className="docs-sidebar-container"
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          width: 280,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          zIndex: 100
        }}
      >
        <AppSidebar
          sections={sidebarSections}
          activeId={activeId}
          onNavigate={handleNavigate}
          width={280}
          showHeader={false}
          showSearch={false}
        />
      </div>

      {/* Spacer for fixed sidebar */}
      <div className="docs-sidebar-spacer" style={{ width: 280, flexShrink: 0 }} />

      {/* Main Content */}
      <main className="docs-main-content" style={{
        flex: 1,
        padding: '4rem 2rem 4rem',
        minWidth: 0
      }}>
        <Container maxWidth={showTOC ? 800 : 900}>
          <Outlet />

          {/* Footer with prev/next navigation */}
          <VStack gap="lg" style={{ marginTop: '4rem' }}>
            <Divider />

            {/* Prev/Next Navigation */}
            <HStack gap="md" style={{ justifyContent: 'space-between' }}>
              {prevPage ? (
                <Card
                  padding="md"
                  hoverable
                  onClick={() => navigate(`/docs/${prevPage.id}`)}
                  style={{ flex: 1, maxWidth: '45%' }}
                >
                  <HStack gap="sm" style={{ alignItems: 'center' }}>
                    <ArrowLeft20Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <VStack gap="xs" style={{ minWidth: 0 }}>
                      <Text size="xs" color="muted">Previous</Text>
                      <Text size="sm" style={{ fontWeight: 500 }}>{prevPage.label}</Text>
                    </VStack>
                  </HStack>
                </Card>
              ) : <div />}

              {nextPage ? (
                <Card
                  padding="md"
                  hoverable
                  onClick={() => navigate(`/docs/${nextPage.id}`)}
                  style={{ flex: 1, maxWidth: '45%', marginLeft: 'auto' }}
                >
                  <HStack gap="sm" style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                    <VStack gap="xs" style={{ minWidth: 0, alignItems: 'flex-end' }}>
                      <Text size="xs" color="muted">Next</Text>
                      <Text size="sm" style={{ fontWeight: 500 }}>{nextPage.label}</Text>
                    </VStack>
                    <ArrowRight20Regular style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </HStack>
                </Card>
              ) : <div />}
            </HStack>

            {/* Last updated */}
            <Text size="xs" color="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>
              Last updated: December 2025
            </Text>
          </VStack>
        </Container>
      </main>

      {/* TOC Sidebar - sticky */}
      {showTOC && (
        <aside style={{
          width: 220,
          flexShrink: 0,
          padding: '2rem 1.5rem 2rem 0',
          display: 'none',
          position: 'sticky',
          top: 80,
          alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto'
        }}
        className="toc-sidebar"
        >
          <TableOfContents
            items={currentTOC}
            sticky={false}
            variant="minimal"
            title="On this page"
            autoTrack
            scrollOffset={100}
          />

          {/* Theme Toggle */}
          <Divider spacing="lg" />
          <VStack gap="sm" style={{ alignItems: 'flex-start' }}>
            <Text size="xs" color="muted">Theme</Text>
            <Pills
              options={[
                { id: 'light', label: <><WeatherSunny16Regular /> Light</> },
                { id: 'dark', label: <><WeatherMoon16Regular /> Dark</> }
              ]}
              selected={mode}
              onChange={(id) => { if (id !== mode) toggleTheme() }}
            />
          </VStack>
        </aside>
      )}

      {/* Show TOC on larger screens + fix sidebar height + hide sidebar on mobile */}
      <style>{`
        @media (min-width: 1200px) {
          .toc-sidebar {
            display: block !important;
          }
        }
        .docs-sidebar-container aside {
          height: 100% !important;
          position: relative !important;
        }
        @media (max-width: 1023px) {
          .docs-sidebar-container {
            display: none !important;
          }
          .docs-sidebar-spacer {
            display: none !important;
          }
          .docs-main-content {
            padding: 2rem 0.75rem 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}
