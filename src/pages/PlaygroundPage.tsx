import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  Button,
  IconButton,
  GradientButton,
  Badge,
  Input,
  Textarea,
  Select,
  Switch,
  Checkbox,
  Slider,
  DatePicker,
  Rating,
  TagInput,
  SearchInput,
  CodeBlock,
  Divider,
  Tabs,
  TabPanels,
  TabPanel,
  Breadcrumbs,
  Stepper,
  Animate,
  Avatar,
  Spinner,
  Modal,
  Banner,
  Skeleton,
  SkeletonText,
  useToast,
  Tooltip,
  StatCard,
  ProgressRing,
  BarChart,
  LineChart,
  MultiLineChart,
  DonutChart,
  Accordion,
  AccordionItem,
  Table,
  Kbd,
  Footer
} from '../../.forge'
import {
  Play20Regular,
  Code20Regular,
  Settings20Regular,
  Add20Regular,
  Filter20Regular,
  Eye20Regular,
  Person20Regular,
  Star20Regular,
  Home20Regular,
  Heart20Regular,
  Delete20Regular,
  Edit20Regular,
  DataPie20Regular
} from '@fluentui/react-icons'

// Footer sections
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

// Component categories
const componentCategories = [
  {
    id: 'buttons',
    label: 'Buttons',
    components: [
      { id: 'button', label: 'Button' },
      { id: 'iconbutton', label: 'IconButton' },
      { id: 'gradientbutton', label: 'GradientButton' }
    ]
  },
  {
    id: 'forms',
    label: 'Forms',
    components: [
      { id: 'input', label: 'Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'select', label: 'Select' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'switch', label: 'Switch' },
      { id: 'slider', label: 'Slider' },
      { id: 'datepicker', label: 'DatePicker' },
      { id: 'rating', label: 'Rating' },
      { id: 'taginput', label: 'TagInput' },
      { id: 'searchinput', label: 'SearchInput' }
    ]
  },
  {
    id: 'display',
    label: 'Data Display',
    components: [
      { id: 'badge', label: 'Badge' },
      { id: 'avatar', label: 'Avatar' },
      { id: 'card', label: 'Card' },
      { id: 'statcard', label: 'StatCard' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'table', label: 'Table' },
      { id: 'codeblock', label: 'CodeBlock' },
      { id: 'kbd', label: 'Kbd' }
    ]
  },
  {
    id: 'navigation',
    label: 'Navigation',
    components: [
      { id: 'tabs', label: 'Tabs' },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'stepper', label: 'Stepper' }
    ]
  },
  {
    id: 'feedback',
    label: 'Feedback',
    components: [
      { id: 'spinner', label: 'Spinner' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'modal', label: 'Modal' },
      { id: 'toast', label: 'Toast' },
      { id: 'alert', label: 'Banner' },
      { id: 'skeleton', label: 'Skeleton' }
    ]
  },
  {
    id: 'charts',
    label: 'Charts',
    components: [
      { id: 'progressring', label: 'ProgressRing' },
      { id: 'barchart', label: 'BarChart' },
      { id: 'linechart', label: 'LineChart' },
      { id: 'multilinechart', label: 'MultiLineChart' },
      { id: 'donutchart', label: 'DonutChart' }
    ]
  }
]

interface PlaygroundProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

// Button Playground
function ButtonPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [variant, setVariant] = useState<'primary' | 'secondary' | 'ghost' | 'danger'>('primary')
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md')
  const [text, setText] = useState('Click me')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [iconLeft, setIconLeft] = useState(false)
  const [iconRight, setIconRight] = useState(false)
  const [stretch, setStretch] = useState(false)

  const code = `<Button${variant !== 'primary' ? ` variant="${variant}"` : ''}${size !== 'md' ? ` size="${size}"` : ''}${iconLeft ? ' icon={<Add20Regular />}' : ''}${iconRight ? ' iconRight={<Play20Regular />}' : ''}${loading ? ' loading' : ''}${disabled ? ' disabled' : ''}${fullWidth ? ' fullWidth' : ''}>${text}</Button>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Button } from '.forge'"
      componentName="Button"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Text" value={text} onChange={setText} />
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'ghost', label: 'Ghost' },
            { value: 'danger', label: 'Danger' }
          ]} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'xs', label: 'Extra Small' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Divider />
          <Text size="sm" weight="medium">Icons</Text>
          <Switch checked={iconLeft} onChange={setIconLeft} label="Icon Left" />
          <Switch checked={iconRight} onChange={setIconRight} label="Icon Right" />
          <Divider />
          <Switch checked={loading} onChange={setLoading} label="Loading" />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={fullWidth} onChange={setFullWidth} label="Full Width" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Button
          variant={variant}
          size={size}
          loading={loading}
          disabled={disabled}
          fullWidth={fullWidth}
          icon={iconLeft ? <Add20Regular /> : undefined}
          iconRight={iconRight ? <Play20Regular /> : undefined}
        >
          {text}
        </Button>
      }
    />
  )
}

// Input Playground
function InputPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [label, setLabel] = useState('Email')
  const [placeholder, setPlaceholder] = useState('Enter your email')
  const [type, setType] = useState<'text' | 'email' | 'password' | 'number'>('email')
  const [disabled, setDisabled] = useState(false)
  const [withIcon, setWithIcon] = useState(false)
  const [error, setError] = useState('')
  const [stretch, setStretch] = useState(false)

  const code = `<Input${label ? ` label="${label}"` : ''}${type !== 'text' ? ` type="${type}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${withIcon ? ' icon={<Person20Regular />}' : ''}${disabled ? ' disabled' : ''}${error ? ` error="${error}"` : ''} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Input } from '.forge'"
      componentName="Input"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <Select label="Type" value={type} onChange={(v) => setType(v as typeof type)} options={[
            { value: 'text', label: 'Text' },
            { value: 'email', label: 'Email' },
            { value: 'password', label: 'Password' },
            { value: 'number', label: 'Number' }
          ]} />
          <Input label="Error message" value={error} onChange={setError} placeholder="Leave empty for no error" />
          <Divider />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={withIcon} onChange={setWithIcon} label="With Icon" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Input label={label} type={type} placeholder={placeholder} icon={withIcon ? <Person20Regular /> : undefined} disabled={disabled} error={error || undefined} />
      }
    />
  )
}

// Textarea Playground
function TextareaPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [label, setLabel] = useState('Message')
  const [placeholder, setPlaceholder] = useState('Enter your message')
  const [rows, setRows] = useState(4)
  const [disabled, setDisabled] = useState(false)
  const [stretch, setStretch] = useState(false)

  const code = `<Textarea${label ? ` label="${label}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''} rows={${rows}}${disabled ? ' disabled' : ''} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Textarea } from '.forge'"
      componentName="Textarea"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <Input label="Rows" type="number" value={String(rows)} onChange={(v) => setRows(Number(v) || 4)} />
          <Divider />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Textarea label={label} placeholder={placeholder} rows={rows} disabled={disabled} />
      }
    />
  )
}

// Select Playground
function SelectPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [label, setLabel] = useState('Country')
  const [placeholder, setPlaceholder] = useState('Select a country')
  const [disabled, setDisabled] = useState(false)
  const [value, setValue] = useState('')
  const [stretch, setStretch] = useState(false)

  const options = [
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' }
  ]

  const code = `<Select${label ? ` label="${label}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${disabled ? ' disabled' : ''} options={[...]} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Select } from '.forge'"
      componentName="Select"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <Divider />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Select label={label} placeholder={placeholder} disabled={disabled} value={value} onChange={setValue} options={options} />
      }
    />
  )
}

// Checkbox Playground
function CheckboxPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [label, setLabel] = useState('I agree to the terms')
  const [description, setDescription] = useState('')
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [size, setSize] = useState<'sm' | 'md'>('md')

  const code = `<Checkbox
  label="${label}"${description ? `\n  description="${description}"` : ''}${size !== 'md' ? `\n  size="${size}"` : ''}
  checked={${checked}}
  onChange={setChecked}${indeterminate ? '\n  indeterminate' : ''}${disabled ? '\n  disabled' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Checkbox } from '.forge'"
      componentName="Checkbox"
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Description" value={description} onChange={setDescription} placeholder="Optional helper text" />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' }
          ]} />
          <Divider />
          <Switch checked={checked} onChange={setChecked} label="Checked" />
          <Switch checked={indeterminate} onChange={setIndeterminate} label="Indeterminate" />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
        </VStack>
      }
      preview={
        <Checkbox
          label={label}
          description={description || undefined}
          size={size}
          checked={checked}
          onChange={setChecked}
          indeterminate={indeterminate}
          disabled={disabled}
        />
      }
    />
  )
}

