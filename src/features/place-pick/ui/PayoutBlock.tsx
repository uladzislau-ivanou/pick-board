import { formatMoney } from '@/shared/lib/money'

export const PayoutBlock = ({ payout, profit }: { payout: number; profit: number }) => (
  <div className="flex items-end justify-between gap-4 border-t-2 border-divider pt-3.5">
    <div>
      <p className="text-[10px] font-semibold tracking-[.12em] text-ink/70 uppercase">To win</p>
      <p className="type-heading text-[20px] tracking-[-0.02em] text-pb-win">
        {formatMoney(profit)}
      </p>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-semibold tracking-[.12em] text-ink/70 uppercase">
        Total return
      </p>
      <p className="type-heading text-[30px] tracking-[-0.03em]">{formatMoney(payout)}</p>
    </div>
  </div>
)
