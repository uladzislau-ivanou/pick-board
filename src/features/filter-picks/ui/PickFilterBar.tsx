import type { ActionDispatch } from 'react'

import type { PickPeriod } from '@/entities/pick'
import { MARKET_TYPES } from '@/shared/config/markets'
import { Select } from '@/shared/ui/Select'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'

import type { MarketFilter, PickQuery, PickQueryAction, SortOption } from '../model/pick-query'
import { DayFilterChip } from './DayFilterChip'

const PERIODS: readonly { value: PickPeriod; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'all', label: 'All' },
]

const SORTS: readonly { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Newest first' },
  { value: 'stake', label: 'Biggest stake' },
  { value: 'payout', label: 'Biggest payout' },
]

export const PickFilterBar = ({
  query,
  dispatch,
}: {
  query: PickQuery
  dispatch: ActionDispatch<[PickQueryAction]>
}) => (
  <div className="flex flex-wrap items-center gap-2.5 border-b-2 border-divider bg-neutral-200 px-5 py-2.5">
    <SegmentedControl
      label="Period"
      value={query.period}
      onChange={(period) => dispatch({ type: 'selectPeriod', period })}
      options={PERIODS}
      className="bg-ground"
    />

    <Select
      aria-label="Market"
      value={query.market}
      onChange={(event) =>
        dispatch({ type: 'selectMarket', market: event.target.value as MarketFilter })
      }
    >
      <option value="all">All markets</option>
      {MARKET_TYPES.map((market) => (
        <option key={market} value={market}>
          {market}
        </option>
      ))}
    </Select>

    <Select
      aria-label="Sort"
      value={query.sort}
      onChange={(event) => dispatch({ type: 'selectSort', sort: event.target.value as SortOption })}
    >
      {SORTS.map((sort) => (
        <option key={sort.value} value={sort.value}>
          {sort.label}
        </option>
      ))}
    </Select>

    {query.dayFilter === null ? null : (
      <DayFilterChip day={query.dayFilter} onClear={() => dispatch({ type: 'clearDay' })} />
    )}
  </div>
)
