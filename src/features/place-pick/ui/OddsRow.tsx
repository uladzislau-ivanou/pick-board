import { formatOdds } from '@/shared/lib/odds'

export const OddsRow = ({ odds }: { odds: number }) => (
  <div className="flex items-center justify-between border border-divider bg-neutral-200 px-3.5 py-3">
    <span className="text-[10px] font-semibold tracking-[.12em] text-ink/60 uppercase">Odds</span>
    <span className="type-heading text-[18px] text-pb-brand">{formatOdds(odds)}</span>
  </div>
)
