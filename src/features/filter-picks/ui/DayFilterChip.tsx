import { formatDayWithDate } from '@/shared/lib/date'

/**
 * Not `shared/ui/Chip`: the handoff gives this one a tint fill with a brand
 * border, which is Chip's hover state rather than either of its variants.
 */
export const DayFilterChip = ({ day, onClear }: { day: number; onClear: () => void }) => {
  const label = formatDayWithDate(day)

  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Clear the ${label} day filter`}
      className="inline-flex min-h-8.5 items-center gap-2 border border-pb-brand bg-pb-brand-tint px-2.5 text-[12px] text-pb-brand-ink"
    >
      {label}
      <span aria-hidden>✕</span>
    </button>
  )
}
