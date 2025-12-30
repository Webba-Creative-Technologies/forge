import { useState, useEffect, useCallback, ReactNode } from 'react'
import { Dismiss20Regular, ArrowLeft20Regular, ArrowRight20Regular } from '@fluentui/react-icons'
import { Z_INDEX, SHADOWS } from '../constants'

// ============================================
// TYPES
// ============================================
export interface TourStep {
  target: string // CSS selector
  title: string
  content: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  spotlightPadding?: number
  disableInteraction?: boolean
}

// ============================================
// TOUR
// ============================================
interface TourProps {
  steps: TourStep[]
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  startAt?: number
  showSkip?: boolean
  nextLabel?: string
  doneLabel?: string
  skipLabel?: string
}

const TOOLTIP_WIDTH = 320
const TOOLTIP_MARGIN = 16
const TOOLTIP_OFFSET = 12

export function Tour({
  steps,
  isOpen,
  onClose,
  onComplete,
  startAt = 0,
  showSkip = true,
  nextLabel = 'Next',
  doneLabel = 'Done',
  skipLabel = 'Skip'
}: TourProps) {
  const [currentStep, setCurrentStep] = useState(startAt)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const updateTargetRect = useCallback(() => {
    if (!step) return
    const element = document.querySelector(step.target)
    if (element) {
      const rect = element.getBoundingClientRect()
      setTargetRect(rect)

      // Scroll into view if needed
      const isInViewport = rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth

      if (!isInViewport) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => {
          setTargetRect(element.getBoundingClientRect())
        }, 300)
      }
    }
  }, [step])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      updateTargetRect()

      const handleResize = () => updateTargetRect()
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize, true)

      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize, true)
      }
    } else {
      setIsVisible(false)
      document.body.style.overflow = ''
    }
  }, [isOpen, currentStep, updateTargetRect])

  const handleNext = () => {
    if (isLast) {
      onComplete?.()
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen || !step || !targetRect) return null

  const padding = step.spotlightPadding ?? 8
  const spotlightRect = {
    top: targetRect.top - padding,
    left: targetRect.left - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2
  }

  // Calculate best placement
  const tooltipPosition = calculateTooltipPosition(spotlightRect, step.placement || 'auto')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: Z_INDEX.tour,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }}
    >
      {/* Overlay with spotlight cutout */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={spotlightRect.left}
              y={spotlightRect.top}
              width={spotlightRect.width}
              height={spotlightRect.height}
              rx="8"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Spotlight border */}
      <div
        style={{
          position: 'absolute',
          top: spotlightRect.top,
          left: spotlightRect.left,
          width: spotlightRect.width,
          height: spotlightRect.height,
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 0 0 2px var(--brand-primary), 0 0 0 6px rgba(163, 91, 255, 0.2)',
          pointerEvents: step.disableInteraction ? 'auto' : 'none'
        }}
      />

      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          ...tooltipPosition,
          width: TOOLTIP_WIDTH,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: SHADOWS.elevation.popover,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1rem 0.75rem'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {step.title}
          </h3>
          <button
            onClick={handleSkip}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            className="interactive-icon"
          >
            <Dismiss20Regular style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '0 1rem 1rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5
        }}>
          {step.content}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {steps.length > 1 && steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{
                  width: index === currentStep ? 16 : 6,
                  height: 6,
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: index === currentStep ? 'var(--brand-primary)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  padding: 0
                }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showSkip && !isLast && (
              <button
                onClick={handleSkip}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                {skipLabel}
              </button>
            )}
            {!isFirst && (
              <button
                onClick={handlePrev}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft20Regular style={{ fontSize: 16 }} />
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {isLast ? doneLabel : nextLabel}
              {!isLast && <ArrowRight20Regular style={{ fontSize: 16 }} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateTooltipPosition(
  spotlight: { top: number; left: number; width: number; height: number },
  preferredPlacement: 'top' | 'bottom' | 'left' | 'right' | 'auto'
): React.CSSProperties {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const estimatedTooltipHeight = 220

  // Calculate available space in each direction
  const spaceTop = spotlight.top - TOOLTIP_MARGIN
  const spaceBottom = viewportHeight - (spotlight.top + spotlight.height) - TOOLTIP_MARGIN
  const spaceLeft = spotlight.left - TOOLTIP_MARGIN
  const spaceRight = viewportWidth - (spotlight.left + spotlight.width) - TOOLTIP_MARGIN

  // Determine best placement
  let placement = preferredPlacement
  if (placement === 'auto') {
    // Prefer bottom, then top, then right, then left
    if (spaceBottom >= estimatedTooltipHeight) {
      placement = 'bottom'
    } else if (spaceTop >= estimatedTooltipHeight) {
      placement = 'top'
    } else if (spaceRight >= TOOLTIP_WIDTH + TOOLTIP_MARGIN) {
      placement = 'right'
    } else if (spaceLeft >= TOOLTIP_WIDTH + TOOLTIP_MARGIN) {
      placement = 'left'
    } else {
      // Not enough space anywhere - pick the direction with most space
      const maxSpace = Math.max(spaceBottom, spaceTop, spaceRight, spaceLeft)
      if (maxSpace === spaceBottom) placement = 'bottom'
      else if (maxSpace === spaceTop) placement = 'top'
      else if (maxSpace === spaceRight) placement = 'right'
      else placement = 'left'
    }
  }

  // Calculate initial position based on placement
  let top: number
  let left: number

  switch (placement) {
    case 'top':
      top = spotlight.top - estimatedTooltipHeight - TOOLTIP_OFFSET
      left = spotlight.left + spotlight.width / 2 - TOOLTIP_WIDTH / 2
      break
    case 'bottom':
      top = spotlight.top + spotlight.height + TOOLTIP_OFFSET
      left = spotlight.left + spotlight.width / 2 - TOOLTIP_WIDTH / 2
      break
    case 'left':
      top = spotlight.top + spotlight.height / 2 - estimatedTooltipHeight / 2
      left = spotlight.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET
      break
    case 'right':
      top = spotlight.top + spotlight.height / 2 - estimatedTooltipHeight / 2
      left = spotlight.left + spotlight.width + TOOLTIP_OFFSET
      break
  }

  // Clamp to viewport bounds - always stay visible
  left = Math.max(TOOLTIP_MARGIN, Math.min(left, viewportWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN))
  top = Math.max(TOOLTIP_MARGIN, Math.min(top, viewportHeight - estimatedTooltipHeight - TOOLTIP_MARGIN))

  return { top, left }
}

// ============================================
// TOUR TOOLTIP STATIC (for documentation/preview)
// ============================================
interface TourTooltipStaticProps {
  title: string
  content: ReactNode
  currentStep?: number
  totalSteps?: number
  nextLabel?: string
  skipLabel?: string
  doneLabel?: string
  showSkip?: boolean
  isLast?: boolean
  isFirst?: boolean
}

export function TourTooltipStatic({
  title,
  content,
  currentStep = 0,
  totalSteps = 3,
  nextLabel = 'Next',
  skipLabel = 'Skip',
  doneLabel = 'Done',
  showSkip = true,
  isLast = false,
  isFirst = true
}: TourTooltipStaticProps) {
  return (
    <div
      style={{
        width: 320,
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: SHADOWS.elevation.modal,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1rem 0.75rem'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          {title}
        </h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          className="interactive-icon"
        >
          <Dismiss20Regular style={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: '0 1rem 1rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        {content}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {totalSteps > 1 && Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? 16 : 6,
                height: 6,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: index === currentStep ? 'var(--brand-primary)' : 'var(--border-color)',
                transition: 'all 0.15s ease'
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showSkip && !isLast && (
            <button
              style={{
                padding: '0.5rem 0.75rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              {skipLabel}
            </button>
          )}
          {!isFirst && (
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft20Regular style={{ fontSize: 16 }} />
            </button>
          )}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {isLast ? doneLabel : nextLabel}
            {!isLast && <ArrowRight20Regular style={{ fontSize: 16 }} />}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TOUR HOOK
// ============================================
export function useTour(key: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`tour-${key}`) === 'completed'
    }
    return false
  })

  const start = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const complete = useCallback(() => {
    setHasCompleted(true)
    localStorage.setItem(`tour-${key}`, 'completed')
    close()
  }, [key, close])

  const reset = useCallback(() => {
    setHasCompleted(false)
    localStorage.removeItem(`tour-${key}`)
  }, [key])

  return {
    isOpen,
    hasCompleted,
    start,
    close,
    complete,
    reset
  }
}
