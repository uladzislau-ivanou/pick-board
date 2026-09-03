import type { Pick, PickPeriod } from '@/entities/pick'
import { DailyPerformanceChart } from '@/features/daily-performance'
import { PickPatternCard } from '@/features/pick-insights'

/**
 * Layout only. It holds no state of its own — a widget here would take
 * `period`, `selectedDay`, `picks` and their setters straight back out as
 * props, and the period it received would still have to be owned above it,
 * because the ledger below reads the same value.
 *
 * 40 / 60 between the pattern read and the chart. Percentage bases give those
 * ratios exactly on a wide screen, and the `min-w-*` floors are what force a
 * wrap on a narrow one; the bases alone never would, since they always fit. No
 * floor may exceed the width left at 320px, or this container's
 * `overflow-hidden` clips a child instead of wrapping it.
 *
 * The chart's basis subtracts the `gap-px`. Bases summing to exactly 100% plus
 * any gap overflow the line by that gap, and the row silently wraps — which is
 * valid layout, so nothing errors and no overflow check catches it.
 *
 * The rule between the two is `gap-px` over a divider-coloured ground, not a
 * border on the child. A `border-l` is correct only while they sit side by
 * side; once they wrap it draws a stray rule down a full-width block's left
 * edge. A gap becomes a horizontal rule on its own.
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
  <div className="mt-5 flex flex-wrap items-stretch gap-px overflow-hidden rounded-t-lg border border-divider bg-divider">
    <PickPatternCard picks={picks} now={now} className="min-w-65 grow basis-[40%]" />
    <DailyPerformanceChart
      picks={picks}
      period={period}
      now={now}
      selectedDay={selectedDay}
      onSelectDay={onSelectDay}
      className="min-w-65 grow-[2] basis-[calc(60%-1px)]"
    />
  </div>
)
