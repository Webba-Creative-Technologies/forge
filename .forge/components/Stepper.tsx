import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { Checkmark16Regular } from '@fluentui/react-icons'
import { Button } from './Button'
import { useIsMobile } from '../hooks/useResponsive'

// ============================================
// STEP CIRCLE (internal component with animations)
// ============================================
interface StepCircleProps {
  index: number
  isActive: boolean
  completed: boolean
  icon?: ReactNode
  color: string
  size?: number
  allowClick: boolean
  onClick: () => void
  animationDelay?: number
}

function StepCircle({ index, isActive, completed, icon, color, size = 36, allowClick, onClick, animationDelay = 0 }: StepCircleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={!allowClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="animate-scaleIn"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'backwards',
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: completed ? color : isActive ? `${color}22` : 'var(--bg-tertiary)',
        color: completed ? 'white' : isActive ? color : 'var(--text-muted)',
        border: isActive ? `2px solid ${color}` : '2px solid transparent',
        fontSize: size > 32 ? '0.875rem' : '0.8125rem',
        fontWeight: 600,
        cursor: allowClick ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        transform: isPressed ? 'scale(0.92)' : isHovered && allowClick ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isActive
          ? `0 0 0 4px ${color}22`
          : isHovered && allowClick
            ? '0 4px 12px rgba(0, 0, 0, 0.15)'
            : 'none'
      }}
    >
      {completed ? (
        <span className="animate-scaleIn" style={{ display: 'flex' }}>
          <Checkmark16Regular />
        </span>
      ) : (
        icon || index + 1
      )}
    </button>
  )
}

// ============================================
// TYPES
// ============================================
export interface StepItem {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  optional?: boolean
}

// ============================================
// STEPPER CONTEXT
// ============================================
interface StepperContextValue {
  currentStep: number
  totalSteps: number
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  isCompleted: (step: number) => boolean
  orientation: 'horizontal' | 'vertical'
  variant: 'default' | 'simple' | 'dots'
}

const StepperContext = createContext<StepperContextValue | null>(null)

export function useStepper() {
  const context = useContext(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a Stepper')
  }
  return context
}

// ============================================
// STEPPER
// ============================================
interface StepperProps {
  steps: StepItem[]
  currentStep?: number
  onStepChange?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'simple' | 'dots'
  allowClickNavigation?: boolean
  color?: string
  children?: ReactNode
}

