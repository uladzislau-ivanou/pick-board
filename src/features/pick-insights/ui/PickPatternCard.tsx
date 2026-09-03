import { useCallback, useState } from 'react'

import { resolvedPicks, type Pick } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'

import { getPickInsights } from '../model/get-pick-insights'
import type { InsightTone } from '../model/insight'
import { useAutoAdvance } from '../model/use-auto-advance'
import { EvidenceStrip } from './EvidenceStrip'
import { PatternCarouselControls } from './PatternCarouselControls'

const FIELDS: Record<InsightTone, string> = {
  good: 'bg-pb-win-field',
  neutral: 'bg-pb-brand-deep',
  bad: 'bg-pb-loss-field',
}

export const PickPatternCard = ({
  picks,
  now,
  className,
}: {
  picks: readonly Pick[]
  now: number
  className?: string
}) => {
  const [requestedIndex, setRequestedIndex] = useState(0)
  const advance = useCallback(() => setRequestedIndex((current) => current + 1), [])

  const insights = getPickInsights(picks, now)
  const auto = useAutoAdvance(insights.length, advance)

  const index = ((requestedIndex % insights.length) + insights.length) % insights.length
  const insight = insights[index]

  return (
    <section
      aria-label="Pattern"
      {...auto.pauseHandlers}
      className={cn(
        'flex min-h-66 flex-col justify-between gap-3.5 overflow-hidden px-4.5 pt-4 pb-3.75 text-on-field',
        FIELDS[insight.tone],
        className,
      )}
    >
      <div key={index} className="flex flex-1 animate-pb-slide flex-col justify-between gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-sm border border-on-field/40 bg-on-field/18 px-1.75 py-0.75 text-[10px] font-semibold tracking-[.14em] uppercase">
            {insight.kicker}
          </span>
          {insights.length > 1 ? (
            <span className="text-[10px] whitespace-nowrap opacity-65">
              Pattern {index + 1} / {insights.length}
            </span>
          ) : null}
        </div>

        <div>
          <h2 className="text-[21px]/[1.15] tracking-[-0.02em] text-pretty">{insight.headline}</h2>
          <p className="mt-2 text-[12.5px]/[1.5] opacity-85">{insight.detail}</p>
        </div>

        <EvidenceStrip resolved={resolvedPicks(picks)} insight={insight} />
      </div>

      {insights.length > 1 ? (
        <PatternCarouselControls
          insights={insights}
          index={index}
          onChange={(next) => {
            auto.stop()
            setRequestedIndex(next)
          }}
        />
      ) : null}
    </section>
  )
}
