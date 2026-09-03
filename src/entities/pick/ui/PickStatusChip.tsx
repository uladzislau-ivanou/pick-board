import { cn } from '@/shared/lib/cn'

import type { PickStatus } from '../model/types'

const STYLES: Record<PickStatus, string> = {
  Pending: 'border-pb-brand bg-pb-brand-tint text-pb-brand-ink',
  Won: 'border-pb-win-field bg-pb-win-field text-on-field',
  Lost: 'border-pb-loss-field bg-pb-loss-field text-on-field',
}

export const PickStatusChip = ({
  status,
  className,
}: {
  status: PickStatus
  className?: string
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-sm border px-2.25 py-1.25 text-[10px] font-semibold tracking-[.1em] uppercase',
      STYLES[status],
      className,
    )}
  >
    {status}
  </span>
)
