import { useState, ReactNode } from 'react'
import { Heading, Text } from '../../.forge'
import { Link20Regular, Checkmark16Regular } from '@fluentui/react-icons'

interface SectionHeadingProps {
  id: string
  level?: 1 | 2 | 3 | 4
  children: ReactNode
  style?: React.CSSProperties
}

export function SectionHeading({ id, level = 2, children, style }: SectionHeadingProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style>{`
        .section-heading-wrapper:hover .section-heading-copy-btn {
          opacity: 1 !important;
        }
        .section-heading-copy-btn:hover {
          background-color: var(--bg-tertiary) !important;
        }
      `}</style>
      <div
        id={id}
        className="section-heading-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          scrollMarginTop: '100px',
          ...style
        }}
      >
        <Heading level={level}>{children}</Heading>
        <button
          className="section-heading-copy-btn"
          onClick={handleCopyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.15s ease, background-color 0.15s ease',
            color: copied ? 'var(--color-success)' : 'var(--text-muted)'
          }}
          title="Copy link to section"
        >
          {copied ? (
            <>
              <Checkmark16Regular />
              <Text size="xs" style={{ color: 'inherit' }}>Copied!</Text>
            </>
          ) : (
            <Link20Regular />
          )}
        </button>
      </div>
    </>
  )
}
