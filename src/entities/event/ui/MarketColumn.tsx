import type { Market, Outcome } from '../model/types'
import { OutcomeButton } from './OutcomeButton'

/**
 * The column rule is a left border, not a right one: the matchup divider above
 * is the home cell's left border, so a right border here would sit one
 * border-width to its left and the two centre lines would not meet.
 */
export const MarketColumn = ({
  market,
  onSelectOutcome,
}: {
  market: Market
  onSelectOutcome: (market: Market, outcome: Outcome) => void
}) => (
  <div className="flex flex-col gap-2 border-l border-divider px-4.5 pt-3.5 pb-4 first:border-l-0">
    <div className="text-[10px] font-semibold tracking-[.12em] text-ink/50 uppercase">
      {market.name}
    </div>
    {market.outcomes.map((outcome) => (
      <OutcomeButton
        key={outcome.id}
        outcome={outcome}
        onSelect={(selected) => onSelectOutcome(market, selected)}
      />
    ))}
  </div>
)
