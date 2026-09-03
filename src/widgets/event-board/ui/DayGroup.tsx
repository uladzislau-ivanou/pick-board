import {
  EventCard,
  type DayGroup as DayGroupModel,
  type Market,
  type Outcome,
  type SportEvent,
} from '@/entities/event'

import { DayGroupHeader } from './DayGroupHeader'

export const DayGroup = ({
  group,
  open,
  onToggle,
  onSelectOutcome,
}: {
  group: DayGroupModel
  open: boolean
  onToggle: () => void
  onSelectOutcome: (event: SportEvent, market: Market, outcome: Outcome) => void
}) => {
  const panelId = `day-panel-${group.key}`

  return (
    <section className="border-t-2 border-divider">
      <DayGroupHeader group={group} open={open} panelId={panelId} onToggle={onToggle} />
      {/* The panel stays in the DOM so `aria-controls` resolves, but a collapsed
          group renders no event cards at all. */}
      <div id={panelId} hidden={!open} className="flex flex-col gap-5 pb-5">
        {open
          ? group.events.map((event) => (
              <EventCard key={event.id} event={event} onSelectOutcome={onSelectOutcome} />
            ))
          : null}
      </div>
    </section>
  )
}
