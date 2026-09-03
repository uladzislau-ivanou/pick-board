import { cn } from '@/shared/lib/cn'

import type { PickStatus } from '../model/types'

const STYLES: Record<PickStatus, string> = {
  Pending: 'border-pb-brand bg-pb-brand-tint text-pb-brand-ink',
  Won: 'border-pb-win bg-pb-win text-ground',
  Lost: 'border-divider text-ink/60',
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
      'inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold tracking-[.1em] uppercase',
      STYLES[status],
      className,
    )}
  >
    {status}
  </span>
)
