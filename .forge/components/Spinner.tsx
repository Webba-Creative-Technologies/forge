import * as React from 'react'
import { useIsMobile } from '../hooks/useResponsive'

// ============================================
// WEBBA LOADER (Filled W with progressive reveal)
// ============================================
interface WebbaLoaderProps {
  size?: number
  color?: string
  duration?: number
  complete?: boolean // Show full W without animation
}

export function WebbaLoader({
  size = 40,
  color = 'currentColor',
  duration = 2,
  complete = false
}: WebbaLoaderProps) {
  const uniqueId = React.useId()
  const svgRef = React.useRef<SVGSVGElement>(null)

  // Restart animations when component mounts
  React.useEffect(() => {
    if (complete) return
    // Wait for next frame to ensure SVG is fully rendered
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (svgRef.current) {
          const animates = svgRef.current.querySelectorAll('animate')
          animates.forEach(anim => {
            (anim as SVGAnimateElement).beginElement?.()
          })
        }
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [complete])

  // Static W when complete
  if (complete) {
    return (
      <svg
        width={size}
        height={size * 0.9}
        viewBox="0 0 40 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.685 18.0072L14.2213 27.9046L5.69913 0.973395L5.62946 0.750763H0L10.7395 34.6926L10.8106 34.9153H17.579L23.4947 18.0072H17.685Z"
          fill={color}
        />
        <path
          d="M39.1643 0.750763H33.5364L22.859 34.5003L22.7272 34.9153H28.3537L39.0325 1.16574L39.1643 0.750763Z"
          fill={color}
        />
      </svg>
    )
  }

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size * 0.9}
      viewBox="0 0 40 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Clip for left part - appear left-to-right, disappear right-to-left (after right) */}
        <clipPath id={`${uniqueId}-clip-left`}>
          <rect y="0" height="36" x="-5">
            <animate
              attributeName="width"
              values="0;0;30;30;30;0;0"
              keyTimes="0;0.05;0.25;0.45;0.7;0.9;1"
              dur={`${duration}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0 0 1 1;0.4 0 0.2 1;0 0 1 1"
              begin="indefinite"
            />
          </rect>
        </clipPath>

        {/* Clip for right part - appear left-to-right, disappear right-to-left (first) */}
        <clipPath id={`${uniqueId}-clip-right`}>
          <rect x="22" y="0" height="36" width="0">
            <animate
              attributeName="width"
              values="0;0;18;18;0;0"
              keyTimes="0;0.25;0.4;0.5;0.65;1"
              dur={`${duration}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1;0 0 1 1"
              begin="indefinite"
            />
          </rect>
        </clipPath>
      </defs>

      {/* Left part of W */}
      <path
        d="M17.685 18.0072L14.2213 27.9046L5.69913 0.973395L5.62946 0.750763H0L10.7395 34.6926L10.8106 34.9153H17.579L23.4947 18.0072H17.685Z"
        fill={color}
        clipPath={`url(#${uniqueId}-clip-left)`}
      />

      {/* Right part of W */}
      <path
        d="M39.1643 0.750763H33.5364L22.859 34.5003L22.7272 34.9153H28.3537L39.0325 1.16574L39.1643 0.750763Z"
        fill={color}
        clipPath={`url(#${uniqueId}-clip-right)`}
      />
    </svg>
  )
}

// ============================================
// WEBBA THINKING (with label)
// ============================================
interface WebbaThinkingProps {
  size?: number
  color?: string
  label?: string
}

export function WebbaThinking({
  size = 32,
  color = 'currentColor',
  label
}: WebbaThinkingProps) {
  return (
    <span
      role="status"
      aria-label={label || 'Chargement'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      <WebbaLoader size={size} color={color} />
      {label && (
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          {label}
        </span>
      )}
    </span>
  )
}

// ============================================
// SPINNER
// ============================================

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
  thickness?: number
  label?: string
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32
}

