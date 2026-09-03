import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

import type { Insight } from '../model/insight'

const ARROW = 'flex size-7 items-center justify-center border border-ground/55 hover:bg-ground/18'

export const PatternCarouselControls = ({
  insights,
  index,
  onChange,
}: {
  insights: readonly Insight[]
  index: number
  onChange: (index: number) => void
}) => (
  <div className="flex items-center gap-2">
    <div className="mr-auto flex items-center gap-1.5">
      {insights.map((insight, position) => (
        <button
          key={insight.kicker + position}
          type="button"
          aria-label={insight.kicker}
          aria-current={position === index}
          onClick={() => onChange(position)}
          className={cn(
            'size-2.5 border border-ground',
            position === index ? 'bg-ground' : 'bg-transparent',
          )}
        />
      ))}
    </div>
    <button
      type="button"
      aria-label="Previous pattern"
      onClick={() => onChange(index - 1)}
      className={ARROW}
    >
      <ChevronLeft size={16} />
    </button>
    <button
      type="button"
      aria-label="Next pattern"
      onClick={() => onChange(index + 1)}
      className={ARROW}
    >
      <ChevronRight size={16} />
    </button>
  </div>
)