// Switch Playground
function SwitchPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [label, setLabel] = useState('Enable notifications')
  const [description, setDescription] = useState('Receive push notifications on your device')
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')

  const code = `<Switch
  label="${label}"${description ? `\n  description="${description}"` : ''}${size !== 'md' ? `\n  size="${size}"` : ''}
  checked={${checked}}
  onChange={setChecked}${disabled ? '\n  disabled' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Switch } from '.forge'"
      componentName="Switch"
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Description" value={description} onChange={setDescription} placeholder="Optional helper text" />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Divider />
          <Switch checked={checked} onChange={setChecked} label="Checked" />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
        </VStack>
      }
      preview={
        <Switch
          label={label}
          description={description || undefined}
          size={size}
          checked={checked}
          onChange={setChecked}
          disabled={disabled}
        />
      }
    />
  )
}

// Badge Playground
function BadgePlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [text, setText] = useState('New')
  const [variant, setVariant] = useState<'default' | 'primary' | 'success' | 'warning' | 'error'>('primary')
  const [size, setSize] = useState<'sm' | 'md'>('md')
  const [dot, setDot] = useState(false)
  const [removable, setRemovable] = useState(false)
  const [clickable, setClickable] = useState(false)

  const code = `<Badge${variant !== 'default' ? ` variant="${variant}"` : ''}${size !== 'md' ? ` size="${size}"` : ''}${dot ? ' dot' : ''}${removable ? ' onRemove={() => {}}' : ''}${clickable ? ' onClick={() => {}}' : ''}>${text}</Badge>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Badge } from '.forge'"
      componentName="Badge"
      controls={
        <VStack gap="sm">
          <Input label="Text" value={text} onChange={setText} />
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'default', label: 'Default' },
            { value: 'primary', label: 'Primary' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' }
          ]} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' }
          ]} />
          <Divider />
          <Switch checked={dot} onChange={setDot} label="Show Dot" />
          <Switch checked={removable} onChange={setRemovable} label="Removable" />
          <Switch checked={clickable} onChange={setClickable} label="Clickable" />
        </VStack>
      }
      preview={
        <HStack gap="md">
          <Badge
            variant={variant}
            size={size}
            dot={dot}
            onRemove={removable ? () => alert('Remove clicked!') : undefined}
            onClick={clickable ? () => alert('Badge clicked!') : undefined}
          >
            {text}
          </Badge>
        </HStack>
      }
    />
  )
}

// Avatar Playground
function AvatarPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [name, setName] = useState('John Doe')
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
  const [showStatus, setShowStatus] = useState(false)
  const [status, setStatus] = useState<'online' | 'offline' | 'away' | 'busy'>('online')
  const [showIcon, setShowIcon] = useState(false)
  const [clickable, setClickable] = useState(false)

  const code = `<Avatar
  name="${name}"${size !== 'md' ? `\n  size="${size}"` : ''}${showStatus ? `\n  status="${status}"` : ''}${showIcon ? '\n  icon={<Person20Regular />}' : ''}${clickable ? '\n  onClick={() => {}}' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Avatar } from '.forge'"
      componentName="Avatar"
      controls={
        <VStack gap="sm">
          <Input label="Name" value={name} onChange={setName} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'xs', label: 'Extra Small' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' }
          ]} />
          <Divider />
          <Switch checked={showStatus} onChange={setShowStatus} label="Show Status" />
          {showStatus && (
            <Select label="Status" value={status} onChange={(v) => setStatus(v as typeof status)} options={[
              { value: 'online', label: 'Online' },
              { value: 'offline', label: 'Offline' },
              { value: 'away', label: 'Away' },
              { value: 'busy', label: 'Busy' }
            ]} />
          )}
          <Switch checked={showIcon} onChange={setShowIcon} label="Use Icon Instead" />
          <Switch checked={clickable} onChange={setClickable} label="Clickable" />
        </VStack>
      }
      preview={
        <Avatar
          name={showIcon ? undefined : name}
          size={size}
          status={showStatus ? status : undefined}
          icon={showIcon ? <Person20Regular /> : undefined}
          onClick={clickable ? () => alert('Avatar clicked!') : undefined}
        />
      }
    />
  )
}

// Card Playground
function CardPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [title, setTitle] = useState('Card Title')
  const [subtitle, setSubtitle] = useState('Optional subtitle')
  const [padding, setPadding] = useState<'sm' | 'md' | 'lg' | 'xl' | 'none'>('lg')
  const [variant, setVariant] = useState<'default' | 'subtle' | 'outlined'>('default')
  const [hoverable, setHoverable] = useState(false)
  const [clickable, setClickable] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const [stretch, setStretch] = useState(false)

  const code = `<Card${title ? `\n  title="${title}"` : ''}${subtitle ? `\n  subtitle="${subtitle}"` : ''}${padding !== 'lg' ? `\n  padding="${padding}"` : ''}${variant !== 'default' ? `\n  variant="${variant}"` : ''}${hoverable ? '\n  hoverable' : ''}${clickable ? '\n  onClick={() => {}}' : ''}${showAction ? '\n  action={{ label: "View", onClick: () => {} }}' : ''}>
  <Text>Card content</Text>
</Card>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Card } from '.forge'"
      componentName="Card"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Title" value={title} onChange={setTitle} placeholder="Leave empty for no title" />
          <Input label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="Leave empty for no subtitle" />
          <Select label="Padding" value={padding} onChange={(v) => setPadding(v as typeof padding)} options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' }
          ]} />
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'default', label: 'Default' },
            { value: 'subtle', label: 'Subtle' },
            { value: 'outlined', label: 'Outlined' }
          ]} />
          <Divider />
          <Switch checked={hoverable} onChange={setHoverable} label="Hoverable" />
          <Switch checked={clickable} onChange={setClickable} label="Clickable" />
          <Switch checked={showAction} onChange={setShowAction} label="Show Action Button" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Card
          title={title || undefined}
          subtitle={subtitle || undefined}
          padding={padding}
          variant={variant}
          hoverable={hoverable}
          onClick={clickable ? () => alert('Card clicked!') : undefined}
          action={showAction ? { label: 'View', onClick: () => alert('Action clicked!') } : undefined}
        >
          <Text>Card content goes here.</Text>
        </Card>
      }
    />
  )
}

