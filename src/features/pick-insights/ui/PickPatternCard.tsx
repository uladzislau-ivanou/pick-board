import { useCallback, useState } from 'react'

import { resolvedPicks, type Pick } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'

import { getPickInsights } from '../model/get-pick-insights'
import type { InsightTone } from '../model/insight'
import { useAutoAdvance } from '../model/use-auto-advance'
import { EvidenceStrip } from './EvidenceStrip'
import { PatternCarouselControls } from './PatternCarouselControls'

const RULES: Record<InsightTone, string> = {
  good: 'bg-pb-win',
  neutral: 'bg-pb-brand',
  bad: 'bg-pb-loss',
}

const KICKERS: Record<InsightTone, string> = {
  good: 'border-pb-win/45 text-pb-win',
  neutral: 'border-pb-brand/45 text-pb-brand',
  bad: 'border-pb-loss/45 text-pb-loss',
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
        'flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-divider bg-neutral-200 px-4.5 py-3',
        className,
      )}
    >
      <span aria-hidden className={cn('h-9 w-[3px] shrink-0 rounded-full', RULES[insight.tone])} />

      <div
        key={index}
        className="flex min-w-50 flex-1 animate-pb-in-fast flex-wrap items-baseline gap-x-3 gap-y-1"
      >
        <span
          className={cn(
            'rounded-sm border px-1.75 py-0.75 text-[10px] font-semibold tracking-[.12em] uppercase',
            KICKERS[insight.tone],
          )}
        >
          {insight.kicker}
        </span>
        <h2 className="text-[15.5px] tracking-[-0.01em] text-pretty">{insight.headline}</h2>
        <p className="text-[12.5px] text-pretty text-ink/70">{insight.detail}</p>
      </div>

      <EvidenceStrip resolved={resolvedPicks(picks)} insight={insight} />

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
