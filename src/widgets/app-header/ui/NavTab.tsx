import { NavLink } from 'react-router'

import { cn } from '@/shared/lib/cn'

export const NavTab = ({ to, label, count }: { to: string; label: string; count?: number }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        'flex min-h-11 items-center border-b-[3px] px-nav-x type-heading text-[13px] tracking-[.04em] whitespace-nowrap uppercase',
        isActive ? 'border-pb-brand text-pb-brand-ink' : 'border-transparent text-ink/65',
      )
    }
  >
    {label}
    {count === undefined ? null : <span className="ml-1.5 font-medium text-ink/65">{count}</span>}
  </NavLink>
)
