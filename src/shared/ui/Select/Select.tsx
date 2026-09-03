import type { ComponentPropsWithRef } from 'react'

import { cn } from '@/shared/lib/cn'

/** Native on purpose: phones get the system picker and there is no listbox to make accessible. */
export const Select = ({ className, ...props }: ComponentPropsWithRef<'select'>) => (
  <select
    className={cn(
      'min-h-8 rounded-md border border-divider bg-ground px-2 py-1.25 text-[12px] text-ink',
      className,
    )}
    {...props}
  />
)
