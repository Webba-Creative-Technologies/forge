import { useState, useEffect } from 'react'
import {
  Container,
  VStack,
  HStack,
  Grid,
  Heading,
  Text,
  Card,
  Button,
  Badge,
  Input,
  Checkbox,
  Switch,
  StatCard,
  Avatar,
  Animate,
  Divider,
  DonutChart,
  BarChart,
  LineChart,
  MultiLineChart,
  ProgressRing,
  Tabs,
  TabPanels,
  TabPanel,
  CodeBlock,
  OTPInput,
  AppSidebar,
  Pills,
  Table,
  Navbar,
  IconButton,
  NavigationProvider,
  Footer
} from '../../.forge'
import {
  Desktop20Regular,
  TabletLaptop20Regular,
  Phone20Regular,
  Copy20Regular,
  Checkmark20Regular,
  LockClosed20Regular,
  Mail20Regular,
  Password20Regular,
  ChartMultiple20Regular,
  Navigation20Regular,
  DataBarVertical20Regular,
  Grid20Regular,
  Home20Regular,
  Settings20Regular,
  People20Regular,
  Folder20Regular,
  Document20Regular,
  ArrowTrending20Regular,
  Clock20Regular,
  ShieldCheckmark20Regular,
  Calendar20Regular,
  Cart20Regular,
  Alert20Regular
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

type Viewport = 'desktop' | 'tablet' | 'mobile'

interface BlockPreviewProps {
  title: string
  description: string
  code: string
  children: React.ReactNode
}

function BlockPreview({ title, description, code, children }: BlockPreviewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [isRealMobile, setIsRealMobile] = useState(false)

  // Detect real mobile device
  useEffect(() => {
    const checkMobile = () => setIsRealMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card padding="none" style={{ overflow: 'hidden' }}>
      <VStack gap="none">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: isRealMobile ? '0.75rem' : '1rem',
          borderBottom: '1px solid var(--border-color)',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
            <Text weight="medium" size="lg">{title}</Text>
            <Text size="sm" color="muted">{description}</Text>
          </VStack>
          {!isRealMobile && (
            <Pills
              options={[
                { id: 'desktop', label: <Desktop20Regular /> },
                { id: 'tablet', label: <TabletLaptop20Regular /> },
                { id: 'mobile', label: <Phone20Regular /> }
              ]}
              selected={viewport}
              onChange={(id) => setViewport(id as Viewport)}
            />
          )}
        </div>

        <Tabs
          tabs={[
            { id: 'preview', label: 'Preview' },
            { id: 'code', label: 'Code' }
          ]}
          active={activeTab}
          onChange={setActiveTab}
          stretchLine
        />

        <TabPanels active={activeTab}>
          <TabPanel id="preview" active={activeTab}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: isRealMobile ? 0 : '1.5rem',
              backgroundColor: isRealMobile ? 'var(--bg-primary)' : 'var(--bg-tertiary)'
            }}>
              <div style={{
                width: isRealMobile ? '100%' : viewportWidths[viewport],
                maxWidth: '100%',
                transition: 'width 0.3s ease',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: isRealMobile ? 0 : (viewport !== 'desktop' ? 'var(--radius-lg)' : 0),
                border: isRealMobile ? 'none' : (viewport !== 'desktop' ? '1px solid var(--border-color)' : 'none'),
                overflow: 'hidden'
              }}>
                <NavigationProvider>
                  {children}
                </NavigationProvider>
              </div>
            </div>
          </TabPanel>
          <TabPanel id="code" active={activeTab}>
            <div style={{ position: 'relative' }}>
              <Button
                variant="ghost"
                size="sm"
                icon={copied ? <Checkmark20Regular /> : <Copy20Regular />}
                onClick={handleCopy}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  zIndex: 10
                }}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <CodeBlock code={code} language="tsx" />
            </div>
          </TabPanel>
        </TabPanels>
      </VStack>
    </Card>
  )
}

// ============ AUTHENTICATION BLOCKS ============

