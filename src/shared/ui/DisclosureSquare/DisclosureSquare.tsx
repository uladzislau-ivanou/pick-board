import { cn } from '@/shared/lib/cn'

/**
 * A span, not a button: both call sites sit inside a full-width button whose
 * `aria-expanded` already announces the state, so this is decoration.
 */
export const DisclosureSquare = ({ open, className }: { open: boolean; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'inline-flex size-6.5 shrink-0 items-center justify-center border border-divider text-ink/70',
      className,
    )}
  >
    {open ? '−' : '+'}
  </span>
)
