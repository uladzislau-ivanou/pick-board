import type { ComponentPropsWithRef } from 'react'

import { cn } from '@/shared/lib/cn'

export const Tag = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
  <span
    className={cn(
      'inline-flex items-center border border-divider px-2.5 py-0.5 text-[11px] tracking-[.02em] whitespace-nowrap text-ink/75',
      className,
    )}
    {...props}
  />
)
