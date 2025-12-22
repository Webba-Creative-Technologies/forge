// ================================
// Forge Design System - Shared Types
// ================================

// Base entity interface
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'archived' | 'draft'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

// Color definitions
export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type ProjectColor =
  | '#A35BFF'  // Purple
  | '#FD9173'  // Orange
  | '#3b82f6'  // Blue
  | '#10b981'  // Green
  | '#ef4444'  // Red
  | '#f59e0b'  // Yellow
  | '#ec4899'  // Pink
  | '#14b8a6'  // Teal

// Size definitions
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Common component props
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
}

// Button variant type
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'

// Badge variant type
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'

// Modal types
export interface ModalState {
  open: boolean
  data?: unknown
}

// Search result type
export interface SearchResult {
  id: string
  type: string
  title: string
  subtitle?: string
  icon?: React.ReactNode
  route?: string
  keywords?: string[]
  aliases?: string[]  // Common names from other frameworks (e.g., "Alert" for Banner)
}

// AI Response types
export interface AIAction {
  type: 'navigate' | 'create' | 'info' | 'action' | 'multi'
  target?: string
  data?: Record<string, unknown>
  message: string
  results?: SearchResult[]
  actions?: AIAction[]
}

// Form field types
export interface FormField<T = string> {
  value: T
  error?: string
  touched?: boolean
}

// Pagination types
export interface Pagination {
  page: number
  pageSize: number
  total: number
}

// Sort types
export interface Sort {
  field: string
  direction: 'asc' | 'desc'
}

// Filter types
export interface Filter {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in'
  value: unknown
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  width?: string | number
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

// Select option
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Menu item
export interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
}

// Toast notification
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// Calendar event
export interface CalendarEvent {
  id: string
  title: string
  start: Date | string
  end?: Date | string
  allDay?: boolean
  color?: string
  type?: 'task' | 'event' | 'invoice' | 'expense'
}

// Kanban card
export interface KanbanCardType {
  id: string
  title: string
  columnId: string
  order: number
  tags?: string[]
  assignee?: string
  dueDate?: string
}

// Kanban column
export interface KanbanColumnDef {
  id: string
  title: string
  color?: string
  order: number
}