// Spinner Playground
function SpinnerPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md')
  const [label, setLabel] = useState('Loading...')
  const [thickness, setThickness] = useState(2)

  const code = `<Spinner${size !== 'md' ? ` size="${size}"` : ''}${label ? ` label="${label}"` : ''}${thickness !== 2 ? ` thickness={${thickness}}` : ''} color="var(--brand-primary)" />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Spinner } from '.forge'"
      componentName="Spinner"
      controls={
        <VStack gap="sm">
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'xs', label: 'Extra Small' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Input label="Label" value={label} onChange={setLabel} placeholder="Leave empty for no label" />
          <Input label="Thickness" type="number" value={String(thickness)} onChange={(v) => setThickness(Number(v) || 2)} />
        </VStack>
      }
      preview={
        <Spinner size={size} label={label || undefined} thickness={thickness} color="var(--brand-primary)" />
      }
    />
  )
}

// Tooltip Playground
function TooltipPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [content, setContent] = useState('This is a tooltip')
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const [delay, setDelay] = useState(200)
  const [disabled, setDisabled] = useState(false)

  const code = `<Tooltip
  content="${content}"
  position="${position}"${delay !== 200 ? `\n  delay={${delay}}` : ''}${disabled ? '\n  disabled' : ''}>
  <Button>Hover me</Button>
</Tooltip>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Tooltip } from '.forge'"
      componentName="Tooltip"
      controls={
        <VStack gap="sm">
          <Input label="Content" value={content} onChange={setContent} />
          <Select label="Position" value={position} onChange={(v) => setPosition(v as typeof position)} options={[
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' }
          ]} />
          <Input label="Delay (ms)" type="number" value={String(delay)} onChange={(v) => setDelay(Number(v) || 200)} />
          <Divider />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
        </VStack>
      }
      preview={
        <Tooltip content={content} position={position} delay={delay} disabled={disabled}>
          <Button>Hover me</Button>
        </Tooltip>
      }
    />
  )
}

// Modal Playground
function ModalPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('Modal Title')
  const [subtitle, setSubtitle] = useState('Optional subtitle text')
  const [width, setWidth] = useState<'sm' | 'md' | 'lg'>('md')
  const [showCloseButton, setShowCloseButton] = useState(true)

  const code = `<Modal
  open={open}
  onClose={() => setOpen(false)}${title ? `\n  title="${title}"` : ''}${subtitle ? `\n  subtitle="${subtitle}"` : ''}
  width="${width}"${!showCloseButton ? '\n  showCloseButton={false}' : ''}>
  <Text>Modal content</Text>
</Modal>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Modal } from '.forge'"
      componentName="Modal"
      controls={
        <VStack gap="sm">
          <Input label="Title" value={title} onChange={setTitle} />
          <Input label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="Optional subtitle" />
          <Select label="Width" value={width} onChange={(v) => setWidth(v as typeof width)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Divider />
          <Switch checked={showCloseButton} onChange={setShowCloseButton} label="Show Close Button" />
          <Button onClick={() => setOpen(true)}>Open Modal</Button>
        </VStack>
      }
      preview={
        <>
          <Button onClick={() => setOpen(true)}>Open Modal</Button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title={title}
            subtitle={subtitle || undefined}
            width={width}
            showCloseButton={showCloseButton}
          >
            <VStack gap="md">
              <Text>This is the modal content.</Text>
              <HStack gap="sm" style={{ justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
              </HStack>
            </VStack>
          </Modal>
        </>
      }
    />
  )
}

// Toast Playground
function ToastPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const toast = useToast()
  const [title, setTitle] = useState('Success!')
  const [message, setMessage] = useState('This is a toast message')
  const [type, setType] = useState<'success' | 'error' | 'warning' | 'info'>('success')

  const code = `const toast = useToast()

// Simple usage
toast.${type}("${title}", "${message}")

// Or with addToast for more control
toast.addToast({
  title: "${title}",
  message: "${message}",
  type: "${type}"
})`

  const handleShowToast = () => {
    toast[type](title, message)
  }

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { useToast } from '.forge'"
      componentName="Toast"
      controls={
        <VStack gap="sm">
          <Input label="Title" value={title} onChange={setTitle} />
          <Input label="Message" value={message} onChange={setMessage} />
          <Select label="Type" value={type} onChange={(v) => setType(v as typeof type)} options={[
            { value: 'success', label: 'Success' },
            { value: 'error', label: 'Error' },
            { value: 'warning', label: 'Warning' },
            { value: 'info', label: 'Info' }
          ]} />
          <Divider />
          <Button onClick={handleShowToast}>Show Toast</Button>
        </VStack>
      }
      preview={
        <Button onClick={handleShowToast}>Show Toast</Button>
      }
    />
  )
}

// StatCard Playground
function StatCardPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [label, setLabel] = useState('Revenue')
  const [value, setValue] = useState('$12,450')
  const [change, setChange] = useState(8.2)
  const [showIcon, setShowIcon] = useState(true)
  const [stretch, setStretch] = useState(false)

  const code = `<StatCard
  label="${label}"
  value="${value}"
  change={${change}}${showIcon ? '\n  icon={<Star20Regular />}' : ''}
  color="var(--brand-primary)"
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { StatCard } from '.forge'"
      componentName="StatCard"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Value" value={value} onChange={setValue} />
          <Input label="Change (%)" type="number" value={String(change)} onChange={(v) => setChange(Number(v) || 0)} />
          <Divider />
          <Switch checked={showIcon} onChange={setShowIcon} label="Show Icon" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <StatCard label={label} value={value} change={change} icon={showIcon ? <Star20Regular /> : undefined} color="var(--brand-primary)" />
      }
    />
  )
}

// ProgressRing Playground
function ProgressRingPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [value, setValue] = useState(75)
  const [size, setSize] = useState(90)
  const [thickness, setThickness] = useState(10)
  const [showValue, setShowValue] = useState(true)
  const [animated, setAnimated] = useState(true)
  const [label, setLabel] = useState('')

  const code = `<ProgressRing
  value={${value}}
  size={${size}}${thickness !== 10 ? `\n  thickness={${thickness}}` : ''}${!showValue ? '\n  showValue={false}' : ''}${!animated ? '\n  animated={false}' : ''}${label ? `\n  label="${label}"` : ''}
  color="var(--brand-primary)"
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { ProgressRing } from '.forge'"
      componentName="ProgressRing"
      controls={
        <VStack gap="sm">
          <Input label="Value (%)" type="number" value={String(value)} onChange={(v) => setValue(Math.min(100, Math.max(0, Number(v) || 0)))} />
          <Input label="Size (px)" type="number" value={String(size)} onChange={(v) => setSize(Number(v) || 90)} />
          <Input label="Thickness" type="number" value={String(thickness)} onChange={(v) => setThickness(Number(v) || 10)} />
          <Input label="Label" value={label} onChange={setLabel} placeholder="Optional label below" />
          <Divider />
          <Switch checked={showValue} onChange={setShowValue} label="Show Value" />
          <Switch checked={animated} onChange={setAnimated} label="Animated" />
        </VStack>
      }
      preview={
        <ProgressRing
          value={value}
          size={size}
          thickness={thickness}
          showValue={showValue}
          animated={animated}
          label={label || undefined}
          color="var(--brand-primary)"
        />
      }
    />
  )
}

// IconButton Playground
function IconButtonPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [variant, setVariant] = useState<'ghost' | 'subtle' | 'danger' | 'inverted'>('subtle')
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [disabled, setDisabled] = useState(false)

  const code = `<IconButton${variant !== 'subtle' ? ` variant="${variant}"` : ''}${size !== 'md' ? ` size="${size}"` : ''}${disabled ? ' disabled' : ''} icon={<Heart20Regular />} aria-label="Like" />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { IconButton } from '.forge'"
      componentName="IconButton"
      controls={
        <VStack gap="sm">
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'subtle', label: 'Subtle' },
            { value: 'ghost', label: 'Ghost' },
            { value: 'danger', label: 'Danger' },
            { value: 'inverted', label: 'Inverted' }
          ]} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Divider />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
        </VStack>
      }
      preview={
        <HStack gap="md">
          <IconButton variant={variant} size={size} disabled={disabled} icon={<Heart20Regular />} aria-label="Like" />
          <IconButton variant={variant} size={size} disabled={disabled} icon={<Edit20Regular />} aria-label="Edit" />
          <IconButton variant={variant} size={size} disabled={disabled} icon={<Delete20Regular />} aria-label="Delete" />
        </HStack>
      }
    />
  )
}

