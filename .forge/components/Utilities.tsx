import { ReactNode, useMemo, useState } from 'react'
import { SHADOWS } from '../constants'

// ============================================
// WATERMARK
// ============================================
interface WatermarkProps {
  children: ReactNode
  text: string
  fontSize?: number
  color?: string
  opacity?: number
  rotate?: number
  gap?: [number, number]
  className?: string
  style?: React.CSSProperties
}

export function Watermark({
  children,
  text,
  fontSize = 16,
  color = 'var(--text-muted)',
  opacity = 0.15,
  rotate = -22,
  gap = [100, 100],
  className,
  style
}: WatermarkProps) {
  // Generate SVG watermark
  const watermarkSvg = useMemo(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.font = `${fontSize}px sans-serif`
    const textWidth = ctx.measureText(text).width
    const textHeight = fontSize

    const width = textWidth + gap[0]
    const height = textHeight + gap[1]

    canvas.width = width * 2
    canvas.height = height * 2

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = color
    ctx.globalAlpha = opacity
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Draw text in grid pattern
    for (let x = 0; x < canvas.width * 2; x += width) {
      for (let y = 0; y < canvas.height * 2; y += height) {
        ctx.fillText(text, x, y)
      }
    }

    return canvas.toDataURL()
  }, [text, fontSize, color, opacity, rotate, gap])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        ...style
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${watermarkSvg})`,
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
    </div>
  )
}

// ============================================
// HIGHLIGHT (text highlighting)
// ============================================
interface HighlightProps {
  text: string
  query: string
  highlightColor?: string
  highlightBg?: string
  caseSensitive?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Highlight({
  text,
  query,
  highlightColor = 'var(--text-primary)',
  highlightBg = 'rgba(255, 220, 0, 0.4)',
  caseSensitive = false,
  className,
  style
}: HighlightProps) {
  if (!query.trim()) {
    return <span className={className} style={style}>{text}</span>
  }

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    caseSensitive ? 'g' : 'gi'
  )

  const parts = text.split(regex)

  return (
    <span className={className} style={style}>
      {parts.map((part, index) => {
        const isMatch = caseSensitive
          ? part === query
          : part.toLowerCase() === query.toLowerCase()

        return isMatch ? (
          <mark
            key={index}
            style={{
              backgroundColor: highlightBg,
              color: highlightColor,
              padding: '0 2px',
              borderRadius: 2,
              fontWeight: 500
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </span>
  )
}

// ============================================
// TEXT TRUNCATE (with expand)
// ============================================
interface TextTruncateProps {
  text: string
  maxLines?: number
  maxLength?: number
  expandLabel?: string
  collapseLabel?: string
  className?: string
  style?: React.CSSProperties
}

export function TextTruncate({
  text,
  maxLines = 3,
  maxLength,
  expandLabel = 'Voir plus',
  collapseLabel = 'Voir moins',
  className,
  style
}: TextTruncateProps) {
  const [expanded, setExpanded] = useState(false)

  const shouldTruncate = maxLength
    ? text.length > maxLength
    : text.split('\n').length > maxLines

  const displayText = expanded
    ? text
    : maxLength
      ? text.slice(0, maxLength)
      : text

  return (
    <div className={className} style={style}>
      <div
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
          whiteSpace: 'pre-wrap'
        }}
      >
        {displayText}
        {!expanded && maxLength && text.length > maxLength && '...'}
      </div>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--brand-primary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0,
            marginTop: 4
          }}
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  )
}

// ============================================
// COPY TEXT (with indicator)
// ============================================
interface CopyTextProps {
  text: string
  children?: ReactNode
  onCopy?: () => void
  successMessage?: string
  className?: string
  style?: React.CSSProperties
}

export function CopyText({
  text,
  children,
  onCopy,
  successMessage = 'Copied!',
  className,
  style
}: CopyTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <span
      className={className}
      onClick={handleCopy}
      style={{
        cursor: 'pointer',
        position: 'relative',
        ...style
      }}
    >
      {children || text}
      {copied && (
        <span
          style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 8px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--success)',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: SHADOWS.soft.sm,
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          {successMessage}
        </span>
      )}
    </span>
  )
}
