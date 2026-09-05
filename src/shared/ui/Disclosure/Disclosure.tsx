import { ChevronDown } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

export const Disclosure = ({ open, className }: { open: boolean; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'inline-flex size-6.5 shrink-0 items-center justify-center rounded-sm border border-divider text-ink/70 transition-transform',
      open && 'rotate-180',
      className,
    )}
  >
    <ChevronDown size={15} />
  </span>
)