export function Spinner({
  size = 'md',
  color = 'var(--brand-primary)',
  thickness = 2,
  label
}: SpinnerProps) {
  const dimension = sizeMap[size]

  return (
    <span
      role="status"
      aria-label={label || 'Chargement'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        style={{
          animation: 'spin 0.8s linear infinite'
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeOpacity={0.2}
          fill="none"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {label && (
        <span style={{
          fontSize: size === 'xs' ? '0.6875rem' : size === 'sm' ? '0.75rem' : '0.8125rem',
          color: 'var(--text-secondary)'
        }}>
          {label}
        </span>
      )}
    </span>
  )
}

// ============================================
// LOADING OVERLAY
// ============================================
interface LoadingOverlayProps {
  visible: boolean
  label?: string
  blur?: boolean
}

export function LoadingOverlay({ visible, label, blur = true }: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      backgroundColor: blur ? 'rgba(0, 0, 0, 0.5)' : 'var(--bg-primary)',
      backdropFilter: blur ? 'blur(2px)' : undefined,
      borderRadius: 'inherit',
      zIndex: 10
    }}>
      <Spinner size="lg" />
      {label && (
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ============================================
// SPLASH SCREEN (Full screen loading)
// ============================================
interface SplashScreenProps {
  visible: boolean
  variant?: 'powered-by' | 'made-with' | 'built-with' | 'custom'
  brandName?: string
  brandLogo?: React.ReactNode
  customText?: string
  backgroundColor?: string
  textColor?: string
  onComplete?: () => void
  duration?: number
}

export function SplashScreen({
  visible,
  variant = 'powered-by',
  brandName = 'Webba',
  brandLogo,
  customText,
  backgroundColor = 'var(--bg-primary)',
  textColor = 'var(--text-primary)',
  onComplete,
  duration = 2500
}: SplashScreenProps) {
  const [show, setShow] = React.useState(visible)
  const [fadeOut, setFadeOut] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)
  const [animKey, setAnimKey] = React.useState(0)

  const revealTime = 1000 // Time to show full logo before fade
  const loadingTime = Math.max(duration - revealTime - 400, 1000) // Loading animation time

  React.useEffect(() => {
    if (visible) {
      setShow(true)
      setFadeOut(false)
      setRevealed(false)
      setAnimKey(k => k + 1)

      // Phase 1: Loading animation
      const revealTimer = setTimeout(() => {
        setRevealed(true)
      }, loadingTime)

      // Phase 2: Hold revealed state, then fade out
      const fadeTimer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setShow(false)
          onComplete?.()
        }, 400)
      }, loadingTime + revealTime)

      return () => {
        clearTimeout(revealTimer)
        clearTimeout(fadeTimer)
      }
    }
  }, [visible, loadingTime, revealTime, onComplete])

  const isMobile = useIsMobile()

  if (!show) return null

  const getText = () => {
    if (customText) return customText
    switch (variant) {
      case 'powered-by': return 'Powered by'
      case 'made-with': return 'Made with'
      case 'built-with': return 'Built with'
      default: return ''
    }
  }

  // Responsive sizes
  const logoSize = isMobile ? 56 : 72
  const labelSize = isMobile ? '0.75rem' : '0.875rem'
  const brandSize = isMobile ? '1.5rem' : '2rem'
  const gap = isMobile ? '0.75rem' : '1rem'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        padding: '1rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: revealed ? gap : '0',
          transition: 'gap 0.4s ease-out'
        }}
      >
        {/* W Logo - always present, same size */}
        <div>
          {brandLogo || (
            revealed
              ? <WebbaLoader size={logoSize} color={textColor} complete />
              : <WebbaLoader key={animKey} size={logoSize} color={textColor} />
          )}
        </div>

        {/* Brand text - slides in */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          pointerEvents: revealed ? 'auto' : 'none'
        }}>
          {getText() && (
            <span style={{
              fontSize: labelSize,
              color: 'var(--text-muted)',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {getText()}
            </span>
          )}
          <span style={{
            fontSize: brandSize,
            color: textColor,
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            {brandName}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// WEBBA LOGO REST (the "ebba" part as SVG)
// ============================================
function WebbaLogoRest({ size = 36, color = 'currentColor' }: { size?: number; color?: string }) {
  // "ebba" extracted from the full Webba logo SVG
  // Original viewBox was "0 0 147 36", ebba starts around x=37
  const scale = size / 36
  const width = 110 * scale // 147 - 37 = 110

  return (
    <svg
      width={width}
      height={size}
      viewBox="37 0 110 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 'e' */}
      <path d="M55.5391 10.4846C53.7701 9.49714 51.7119 8.99734 49.4219 8.99734C47.132 8.99734 44.942 9.53046 43.1079 10.583C41.2647 11.6372 39.8017 13.1396 38.7612 15.0494C37.7344 16.941 37.2134 19.1704 37.2134 21.6769V22.2373C37.2134 24.7105 37.7344 26.9247 38.7612 28.8163C39.8047 30.7307 41.2829 32.2361 43.1579 33.2902C45.0177 34.3307 47.1895 34.8608 49.6158 34.8684H54.3184C56.8612 34.8684 58.9301 32.7995 58.9301 30.2566V29.9371H49.7475C47.7272 29.9371 46.0264 29.3086 44.6936 28.0682C43.5426 27.011 42.8519 25.548 42.6354 23.72H61.2564V21.2059C61.2564 18.7599 60.749 16.5957 59.7494 14.7722C58.7362 12.9169 57.3201 11.4751 55.5391 10.4846ZM44.8132 15.5037C45.9915 14.4632 47.5424 13.9362 49.4219 13.9362C51.3014 13.9362 52.7887 14.4632 53.9518 15.5022C54.9393 16.3867 55.533 17.5407 55.7602 19.025H42.7898C43.1503 17.5559 43.8303 16.3715 44.8117 15.5052L44.8132 15.5037Z" fill={color}/>
      {/* first 'b' */}
      <path d="M84.1094 11.2449L84.1033 11.2419C82.8538 10.5315 81.4983 10.0651 80.0732 9.85607C79.4946 9.77428 78.8797 9.73188 78.2436 9.73188C78.1891 9.73188 78.1391 9.73491 78.0937 9.73945H74.4786C72.2295 9.73945 70.4 11.575 70.4 13.8302V14.6556H77.3243C79.4553 14.6571 81.1288 15.3144 82.4434 16.6638C83.7625 18.0163 84.4304 19.9443 84.4304 22.3963V22.8264C84.4304 25.3375 83.7807 27.2261 82.4434 28.5982C81.1273 29.9507 79.4356 30.608 77.2713 30.608C75.1071 30.608 73.3957 29.9295 72.0902 28.5907C70.7589 27.2594 70.1122 25.3753 70.1122 22.8264V0.500885H64.7599V34.8683H69.9941V32.0195C70.5787 32.7374 71.3223 33.3962 72.2507 34.0248C73.7273 35.0243 75.7432 35.5302 78.2436 35.5302C80.3534 35.5302 82.3132 35.0213 84.0685 34.0202C85.8011 33.0297 87.2157 31.5622 88.2728 29.6584C89.3405 27.7683 89.8585 25.5707 89.8585 22.9415V22.3175C89.8585 19.7398 89.339 17.4968 88.3152 15.6506C87.2853 13.7575 85.9101 12.3156 84.1094 11.2434V11.2449Z" fill={color}/>
      {/* second 'b' */}
      <path d="M113.017 11.2449L113.011 11.2419C111.761 10.5315 110.406 10.0651 108.98 9.85607C108.402 9.77428 107.787 9.73188 107.151 9.73188C107.096 9.73188 107.045 9.73491 107.001 9.73945H103.386C101.137 9.73945 99.3057 11.575 99.3057 13.8302V14.6556H106.232C108.362 14.6571 110.036 15.3144 111.351 16.6638C112.67 18.0163 113.338 19.9443 113.338 22.3963V22.8264C113.338 25.3375 112.688 27.2261 111.351 28.5982C110.035 29.9507 108.341 30.608 106.177 30.608C104.013 30.608 102.301 29.9295 100.997 28.5907C99.6661 27.2594 99.0194 25.3738 99.0194 22.8264V0.500885H93.6671V34.8683H98.9013V32.0195C99.4874 32.7374 100.23 33.3978 101.158 34.0248C102.633 35.0243 104.65 35.5302 107.151 35.5302C109.261 35.5302 111.22 35.0213 112.974 34.0202C114.707 33.0297 116.121 31.5622 117.179 29.6584C118.246 27.7683 118.764 25.5722 118.764 22.9415V22.3175C118.764 19.7398 118.245 17.4953 117.221 15.6506C116.191 13.756 114.816 12.3156 113.015 11.2434L113.017 11.2449Z" fill={color}/>
      {/* 'a' */}
      <path d="M143.579 30.1006V16.008C143.579 12.5458 140.762 9.72733 137.302 9.72733H126.785C124.569 9.72733 122.765 11.5311 122.765 13.7484V14.5738H138.304V19.817H131.419C129.705 19.817 128.124 20.0972 126.721 20.65C125.281 21.2028 124.124 22.0676 123.285 23.2171C122.409 24.3545 121.984 25.7812 121.984 27.5759C121.984 29.3706 122.403 30.7443 123.264 31.9075C124.094 33.0857 125.246 34.0066 126.692 34.6457C128.074 35.2318 129.637 35.5287 131.337 35.5287C133.038 35.5287 134.463 35.303 135.554 34.8396C136.726 34.3443 137.577 33.7688 138.233 33.0252C138.468 32.7556 138.687 32.489 138.889 32.227C139.08 32.8222 139.408 33.3341 139.888 33.7839C140.653 34.5018 141.682 34.8653 142.948 34.8653H147.005V30.0991H143.578L143.579 30.1006ZM138.3 24.4681C138.241 26.4067 137.633 27.9318 136.491 29.0087C135.321 30.1461 133.732 30.7231 131.771 30.7231C130.436 30.7231 129.344 30.4172 128.437 29.7886C127.698 29.2555 127.339 28.4937 127.339 27.4593C127.339 26.4249 127.666 25.7661 128.36 25.2723C129.194 24.7392 130.264 24.4681 131.539 24.4681H138.303H138.3Z" fill={color}/>
    </svg>
  )
}

// ============================================
// LOGO SPLASH (W + brand name reveal)
// ============================================
interface LogoSplashProps {
  visible: boolean
  backgroundColor?: string
  textColor?: string
  onComplete?: () => void
  /** Number of W animation cycles before revealing full logo */
  loadingCycles?: number
  /** Time to hold the full logo visible (ms) */
  holdTime?: number
}

export function LogoSplash({
  visible,
  backgroundColor = 'var(--bg-primary)',
  textColor = 'var(--text-primary)',
  onComplete,
  loadingCycles = 1,
  holdTime = 1500
}: LogoSplashProps) {
  const [show, setShow] = React.useState(visible)
  const [fadeOut, setFadeOut] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)
  const [animKey, setAnimKey] = React.useState(0)

  // W animation cycle is 2s, reveal at 45% of last cycle (when W is full)
  const cycleTime = 2000 // ms - WebbaLoader animation duration
  const revealPoint = 900 // ms - when W is fully visible in a cycle
  const revealDelay = (loadingCycles - 1) * cycleTime + revealPoint
  const fadeTime = 400 // ms - fade out duration

  React.useEffect(() => {
    if (visible) {
      setShow(true)
      setFadeOut(false)
      setRevealed(false)
      setAnimKey(k => k + 1)

      // Reveal the rest of the logo when W is full (after X cycles)
      const revealTimer = setTimeout(() => {
        setRevealed(true)
      }, revealDelay)

      // Start fade out after holding
      const fadeTimer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setShow(false)
          onComplete?.()
        }, fadeTime)
      }, revealDelay + holdTime)

      return () => {
        clearTimeout(revealTimer)
        clearTimeout(fadeTimer)
      }
    }
  }, [visible, onComplete, revealDelay, holdTime])

  const isMobile = useIsMobile()

  if (!show) return null

  // Responsive sizes
  const wSize = isMobile ? 60 : 80
  const wHeight = wSize * 0.9 // W renders at this height
  const ebbaSize = isMobile ? 42 : 56
  const ebbaWidth = (110 / 36) * ebbaSize
  const totalWidth = wSize + ebbaWidth // Full logo width

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        padding: '1rem'
      }}
    >
      {/* Container always sized for full logo, content shifts inside */}
      <div
        style={{
          position: 'relative',
          width: revealed ? totalWidth : wSize,
          height: wHeight,
          display: 'flex',
          alignItems: 'flex-end',
          transition: 'width 0.5s ease-out'
        }}
      >
        {/* W Logo */}
        <div>
          {revealed
            ? <WebbaLoader size={wSize} color={textColor} complete />
            : <WebbaLoader key={animKey} size={wSize} color={textColor} />
          }
        </div>

        {/* Rest of logo "ebba" reveals left to right */}
        <div style={{
          opacity: revealed ? 1 : 0,
          width: revealed ? ebbaWidth : 0,
          overflow: 'hidden',
          transition: 'opacity 0.3s ease-out, width 0.5s ease-out',
          marginLeft: isMobile ? -6 : -8
        }}>
          <WebbaLogoRest size={ebbaSize} color={textColor} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// MINIMAL SPLASH (Just logo + text)
