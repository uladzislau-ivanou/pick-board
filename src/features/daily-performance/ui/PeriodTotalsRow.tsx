import type { PeriodTotals } from '@/entities/pick'
import { cn } from '@/shared/lib/cn'
import { formatMoney, formatSigned } from '@/shared/lib/money'
import { LabeledValue } from '@/shared/ui/LabeledValue'

const VALUE = 'text-[13px]'

export const PeriodTotalsRow = ({ totals }: { totals: PeriodTotals }) => (
  <div className="flex flex-wrap gap-4">
    <LabeledValue label="Staked" value={formatMoney(totals.staked)} valueClassName={VALUE} />
    <LabeledValue label="Returned" value={formatMoney(totals.returned)} valueClassName={VALUE} />
    <LabeledValue
      label="Net"
      value={formatSigned(totals.net)}
      valueClassName={cn(VALUE, totals.net > 0 && 'text-pb-win', totals.net < 0 && 'text-pb-loss')}
    />
  </div>
)
