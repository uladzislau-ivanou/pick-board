import { X } from 'lucide-react'
import { useRef } from 'react'

import { calculatePayout, calculateProfit } from '@/entities/pick'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { SportIcon } from '@/shared/ui/SportIcon'

import { validateStake } from '../lib/validate-stake'
import type { PickDraft } from '../model/types'
import { OddsRow } from './OddsRow'
import { PayoutBlock } from './PayoutBlock'
import { QuickStakes } from './QuickStakes'
import { StakeField } from './StakeField'

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
      <div className="flex items-start gap-3.5 border-b-2 border-divider p-5">
        <span className="flex size-9.5 shrink-0 items-center justify-center bg-neutral-900 text-ground">
          <SportIcon sport={draft.sport} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[.14em] text-pb-brand uppercase">
            Place pick
          </p>
          <h3 id={TITLE_ID} className="text-[20px]">
            {draft.selection}
          </h3>
          <p className="text-[12.5px] text-ink/60">
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
        {/* Always rendered so the line reserves its space and nothing shifts. */}
        <p id={ERROR_ID} aria-live="polite" className="min-h-4 text-[11.5px] text-accent-700">
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
