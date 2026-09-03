import type { PickPeriod } from '@/entities/pick'
import { ROWS_PER_PAGE } from '@/shared/config/app'
import type { MarketType } from '@/shared/config/markets'

export type PickTab = 'pending' | 'settled'

export type MarketFilter = MarketType | 'all'

export type SortOption = 'recent' | 'stake' | 'payout'

export interface PickQuery {
  /** `null` while the tab still follows the data: Pending when anything is open, else Settled. */
  tab: PickTab | null
  period: PickPeriod
  market: MarketFilter
  sort: SortOption
  /** Local midnight of the chart day being drilled into. */
  dayFilter: number | null
  visibleRows: number
}

export type PickQueryAction =
  | { type: 'selectTab'; tab: PickTab }
  | { type: 'selectPeriod'; period: PickPeriod }
  | { type: 'selectMarket'; market: MarketFilter }
  | { type: 'selectSort'; sort: SortOption }
  | { type: 'toggleDay'; day: number }
  | { type: 'clearDay' }
  | { type: 'showMoreRows' }

export const initialPickQuery: PickQuery = {
  tab: null,
  period: '7d',
  market: 'all',
  sort: 'recent',
  dayFilter: null,
  visibleRows: ROWS_PER_PAGE,
}

/**
 * One reducer, because every control shares one invariant: anything that
 * changes the list resets the row window, so the user is never left paged into
 * a list whose top they can no longer see. A period change also drops the day
 * filter — the selected day need not exist inside the new window.
 */
export const pickQueryReducer = (query: PickQuery, action: PickQueryAction): PickQuery => {
  const window = { visibleRows: ROWS_PER_PAGE }

  switch (action.type) {
    case 'selectTab':
      return { ...query, ...window, tab: action.tab }
    case 'selectPeriod':
      return { ...query, ...window, period: action.period, dayFilter: null }
    case 'selectMarket':
      return { ...query, ...window, market: action.market }
    case 'selectSort':
      return { ...query, ...window, sort: action.sort }
    case 'toggleDay':
      return {
        ...query,
        ...window,
        dayFilter: query.dayFilter === action.day ? null : action.day,
      }
    case 'clearDay':
      return { ...query, ...window, dayFilter: null }
    case 'showMoreRows':
      return { ...query, visibleRows: query.visibleRows + ROWS_PER_PAGE }
  }
}
