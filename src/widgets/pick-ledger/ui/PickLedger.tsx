import type { ActionDispatch } from 'react'

import type { Pick } from '@/entities/pick'
import {
  applyPickQuery,
  PickFilterBar,
  PickTabs,
  type PickQuery,
  type PickQueryAction,
} from '@/features/filter-picks'
import { cn } from '@/shared/lib/cn'

import { useExpandedRows } from '../model/use-expanded-rows'
import { LedgerEmptyState } from './LedgerEmptyState'
import { LedgerHeader } from './LedgerHeader'
import { LedgerRows } from './LedgerRows'
import { LoadMoreRows } from './LoadMoreRows'

export const PickLedger = ({
  picks,
  query,
  dispatch,
  now,
  onBrowseEvents,
  className,
}: {
  picks: readonly Pick[]
  query: PickQuery
  dispatch: ActionDispatch<[PickQueryAction]>
  now: number
  onBrowseEvents: () => void
  className?: string
}) => {
  const view = applyPickQuery(picks, query, now)
  const rows = useExpandedRows()

  return (
    <section
      aria-label="Picks"
      className={cn(
        '@container/ledger overflow-hidden rounded-b-lg border border-divider bg-neutral-100',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-5 py-3.5">
        <h3 className="text-[20px]">Picks</h3>
        <PickTabs
          tab={view.tab}
          pendingCount={view.pendingCount}
          settledCount={view.settledCount}
          onChange={(tab) => dispatch({ type: 'selectTab', tab })}
        />
      </div>

      <PickFilterBar query={query} dispatch={dispatch} />

      {view.totalRows === 0 ? (
        <LedgerEmptyState
          tab={view.tab}
          dayFilter={query.dayFilter}
          onBrowseEvents={onBrowseEvents}
        />
      ) : (
        <>
          <LedgerHeader />
          <LedgerRows rows={view.rows} isExpanded={rows.isExpanded} onToggle={rows.toggle} />
          {view.rows.length < view.totalRows ? (
            <LoadMoreRows
              shown={view.rows.length}
              total={view.totalRows}
              onShowMore={() => dispatch({ type: 'showMoreRows' })}
            />
          ) : null}
        </>
      )}
    </section>
  )
}
