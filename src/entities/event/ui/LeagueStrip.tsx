import { formatKickoff } from '@/shared/lib/date'
import { SportIcon } from '@/shared/ui/SportIcon'

import { kickoffState, type KickoffState } from '../lib/kickoff'
import type { SportEvent } from '../model/types'

const BADGE = 'type-heading text-[10px] tracking-[.14em] uppercase'

const KickoffBadge = ({ state, kickoffAt }: { state: KickoffState; kickoffAt: number }) => {
  if (state.kind === 'live') {
    return (
      <span className={`flex items-center gap-1.5 text-accent ${BADGE}`}>
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        <span>Live</span>
      </span>
    )
  }

  if (state.kind === 'soon') {
    return <span className={`text-accent ${BADGE}`}>Starts in {state.minutes}m</span>
  }

  return (
    <span className="text-[10px] font-semibold tracking-[.14em] text-ink/65 uppercase">
      {formatKickoff(kickoffAt)}
    </span>
  )
}

export const LeagueStrip = ({ event, now }: { event: SportEvent; now: number }) => (
  <div className="flex items-center gap-2.5 px-matchup-x pt-2.5 pb-1.5">
    <SportIcon sport={event.sport} size={14} className="text-ink/65" />
    <span className="text-[10px] font-semibold tracking-[.14em] text-ink/65 uppercase">
      {event.league}
    </span>
    <KickoffBadge state={kickoffState(event.kickoffAt, now)} kickoffAt={event.kickoffAt} />
  </div>
)
