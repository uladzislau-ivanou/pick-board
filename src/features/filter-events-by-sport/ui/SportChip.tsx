import { cn } from '@/shared/lib/cn'
import { plural } from '@/shared/lib/text'
import { Chip } from '@/shared/ui/Chip'

export const SportChip = ({
  label,
  count,
  selected,
  onClick,
}: {
  label: string
  count: number
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
    {label}
    <span className={cn('font-medium', selected ? 'opacity-70' : 'text-ink/55')}>{count}</span>
  </Chip>
)
