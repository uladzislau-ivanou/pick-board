import { formatDayWithDate } from '@/shared/lib/date'

export const DayFilterChip = ({ day, onClear }: { day: number; onClear: () => void }) => {
  const label = formatDayWithDate(day)

  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Clear the ${label} day filter`}
      className="inline-flex min-h-8.5 items-center gap-2 rounded-md border border-pb-brand bg-pb-brand-tint py-1 pr-2 pl-2.5 text-[12px] text-pb-brand-ink"
    >
      {label}
      <span aria-hidden>✕</span>
    </button>
  )
}
