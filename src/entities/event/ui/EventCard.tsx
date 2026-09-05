import { Fragment } from 'react'

import { BOARD_COLUMNS, boardGridStyle } from '../config/board-columns'
import { gridRows, marketColumns } from '../lib/market-grid'
import type { Market, Outcome, SportEvent } from '../model/types'
import { LeagueStrip } from './LeagueStrip'
import { OutcomeButton } from './OutcomeButton'
import { TeamCell } from './TeamCell'

export const EventCard = ({
  event,
  now,
  onSelectOutcome,
}: {
  event: SportEvent
  now: number
  onSelectOutcome: (event: SportEvent, market: Market, outcome: Outcome) => void
}) => {
  const rows = gridRows(event)
  const columns = marketColumns(event, rows)

  return (
    <article className="border-b border-divider last:border-b-0">
      <LeagueStrip event={event} now={now} />
      <div style={boardGridStyle} className="grid gap-1 px-matchup-x pb-2.5">
        {rows.map((row) => (
          <Fragment key={row.key}>
            <TeamCell row={row} />
            {BOARD_COLUMNS.map((type) => {
              const column = columns.get(type)
              const outcome = column?.cells.get(row.key)

              return column === undefined || outcome === undefined ? (
                <span
                  key={type}
                  aria-hidden
                  className="flex items-center justify-center text-[13px] text-ink/65"
                >
                  —
                </span>
              ) : (
                <OutcomeButton
                  key={type}
                  market={column.market}
                  outcome={outcome}
                  rowName={row.name}
                  onSelect={(selected) => onSelectOutcome(event, column.market, selected)}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </article>
  )
}
