import { formatOdds } from '@/shared/lib/odds'

import type { Outcome } from '../model/types'

/** The board's primary interaction. Presentational: the handler is injected. */
export const OutcomeButton = ({
  outcome,
  onSelect,
}: {
  outcome: Outcome
  onSelect: (outcome: Outcome) => void
}) => (
  <button
    type="button"
    // Without this the name computes as "Celtics1.72": the label and the odds
    // are adjacent elements with no whitespace between them.
    aria-label={`${outcome.label} at ${formatOdds(outcome.odds)}`}
    onClick={() => onSelect(outcome)}
    className="flex min-h-[46px] w-full items-center justify-between gap-3 border border-divider bg-ground px-3 py-2.5 text-left transition-colors hover:border-pb-brand hover:bg-pb-brand-tint active:bg-pb-brand-tint-2"
  >
    <span className="text-[13.5px] font-medium">{outcome.label}</span>
    <span className="type-heading text-[14px] text-pb-brand">{formatOdds(outcome.odds)}</span>
  </button>
)
