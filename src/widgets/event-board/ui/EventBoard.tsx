import { groupByDay, type Market, type Outcome, type SportEvent } from '@/entities/event'
import { filterBySport, SportFilter } from '@/features/filter-events-by-sport'

import { useEventBoard } from '../model/use-event-board'
import { DayGroup } from './DayGroup'
import { EmptyBoard } from './EmptyBoard'
import { ShowMoreDays } from './ShowMoreDays'

export const EventBoard = ({
  events,
  now,
  onSelectOutcome,
}: {
  events: readonly SportEvent[]
  now: number
  onSelectOutcome: (event: SportEvent, market: Market, outcome: Outcome) => void
}) => {
  const board = useEventBoard()
  const days = groupByDay(filterBySport(events, board.sport), now)
  const shownDays = days.slice(0, board.visibleDays)
  const hiddenDays = days.length - shownDays.length

  return (
    <>
      <SportFilter events={events} value={board.sport} onChange={board.selectSport} />

      {days.length === 0 ? (
        <EmptyBoard sport={board.sport} onClearFilter={() => board.selectSport('all')} />
      ) : (
        <>
          {shownDays.map((group) => (
            <DayGroup
              key={group.key}
              group={group}
              now={now}
              open={board.isDayOpen(group.key, group.diff)}
              onToggle={() => board.toggleDay(group.key, group.diff)}
              onSelectOutcome={onSelectOutcome}
            />
          ))}
          {hiddenDays > 0 ? (
            <ShowMoreDays hiddenDays={hiddenDays} onShowMore={board.showMoreDays} />
          ) : null}
        </>
      )}
    </>
  )
}
