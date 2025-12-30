import { useState, useRef, useEffect, useCallback } from 'react'
import { SHADOWS } from '../constants'
import {
  Play20Filled,
  Pause20Filled,
  Play48Filled,
  SpeakerMute20Regular,
  Speaker220Regular,
  Speaker020Regular,
  Speaker120Regular,
  FullScreenMaximize20Regular,
  FullScreenMinimize20Regular,
  PictureInPicture20Regular,
  SkipForward1020Filled,
  SkipBack1020Filled,
  TopSpeed20Regular,
  Checkmark16Regular
} from '@fluentui/react-icons'
import { Text } from './Typography'
import { Slider } from './Slider'

// ============================================
// SPEED MENU - Direct speed selection
// ============================================
interface SpeedMenuProps {
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
}

function SpeedMenu({ playbackSpeed, onSpeedChange }: SpeedMenuProps) {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: 8,
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        minWidth: 120,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 4
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {speeds.map((speed) => (
        <button
          key={speed}
          onClick={() => onSpeedChange(speed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            backgroundColor: playbackSpeed === speed ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: 'none',
            color: playbackSpeed === speed ? 'var(--brand-primary)' : 'white',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.8125rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'background-color 0.1s ease'
          }}
          onMouseEnter={(e) => {
            if (playbackSpeed !== speed) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (playbackSpeed !== speed) {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
          {playbackSpeed === speed && <Checkmark16Regular />}
        </button>
      ))}
    </div>
  )
}


// ============================================
// PLAY BUTTON OVERLAY
// ============================================
interface PlayButtonOverlayProps {
  onClick: () => void
}

function PlayButtonOverlay({ onClick }: PlayButtonOverlayProps) {
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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) ${pressed ? 'scale(0.9)' : hovered ? 'scale(1.1)' : 'scale(1)'}`,
        width: 80,
        height: 80,
        borderRadius: 'var(--radius-full)',
        backgroundColor: hovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <Play48Filled />
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
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
        border: 'none',
        color: active ? 'var(--brand-primary)' : 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
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
// CONTROL GROUP
// ============================================
function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '2px 4px'
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// VIDEO PLAYER
// ============================================
interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  width?: number | string
  height?: number | string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  className?: string
  style?: React.CSSProperties
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  width = '100%',
  height = 'auto',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className,
  style
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [buffered, setBuffered] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showVolumePopup, setShowVolumePopup] = useState(false)
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverPosition, setHoverPosition] = useState(0)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>()
  const lastClickTimeRef = useRef<number>(0)

  // Format time
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Play/Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      onPause?.()
    } else {
      videoRef.current.play()
      onPlay?.()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, onPlay, onPause])

  // Handle video click (single click = play/pause, double click = fullscreen)
  const handleVideoClick = () => {
    const now = Date.now()
    const timeSinceLastClick = now - lastClickTimeRef.current
    lastClickTimeRef.current = now

    if (timeSinceLastClick < 300) {
      // Double click - toggle fullscreen
      toggleFullscreen()
    } else {
      // Single click - toggle play (with delay to check for double click)
      setTimeout(() => {
        if (Date.now() - lastClickTimeRef.current >= 300) {
          togglePlay()
        }
      }, 300)
    }
  }

  // Mute/Unmute
  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Volume change
  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return
    videoRef.current.volume = value
    setVolume(value)
    setIsMuted(value === 0)
  }

  // Seek
  const handleSeek = useCallback((value: number) => {
    if (!videoRef.current) return
    const clampedValue = Math.max(0, Math.min(duration, value))
    videoRef.current.currentTime = clampedValue
    setCurrentTime(clampedValue)
  }, [duration])

  // Progress bar drag
  const handleProgressDrag = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    handleSeek(percent * duration)
  }, [duration, handleSeek])

  // Mouse down on progress bar
  const handleProgressMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingProgress(true)
    handleProgressDrag(e)
  }

  // Global mouse events for progress drag
  useEffect(() => {
    if (!isDraggingProgress) return

    const handleMouseMove = (e: MouseEvent) => {
      handleProgressDrag(e)
    }

    const handleMouseUp = () => {
      setIsDraggingProgress(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingProgress, handleProgressDrag])

  // Global mouse up for volume drag
  useEffect(() => {
    if (!isDraggingVolume) return

    const handleMouseUp = () => {
      setIsDraggingVolume(false)
      setShowVolumePopup(false)
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [isDraggingVolume])

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Playback speed
  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }, [isFullscreen])

  // Picture in Picture
  const togglePiP = async () => {
    if (!videoRef.current) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (error) {
      console.error('PiP not supported')
    }
  }

  // Progress bar hover
  const handleProgressHover = (e: React.MouseEvent) => {
    if (!progressRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setHoverTime(percent * duration)
    setHoverPosition(e.clientX - rect.left)
  }

  // Video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (!isDraggingProgress) {
        setCurrentTime(video.currentTime)
      }
      onTimeUpdate?.(video.currentTime, video.duration)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1))
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [onTimeUpdate, onEnded, isDraggingProgress])

  // Auto hide controls
  const handleMouseMove = () => {
    setShowControls(true)
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    if (isPlaying && !isDraggingProgress) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
        setShowSpeedMenu(false)
        setShowVolumePopup(false)
      }, 3000)
    }
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'ArrowLeft':
        case 'j':
          e.preventDefault()
          skip(-10)
          break
        case 'ArrowRight':
        case 'l':
          e.preventDefault()
          skip(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange(Math.max(0, volume - 0.1))
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleFullscreen, volume])

  // Get volume icon
  const VolumeIcon = isMuted || volume === 0
    ? SpeakerMute20Regular
    : volume < 0.33
      ? Speaker020Regular
      : volume < 0.66
        ? Speaker120Regular
        : Speaker220Regular

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying && !isDraggingProgress) {
          setShowControls(false)
          setShowSpeedMenu(false)
          setShowVolumePopup(false)
        }
        setHoverTime(null)
      }}
      onClick={() => {
        setShowSpeedMenu(false)
        setShowVolumePopup(false)
      }}
      tabIndex={0}
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#000',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        outline: 'none',
        userSelect: isDraggingProgress ? 'none' : 'auto',
        ...style
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onClick={handleVideoClick}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
      />

      {/* Play button overlay */}
      {!isPlaying && <PlayButtonOverlay onClick={togglePlay} />}

      {/* Controls */}
      {controls && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
            padding: '48px 12px 10px',
            opacity: showControls || isDraggingProgress ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: showControls || isDraggingProgress ? 'auto' : 'none'
          }}
        >
          {/* Progress bar */}
          <div
            ref={progressRef}
            style={{
              position: 'relative',
              height: isDraggingProgress ? 8 : 5,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              marginBottom: 10,
              transition: 'height 0.1s ease'
            }}
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressHover}
            onMouseLeave={() => !isDraggingProgress && setHoverTime(null)}
          >
            {/* Buffered */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${(buffered / duration) * 100 || 0}%`,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 4,
                pointerEvents: 'none'
              }}
            />
            {/* Progress */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--brand-primary)',
                borderRadius: 4,
                pointerEvents: 'none'
              }}
            />
            {/* Progress thumb */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: isDraggingProgress ? 16 : 14,
                height: isDraggingProgress ? 16 : 14,
                backgroundColor: 'var(--brand-primary)',
                borderRadius: '50%',
                boxShadow: SHADOWS.soft.xs,
                transition: 'width 0.1s ease, height 0.1s ease',
                pointerEvents: 'none'
              }}
            />
            {/* Hover time tooltip */}
            {hoverTime !== null && !isDraggingProgress && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: hoverPosition,
                  transform: 'translateX(-50%)',
                  marginBottom: 8,
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                <Text size="xs" style={{ color: 'white' }}>
                  {formatTime(hoverTime)}
                </Text>
              </div>
            )}
          </div>

          {/* Control buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Left group: Play + Skip */}
            <ControlGroup>
              <ControlButton onClick={togglePlay} title={isPlaying ? 'Pause (K)' : 'Play (K)'}>
                {isPlaying ? <Pause20Filled /> : <Play20Filled />}
              </ControlButton>
              <ControlButton onClick={() => skip(-10)} title="Rewind 10s (J)">
                <SkipBack1020Filled />
              </ControlButton>
              <ControlButton onClick={() => skip(10)} title="Forward 10s (L)">
                <SkipForward1020Filled />
              </ControlButton>
            </ControlGroup>

            {/* Volume group with inline slider */}
            <ControlGroup>
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setShowVolumePopup(true)}
                onMouseLeave={() => {
                  if (!isDraggingVolume) {
                    setShowVolumePopup(false)
                  }
                }}
              >
                <ControlButton onClick={toggleMute} title={isMuted ? 'Activer le son (m)' : 'Couper le son (m)'}>
                  <VolumeIcon />
                </ControlButton>
                {/* Horizontal volume slider inline */}
                <div
                  style={{
                    width: showVolumePopup ? 100 : 0,
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
            </ControlGroup>

            {/* Time */}
            <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>

            <div style={{ flex: 1 }} />

            {/* Right group: Speed + PiP + Fullscreen */}
            <ControlGroup>
              {/* Speed */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowSpeedMenu(true)}
                onMouseLeave={() => setShowSpeedMenu(false)}
              >
                <ControlButton
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  title="Playback speed"
                  active={playbackSpeed !== 1}
                >
                  {playbackSpeed !== 1 ? (
                    <Text size="xs" style={{ color: 'inherit', fontWeight: 600 }}>{playbackSpeed}x</Text>
                  ) : (
                    <TopSpeed20Regular />
                  )}
                </ControlButton>
                {showSpeedMenu && (
                  <>
                    {/* Invisible bridge to prevent menu closing */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        right: 0,
                        height: 12
                      }}
                    />
                    <SpeedMenu
                      playbackSpeed={playbackSpeed}
                      onSpeedChange={handleSpeedChange}
                    />
                  </>
                )}
              </div>

              {/* PiP */}
              <ControlButton onClick={togglePiP} title="Picture in Picture">
                <PictureInPicture20Regular />
              </ControlButton>

              {/* Fullscreen */}
              <ControlButton onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}>
                {isFullscreen ? <FullScreenMinimize20Regular /> : <FullScreenMaximize20Regular />}
              </ControlButton>
            </ControlGroup>
          </div>
        </div>
      )}
    </div>
  )
}
