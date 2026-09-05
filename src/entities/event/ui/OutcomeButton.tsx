import { cn } from '@/shared/lib/cn'
import { useFormatOdds } from '@/shared/lib/odds'

import type { Market, Outcome } from '../model/types'
import { outcomeLine } from '../lib/market-grid'

export const OutcomeButton = ({
  market,
  outcome,
  rowName,
  onSelect,
}: {
  market: Market
  outcome: Outcome
  rowName: string
  onSelect: (outcome: Outcome) => void
}) => {
  const formatOdds = useFormatOdds()
  const line = outcomeLine(market, outcome, rowName)
  const price = formatOdds(outcome.odds)

  return (
    <button
      type="button"
      aria-label={`${outcome.label} at ${price}`}
      onClick={() => onSelect(outcome)}
      className="flex min-h-11 flex-col items-center justify-center rounded-md border border-divider bg-ground px-1 py-1.5 leading-none transition-colors hover:border-pb-brand hover:bg-pb-brand-tint active:bg-pb-brand-tint-2"
    >
      {line === null ? null : (
        <span className="type-heading text-[12.5px] tracking-[-0.01em]">{line}</span>
      )}
      <span
        className={cn(
          'tracking-[-0.01em]',
          line === null
            ? 'type-heading text-[14px] text-ink'
            : 'mt-1 text-[11px] font-medium text-ink/65',
        )}
      >
        {price}
      </span>
    </button>
  )
}
