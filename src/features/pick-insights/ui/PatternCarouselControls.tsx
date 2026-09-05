import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

import type { Insight } from '../model/insight'

const ARROW =
  'flex size-7 items-center justify-center rounded-sm border border-divider text-ink/70 hover:border-pb-brand hover:bg-pb-brand-tint hover:text-pb-brand'

export const PatternCarouselControls = ({
  insights,
  index,
  onChange,
}: {
  insights: readonly Insight[]
  index: number
  onChange: (index: number) => void
}) => (
  <div className="flex shrink-0 items-center gap-2 max-sm:w-full">
    <span className="mr-1 text-[10px] whitespace-nowrap text-ink/65">
      Pattern {index + 1} / {insights.length}
    </span>
    <div className="flex items-center gap-0.5">
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
              'size-2 rounded-full border border-ink/45',
              position === index ? 'bg-ink' : 'bg-transparent',
            )}
          />
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2 max-sm:ml-auto">
      <button
        type="button"
        aria-label="Previous pattern"
        onClick={() => onChange(index - 1)}
        className={ARROW}
      >
        <ChevronLeft size={15} />
      </button>
      <button
        type="button"
        aria-label="Next pattern"
        onClick={() => onChange(index + 1)}
        className={ARROW}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  </div>
)
