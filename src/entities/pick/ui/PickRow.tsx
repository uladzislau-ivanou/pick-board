import { cn } from '@/shared/lib/cn'
import { formatShortDate } from '@/shared/lib/date'
import { formatMoney } from '@/shared/lib/money'
import { formatOdds } from '@/shared/lib/odds'
import { DisclosureSquare } from '@/shared/ui/DisclosureSquare'
import { LabeledValue } from '@/shared/ui/LabeledValue'

import { calculatePayout } from '../lib/calculate-payout'
import type { Pick, PickStatus } from '../model/types'
import { PickDetails } from './PickDetails'
import { PickStatusChip } from './PickStatusChip'

const RETURN_LABELS: Record<PickStatus, string> = {
  Pending: 'To return',
  Won: 'Returned',
  Lost: 'Lost',
}

const RETURN_COLORS: Record<PickStatus, string> = {
  Pending: 'text-ink',
  Won: 'text-pb-win',
  Lost: 'text-pb-loss',
}

/** A lost pick shows what it cost; everything else shows what it returns. */
const returnValue = (pick: Pick) =>
  pick.status === 'Lost'
    ? formatMoney(-pick.stake)
    : formatMoney(calculatePayout(pick.stake, pick.odds))

/**
 * Deliberately not a `<table>`: the metric columns have to wrap under the left
 * block on a phone while each keeps its own label, which a table cannot do.
 *
 * The row carries an explicit `aria-label` because the accessible name a
 * screen reader would otherwise compute from the columns runs the labels into
 * their values — "Odds1.72 Stake$25".
 */
export const PickRow = ({
  pick,
  expanded,
  onToggle,
}: {
  pick: Pick
  expanded: boolean
  onToggle: () => void
}) => {
  const pending = pick.status === 'Pending'
  const detailId = `pick-detail-${pick.id}`
  const returned = returnValue(pick)

  return (
    <div className={cn('border-b border-divider', pending && 'bg-ground')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailId}
        aria-label={[
          `${pick.selection}, ${pick.market}, ${pick.event}`,
          `odds ${formatOdds(pick.odds)}`,
          `stake ${formatMoney(pick.stake)}`,
          `${RETURN_LABELS[pick.status].toLowerCase()} ${returned}`,
          pick.status,
        ].join('. ')}
        className="flex w-full flex-wrap items-center gap-5 px-5 py-3.5 text-left hover:bg-neutral-200"
      >
        <span className="flex-1 basis-60">
          <span className="block text-[10px] font-semibold tracking-[.12em] text-ink/50 uppercase">
            {pick.market} · {formatShortDate(pick.placedAt)}
          </span>
          <span className="block type-heading text-[14.5px]">{pick.selection}</span>
          <span className="block text-[12px] text-ink/60">
            {pick.event}
            {pending ? ' · settles at kickoff' : ''}
          </span>
        </span>

        <LabeledValue label="Odds" value={formatOdds(pick.odds)} className="w-18.5" />
        <LabeledValue label="Stake" value={formatMoney(pick.stake)} className="w-18.5" />
        <LabeledValue
          label={RETURN_LABELS[pick.status]}
          value={returned}
          className="w-24"
          valueClassName={RETURN_COLORS[pick.status]}
        />

        <PickStatusChip status={pick.status} className="w-23 justify-center" />
        <DisclosureSquare open={expanded} />
      </button>

      {expanded ? <PickDetails id={detailId} pick={pick} /> : null}
    </div>
  )
}
