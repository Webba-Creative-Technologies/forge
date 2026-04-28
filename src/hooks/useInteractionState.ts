import { useMemo, useState } from 'react'

export interface InteractionStateBindings {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseDown: () => void
  onMouseUp: () => void
  onFocus: () => void
  onBlur: () => void
}

export interface UseInteractionStateResult {
  hovered: boolean
  pressed: boolean
  focused: boolean
  bind: InteractionStateBindings
}

export interface UseInteractionStateOptions {
  /** When false the bind handlers are no-ops and state stays default. Use for non-interactive variants. @default true */
  enabled?: boolean
}

const NOOP = () => {}
const DISABLED_BINDINGS: InteractionStateBindings = {
  onMouseEnter: NOOP,
  onMouseLeave: NOOP,
  onMouseDown: NOOP,
  onMouseUp: NOOP,
  onFocus: NOOP,
  onBlur: NOOP
}

/**
 * Tracks hovered / pressed / focused for an interactive element. Returns the
 * three booleans plus a `bind` object spread onto the target element.
 *
 * Components stay free to render whatever hover, press, or focus styling they
 * want; the hook only owns the state. Pressing release on mouse-leave and
 * blur is handled automatically.
 *
 * @example
 *   const { hovered, pressed, bind } = useInteractionState()
 *   <div {...bind} style={{ transform: pressed ? 'scale(0.98)' : 'none' }} />
 */
export function useInteractionState(
  options: UseInteractionStateOptions = {}
): UseInteractionStateResult {
  const { enabled = true } = options
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [focused, setFocused] = useState(false)

  const bind = useMemo<InteractionStateBindings>(() => {
    if (!enabled) return DISABLED_BINDINGS
    return {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => { setHovered(false); setPressed(false) },
      onMouseDown: () => setPressed(true),
      onMouseUp: () => setPressed(false),
      onFocus: () => setFocused(true),
      onBlur: () => { setFocused(false); setPressed(false) }
    }
  }, [enabled])

  return { hovered, pressed, focused, bind }
}
