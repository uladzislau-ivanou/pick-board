import type { Pick } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'

import type { Insight } from '../model/insight'

const recentResults = (resolved: readonly Pick[], insight: Insight) => {
  const scoped = insight.scope
    ? resolved.filter((pick) => pick.market === insight.scope)
    : [...resolved]

  return scoped.slice(0, 5).reverse()
}

export const EvidenceStrip = ({
  resolved,
  insight,
}: {
  resolved: readonly Pick[]
  insight: Insight
}) => {
  const results = recentResults(resolved, insight)
  if (results.length === 0) return null

  return (
    <div className="flex shrink-0 items-center gap-2 max-sm:basis-full">
      <span className="sr-only">
        Last {results.length} {insight.scope ?? 'resolved'}
      </span>
      <ul className="flex min-w-29 justify-end gap-1 max-sm:min-w-0 max-sm:justify-start">
        {results.map((pick) => (
          <li
            key={pick.id}
            className={cn(
              'flex size-5 items-center justify-center rounded-sm type-heading text-[10px] text-on-field',
              pick.status === 'Won' ? 'bg-pb-win-field' : 'bg-pb-loss-field',
            )}
          >
            <span className="sr-only">{pick.status}</span>
            <span aria-hidden>{pick.status === 'Won' ? 'W' : 'L'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
