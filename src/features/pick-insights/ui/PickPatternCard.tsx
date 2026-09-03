import { useState } from 'react'

import { resolvedPicks, type Pick } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'

import { getPickInsights } from '../model/get-pick-insights'
import type { InsightTone } from '../model/insight'
import { EvidenceStrip } from './EvidenceStrip'
import { PatternCarouselControls } from './PatternCarouselControls'

/** The field colour carries the tone, so nothing is hidden by being one click away. */
const FIELDS: Record<InsightTone, string> = {
  good: 'bg-pb-win',
  neutral: 'bg-pb-brand-ink',
  bad: 'bg-pb-loss',
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

  const insights = getPickInsights(picks, now)
  // Wraps in both directions, and survives the list changing length.
  const index = ((requestedIndex % insights.length) + insights.length) % insights.length
  const insight = insights[index]

  return (
    <section
      aria-label="Pattern"
      className={cn(
        'flex min-h-66 flex-col justify-between gap-3.5 p-4 pt-4 pb-3.5 text-ground',
        FIELDS[insight.tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="border border-ground/40 bg-ground/18 px-1.5 py-0.5 text-[10px] font-semibold tracking-[.14em] uppercase">
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

      <div className="flex flex-col gap-3">
        <EvidenceStrip resolved={resolvedPicks(picks)} insight={insight} />
        {insights.length > 1 ? (
          <PatternCarouselControls insights={insights} index={index} onChange={setRequestedIndex} />
        ) : null}
      </div>
    </section>
  )
}
