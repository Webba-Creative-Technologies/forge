import { useState } from 'react'
import { Copy16Regular, Checkmark16Regular, Code16Regular } from '@fluentui/react-icons'

// ============================================
// SIMPLE SYNTAX HIGHLIGHTING (no dependencies)
// ============================================
const SYNTAX_PATTERNS: Record<string, { pattern: RegExp; className: string }[]> = {
  javascript: [
    { pattern: /(\/\/.*$)/gm, className: 'comment' },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'comment' },
    { pattern: /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, className: 'string' },
    { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|super|extends|static|get|set)\b/g, className: 'keyword' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'constant' },
    { pattern: /\b(\d+\.?\d*)\b/g, className: 'number' },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, className: 'class' },
    { pattern: /(\w+)(?=\s*\()/g, className: 'function' }
  ],
  typescript: [
    { pattern: /(\/\/.*$)/gm, className: 'comment' },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'comment' },
    { pattern: /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, className: 'string' },
    { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|super|extends|static|get|set|type|interface|enum|implements|private|public|protected|readonly)\b/g, className: 'keyword' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'constant' },
    { pattern: /:\s*(string|number|boolean|any|void|never|unknown|object)\b/g, className: 'type' },
    { pattern: /\b(\d+\.?\d*)\b/g, className: 'number' },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, className: 'class' },
    { pattern: /(\w+)(?=\s*\()/g, className: 'function' }
  ],
  css: [
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'comment' },
    { pattern: /([.#][\w-]+)/g, className: 'selector' },
    { pattern: /([\w-]+)(?=\s*:)/g, className: 'property' },
    { pattern: /:\s*([^;{}]+)/g, className: 'value' },
    { pattern: /(@[\w-]+)/g, className: 'keyword' }
  ],
  html: [
    { pattern: /(<!--[\s\S]*?-->)/g, className: 'comment' },
    { pattern: /(<\/?[\w-]+)/g, className: 'tag' },
    { pattern: /([\w-]+)(?==)/g, className: 'attribute' },
    { pattern: /=(['"])(.*?)\1/g, className: 'string' }
  ],
  json: [
    { pattern: /("(?:[^"\\]|\\.)*")\s*:/g, className: 'property' },
    { pattern: /:\s*("(?:[^"\\]|\\.)*")/g, className: 'string' },
    { pattern: /\b(true|false|null)\b/g, className: 'constant' },
    { pattern: /\b(-?\d+\.?\d*)\b/g, className: 'number' }
  ],
  bash: [
    { pattern: /(#.*$)/gm, className: 'comment' },
    { pattern: /(['"])((?:\\.|(?!\1)[^\\])*)\1/g, className: 'string' },
    { pattern: /\b(if|then|else|fi|for|do|done|while|case|esac|function|return|exit|export|source)\b/g, className: 'keyword' },
    { pattern: /(\$[\w{][^}\s]*}?)/g, className: 'variable' }
  ]
}

const SYNTAX_COLORS: Record<string, string> = {
  comment: '#6b7280',
  string: '#10b981',
  keyword: '#a855f7',
  constant: '#f59e0b',
  number: '#06b6d4',
  class: '#f472b6',
  function: '#60a5fa',
  type: '#06b6d4',
  selector: '#f472b6',
  property: '#60a5fa',
  value: '#10b981',
  tag: '#a855f7',
  attribute: '#f59e0b',
  variable: '#06b6d4'
}

function highlightCode(code: string, language: string): string {
  const patterns = SYNTAX_PATTERNS[language] || SYNTAX_PATTERNS.javascript

  // First, escape HTML
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Collect all matches with their positions
  interface Match {
    start: number
    end: number
    text: string
    className: string
  }

  const matches: Match[] = []

  patterns.forEach(({ pattern, className }) => {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(escaped)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        className
      })
      // Prevent infinite loops with zero-width matches
      if (match[0].length === 0) break
    }
  })

  // Sort by start position, then by length (longer matches first)
  matches.sort((a, b) => a.start - b.start || b.end - a.end)

  // Filter out overlapping matches (keep first/longest)
  const filtered: Match[] = []
  let lastEnd = 0
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m)
      lastEnd = m.end
    }
  }

  // Build result string
  let result = ''
  let pos = 0
  for (const m of filtered) {
    // Add unhighlighted text before this match
    result += escaped.slice(pos, m.start)
    // Add highlighted match
    const color = SYNTAX_COLORS[m.className] || 'inherit'
    result += `<span style="color:${color}">${m.text}</span>`
    pos = m.end
  }
  // Add remaining text
  result += escaped.slice(pos)

  return result
}

// ============================================
// CODE BLOCK
// ============================================
interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  showLanguage?: boolean
  title?: string
  highlightLines?: number[]
  maxHeight?: number | string
}

export function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  showCopyButton = true,
  showLanguage = true,
  title,
  highlightLines = [],
  maxHeight
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div
      className="animate-fadeIn"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        maxWidth: '100%',
        width: '100%',
        minWidth: 0
      }}
    >
      {/* Header */}
      {(title || showLanguage || showCopyButton) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code16Regular style={{ color: 'var(--text-muted)' }} />
            {title ? (
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {title}
              </span>
            ) : showLanguage && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {language}
              </span>
            )}
          </div>

          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="interactive-icon"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.625rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: copied ? 'var(--color-success)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {copied ? (
                <>
                  <Checkmark16Regular style={{ fontSize: 14 }} />
                  Copied
                </>
              ) : (
                <>
                  <Copy16Regular style={{ fontSize: 14 }} />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Code */}
      <div style={{
        maxHeight,
        overflowY: maxHeight ? 'auto' : undefined,
        overflowX: 'auto',
        width: '100%'
      }}>
        <pre style={{
          margin: 0,
          padding: '0.75rem',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
          fontSize: '0.75rem',
          lineHeight: 1.6,
          tabSize: 2
        }}>
          <code>
            {lines.map((line, index) => {
              const lineNum = index + 1
              const isHighlighted = highlightLines.includes(lineNum)

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    backgroundColor: isHighlighted ? 'rgba(163, 91, 255, 0.1)' : 'transparent',
                    marginLeft: '-0.75rem',
                    marginRight: '-0.75rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    borderLeft: isHighlighted ? '3px solid var(--brand-primary)' : '3px solid transparent'
                  }}
                >
                  {showLineNumbers && (
                    <span style={{
                      width: 28,
                      flexShrink: 0,
                      textAlign: 'right',
                      paddingRight: '0.75rem',
                      color: 'var(--text-muted)',
                      userSelect: 'none',
                      opacity: 0.5
                    }}>
                      {lineNum}
                    </span>
                  )}
                  <span
                    style={{ flex: 1, whiteSpace: 'pre', minWidth: 0 }}
                    dangerouslySetInnerHTML={{ __html: highlightCode(line || ' ', language) }}
                  />
                </div>
              )
            })}
          </code>
        </pre>
      </div>
    </div>
  )
}

