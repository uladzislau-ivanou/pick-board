import {
  isWon,
  pendingPayout,
  pendingPicks,
  resolvedPicks,
  totalStaked,
  winRate,
  type Pick,
} from '@/entities/pick'
import { formatMoney } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'
import { LabeledValue, LabeledValueRow } from '@/shared/ui/LabeledValue'

export const PickTotals = ({
  picks,
  className,
}: {
  picks: readonly Pick[]
  className?: string
}) => {
  const open = pendingPicks(picks)
  const resolved = resolvedPicks(picks)
  const rate = winRate(picks)

  return (
    <LabeledValueRow className={className}>
      <LabeledValue
        size="lg"
        label="Total staked"
        value={formatMoney(totalStaked(picks))}
        note={`${plural(picks.length, 'pick')} all time`}
      />
      <LabeledValue
        size="lg"
        label="Pending payout"
        value={formatMoney(pendingPayout(picks))}
        note={`${open.length} open · ${formatMoney(totalStaked(open))} at risk`}
        valueClassName="text-pb-brand"
      />
      <LabeledValue
        size="lg"
        label="Win rate"
        value={rate === null ? '—' : `${Math.round(rate * 100)}%`}
        note={`${resolved.filter(isWon).length} of ${resolved.length} resolved`}
      />
    </LabeledValueRow>
  )
}
