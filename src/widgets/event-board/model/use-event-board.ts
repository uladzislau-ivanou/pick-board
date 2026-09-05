import { useState } from 'react'

import type { SportFilterValue } from '@/features/filter-events-by-sport'
import { DAYS_PER_PAGE } from '@/shared/config/app'

export const useEventBoard = () => {
  const [sport, setSport] = useState<SportFilterValue>('all')
  const [openOverrides, setOpenOverrides] = useState<Record<number, boolean>>({})
  const [visibleDays, setVisibleDays] = useState(DAYS_PER_PAGE)

  const isDayOpen = (key: number, diff: number) =>
    openOverrides[key] ?? (sport !== 'all' || diff <= 1)

  return {
    sport,
    visibleDays,
    isDayOpen,

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