function LoginBlock() {
  const [remember, setRemember] = useState(false)

  return (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card padding="xl" style={{ width: '100%', maxWidth: 400 }}>
        <VStack gap="md">
          <VStack gap="0" style={{ textAlign: 'center' }}>
            <Heading level={2}>Welcome back</Heading>
            <Text color="secondary">Sign in to your account</Text>
          </VStack>

          <VStack gap="0">
            <Input label="Email" type="email" placeholder="Enter your email" icon={<Mail20Regular />} />
            <Input label="Password" type="password" placeholder="Enter your password" icon={<Password20Regular />} />

            <HStack style={{ justifyContent: 'space-between' }}>
              <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
              <Button variant="ghost" size="sm">Forgot password?</Button>
            </HStack>

          </VStack>

          <VStack gap="sm">
            <Button variant="primary" fullWidth >Sign in</Button>

            <Divider label="or" />

            <Button variant="secondary" fullWidth>Register</Button>

          </VStack>
        </VStack>
      </Card>
    </div>
  )
}

const loginCode = `<Card padding="xl" style={{ width: '100%', maxWidth: 400 }}>
        <VStack gap="md">
          <VStack gap="0" style={{ textAlign: 'center' }}>
            <Heading level={2}>Welcome back</Heading>
            <Text color="secondary">Sign in to your account</Text>
          </VStack>

          <VStack gap="0">
            <Input label="Email" type="email" placeholder="Enter your email" icon={<Mail20Regular />} />
            <Input label="Password" type="password" placeholder="Enter your password" icon={<Password20Regular />} />

            <HStack style={{ justifyContent: 'space-between' }}>
              <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
              <Button variant="ghost" size="sm">Forgot password?</Button>
            </HStack>

          </VStack>

          <VStack gap="sm">
            <Button variant="primary" fullWidth >Sign in</Button>

            <Divider label="or" />

            <Button variant="secondary" fullWidth>Register</Button>

          </VStack>
      </VStack>
</Card>`

function RegisterBlock() {
  const [agree, setAgree] = useState(false)

  return (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card padding="xl" style={{ width: '100%', maxWidth: 400 }}>
        <VStack gap="md">
          <VStack gap="0" style={{ textAlign: 'center' }}>
            <Heading level={2}>Create account</Heading>
            <Text color="secondary">Get started with your free account</Text>
          </VStack>

          <VStack gap="0">
            <Grid columns={{ xs: 1, sm: 2 }} gap="sm">
              <Input label="First name" placeholder="John" />
              <Input label="Last name" placeholder="Doe" />
            </Grid>
            <Input label="Email" type="email" placeholder="john@example.com" icon={<Mail20Regular />} />
            <Input label="Password" type="password" placeholder="Create a password" icon={<Password20Regular />} />

            <HStack style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <Checkbox label="I agree to the Terms of Service" checked={agree} onChange={setAgree} /></HStack>

          </VStack>

          <VStack gap="sm">
            <Button variant="primary" fullWidth>Create account</Button>

            <Divider label="or" />

            <Button variant="secondary" fullWidth>Sign in</Button>
          </VStack>
        </VStack>
      </Card>
    </div>
  )
}

const registerCode = `<Card padding="xl" style={{ width: '100%', maxWidth: 400 }}>
      <VStack gap="md">
          <VStack gap="0" style={{ textAlign: 'center' }}>
            <Heading level={2}>Create account</Heading>
            <Text color="secondary">Get started with your free account</Text>
          </VStack>

          <VStack gap="0">
            <Grid columns={{ xs: 1, sm: 2 }} gap="sm">
              <Input label="First name" placeholder="John" />
              <Input label="Last name" placeholder="Doe" />
            </Grid>
            <Input label="Email" type="email" placeholder="john@example.com" icon={<Mail20Regular />} />
            <Input label="Password" type="password" placeholder="Create a password" icon={<Password20Regular />} />

            <HStack style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <Checkbox label="I agree to the Terms of Service" checked={agree} onChange={setAgree} /></HStack>

          </VStack>

          <VStack gap="sm">
            <Button variant="primary" fullWidth>Create account</Button>

            <Divider label="or" />

            <Button variant="secondary" fullWidth>Sign in</Button>
          </VStack>
      </VStack>
  </Card>`

function OTPBlock() {
  return (
    <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card padding="xl" style={{ width: '100%', maxWidth: 400 }}>
        <VStack gap="lg" style={{ alignItems: 'center' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary)'
          }}>
            <ShieldCheckmark20Regular style={{ fontSize: 32 }} />
          </div>

          <VStack gap="sm" style={{ textAlign: 'center' }}>
            <Heading level={2}>Verify your identity</Heading>
            <Text color="secondary">We sent a 6-digit code to your email</Text>
          </VStack>

          <OTPInput length={6} />

          <Button variant="primary" fullWidth>Verify</Button>
        </VStack>
      </Card>
    </div>
  )
}

