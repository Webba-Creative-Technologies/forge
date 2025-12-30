import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react'
import { Search20Regular, Sparkle16Regular, Sparkle20Regular, Copy16Regular, Checkmark16Regular, ChevronRight16Regular } from '@fluentui/react-icons'
import { useIsMobile } from '../hooks/useResponsive'
import { Z_INDEX } from '../constants'

// Helper to render AI message with code blocks and links
function RenderAIMessage({
  message,
  onNavigate,
  onClose
}: {
  message: string
  onNavigate?: (route: string) => void
  onClose: () => void
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Clean up any remaining JSON wrapper and normalize escaped characters
  let normalizedMessage = message

  // Remove JSON wrapper if present ({"type":"...","message":"..."})
  const jsonWrapperMatch = message.match(/^\s*\{\s*"type"\s*:\s*"[^"]*"\s*,\s*"message"\s*:\s*"([\s\S]*)"\s*\}\s*$/)
  if (jsonWrapperMatch) {
    normalizedMessage = jsonWrapperMatch[1]
  }

  // Normalize escaped characters
  normalizedMessage = normalizedMessage
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
    .replace(/\\\\/g, '\\')

  // Split by code blocks - handles various formats (with or without newline after language)
  const parts = normalizedMessage.split(/(```\w*\s*[\s\S]*?```)/g)

  const handleCopy = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <>
      {parts.map((part, i) => {
        // Check if this is a code block
        const codeMatch = part.match(/```(\w*)\s*([\s\S]*?)```/)
        if (codeMatch) {
          const language = codeMatch[1] || 'code'
          const code = codeMatch[2].trim()
          return (
            <div key={i} style={{ margin: '0.75rem 0' }}>
              {/* Code block header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                background: 'var(--bg-tertiary)',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                  {language}
                </span>
                <button
                  onClick={() => handleCopy(code, i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: copiedIndex === i ? 'var(--success)' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {copiedIndex === i ? (
                    <><Checkmark16Regular /> Copié</>
                  ) : (
                    <><Copy16Regular /> Copier</>
                  )}
                </button>
              </div>
              {/* Code content */}
              <pre style={{
                margin: 0,
                padding: '0.75rem 1rem',
                background: 'var(--bg-primary)',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                border: '1px solid var(--border-color)',
                borderTop: 'none',
                fontSize: '0.8125rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                overflowX: 'auto',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                <code
                  style={{ color: 'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{
                    __html: code
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                  }}
                />
              </pre>
            </div>
          )
        }

        // Regular text - parse markdown links and render buttons
        if (!part.trim()) return null

        // Parse links [text](url) and convert to buttons
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
        const elements: ReactNode[] = []
        let lastIndex = 0
        let match
        let key = 0

        while ((match = linkRegex.exec(part)) !== null) {
          // Add text before link
          if (match.index > lastIndex) {
            elements.push(
              <span key={`${i}-text-${key++}`} style={{ whiteSpace: 'pre-wrap' }}>
                {part.slice(lastIndex, match.index)}
              </span>
            )
          }

          // Add styled button for link
          const linkText = match[1]
          const linkUrl = match[2]
          elements.push(
            <button
              key={`${i}-link-${key++}`}
              onClick={() => {
                if (onNavigate) {
                  onNavigate(linkUrl)
                }
                onClose()
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.625rem',
                margin: '0.125rem 0.25rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--brand-primary)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                verticalAlign: 'middle'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-primary)'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.borderColor = 'var(--brand-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)'
                e.currentTarget.style.color = 'var(--brand-primary)'
                e.currentTarget.style.borderColor = 'var(--border-color)'
              }}
            >
              {linkText}
              <ChevronRight16Regular style={{ fontSize: 12 }} />
            </button>
          )
          lastIndex = match.index + match[0].length
        }

        // Add remaining text
        if (lastIndex < part.length) {
          elements.push(
            <span key={`${i}-text-${key++}`} style={{ whiteSpace: 'pre-wrap' }}>
              {part.slice(lastIndex)}
            </span>
          )
        }

        return <span key={i}>{elements.length > 0 ? elements : part}</span>
      })}
    </>
  )
}

// Types
export interface SearchResult {
  id: string
  type: string
  title: string
  subtitle?: string
  icon?: ReactNode
  route?: string
  keywords?: string[]
  aliases?: string[]  // Common names from other frameworks (e.g., "Alert" for Banner)
}

export interface AIResponse {
  type: 'info' | 'navigate' | 'create' | 'action' | 'multi'
  message: string
  data?: Record<string, unknown>
  isDestructive?: boolean
}

interface CommandBarProps {
  open: boolean
  onClose: () => void
  placeholder?: string
  // Search
  onSearch?: (query: string) => SearchResult[]
  onResultSelect?: (result: SearchResult) => void
  // AI
  onAiQuery?: (query: string) => Promise<AIResponse>
  onAiAction?: (response: AIResponse) => void
  aiAvatar?: ReactNode
  // Customization
  isNaturalLanguage?: (query: string) => boolean
}

// Default natural language detection
const defaultIsNaturalLanguage = (q: string): boolean => {
  return /^(show|create|add|new|how|what|where|list|find|delete|remove|archive|je |j'|montre|affiche|créer|ajoute)/i.test(q) ||
    /\?$/.test(q) ||
    / (me|the|a|my|moi|le|la|les) /i.test(q)
}

export function CommandBar({
  open,
  onClose,
  placeholder = 'Search or ask...',
  onSearch,
  onResultSelect,
  onAiQuery,
  onAiAction,
  aiAvatar,
  isNaturalLanguage = defaultIsNaturalLanguage
}: CommandBarProps) {
  const isMobile = useIsMobile()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAiMode, setIsAiMode] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
      setAiResponse(null)
      setIsAiMode(false)
    }
  }, [open])

  // Update search results and AI mode
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsAiMode(false)
      return
    }

    const isNL = isNaturalLanguage(query)
    setIsAiMode(isNL)

    if (!isNL && onSearch) {
      setResults(onSearch(query))
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query, onSearch, isNaturalLanguage])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isAiMode && onAiQuery && !aiLoading) {
        handleAiSubmit()
      } else if (results[selectedIndex] && onResultSelect) {
        onResultSelect(results[selectedIndex])
        onClose()
      }
    }
  }

  // AI Submit
  const handleAiSubmit = async () => {
    if (!query.trim() || !onAiQuery || aiLoading) return

    setAiLoading(true)
    try {
      const response = await onAiQuery(query)
      setAiResponse(response)
    } catch {
      setAiResponse({ type: 'info', message: 'An error occurred.' })
    } finally {
      setAiLoading(false)
    }
  }

  // Handle AI action button
  const handleAiActionClick = () => {
    if (aiResponse && onAiAction) {
      onAiAction(aiResponse)
      onClose()
    }
  }

  if (!open) return null

  // Styles
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: isMobile ? '8vh' : '12vh',
    paddingLeft: isMobile ? '1rem' : 0,
    paddingRight: isMobile ? '1rem' : 0,
    zIndex: Z_INDEX.commandBar,
    animation: 'fadeIn 0.15s ease-out'
  }

  const containerStyle: CSSProperties = {
    width: '100%',
    maxWidth: '640px',
    position: 'relative',
    padding: '2px',
    borderRadius: isMobile ? '14px' : '18px',
    background: 'var(--border-color)',
    boxShadow: isAiMode
      ? '0 0 25px rgba(163, 91, 255, 0.35), 0 0 50px rgba(253, 145, 115, 0.2)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    transition: 'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: isAiMode ? 'scaleIn 0.2s ease-out, glowPulse 2s ease-in-out infinite 0.2s' : 'scaleIn 0.2s ease-out',
    overflow: 'hidden'
  }

  const innerStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: isMobile ? '12px' : '16px',
    overflow: 'hidden'
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={e => e.stopPropagation()} style={containerStyle}>
        {/* Animated gradient sweep border */}
        <div
          className={isAiMode ? 'border-sweep-active' : 'border-sweep-inactive'}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: isMobile ? 14 : 18,
            background: 'conic-gradient(from 0deg, var(--brand-primary), var(--brand-secondary), var(--brand-primary))',
            opacity: isAiMode ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        <div style={innerStyle}>
          {/* Input Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem'
          }}>
            {/* Icon container with transition */}
            <div style={{
              position: 'relative',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Search icon */}
              <div style={{
                position: 'absolute',
                opacity: isAiMode ? 0 : 1,
                transform: isAiMode ? 'scale(0.5) rotate(-90deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <Search20Regular style={{ color: 'var(--text-muted)' }} />
              </div>
              {/* AI icon */}
              <div style={{
                position: 'absolute',
                opacity: isAiMode ? 1 : 0,
                transform: isAiMode ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(90deg)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: isAiMode ? (aiLoading ? 'pulse 1.5s ease-in-out infinite' : 'sparkleIn 0.4s ease-out') : undefined,
                filter: isAiMode ? 'drop-shadow(0 0 6px rgba(163, 91, 255, 0.5))' : 'none'
              }}>
                <Sparkle20Regular style={{ color: 'var(--brand-primary)' }} />
              </div>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />

            {/* AI Submit Button */}
            {isAiMode && (
              <button
                onClick={handleAiSubmit}
                disabled={aiLoading || !query.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: aiLoading ? 'wait' : 'pointer',
                  opacity: aiLoading || !query.trim() ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}
              >
                {aiLoading ? (
                  <span style={{
                    width: 14,
                    height: 14,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <Sparkle16Regular />
                )}
                Ask
              </button>
            )}

            {/* Shortcut hint */}
            <kbd style={{
              padding: '0.25rem 0.5rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              ESC
            </kbd>
          </div>

          {/* Search Results */}
          {!isAiMode && results.length > 0 && (
            <div style={{
              borderTop: '1px solid var(--border-color)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onResultSelect?.(result)
                    onClose()
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: index === selectedIndex ? 'var(--bg-tertiary)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {result.icon && (
                    <span style={{ color: 'var(--text-muted)' }}>{result.icon}</span>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {result.title}
                    </div>
                    {result.subtitle && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                  <span style={{
                    padding: '0.125rem 0.5rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    fontSize: '0.625rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div style={{
              borderTop: '1px solid var(--border-color)',
              padding: '1rem 1.25rem',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* Avatar */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {aiAvatar || <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>W</span>}
                </div>

                {/* Message */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6
                  }}>
                    <RenderAIMessage
                      message={aiResponse.message}
                      onNavigate={(route) => {
                        if (onAiAction) {
                          onAiAction({ type: 'navigate', message: '', data: { route } })
                        }
                      }}
                      onClose={onClose}
                    />
                  </div>

                  {/* Action Button */}
                  {aiResponse.type !== 'info' && (
                    <button
                      onClick={handleAiActionClick}
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 1rem',
                        background: aiResponse.isDestructive ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                        border: `1px solid ${aiResponse.isDestructive ? '#ef4444' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        color: aiResponse.isDestructive ? '#ef4444' : 'var(--text-primary)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {aiResponse.type === 'navigate' ? '→ Voir la documentation' :
                        aiResponse.type === 'create' ? 'Créer' :
                          aiResponse.type === 'action' ? 'Confirmer' : 'Exécuter'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            padding: '0.625rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Sparkle16Regular style={{ fontSize: 12 }} />
              AI-powered
            </span>
            <span>↑↓ navigate · ↵ select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
