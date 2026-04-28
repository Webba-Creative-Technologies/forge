import { createContext } from 'react'

/**
 * True when the current subtree is rendered inside a Stack-like container
 * (VStack, HStack, Stack, etc.) that owns the vertical/horizontal rhythm
 * via its own `gap` prop. Children that have their own intrinsic margin
 * (Divider, for example) read this and suppress that margin so the
 * parent's gap stays the single source of spacing.
 *
 * Default false: a Divider rendered in a raw <div> or outside any Stack
 * keeps its own `spacing="md"` default behavior.
 */
export const StackGapContext = createContext<boolean>(false)