// ============================================
interface MinimalSplashProps {
  visible: boolean
  logo?: React.ReactNode
  text?: string
  subtext?: string
  onComplete?: () => void
  duration?: number
}

export function MinimalSplash({
  visible,
  logo,
  text,
  subtext,
  onComplete,
  duration = 2000
}: MinimalSplashProps) {
  const [show, setShow] = React.useState(visible)
  const [fadeOut, setFadeOut] = React.useState(false)
  const [animKey, setAnimKey] = React.useState(0)

  React.useEffect(() => {
    if (visible) {
      setShow(true)
      setFadeOut(false)
      setAnimKey(k => k + 1) // Reset animation
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setShow(false)
          onComplete?.()
        }, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onComplete])

  const isMobile = useIsMobile()

  if (!show) return null

  // Responsive sizes
  const logoSize = isMobile ? 48 : 56
  const textSize = isMobile ? '1.125rem' : '1.25rem'
  const subtextSize = isMobile ? '0.75rem' : '0.8125rem'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        padding: '1rem'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '1rem' : '1.5rem',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {logo || <WebbaLoader key={animKey} size={logoSize} color="var(--text-primary)" />}

        {text && (
          <span style={{
            fontSize: textSize,
            fontWeight: 600,
            color: 'var(--text-primary)',
            textAlign: 'center'
          }}>
            {text}
          </span>
        )}

        {subtext && (
          <span style={{
            fontSize: subtextSize,
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// BRANDED SPLASH (Full branding)
// ============================================
interface BrandedSplashProps {
  visible: boolean
  logo: React.ReactNode
  appName: string
  tagline?: string
  version?: string
  footer?: React.ReactNode
  onComplete?: () => void
  duration?: number
}

export function BrandedSplash({
  visible,
  logo,
  appName,
  tagline,
  version,
  footer,
  onComplete,
  duration = 3000
}: BrandedSplashProps) {
  const [show, setShow] = React.useState(visible)
  const [fadeOut, setFadeOut] = React.useState(false)
  const [animKey, setAnimKey] = React.useState(0)

  React.useEffect(() => {
    if (visible) {
      setShow(true)
      setFadeOut(false)
      setAnimKey(k => k + 1) // Reset animation
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setShow(false)
          onComplete?.()
        }, 500)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onComplete])

  const isMobile = useIsMobile()

  if (!show) return null

  // Responsive sizes
  const appNameSize = isMobile ? '1.25rem' : '1.5rem'
  const taglineSize = isMobile ? '0.8125rem' : '0.875rem'
  const versionSize = isMobile ? '0.6875rem' : '0.75rem'
  const bottomPadding = isMobile ? '1.5rem' : '2rem'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        padding: '1rem'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '0.75rem' : '1rem',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        <div key={animKey}>{logo}</div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          marginTop: '0.5rem'
        }}>
          <span style={{
            fontSize: appNameSize,
            fontWeight: 700,
            color: 'var(--text-primary)',
            textAlign: 'center'
          }}>
            {appName}
          </span>

          {tagline && (
            <span style={{
              fontSize: taglineSize,
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              {tagline}
            </span>
          )}
        </div>

        {version && (
          <span style={{
            fontSize: versionSize,
            color: 'var(--text-muted)',
            marginTop: '0.5rem'
          }}>
            v{version}
          </span>
        )}
      </div>

      {footer && (
        <div style={{
          position: 'absolute',
          bottom: bottomPadding,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.8s ease-out 0.3s both',
          padding: '0 1rem'
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
