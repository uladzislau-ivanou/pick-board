import { cn } from '@/shared/lib/cn'

export const DisclosureSquare = ({ open, className }: { open: boolean; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'inline-flex size-6.5 shrink-0 items-center justify-center rounded-sm border border-divider text-ink/70',
      className,
    )}
  >
    {open ? '−' : '+'}
  </span>
)
