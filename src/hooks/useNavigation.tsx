import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Types pour les items de navigation
export interface NavItem {
  id: string
  icon?: ReactNode
  label: string
  badge?: number | string
  onClick?: () => void
  children?: NavItem[]
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

interface NavigationContextType {
  // Navbar registration
  hasNavbar: boolean
  registerNavbar: () => void
  unregisterNavbar: () => void

  // Sidebar items for navbar menu
  sidebarSections: NavSection[]
  sidebarActiveId?: string
  sidebarLogo?: ReactNode
  registerSidebar: (sections: NavSection[], activeId?: string, logo?: ReactNode) => void
  unregisterSidebar: () => void

  // Sidebar visibility (to prevent navbar from showing sidebar items when sidebar is visible)
  sidebarVisible: boolean
  setSidebarVisible: (visible: boolean) => void

  // Mobile menu state (shared between navbar and sidebar)
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Sidebar navigation handler
  onSidebarNavigate?: (id: string) => void
  setOnSidebarNavigate: (handler: ((id: string) => void) | undefined) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [hasNavbar, setHasNavbar] = useState(false)
  const [sidebarSections, setSidebarSections] = useState<NavSection[]>([])
  const [sidebarActiveId, setSidebarActiveId] = useState<string>()
  const [sidebarLogo, setSidebarLogo] = useState<ReactNode>()
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [onSidebarNavigate, setOnSidebarNavigateState] = useState<((id: string) => void) | undefined>()

  const registerNavbar = useCallback(() => {
    setHasNavbar(true)
  }, [])

  const unregisterNavbar = useCallback(() => {
    setHasNavbar(false)
  }, [])

  const registerSidebar = useCallback((sections: NavSection[], activeId?: string, logo?: ReactNode) => {
    setSidebarSections(sections)
    setSidebarActiveId(activeId)
    setSidebarLogo(logo)
  }, [])

  const unregisterSidebar = useCallback(() => {
    setSidebarSections([])
    setSidebarActiveId(undefined)
    setSidebarLogo(undefined)
  }, [])

  const setOnSidebarNavigate = useCallback((handler: ((id: string) => void) | undefined) => {
    setOnSidebarNavigateState(() => handler)
  }, [])

  return (
    <NavigationContext.Provider value={{
      hasNavbar,
      registerNavbar,
      unregisterNavbar,
      sidebarSections,
      sidebarActiveId,
      sidebarLogo,
      registerSidebar,
      unregisterSidebar,
      sidebarVisible,
      setSidebarVisible,
      mobileMenuOpen,
      setMobileMenuOpen,
      onSidebarNavigate,
      setOnSidebarNavigate
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    // Return a fallback for standalone usage
    return {
      hasNavbar: false,
      registerNavbar: () => {},
      unregisterNavbar: () => {},
      sidebarSections: [],
      sidebarActiveId: undefined,
      sidebarLogo: undefined,
      registerSidebar: () => {},
      unregisterSidebar: () => {},
      sidebarVisible: false,
      setSidebarVisible: () => {},
      mobileMenuOpen: false,
      setMobileMenuOpen: () => {},
      onSidebarNavigate: undefined,
      setOnSidebarNavigate: () => {}
    }
  }
  return context
}
