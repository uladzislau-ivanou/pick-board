import type { Market, Outcome } from '../model/types'
import { OutcomeButton } from './OutcomeButton'

export const MarketColumn = ({
  market,
  onSelectOutcome,
}: {
  market: Market
  onSelectOutcome: (market: Market, outcome: Outcome) => void
}) => (
  <div className="flex flex-col gap-2 border-r border-divider px-4.5 pt-3.5 pb-4 last:border-r-0">
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
