// ================================
// Forge Design System (WSS3)
// Webba Style System 3
// ================================
// Version: 2.0
// Reusable across all Webba projects
// Iconography: Fluent UI 2 (@fluentui/react-icons)

// ============================================
// CONSTANTS
// ============================================
export {
  Z_INDEX,
  COLORS,
  AVATAR_COLORS,
  STATUS_COLORS,
  CHART_COLORS,
  SYNTAX_COLORS,
  SHADOWS
} from './constants'
export type { ZIndexKey, ColorKey, StatusColor, ShadowSize, ShadowHardness } from './constants'

// ============================================
// THEMING
// ============================================
export {
  ForgeProvider,
  useForge,
  darkTheme,
  lightTheme,
  themes,
  createTheme,
  // Animation components
  Animate,
  Stagger
} from './components/ForgeProvider'
export type { ForgeTheme, ThemeMode } from './components/ForgeProvider'

// ============================================
// BUTTONS
// ============================================
export { Button, IconButton, GradientButton, SIZES } from './components/Button'

// ============================================
// CARDS & LAYOUT
// ============================================
export {
  Card,
  ImageCard,
  HorizontalCard,
  ActionCard,
  StatCard,
  MiniStat,
  StatRow,
  ProgressCard,
  InfoCard,
  Section,
  PageHeader,
  EmptyState,
  ProgressBar
} from './components/Card'

// ============================================
// MODAL
// ============================================
export { Modal } from './components/Modal'

// ============================================
// TYPOGRAPHY
// ============================================
export { Heading, Text, Label, Link, Kbd, Shortcut } from './components/Typography'

// ============================================
// DRAWER / SHEET / SIDEBAR
// ============================================
export { AppSidebar, Sheet, SidePanel, BottomSheet } from './components/Drawer'
export type { NavItem, NavSection } from './components/Drawer'

// ============================================
// DIALOGS
// ============================================
export { ConfirmDialog, AlertDialog } from './components/ConfirmDialog'

// ============================================
// BANNER
// ============================================
export { Banner, AnnouncementBanner } from './components/Banner'

// ============================================
// FORM INPUTS
// ============================================
export {
  Input,
  Textarea,
  Select,
  SearchInput,
  Checkbox,
  FormGroup,
  inputStyle,
  textareaStyle,
  labelStyle
} from './components/Input'

export { Switch, SwitchGroup } from './components/Switch'
export { Radio, RadioGroup, RadioCardGroup } from './components/Radio'
export { Slider, RangeSlider } from './components/Slider'
export { TagInput, EmailTagInput } from './components/TagInput'
export { NumberInput } from './components/NumberInput'
export { Accordion, AccordionItem, Collapsible, FAQAccordion, CollapsibleCard } from './components/Accordion'
export { FileUpload, AvatarUpload } from './components/FileUpload'
export type { UploadedFile } from './components/FileUpload'
export { Breadcrumbs, BreadcrumbLink, PageBreadcrumb } from './components/Breadcrumbs'
export type { BreadcrumbItem } from './components/Breadcrumbs'
export { Stepper, StepContent, StepActions, useStepper } from './components/Stepper'
export type { StepItem } from './components/Stepper'
export { Timeline, ActivityTimeline } from './components/Timeline'
export type { TimelineItem, ActivityItem } from './components/Timeline'
export { Navbar, BottomNav, TopBar } from './components/Navbar'
export type { NavbarItem } from './components/Navbar'

// ============================================
// FOOTER
// ============================================
export { Footer, SimpleFooter } from './components/Footer'
export type { FooterLink, FooterSection } from './components/Footer'

// ============================================
// SPINNER / LOADING / SPLASH
// ============================================
export {
  Spinner,
  LoadingOverlay,
  WebbaLoader,
  WebbaThinking,
  SplashScreen,
  LogoSplash,
  MinimalSplash,
  BrandedSplash
} from './components/Spinner'

// ============================================
// PAGINATION
// ============================================
export { Pagination, SimplePagination, TablePagination } from './components/Pagination'

// ============================================
// DIVIDER
// ============================================
export { Divider, VerticalDivider, SectionDivider } from './components/Divider'

