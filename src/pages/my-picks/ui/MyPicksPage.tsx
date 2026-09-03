import { useState } from 'react'
import { useNavigate } from 'react-router'

import { periodLabel, periodRange, usePicks } from '@/entities/pick'
import { usePickQuery } from '@/features/filter-picks'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PickLedger } from '@/widgets/pick-ledger'

import { PerformanceBand } from './PerformanceBand'

/**
 * The page owns the pick query, so a day selected on the chart and the rows in
 * the ledger below can never disagree — and neither of them imports the other.
 */
export const MyPicksPage = () => {
  const [now] = useState(() => Date.now())
  const [query, dispatch] = usePickQuery()
  const { picks } = usePicks()
  const navigate = useNavigate()
  const browseEvents = () => navigate(ROUTES.events)
  const range = periodRange(query.period, picks, now)

  return (
    <>
      <PageHeader
        kicker={`Account · ${periodLabel(query.period, range.spanDays)}`}
        title="My Picks"
        aside={
          <Button variant="secondary" onClick={browseEvents}>
            Back to board
          </Button>
        }
      />
      <PerformanceBand
        picks={picks}
        now={now}
        period={query.period}
        selectedDay={query.dayFilter}
        onSelectDay={(day) => dispatch({ type: 'toggleDay', day })}
      />
      {/* The band and the ledger read as one box, so their shared edge is drawn once. */}
      <PickLedger
        picks={picks}
        query={query}
        dispatch={dispatch}
        now={now}
        onBrowseEvents={browseEvents}
        className="border-t-0"
      />
    </>
  )
}
