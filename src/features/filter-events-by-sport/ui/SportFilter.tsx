import { countBySport, type SportEvent } from '@/entities/event'
import { SPORTS, SPORT_LABELS } from '@/shared/config/sports'

import type { SportFilterValue } from '../model/types'
import { SportChip } from './SportChip'

/**
 * Controlled: the board owns the selection, because changing it also has to
 * reopen the day groups and reset the day window.
 */
export const SportFilter = ({
  events,
  value,
  onChange,
}: {
  events: readonly SportEvent[]
  value: SportFilterValue
  onChange: (sport: SportFilterValue) => void
}) => {
  const counts = countBySport(events)
  const present = SPORTS.filter((sport) => counts.has(sport))

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3.5">
      <span className="mr-1 text-[10px] font-semibold tracking-[.14em] text-ink/45 uppercase">
        Sport
      </span>
      <SportChip
        label="All"
        count={events.length}
        selected={value === 'all'}
        onClick={() => onChange('all')}
      />
      {present.map((sport) => (
        <SportChip
          key={sport}
          label={SPORT_LABELS[sport]}
          count={counts.get(sport) ?? 0}
          selected={value === sport}
          onClick={() => onChange(sport)}
        />
      ))}
    </div>
  )
}
