import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/cn'

import type { GridRow } from '../lib/market-grid'

const CrestBadge = ({ abbr, color, color2 }: { abbr: string; color: string; color2: string }) => (
  <span
    aria-hidden
    style={{ '--crest-color': color, '--crest-color-2': color2 } as CSSProperties}
    className="flex size-crest shrink-0 items-center justify-center rounded-full crest-split type-heading text-crest tracking-[-0.01em] text-white"
  >
    {abbr}
  </span>
)

export const TeamCell = ({ row }: { row: GridRow }) => {
  const { abbr, color, color2 } = row

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {abbr === undefined || color === undefined ? (
        <span aria-hidden className="size-crest shrink-0" />
      ) : (
        <CrestBadge abbr={abbr} color={color} color2={color2 ?? color} />
      )}
      <span
        className={cn(
          'truncate',
          abbr === undefined
            ? 'text-[12.5px] font-medium text-ink/65'
            : 'type-heading text-team tracking-[-0.02em]',
        )}
      >
        {row.name}
      </span>
      {row.side === undefined ? null : <span className="sr-only">{row.side} team</span>}
    </div>
  )
}
