import { useState, useRef, useEffect, KeyboardEvent } from 'react'

// ============================================
// TYPES
// ============================================
export interface MentionUser {
  id: string
  name: string
  avatar?: string
  email?: string
}

export interface MentionData {
  id: string
  name: string
  trigger: string
  startIndex: number
  endIndex: number
}

// ============================================
// MENTION INPUT
// ============================================
interface MentionInputProps {
  value: string
  onChange: (value: string, mentions: MentionData[]) => void
  users: MentionUser[]
  trigger?: string
  placeholder?: string
  label?: string
  disabled?: boolean
  maxLength?: number
  rows?: number
  className?: string
  style?: React.CSSProperties
}

export function MentionInput({
  value,
  onChange,
  users,
  trigger = '@',
  placeholder = 'Tapez @ pour mentionner quelqu\'un...',
  label,
  disabled,
  maxLength,
  rows = 3,
  className,
  style
}: MentionInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [mentionStart, setMentionStart] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursor = e.target.selectionStart || 0

    // Check if we should open the mention dropdown
    const textBeforeCursor = newValue.slice(0, cursor)
    const triggerIndex = textBeforeCursor.lastIndexOf(trigger)

    if (triggerIndex !== -1) {
      const textAfterTrigger = textBeforeCursor.slice(triggerIndex + 1)
      // Check if there's no space after trigger (still typing mention)
      if (!textAfterTrigger.includes(' ') && !textAfterTrigger.includes('\n')) {
        setIsOpen(true)
        setSearch(textAfterTrigger)
        setMentionStart(triggerIndex)
        setSelectedIndex(0)
        updateDropdownPosition(cursor)
      } else {
        setIsOpen(false)
      }
    } else {
      setIsOpen(false)
    }

    setCursorPosition(cursor)
    onChange(newValue, extractMentions(newValue))
  }

  // Update dropdown position based on cursor
  const updateDropdownPosition = (cursor: number) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const textBeforeCursor = value.slice(0, cursor)
    const lines = textBeforeCursor.split('\n')
    const currentLine = lines.length
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20

    // Approximate position
    setDropdownPosition({
      top: currentLine * lineHeight + 40,
      left: 12
    })
  }

  // Insert mention
  const insertMention = (user: MentionUser) => {
    if (!textareaRef.current || mentionStart === -1) return

    const before = value.slice(0, mentionStart)
    const after = value.slice(cursorPosition)
    const mentionText = `${trigger}${user.name} `
    const newValue = before + mentionText + after

    onChange(newValue, extractMentions(newValue))
    setIsOpen(false)
    setSearch('')
    setMentionStart(-1)

    // Focus and set cursor after mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursor = mentionStart + mentionText.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursor, newCursor)
      }
    }, 0)
  }

  // Extract mentions from text
  const extractMentions = (text: string): MentionData[] => {
    const mentions: MentionData[] = []
    const regex = new RegExp(`${trigger}(\\w+)`, 'g')
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      const user = users.find(u => u.name.toLowerCase() === match![1].toLowerCase())
      if (user) {
        mentions.push({
          id: user.id,
          name: user.name,
          trigger,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        })
      }
    }

    return mentions
  }

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredUsers.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        if (filteredUsers[selectedIndex]) {
          e.preventDefault()
          insertMention(filteredUsers[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      case 'Tab':
        if (filteredUsers[selectedIndex]) {
          e.preventDefault()
          insertMention(filteredUsers[selectedIndex])
        }
        break
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 500,
          marginBottom: 6,
          color: 'var(--text-primary)'
        }}>
          {label}
        </label>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          opacity: disabled ? 0.5 : 1
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
      />

      {/* Mention dropdown */}
      {isOpen && filteredUsers.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 2000,
            minWidth: 220,
            animation: 'fadeIn 0.15s ease'
          }}
        >
          {filteredUsers.map((user, index) => (
            <button
              key={user.id}
              onClick={() => insertMention(user)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                width: '100%',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: index === selectedIndex ? 'var(--bg-hover)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-full)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user.name}
                </div>
                {user.email && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {user.email}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Character count */}
      {maxLength && (
        <div style={{
          textAlign: 'right',
          fontSize: '0.75rem',
          color: value.length > maxLength * 0.9 ? 'var(--error)' : 'var(--text-muted)',
          marginTop: 4
        }}>
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  )
}

// ============================================
// MENTION DISPLAY (render mentions in text)
// ============================================
interface MentionDisplayProps {
  text: string
  mentions: MentionData[]
  onMentionClick?: (mention: MentionData) => void
  className?: string
  style?: React.CSSProperties
}

export function MentionDisplay({
  text,
  mentions,
  onMentionClick,
  className,
  style
}: MentionDisplayProps) {
  if (mentions.length === 0) {
    return <span className={className} style={style}>{text}</span>
  }

  // Sort mentions by start index
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex)

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  sortedMentions.forEach((mention, i) => {
    // Text before mention
    if (mention.startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, mention.startIndex))
    }

    // Mention
    parts.push(
      <span
        key={i}
        onClick={() => onMentionClick?.(mention)}
        style={{
          color: 'var(--brand-primary)',
          fontWeight: 500,
          cursor: onMentionClick ? 'pointer' : 'default',
          backgroundColor: 'rgba(163, 91, 255, 0.1)',
          padding: '0 4px',
          borderRadius: 4
        }}
      >
        {mention.trigger}{mention.name}
      </span>
    )

    lastIndex = mention.endIndex
  })

  // Text after last mention
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <span className={className} style={style}>{parts}</span>
}
