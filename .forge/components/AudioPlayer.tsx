import { useState, useRef, useEffect, useCallback } from 'react'
import { SHADOWS } from '../constants'
import {
  Play20Filled,
  Pause20Filled,
  Play16Filled,
  Pause16Filled,
  SpeakerMute20Regular,
  Speaker220Regular,
  Speaker020Regular,
  Speaker120Regular,
  ArrowRepeatAll20Regular,
  SkipForward1020Filled,
  SkipBack1020Filled
} from '@fluentui/react-icons'
import { Text } from './Typography'
import { Slider } from './Slider'

// ============================================
// PLAY BUTTON
// ============================================
interface PlayButtonProps {
  isPlaying: boolean
  onClick: () => void
  size?: number
}

function PlayButton({ isPlaying, onClick, size = 48 }: PlayButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--brand-primary)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed ? 'scale(0.9)' : hovered ? 'scale(1.05)' : 'scale(1)',
        filter: hovered ? 'brightness(1.15)' : 'none'
      }}
    >
      {isPlaying ? (
        size > 40 ? <Pause20Filled /> : <Pause16Filled />
      ) : (
        size > 40 ? <Play20Filled /> : <Play16Filled />
      )}
    </button>
  )
}

// ============================================
// CONTROL BUTTON
// ============================================
interface ControlButtonProps {
  onClick: () => void
  children: React.ReactNode
  title?: string
  active?: boolean
}

function ControlButton({ onClick, children, title, active }: ControlButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        backgroundColor: hovered ? 'var(--bg-tertiary)' : 'transparent',
        border: 'none',
        color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: pressed ? 'scale(0.9)' : hovered ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      {children}
    </button>
  )
}

// ============================================
// AUDIO PLAYER
// ============================================
interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  cover?: string
  autoPlay?: boolean
  loop?: boolean
  showVolume?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  className?: string
  style?: React.CSSProperties
}

