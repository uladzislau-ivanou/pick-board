import type { DayGroup } from '@/entities/event'
import { plural } from '@/shared/lib/text'
import { Disclosure } from '@/shared/ui/Disclosure'

export const DayGroupHeader = ({
  group,
  open,
  panelId,
  onToggle,
}: {
  group: DayGroup
  open: boolean
  panelId: string
  onToggle: () => void
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    aria-controls={panelId}
    className="flex w-full items-center justify-between gap-4 py-3.25 text-left hover:opacity-65"
  >
    <span className="flex flex-wrap items-baseline gap-3">
      <span className="type-heading text-[19px] uppercase">{group.label}</span>
      <span className="text-[11px] font-semibold tracking-[.12em] whitespace-nowrap text-ink/65 uppercase">
        {group.dateLabel} · {plural(group.events.length, 'event')}
      </span>
    </span>
    <Disclosure open={open} />
  </button>
)
