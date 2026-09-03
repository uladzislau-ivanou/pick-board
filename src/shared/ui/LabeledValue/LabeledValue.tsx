import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type LabeledValueProps = {
  label: string
  value: ReactNode
  note?: ReactNode
  className?: string
  valueClassName?: string
}

/** Summary totals, chart totals, ledger metric columns and expanded pick detail. */
export const LabeledValue = ({
  label,
  value,
  note,
  className,
  valueClassName,
}: LabeledValueProps) => (
  <div className={className}>
    <div className="text-[10px] font-semibold tracking-[.12em] text-ink/55 uppercase">{label}</div>
    <div className={cn('type-heading text-[14px] tracking-[-0.02em]', valueClassName)}>{value}</div>
    {note ? <div className="mt-0.5 text-[11px] text-ink/55">{note}</div> : null}
  </div>
)