// GradientButton Playground
function GradientButtonPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [text, setText] = useState('Get Started')
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [iconLeft, setIconLeft] = useState(false)
  const [iconRight, setIconRight] = useState(false)
  const [stretch, setStretch] = useState(false)

  const code = `<GradientButton${size !== 'md' ? ` size="${size}"` : ''}${iconLeft ? ' icon={<Star20Regular />}' : ''}${iconRight ? ' iconRight={<Play20Regular />}' : ''}${loading ? ' loading' : ''}${disabled ? ' disabled' : ''}${fullWidth ? ' fullWidth' : ''}>${text}</GradientButton>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { GradientButton } from '.forge'"
      componentName="GradientButton"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Text" value={text} onChange={setText} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Divider />
          <Text size="sm" weight="medium">Icons</Text>
          <Switch checked={iconLeft} onChange={setIconLeft} label="Icon Left" />
          <Switch checked={iconRight} onChange={setIconRight} label="Icon Right" />
          <Divider />
          <Switch checked={loading} onChange={setLoading} label="Loading" />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={fullWidth} onChange={setFullWidth} label="Full Width" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <GradientButton
          size={size}
          icon={iconLeft ? <Star20Regular /> : undefined}
          iconRight={iconRight ? <Play20Regular /> : undefined}
          loading={loading}
          disabled={disabled}
          fullWidth={fullWidth}
        >
          {text}
        </GradientButton>
      }
    />
  )
}

// Slider Playground
function SliderPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [value, setValue] = useState(50)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)
  const [step, setStep] = useState(1)
  const [label, setLabel] = useState('Volume')
  const [showValue, setShowValue] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')
  const [showMarks, setShowMarks] = useState(false)
  const [stretch, setStretch] = useState(true)

  const marks = showMarks ? [
    { value: 0, label: '0%' },
    { value: 25 },
    { value: 50, label: '50%' },
    { value: 75 },
    { value: 100, label: '100%' }
  ] : undefined

  const code = `<Slider
  value={${value}}
  onChange={setValue}
  min={${min}}
  max={${max}}
  step={${step}}${label ? `\n  label="${label}"` : ''}${size !== 'md' ? `\n  size="${size}"` : ''}${!showValue ? '\n  showValue={false}' : ''}${!showTooltip ? '\n  showTooltip={false}' : ''}${disabled ? '\n  disabled' : ''}${showMarks ? '\n  marks={[{ value: 0, label: "0%" }, { value: 50, label: "50%" }, { value: 100, label: "100%" }]}' : ''}
  color="var(--brand-primary)"
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Slider } from '.forge'"
      componentName="Slider"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} placeholder="Leave empty for no label" />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' }
          ]} />
          <Divider />
          <Input label="Value" type="number" value={String(value)} onChange={(v) => setValue(Number(v) || 0)} />
          <Input label="Min" type="number" value={String(min)} onChange={(v) => setMin(Number(v) || 0)} />
          <Input label="Max" type="number" value={String(max)} onChange={(v) => setMax(Number(v) || 100)} />
          <Input label="Step" type="number" value={String(step)} onChange={(v) => setStep(Number(v) || 1)} />
          <Divider />
          <Switch checked={showValue} onChange={setShowValue} label="Show Value" />
          <Switch checked={showTooltip} onChange={setShowTooltip} label="Show Tooltip" />
          <Switch checked={showMarks} onChange={setShowMarks} label="Show Marks" />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <div style={{ width: '100%', padding: '0 1rem' }}>
          <Slider
            value={value}
            onChange={setValue}
            min={min}
            max={max}
            step={step}
            label={label || undefined}
            showValue={showValue}
            showTooltip={showTooltip}
            disabled={disabled}
            size={size}
            marks={marks}
            color="var(--brand-primary)"
          />
        </div>
      }
    />
  )
}

// DatePicker Playground
function DatePickerPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [value, setValue] = useState<Date | null>(null)
  const [label, setLabel] = useState('Select date')
  const [placeholder, setPlaceholder] = useState('Pick a date')
  const [stretch, setStretch] = useState(false)

  const code = `<DatePicker${label ? ` label="${label}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''} value={date} onChange={setDate} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { DatePicker } from '.forge'"
      componentName="DatePicker"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <Text size="sm" color="muted">Selected: {value ? value.toLocaleDateString() : 'None'}</Text>
          <Divider />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <DatePicker label={label} placeholder={placeholder} value={value} onChange={setValue} />
      }
    />
  )
}

// Rating Playground
function RatingPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [value, setValue] = useState(3)
  const [max, setMax] = useState(5)
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [label, setLabel] = useState('Rate your experience')
  const [readOnly, setReadOnly] = useState(false)
  const [allowHalf, setAllowHalf] = useState(false)
  const [showValue, setShowValue] = useState(false)

  const code = `<Rating
  value={${value}}
  onChange={setValue}${max !== 5 ? `\n  max={${max}}` : ''}${size !== 'md' ? `\n  size="${size}"` : ''}${label ? `\n  label="${label}"` : ''}${allowHalf ? '\n  allowHalf' : ''}${showValue ? '\n  showValue' : ''}${readOnly ? '\n  readOnly' : ''}
  color="var(--color-warning)"
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Rating } from '.forge'"
      componentName="Rating"
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} placeholder="Leave empty for no label" />
          <Input label="Value" type="number" value={String(value)} onChange={(v) => setValue(Math.min(max, Math.max(0, Number(v) || 0)))} />
          <Input label="Max Stars" type="number" value={String(max)} onChange={(v) => setMax(Number(v) || 5)} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Divider />
          <Switch checked={allowHalf} onChange={setAllowHalf} label="Allow Half Stars" />
          <Switch checked={showValue} onChange={setShowValue} label="Show Value" />
          <Switch checked={readOnly} onChange={setReadOnly} label="Read Only" />
        </VStack>
      }
      preview={
        <Rating
          value={value}
          onChange={setValue}
          max={max}
          size={size}
          label={label || undefined}
          allowHalf={allowHalf}
          showValue={showValue}
          readOnly={readOnly}
          color="var(--color-warning)"
        />
      }
    />
  )
}

// TagInput Playground
function TagInputPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])
  const [label, setLabel] = useState('Tags')
  const [placeholder, setPlaceholder] = useState('Add a tag...')
  const [hint, setHint] = useState('Press Enter or comma to add a tag')
  const [disabled, setDisabled] = useState(false)
  const [maxTags, setMaxTags] = useState(0)
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [variant, setVariant] = useState<'default' | 'pills'>('default')
  const [stretch, setStretch] = useState(true)

  const code = `<TagInput
  value={tags}
  onChange={setTags}${label ? `\n  label="${label}"` : ''}${placeholder ? `\n  placeholder="${placeholder}"` : ''}${hint ? `\n  hint="${hint}"` : ''}${size !== 'md' ? `\n  size="${size}"` : ''}${variant !== 'default' ? `\n  variant="${variant}"` : ''}${maxTags > 0 ? `\n  maxTags={${maxTags}}` : ''}${disabled ? '\n  disabled' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { TagInput } from '.forge'"
      componentName="TagInput"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Label" value={label} onChange={setLabel} />
          <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <Input label="Hint" value={hint} onChange={setHint} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' }
          ]} />
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'default', label: 'Default' },
            { value: 'pills', label: 'Pills' }
          ]} />
          <Input label="Max Tags (0 = unlimited)" type="number" value={String(maxTags)} onChange={(v) => setMaxTags(Number(v) || 0)} />
          <Divider />
          <Text size="sm" color="muted">Current tags: {tags.length > 0 ? tags.join(', ') : '(none)'}</Text>
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <TagInput
          label={label}
          value={tags}
          onChange={setTags}
          placeholder={placeholder}
          hint={hint || undefined}
          size={size}
          variant={variant}
          maxTags={maxTags > 0 ? maxTags : undefined}
          disabled={disabled}
        />
      }
    />
  )
}

