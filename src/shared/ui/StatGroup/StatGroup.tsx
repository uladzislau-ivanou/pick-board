import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

export const Stat = ({
  label,
  value,
  note,
  valueClassName,
}: {
  label: string
  value: ReactNode
  note: ReactNode
  valueClassName?: string
}) => (
  <div>
    <div className="text-[10px] font-semibold tracking-[.12em] text-ink/65 uppercase">{label}</div>
    <div className={cn('type-heading text-[19px] tracking-[-0.03em]', valueClassName)}>{value}</div>
    <div className="text-[10.5px] text-ink/65">{note}</div>
  </div>
)

export const StatGroup = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex flex-wrap gap-x-7 gap-y-3', className)}>{children}</div>
)
