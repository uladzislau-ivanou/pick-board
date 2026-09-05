import { formatKickoff } from '@/shared/lib/date'

import type { KickoffState } from '../lib/kickoff'

const BADGE = 'type-heading text-[10px] tracking-[.14em] uppercase'

export const KickoffBadge = ({ state, kickoffAt }: { state: KickoffState; kickoffAt: number }) => {
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
