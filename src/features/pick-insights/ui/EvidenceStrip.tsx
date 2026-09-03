import type { Pick } from '@/entities/pick'

import type { Insight } from '../model/insight'

/** Oldest to newest, so the strip reads left to right like a timeline. */
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
    <div>
      <p className="text-[10px] font-semibold tracking-[.12em] whitespace-nowrap uppercase opacity-70">
        Last {results.length} {insight.scope ?? 'resolved'}
      </p>
      <ul className="mt-1.5 flex gap-1">
        {results.map((pick) => (
          <li
            key={pick.id}
            className={
              pick.status === 'Won'
                ? 'flex size-5.5 items-center justify-center border border-ground bg-ground type-heading text-[11px] text-ink'
                : 'flex size-5.5 items-center justify-center border border-ground bg-ground/22 type-heading text-[11px]'
            }
          >
            <span className="sr-only">{pick.status}</span>
            <span aria-hidden>{pick.status === 'Won' ? 'W' : 'L'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
