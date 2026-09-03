import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type Option<T extends string> = {
  value: T
  label: ReactNode
  /** When the visible label alone would read ambiguously, e.g. "Pending 3". */
  ariaLabel?: string
}

type SegmentedControlProps<T extends string> = {
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
  /** Names the group, so screen readers can tell the period control from the tabs. */
  label: string
  className?: string
}

/** The Pending/Settled tabs and the 7 days / 30 days / All period control. */
export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) => (
  <fieldset className={cn('inline-flex border border-divider', className)}>
    <legend className="sr-only">{label}</legend>
    {options.map((option) => {
      const isSelected = option.value === value
      return (
        <button
          key={option.value}
          type="button"
          aria-label={option.ariaLabel}
          aria-pressed={isSelected}
          onClick={() => onChange(option.value)}
          className={cn(
            'min-h-8.5 border-l border-divider px-3.5 type-heading text-[12px] tracking-[.04em] whitespace-nowrap uppercase transition-colors first:border-l-0',
            isSelected ? 'bg-pb-brand-ink text-ground' : 'text-ink hover:bg-ink/7',
          )}
        >
          {option.label}
        </button>
      )
    })}
  </fieldset>
)
