import type { Sport } from '@/shared/config/sports'
import { cn } from '@/shared/lib/cn'
import { plural } from '@/shared/lib/text'
import { Chip } from '@/shared/ui/Chip'
import { SportIcon } from '@/shared/ui/SportIcon'

export const SportChip = ({
  label,
  count,
  sport,
  selected,
  onClick,
}: {
  label: string
  count: number
  /** Absent on the "All" chip, which has no single sport to draw. */
  sport?: Sport
  selected: boolean
  onClick: () => void
}) => (
  <Chip
    selected={selected}
    onClick={onClick}
    // The label and count are adjacent elements, so the computed name would
    // otherwise run together as "Basketball5".
    aria-label={`${label}, ${plural(count, 'event')}`}
    className="min-h-8.5 py-1.5"
  >
    {sport ? <SportIcon sport={sport} size={15} className="shrink-0 opacity-80" /> : null}
    {label}
    <span className={cn('font-medium', selected ? 'opacity-70' : 'text-ink/55')}>{count}</span>
  </Chip>
)
