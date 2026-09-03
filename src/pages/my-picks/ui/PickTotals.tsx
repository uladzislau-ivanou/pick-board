import {
  isWon,
  pendingPayout,
  pendingPicks,
  resolvedPicks,
  totalStaked,
  winRate,
  type Pick,
} from '@/entities/pick'
import { cn } from '@/shared/lib/cn'
import { formatMoney } from '@/shared/lib/money'
import { plural } from '@/shared/lib/text'
import { LabeledValue } from '@/shared/ui/LabeledValue'

const Row = ({
  label,
  value,
  note,
  valueClassName,
}: {
  label: string
  value: string
  note: string
  valueClassName?: string
}) => (
  <LabeledValue
    label={label}
    value={value}
    note={note}
    className="flex flex-1 flex-col justify-center border-b border-divider px-4.5 py-2.5"
    valueClassName={cn('mt-1 text-[24px] tracking-[-0.03em]', valueClassName)}
  />
)

/**
 * Page-local rather than a widget: three read-only figures over
 * `entities/pick/lib/stats`, no interaction, exactly one consumer.
 *
 * Always all-time. The period control below scopes the chart and the ledger and
 * deliberately not these, so every sub-line says which population it counted.
 */
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
    <div className={cn('flex flex-col', className)}>
      <Row
        label="Total staked"
        value={formatMoney(totalStaked(picks))}
        note={`${plural(picks.length, 'pick')} all time`}
      />
      <Row
        label="Pending payout"
        value={formatMoney(pendingPayout(picks))}
        note={`${open.length} open · ${formatMoney(totalStaked(open))} at risk`}
        valueClassName="text-pb-brand"
      />
      <Row
        label="Win rate"
        value={rate === null ? '—' : `${Math.round(rate * 100)}%`}
        note={`${resolved.filter(isWon).length} of ${resolved.length} resolved`}
      />
    </div>
  )
}
