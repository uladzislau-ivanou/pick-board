import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type LabeledValueProps = {
  label: string
  value: ReactNode
  note?: ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export const LabeledValue = ({
  label,
  value,
  note,
  className,
  labelClassName,
  valueClassName,
}: LabeledValueProps) => (
  <span className={cn('block', className)}>
    <span
      className={cn(
        'block text-[10px] font-semibold tracking-[.12em] text-ink/65 uppercase',
        labelClassName,
      )}
    >
      {label}
    </span>
    <span className={cn('block type-heading text-[14px] tracking-[-0.02em]', valueClassName)}>
      {value}
    </span>
    {note ? <span className="mt-0.5 block text-[11px] text-ink/65">{note}</span> : null}
  </span>
)
