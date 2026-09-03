import { NavLink } from 'react-router'

import { cn } from '@/shared/lib/cn'

export const NavTab = ({ to, label, count }: { to: string; label: string; count?: number }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        'flex items-center border-b-[3px] px-nav-x type-heading text-[13px] tracking-[.04em] uppercase',
        isActive ? 'border-pb-brand text-pb-brand-ink' : 'border-transparent text-ink/50',
      )
    }
  >
    {label}
    {count === undefined ? null : <span className="ml-1.5 font-medium opacity-60">{count}</span>}
  </NavLink>
)
