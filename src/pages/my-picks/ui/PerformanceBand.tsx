import type { Pick, PickPeriod } from '@/entities/pick'
import { DailyPerformanceChart } from '@/features/daily-performance'
import { PickPatternCard } from '@/features/pick-insights'

import { PickTotals } from './PickTotals'

/**
 * Layout only. It holds no state of its own — a widget here would take
 * `period`, `selectedDay`, `picks` and their setters straight back out as
 * props, and the period it received would still have to be owned above it,
 * because the ledger below reads the same value.
 *
 * `min-w-0` on all three: without it a flex item refuses to shrink below its
 * content and the band overflows the page at 375px.
 */
export const PerformanceBand = ({
  picks,
  now,
  period,
  selectedDay,
  onSelectDay,
}: {
  picks: readonly Pick[]
  now: number
  period: PickPeriod
  selectedDay: number | null
  onSelectDay: (day: number) => void
}) => (
  <div className="mt-5 flex flex-wrap items-stretch border border-divider bg-neutral-100">
    <PickPatternCard picks={picks} now={now} className="min-w-0 grow basis-82.5" />
    <PickTotals picks={picks} className="min-w-0 grow basis-52.5 border-l border-divider" />
    <DailyPerformanceChart
      picks={picks}
      period={period}
      now={now}
      selectedDay={selectedDay}
      onSelectDay={onSelectDay}
      className="min-w-0 grow-[2] basis-95 border-l border-divider"
    />
  </div>
)
