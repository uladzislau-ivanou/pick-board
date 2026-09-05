import { countBySport, type SportEvent } from '@/entities/event'
import { SPORTS, SPORT_LABELS } from '@/shared/config/sports'

import type { SportFilterValue } from '../lib/filter-by-sport'
import { SportChip } from './SportChip'

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
    <div
      role="group"
      aria-label="Filter by sport"
      className="grid grid-cols-2 gap-2 p-3.5 sm:grid-cols-3 lg:grid-cols-6"
    >
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
          sport={sport}
          selected={value === sport}
          onClick={() => onChange(sport)}
        />
      ))}
    </div>
  )
}
