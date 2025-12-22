import { useState, useRef, useEffect, ReactNode, KeyboardEvent } from 'react'
import {
  Send16Regular,
  Attach16Regular,
  Emoji16Regular,
  MoreHorizontal16Regular,
  Checkmark16Regular,
  CheckmarkStarburst16Regular,
  Sparkle16Regular
} from '@fluentui/react-icons'
import { Avatar } from './Avatar'
import { useIsMobile } from '../hooks/useResponsive'

// ============================================
// TYPES
// ============================================
export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'assistant' | 'system'
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  avatar?: string
  name?: string
  attachments?: { name: string; url: string; type: string }[]
}

// ============================================
// CHAT BUBBLE
// ============================================
interface ChatBubbleProps {
  message: ChatMessage
  showAvatar?: boolean
  showTimestamp?: boolean
  showStatus?: boolean
  isGrouped?: boolean
}

function ChatBubble({
  message,
  showAvatar = true,
  showTimestamp = true,
  showStatus = true,
  isGrouped = false
}: ChatBubbleProps) {
  const isUser = message.sender === 'user'
  const isSystem = message.sender === 'system'
  const isAssistant = message.sender === 'assistant'

  if (isSystem) {
    return (
      <div
        className="animate-fadeIn"
        style={{
          textAlign: 'center',
          padding: '0.5rem 0'
        }}
      >
        <span style={{
          display: 'inline-block',
          padding: '0.375rem 0.75rem',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      className="animate-slideInUp"
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '0.5rem',
        marginTop: isGrouped ? 2 : 12
      }}
    >
      {/* Avatar */}
      {showAvatar && !isGrouped ? (
        <Avatar
          src={message.avatar}
          name={message.name || (isAssistant ? 'Assistant' : 'User')}
          size="sm"
        />
      ) : (
        <div style={{ width: 32 }} />
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}>
        {/* Name (for assistant) */}
        {isAssistant && !isGrouped && message.name && (
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginBottom: 4,
            marginLeft: 12
          }}>
            {message.name}
          </span>
        )}

        {/* Message content */}
        <div style={{
          padding: '0.625rem 0.875rem',
          backgroundColor: isUser
            ? 'var(--brand-primary)'
            : 'var(--bg-secondary)',
          borderRadius: isUser
            ? isGrouped ? '16px 4px 16px 16px' : '16px 16px 4px 16px'
            : isGrouped ? '4px 16px 16px 16px' : '16px 16px 16px 4px',
          color: isUser ? 'white' : 'var(--text-primary)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          wordBreak: 'break-word'
        }}>
          {isAssistant && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginBottom: 4,
              color: 'var(--brand-primary)',
              fontSize: '0.6875rem',
              fontWeight: 500
            }}>
              <Sparkle16Regular style={{ fontSize: 12 }} />
              IA
            </div>
          )}
          {message.content}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.375rem',
            marginTop: 4
          }}>
            {message.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.625rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
              >
                <Attach16Regular style={{ fontSize: 12 }} />
                {att.name}
              </a>
            ))}
          </div>
        )}

        {/* Timestamp & Status */}
        {showTimestamp && !isGrouped && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: 4,
            paddingLeft: isUser ? 0 : 12,
            paddingRight: isUser ? 12 : 0
          }}>
            <span style={{
              fontSize: '0.625rem',
              color: 'var(--text-muted)'
            }}>
              {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>

            {showStatus && isUser && message.status && (
              <span style={{ color: message.status === 'read' ? '#10b981' : 'var(--text-muted)' }}>
                {message.status === 'sending' && <span style={{ fontSize: 10 }}>...</span>}
                {message.status === 'sent' && <Checkmark16Regular style={{ fontSize: 12 }} />}
                {message.status === 'delivered' && <CheckmarkStarburst16Regular style={{ fontSize: 12 }} />}
                {message.status === 'read' && <CheckmarkStarburst16Regular style={{ fontSize: 12 }} />}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CHAT INPUT
// ============================================
interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onAttach?: () => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
}

function ChatInput({
  value,
  onChange,
  onSend,
  onAttach,
  placeholder = 'Écrivez un message...',
  disabled = false,
  loading = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled && !loading) {
        onSend()
      }
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [value])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '0.75rem',
      padding: '1rem'
    }}>
      {/* Attach button */}
      {onAttach && (
        <button
          onClick={onAttach}
          disabled={disabled}
          className="interactive-icon"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Attach16Regular />
        </button>
      )}

      {/* Input */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        minHeight: 44
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
            maxHeight: 120,
            padding: '0.75rem 1rem',
            boxSizing: 'border-box'
          }}
        />

        <button
          className="interactive-icon"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            marginRight: '0.5rem',
            marginBottom: '0.375rem',
            flexShrink: 0
          }}
        >
          <Emoji16Regular />
        </button>
      </div>

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled || loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: value.trim() ? 'var(--brand-primary)' : 'var(--bg-secondary)',
          border: 'none',
          color: value.trim() ? 'white' : 'var(--text-muted)',
          cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
      >
        {loading ? (
          <span style={{
            width: 16,
            height: 16,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        ) : (
          <Send16Regular />
        )}
      </button>
    </div>
  )
}

