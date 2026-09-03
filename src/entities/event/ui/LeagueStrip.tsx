import { formatKickoff } from '@/shared/lib/date'
import { plural } from '@/shared/lib/text'
import { SportIcon } from '@/shared/ui/SportIcon'
import { Tag } from '@/shared/ui/Tag'

import type { SportEvent } from '../model/types'

export const LeagueStrip = ({ event }: { event: SportEvent }) => (
  <div className="flex items-center gap-2.5 border-b border-divider bg-neutral-200 px-4.5 py-2">
    <SportIcon sport={event.sport} className="text-ink/70" />
    <span className="flex-1 text-[10px] font-semibold tracking-[.14em] text-ink/60 uppercase">
      {event.league} · {formatKickoff(event.kickoffAt)}
    </span>
    <Tag>{plural(event.markets.length, 'market')}</Tag>
  </div>
)
