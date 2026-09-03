import { cn } from '@/shared/lib/cn'

import type { SortOption } from '../model/pick-query'

const NOTES: Record<SortOption, string> = {
  recent: 'Most recent first · click a chart day to filter',
  stake: 'Sorted by stake, largest first',
  payout: 'Sorted by potential payout',
}

export const SortNote = ({ sort, className }: { sort: SortOption; className?: string }) => (
  <p className={cn('text-[11px] text-ink/55', className)}>{NOTES[sort]}</p>
)
