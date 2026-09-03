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
