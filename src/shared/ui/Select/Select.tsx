import type { ComponentPropsWithRef } from 'react'

import { cn } from '@/shared/lib/cn'

export const Select = ({ className, ...props }: ComponentPropsWithRef<'select'>) => (
  <select
    className={cn(
      'min-h-8 rounded-md border border-divider bg-ground px-2 py-1.25 text-[12px] text-ink',
      className,
    )}
    {...props}
  />
)
