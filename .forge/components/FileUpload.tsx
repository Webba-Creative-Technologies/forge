import { useState, useRef, useCallback, ReactNode } from 'react'
import {
  Document20Regular,
  Image20Regular,
  Video20Regular,
  MusicNote220Regular,
  Dismiss16Regular,
  Checkmark16Regular,
  ErrorCircle16Regular,
  Add16Regular,
  ArrowUpload20Regular
} from '@fluentui/react-icons'

// ============================================
// 3D STYLE ICONS WITH ANIMATIONS
// ============================================
function CloudUploadIcon3D({ size = 56, animated = false, hovered = false }: { size?: number; animated?: boolean; hovered?: boolean }) {
  const uniqueId = `cloud-${Math.random().toString(36).slice(2, 9)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: hovered ? 'drop-shadow(0 8px 24px rgba(163, 91, 255, 0.4))' : 'drop-shadow(0 4px 12px rgba(163, 91, 255, 0.2))',
        transition: 'filter 0.3s ease'
      }}
    >
      <defs>
        <linearGradient id={`${uniqueId}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A35BFF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-highlight`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-arrow`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
        </linearGradient>
      </defs>

      {/* Cloud body with subtle animation */}
      <g style={{
        transform: hovered ? 'translateY(-1px)' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <path
          d="M44 32C46.2091 32 48 30.2091 48 28C48 25.7909 46.2091 24 44 24C43.6494 24 43.3086 24.0429 42.9822 24.1238C43.6395 22.9266 44 21.5579 44 20.1C44 15.1294 39.9706 11.1 35 11.1C31.8569 11.1 29.0888 12.7051 27.4678 15.1238C26.3266 14.4288 24.9604 14.0286 23.5 14.0286C19.3579 14.0286 16 17.3864 16 21.5286C16 21.8607 16.0182 22.1886 16.0536 22.5114C13.1688 23.4571 11 26.0936 11 29.2C11 33.0659 14.134 36.2 18 36.2H42C44.2091 36.2 46 34.4091 46 32.2C46 32.1333 45.9983 32.0669 45.995 32.0007"
          fill={`url(#${uniqueId}-gradient)`}
        />
        {/* Highlight shine */}
        <path
          d="M44 32C46.2091 32 48 30.2091 48 28C48 25.7909 46.2091 24 44 24C43.6494 24 43.3086 24.0429 42.9822 24.1238C43.6395 22.9266 44 21.5579 44 20.1C44 15.1294 39.9706 11.1 35 11.1C31.8569 11.1 29.0888 12.7051 27.4678 15.1238C26.3266 14.4288 24.9604 14.0286 23.5 14.0286C19.3579 14.0286 16 17.3864 16 21.5286C16 21.8607 16.0182 22.1886 16.0536 22.5114C13.1688 23.4571 11 26.0936 11 29.2C11 33.0659 14.134 36.2 18 36.2H42"
          fill={`url(#${uniqueId}-highlight)`}
          style={{
            opacity: hovered ? 0.7 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />
      </g>

      {/* Arrow with bounce animation */}
      <g style={{
        transform: animated ? 'translateY(-6px)' : hovered ? 'translateY(-3px)' : 'none',
        transition: animated
          ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <path
          d="M28 46V30"
          stroke={`url(#${uniqueId}-arrow)`}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: animated ? '0 100' : '100 0',
            transition: 'stroke-dasharray 0.4s ease'
          }}
        />
        <path
          d="M22 36L28 30L34 36"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

function FolderIcon3D({ size = 40, hovered = false, animated = false }: { size?: number; hovered?: boolean; animated?: boolean }) {
  const uniqueId = `folder-${Math.random().toString(36).slice(2, 9)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: hovered ? 'drop-shadow(0 6px 16px rgba(245, 158, 11, 0.4))' : 'drop-shadow(0 3px 8px rgba(245, 158, 11, 0.2))',
        transition: 'filter 0.3s ease'
      }}
    >
      <defs>
        <linearGradient id={`${uniqueId}-back`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={`${uniqueId}-front`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Back */}
      <rect x="4" y="10" width="32" height="24" rx="3" fill={`url(#${uniqueId}-back)`} />
      {/* Tab */}
      <path d="M4 13C4 11.3431 5.34315 10 7 10H15L18 6H7C5.34315 6 4 7.34315 4 9V13Z" fill={`url(#${uniqueId}-back)`} />
      {/* Front - animated open effect */}
      <rect
        x="4"
        y="14"
        width="32"
        height="20"
        rx="3"
        fill={`url(#${uniqueId}-front)`}
        style={{
          transform: animated ? 'translateY(-2px) rotateX(-8deg)' : hovered ? 'translateY(-1px)' : 'none',
          transformOrigin: 'bottom center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      />
      {/* Shine */}
      <rect
        x="6"
        y="16"
        width="28"
        height="6"
        rx="2"
        fill="white"
        style={{
          opacity: hovered ? 0.3 : 0.15,
          transition: 'opacity 0.3s ease'
        }}
      />
    </svg>
  )
}

// ============================================
// TYPES
// ============================================
export interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

// ============================================
// FILE UPLOAD / DROPZONE
// ============================================
interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  disabled?: boolean
  label?: string
  description?: string
  showPreview?: boolean
  variant?: 'dropzone' | 'button' | 'compact'
  children?: ReactNode
}

export function FileUpload({
  onFilesSelected,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize,
  disabled = false,
  label = 'Glissez vos fichiers ici',
  description = 'ou cliquez pour parcourir',
  showPreview = true,
  variant = 'dropzone',
  children
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).slice(0, multiple ? maxFiles - files.length : 1)

    const validFiles: File[] = []
    newFiles.forEach(file => {
      // Check file size
      if (maxSize && file.size > maxSize) {
        console.warn(`File ${file.name} exceeds max size`)
        return
      }
      validFiles.push(file)
    })

    if (validFiles.length > 0) {
      // Create preview for images
      const uploadFiles: UploadedFile[] = validFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'pending'
      }))

      if (showPreview) {
        setFiles(prev => multiple ? [...prev, ...uploadFiles] : uploadFiles)
      }
      onFilesSelected(validFiles)
    }
  }, [files.length, maxFiles, maxSize, multiple, onFilesSelected, showPreview])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = '' // Reset input
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image20Regular />
    if (type.startsWith('video/')) return <Video20Regular />
    if (type.startsWith('audio/')) return <MusicNote220Regular />
    return <Document20Regular />
  }

  // Button variant - simple, pas d'icône si children fourni
  if (variant === 'button') {
    return (
      <div className="animate-fadeIn">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={handleClick}
          disabled={disabled}
          className="btn-secondary interactive-subtle"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          {children || (
            <>
              <Add16Regular style={{ color: 'var(--brand-primary)' }} />
              Choisir un fichier
            </>
          )}
        </button>
      </div>
    )
  }

  // Compact variant - plus élégant avec icône folder 3D
  if (variant === 'compact') {
    return (
      <div className="animate-fadeIn" style={{ width: '100%' }}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="interactive-subtle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.25rem',
            backgroundColor: isDragging ? 'var(--brand-primary)08' : isHovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
            border: '1px dashed',
            borderColor: isDragging ? 'var(--brand-primary)' : isHovered ? 'rgba(163, 91, 255, 0.4)' : 'var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
            transform: isHovered && !disabled ? 'translateY(-1px)' : 'none',
            boxShadow: isHovered && !disabled ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          {/* Icon 3D avec animation */}
          <div style={{
            flexShrink: 0,
            transform: isDragging ? 'scale(1.15) rotate(-3deg)' : isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <FolderIcon3D size={36} hovered={isHovered} animated={isDragging} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isHovered ? 'var(--text-primary)' : 'var(--text-primary)',
              transition: 'color 0.2s ease'
            }}>
              {label}
            </span>
            {description && (
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                transition: 'color 0.2s ease'
              }}>
                {description}
              </span>
            )}
          </div>

          {/* Badge + avec rotation au hover */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            backgroundColor: isDragging ? 'var(--brand-primary)' : isHovered ? 'var(--brand-primary)22' : 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDragging ? 'white' : isHovered ? 'var(--brand-primary)' : 'var(--text-muted)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0
          }}>
            <Add16Regular />
          </div>
        </div>
      </div>
    )
  }

  // Default dropzone variant - avec icône cloud 3D
  return (
    <div className="animate-fadeIn" style={{ width: '100%' }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {/* Dropzone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="interactive-subtle"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2.5rem 2rem',
          backgroundColor: isDragging ? 'var(--brand-primary)08' : isHovered ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          border: '2px dashed',
          borderColor: isDragging ? 'var(--brand-primary)' : isHovered ? 'rgba(163, 91, 255, 0.4)' : 'var(--border-color)',
          borderRadius: 16,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
          minHeight: 220,
          transform: isHovered && !disabled ? 'translateY(-2px)' : 'none',
          boxShadow: isDragging
            ? '0 12px 40px rgba(163, 91, 255, 0.2), inset 0 0 40px rgba(163, 91, 255, 0.05)'
            : isHovered && !disabled
            ? '0 8px 24px rgba(0,0,0,0.1)'
            : 'none',
          overflow: 'hidden'
        }}
      >
        {/* Background pulse animation when dragging */}
        {isDragging && (
          <div style={{
            position: 'absolute',
            inset: -20,
            background: 'radial-gradient(circle at center, var(--brand-primary)20 0%, transparent 60%)',
            animation: 'pulseScale 2s ease-in-out infinite'
          }} />
        )}

        {/* Icône 3D cloud avec animation */}
        <div style={{
          transform: isDragging
            ? 'scale(1.2) translateY(-8px)'
            : isHovered
            ? 'scale(1.08) translateY(-4px)'
            : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 1
        }}>
          <CloudUploadIcon3D size={72} animated={isDragging} hovered={isHovered} />
        </div>

        {/* Texte avec animations */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          textAlign: 'center',
          zIndex: 1
        }}>
          <span style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: isDragging ? 'var(--brand-primary)' : 'var(--text-primary)',
            transition: 'all 0.3s ease',
            transform: isDragging ? 'scale(1.05)' : 'scale(1)'
          }}>
            {isDragging ? 'Déposez vos fichiers' : label}
          </span>
          <span style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            opacity: isDragging ? 0 : 1,
            transform: isDragging ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'all 0.3s ease'
          }}>
            {description}
          </span>
        </div>

        {/* Info formats/taille avec animation */}
        {(accept || maxSize) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            backgroundColor: isDragging ? 'var(--brand-primary)22' : 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: isDragging ? 'var(--brand-primary)' : 'var(--text-muted)',
            transition: 'all 0.3s ease',
            opacity: isDragging ? 0.8 : 1,
            transform: isDragging ? 'scale(0.95)' : 'scale(1)',
            zIndex: 1
          }}>
            {accept && <span>{accept.replace(/\*/g, '').replace(/,/g, ', ')}</span>}
            {accept && maxSize && <span style={{ opacity: 0.5 }}>•</span>}
            {maxSize && <span>Max {formatFileSize(maxSize)}</span>}
          </div>
        )}
      </div>

      {/* File list */}
      {showPreview && files.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          {files.map(file => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={() => removeFile(file.id)}
              formatFileSize={formatFileSize}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// FILE ITEM
// ============================================
interface FileItemProps {
  file: UploadedFile
  onRemove: () => void
  formatFileSize: (bytes: number) => string
  getFileIcon: (type: string) => ReactNode
}

function FileItem({ file, onRemove, formatFileSize, getFileIcon }: FileItemProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8
    }}>
      {/* Preview or icon */}
      {file.preview ? (
        <img
          src={file.preview}
          alt={file.file.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            objectFit: 'cover'
          }}
        />
      ) : (
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          {getFileIcon(file.file.type)}
        </div>
      )}

      {/* File info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {file.file.name}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {formatFileSize(file.file.size)}
        </div>

        {/* Progress bar */}
        {file.status === 'uploading' && (
          <div style={{
            width: '100%',
            height: 3,
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-xs)',
            marginTop: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${file.progress}%`,
              backgroundColor: 'var(--brand-primary)',
              transition: 'width 0.2s ease'
            }} />
          </div>
        )}
      </div>

      {/* Status indicator */}
      {file.status === 'success' && (
        <Checkmark16Regular style={{ color: 'var(--color-success)', flexShrink: 0 }} />
      )}
      {file.status === 'error' && (
        <ErrorCircle16Regular style={{ color: 'var(--color-error)', flexShrink: 0 }} />
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="interactive-icon"
        style={{
          width: 28,
          height: 28,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Dismiss16Regular />
      </button>
    </div>
  )
}

// ============================================
// AVATAR UPLOAD (specialized for profile pics)
// ============================================
interface AvatarUploadProps {
  currentImage?: string
  onImageSelected: (file: File) => void
  size?: number
  disabled?: boolean
}

export function AvatarUpload({
  currentImage,
  onImageSelected,
  size = 100,
  disabled = false
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(currentImage)
  const [isHovered, setIsHovered] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onImageSelected(file)
    }
    e.target.value = ''
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        overflow: 'hidden'
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {/* Current/preview image or placeholder */}
      {preview ? (
        <img
          src={preview}
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <Image20Regular style={{ fontSize: size * 0.4 }} />
        </div>
      )}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isHovered && !disabled ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }}>
        <ArrowUpload20Regular style={{ color: 'white', fontSize: 24 }} />
      </div>
    </div>
  )
}