// SearchInput Playground
function SearchInputPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [value, setValue] = useState('')
  const [placeholder, setPlaceholder] = useState('Search...')
  const [stretch, setStretch] = useState(true)

  const code = `<SearchInput value={value} onChange={setValue}${placeholder ? ` placeholder="${placeholder}"` : ''} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { SearchInput } from '.forge'"
      componentName="SearchInput"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <Text size="sm" color="muted">Current value: {value || '(empty)'}</Text>
          <Divider />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <SearchInput value={value} onChange={setValue} placeholder={placeholder} />
      }
    />
  )
}

// Accordion Playground
function AccordionPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [multiple, setMultiple] = useState(false)
  const [stretch, setStretch] = useState(true)

  const code = `<Accordion${multiple ? ' multiple' : ''}>
  <AccordionItem id="1" title="Section 1">
    Content for section 1
  </AccordionItem>
  <AccordionItem id="2" title="Section 2">
    Content for section 2
  </AccordionItem>
</Accordion>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Accordion, AccordionItem } from '.forge'"
      componentName="Accordion"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Switch checked={multiple} onChange={setMultiple} label="Allow Multiple Open" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Accordion multiple={multiple}>
          <AccordionItem id="faq1" title="What is Forge?">
            <Text>Forge is a modern React component library with a focus on developer experience and beautiful design.</Text>
          </AccordionItem>
          <AccordionItem id="faq2" title="How do I install it?">
            <Text>Run npm install @webba/forge or yarn add @webba/forge to get started.</Text>
          </AccordionItem>
          <AccordionItem id="faq3" title="Is it customizable?">
            <Text>Yes! Forge supports theming and CSS variables for easy customization.</Text>
          </AccordionItem>
        </Accordion>
      }
    />
  )
}

// Table Playground
function TablePlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [title, setTitle] = useState('Users')
  const [subtitle, setSubtitle] = useState('Manage your team members')
  const [searchable, setSearchable] = useState(true)
  const [sortable, setSortable] = useState(true)
  const [pagination, setPagination] = useState(true)
  const [pageSize, setPageSize] = useState(5)
  const [striped, setStriped] = useState(false)
  const [compact, setCompact] = useState(false)
  const [selectable, setSelectable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [noPadding, setNoPadding] = useState(false)
  const [globalActions, setGlobalActions] = useState(false)
  const [stretch, setStretch] = useState(true)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const columns = [
    { key: 'id', header: 'ID', width: 60 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true }
  ]

  const data = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
    { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin' },
    { id: '6', name: 'Eva Martinez', email: 'eva@example.com', role: 'User' },
    { id: '7', name: 'Frank Lee', email: 'frank@example.com', role: 'Editor' }
  ]

  const code = `<Table
  columns={[
    { key: 'id', header: 'ID', width: 60 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true }
  ]}
  data={data}${title ? `\n  title="${title}"` : ''}${subtitle ? `\n  subtitle="${subtitle}"` : ''}${searchable ? '\n  searchable' : '\n  searchable={false}'}${sortable ? '\n  sortable' : '\n  sortable={false}'}${pagination ? `\n  pagination\n  pageSize={${pageSize}}` : '\n  pagination={false}'}${striped ? '\n  striped' : ''}${compact ? '\n  compact' : ''}${noPadding ? '\n  noPadding' : ''}${selectable ? '\n  selectable\n  selectedKeys={selectedKeys}\n  onSelectionChange={setSelectedKeys}' : ''}${globalActions ? '\n  globalActions={<><Button variant="ghost" size="sm">Filter</Button><Button variant="primary" size="sm">Add</Button></>}' : ''}${loading ? '\n  loading' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Table } from '.forge'"
      componentName="Table"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Title" value={title} onChange={setTitle} placeholder="Leave empty for no title" />
          <Input label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="Leave empty for no subtitle" />
          <Divider />
          <Text size="sm" weight="medium">Features</Text>
          <Switch checked={searchable} onChange={setSearchable} label="Searchable" />
          <Switch checked={sortable} onChange={setSortable} label="Sortable" />
          <Switch checked={selectable} onChange={setSelectable} label="Selectable" />
          <Switch checked={pagination} onChange={setPagination} label="Pagination" />
          {pagination && (
            <Input label="Page Size" type="number" value={String(pageSize)} onChange={(v) => setPageSize(Number(v) || 5)} />
          )}
          <Divider />
          <Text size="sm" weight="medium">Styling</Text>
          <Switch checked={striped} onChange={setStriped} label="Striped" />
          <Switch checked={compact} onChange={setCompact} label="Compact" />
          <Switch checked={noPadding} onChange={setNoPadding} label="No Padding" />
          <Divider />
          <Text size="sm" weight="medium">Header</Text>
          <Switch checked={globalActions} onChange={setGlobalActions} label="Global Actions" />
          <Divider />
          <Switch checked={loading} onChange={setLoading} label="Loading State" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Table
          columns={columns}
          data={data}
          title={title || undefined}
          subtitle={subtitle || undefined}
          searchable={searchable}
          sortable={sortable}
          pagination={pagination}
          pageSize={pageSize}
          striped={striped}
          compact={compact}
          noPadding={noPadding}
          selectable={selectable}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          loading={loading}
          globalActions={globalActions ? (
            <>
              <Button variant="ghost" size="sm" icon={<Filter20Regular />}>Filter</Button>
              <Button variant="primary" size="sm" icon={<Add20Regular />}>Add</Button>
            </>
          ) : undefined}
        />
      }
    />
  )
}

// CodeBlock Playground
function CodeBlockPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [language, setLanguage] = useState('typescript')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [showCopyButton, setShowCopyButton] = useState(true)
  const [stretch, setStretch] = useState(true)

  const sampleCode = `function greet(name: string) {
  console.log(\`Hello, \${name}!\`)
}

greet('World')`

  const code = `<CodeBlock
  code={codeString}
  language="${language}"${showLineNumbers ? '\n  showLineNumbers' : ''}${showCopyButton ? '\n  showCopyButton' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { CodeBlock } from '.forge'"
      componentName="CodeBlock"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Select label="Language" value={language} onChange={setLanguage} options={[
            { value: 'typescript', label: 'TypeScript' },
            { value: 'javascript', label: 'JavaScript' },
            { value: 'python', label: 'Python' },
            { value: 'css', label: 'CSS' },
            { value: 'html', label: 'HTML' }
          ]} />
          <Divider />
          <Switch checked={showLineNumbers} onChange={setShowLineNumbers} label="Show Line Numbers" />
          <Switch checked={showCopyButton} onChange={setShowCopyButton} label="Show Copy Button" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <CodeBlock code={sampleCode} language={language} showLineNumbers={showLineNumbers} showCopyButton={showCopyButton} />
      }
    />
  )
}

// Kbd Playground
function KbdPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [keys, setKeys] = useState('Ctrl+S')

  const code = `<Kbd>${keys}</Kbd>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Kbd } from '.forge'"
      componentName="Kbd"
      controls={
        <VStack gap="sm">
          <Input label="Keys" value={keys} onChange={setKeys} placeholder="e.g. Ctrl+S" />
          <Text size="sm" color="muted">Examples: Ctrl+S, Cmd+K, Shift+Enter</Text>
        </VStack>
      }
      preview={
        <HStack gap="md">
          <Kbd>{keys}</Kbd>
          <Text>or</Text>
          <HStack gap="xs">
            <Kbd>Cmd</Kbd>
            <Kbd>K</Kbd>
          </HStack>
        </HStack>
      }
    />
  )
}

