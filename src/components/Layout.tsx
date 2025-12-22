import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { useCanonical } from '../hooks/useCanonical'
import { Navbar, Button, CommandBar, SearchResult } from '../../.forge'
import {
  Home20Regular,
  Document20Regular,
  Apps20Regular,
  Play20Regular,
  Rocket20Regular,
  ArrowDownload20Regular,
  Grid20Regular,
  Color20Regular,
  CursorClick20Regular,
  TextboxSettings20Regular,
  Navigation20Regular,
  Table20Regular,
  AlertOn20Regular,
  DataPie20Regular,
  Wrench20Regular,
  Wand20Regular,
  Heart20Regular
} from '@fluentui/react-icons'

const navItems = [
  { id: 'home', label: 'Home', icon: <Home20Regular /> },
  { id: 'docs', label: 'Docs', icon: <Document20Regular /> },
  { id: 'blocks', label: 'Blocks', icon: <Apps20Regular /> },
  { id: 'playground', label: 'Playground', icon: <Play20Regular /> },
  { id: 'create', label: 'Create', icon: <Wand20Regular /> }
]

// Search data for CommandBar
const searchData: SearchResult[] = [
  // Getting Started
  { id: 'getting-started', type: 'page', title: 'Introduction', subtitle: 'Getting Started', icon: <Rocket20Regular />, route: '/docs/getting-started', keywords: ['intro', 'start', 'begin', 'guide'] },
  { id: 'installation', type: 'page', title: 'Installation', subtitle: 'Getting Started', icon: <ArrowDownload20Regular />, route: '/docs/installation', keywords: ['install', 'setup', 'npm', 'yarn'] },
  { id: 'design-language', type: 'page', title: 'Design Language', subtitle: 'Getting Started', icon: <Color20Regular />, route: '/docs/design-language', keywords: ['design', 'style', 'guidelines'] },
  { id: 'components', type: 'page', title: 'Components Overview', subtitle: 'Components', icon: <Grid20Regular />, route: '/docs/components', keywords: ['all', 'list', 'overview'] },
  { id: 'ai-integration', type: 'page', title: 'AI Integration', subtitle: 'Getting Started', icon: <Rocket20Regular />, route: '/docs/ai-integration', keywords: ['ai', 'claude', 'gpt', 'assistant', 'llm'] },
  { id: 'changelog', type: 'page', title: 'Changelog', subtitle: 'Getting Started', icon: <Rocket20Regular />, route: '/docs/changelog', keywords: ['updates', 'versions', 'history', 'changes'] },
  { id: 'templates', type: 'page', title: 'Templates', subtitle: 'Getting Started', icon: <Rocket20Regular />, route: '/docs/templates', keywords: ['starter', 'boilerplate', 'example'] },

  // Buttons
  { id: 'button', type: 'component', title: 'Button', subtitle: 'Buttons', icon: <CursorClick20Regular />, route: '/docs/components/button', keywords: ['btn', 'click', 'action', 'submit'] },
  { id: 'iconbutton', type: 'component', title: 'IconButton', subtitle: 'Buttons', icon: <CursorClick20Regular />, route: '/docs/components/iconbutton', keywords: ['icon', 'btn', 'action'] },
  { id: 'gradientbutton', type: 'component', title: 'GradientButton', subtitle: 'Buttons', icon: <CursorClick20Regular />, route: '/docs/components/gradientbutton', keywords: ['gradient', 'colorful', 'cta'] },
  { id: 'floatbutton', type: 'component', title: 'FloatButton', subtitle: 'Buttons', icon: <CursorClick20Regular />, route: '/docs/components/floatbutton', keywords: ['fab', 'floating', 'action'], aliases: ['FAB', 'FloatingActionButton'] },

  // Cards & Layout
  { id: 'card', type: 'component', title: 'Card', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/card', keywords: ['container', 'box', 'panel'] },
  { id: 'statcard', type: 'component', title: 'StatCard', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/statcard', keywords: ['stats', 'metrics', 'kpi', 'dashboard'] },
  { id: 'imagecard', type: 'component', title: 'ImageCard', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/imagecard', keywords: ['image', 'photo', 'media'] },
  { id: 'horizontalcard', type: 'component', title: 'HorizontalCard', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/horizontalcard', keywords: ['horizontal', 'row'] },
  { id: 'actioncard', type: 'component', title: 'ActionCard', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/actioncard', keywords: ['action', 'clickable'] },
  { id: 'vstack', type: 'component', title: 'VStack / HStack', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/vstack', keywords: ['stack', 'flex', 'vertical', 'horizontal', 'layout'] },
  { id: 'grid', type: 'component', title: 'Grid', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/grid', keywords: ['columns', 'rows', 'responsive', 'layout'] },
  { id: 'container', type: 'component', title: 'Container', subtitle: 'Cards & Layout', icon: <Grid20Regular />, route: '/docs/components/container', keywords: ['wrapper', 'max-width', 'center'] },

  // Forms
  { id: 'input', type: 'component', title: 'Input', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/input', keywords: ['text', 'field', 'textbox', 'form'], aliases: ['TextField', 'TextInput'] },
  { id: 'textarea', type: 'component', title: 'Textarea', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/textarea', keywords: ['multiline', 'text', 'message'] },
  { id: 'select', type: 'component', title: 'Select', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/select', keywords: ['dropdown', 'option', 'choice', 'picker'], aliases: ['Dropdown', 'Picker', 'Combobox'] },
  { id: 'checkbox', type: 'component', title: 'Checkbox', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/checkbox', keywords: ['check', 'tick', 'boolean', 'toggle'] },
  { id: 'switch', type: 'component', title: 'Switch', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/switch', keywords: ['toggle', 'on', 'off', 'boolean'], aliases: ['Toggle'] },
  { id: 'datepicker', type: 'component', title: 'DatePicker', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/datepicker', keywords: ['date', 'calendar', 'time'], aliases: ['Calendar', 'DateInput'] },
  { id: 'slider', type: 'component', title: 'Slider', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/slider', keywords: ['range', 'value', 'number'], aliases: ['Range', 'RangeSlider'] },
  { id: 'rating', type: 'component', title: 'Rating', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/rating', keywords: ['stars', 'score', 'review'], aliases: ['Stars', 'StarRating'] },
  { id: 'taginput', type: 'component', title: 'TagInput', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/taginput', keywords: ['tags', 'chips', 'labels', 'multi'], aliases: ['ChipInput', 'MultiSelect', 'TagsInput'] },
  { id: 'searchinput', type: 'component', title: 'SearchInput', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/searchinput', keywords: ['search', 'find', 'query'], aliases: ['SearchBox', 'SearchField'] },
  { id: 'numberinput', type: 'component', title: 'NumberInput', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/numberinput', keywords: ['number', 'numeric', 'counter'], aliases: ['NumericInput', 'Stepper'] },
  { id: 'phoneinput', type: 'component', title: 'PhoneInput', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/phoneinput', keywords: ['phone', 'telephone', 'mobile'], aliases: ['TelInput', 'PhoneNumber'] },
  { id: 'colorpicker', type: 'component', title: 'ColorPicker', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/colorpicker', keywords: ['color', 'colour', 'picker', 'hex'], aliases: ['ColorInput', 'ColorSelector'] },
  { id: 'fileupload', type: 'component', title: 'FileUpload', subtitle: 'Forms', icon: <TextboxSettings20Regular />, route: '/docs/components/fileupload', keywords: ['file', 'upload', 'attachment', 'dropzone'], aliases: ['Dropzone', 'FilePicker', 'Upload'] },

  // Navigation
  { id: 'navbar', type: 'component', title: 'Navbar', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/navbar', keywords: ['header', 'navigation', 'menu', 'top'] },
  { id: 'tabs', type: 'component', title: 'Tabs', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/tabs', keywords: ['tab', 'panel', 'switch'] },
  { id: 'pills', type: 'component', title: 'Pills', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/pills', keywords: ['pill', 'segment', 'toggle'] },
  { id: 'breadcrumbs', type: 'component', title: 'Breadcrumbs', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/breadcrumbs', keywords: ['path', 'trail', 'navigation'] },
  { id: 'pagination', type: 'component', title: 'Pagination', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/pagination', keywords: ['pages', 'pager', 'next', 'previous'] },
  { id: 'footer', type: 'component', title: 'Footer', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/footer', keywords: ['bottom', 'links', 'copyright'] },
  { id: 'stepper', type: 'component', title: 'Stepper', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/stepper', keywords: ['steps', 'wizard', 'progress', 'multi-step'] },
  { id: 'sidebar', type: 'component', title: 'Sidebar', subtitle: 'Navigation', icon: <Navigation20Regular />, route: '/docs/components/sidebar', keywords: ['side', 'menu', 'drawer', 'navigation'] },

  // Data Display
  { id: 'table', type: 'component', title: 'Table', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/table', keywords: ['grid', 'data', 'rows', 'columns', 'datagrid'] },
  { id: 'badge', type: 'component', title: 'Badge', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/badge', keywords: ['tag', 'label', 'chip', 'status'] },
  { id: 'avatar', type: 'component', title: 'Avatar', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/avatar', keywords: ['user', 'profile', 'image', 'picture'] },
  { id: 'accordion', type: 'component', title: 'Accordion', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/accordion', keywords: ['collapse', 'expand', 'faq', 'panel'] },
  { id: 'timeline', type: 'component', title: 'Timeline', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/timeline', keywords: ['history', 'events', 'chronology'] },
  { id: 'treeview', type: 'component', title: 'TreeView', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/treeview', keywords: ['tree', 'hierarchy', 'nested', 'files'] },
  { id: 'descriptions', type: 'component', title: 'Descriptions', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/descriptions', keywords: ['list', 'details', 'info', 'properties'] },
  { id: 'calendar', type: 'component', title: 'Calendar', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/calendar', keywords: ['date', 'month', 'events', 'schedule'] },
  { id: 'text', type: 'component', title: 'Text', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/text', keywords: ['typography', 'paragraph', 'label'] },
  { id: 'heading', type: 'component', title: 'Heading', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/heading', keywords: ['title', 'h1', 'h2', 'h3', 'typography'] },
  { id: 'kbd', type: 'component', title: 'Kbd', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/kbd', keywords: ['keyboard', 'shortcut', 'key'] },
  { id: 'copytext', type: 'component', title: 'CopyText', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/copytext', keywords: ['copy', 'clipboard', 'text'] },
  { id: 'copybutton', type: 'component', title: 'CopyButton', subtitle: 'Data Display', icon: <Table20Regular />, route: '/docs/components/copybutton', keywords: ['copy', 'clipboard', 'button'] },

  // Feedback
  { id: 'banner', type: 'component', title: 'Banner', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/banner', keywords: ['alert', 'notification', 'message', 'info', 'warning', 'error', 'success'], aliases: ['Alert', 'Message', 'Callout', 'InlineAlert'] },
  { id: 'toast', type: 'component', title: 'Toast', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/toast', keywords: ['notification', 'snackbar', 'message', 'popup'], aliases: ['Snackbar', 'Notification'] },
  { id: 'modal', type: 'component', title: 'Modal', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/modal', keywords: ['dialog', 'popup', 'overlay', 'window'], aliases: ['Dialog', 'Popup', 'Overlay'] },
  { id: 'confirmdialog', type: 'component', title: 'ConfirmDialog', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/confirmdialog', keywords: ['confirm', 'dialog', 'yes', 'no', 'delete'], aliases: ['AlertDialog', 'ConfirmationModal'] },
  { id: 'sheet', type: 'component', title: 'Sheet', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/sheet', keywords: ['bottom', 'drawer', 'panel', 'slide'], aliases: ['BottomSheet', 'Drawer', 'ActionSheet'] },
  { id: 'spinner', type: 'component', title: 'Spinner', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/spinner', keywords: ['loading', 'loader', 'wait', 'progress'], aliases: ['Loader', 'Loading', 'ActivityIndicator'] },
  { id: 'skeleton', type: 'component', title: 'Skeleton', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/skeleton', keywords: ['loading', 'placeholder', 'shimmer'], aliases: ['Placeholder', 'Shimmer'] },
  { id: 'progressbar', type: 'component', title: 'ProgressBar', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/progressbar', keywords: ['progress', 'loading', 'bar', 'percentage'], aliases: ['Progress', 'LinearProgress'] },
  { id: 'progressring', type: 'component', title: 'ProgressRing', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/progressring', keywords: ['progress', 'circle', 'ring', 'percentage'], aliases: ['CircularProgress', 'ProgressCircle'] },
  { id: 'notification', type: 'component', title: 'Notification', subtitle: 'Feedback', icon: <AlertOn20Regular />, route: '/docs/components/notification', keywords: ['alert', 'message', 'bell'], aliases: ['NotificationBadge', 'Bell'] },

  // Overlays
  { id: 'dropdown', type: 'component', title: 'Dropdown', subtitle: 'Overlays', icon: <AlertOn20Regular />, route: '/docs/components/dropdown', keywords: ['menu', 'context', 'action', 'popup'], aliases: ['Menu', 'ContextMenu', 'DropdownMenu'] },
  { id: 'popover', type: 'component', title: 'Popover', subtitle: 'Overlays', icon: <AlertOn20Regular />, route: '/docs/components/popover', keywords: ['popup', 'tooltip', 'overlay', 'hover'], aliases: ['Popup', 'HoverCard'] },
  { id: 'tooltip', type: 'component', title: 'Tooltip', subtitle: 'Overlays', icon: <Wrench20Regular />, route: '/docs/components/tooltip', keywords: ['hint', 'hover', 'info', 'help'], aliases: ['Hint', 'Title'] },
  { id: 'commandbar', type: 'component', title: 'CommandBar', subtitle: 'Overlays', icon: <Wrench20Regular />, route: '/docs/components/commandbar', keywords: ['search', 'command', 'palette', 'spotlight', 'ctrl+k'], aliases: ['CommandPalette', 'Spotlight', 'kbar', 'cmdk'] },
  { id: 'tour', type: 'component', title: 'Tour', subtitle: 'Overlays', icon: <Wrench20Regular />, route: '/docs/components/tour', keywords: ['guide', 'onboarding', 'walkthrough', 'help'], aliases: ['Onboarding', 'Walkthrough', 'Guide', 'Joyride'] },

  // Charts
  { id: 'barchart', type: 'component', title: 'BarChart', subtitle: 'Charts', icon: <DataPie20Regular />, route: '/docs/components/barchart', keywords: ['chart', 'graph', 'bars', 'data'] },
  { id: 'linechart', type: 'component', title: 'LineChart', subtitle: 'Charts', icon: <DataPie20Regular />, route: '/docs/components/linechart', keywords: ['chart', 'graph', 'line', 'trend'] },
  { id: 'multilinechart', type: 'component', title: 'MultiLineChart', subtitle: 'Charts', icon: <DataPie20Regular />, route: '/docs/components/multilinechart', keywords: ['chart', 'graph', 'lines', 'comparison'] },
  { id: 'donutchart', type: 'component', title: 'DonutChart', subtitle: 'Charts', icon: <DataPie20Regular />, route: '/docs/components/donutchart', keywords: ['chart', 'pie', 'circle', 'percentage'] },

  // Media
  { id: 'imagegallery', type: 'component', title: 'ImageGallery', subtitle: 'Media', icon: <Wrench20Regular />, route: '/docs/components/imagegallery', keywords: ['gallery', 'photos', 'images', 'lightbox'] },
  { id: 'carousel', type: 'component', title: 'Carousel', subtitle: 'Media', icon: <Wrench20Regular />, route: '/docs/components/carousel', keywords: ['slider', 'slideshow', 'images'] },
  { id: 'videoplayer', type: 'component', title: 'VideoPlayer', subtitle: 'Media', icon: <Wrench20Regular />, route: '/docs/components/videoplayer', keywords: ['video', 'player', 'media'] },
  { id: 'audioplayer', type: 'component', title: 'AudioPlayer', subtitle: 'Media', icon: <Wrench20Regular />, route: '/docs/components/audioplayer', keywords: ['audio', 'music', 'player', 'sound'] },

  // Utilities
  { id: 'divider', type: 'component', title: 'Divider', subtitle: 'Utilities', icon: <Wrench20Regular />, route: '/docs/components/divider', keywords: ['separator', 'line', 'hr'] },
  { id: 'codeblock', type: 'component', title: 'CodeBlock', subtitle: 'Utilities', icon: <Wrench20Regular />, route: '/docs/components/codeblock', keywords: ['code', 'syntax', 'highlight', 'pre'] },
  { id: 'animate', type: 'component', title: 'Animate', subtitle: 'Utilities', icon: <Wrench20Regular />, route: '/docs/components/animate', keywords: ['animation', 'transition', 'motion', 'fade'] },
  { id: 'empty', type: 'component', title: 'Empty', subtitle: 'Utilities', icon: <Wrench20Regular />, route: '/docs/components/empty', keywords: ['empty', 'no data', 'placeholder', 'blank'] },

  // Pages
  { id: 'blocks', type: 'page', title: 'Blocks', subtitle: 'Pre-built UI blocks', icon: <Apps20Regular />, route: '/blocks', keywords: ['templates', 'sections', 'ready'] },
  { id: 'playground', type: 'page', title: 'Playground', subtitle: 'Test components', icon: <Play20Regular />, route: '/playground', keywords: ['test', 'try', 'demo', 'interactive'] },
  { id: 'create', type: 'page', title: 'Theme Creator', subtitle: 'Customize Forge theme', icon: <Wand20Regular />, route: '/create', keywords: ['theme', 'customize', 'colors', 'style'] },
]

function Logo() {
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/logo_forge.svg"
        alt="Forge"
        style={{
          height: 36,
          filter: 'var(--logo-filter, invert(1))'
        }}
      />
    </Link>
  )
}

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [commandBarOpen, setCommandBarOpen] = useState(false)

  // Set canonical URL dynamically for SEO
  useCanonical()

  const isHomePage = location.pathname === '/'

  // Search handler for CommandBar
  const handleSearch = (query: string): SearchResult[] => {
    const q = query.toLowerCase()
    return searchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.keywords?.some(keyword => keyword.toLowerCase().includes(q)) ||
      item.aliases?.some(alias => alias.toLowerCase().includes(q))
    ).slice(0, 10)
  }

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    if (result.route) {
      navigate(result.route)
      setCommandBarOpen(false)
    }
  }

  // Component aliases mapping for AI responses
  const componentAliases: Record<string, { forge: string; route: string; description: string }> = {
    'alert': { forge: 'Banner', route: '/docs/components/banner', description: 'inline feedback messages (success, error, warning, info)' },
    'message': { forge: 'Banner', route: '/docs/components/banner', description: 'inline feedback messages' },
    'callout': { forge: 'Banner', route: '/docs/components/banner', description: 'inline feedback messages' },
    'snackbar': { forge: 'Toast', route: '/docs/components/toast', description: 'temporary popup notifications' },
    'dialog': { forge: 'Modal', route: '/docs/components/modal', description: 'full-screen overlay dialogs' },
    'popup': { forge: 'Modal', route: '/docs/components/modal', description: 'overlay dialogs' },
    'bottomsheet': { forge: 'Sheet', route: '/docs/components/sheet', description: 'sliding panels from edges' },
    'drawer': { forge: 'Sheet', route: '/docs/components/sheet', description: 'sliding side panels' },
    'actionsheet': { forge: 'Sheet', route: '/docs/components/sheet', description: 'bottom action panels' },
    'loader': { forge: 'Spinner', route: '/docs/components/spinner', description: 'loading indicator' },
    'loading': { forge: 'Spinner', route: '/docs/components/spinner', description: 'loading indicator' },
    'activityindicator': { forge: 'Spinner', route: '/docs/components/spinner', description: 'loading indicator' },
    'placeholder': { forge: 'Skeleton', route: '/docs/components/skeleton', description: 'loading placeholder with shimmer' },
    'shimmer': { forge: 'Skeleton', route: '/docs/components/skeleton', description: 'loading placeholder' },
    'progress': { forge: 'ProgressBar', route: '/docs/components/progressbar', description: 'horizontal progress indicator' },
    'linearprogress': { forge: 'ProgressBar', route: '/docs/components/progressbar', description: 'horizontal progress bar' },
    'circularprogress': { forge: 'ProgressRing', route: '/docs/components/progressring', description: 'circular progress indicator' },
    'menu': { forge: 'Dropdown', route: '/docs/components/dropdown', description: 'context/action menus' },
    'contextmenu': { forge: 'Dropdown', route: '/docs/components/dropdown', description: 'right-click context menus' },
    'dropdownmenu': { forge: 'Dropdown', route: '/docs/components/dropdown', description: 'dropdown action menus' },
    'hovercard': { forge: 'Popover', route: '/docs/components/popover', description: 'popup content on hover/click' },
    'commandpalette': { forge: 'CommandBar', route: '/docs/components/commandbar', description: 'search and command palette (Ctrl+K)' },
    'spotlight': { forge: 'CommandBar', route: '/docs/components/commandbar', description: 'search spotlight' },
    'kbar': { forge: 'CommandBar', route: '/docs/components/commandbar', description: 'command bar' },
    'cmdk': { forge: 'CommandBar', route: '/docs/components/commandbar', description: 'command menu' },
    'onboarding': { forge: 'Tour', route: '/docs/components/tour', description: 'step-by-step user guides' },
    'walkthrough': { forge: 'Tour', route: '/docs/components/tour', description: 'guided tours' },
    'joyride': { forge: 'Tour', route: '/docs/components/tour', description: 'product tours' },
    'textfield': { forge: 'Input', route: '/docs/components/input', description: 'text input field' },
    'textinput': { forge: 'Input', route: '/docs/components/input', description: 'text input' },
    'combobox': { forge: 'Select', route: '/docs/components/select', description: 'dropdown selection' },
    'picker': { forge: 'Select', route: '/docs/components/select', description: 'option picker' },
    'toggle': { forge: 'Switch', route: '/docs/components/switch', description: 'boolean toggle switch' },
    'range': { forge: 'Slider', route: '/docs/components/slider', description: 'value range slider' },
    'rangeslider': { forge: 'Slider', route: '/docs/components/slider', description: 'range slider' },
    'stars': { forge: 'Rating', route: '/docs/components/rating', description: 'star rating input' },
    'starrating': { forge: 'Rating', route: '/docs/components/rating', description: 'star rating' },
    'chipinput': { forge: 'TagInput', route: '/docs/components/taginput', description: 'multiple tag input' },
    'tagsinput': { forge: 'TagInput', route: '/docs/components/taginput', description: 'tag input field' },
    'dropzone': { forge: 'FileUpload', route: '/docs/components/fileupload', description: 'file upload with drag & drop' },
    'filepicker': { forge: 'FileUpload', route: '/docs/components/fileupload', description: 'file picker' },
    'upload': { forge: 'FileUpload', route: '/docs/components/fileupload', description: 'file upload' },
    'fab': { forge: 'FloatButton', route: '/docs/components/floatbutton', description: 'floating action button' },
    'floatingactionbutton': { forge: 'FloatButton', route: '/docs/components/floatbutton', description: 'floating action button' },
    'alertdialog': { forge: 'ConfirmDialog', route: '/docs/components/confirmdialog', description: 'confirmation dialogs' },
    'confirmationmodal': { forge: 'ConfirmDialog', route: '/docs/components/confirmdialog', description: 'confirmation modal' }
  }

  // AI query handler - local implementation with alias knowledge
  const handleAiQuery = async (query: string): Promise<{ type: 'info' | 'navigate' | 'create' | 'action' | 'multi'; message: string; data?: Record<string, unknown> }> => {
    const q = query.toLowerCase()

    // Check for component alias questions
    for (const [alias, info] of Object.entries(componentAliases)) {
      if (q.includes(alias)) {
        return {
          type: 'navigate',
          message: `In Forge, **${alias}** is called **${info.forge}**. It's used for ${info.description}.\n\nClick to view the documentation.`,
          data: { route: info.route }
        }
      }
    }

    // Check for direct component searches
    const componentMatch = searchData.find(item =>
      item.type === 'component' &&
      (q.includes(item.title.toLowerCase()) || q.includes(item.id))
    )
    if (componentMatch) {
      return {
        type: 'navigate',
        message: `**${componentMatch.title}** - ${componentMatch.subtitle}\n\nClick to view the documentation.`,
        data: { route: componentMatch.route }
      }
    }

    // Check for general questions about Forge
    if (q.includes('what is') || q.includes('c\'est quoi') || q.includes('qu\'est')) {
      if (q.includes('forge')) {
        return {
          type: 'info',
          message: 'Forge is a modern React component library built for speed and AI integration. It provides 60+ components with consistent design, dark/light themes, and is fully documented for AI assistants.'
        }
      }
    }

    // Fallback for unknown queries
    return {
      type: 'info',
      message: 'I can help you find components in Forge. Try asking about specific components like "alert", "modal", "toast", or search for any UI element you need.'
    }
  }

  // Handle AI action (navigation)
  const handleAiAction = (response: { type: string; message: string; data?: Record<string, unknown> }) => {
    if (response.data?.route) {
      navigate(response.data.route as string)
    }
  }

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Keyboard shortcut for CommandBar (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandBarOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getActiveId = () => {
    const path = location.pathname
    if (path === '/') return 'home'
    if (path.startsWith('/docs')) return 'docs'
    if (path.startsWith('/blocks')) return 'blocks'
    if (path.startsWith('/playground')) return 'playground'
    if (path.startsWith('/create')) return 'create'
    return 'home'
  }

  const handleNavigate = (id: string) => {
    if (id === 'home') navigate('/')
    else navigate(`/${id}`)
  }

  const showTransparent = isHomePage && !isScrolled

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <Navbar
          logo={<Logo />}
          items={navItems}
          activeId={getActiveId()}
          onNavigate={handleNavigate}
          sticky={false}
          transparent={showTransparent}
          showSearch
          onSearchClick={() => setCommandBarOpen(true)}
          actions={
            <Button
              variant="secondary"
              size="sm"
              icon={<Heart20Regular />}
              onClick={() => window.open('https://github.com/sponsors/Webba-Creative-Technologies', '_blank')}
            >
              Support us
            </Button>
          }
        />
      </div>

      {/* Command Bar */}
      <CommandBar
        open={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        placeholder="Search or ask AI..."
        onSearch={handleSearch}
        onResultSelect={handleResultSelect}
        onAiQuery={handleAiQuery}
        onAiAction={handleAiAction}
      />
      <main style={{ flex: 1, paddingTop: isHomePage ? 0 : 64 }}>
        <Outlet />
      </main>
    </div>
  )
}
