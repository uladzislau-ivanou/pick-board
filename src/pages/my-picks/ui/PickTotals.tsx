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

const Total = ({
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
  <div className="border-l border-divider pl-4 first:border-l-0 first:pl-0">
    <div className="text-[10px] font-semibold tracking-[.12em] text-ink/55 uppercase">{label}</div>
    <div className={cn('type-heading text-[19px] tracking-[-0.03em]', valueClassName)}>{value}</div>
    <div className="text-[10.5px] text-ink/55">{note}</div>
  </div>
)

/**
 * Page-local rather than a widget: three read-only figures over
 * `entities/pick/lib/stats`, no interaction, exactly one consumer.
 *
 * It rides in the page header instead of the band below, because three short
 * numbers did not earn a full column beside the chart — and the header had the
 * room going spare.
 *
 * Always all-time. The period control scopes the chart and the ledger and
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
    <div className={cn('flex flex-wrap gap-x-4 gap-y-3', className)}>
      <Total
        label="Total staked"
        value={formatMoney(totalStaked(picks))}
        note={`${plural(picks.length, 'pick')} all time`}
      />
      <Total
        label="Pending payout"
        value={formatMoney(pendingPayout(picks))}
        note={`${open.length} open · ${formatMoney(totalStaked(open))} at risk`}
        valueClassName="text-pb-brand"
      />
      <Total
        label="Win rate"
        value={rate === null ? '—' : `${Math.round(rate * 100)}%`}
        note={`${resolved.filter(isWon).length} of ${resolved.length} resolved`}
      />
    </div>
  )
}