// Tabs Playground
function TabsPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [currentTab, setCurrentTab] = useState('tab1')
  const [stretchLine, setStretchLine] = useState(false)
  const [stretch, setStretch] = useState(true)

  const code = `<Tabs
  tabs={[
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Settings' },
    { id: 'tab3', label: 'Analytics' }
  ]}
  active={currentTab}
  onChange={setCurrentTab}${stretchLine ? '\n  stretchLine' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Tabs } from '.forge'"
      componentName="Tabs"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Switch checked={stretchLine} onChange={setStretchLine} label="Stretch Line" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <VStack gap="md" style={{ width: '100%' }}>
          <Tabs
            tabs={[
              { id: 'tab1', label: 'Overview', icon: <Home20Regular /> },
              { id: 'tab2', label: 'Settings', icon: <Settings20Regular /> },
              { id: 'tab3', label: 'Analytics', icon: <DataPie20Regular /> }
            ]}
            active={currentTab}
            onChange={setCurrentTab}
            stretchLine={stretchLine}
          />
          <Card padding="md">
            <Text>Content for {currentTab === 'tab1' ? 'Overview' : currentTab === 'tab2' ? 'Settings' : 'Analytics'}</Text>
          </Card>
        </VStack>
      }
    />
  )
}

// Breadcrumbs Playground
function BreadcrumbsPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [itemCount, setItemCount] = useState(3)
  const [stretch, setStretch] = useState(true)

  const items = [
    { label: 'Home', href: '#' },
    { label: 'Products', href: '#' },
    { label: 'Electronics', href: '#' },
    { label: 'Phones', href: '#' }
  ].slice(0, itemCount)

  const code = `<Breadcrumbs items={[
${items.map(i => `  { label: '${i.label}', href: '${i.href}' }`).join(',\n')}
]} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Breadcrumbs } from '.forge'"
      componentName="Breadcrumbs"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Select label="Number of Items" value={String(itemCount)} onChange={(v) => setItemCount(Number(v))} options={[
            { value: '2', label: '2 items' },
            { value: '3', label: '3 items' },
            { value: '4', label: '4 items' }
          ]} />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Breadcrumbs items={items} />
      }
    />
  )
}

// Stepper Playground
function StepperPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [variant, setVariant] = useState<'default' | 'simple' | 'dots'>('default')
  const [stretch, setStretch] = useState(true)

  const steps = [
    { id: '1', title: 'Account', description: 'Create your account' },
    { id: '2', title: 'Profile', description: 'Setup your profile' },
    { id: '3', title: 'Confirm', description: 'Review and confirm' }
  ]

  const code = `<Stepper
  steps={[
    { id: '1', title: 'Account', description: 'Create your account' },
    { id: '2', title: 'Profile', description: 'Setup your profile' },
    { id: '3', title: 'Confirm', description: 'Review and confirm' }
  ]}
  currentStep={${currentStep}}
  orientation="${orientation}"${variant !== 'default' ? `\n  variant="${variant}"` : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Stepper } from '.forge'"
      componentName="Stepper"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Select label="Current Step" value={String(currentStep)} onChange={(v) => setCurrentStep(Number(v))} options={[
            { value: '0', label: 'Step 1' },
            { value: '1', label: 'Step 2' },
            { value: '2', label: 'Step 3' }
          ]} />
          <Select label="Orientation" value={orientation} onChange={(v) => setOrientation(v as typeof orientation)} options={[
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' }
          ]} />
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'default', label: 'Default' },
            { value: 'simple', label: 'Simple' },
            { value: 'dots', label: 'Dots' }
          ]} />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Stepper steps={steps} currentStep={currentStep} orientation={orientation} variant={variant} />
      }
    />
  )
}

// Banner Playground (Alert)
function AlertPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [variant, setVariant] = useState<'info' | 'success' | 'warning' | 'error' | 'brand' | 'neutral'>('info')
  const [title, setTitle] = useState('Information')
  const [message, setMessage] = useState('This is an important message for you.')
  const [size, setSize] = useState<'sm' | 'md'>('md')
  const [dismissible, setDismissible] = useState(true)
  const [showAction, setShowAction] = useState(false)
  const [stretch, setStretch] = useState(true)

  const code = `<Banner
  variant="${variant}"${title ? `\n  title="${title}"` : ''}${size !== 'md' ? `\n  size="${size}"` : ''}${dismissible ? '\n  dismissible' : ''}${showAction ? '\n  action={{ label: "Learn more", onClick: () => {} }}' : ''}>
  ${message}
</Banner>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Banner } from '.forge'"
      componentName="Banner"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'info', label: 'Info' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' },
            { value: 'brand', label: 'Brand' },
            { value: 'neutral', label: 'Neutral' }
          ]} />
          <Select label="Size" value={size} onChange={(v) => setSize(v as typeof size)} options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' }
          ]} />
          <Input label="Title" value={title} onChange={setTitle} />
          <Textarea label="Message" value={message} onChange={setMessage} rows={2} />
          <Divider />
          <Switch checked={dismissible} onChange={setDismissible} label="Dismissible" />
          <Switch checked={showAction} onChange={setShowAction} label="Show Action Button" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <Banner
          variant={variant}
          title={title}
          size={size}
          dismissible={dismissible}
          action={showAction ? { label: 'Learn more', onClick: () => alert('Action clicked!') } : undefined}
        >
          {message}
        </Banner>
      }
    />
  )
}

// Skeleton Playground
function SkeletonPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [variant, setVariant] = useState<'text' | 'circular' | 'rectangular'>('text')
  const [lines, setLines] = useState(3)
  const [stretch, setStretch] = useState(true)

  const code = variant === 'text'
    ? `<SkeletonText lines={${lines}} />`
    : `<Skeleton variant="${variant}" width={${variant === 'circular' ? 60 : 200}} height={${variant === 'circular' ? 60 : 100}} />`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { Skeleton, SkeletonText } from '.forge'"
      componentName="Skeleton"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Select label="Variant" value={variant} onChange={(v) => setVariant(v as typeof variant)} options={[
            { value: 'text', label: 'Text' },
            { value: 'circular', label: 'Circular' },
            { value: 'rectangular', label: 'Rectangular' }
          ]} />
          {variant === 'text' && (
            <Input label="Lines" type="number" value={String(lines)} onChange={(v) => setLines(Number(v) || 3)} />
          )}
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        variant === 'text' ? (
          <SkeletonText lines={lines} />
        ) : (
          <Skeleton variant={variant} width={variant === 'circular' ? 60 : 200} height={variant === 'circular' ? 60 : 100} />
        )
      }
    />
  )
}

