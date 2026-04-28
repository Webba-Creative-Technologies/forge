import React, { ReactNode } from 'react'

// ============================================
// QUOTE BOX
// ============================================
interface QuoteBoxProps {
  children: ReactNode
  author?: string
  source?: string
  className?: string
  style?: React.CSSProperties
}

export function QuoteBox({ children, author, source, className, style }: QuoteBoxProps) {
  return (
    <blockquote
      className={className || "animate-fadeIn"}
      style={{
        margin: 0,
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0 10px 10px 0',
        borderLeft: '4px solid var(--brand-primary)',
        position: 'relative',
        ...style
      }}
    >
      {/* Quote mark */}
      <span style={{
        position: 'absolute',
        top: 8,
        left: 16,
        fontSize: '3rem',
        fontFamily: 'Georgia, serif',
        color: 'var(--brand-primary)',
        opacity: 0.2,
        lineHeight: 1
      }}>
        "
      </span>

      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--text-primary)',
        lineHeight: 1.7,
        fontStyle: 'italic',
        margin: 0,
        paddingLeft: '1.5rem'
      }}>
        {children}
      </p>

      {(author || source) && (
        <footer style={{
          marginTop: '0.75rem',
          paddingLeft: '1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)'
        }}>
          {author && <span style={{ fontWeight: 500 }}>— {author}</span>}
          {source && <span>, {source}</span>}
        </footer>
      )}
    </blockquote>
  )
}

export const Blockquote = QuoteBox
