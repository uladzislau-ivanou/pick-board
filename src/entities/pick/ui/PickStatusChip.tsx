import { cn } from '@/shared/lib/cn'

import type { PickStatus } from '../model/types'

const STYLES: Record<PickStatus, string> = {
  Pending: 'border-pb-brand text-pb-brand',
  Won: 'border-pb-win text-pb-win',
  Lost: 'border-pb-loss text-pb-loss',
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
      'inline-flex items-center rounded-sm border px-1.75 py-0.75 text-[10px] font-semibold tracking-[.08em] uppercase',
      STYLES[status],
      className,
    )}
  >
    {status}
  </span>
)
