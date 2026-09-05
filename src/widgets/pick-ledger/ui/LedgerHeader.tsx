import { PICK_METRIC_GAP, PICK_METRIC_WIDTHS, PICK_STATUS_WIDTH } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'

const CELL = 'text-[10px] font-semibold tracking-[.12em] text-ink/65 uppercase'

export const LedgerHeader = () => (
  <div
    aria-hidden
    className="hidden grid-cols-[1fr_auto_auto] items-center gap-x-5 border-b border-divider px-5 py-2 @2xl/ledger:grid"
  >
    <span className={CELL}>Selection</span>
    <span className={cn('flex', PICK_METRIC_GAP)}>
      <span className={cn(CELL, PICK_METRIC_WIDTHS.odds)}>Odds</span>
      <span className={cn(CELL, PICK_METRIC_WIDTHS.stake)}>Stake</span>
      <span className={cn(CELL, PICK_METRIC_WIDTHS.result)}>Return</span>
    </span>
    <span className="flex items-center gap-2">
      <span className={cn(CELL, PICK_STATUS_WIDTH, 'text-center')}>Status</span>
      <span className="size-6.5" />
    </span>
  </div>
)
