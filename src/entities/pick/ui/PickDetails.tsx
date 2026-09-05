import { formatDateTime } from '@/shared/lib/date'
import { formatMoney } from '@/shared/lib/money'
import { ODDS_FORMAT_LABELS, useFormatOdds, useOddsFormat } from '@/shared/lib/odds'

import { calculatePayout } from '../lib/calculate-payout'
import type { Pick, PickStatus } from '../model/types'

const COUNTING_NOTES: Record<PickStatus, string> = {
  Pending:
    'Pending picks count toward Total Staked and Pending Payout, but not toward win rate — that only counts resolved picks.',
  Won: 'Counted as a win in your strike rate; the return above is stake plus profit.',
  Lost: 'Counted as a loss in your strike rate; the stake is gone, nothing was returned.',
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[10px] font-semibold tracking-[.12em] text-ink/65 uppercase">{label}</dt>
    <dd className="text-[13px] font-medium">{value}</dd>
  </div>
)

export const PickDetails = ({ id, pick }: { id: string; pick: Pick }) => {
  const formatOdds = useFormatOdds()
  const { format } = useOddsFormat()
  const pending = pick.status === 'Pending'
  const odds = formatOdds(pick.odds)

  return (
    <div
      id={id}
      className="animate-pb-in-fast border-t border-divider bg-neutral-200 px-5 pt-4 pb-4.5"
    >
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-4">
        <DetailItem
          label="Odds at placement"
          value={`${odds} ${ODDS_FORMAT_LABELS[format].toLowerCase()}`}
        />
        <DetailItem label="Placed" value={formatDateTime(pick.placedAt)} />
        <DetailItem
          label={pending ? 'Settles' : 'Settled'}
          value={
            pending || pick.settledAt === undefined ? 'At kickoff' : formatDateTime(pick.settledAt)
          }
        />
        <DetailItem label="Market" value={pick.market} />
        <DetailItem
          label="Payout if it lands"
          value={`${formatMoney(pick.stake)} at ${odds} returns ${formatMoney(calculatePayout(pick.stake, pick.odds))}`}
        />
      </dl>
      <p className="mt-4 max-w-[620px] text-[12px]/[1.5] text-ink/70">
        {COUNTING_NOTES[pick.status]}
      </p>
    </div>
  )
}