export function Stepper({
  steps,
  currentStep: controlledStep,
  onStepChange,
  orientation = 'horizontal',
  variant = 'default',
  allowClickNavigation = true,
  color = 'var(--brand-primary)',
  children
}: StepperProps) {
  const isMobile = useIsMobile()
  const [internalStep, setInternalStep] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const currentStep = controlledStep ?? internalStep

  // Force vertical on mobile for default variant (has labels that overflow)
  const effectiveOrientation = isMobile && variant === 'default' ? 'vertical' : orientation
  // Smaller circles on mobile
  const circleSize = isMobile ? 32 : 36
  const simpleCircleSize = isMobile ? 28 : 32

  // Animation d'entrée progressive des lignes
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const goToStep = (step: number) => {
    const clampedStep = Math.max(0, Math.min(step, steps.length - 1))
    if (onStepChange) {
      onStepChange(clampedStep)
    } else {
      setInternalStep(clampedStep)
    }
  }

  const nextStep = () => goToStep(currentStep + 1)
  const prevStep = () => goToStep(currentStep - 1)
  const isCompleted = (step: number) => step < currentStep

  const contextValue: StepperContextValue = {
    currentStep,
    totalSteps: steps.length,
    goToStep,
    nextStep,
    prevStep,
    isCompleted,
    orientation,
    variant
  }

  // Dots variant
  if (variant === 'dots') {
    return (
      <StepperContext.Provider value={contextValue}>
        <div
          className="animate-fadeIn"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Dots indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {steps.map((_, index) => {
              const isActive = index === currentStep
              const completed = index < currentStep
              const [hovered, setHovered] = useState(false)

              return (
                <button
                  key={index}
                  onClick={() => allowClickNavigation && goToStep(index)}
                  disabled={!allowClickNavigation}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="animate-scaleIn"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                    width: isActive ? 24 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: completed || isActive ? color : 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: allowClickNavigation ? 'pointer' : 'default',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0,
                    boxShadow: isActive ? `0 0 8px ${color}66` : 'none',
                    opacity: hovered && allowClickNavigation && !isActive ? 0.7 : 1
                  }}
                />
              )
            })}
          </div>

          {/* Content */}
          {children}
        </div>
      </StepperContext.Provider>
    )
  }

  // Simple variant (numbers only)
  if (variant === 'simple') {
    return (
      <StepperContext.Provider value={contextValue}>
        <div className="animate-fadeIn" style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'row' : 'column',
          gap: isMobile ? '1rem' : '1.5rem'
        }}>
          {/* Steps */}
          <div style={{
            display: 'flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            alignItems: 'center',
            gap: orientation === 'vertical' ? '0' : '0'
          }}>
            {steps.map((step, index) => {
              const isActive = index === currentStep
              const completed = isCompleted(index)
              const isLast = index === steps.length - 1

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0'
                  }}
                >
                  {/* Number/Check */}
                  <StepCircle
                    index={index}
                    isActive={isActive}
                    completed={completed}
                    color={color}
                    size={simpleCircleSize}
                    allowClick={allowClickNavigation}
                    onClick={() => allowClickNavigation && goToStep(index)}
                    animationDelay={index * 80}
                  />

                  {/* Connector line */}
                  {!isLast && (
                    <div style={{
                      position: 'relative',
                      width: orientation === 'vertical' ? 2 : (isMobile ? 24 : 40),
                      height: orientation === 'vertical' ? (isMobile ? 24 : 40) : 2,
                      backgroundColor: 'var(--bg-tertiary)',
                      marginLeft: orientation === 'horizontal' ? '0.5rem' : undefined,
                      marginRight: orientation === 'horizontal' ? '0.5rem' : undefined,
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: hasAnimated && completed ? '100%' : '0%',
                        backgroundColor: color,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: `${index * 120}ms`,
                        borderRadius: 'var(--radius-xs)'
                      }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Content */}
          {children}
        </div>
      </StepperContext.Provider>
    )
  }

  // Default variant (full labels)
  return (
    <StepperContext.Provider value={contextValue}>
      <div className="animate-fadeIn" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '1.5rem' : '2rem'
      }}>
        {/* Steps header */}
        <div style={{
          display: 'flex',
          flexDirection: effectiveOrientation === 'vertical' ? 'column' : 'row',
          gap: effectiveOrientation === 'vertical' ? '0' : '0'
        }}>
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const completed = isCompleted(index)
            const isLast = index === steps.length - 1

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: effectiveOrientation === 'vertical' ? 'row' : 'column',
                  alignItems: effectiveOrientation === 'vertical' ? 'flex-start' : 'flex-start',
                  flex: effectiveOrientation === 'horizontal' && !isLast ? 1 : undefined,
                  gap: effectiveOrientation === 'vertical' ? '1rem' : '0.5rem'
                }}
              >
                {/* Step indicator row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: effectiveOrientation === 'horizontal' ? '100%' : undefined,
                  flexDirection: effectiveOrientation === 'vertical' ? 'column' : 'row'
                }}>
                  {/* Circle */}
                  <StepCircle
                    index={index}
                    isActive={isActive}
                    completed={completed}
                    icon={step.icon}
                    color={color}
                    size={circleSize}
                    allowClick={allowClickNavigation}
                    onClick={() => allowClickNavigation && goToStep(index)}
                    animationDelay={index * 80}
                  />

                  {/* Connector */}
                  {!isLast && (
                    <div style={{
                      position: 'relative',
                      flex: effectiveOrientation === 'horizontal' ? 1 : undefined,
                      height: effectiveOrientation === 'vertical' ? (isMobile ? 32 : 40) : 2,
                      width: effectiveOrientation === 'vertical' ? 2 : undefined,
                      minWidth: effectiveOrientation === 'horizontal' ? 24 : undefined,
                      backgroundColor: 'var(--border-subtle)',
                      marginLeft: effectiveOrientation === 'horizontal' ? '0.75rem' : undefined,
                      marginRight: effectiveOrientation === 'horizontal' ? '0.75rem' : undefined,
                      marginTop: effectiveOrientation === 'vertical' ? '0.5rem' : undefined,
                      marginBottom: effectiveOrientation === 'vertical' ? '0.5rem' : undefined,
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden'
                    }}>
                      {/* Animated fill */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: hasAnimated && completed ? '100%' : '0%',
                        backgroundColor: color,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: `${index * 100}ms`,
                        borderRadius: 'var(--radius-xs)'
                      }} />
                    </div>
                  )}
                </div>

                {/* Labels */}
                <div style={{
                  textAlign: 'left',
                  flex: effectiveOrientation === 'vertical' ? 1 : undefined,
                  paddingRight: effectiveOrientation === 'horizontal' && !isLast ? '1rem' : 0
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive || completed ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'all 0.25s ease',
                    transform: isActive ? 'translateX(0)' : 'translateX(0)'
                  }}>
                    {step.title}
                    {step.optional && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        color: 'var(--text-muted)',
                        marginLeft: '0.375rem'
                      }}>
                        (optionnel)
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: 2,
                      opacity: isActive ? 1 : 0.7,
                      transition: 'opacity 0.25s ease'
                    }}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Content */}
        {children}
      </div>
    </StepperContext.Provider>
  )
}

// ============================================
// STEP CONTENT
// ============================================
interface StepContentProps {
  step: number
  children: ReactNode
}

export function StepContent({ step, children }: StepContentProps) {
  const { currentStep } = useStepper()

  if (step !== currentStep) return null

  return <div>{children}</div>
}

// ============================================
// STEP ACTIONS (navigation buttons)
// ============================================
interface StepActionsProps {
  showPrev?: boolean
  showNext?: boolean
  showFinish?: boolean
  prevLabel?: string
  nextLabel?: string
  finishLabel?: string
  onFinish?: () => void
  isNextDisabled?: boolean
}

export function StepActions({
  showPrev = true,
  showNext = true,
  showFinish = true,
  prevLabel = 'Précédent',
  nextLabel = 'Suivant',
  finishLabel = 'Terminer',
  onFinish,
  isNextDisabled = false
}: StepActionsProps) {
  const { currentStep, totalSteps, nextStep, prevStep } = useStepper()
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      marginTop: '1.5rem'
    }}>
      {/* Prev button */}
      <div>
        {showPrev && !isFirst && (
          <Button variant="secondary" size="md" onClick={prevStep}>
            {prevLabel}
          </Button>
        )}
      </div>

      {/* Next/Finish button */}
      <div>
        {isLast ? (
          showFinish && (
            <Button variant="primary" size="md" onClick={onFinish}>
              {finishLabel}
            </Button>
          )
        ) : (
          showNext && (
            <Button variant="primary" size="md" onClick={nextStep} disabled={isNextDisabled}>
              {nextLabel}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
