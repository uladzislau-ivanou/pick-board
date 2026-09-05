import { cn } from '@/shared/lib/cn'
import { formatShortDate } from '@/shared/lib/date'
import { formatMoney } from '@/shared/lib/money'
import { useFormatOdds } from '@/shared/lib/odds'
import { Disclosure } from '@/shared/ui/Disclosure'
import { LabeledValue } from '@/shared/ui/LabeledValue'

import { calculatePayout } from '../lib/calculate-payout'
import type { Pick, PickStatus } from '../model/types'
import { PickDetails } from './PickDetails'
import { PickStatusChip } from './PickStatusChip'
import { PICK_METRIC_GAP, PICK_METRIC_WIDTHS, PICK_STATUS_WIDTH } from './pick-row-layout'

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

const ROW_RULES: Record<PickStatus, string> = {
  Pending: 'shadow-[inset_3px_0_0_0_var(--color-pb-brand)]',
  Won: 'shadow-[inset_3px_0_0_0_var(--color-pb-win)]',
  Lost: 'shadow-[inset_3px_0_0_0_var(--color-pb-loss)]',
}

const HIDE_WIDE = '@2xl/ledger:hidden'

const returnValue = (pick: Pick) =>
  pick.status === 'Lost'
    ? formatMoney(-pick.stake)
    : formatMoney(calculatePayout(pick.stake, pick.odds))

export const PickRow = ({
  pick,
  expanded,
  onToggle,
}: {
  pick: Pick
  expanded: boolean
  onToggle: () => void
}) => {
  const formatOdds = useFormatOdds()
  const pending = pick.status === 'Pending'
  const detailId = `pick-detail-${pick.id}`
  const returned = returnValue(pick)

  return (
    <div className={cn('border-b border-divider', ROW_RULES[pick.status], pending && 'bg-ground')}>
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
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-5 gap-y-3 px-5 py-3 text-left hover:bg-neutral-200 @2xl/ledger:grid-cols-[1fr_auto_auto]"
      >
        <span className="col-start-1 row-start-1 min-w-0">
          <span className="block text-[10px] font-semibold tracking-[.12em] text-ink/65 uppercase">
            {pick.market} · {formatShortDate(pick.placedAt)}
          </span>
          <span className="block type-heading text-[14.5px]">{pick.selection}</span>
          <span className="block text-[12px] text-ink/70">
            {pick.event}
            {pending ? ' · settles at kickoff' : ''}
          </span>
        </span>

        <span
          className={cn(
            'col-span-2 col-start-1 row-start-2 flex flex-wrap gap-y-2 @2xl/ledger:col-span-1 @2xl/ledger:col-start-2 @2xl/ledger:row-start-1',
            PICK_METRIC_GAP,
          )}
        >
          <LabeledValue
            label="Odds"
            value={formatOdds(pick.odds)}
            className={PICK_METRIC_WIDTHS.odds}
            labelClassName={HIDE_WIDE}
          />
          <LabeledValue
            label="Stake"
            value={formatMoney(pick.stake)}
            className={PICK_METRIC_WIDTHS.stake}
            labelClassName={HIDE_WIDE}
          />
          <LabeledValue
            label={RETURN_LABELS[pick.status]}
            value={returned}
            className={PICK_METRIC_WIDTHS.result}
            labelClassName={HIDE_WIDE}
            valueClassName={RETURN_COLORS[pick.status]}
          />
        </span>

        <span className="col-start-2 row-start-1 flex shrink-0 items-center gap-2 @2xl/ledger:col-start-3">
          <PickStatusChip
            status={pick.status}
            className={cn('justify-center', PICK_STATUS_WIDTH)}
          />
          <Disclosure open={expanded} className="border-transparent" />
        </span>
      </button>

      {expanded ? <PickDetails id={detailId} pick={pick} /> : null}
    </div>
  )
}
