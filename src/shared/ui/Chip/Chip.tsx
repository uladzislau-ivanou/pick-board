import type { ComponentPropsWithRef } from 'react'

import { cn } from '@/shared/lib/cn'

/** Sport filters, quick stakes and the chart's day filter. Callers set the height. */
type ChipProps = ComponentPropsWithRef<'button'> & {
  selected?: boolean
}

export const Chip = ({ selected = false, className, type = 'button', ...props }: ChipProps) => (
  <button
    type={type}
    aria-pressed={selected}
    className={cn(
      'inline-flex items-center gap-1.5 border px-3 type-heading text-[12px] tracking-[.04em] uppercase transition-colors',
      selected
        ? 'border-pb-brand-ink bg-pb-brand-ink text-ground'
        : 'border-divider bg-ground text-ink hover:border-pb-brand hover:bg-pb-brand-tint',
      className,
    )}
    {...props}
  />
)
