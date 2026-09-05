import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

const VALUE_SIZES = {
  sm: 'text-[14px] tracking-[-0.02em]',
  lg: 'text-[19px] tracking-[-0.03em]',
} as const

const NOTE_SIZES = {
  sm: 'mt-0.5 text-[11px]',
  lg: 'text-[10.5px]',
} as const

type LabeledValueProps = {
  label: string
  value: ReactNode
  note?: ReactNode
  size?: keyof typeof VALUE_SIZES
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export const LabeledValue = ({
  label,
  value,
  note,
  size = 'sm',
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
    <span className={cn('block type-heading', VALUE_SIZES[size], valueClassName)}>{value}</span>
    {note ? <span className={cn('block text-ink/65', NOTE_SIZES[size])}>{note}</span> : null}
  </span>
)

export const LabeledValueRow = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => <div className={cn('flex flex-wrap gap-x-7 gap-y-3', className)}>{children}</div>