// BarChart Playground
function BarChartPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [showLabels, setShowLabels] = useState(true)
  const [showValues, setShowValues] = useState(true)
  const [horizontal, setHorizontal] = useState(false)
  const [animated, setAnimated] = useState(true)
  const [height, setHeight] = useState(200)
  const [barRadius, setBarRadius] = useState(6)
  const [stretch, setStretch] = useState(true)

  const data = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 180 },
    { label: 'Mar', value: 150 },
    { label: 'Apr', value: 220 },
    { label: 'May', value: 190 }
  ]

  const code = `<BarChart
  data={[
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 180 },
    ...
  ]}
  height={${height}}${barRadius !== 6 ? `\n  barRadius={${barRadius}}` : ''}${!showLabels ? '\n  showLabels={false}' : ''}${!showValues ? '\n  showValues={false}' : ''}${horizontal ? '\n  horizontal' : ''}${!animated ? '\n  animated={false}' : ''}
  color="var(--brand-primary)"
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { BarChart } from '.forge'"
      componentName="BarChart"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Height" type="number" value={String(height)} onChange={(v) => setHeight(Number(v) || 200)} />
          <Input label="Bar Radius" type="number" value={String(barRadius)} onChange={(v) => setBarRadius(Number(v) || 0)} />
          <Divider />
          <Switch checked={showLabels} onChange={setShowLabels} label="Show Labels" />
          <Switch checked={showValues} onChange={setShowValues} label="Show Values" />
          <Switch checked={horizontal} onChange={setHorizontal} label="Horizontal" />
          <Switch checked={animated} onChange={setAnimated} label="Animated" />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <BarChart
          data={data}
          showLabels={showLabels}
          showValues={showValues}
          horizontal={horizontal}
          height={height}
          barRadius={barRadius}
          animated={animated}
          color="var(--brand-primary)"
        />
      }
    />
  )
}

// LineChart Playground
function LineChartPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [showGrid, setShowGrid] = useState(true)
  const [showDots, setShowDots] = useState(true)
  const [smooth, setSmooth] = useState(true)
  const [showXLabels, setShowXLabels] = useState(true)
  const [showYLabels, setShowYLabels] = useState(true)
  const [animated, setAnimated] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [gridLines, setGridLines] = useState(5)
  const [height, setHeight] = useState(200)
  const [stretch, setStretch] = useState(true)

  const data = [40, 65, 55, 80, 70, 90, 75]
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const code = `<LineChart
  data={[40, 65, 55, 80, 70, 90, 75]}
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
  height={${height}}${!showGrid ? '\n  showGrid={false}' : ''}${gridLines !== 5 ? `\n  gridLines={${gridLines}}` : ''}${!showDots ? '\n  showDots={false}' : ''}${!smooth ? '\n  smooth={false}' : ''}${!showXLabels ? '\n  showXLabels={false}' : ''}${!showYLabels ? '\n  showYLabels={false}' : ''}${!animated ? '\n  animated={false}' : ''}${!showTooltip ? '\n  showTooltip={false}' : ''}
  color="var(--brand-primary)"
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { LineChart } from '.forge'"
      componentName="LineChart"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Input label="Height" type="number" value={String(height)} onChange={(v) => setHeight(Number(v) || 200)} />
          <Input label="Grid Lines" type="number" value={String(gridLines)} onChange={(v) => setGridLines(Number(v) || 5)} />
          <Divider />
          <Switch checked={showGrid} onChange={setShowGrid} label="Show Grid" />
          <Switch checked={showDots} onChange={setShowDots} label="Show Dots" />
          <Switch checked={smooth} onChange={setSmooth} label="Smooth Line" />
          <Switch checked={showTooltip} onChange={setShowTooltip} label="Show Tooltip" />
          <Switch checked={animated} onChange={setAnimated} label="Animated" />
          <Divider />
          <Text size="sm" weight="medium">Axis Labels</Text>
          <Switch checked={showXLabels} onChange={setShowXLabels} label="Show X Labels" />
          <Switch checked={showYLabels} onChange={setShowYLabels} label="Show Y Labels" />
          <Divider />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <LineChart
          data={data}
          labels={labels}
          showGrid={showGrid}
          gridLines={gridLines}
          showDots={showDots}
          smooth={smooth}
          showXLabels={showXLabels}
          showYLabels={showYLabels}
          animated={animated}
          showTooltip={showTooltip}
          height={height}
          color="var(--brand-primary)"
        />
      }
    />
  )
}

// MultiLineChart Playground
function MultiLineChartPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [showGrid, setShowGrid] = useState(true)
  const [showDots, setShowDots] = useState(true)
  const [smooth, setSmooth] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [showArea, setShowArea] = useState(true)
  const [showXLabels, setShowXLabels] = useState(false)
  const [showYLabels, setShowYLabels] = useState(false)
  const [stretch, setStretch] = useState(true)

  const series = [
    { name: 'Revenue', data: [40, 65, 55, 80, 70, 90, 75], color: 'var(--brand-primary)' },
    { name: 'Expenses', data: [30, 45, 40, 50, 60, 55, 50], color: 'var(--color-warning)' },
    { name: 'Profit', data: [10, 20, 15, 30, 10, 35, 25], color: 'var(--color-success)' }
  ]
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const code = `<MultiLineChart
  series={[
    { name: 'Revenue', data: [...], color: 'var(--brand-primary)' },
    { name: 'Expenses', data: [...], color: 'var(--color-warning)' },
    { name: 'Profit', data: [...], color: 'var(--color-success)' }
  ]}
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}${!showGrid ? '\n  showGrid={false}' : ''}${!showDots ? '\n  showDots={false}' : ''}${!smooth ? '\n  smooth={false}' : ''}${!showLegend ? '\n  showLegend={false}' : ''}${!showArea ? '\n  showArea={false}' : ''}${showXLabels ? '\n  showXLabels' : ''}${showYLabels ? '\n  showYLabels' : ''}
  height={220}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { MultiLineChart } from '.forge'"
      componentName="MultiLineChart"
      stretch={stretch}
      controls={
        <VStack gap="sm">
          <Switch checked={showGrid} onChange={setShowGrid} label="Show Grid" />
          <Switch checked={showDots} onChange={setShowDots} label="Show Dots" />
          <Switch checked={smooth} onChange={setSmooth} label="Smooth Lines" />
          <Switch checked={showLegend} onChange={setShowLegend} label="Show Legend" />
          <Switch checked={showArea} onChange={setShowArea} label="Show Area Fill" />
          <Divider />
          <Text size="sm" weight="medium">Axis Labels</Text>
          <Switch checked={showXLabels} onChange={setShowXLabels} label="Show X Labels" />
          <Switch checked={showYLabels} onChange={setShowYLabels} label="Show Y Labels" />
          <Divider />
          <Switch checked={stretch} onChange={setStretch} label="Stretch Preview" />
        </VStack>
      }
      preview={
        <MultiLineChart
          series={series}
          labels={labels}
          showGrid={showGrid}
          showDots={showDots}
          smooth={smooth}
          showLegend={showLegend}
          showArea={showArea}
          showXLabels={showXLabels}
          showYLabels={showYLabels}
          height={220}
        />
      }
    />
  )
}

// DonutChart Playground
function DonutChartPlayground({ activeTab, setActiveTab }: PlaygroundProps) {
  const [showLegend, setShowLegend] = useState(true)
  const [legendBelow, setLegendBelow] = useState(false)
  const [size, setSize] = useState(180)
  const [thickness, setThickness] = useState(24)
  const [animated, setAnimated] = useState(true)
  const [showCenterContent, setShowCenterContent] = useState(false)

  const data = [
    { label: 'Desktop', value: 45, color: 'var(--brand-primary)' },
    { label: 'Mobile', value: 35, color: 'var(--color-success)' },
    { label: 'Tablet', value: 20, color: 'var(--color-warning)' }
  ]

  const code = `<DonutChart
  data={[
    { label: 'Desktop', value: 45, color: 'var(--brand-primary)' },
    { label: 'Mobile', value: 35, color: 'var(--color-success)' },
    { label: 'Tablet', value: 20, color: 'var(--color-warning)' }
  ]}
  size={${size}}${thickness !== 24 ? `\n  thickness={${thickness}}` : ''}${!showLegend ? '\n  showLegend={false}' : ''}${legendBelow ? '\n  legendBelow' : ''}${!animated ? '\n  animated={false}' : ''}${showCenterContent ? '\n  centerContent={<Text weight="bold">100%</Text>}' : ''}
