import type { Pick, PickPeriod } from '@/entities/pick'
import { DailyPerformanceChart } from '@/features/daily-performance'
import { PickPatternCard } from '@/features/pick-insights'

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
  <div className="mt-5 overflow-hidden rounded-t-lg border border-divider bg-neutral-100">
    <PickPatternCard picks={picks} now={now} />
    <DailyPerformanceChart
      picks={picks}
      period={period}
      now={now}
      selectedDay={selectedDay}
      onSelectDay={onSelectDay}
    />
  </div>
)
