import { useState, useEffect, useCallback, useRef, ReactNode, Children } from 'react'
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
  Pause16Filled,
  Play16Filled
} from '@fluentui/react-icons'

// ============================================
// CAROUSEL
// ============================================
interface CarouselProps {
  children: ReactNode
  variant?: 'default' | 'plain'
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showDots?: boolean
  showProgress?: boolean
  infinite?: boolean
  pauseOnHover?: boolean
  slidesToShow?: number
  gap?: number
  className?: string
  style?: React.CSSProperties
}

export function Carousel({
  children,
  variant = 'default',
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  showProgress = false,
  infinite = true,
  pauseOnHover = true,
  slidesToShow = 1,
  gap = 16,
  className,
  style
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const slides = Children.toArray(children)
  const totalSlides = slides.length
  const maxIndex = Math.max(0, totalSlides - slidesToShow)

  const goTo = useCallback((index: number) => {
    if (infinite) {
      if (index < 0) {
        setCurrentIndex(maxIndex)
      } else if (index > maxIndex) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(index)
      }
    } else {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
    }
    setProgress(0)
    progressRef.current = 0
  }, [infinite, maxIndex])

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // Autoplay with progress
  useEffect(() => {
    if (!isPlaying || isPaused || totalSlides <= slidesToShow) return

    let animationId: number

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = timestamp - lastTimeRef.current

      progressRef.current += delta
      const newProgress = (progressRef.current / interval) * 100
      setProgress(Math.min(newProgress, 100))

      if (progressRef.current >= interval) {
        next()
        progressRef.current = 0
        lastTimeRef.current = timestamp
      } else {
        lastTimeRef.current = timestamp
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isPlaying, isPaused, interval, next, totalSlides, slidesToShow])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }
  }, [next, prev])

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false)
  }

  const slideWidth = `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`

  return (
    <div
      ref={containerRef}
      className={className}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        outline: 'none',
        ...style
      }}
    >
      {/* Progress bar */}
      {showProgress && isPlaying && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          zIndex: 10,
          borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--brand-primary)',
            transition: 'width 0.1s linear'
          }} />
        </div>
      )}

      {/* Slides + Navigation wrapper */}
      <div style={{ position: 'relative' }}>
        {/* Slides container */}
        <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
          <div
            style={{
              display: 'flex',
              gap,
              transform: `translateX(calc(-${currentIndex} * (${slideWidth} + ${gap}px)))`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                style={{
                  flexShrink: 0,
                  width: slideWidth,
                  ...(variant === 'default' ? {
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  } : {})
                }}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {showArrows && totalSlides > slidesToShow && (
          <>
            <CarouselNavButton
              onClick={prev}
              disabled={!infinite && currentIndex === 0}
              position="left"
            >
              <ChevronLeft24Regular />
            </CarouselNavButton>
            <CarouselNavButton
              onClick={next}
              disabled={!infinite && currentIndex === maxIndex}
              position="right"
            >
              <ChevronRight24Regular />
            </CarouselNavButton>
          </>
        )}
      </div>

      {/* Dots + Play/Pause */}
      {(showDots || autoPlay) && totalSlides > slidesToShow && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 12
        }}>
          {/* Play/Pause button */}
          {autoPlay && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isPlaying ? <Pause16Filled /> : <Play16Filled />}
            </button>
          )}

          {/* Dots */}
          {showDots && (
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  style={{
                    width: currentIndex === index ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: currentIndex === index
                      ? 'var(--brand-primary)'
                      : 'var(--bg-tertiary)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// CAROUSEL NAV BUTTON (Helper)
// ============================================
interface CarouselNavButtonProps {
  onClick: () => void
  disabled?: boolean
  position: 'left' | 'right'
  children: ReactNode
}

function CarouselNavButton({ onClick, disabled, position, children }: CarouselNavButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'absolute',
        [position]: 8,
        top: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-full)',
        border: 'none',
        backgroundColor: disabled
          ? 'rgba(255, 255, 255, 0.05)'
          : pressed
          ? 'rgba(255, 255, 255, 0.3)'
          : hovered
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.1)',
        color: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translateY(-50%) ${disabled ? 'scale(1)' : pressed ? 'scale(0.9)' : hovered ? 'scale(1.1)' : 'scale(1)'}`,
        fontSize: 24,
        opacity: disabled ? 0.5 : 1
      }}
    >
      {children}
    </button>
  )
}

// ============================================
// CAROUSEL SLIDE (optional wrapper)
// ============================================
interface CarouselSlideProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CarouselSlide({ children, className, style }: CarouselSlideProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

// ============================================
// IMAGE CAROUSEL (specialized for images)
// ============================================
interface ImageCarouselProps {
  images: Array<{
    src: string
    alt?: string
    caption?: string
  }>
  aspectRatio?: string
  autoPlay?: boolean
  interval?: number
  showCaptions?: boolean
  showDots?: boolean
  showProgress?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ImageCarousel({
  images,
  aspectRatio = '16 / 9',
  autoPlay = true,
  interval = 5000,
  showCaptions = true,
  showDots = true,
  showProgress = true,
  className,
  style
}: ImageCarouselProps) {
  return (
    <Carousel
      variant="plain"
      autoPlay={autoPlay}
      interval={interval}
      showProgress={showProgress && autoPlay}
      showDots={showDots}
      className={className}
      style={style}
    >
      {images.map((image, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <img
            src={image.src}
            alt={image.alt || ''}
            style={{
              display: 'block',
              width: '100%',
              aspectRatio,
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)'
            }}
          />
          {showCaptions && image.caption && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2rem 1rem 1rem',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              color: 'white',
              fontSize: '0.875rem',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)'
            }}>
              {image.caption}
            </div>
          )}
        </div>
      ))}
    </Carousel>
  )
}