/>`

  return (
    <PlaygroundLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      code={code}
      imports="import { DonutChart } from '.forge'"
      componentName="DonutChart"
      controls={
        <VStack gap="sm">
          <Input label="Size" type="number" value={String(size)} onChange={(v) => setSize(Number(v) || 180)} />
          <Input label="Thickness" type="number" value={String(thickness)} onChange={(v) => setThickness(Number(v) || 24)} />
          <Divider />
          <Switch checked={showLegend} onChange={setShowLegend} label="Show Legend" />
          <Switch checked={legendBelow} onChange={setLegendBelow} label="Legend Below" />
          <Switch checked={animated} onChange={setAnimated} label="Animated" />
          <Switch checked={showCenterContent} onChange={setShowCenterContent} label="Show Center Content" />
        </VStack>
      }
      preview={
        <DonutChart
          data={data}
          showLegend={showLegend}
          legendBelow={legendBelow}
          size={size}
          thickness={thickness}
          animated={animated}
          centerContent={showCenterContent ? <Text weight="bold">100%</Text> : undefined}
        />
      }
    />
  )
}

// Playground Layout Component
interface PlaygroundLayoutProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  code: string
  imports: string
  componentName: string
  controls: React.ReactNode
  preview: React.ReactNode
  stretch?: boolean
}

function PlaygroundLayout({ activeTab, setActiveTab, code, imports, componentName, controls, preview, stretch }: PlaygroundLayoutProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
      gap: '1.5rem'
    }}>
      <Card padding="lg">
        <VStack gap="sm">
          <VStack gap="xs">
            <Heading level={4} style={{ margin: 0 }}>Properties</Heading>
            <Text size="sm" color="muted">Test different configurations and copy the generated code</Text>
          </VStack>
          <Divider />
          {controls}
        </VStack>
      </Card>

      <VStack gap="0">
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <Tabs
            tabs={[
              { id: 'preview', label: 'Preview', icon: <Eye20Regular /> },
              { id: 'code', label: 'Code', icon: <Code20Regular /> }
            ]}
            active={activeTab}
            onChange={setActiveTab}
            stretchLine
          />
          <TabPanels active={activeTab}>
            <TabPanel id="preview" active={activeTab}>
              <div style={{
                padding: '2rem',
                minHeight: 200,
                display: 'flex',
                alignItems: stretch ? 'stretch' : 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-tertiary)'
              }}>
                <div style={{ width: stretch ? '100%' : 'auto' }}>
                  {preview}
                </div>
              </div>
            </TabPanel>
            <TabPanel id="code" active={activeTab}>
              <CodeBlock code={code} language="tsx" showCopyButton />
            </TabPanel>
          </TabPanels>
        </Card>

        <Card variant="subtle" padding="md" style={{ marginTop: '1rem' }}>
          <HStack gap="md" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <VStack gap="xs">
              <Text size="sm" color="muted">Import</Text>
              <code style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }}>{imports}</code>
            </VStack>
            <Badge variant="primary">{componentName}</Badge>
          </HStack>
        </Card>
      </VStack>
    </div>
  )
}

// Main Page Component
export function PlaygroundPage() {
  const [searchParams] = useSearchParams()
  const componentParam = searchParams.get('component')

  const [activeCategory, setActiveCategory] = useState('buttons')
  const [activeComponent, setActiveComponent] = useState('button')
  const [activeTab, setActiveTab] = useState('preview')

  // Handle URL parameter for component
  useEffect(() => {
    if (componentParam) {
      // Find the category that contains this component
      const category = componentCategories.find(cat =>
        cat.components.some(comp => comp.id === componentParam)
      )
      if (category) {
        setActiveCategory(category.id)
        setActiveComponent(componentParam)
      }
    }
  }, [componentParam])

  const currentCategory = componentCategories.find(c => c.id === activeCategory)

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <section style={{ padding: '3rem 0 2rem', borderBottom: '1px solid var(--border-color)' }}>
        <Container>
          <Animate type="fadeIn">
            <VStack gap="md" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <HStack gap="sm" style={{ justifyContent: 'center' }}>
                <Play20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={1}>Component Playground</Heading>
              </HStack>
              <Text size="lg" color="secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
                Interactively configure components and see the generated code.
              </Text>
            </VStack>
          </Animate>

          {/* Category Pills */}
          <Animate type="slideInUp" delay={100}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {componentCategories.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setActiveComponent(cat.components[0].id)
                    }}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: isActive ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      border: isActive ? 'none' : '1px solid var(--border-color)',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: isActive ? 'white' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </Animate>

          {/* Component Pills */}
          <Animate type="fadeIn" delay={150}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center' }}>
              {currentCategory?.components.map((comp) => {
                const isActive = activeComponent === comp.id
                return (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComponent(comp.id)}
                    style={{
                      padding: '0.375rem 0.875rem',
                      background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.8125rem'
                    }}
                  >
                    {comp.label}
                  </button>
                )
              })}
            </div>
          </Animate>
        </Container>
      </section>

      <section style={{ padding: '2rem 0' }}>
        <Container>
          {/* Buttons */}
          {activeComponent === 'button' && <ButtonPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'iconbutton' && <IconButtonPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'gradientbutton' && <GradientButtonPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}

          {/* Forms */}
          {activeComponent === 'input' && <InputPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'textarea' && <TextareaPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'select' && <SelectPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'checkbox' && <CheckboxPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'switch' && <SwitchPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'slider' && <SliderPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'datepicker' && <DatePickerPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'rating' && <RatingPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'taginput' && <TagInputPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'searchinput' && <SearchInputPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}

          {/* Data Display */}
          {activeComponent === 'badge' && <BadgePlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'avatar' && <AvatarPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'card' && <CardPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'statcard' && <StatCardPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'accordion' && <AccordionPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'table' && <TablePlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'codeblock' && <CodeBlockPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'kbd' && <KbdPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}

          {/* Navigation */}
          {activeComponent === 'tabs' && <TabsPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'breadcrumbs' && <BreadcrumbsPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'stepper' && <StepperPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}

          {/* Feedback */}
          {activeComponent === 'spinner' && <SpinnerPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'tooltip' && <TooltipPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'modal' && <ModalPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'toast' && <ToastPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'alert' && <AlertPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'skeleton' && <SkeletonPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}

          {/* Charts */}
          {activeComponent === 'progressring' && <ProgressRingPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'barchart' && <BarChartPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'linechart' && <LineChartPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'multilinechart' && <MultiLineChartPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeComponent === 'donutchart' && <DonutChartPlayground activeTab={activeTab} setActiveTab={setActiveTab} />}
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
