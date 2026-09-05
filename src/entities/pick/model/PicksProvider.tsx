import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { createId } from '@/shared/lib/id'
import { useLocalStorageState } from '@/shared/lib/use-local-storage-state'

import { getSeedPicks } from '../api/pick-fixtures'
import { PicksContext } from './picks-context'
import type { NewPick, Pick } from './types'

const STORAGE_KEY = 'pickboard.picks.v2'

export const PicksProvider = ({ children }: { children: ReactNode }) => {
  const [placed, setPlaced] = useLocalStorageState<Pick[]>(STORAGE_KEY, () => [])
  const [seeded] = useState(() => getSeedPicks(Date.now()))

  const addPick = useCallback(
    (draft: NewPick) => {
      setPlaced((current) => [
        { ...draft, id: createId('pick'), status: 'Pending', placedAt: Date.now() },
        ...current,
      ])
    },
    [setPlaced],
  )

  const picks = useMemo(
    () => [...placed, ...seeded].sort((a, b) => b.placedAt - a.placedAt),
    [placed, seeded],
  )

  const value = useMemo(() => ({ picks, addPick }), [picks, addPick])

  return <PicksContext.Provider value={value}>{children}</PicksContext.Provider>
}
