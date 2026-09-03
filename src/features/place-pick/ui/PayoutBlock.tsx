import { formatMoney } from '@/shared/lib/money'

export const PayoutBlock = ({ payout, profit }: { payout: number; profit: number }) => (
  <div className="flex items-end justify-between gap-4 border-t-2 border-divider pt-3.5">
    <div>
      <p className="text-[10px] font-semibold tracking-[.12em] text-ink/60 uppercase">
        Potential payout
      </p>
      <p className="text-[12px] text-ink/55">Returns {formatMoney(profit)} profit</p>
    </div>
    <p className="type-heading text-[30px] tracking-[-0.03em]">{formatMoney(payout)}</p>
  </div>
)