const otpCode = `<Card padding="xl" style={{ maxWidth: 400 }}>
  <VStack gap="lg" style={{ alignItems: 'center' }}>
    <div style={{
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-tertiary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand-primary)'
    }}>
      <ShieldCheckmark20Regular style={{ fontSize: 32 }} />
    </div>

    <VStack gap="sm" style={{ textAlign: 'center' }}>
      <Heading level={2}>Verify your identity</Heading>
      <Text color="secondary">We sent a 6-digit code to your email</Text>
    </VStack>

    <OTPInput length={6} />

    <Button variant="primary" fullWidth>Verify</Button>
  </VStack>
</Card>`

// ============ DASHBOARD BLOCKS ============

function DashboardActivityBlock() {
  const activities = [
    { id: '1', user: 'Alice Martin', action: 'Completed task #234', time: '2 min ago' },
    { id: '2', user: 'Bob Wilson', action: 'Uploaded document', time: '15 min ago' },
    { id: '3', user: 'Carol Smith', action: 'Created new project', time: '1 hour ago' },
    { id: '4', user: 'David Brown', action: 'Updated settings', time: '2 hours ago' }
  ]

  return (
    <div style={{ padding: '1.5rem' }}>
      <Card title="Recent Activity" padding="lg">
        <VStack gap="md">
          {activities.map((item) => (
            <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '0.5rem 0', alignItems: 'center' }}>
              <Avatar name={item.user} size="sm" />
              <VStack gap="xs" style={{ flex: '1 1 150px', minWidth: 0 }}>
                <Text weight="medium">{item.user}</Text>
                <Text size="sm" color="secondary">{item.action}</Text>
              </VStack>
              <Text size="xs" color="muted">{item.time}</Text>
            </div>
          ))}
        </VStack>
      </Card>
    </div>
  )
}

const dashboardActivityCode = `<Card title="Recent Activity" padding="lg">
  <VStack gap="md">
    {activities.map((item) => (
      <div key={item.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '0.5rem 0', alignItems: 'center' }}>
        <Avatar name={item.user} size="sm" />
        <VStack gap="xs" style={{ flex: '1 1 150px', minWidth: 0 }}>
          <Text weight="medium">{item.user}</Text>
          <Text size="sm" color="secondary">{item.action}</Text>
        </VStack>
        <Text size="xs" color="muted">{item.time}</Text>
      </div>
    ))}
  </VStack>
</Card>`

function DashboardOverviewBlock() {
  const ordersData = [
    { id: 'ORD-001', customer: 'Alice Martin', date: '2024-01-15', amount: '$234.00', status: 'Completed' },
    { id: 'ORD-002', customer: 'Bob Wilson', date: '2024-01-15', amount: '$129.00', status: 'Pending' },
    { id: 'ORD-003', customer: 'Carol Smith', date: '2024-01-14', amount: '$549.00', status: 'Completed' },
    { id: 'ORD-004', customer: 'David Brown', date: '2024-01-14', amount: '$99.00', status: 'Processing' },
  ]

  return (
    <div style={{ padding: '1.5rem' }}>
      <VStack gap="lg">
        {/* Header - responsive with wrap */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
            <Heading level={2}>Dashboard</Heading>
            <Text color="secondary">Welcome back! Here's what's happening.</Text>
          </VStack>
          <Button variant="secondary" icon={<Calendar20Regular />}>Last 7 days</Button>
        </div>

        {/* Stats Row - flexbox with wrap for true responsive behavior */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: '1 1 200px', minWidth: 180 }}>
            <StatCard
              label="Total Revenue"
              value="$45,231"
              icon={<ArrowTrending20Regular />}
              change={12.5}
              color="var(--brand-primary)"
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 180 }}>
            <StatCard
              label="Orders"
              value="1,205"
              icon={<Document20Regular />}
              change={8.2}
              color="var(--success)"
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 180 }}>
            <StatCard
              label="Customers"
              value="3,456"
              icon={<People20Regular />}
              change={-2.4}
              color="var(--warning)"
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 180 }}>
            <StatCard
              label="Avg. Order"
              color="var(--info)"
              value="$37.50"
              icon={<Clock20Regular />}
              change={4.1}
            />
          </div>
        </div>

        {/* Chart - with overflow handling */}
        <Card title="Performance Overview" padding="lg">
          <div style={{ overflowX: 'auto', margin: '0 -0.5rem', padding: '0 0.5rem' }}>
            <div style={{ minWidth: 400 }}>
              <MultiLineChart
                series={[
                  { name: 'Revenue', data: [120, 180, 150, 220, 190, 280, 250, 320, 290, 380, 350, 420], color: 'var(--brand-primary)' },
                  { name: 'Orders', data: [80, 120, 100, 160, 140, 200, 180, 240, 220, 280, 260, 320], color: '#10b981' },
                  { name: 'Visitors', data: [200, 280, 240, 320, 300, 400, 360, 480, 420, 520, 480, 600], color: '#f59e0b' }
                ]}
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                height={250}
                showGrid
                showLegend
                showXLabels
              />
            </div>
          </div>
        </Card>

        {/* Orders Table - Table has built-in overflow scroll */}
        <Table
          title="Recent Orders"
          subtitle="Latest transactions from your store"
          columns={[
            { key: 'id', header: 'Order ID' },
            { key: 'customer', header: 'Customer' },
            { key: 'date', header: 'Date' },
            { key: 'amount', header: 'Amount' },
            {
              key: 'status', header: 'Status', render: (value) => (
                <Badge
                  variant={value === 'Completed' ? 'success' : value === 'Pending' ? 'warning' : 'primary'}
                  size="sm"
                >
                  {value}
                </Badge>
              )
            }
          ]}
          data={ordersData}
          pagination={false}
        />
      </VStack>
    </div>
  )
}

