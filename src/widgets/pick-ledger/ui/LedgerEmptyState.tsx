import type { PickTab } from '@/features/filter-picks'
import { formatDayWithDate } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'

const TAB_COPY: Record<PickTab, { title: string; body: string }> = {
  pending: {
    title: 'Nothing open right now.',
    body: 'Picks you place stay here until their event kicks off and settles.',
  },
  settled: {
    title: 'No settled picks in this period.',
    body: 'Your win rate and pattern read fill in as soon as picks start settling.',
  },
}

export const LedgerEmptyState = ({
  tab,
  dayFilter,
  onBrowseEvents,
}: {
  tab: PickTab
  dayFilter: number | null
  onBrowseEvents: () => void
}) => {
  const copy =
    dayFilter === null
      ? TAB_COPY[tab]
      : {
          title: `No ${tab} picks on ${formatDayWithDate(dayFilter)}.`,
          body: 'Clear the day filter above to see the rest of this period.',
        }

  return (
    <div className="px-5 pt-10 pb-11">
      <div className="max-w-[440px]">
        <h4 className="text-[20px]">{copy.title}</h4>
        <p className="mt-2 text-[13.5px]/[1.5] text-ink/60">{copy.body}</p>
        <Button variant="primary" className="mt-4" onClick={onBrowseEvents}>
          Browse events
        </Button>
      </div>
    </div>
  )
}
