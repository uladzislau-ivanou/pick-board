import { useState } from 'react'

import type { SportFilterValue } from '@/features/filter-events-by-sport'
import { COLLAPSE_LATER_DAYS, DAYS_PER_PAGE } from '@/shared/config/app'

/**
 * The board's three pieces of view state, together because selecting a sport
 * has to move all three at once.
 */
export const useEventBoard = () => {
  const [sport, setSport] = useState<SportFilterValue>('all')
  const [openOverrides, setOpenOverrides] = useState<Record<number, boolean>>({})
  const [visibleDays, setVisibleDays] = useState(DAYS_PER_PAGE)

  /** An explicit toggle wins; a narrowed sport opens every day; otherwise today and tomorrow. */
  const isDayOpen = (key: number, diff: number) =>
    openOverrides[key] ?? (sport !== 'all' || !COLLAPSE_LATER_DAYS || diff <= 1)

  return {
    sport,
    visibleDays,
    isDayOpen,

    /** Narrowing once should not force the user to narrow again. */
    selectSport: (next: SportFilterValue) => {
      setSport(next)
      setOpenOverrides({})
      setVisibleDays(DAYS_PER_PAGE)
    },

    toggleDay: (key: number, diff: number) =>
      setOpenOverrides((current) => ({ ...current, [key]: !isDayOpen(key, diff) })),

    showMoreDays: () => setVisibleDays((current) => current + DAYS_PER_PAGE),
  }
}
