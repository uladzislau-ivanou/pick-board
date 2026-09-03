import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/cn'

import { team } from '../lib/team'
import { CrestBadge } from './CrestBadge'

export const TeamCell = ({
  name,
  side,
  className,
}: {
  name: string
  side: 'away' | 'home'
  className?: string
}) => {
  const { short, abbr, color, color2 } = team(name)
  const isHome = side === 'home'

  return (
    <div
      style={
        {
          '--crest-color': color,
          '--crest-color-2': color2,
          '--crest-angle': isHome ? '270deg' : '90deg',
          '--crest-flash-x': isHome ? '-3px' : '3px',
        } as CSSProperties
      }
      className={cn(
        'flex min-w-0 items-center gap-matchup-gap crest-field px-matchup-x py-3.5 crest-flash',
        isHome && 'flex-row-reverse text-right',
        className,
      )}
    >
      <CrestBadge abbr={abbr} />
      <div className="min-w-0">
        <div className="truncate type-heading text-team tracking-[-0.02em]">{short}</div>
        <span className="sr-only">{side} team</span>
      </div>
    </div>
  )
}
