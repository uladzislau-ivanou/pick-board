import {
  calculatePayout,
  isInPeriod,
  isPending,
  isResolved,
  periodRange,
  type Pick,
} from '@/entities/pick'
import { startOfDay } from '@/shared/lib/date'

import type { PickQuery, PickTab, SortOption } from '../model/pick-query'

const SORTS: Record<SortOption, (a: Pick, b: Pick) => number> = {
  recent: (a, b) => b.placedAt - a.placedAt,
  stake: (a, b) => b.stake - a.stake || b.placedAt - a.placedAt,
  payout: (a, b) =>
    calculatePayout(b.stake, b.odds) - calculatePayout(a.stake, a.odds) || b.placedAt - a.placedAt,
}

export interface LedgerView {
  tab: PickTab
  pendingCount: number
  settledCount: number
  rows: Pick[]
  totalRows: number
}

export const applyPickQuery = (
  picks: readonly Pick[],
  query: PickQuery,
  now: number,
): LedgerView => {
  const range = periodRange(query.period, picks, now)
  const inPeriod = picks.filter((pick) => isInPeriod(pick, range))
  const pending = inPeriod.filter(isPending)
  const settled = inPeriod.filter(isResolved)

  const tab = query.tab ?? (pending.length > 0 ? 'pending' : 'settled')
  const sorted = (tab === 'pending' ? pending : settled)
    .filter((pick) => query.dayFilter === null || startOfDay(pick.placedAt) === query.dayFilter)
    .filter((pick) => query.market === 'all' || pick.market === query.market)
    .sort(SORTS[query.sort])

  return {
    tab,
    pendingCount: pending.length,
    settledCount: settled.length,
    rows: sorted.slice(0, query.visibleRows),
    totalRows: sorted.length,
  }
}
