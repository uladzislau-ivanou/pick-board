import { useCallback, useMemo, type ReactNode } from 'react'

import { createId } from '@/shared/lib/id'
import { useLocalStorageState } from '@/shared/lib/use-local-storage-state'

import { getSeedPicks } from '../api/pick-fixtures'
import { PicksContext } from './picks-context'
import type { NewPick, Pick } from './types'

const STORAGE_KEY = 'pickboard.picks.v1'

export const PicksProvider = ({ children }: { children: ReactNode }) => {
  const [picks, setPicks] = useLocalStorageState<Pick[]>(STORAGE_KEY, () =>
    getSeedPicks(Date.now()),
  )

  const addPick = useCallback(
    (draft: NewPick) => {
      setPicks((current) => [
        { ...draft, id: createId('pick'), status: 'Pending', placedAt: Date.now() },
        ...current,
      ])
    },
    [setPicks],
  )

  const value = useMemo(() => ({ picks, addPick }), [picks, addPick])

  return <PicksContext.Provider value={value}>{children}</PicksContext.Provider>
}