// ============================================
// INLINE CODE
// ============================================
interface InlineCodeProps {
  children: string
  copyable?: boolean
}

export function InlineCode({ children, copyable = false }: InlineCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <code
      onClick={copyable ? handleCopy : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.125rem 0.5rem',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-xs)',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.875em',
        color: 'var(--color-info)',
        cursor: copyable ? 'pointer' : 'text',
        transition: 'background-color 0.15s ease'
      }}
    >
      {children}
      {copyable && copied && (
        <Checkmark16Regular style={{ fontSize: 12, color: 'var(--color-success)' }} />
      )}
    </code>
  )
}

// ============================================
// CODE DIFF (simple version)
// ============================================
interface CodeDiffProps {
  oldCode: string
  newCode: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeDiff({
  oldCode,
  newCode,
  language = 'javascript',
  showLineNumbers = true
}: CodeDiffProps) {
  const oldLines = oldCode.split('\n')
  const newLines = newCode.split('\n')

  // Simple line-by-line diff
  const maxLines = Math.max(oldLines.length, newLines.length)
  const diffLines: { type: 'same' | 'add' | 'remove'; content: string }[] = []

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]

    if (oldLine === newLine) {
      diffLines.push({ type: 'same', content: oldLine || '' })
    } else {
      if (oldLine !== undefined) {
        diffLines.push({ type: 'remove', content: oldLine })
      }
      if (newLine !== undefined) {
        diffLines.push({ type: 'add', content: newLine })
      }
    }
  }

  const colors = {
    add: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', prefix: '+' },
    remove: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', prefix: '-' },
    same: { bg: 'transparent', border: 'transparent', prefix: ' ' }
  }

  return (
    <div
      className="animate-fadeIn"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        maxWidth: '100%',
        width: '100%',
        minWidth: 0
      }}
    >
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <pre style={{
          margin: 0,
          padding: '0.75rem',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          lineHeight: 1.6
        }}>
          <code>
            {diffLines.map((line, index) => {
              const { bg, border, prefix } = colors[line.type]

              return (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 20}ms`,
                    animationFillMode: 'backwards',
                    display: 'flex',
                    backgroundColor: bg,
                    marginLeft: '-0.75rem',
                    marginRight: '-0.75rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                    borderLeft: `3px solid ${border}`
                  }}
                >
                  <span style={{
                    width: 16,
                    flexShrink: 0,
                    color: line.type === 'add' ? '#10b981' : line.type === 'remove' ? '#ef4444' : 'var(--text-muted)',
                    userSelect: 'none'
                  }}>
                    {prefix}
                  </span>
                  {showLineNumbers && (
                    <span style={{
                      width: 28,
                      flexShrink: 0,
                      textAlign: 'right',
                      paddingRight: '0.75rem',
                      color: 'var(--text-muted)',
                      userSelect: 'none',
                      opacity: 0.5
                    }}>
                      {index + 1}
                    </span>
                  )}
                  <span
                    style={{ flex: 1, whiteSpace: 'pre', minWidth: 0 }}
                    dangerouslySetInnerHTML={{ __html: highlightCode(line.content || ' ', language) }}
                  />
                </div>
              )
            })}
          </code>
        </pre>
      </div>
    </div>
  )
}