const dashboardOverviewCode = `<VStack gap="lg">
  {/* Header - responsive with wrap */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  }}>
    <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
      <Heading level={2}>Dashboard</Heading>
      <Text color="secondary">Welcome back!</Text>
    </VStack>
    <Button variant="secondary" icon={<Calendar20Regular />}>Last 7 days</Button>
  </div>

  {/* Stats - flexbox with wrap for responsive cards */}
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
    <div style={{ flex: '1 1 200px', minWidth: 180 }}>
      <StatCard label="Revenue" value="$45,231" icon={<ArrowTrending20Regular />} change={12.5} />
    </div>
    <div style={{ flex: '1 1 200px', minWidth: 180 }}>
      <StatCard label="Orders" value="1,205" icon={<Document20Regular />} change={8.2} />
    </div>
    {/* ... more StatCards */}
  </div>

  {/* Chart - scrollable on small screens */}
  <Card title="Performance Overview" padding="lg">
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 400 }}>
        <MultiLineChart series={chartData} labels={months} height={250} showGrid showLegend />
      </div>
    </div>
  </Card>

  {/* Table - has built-in horizontal scroll */}
  <Table
    title="Recent Orders"
    subtitle="Latest transactions"
    columns={columns}
    data={orders}
    pagination={false}
  />
</VStack>`

// ============ CHARTS BLOCKS ============

function ChartsOverviewBlock() {
  const barData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 85 },
    { label: 'Mar', value: 45 },
    { label: 'Apr', value: 95 },
    { label: 'May', value: 75 },
    { label: 'Jun', value: 110 }
  ]

  const donutData = [
    { label: 'Desktop', value: 60, color: 'var(--brand-primary)' },
    { label: 'Mobile', value: 30, color: 'var(--brand-secondary)' },
    { label: 'Tablet', value: 10, color: 'var(--color-success)' }
  ]

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <Card title="Revenue Overview" padding="lg">
          <BarChart data={barData} height={200} />
        </Card>
        <Card title="Traffic Sources" padding="lg">
          <DonutChart data={donutData} showLegend />
        </Card>
      </div>
    </div>
  )
}

const chartsOverviewCode = `const barData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 85 },
  { label: 'Mar', value: 45 },
  { label: 'Apr', value: 95 },
  { label: 'May', value: 75 },
  { label: 'Jun', value: 110 }
]

const donutData = [
  { label: 'Desktop', value: 60, color: 'var(--brand-primary)' },
  { label: 'Mobile', value: 30, color: 'var(--brand-secondary)' },
  { label: 'Tablet', value: 10, color: 'var(--color-success)' }
]

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
}}>
  <Card title="Revenue Overview" padding="lg">
    <BarChart data={barData} height={200} />
  </Card>
  <Card title="Traffic Sources" padding="lg">
    <DonutChart data={donutData} showLegend />
  </Card>
</div>`

