import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type LabeledValueProps = {
  label: string
  value: ReactNode
  note?: ReactNode
  className?: string
  valueClassName?: string
}

/**
 * Summary totals, chart totals and the ledger's metric columns. Spans rather
 * than divs, because those columns sit inside the full-width row `<button>`,
 * which may only contain phrasing content.
 */
export const LabeledValue = ({
  label,
  value,
  note,
  className,
  valueClassName,
}: LabeledValueProps) => (
  <span className={cn('block', className)}>
    <span className="block text-[10px] font-semibold tracking-[.12em] text-ink/55 uppercase">
      {label}
    </span>
    <span className={cn('block type-heading text-[14px] tracking-[-0.02em]', valueClassName)}>
      {value}
    </span>
    {note ? <span className="mt-0.5 block text-[11px] text-ink/55">{note}</span> : null}
  </span>
)