// ============================================
// TYPING INDICATOR
// ============================================
function TypingIndicator({ name }: { name?: string }) {
  return (
    <div
      className="animate-fadeIn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0'
      }}
    >
      <div style={{
        display: 'flex',
        gap: 3,
        padding: '0.5rem 0.75rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)'
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--text-muted)',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </div>
      {name && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {name} écrit...
        </span>
      )}
    </div>
  )
}

// ============================================
// CHAT BOX (Full chat interface)
// ============================================
interface ChatBoxProps {
  messages: ChatMessage[]
  onSend: (content: string) => void
  onAttach?: () => void
  title?: string
  subtitle?: string
  avatar?: ReactNode
  placeholder?: string
  loading?: boolean
  typing?: boolean
  typingName?: string
  height?: number | string
  headerActions?: ReactNode
}

export function ChatBox({
  messages,
  onSend,
  onAttach,
  title,
  subtitle,
  avatar,
  placeholder,
  loading = false,
  typing = false,
  typingName,
  height = 600,
  headerActions
}: ChatBoxProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom (scroll container, not page)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages, typing])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim())
      setInputValue('')
    }
  }

  // Group consecutive messages from same sender
  const groupedMessages = messages.map((msg, idx) => {
    const prevMsg = messages[idx - 1]
    const isGrouped = prevMsg && prevMsg.sender === msg.sender &&
      (msg.timestamp.getTime() - prevMsg.timestamp.getTime()) < 60000
    return { ...msg, isGrouped }
  })

  return (
    <div
      className="animate-fadeIn"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      {(title || avatar) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1rem'
        }}>
          {avatar}

          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                {subtitle}
              </div>
            )}
          </div>

          {headerActions || (
            <button
              className="interactive-icon"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <MoreHorizontal16Regular />
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}
      >
        {groupedMessages.map(msg => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isGrouped={msg.isGrouped}
          />
        ))}

        {typing && <TypingIndicator name={typingName} />}
      </div>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        onAttach={onAttach}
        placeholder={placeholder}
        loading={loading}
      />
    </div>
  )
}

// ============================================
// MINI CHAT (Floating chat bubble)
// ============================================
interface MiniChatProps {
  messages: ChatMessage[]
  onSend: (content: string) => void
  title?: string
  avatar?: ReactNode
  open?: boolean
  onToggle?: () => void
  loading?: boolean
  typing?: boolean
}

export function MiniChat({
  messages,
  onSend,
  title = 'Chat',
  avatar,
  open = false,
  onToggle,
  loading = false,
  typing = false
}: MiniChatProps) {
  const isMobile = useIsMobile()
  const [inputValue, setInputValue] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom (scroll container, not page)
  useEffect(() => {
    if (open && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages, open])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim())
      setInputValue('')
    }
  }

  // Responsive dimensions
  const chatWidth = isMobile ? 'calc(100vw - 32px)' : 360
  const chatHeight = isMobile ? 'calc(100dvh - 100px)' : 520
  const position = isMobile ? { bottom: 16, right: 16, left: 16 } : { bottom: 24, right: 24 }

  return (
    <div style={{ position: 'fixed', zIndex: 2000, ...position }}>
      {/* Chat window */}
      {open && (
        <div
          className="animate-scaleIn"
          style={{
            width: chatWidth,
            height: chatHeight,
            maxHeight: isMobile ? 'calc(100dvh - 100px)' : '80vh',
            marginBottom: isMobile ? 12 : 16,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: isMobile ? 'var(--radius-lg)' : 'var(--radius-xl)',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
            color: 'white'
          }}>
            {avatar || (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkle16Regular />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem'
            }}
          >
            {messages.map(msg => (
              <ChatBubble key={msg.id} message={msg} showAvatar={false} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Input */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            placeholder="Message..."
            loading={loading}
          />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          width: isMobile ? 52 : 56,
          height: isMobile ? 52 : 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(163, 91, 255, 0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          marginLeft: isMobile ? 'auto' : undefined
        }}
      >
        <Sparkle16Regular style={{ fontSize: isMobile ? 22 : 24 }} />
      </button>
    </div>
  )
}
