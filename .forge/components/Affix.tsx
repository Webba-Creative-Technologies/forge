import { useState, useEffect, useRef, ReactNode } from 'react'

// ============================================
// AFFIX (Sticky on scroll)
// ============================================
interface AffixProps {
  children: ReactNode
  offsetTop?: number
  offsetBottom?: number
  position?: 'top' | 'bottom'
  onChange?: (affixed: boolean) => void
  zIndex?: number
  className?: string
  style?: React.CSSProperties
}

export function Affix({
  children,
  offsetTop = 0,
  offsetBottom,
  position = 'top',
  onChange,
  zIndex = 100,
  className,
  style
}: AffixProps) {
  const [affixed, setAffixed] = useState(false)
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>({})
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current || !contentRef.current) return

      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let shouldAffix = false

      if (position === 'top') {
        shouldAffix = wrapperRect.top <= offsetTop
      } else if (offsetBottom !== undefined) {
        const viewportHeight = window.innerHeight
        shouldAffix = wrapperRect.bottom >= viewportHeight - offsetBottom
      }

      if (shouldAffix !== affixed) {
        setAffixed(shouldAffix)
        onChange?.(shouldAffix)

        if (shouldAffix) {
          // Set placeholder to maintain layout
          setPlaceholderStyle({
            width: contentRect.width,
            height: contentRect.height
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [affixed, offsetTop, offsetBottom, position, onChange])

  const affixStyle: React.CSSProperties = affixed
    ? {
        position: 'fixed',
        [position]: position === 'top' ? offsetTop : offsetBottom,
        left: wrapperRef.current?.getBoundingClientRect().left,
        width: wrapperRef.current?.getBoundingClientRect().width,
        zIndex
      }
    : {}

  return (
    <div ref={wrapperRef} className={className} style={style}>
      {/* Placeholder to maintain layout when affixed */}
      {affixed && <div style={placeholderStyle} />}

      <div
        ref={contentRef}
        style={{
          ...affixStyle,
          transition: 'none'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ============================================
// STICKY HEADER (common use case)
// ============================================
interface StickyHeaderProps {
  children: ReactNode
  offset?: number
  shadow?: boolean
  blur?: boolean
  className?: string
  style?: React.CSSProperties
}

export function StickyHeader({
  children,
  offset = 0,
  shadow = true,
  blur = true,
  className,
  style
}: StickyHeaderProps) {
  const [isStuck, setIsStuck] = useState(false)

  return (
    <Affix
      offsetTop={offset}
      onChange={setIsStuck}
      className={className}
      style={style}
    >
      <div
        style={{
          backgroundColor: blur ? 'rgba(var(--bg-primary-rgb), 0.8)' : 'var(--bg-primary)',
          backdropFilter: blur && isStuck ? 'blur(12px)' : 'none',
          boxShadow: shadow && isStuck ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'box-shadow 0.2s ease, backdrop-filter 0.2s ease'
        }}
      >
        {children}
      </div>
    </Affix>
  )
}

// ============================================
// STICKY SIDEBAR (for side navigation)
// ============================================
interface StickySidebarProps {
  children: ReactNode
  topOffset?: number
  bottomOffset?: number
  className?: string
  style?: React.CSSProperties
}

export function StickySidebar({
  children,
  topOffset = 80,
  bottomOffset = 24,
  className,
  style
}: StickySidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return

      const sidebar = sidebarRef.current
      const parent = sidebar.parentElement
      if (!parent) return

      const parentRect = parent.getBoundingClientRect()
      const sidebarHeight = sidebar.offsetHeight
      const viewportHeight = window.innerHeight
      const availableHeight = viewportHeight - topOffset - bottomOffset

      // Sidebar fits in viewport
      if (sidebarHeight <= availableHeight) {
        if (parentRect.top <= topOffset) {
          setSidebarStyle({
            position: 'sticky',
            top: topOffset
          })
        } else {
          setSidebarStyle({})
        }
      } else {
        // Sidebar is taller than viewport - complex scrolling behavior
        const scrollY = window.scrollY
        const parentTop = parent.offsetTop
        const maxScroll = parentTop + parent.offsetHeight - sidebarHeight - bottomOffset

        if (scrollY < parentTop) {
          setSidebarStyle({})
        } else if (scrollY > maxScroll) {
          setSidebarStyle({
            position: 'relative',
            top: parent.offsetHeight - sidebarHeight - bottomOffset
          })
        } else {
          setSidebarStyle({
            position: 'sticky',
            top: topOffset
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [topOffset, bottomOffset])

  return (
    <div
      ref={sidebarRef}
      className={className}
      style={{
        ...sidebarStyle,
        ...style
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// SCROLL INDICATOR (progress bar)
// ============================================
interface ScrollIndicatorProps {
  color?: string
  height?: number
  position?: 'top' | 'bottom'
  zIndex?: number
  className?: string
  style?: React.CSSProperties
}

export function ScrollIndicator({
  color = 'var(--brand-primary)',
  height = 3,
  position = 'top',
  zIndex = 1000,
  className,
  style
}: ScrollIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex,
        ...style
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: color,
          transition: 'width 0.1s linear'
        }}
      />
    </div>
  )
}
