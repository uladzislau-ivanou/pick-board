import { createContext, useContext } from 'react'

import type { NewPick, Pick } from './types'

export interface PicksState {
  /** Newest first. */
  picks: Pick[]
  addPick: (draft: NewPick) => void
}

export const PicksContext = createContext<PicksState | null>(null)

export const usePicks = () => {
  const context = useContext(PicksContext)
  if (!context) throw new Error('usePicks must be used inside <PicksProvider>')
  return context
}