function ChartsLineBlock() {
  const lineData = [120, 150, 180, 140, 200, 170, 190]
  const lineLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div style={{ padding: '1.5rem' }}>
      <Card title="Weekly Performance" padding="lg">
        <LineChart data={lineData} labels={lineLabels} height={250} />
      </Card>
    </div>
  )
}

const chartsLineCode = `const lineData = [120, 150, 180, 140, 200, 170, 190]
const lineLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

<Card title="Weekly Performance" padding="lg">
  <LineChart data={lineData} labels={lineLabels} height={250} />
</Card>`

function ChartsProgressBlock() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1.5rem'
      }}>
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <VStack gap="md" style={{ alignItems: 'center' }}>
            <ProgressRing value={75} size={80} color="var(--brand-primary)" />
            <VStack gap="xs">
              <Text weight="medium">Sales</Text>
              <Text size="sm" color="muted">75% of goal</Text>
            </VStack>
          </VStack>
        </Card>
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <VStack gap="md" style={{ alignItems: 'center' }}>
            <ProgressRing value={92} size={80} color="var(--status-success)" />
            <VStack gap="xs">
              <Text weight="medium">Tasks</Text>
              <Text size="sm" color="muted">92% completed</Text>
            </VStack>
          </VStack>
        </Card>
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <VStack gap="md" style={{ alignItems: 'center' }}>
            <ProgressRing value={45} size={80} color="var(--status-warning)" />
            <VStack gap="xs">
              <Text weight="medium">Budget</Text>
              <Text size="sm" color="muted">45% used</Text>
            </VStack>
          </VStack>
        </Card>
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <VStack gap="md" style={{ alignItems: 'center' }}>
            <ProgressRing value={88} size={80} color="var(--status-info)" />
            <VStack gap="xs">
              <Text weight="medium">Storage</Text>
              <Text size="sm" color="muted">88% full</Text>
            </VStack>
          </VStack>
        </Card>
      </div>
    </div>
  )
}

const chartsProgressCode = `<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '1.5rem'
}}>
  <Card padding="lg" style={{ textAlign: 'center' }}>
    <VStack gap="md" style={{ alignItems: 'center' }}>
      <ProgressRing value={75} size={80} color="var(--brand-primary)" />
      <VStack gap="xs">
        <Text weight="medium">Sales</Text>
        <Text size="sm" color="muted">75% of goal</Text>
      </VStack>
    </VStack>
  </Card>
  {/* Repeat for other cards */}
</div>`

// ============ SIDEBAR BLOCKS ============

function SidebarBlock() {
  const [activeId, setActiveId] = useState('dashboard')

  const sections = [
    {
      items: [
        { id: 'dashboard', icon: <Home20Regular />, label: 'Dashboard' },
        { id: 'projects', icon: <Folder20Regular />, label: 'Projects', badge: 5 },
        { id: 'team', icon: <People20Regular />, label: 'Team' },
        { id: 'documents', icon: <Document20Regular />, label: 'Documents' },
        { id: 'settings', icon: <Settings20Regular />, label: 'Settings' }
      ]
    }
  ]

  return (
    <div style={{ display: 'flex', minHeight: 350 }}>
      <AppSidebar
        logo={<span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>My Product</span>}
        sections={sections}
        activeId={activeId}
        onNavigate={setActiveId}
        showSearch={false}
      />
      <div style={{ flex: 1, padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <Text color="muted">Main content area</Text>
      </div>
    </div>
  )
}

const sidebarCode = `const sections = [
  {
    items: [
      { id: 'dashboard', icon: <Home20Regular />, label: 'Dashboard' },
      { id: 'projects', icon: <Folder20Regular />, label: 'Projects', badge: 5 },
      { id: 'team', icon: <People20Regular />, label: 'Team' },
      { id: 'documents', icon: <Document20Regular />, label: 'Documents' },
      { id: 'settings', icon: <Settings20Regular />, label: 'Settings' }
    ]
  }
]

<AppSidebar
  logo={<span style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Product</span>}
  sections={sections}
  activeId={activeId}
  onNavigate={setActiveId}
  showSearch={false}
/>`

// Header Navigation Block
function HeaderNavBlock() {
  const [activeId, setActiveId] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products', dropdownItems: [
      { id: 'product-1', label: 'Analytics', icon: <ChartMultiple20Regular /> },
      { id: 'product-2', label: 'Automation', icon: <Settings20Regular /> },
      { id: 'product-3', label: 'Security', icon: <ShieldCheckmark20Regular /> }
    ]},
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar
        logo={<span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>My Product</span>}
        items={navItems}
        activeId={activeId}
        onNavigate={setActiveId}
        showSearch
        actions={
          <HStack gap="sm">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="primary" size="sm">Get started</Button>
          </HStack>
        }
        sticky={false}
      />
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <VStack gap="md">
          <Heading level={2}>Welcome to My Product</Heading>
          <Text color="secondary">Build something amazing with our platform</Text>
        </VStack>
      </div>
    </div>
  )
}

