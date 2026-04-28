import { useEffect } from 'react'

/**
 * Keyboard shortcut hook.
 *
 * @param keys - shortcut key or array of keys. Examples:
 *   "Ctrl+K", "Meta+K", "Ctrl+Shift+P", "Escape", "ArrowUp".
 *   On macOS, "Meta" is Cmd and "Ctrl" is Ctrl. Use "Mod+K" to accept either
 *   Cmd on macOS or Ctrl on other platforms (recommended for palette shortcuts).
 * @param handler - called when the shortcut fires. `event.preventDefault()` is
 *   called automatically to avoid the browser default (e.g. Ctrl+S saving the
 *   page). Return `false` from the handler to opt out of preventDefault.
 * @param options.enabled - disable the hook without unmounting. Default `true`.
 * @param options.ignoreInput - skip when focus is in `input`, `textarea`, or
 *   contenteditable. Default `false`, so shortcuts fire even from inputs.
 *
 * @example
 *   useKeyboardShortcut('Mod+K', () => setPaletteOpen(true))
 *   useKeyboardShortcut(['Escape'], () => close(), { enabled: isOpen })
 *   useKeyboardShortcut('/', () => focusSearch(), { ignoreInput: true })
 */
export interface KeyboardShortcutOptions {
  enabled?: boolean
  ignoreInput?: boolean
}

export function useKeyboardShortcut(
  keys: string | string[],
  handler: (event: KeyboardEvent) => void | boolean,
  options: KeyboardShortcutOptions = {}
): void {
  const { enabled = true, ignoreInput = false } = options

  useEffect(() => {
    if (!enabled) return
    const shortcuts = (Array.isArray(keys) ? keys : [keys]).map(parseShortcut)
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

    const listener = (event: KeyboardEvent) => {
      if (ignoreInput && isEditableTarget(event.target)) return

      for (const s of shortcuts) {
        if (!matches(event, s, isMac)) continue
        const result = handler(event)
        if (result !== false) event.preventDefault()
        return
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [keys, handler, enabled, ignoreInput])
}

interface ParsedShortcut {
  key: string
  ctrl: boolean
  meta: boolean
  mod: boolean  // Cmd on macOS, Ctrl elsewhere
  shift: boolean
  alt: boolean
}

function parseShortcut(raw: string): ParsedShortcut {
  const parts = raw.split('+').map(p => p.trim())
  const shortcut: ParsedShortcut = {
    key: '',
    ctrl: false,
    meta: false,
    mod: false,
    shift: false,
    alt: false
  }
  for (const p of parts) {
    const lower = p.toLowerCase()
    if (lower === 'ctrl' || lower === 'control') shortcut.ctrl = true
    else if (lower === 'meta' || lower === 'cmd' || lower === 'command') shortcut.meta = true
    else if (lower === 'mod') shortcut.mod = true
    else if (lower === 'shift') shortcut.shift = true
    else if (lower === 'alt' || lower === 'option') shortcut.alt = true
    else shortcut.key = p
  }
  return shortcut
}

function matches(event: KeyboardEvent, s: ParsedShortcut, isMac: boolean): boolean {
  if (event.key.toLowerCase() !== s.key.toLowerCase()) return false
  if (s.shift !== event.shiftKey) return false
  if (s.alt !== event.altKey) return false
  if (s.mod) {
    // Mod = Cmd on macOS, Ctrl elsewhere
    const modPressed = isMac ? event.metaKey : event.ctrlKey
    if (!modPressed) return false
    // Ensure the other modifier is not pressed (more selective)
    const otherPressed = isMac ? event.ctrlKey : event.metaKey
    if (otherPressed) return false
  } else {
    if (s.ctrl !== event.ctrlKey) return false
    if (s.meta !== event.metaKey) return false
  }
  return true
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}
