import type { ComponentPropsWithRef } from 'react'

import { cn } from '@/shared/lib/cn'

const BASE =
  'type-heading inline-flex min-h-8.5 items-center justify-start gap-1.5 rounded-md border text-[14px]/[1.2] transition-colors disabled:cursor-not-allowed disabled:opacity-45'

const VARIANTS = {
  primary:
    'min-h-[46px] border-pb-brand bg-pb-brand text-ground hover:border-pb-brand-ink hover:bg-pb-brand-ink',
  secondary: 'border-divider text-ink hover:bg-ink/7',
  ghost: 'border-transparent text-pb-brand hover:bg-pb-brand/10',
} as const

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: keyof typeof VARIANTS
  iconOnly?: boolean
  block?: boolean
}

export const Button = ({
  variant = 'secondary',
  iconOnly = false,
  block = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      BASE,
      VARIANTS[variant],
      iconOnly ? 'size-9 justify-center p-0' : 'px-3.5 py-2',
      block && 'w-full',
      className,
    )}
    {...props}
  />
)