// ============================================
// BADGES
// ============================================
export {
  Badge,
  StatusBadge,
  PriorityBadge,
  CountBadge
} from './components/Badge'

// ============================================
// TABS & NAVIGATION
// ============================================
export {
  Tabs,
  TabPanels,
  TabPanel,
  PillTabs,
  ViewToggle,
  Pills
} from './components/Tabs'

// ============================================
// DROPDOWNS & MENUS
// ============================================
export {
  Dropdown,
  SelectDropdown,
  ContextMenu,
  useContextMenu
} from './components/Dropdown'
export type { DropdownItem, DropdownCategory } from './components/Dropdown'

// ============================================
// POPOVER & TOOLTIP
// ============================================
export { Popover, HoverCard } from './components/Popover'
export { Tooltip, InfoTooltip } from './components/Tooltip'

// ============================================
// DATE PICKERS
// ============================================
export { DatePicker, DateTimePicker } from './components/DatePicker'

// ============================================
// COLOR PICKER
// ============================================
export {
  ColorPicker,
  ColorSwatch,
  ColorPalette,
  PRESET_COLORS,
  PROJECT_COLORS
} from './components/ColorPicker'

// ============================================
// TABLE
// ============================================
export { Table, SimpleTable } from './components/Table'
export type { TableColumn, TableProps, TableFilter } from './components/Table'

// ============================================
// TOAST / NOTIFICATIONS
// ============================================
export {
  ToastProvider,
  useToast,
  SimpleToast
} from './components/Toast'
export type { ToastData, ToastType } from './components/Toast'

// ============================================
// AVATAR
// ============================================
export { Avatar, AvatarStack, AvatarGroup, AvatarCard, AvatarList } from './components/Avatar'

// ============================================
// SKELETON (Loading states)
// ============================================
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatarGroup,
  SkeletonStatCard
} from './components/Skeleton'

// ============================================
// CALENDAR
// ============================================
export { Calendar, MiniCalendar } from './components/Calendar'
export type { CalendarEvent } from './components/Calendar'

// ============================================
// COMMAND BAR (AI Search)
// ============================================
export { CommandBar } from './components/CommandBar'
export type { SearchResult, AIResponse } from './components/CommandBar'

// ============================================
// TABLE OF CONTENTS
// ============================================
export { TableOfContents, MiniTOC } from './components/TableOfContents'
export type { TOCItem } from './components/TableOfContents'

// ============================================
// CHARTS
// ============================================
export { BarChart, LineChart, DonutChart, Sparkline, ProgressRing, GroupedBarChart, MultiLineChart } from './components/Charts'
export type { ChartDataPoint, GroupedBarDataPoint, LineSeriesData } from './components/Charts'

// ============================================
// COMBOBOX
// ============================================
export { Combobox, MultiCombobox } from './components/Combobox'
export type { ComboboxOption } from './components/Combobox'

// ============================================
// CODE BLOCK
// ============================================
export { CodeBlock, InlineCode, CodeDiff } from './components/CodeBlock'

// ============================================
// QUOTE BOX
// ============================================
export { QuoteBox } from './components/MessageBox'

// ============================================
// CHAT BOX
// ============================================
export { ChatBox, MiniChat } from './components/ChatBox'
export type { ChatMessage } from './components/ChatBox'

// ============================================
// HOOKS
// ============================================
export {
  useAssistant,
  isNaturalLanguageQuery,
  findEntityByIdOrName
} from './hooks/useAssistant'

export {
  NavigationProvider,
  useNavigation
} from './hooks/useNavigation'

export { useDraggableScroll } from './hooks/useDraggableScroll'

export {
  // Hooks
  useMediaQuery,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useWindowSize,
  useResponsiveValue,
  // Layout Components
  Show,
  Hide,
  Container,
  Stack,
  Grid,
  Box,
  Flex,
  Center,
  Spacer,
  VStack,
  HStack,
  AspectRatio,
  // Page Layout
  Page,
  Section as PageSection,
  ActionItem,
  IconBox,
  // Spacing
  SPACING,
  SPACING_SEMANTIC,
  resolveSpacing,
  // Breakpoints
  BREAKPOINTS
} from './hooks/useResponsive'
export type { Breakpoint, ResponsiveValue, SpacingKey, SpacingSemantic, SpacingValue } from './hooks/useResponsive'

