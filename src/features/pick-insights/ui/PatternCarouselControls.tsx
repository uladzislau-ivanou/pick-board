import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

import type { Insight } from '../model/insight'

const ARROW =
  'flex size-7 items-center justify-center rounded-sm border border-on-field/55 hover:bg-on-field/18'

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
          className="flex size-6 items-center justify-center"
        >
          <span
            className={cn(
              'size-2.5 rounded-full border border-on-field',
              position === index ? 'bg-on-field' : 'bg-transparent',
            )}
          />
        </button>
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
