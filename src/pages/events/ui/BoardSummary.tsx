import {
  kickoffState,
  liveEvents,
  matchupLabel,
  nextKickoff,
  type SportEvent,
} from '@/entities/event'
import { pendingPicks, totalStaked, type Pick } from '@/entities/pick'
import { formatKickoff, formatRelativeDay } from '@/shared/lib/date'
import { formatMoney } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'
import { LabeledValue, LabeledValueRow } from '@/shared/ui/LabeledValue'

const countdown = (kickoffAt: number, now: number) => {
  const state = kickoffState(kickoffAt, now)
  if (state.kind === 'soon') return `in ${state.minutes}m`
  return `${formatRelativeDay(kickoffAt, now)} · ${formatKickoff(kickoffAt)}`
}

export const BoardSummary = ({
  events,
  picks,
  now,
}: {
  events: readonly SportEvent[]
  picks: readonly Pick[]
  now: number
}) => {
  const next = nextKickoff(events, now)
  const live = liveEvents(events, now)
  const open = pendingPicks(picks)

  return (
    <LabeledValueRow>
      <LabeledValue
        size="lg"
        label="Next off"
        value={next === undefined ? '—' : matchupLabel(next.away, next.home)}
        note={
          next === undefined
            ? 'Nothing scheduled'
            : `${next.league} · ${countdown(next.kickoffAt, now)}`
        }
        valueClassName="text-[15px]"
      />
      <LabeledValue
        size="lg"
        label="Live now"
        value={String(live.length)}
        note={live.length === 0 ? 'Nothing in play' : plural(live.length, 'event')}
        valueClassName={live.length > 0 ? 'text-accent' : undefined}
      />
      <LabeledValue
        size="lg"
        label="Open picks"
        value={String(open.length)}
        note={open.length === 0 ? 'None placed yet' : `${formatMoney(totalStaked(open))} at risk`}
        valueClassName={open.length > 0 ? 'text-pb-brand' : undefined}
      />
    </LabeledValueRow>
  )
}
