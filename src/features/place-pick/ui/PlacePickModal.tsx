import { X } from 'lucide-react'
import { useRef } from 'react'

import { calculatePayout, calculateProfit } from '@/entities/pick'
import { formatMoney } from '@/shared/lib/money'
import { ODDS_FORMAT_LABELS, useFormatOdds, useOddsFormat } from '@/shared/lib/odds'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { SportIcon } from '@/shared/ui/SportIcon'

import { validateStake } from '../lib/stake'
import type { PickDraft } from '../model/types'
import { QuickStakes } from './QuickStakes'
import { StakeField } from './StakeField'

const CAPTION = 'text-[10px] font-semibold tracking-[.12em] text-ink/70 uppercase'

const OddsRow = ({ odds }: { odds: number }) => {
  const formatOdds = useFormatOdds()
  const { format } = useOddsFormat()

  return (
    <div className="flex items-center justify-between rounded-md border border-divider bg-neutral-200 px-3.5 py-3">
      <span className={CAPTION}>Odds · {ODDS_FORMAT_LABELS[format]}</span>
      <span className="type-heading text-[18px]">{formatOdds(odds)}</span>
    </div>
  )
}

const PayoutBlock = ({ payout, profit }: { payout: number; profit: number }) => (
  <div className="flex items-end justify-between gap-4 border-t-2 border-divider pt-3.5">
    <div>
      <p className={CAPTION}>To win</p>
      <p className="type-heading text-[20px] tracking-[-0.02em] text-pb-win">
        {formatMoney(profit)}
      </p>
    </div>
    <div className="text-right">
      <p className={CAPTION}>Total return</p>
      <p className="type-heading text-[30px] tracking-[-0.03em]">{formatMoney(payout)}</p>
    </div>
  </div>
)

const TITLE_ID = 'place-pick-title'
const ERROR_ID = 'place-pick-error'
const STAKE_ID = 'place-pick-stake'

export const PlacePickModal = ({
  draft,
  stake,
  onStakeChange,
  onClose,
  onConfirm,
}: {
  draft: PickDraft
  stake: string
  onStakeChange: (value: string) => void
  onClose: () => void
  onConfirm: (stake: number) => void
}) => {
  const stakeInputRef = useRef<HTMLInputElement>(null)
  const { amount, error } = validateStake(stake)

  return (
    <Modal open onClose={onClose} labelledBy={TITLE_ID} initialFocusRef={stakeInputRef}>
      <div className="flex items-start gap-3.5 border-b-2 border-divider px-5 py-4">
        <span className="flex size-9.5 shrink-0 items-center justify-center rounded-md bg-inverse text-inverse-ink">
          <SportIcon sport={draft.sport} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[.14em] text-pb-brand uppercase">
            Place pick
          </p>
          <h2 id={TITLE_ID} className="text-[20px]">
            {draft.selection}
          </h2>
          <p className="text-[12.5px] text-ink/70">
            {draft.market} · {draft.event}
          </p>
        </div>
        <Button variant="secondary" iconOnly aria-label="Close" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-4.5 pb-5">
        <OddsRow odds={draft.odds} />
        <StakeField
          id={STAKE_ID}
          ref={stakeInputRef}
          value={stake}
          onChange={onStakeChange}
          describedBy={ERROR_ID}
        />
        <QuickStakes value={stake} onSelect={onStakeChange} />
        <p id={ERROR_ID} aria-live="polite" className="min-h-4 text-[11.5px] text-accent-ink">
          {error}
        </p>
        <PayoutBlock
          payout={calculatePayout(amount, draft.odds)}
          profit={calculateProfit(amount, draft.odds)}
        />
        <div className="flex gap-2">
          <Button variant="secondary" className="min-h-[46px] basis-[34%]" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={error !== null}
            onClick={() => onConfirm(amount)}
          >
            Place pick
          </Button>
        </div>
      </div>
    </Modal>
  )
}