// ============================================
// TYPES
// ============================================
export type {
  // Base
  BaseEntity,
  BaseComponentProps,
  Status,
  Priority,
  Size,
  ThemeColor,
  ProjectColor,
  // Button
  ButtonVariant,
  // Badge
  BadgeVariant,
  // Modal
  ModalState,
  // AI
  AIAction,
  // Form
  FormField,
  SelectOption,
  // Table
  Sort,
  Filter,
  // Menu
  MenuItem,
  // Toast
  Toast,
  // Kanban
  KanbanCardType,
  KanbanColumnDef
} from './types'

export type {
  AssistantAction,
  AssistantConfig,
  AssistantContext
} from './hooks/useAssistant'

// ============================================
// RATING
// ============================================
export { Rating, RatingDisplay } from './components/Rating'

// ============================================
// COPY BUTTON
// ============================================
export { CopyButton, CopyField } from './components/CopyButton'

// ============================================
// OTP / PIN INPUT
// ============================================
export { OTPInput, PINInput } from './components/OTPInput'

// ============================================
// IMAGE GALLERY
// ============================================
export { ImageGallery, ImageTile, Lightbox, ImagePreview } from './components/ImageGallery'
export type { GalleryImage } from './components/ImageGallery'

// ============================================
// TREE VIEW
// ============================================
export { TreeView, FileTree } from './components/TreeView'
export type { TreeNode } from './components/TreeView'

// ============================================
// PHONE INPUT
// ============================================
export { PhoneInput, COUNTRIES } from './components/PhoneInput'
export type { Country } from './components/PhoneInput'

// ============================================
// TOUR / ONBOARDING
// ============================================
export { Tour, useTour, TourTooltipStatic } from './components/Tour'
export type { TourStep } from './components/Tour'

// ============================================
// CAROUSEL
// ============================================
export { Carousel, CarouselSlide, ImageCarousel } from './components/Carousel'

// ============================================
// FLOAT BUTTON / FAB
// ============================================
export { FloatButton, FloatButtonGroup, BackToTop } from './components/FloatButton'

// ============================================
// NOTIFICATIONS
// ============================================
export { NotificationProvider, useNotification, Notification } from './components/Notification'
export type { NotificationData, NotificationType } from './components/Notification'

// ============================================
// TIME PICKER
// ============================================
export { TimePicker, TimeRangePicker } from './components/TimePicker'

// ============================================
// CASCADER
// ============================================
export { Cascader } from './components/Cascader'
export type { CascaderOption } from './components/Cascader'

// ============================================
// MENTION
// ============================================
export { MentionInput, MentionDisplay } from './components/Mention'
export type { MentionUser, MentionData } from './components/Mention'

// ============================================
// COUNTDOWN & TIMER
// ============================================
export { Countdown, Timer, SimpleCountdown, PomodoroTimer } from './components/Countdown'

// ============================================
// AFFIX & STICKY
// ============================================
export { Affix, StickyHeader, StickySidebar, ScrollIndicator } from './components/Affix'

// ============================================
// DESCRIPTIONS
// ============================================
export { Descriptions, DescriptionList } from './components/Descriptions'
export type { DescriptionItem } from './components/Descriptions'

// ============================================
// INPUT GROUP
// ============================================
export { InputGroup, InputAddon, GroupInput, InputWithAddons } from './components/InputGroup'

// ============================================
// SORTABLE LIST
// ============================================
export { SortableList, SimpleSortableList } from './components/SortableList'
export type { SortableItem } from './components/SortableList'

// ============================================
// VIDEO PLAYER
// ============================================
export { VideoPlayer } from './components/VideoPlayer'

// ============================================
// AUDIO PLAYER
// ============================================
export { AudioPlayer, MiniAudioPlayer } from './components/AudioPlayer'

// ============================================
// UTILITIES
// ============================================
export { Watermark, Highlight, TextTruncate, CopyText } from './components/Utilities'

// ============================================
// COOKIE CONSENT
// ============================================
export { CookieConsent, useCookieConsent } from './components/CookieConsent'

// ============================================
// CSS
// ============================================
// Usage: import './.forge/styles/animations.css'