const headerNavCode = `const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products', dropdownItems: [
    { id: 'product-1', label: 'Analytics', icon: <ChartMultiple20Regular /> },
    { id: 'product-2', label: 'Automation', icon: <Settings20Regular /> },
    { id: 'product-3', label: 'Security', icon: <ShieldCheckmark20Regular /> }
  ]},
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
]

<Navbar
  logo={<span style={{ fontWeight: 700 }}>My Product</span>}
  items={navItems}
  activeId={activeId}
  onNavigate={setActiveId}
  showSearch
  actions={
    <HStack gap="sm">
      <Button variant="ghost" size="sm">Sign in</Button>
      <Button variant="primary" size="sm">Get started</Button>
    </HStack>
  }
  sticky={false}
/>`

// App Shell Block - Complete layout with navbar + sidebar
function AppShellBlock() {
  const [sidebarActiveId, setSidebarActiveId] = useState('dashboard')
  const [navActiveId, setNavActiveId] = useState('overview')

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'reports', label: 'Reports' },
    { id: 'docs', label: 'Documentation' },
    { id: 'settings', label: 'Settings' }
  ]

  const sections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', icon: <Home20Regular />, label: 'Dashboard' },
        { id: 'analytics', icon: <ChartMultiple20Regular />, label: 'Analytics' },
        { id: 'customers', icon: <People20Regular />, label: 'Customers', badge: 12 },
        { id: 'orders', icon: <Cart20Regular />, label: 'Orders' },
        { id: 'products', icon: <Folder20Regular />, label: 'Products' }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', icon: <Settings20Regular />, label: 'Settings' }
      ]
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 500, backgroundColor: 'var(--bg-primary)' }}>
      <Navbar
        logo={<span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>My Product</span>}
        items={navItems}
        activeId={navActiveId}
        onNavigate={setNavActiveId}
        showSearch
        actions={
          <HStack gap="sm">
            <IconButton icon={<Alert20Regular />} />
            <Avatar name="John Doe" size="sm" />
          </HStack>
        }
        sticky={false}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar
          sections={sections}
          activeId={sidebarActiveId}
          onNavigate={setSidebarActiveId}
          showHeader={false}
          height="100%"
        />
        <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto', backgroundColor: 'var(--bg-primary)' }}>
          <VStack gap="lg">
            <Heading level={3}>{sidebarActiveId.charAt(0).toUpperCase() + sidebarActiveId.slice(1)}</Heading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: '1 1 200px', minWidth: 150 }}>
                <StatCard label="Revenue" value="$12,450" change={8.2} color="var(--brand-primary)" />
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 150 }}>
                <StatCard label="Orders" value="356" change={-2.4} color="var(--success)" />
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 150 }}>
                <StatCard label="Customers" value="1,205" change={12.5} color="var(--warning)" />
              </div>
            </div>
          </VStack>
        </div>
      </div>
    </div>
  )
}

const appShellCode = `<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
  <Navbar
    logo={<span style={{ fontWeight: 700 }}>My Product</span>}
    items={navItems}
    activeId={navActiveId}
    onNavigate={setNavActiveId}
    showSearch
    actions={
      <HStack gap="sm">
        <IconButton icon={<Alert20Regular />} />
        <Avatar name="John Doe" size="sm" />
      </HStack>
    }
    sticky={false}
  />
  <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
    <AppSidebar
      sections={sections}
      activeId={sidebarActiveId}
      onNavigate={setSidebarActiveId}
      showHeader={false}
      height="100%"
    />
    <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
      {/* Main content */}
    </div>
  </div>
</div>`