export function AudioPlayer({
  src,
  title,
  artist,
  cover,
  autoPlay = false,
  loop = false,
  showVolume = true,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className,
  style
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLooping, setIsLooping] = useState(loop)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)

  // Format time
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Play/Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      onPause?.()
    } else {
      audioRef.current.play()
      onPlay?.()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, onPlay, onPause])

  // Mute/Unmute
  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Volume change
  const handleVolumeChange = (value: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = value
    setVolume(value)
    setIsMuted(value === 0)
  }

  // Seek
  const handleSeek = useCallback((value: number) => {
    if (!audioRef.current) return
    const clampedValue = Math.max(0, Math.min(duration, value))
    audioRef.current.currentTime = clampedValue
    setCurrentTime(clampedValue)
  }, [duration])

  // Progress drag
  const handleProgressDrag = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    handleSeek(percent * duration)
  }, [duration, handleSeek])

  // Mouse down on progress
  const handleProgressMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleProgressDrag(e)
  }

  // Global mouse events for drag
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleProgressDrag(e)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleProgressDrag])

  // Global mouse up for volume drag
  useEffect(() => {
    if (!isDraggingVolume) return

    const handleMouseUp = () => {
      setIsDraggingVolume(false)
      setShowVolumeSlider(false)
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [isDraggingVolume])

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!audioRef.current) return
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Toggle loop
  const toggleLoop = () => {
    if (!audioRef.current) return
    audioRef.current.loop = !isLooping
    setIsLooping(!isLooping)
  }

  // Audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime)
      }
      onTimeUpdate?.(audio.currentTime, audio.duration)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [onTimeUpdate, onEnded, isDragging])

  const progress = duration > 0 ? currentTime / duration : 0

  // Get volume icon
  const VolumeIcon = isMuted || volume === 0
    ? SpeakerMute20Regular
    : volume < 0.33
      ? Speaker020Regular
      : volume < 0.66
        ? Speaker120Regular
        : Speaker220Regular

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        alignItems: 'center',
        userSelect: isDragging ? 'none' : 'auto',
        ...style
      }}
    >
      <audio ref={audioRef} src={src} autoPlay={autoPlay} loop={loop} />

      {/* Cover */}
      {cover && (
        <img
          src={cover}
          alt={title || 'Audio cover'}
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
      )}

      {/* Play button */}
      <PlayButton isPlaying={isPlaying} onClick={togglePlay} size={48} />

      {/* Info & Progress */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Title & Artist */}
        {(title || artist) && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            {title && (
              <Text
                size="sm"
                weight="medium"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 1,
                  minWidth: 0
                }}
              >
                {title}
              </Text>
            )}
            {artist && (
              <Text
                size="xs"
                color="muted"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 2,
                  minWidth: 0
                }}
              >
                {artist}
              </Text>
            )}
          </div>
        )}

        {/* Progress bar with time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Text size="xs" color="muted" style={{ flexShrink: 0, minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(currentTime)}
          </Text>

          <div
            ref={progressRef}
            style={{
              flex: 1,
              height: isDragging ? 8 : 6,
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 4,
              cursor: 'pointer',
              position: 'relative',
              minWidth: 80,
              transition: 'height 0.1s ease'
            }}
            onMouseDown={handleProgressMouseDown}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress * 100}%`,
                backgroundColor: 'var(--brand-primary)',
                borderRadius: 4,
                pointerEvents: 'none'
              }}
            />
            {/* Thumb */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progress * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: isDragging ? 14 : 12,
                height: isDragging ? 14 : 12,
                backgroundColor: 'var(--brand-primary)',
                borderRadius: '50%',
                boxShadow: SHADOWS.hard.sm,
                transition: 'width 0.1s ease, height 0.1s ease',
                pointerEvents: 'none'
              }}
            />
          </div>

          <Text size="xs" color="muted" style={{ flexShrink: 0, minWidth: 36, fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(duration)}
          </Text>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        {/* Skip backward */}
        <ControlButton onClick={() => skip(-10)} title="Reculer de 10s">
          <SkipBack1020Filled />
        </ControlButton>

        {/* Skip forward */}
        <ControlButton onClick={() => skip(10)} title="Avancer de 10s">
          <SkipForward1020Filled />
        </ControlButton>

        {/* Loop */}
        <ControlButton
          onClick={toggleLoop}
          title={isLooping ? 'Désactiver la répétition' : 'Activer la répétition'}
          active={isLooping}
        >
          <ArrowRepeatAll20Regular />
        </ControlButton>

        {/* Volume */}
        {showVolume && (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => {
              if (!isDraggingVolume) {
                setShowVolumeSlider(false)
              }
            }}
          >
            <ControlButton onClick={toggleMute} title={isMuted ? 'Activer le son' : 'Couper le son'}>
              <VolumeIcon />
            </ControlButton>

            {/* Horizontal volume slider inline - Forge Slider */}
            <div
              style={{
                width: showVolumeSlider ? 100 : 0,
                overflow: 'hidden',
                transition: 'width 0.2s ease'
              }}
              onMouseDown={() => setIsDraggingVolume(true)}
            >
              <div style={{ width: 100, padding: '0 12px' }}>
                <Slider
                  value={isMuted ? 0 : Math.round(volume * 100)}
                  onChange={(v) => handleVolumeChange(v / 100)}
                  min={0}
                  max={100}
                  size="sm"
                  showValue={false}
                  showTooltip={false}
                  animated={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MINI AUDIO PLAYER (compact version)
// ============================================
interface MiniAudioPlayerProps {
  src: string
  title?: string
  onPlay?: () => void
  onPause?: () => void
  className?: string
  style?: React.CSSProperties
}

export function MiniAudioPlayer({
  src,
  title,
  onPlay,
  onPause,
  className,
  style
}: MiniAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      onPause?.()
    } else {
      audioRef.current.play()
      onPlay?.()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = useCallback((value: number) => {
    if (!audioRef.current) return
    const clampedValue = Math.max(0, Math.min(duration, value))
    audioRef.current.currentTime = clampedValue
    setCurrentTime(clampedValue)
  }, [duration])

  const handleProgressDrag = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    handleSeek(percent * duration)
  }, [duration, handleSeek])

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleProgressDrag(e)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleProgressDrag(e)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleProgressDrag])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime)
      }
    }
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [isDragging])

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        userSelect: isDragging ? 'none' : 'auto',
        ...style
      }}
    >
      <audio ref={audioRef} src={src} />

      <PlayButton isPlaying={isPlaying} onClick={togglePlay} size={36} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {title && (
          <Text
            size="xs"
            weight="medium"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Text>
        )}
        <div
          ref={progressRef}
          style={{
            height: isDragging ? 6 : 4,
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 3,
            cursor: 'pointer',
            position: 'relative',
            transition: 'height 0.1s ease'
          }}
          onMouseDown={handleProgressMouseDown}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: 'var(--brand-primary)',
              borderRadius: 3,
              pointerEvents: 'none'
            }}
          />
          {/* Thumb on drag */}
          {isDragging && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progress * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: 10,
                height: 10,
                backgroundColor: 'var(--brand-primary)',
                borderRadius: '50%',
                boxShadow: SHADOWS.hard.sm,
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
      </div>

      <Text size="xs" color="muted" style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </div>
  )
}
