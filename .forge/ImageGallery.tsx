import { useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  Dismiss24Regular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
  ZoomIn20Regular,
  ZoomOut20Regular,
  ArrowDownload20Regular,
  ArrowReset20Regular
} from '@fluentui/react-icons'
import { IconButton } from './Button'
import { Tooltip } from './Tooltip'
import { Text } from './Typography'
import { Z_INDEX } from '../constants'

// ============================================
// TYPES
// ============================================
export interface GalleryImage {
  src: string
  alt?: string
  thumbnail?: string
  title?: string
  description?: string
}

// ============================================
// IMAGE TILE (Clickable image with hover effects)
// ============================================
interface ImageTileProps {
  src: string
  alt?: string
  aspectRatio?: string
  rounded?: boolean
  onClick?: () => void
  selected?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export function ImageTile({
  src,
  alt = '',
  aspectRatio = '1 / 1',
  rounded = true,
  onClick,
  selected,
  size = 'md',
  className,
  style
}: ImageTileProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const sizeStyles = {
    sm: { width: 56, height: 56 },
    md: { width: undefined, height: undefined },
    lg: { width: undefined, height: undefined }
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={`image-tile transition-normal ${className || ''}`}
      style={{
        position: 'relative',
        aspectRatio: size === 'sm' ? undefined : aspectRatio,
        overflow: 'hidden',
        border: selected ? '2px solid var(--brand-primary)' : '2px solid transparent',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: rounded ? 'var(--radius-md)' : 0,
        backgroundColor: 'var(--bg-tertiary)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed ? 'scale(0.95)' : hovered ? 'scale(1.05)' : 'scale(1)',
        ...sizeStyles[size],
        ...style
      }}
    >
      <img
        src={src}
        alt={alt}
        className="image-tile-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
      {/* Overlay - visible on hover */}
      {onClick && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <ZoomIn20Regular style={{ fontSize: 24 }} />
        </div>
      )}
    </button>
  )
}