// ============ SETTINGS BLOCKS ============

function SettingsProfileBlock() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <Card padding="lg">
        <VStack gap="lg">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Avatar name="John Doe" size="lg" />
            <VStack gap="xs" style={{ flex: '1 1 200px', minWidth: 0 }}>
              <Heading level={3}>John Doe</Heading>
              <Text color="secondary">john@example.com</Text>
            </VStack>
            <Button variant="secondary">Change photo</Button>
          </div>

          <Divider />

          <Grid columns={{ xs: 1, sm: 2 }} gap="md">
            <Input label="First name" defaultValue="John" />
            <Input label="Last name" defaultValue="Doe" />
            <Input label="Email" type="email" defaultValue="john@example.com" />
            <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
          </Grid>

          <HStack gap="md" style={{ justifyContent: 'flex-end' }}>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save changes</Button>
          </HStack>
        </VStack>
      </Card>
    </div>
  )
}

const settingsProfileCode = `<Card padding="lg">
  <VStack gap="lg">
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Avatar name="John Doe" size="lg" />
      <VStack gap="xs" style={{ flex: '1 1 200px', minWidth: 0 }}>
        <Heading level={3}>John Doe</Heading>
        <Text color="secondary">john@example.com</Text>
      </VStack>
      <Button variant="secondary">Change photo</Button>
    </div>

    <Divider />

    <Grid columns={{ xs: 1, sm: 2 }} gap="md">
      <Input label="First name" defaultValue="John" />
      <Input label="Last name" defaultValue="Doe" />
      <Input label="Email" type="email" defaultValue="john@example.com" />
      <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
    </Grid>

    <HStack gap="md" style={{ justifyContent: 'flex-end' }}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </HStack>
  </VStack>
</Card>`

function SettingsNotificationsBlock() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [digest, setDigest] = useState(false)

  return (
    <div style={{ padding: '1.5rem' }}>
      <Card padding="lg">
        <VStack gap="lg">
          <VStack gap="sm">
            <Heading level={3}>Notifications</Heading>
            <Text color="secondary">Manage how you receive notifications</Text>
          </VStack>

          <Divider />

          <VStack gap="md">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
                <Text weight="medium">Email notifications</Text>
                <Text size="sm" color="muted">Receive email about your account activity</Text>
              </VStack>
              <Switch checked={emailNotif} onChange={setEmailNotif} />
            </div>

            <Divider />

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
                <Text weight="medium">Push notifications</Text>
                <Text size="sm" color="muted">Receive push notifications on your devices</Text>
              </VStack>
              <Switch checked={pushNotif} onChange={setPushNotif} />
            </div>

            <Divider />

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
                <Text weight="medium">Marketing emails</Text>
                <Text size="sm" color="muted">Receive emails about new features and updates</Text>
              </VStack>
              <Switch checked={marketing} onChange={setMarketing} />
            </div>

            <Divider />

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
                <Text weight="medium">Weekly digest</Text>
                <Text size="sm" color="muted">Get a weekly summary of your activity</Text>
              </VStack>
              <Switch checked={digest} onChange={setDigest} />
            </div>
          </VStack>
        </VStack>
      </Card>
    </div>
  )
}

const settingsNotificationsCode = `const [emailNotif, setEmailNotif] = useState(true)
const [pushNotif, setPushNotif] = useState(true)

<Card padding="lg">
  <VStack gap="lg">
    <VStack gap="sm">
      <Heading level={3}>Notifications</Heading>
      <Text color="secondary">Manage how you receive notifications</Text>
    </VStack>

    <Divider />

    <VStack gap="md">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <VStack gap="xs" style={{ flex: '1 1 250px', minWidth: 0 }}>
          <Text weight="medium">Email notifications</Text>
          <Text size="sm" color="muted">Receive email about your account activity</Text>
        </VStack>
        <Switch checked={emailNotif} onChange={setEmailNotif} />
      </div>

      <Divider />

      {/* Repeat for other settings */}
    </VStack>
  </VStack>
</Card>`

// ============ BLOCK CATEGORIES ============

