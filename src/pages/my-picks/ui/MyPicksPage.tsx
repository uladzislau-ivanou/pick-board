import { useState } from 'react'
import { useNavigate } from 'react-router'

import { usePicks } from '@/entities/pick'
import { DailyPerformanceChart } from '@/features/daily-performance'
import { PickPatternCard } from '@/features/pick-insights'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'

export const MyPicksPage = () => {
  const [now] = useState(() => Date.now())
  // Moves into features/filter-picks in Step 10; local until then.
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const { picks } = usePicks()
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        kicker="Account · Last 7 days"
        title="My Picks"
        aside={
          <Button variant="secondary" onClick={() => navigate(ROUTES.events)}>
            Back to board
          </Button>
        }
      />
      <div className="mt-5 flex flex-wrap items-stretch border border-divider bg-neutral-100">
        <PickPatternCard picks={picks} now={now} className="grow basis-82.5" />
        <DailyPerformanceChart
          picks={picks}
          period="7d"
          now={now}
          selectedDay={selectedDay}
          onSelectDay={(day) => setSelectedDay(day === selectedDay ? null : day)}
          className="grow-[2] basis-95 border-l border-divider"
        />
      </div>
      <p className="pt-6 text-[13px] text-ink/50">Totals and ledger: Steps 10 and 11.</p>
    </>
  )
}
