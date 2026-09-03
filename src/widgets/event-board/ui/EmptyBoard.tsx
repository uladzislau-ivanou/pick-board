import type { SportFilterValue } from '@/features/filter-events-by-sport'
import { SPORT_LABELS } from '@/shared/config/sports'
import { Button } from '@/shared/ui/Button'

export const EmptyBoard = ({
  sport,
  onClearFilter,
}: {
  sport: SportFilterValue
  onClearFilter: () => void
}) => (
  <div className="mt-6.5 border-t-2 border-divider pt-10 pb-11">
    <div className="max-w-[440px]">
      <h4 className="text-[20px]">
        {sport === 'all'
          ? 'No events scheduled.'
          : `No ${SPORT_LABELS[sport].toLowerCase()} events scheduled.`}
      </h4>
      <p className="mt-2 text-[13.5px]/[1.5] text-ink/60">
        Nothing in the next seven days for this filter. Clear it to see the whole board.
      </p>
      <Button variant="primary" className="mt-4" onClick={onClearFilter}>
        All sports
      </Button>
    </div>
  </div>
)
