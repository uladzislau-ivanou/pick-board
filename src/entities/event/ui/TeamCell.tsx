import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/cn'

import { team } from '../lib/team'
import { CrestBadge } from './CrestBadge'

/** The club colour is data, so it is handed to CSS as a variable the `crest-field` utility reads. */
export const TeamCell = ({ name, side }: { name: string; side: 'away' | 'home' }) => {
  const { short, abbr, color } = team(name)
  const isHome = side === 'home'

  return (
    <div
      style={
        {
          '--crest-color': color,
          '--crest-angle': isHome ? '270deg' : '90deg',
        } as CSSProperties
      }
      className={cn(
        'flex min-w-0 items-center gap-matchup-gap crest-field px-matchup-x py-3.5',
        isHome && 'flex-row-reverse text-right',
      )}
    >
      <CrestBadge abbr={abbr} color={color} />
      <div className="min-w-0">
        <div className="truncate type-heading text-team tracking-[-0.02em]">{short}</div>
        <div className="text-[10px] font-semibold tracking-[.1em] text-ink/45 uppercase">
          {side}
        </div>
      </div>
    </div>
  )
}