// ============================================
// IMAGE GALLERY
// ============================================
interface ImageGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4 | 5
  gap?: number
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
  rounded?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 8,
  aspectRatio = 'square',
  rounded = true,
  className,
  style
}: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const aspectRatios = {
    square: '1 / 1',
    '4/3': '4 / 3',
    '16/9': '16 / 9',
    auto: 'auto'
  }

  return (
    <>
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          ...style
        }}
      >
        {images.map((image, index) => (
          <ImageTile
            key={index}
            src={image.thumbnail || image.src}
            alt={image.alt}
            aspectRatio={aspectRatios[aspectRatio]}
            rounded={rounded}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {lightboxIndex !== null && createPortal(
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />,
        document.body
      )}
    </>
  )
}

// ============================================
// LIGHTBOX
// ============================================
interface LightboxProps {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate
}: LightboxProps) {
  const [zoom, setZoom] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const currentImage = images[currentIndex]
  const hasNext = currentIndex < images.length - 1
  const hasPrev = currentIndex > 0

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Reset pan when zoom changes to 1 or image changes
  useEffect(() => {
    if (zoom === 1) {
      setPan({ x: 0, y: 0 })
    }
  }, [zoom])

  useEffect(() => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }, [currentIndex])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 150)
  }, [onClose])

  const handleNext = useCallback(() => {
    if (hasNext) {
      setZoom(1)
      setPan({ x: 0, y: 0 })
      onNavigate(currentIndex + 1)
    }
  }, [hasNext, currentIndex, onNavigate])

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setZoom(1)
      setPan({ x: 0, y: 0 })
      onNavigate(currentIndex - 1)
    }
  }, [hasPrev, currentIndex, onNavigate])

  // Wheel zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    setZoom(z => Math.min(3, Math.max(0.5, z + delta)))
  }, [])

  // Pan handlers - left click when zoomed OR middle click always
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle click (button 1) = pan mode always
    if (e.button === 1) {
      e.preventDefault()
      setIsDragging(true)
      dragStart.current = { x: e.clientX, y: e.clientY }
      panStart.current = { ...pan }
      return
    }
    // Left click = pan only when zoomed
    if (e.button === 0 && zoom > 1) {
      e.preventDefault()
      setIsDragging(true)
      dragStart.current = { x: e.clientX, y: e.clientY }
      panStart.current = { ...pan }
    }
  }, [zoom, pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return
    const touch = e.touches[0]
    setIsDragging(true)
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    panStart.current = { ...pan }
  }, [zoom, pan])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStart.current.x
    const dy = touch.clientY - dragStart.current.y
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy
    })
  }, [isDragging, zoom])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const handleDoubleClick = useCallback(() => {
    if (zoom === 1) {
      setZoom(2)
    } else {
      handleReset()
    }
  }, [zoom, handleReset])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.25, 3))
      else if (e.key === '-') setZoom(z => Math.max(z - 0.25, 0.5))
      else if (e.key === '0') handleReset()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, handleNext, handlePrev, handleReset])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentImage.src
    link.download = currentImage.title || `image-${currentIndex + 1}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3))
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5))

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: Z_INDEX.popover,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease'
      }}
    >
      {/* Header */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem'
        }}
      >
        {/* Counter */}
        <Text size="sm" color="rgba(255, 255, 255, 0.7)">
          {currentIndex + 1} / {images.length}
        </Text>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Tooltip content="Zoom arrière (-)" position="bottom">
            <IconButton
              icon={<ZoomOut20Regular />}
              size="sm"
              variant="inverted"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
            />
          </Tooltip>

          <Text
            size="xs"
            color="rgba(255, 255, 255, 0.7)"
            style={{ minWidth: 48, textAlign: 'center' }}
          >
            {Math.round(zoom * 100)}%
          </Text>

          <Tooltip content="Zoom avant (+)" position="bottom">
            <IconButton
              icon={<ZoomIn20Regular />}
              size="sm"
              variant="inverted"
              onClick={zoomIn}
              disabled={zoom >= 3}
            />
          </Tooltip>

          <div style={{ width: 1, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0 0.5rem' }} />

          <Tooltip content="Réinitialiser (0)" position="bottom">
            <IconButton
              icon={<ArrowReset20Regular />}
              size="sm"
              variant="inverted"
              onClick={handleReset}
              disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
            />
          </Tooltip>

          <Tooltip content="Download" position="bottom">
            <IconButton
              icon={<ArrowDownload20Regular />}
              size="sm"
              variant="inverted"
              onClick={handleDownload}
            />
          </Tooltip>

          <div style={{ width: 1, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0 0.5rem' }} />

          <Tooltip content="Close (Esc)" position="bottom">
            <IconButton
              icon={<Dismiss24Regular />}
              size="sm"
              variant="inverted"
              onClick={handleClose}
            />
          </Tooltip>
        </div>
      </div>

      {/* Image container */}
      <div
        ref={imageContainerRef}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onAuxClick={(e) => e.preventDefault()} // Prevent middle-click default behavior
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'zoom-in'),
          userSelect: 'none'
        }}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt || ''}
          draggable={false}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            borderRadius: 'var(--radius-xs)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Navigation arrows */}
      {hasPrev && (
        <LightboxNavButton
          onClick={(e) => { e.stopPropagation(); handlePrev() }}
          position="left"
          tooltip="Previous (←)"
        >
          <ChevronLeft24Regular />
        </LightboxNavButton>
      )}
      {hasNext && (
        <LightboxNavButton
          onClick={(e) => { e.stopPropagation(); handleNext() }}
          position="right"
          tooltip="Next (→)"
        >
          <ChevronRight24Regular />
        </LightboxNavButton>
      )}

      {/* Caption */}
      {(currentImage.title || currentImage.description) && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          {currentImage.title && (
            <Text size="lg" weight="semibold" color="white" style={{ marginBottom: 4 }}>
              {currentImage.title}
            </Text>
          )}
          {currentImage.description && (
            <Text size="sm" color="rgba(255, 255, 255, 0.7)">
              {currentImage.description}
            </Text>
          )}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="forge-scrollbar-thin"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            padding: '1rem',
            overflowX: 'auto'
          }}
        >
          {images.map((img, index) => (
            <ImageTile
              key={index}
              src={img.thumbnail || img.src}
              alt=""
              size="sm"
              selected={index === currentIndex}
              rounded
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); onNavigate(index) }}
              style={{
                opacity: index === currentIndex ? 1 : 0.6,
                flexShrink: 0
              }}
              className="lightbox-thumbnail"
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// LIGHTBOX NAV BUTTON (Helper)
// ============================================
interface LightboxNavButtonProps {
  onClick: (e: React.MouseEvent) => void
  position: 'left' | 'right'
  tooltip: string
  children: ReactNode
}

function LightboxNavButton({ onClick, position, tooltip, children }: LightboxNavButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        [position]: '1rem',
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      <Tooltip content={tooltip} position={position === 'left' ? 'right' : 'left'}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setPressed(false) }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: pressed ? 'rgba(255, 255, 255, 0.3)' : hovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: pressed ? 'scale(0.9)' : hovered ? 'scale(1.1)' : 'scale(1)',
            fontSize: 24
          }}
        >
          {children}
        </button>
      </Tooltip>
    </div>
  )
}

// ============================================
// SINGLE IMAGE WITH LIGHTBOX
// ============================================
interface ImagePreviewProps {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  aspectRatio?: string
  rounded?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ImagePreview({
  src,
  alt = '',
  width = '100%',
  height,
  aspectRatio = '16 / 9',
  rounded = true,
  className,
  style
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ImageTile
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        rounded={rounded}
        onClick={() => setIsOpen(true)}
        className={className}
        style={{
          width,
          height,
          ...style
        }}
      />

      {isOpen && createPortal(
        <Lightbox
          images={[{ src, alt }]}
          currentIndex={0}
          onClose={() => setIsOpen(false)}
          onNavigate={() => {}}
        />,
        document.body
      )}
    </>
  )
}
