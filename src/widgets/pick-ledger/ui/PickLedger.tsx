import type { ActionDispatch } from 'react'

import { PickRow, type Pick } from '@/entities/pick'
import {
  applyPickQuery,
  PickFilterBar,
  PickTabs,
  type PickQuery,
  type PickQueryAction,
} from '@/features/filter-picks'
import { ROWS_PER_PAGE } from '@/shared/config/app'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

import { useExpandedRows } from '../model/use-expanded-rows'
import { LedgerEmptyState } from './LedgerEmptyState'
import { LedgerHeader } from './LedgerHeader'

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
          {view.rows.map((pick) => (
            <PickRow
              key={pick.id}
              pick={pick}
              expanded={rows.isExpanded(pick.id)}
              onToggle={() => rows.toggle(pick.id)}
            />
          ))}
          {view.rows.length < view.totalRows ? (
            <div className="flex flex-wrap items-center gap-3 px-5 py-4.5">
              <Button variant="secondary" onClick={() => dispatch({ type: 'showMoreRows' })}>
                Load {Math.min(ROWS_PER_PAGE, view.totalRows - view.rows.length)} more
              </Button>
              <p className="text-[12px] text-ink/65">
                {view.rows.length} of {view.totalRows} shown
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
