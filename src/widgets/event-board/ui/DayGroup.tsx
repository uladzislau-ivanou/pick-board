import {
  BoardColumnHeader,
  EventCard,
  type DayGroup as DayGroupModel,
  type Market,
  type Outcome,
  type SportEvent,
} from '@/entities/event'

import { DayGroupHeader } from './DayGroupHeader'

export const DayGroup = ({
  group,
  now,
  open,
  onToggle,
  onSelectOutcome,
}: {
  group: DayGroupModel
  now: number
  open: boolean
  onToggle: () => void
  onSelectOutcome: (event: SportEvent, market: Market, outcome: Outcome) => void
}) => {
  const panelId = `day-panel-${group.key}`

  return (
    <section className="border-t-2 border-divider">
      <DayGroupHeader group={group} open={open} panelId={panelId} onToggle={onToggle} />
      <div id={panelId} hidden={!open} className="pb-5">
        {open ? (
          <div className="overflow-hidden rounded-lg border border-divider bg-neutral-100">
            <BoardColumnHeader />
            {group.events.map((event) => (
              <EventCard key={event.id} event={event} now={now} onSelectOutcome={onSelectOutcome} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
