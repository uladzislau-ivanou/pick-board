import { SportIcon } from '@/shared/ui/SportIcon'

import { kickoffState } from '../lib/kickoff'
import type { SportEvent } from '../model/types'
import { KickoffBadge } from './KickoffBadge'

export const LeagueStrip = ({ event, now }: { event: SportEvent; now: number }) => (
  <div className="flex items-center gap-2.5 px-matchup-x pt-2.5 pb-1.5">
    <SportIcon sport={event.sport} size={14} className="text-ink/65" />
    <span className="text-[10px] font-semibold tracking-[.14em] text-ink/65 uppercase">
      {event.league}
    </span>
    <KickoffBadge state={kickoffState(event.kickoffAt, now)} kickoffAt={event.kickoffAt} />
  </div>
)
