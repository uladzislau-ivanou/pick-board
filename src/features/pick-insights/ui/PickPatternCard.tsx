import { useCallback, useState } from 'react'

import { resolvedPicks, type Pick } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'

import { getPickInsights } from '../model/get-pick-insights'
import type { InsightTone } from '../model/insight'
import { useAutoAdvance } from '../model/use-auto-advance'
import { EvidenceStrip } from './EvidenceStrip'
import { PatternCarouselControls } from './PatternCarouselControls'

const RULES: Record<InsightTone, string> = {
  good: 'border-pb-win',
  neutral: 'border-pb-brand',
  bad: 'border-pb-loss',
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
      <div
        key={index}
        className={cn(
          'flex min-w-50 flex-1 animate-pb-in-fast flex-wrap items-baseline gap-x-3 gap-y-1 border-l-[3px] pl-4 max-sm:basis-full',
          RULES[insight.tone],
        )}
      >
        <span
          className={cn(
            'shrink-0 rounded-sm border px-1.75 py-0.75 text-[10px] font-semibold tracking-[.12em] uppercase',
            KICKERS[insight.tone],
          )}
        >
          {insight.kicker}
        </span>
        <h2 className="line-clamp-2 min-w-0 flex-1 text-[15.5px] tracking-[-0.01em] text-pretty max-[359px]:min-h-[2lh] max-sm:basis-full">
          {insight.headline}
        </h2>
        <p className="line-clamp-2 basis-full text-[12.5px] text-pretty text-ink/70 max-sm:min-h-[2lh]">
          {insight.detail}
        </p>
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