const blockCategories = [
  {
    id: 'authentication',
    label: 'Authentication',
    icon: <LockClosed20Regular />,
    blocks: [
      { id: 'login', title: 'Login Form', description: 'Simple login form with email and password', component: LoginBlock, code: loginCode },
      { id: 'register', title: 'Register Form', description: 'User registration with name, email, and password', component: RegisterBlock, code: registerCode },
      { id: 'otp', title: 'OTP Verification', description: '6-digit code verification form', component: OTPBlock, code: otpCode }
    ]
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <ChartMultiple20Regular />,
    blocks: [
      { id: 'overview', title: 'Full Dashboard', description: 'Complete dashboard with stats, charts, tables and quick actions', component: DashboardOverviewBlock, code: dashboardOverviewCode },
      { id: 'activity', title: 'Activity Feed', description: 'Recent activity list with avatars', component: DashboardActivityBlock, code: dashboardActivityCode }
    ]
  },
  {
    id: 'charts',
    label: 'Charts',
    icon: <DataBarVertical20Regular />,
    blocks: [
      { id: 'overview', title: 'Charts Overview', description: 'Bar chart and donut chart side by side', component: ChartsOverviewBlock, code: chartsOverviewCode },
      { id: 'line', title: 'Line Chart', description: 'Weekly performance line chart', component: ChartsLineBlock, code: chartsLineCode },
      { id: 'progress', title: 'Progress Rings', description: 'Multiple progress indicators', component: ChartsProgressBlock, code: chartsProgressCode }
    ]
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: <Navigation20Regular />,
    blocks: [
      { id: 'header', title: 'Header Navigation', description: 'Full navbar with logo, links, dropdowns and actions', component: HeaderNavBlock, code: headerNavCode },
      { id: 'appshell', title: 'App Shell', description: 'Complete layout with navbar, sidebar and content area', component: AppShellBlock, code: appShellCode },
      { id: 'sidebar', title: 'App Sidebar', description: 'Sidebar navigation with sections', component: SidebarBlock, code: sidebarCode }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings20Regular />,
    blocks: [
      { id: 'profile', title: 'Profile Settings', description: 'User profile editing form', component: SettingsProfileBlock, code: settingsProfileCode },
      { id: 'notifications', title: 'Notification Settings', description: 'Toggle switches for notifications', component: SettingsNotificationsBlock, code: settingsNotificationsCode }
    ]
  }
]

export function TemplatePage() {
  const [activeCategory, setActiveCategory] = useState('authentication')
  const [isRealMobile, setIsRealMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsRealMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentCategory = blockCategories.find(c => c.id === activeCategory)

  return (
    <div style={{ backgroundColor: isRealMobile ? 'var(--bg-secondary)' : 'var(--bg-primary)', minHeight: '100vh' }}>
      <section style={{
        padding: '3rem 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <Container padding={{ xs: '0.5rem', sm: '1rem' }}>
          <Animate type="fadeIn">
            <VStack gap="md" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <HStack gap="sm" style={{ justifyContent: 'center' }}>
                <Grid20Regular style={{ color: 'var(--brand-primary)', fontSize: 24 }} />
                <Heading level={1}>Blocks</Heading>
              </HStack>
              <Text size="lg" color="secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
                Pre-built UI blocks ready to copy and paste into your project.
                Each block is fully responsive and built with Forge components.
              </Text>
            </VStack>
          </Animate>

          <Animate type="slideInUp" delay={100}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              {blockCategories.map((category) => {
                const isActive = activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      background: isActive
                        ? 'var(--brand-primary)'
                        : 'var(--bg-secondary)',
                      border: isActive ? 'none' : '1px solid var(--border-color)',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: isActive ? 'white' : 'var(--text-primary)',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      opacity: isActive ? 1 : 0.7
                    }}>
                      {category.icon}
                    </span>
                    <span>{category.label}</span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '1.25rem',
                      height: '1.25rem',
                      padding: '0 0.375rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)',
                      color: isActive ? 'white' : 'var(--text-muted)'
                    }}>
                      {category.blocks.length}
                    </span>
                  </button>
                )
              })}
            </div>
          </Animate>
        </Container>
      </section>

      <section style={{ padding: '2rem 0' }}>
        <Container padding={{ xs: '0.5rem', sm: '1rem' }}>
          <Animate type="fadeIn" delay={200}>
            <VStack gap="xl">
              {currentCategory?.blocks.map((block) => (
                <BlockPreview
                  key={block.id}
                  title={block.title}
                  description={block.description}
                  code={block.code}
                >
                  <block.component />
                </BlockPreview>
              ))}
            </VStack>
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
