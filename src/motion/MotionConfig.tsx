import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { MotionTransition } from './Motion'

interface MotionConfigValue {
  transition?: MotionTransition
}

const MotionConfigContext = createContext<MotionConfigValue>({})

export function useMotionConfig(): MotionConfigValue {
  return useContext(MotionConfigContext)
}

export interface MotionConfigProps {
  transition?: MotionTransition
  children: ReactNode
}

export function MotionConfig({ transition, children }: MotionConfigProps) {
  const parent = useMotionConfig()
  const value = useMemo(() => ({
    transition: { ...parent.transition, ...transition }
  }), [parent.transition, transition])

  return (
    <MotionConfigContext.Provider value={value}>
      {children}
    </MotionConfigContext.Provider>
  )
}
