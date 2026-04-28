import { useMemo } from 'react'
import type { CSSProperties } from 'react'

// Parse an SVG path d string into an array of commands
export interface PathCommand {
  type: string
  values: number[]
}

export function parsePath(d: string): PathCommand[] {
  const commands: PathCommand[] = []
  const regex = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g
  let match
  while ((match = regex.exec(d)) !== null) {
    const type = match[1]
    const values = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number)
    commands.push({ type, values })
  }
  return commands
}

// Normalize two paths to have the same number of commands
export function normalizePaths(a: PathCommand[], b: PathCommand[]): [PathCommand[], PathCommand[]] {
  const maxLen = Math.max(a.length, b.length)
  const padded = (arr: PathCommand[]) => {
    const result = [...arr.map(c => ({ type: c.type, values: [...c.values] }))]
    while (result.length < maxLen) {
      const last = result[result.length - 1]
      result.push({ type: last.type, values: [...last.values] })
    }
    return result
  }
  return [padded(a), padded(b)]
}

// Interpolate between two normalized paths at progress t (0-1)
export function interpolatePaths(a: PathCommand[], b: PathCommand[], t: number): string {
  return a.map((cmdA, i) => {
    const cmdB = b[i]
    const type = t < 0.5 ? cmdA.type : cmdB.type
    const values = cmdA.values.map((v, j) => {
      const bv = cmdB.values[j] ?? v
      return v + (bv - v) * t
    })
    return `${type}${values.join(' ')}`
  }).join(' ')
}

export function usePathMorph(
  pathA: string,
  pathB: string,
  progress: number
): string {
  const [normA, normB] = useMemo(() => {
    const a = parsePath(pathA)
    const b = parsePath(pathB)
    return normalizePaths(a, b)
  }, [pathA, pathB])

  return interpolatePaths(normA, normB, progress)
}

export interface MorphIconProps {
  /** First SVG path d string */
  from: string
  /** Second SVG path d string */
  to: string
  /** Current state: false = from path, true = to path */
  active?: boolean
  /** Size in px @default 24 */
  size?: number
  /** Stroke color @default 'currentColor' */
  color?: string
  /** Stroke width @default 2 */
  strokeWidth?: number
  /** Animation duration in ms @default 300 */
  duration?: number
  /** Fill @default 'none' */
  fill?: string
  style?: CSSProperties
  className?: string
  onClick?: () => void
}

export const ICON_PATHS = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M6 6l12 12M6 18L18 6',
  play: 'M6 4l14 8-14 8V4z',
  pause: 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
  check: 'M5 12l5 5L20 7',
  arrow_right: 'M5 12h14m-7-7l7 7-7 7',
  arrow_down: 'M12 5v14m-7-7l7 7 7-7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14'
} as const
