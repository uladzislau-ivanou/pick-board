import type { CSSProperties } from 'react'

export const CrestBadge = ({
  abbr,
  color,
  color2,
}: {
  abbr: string
  color: string
  color2: string
}) => (
  <span
    aria-hidden
    style={{ '--crest-color': color, '--crest-color-2': color2 } as CSSProperties}
    className="flex size-crest shrink-0 items-center justify-center rounded-full crest-split type-heading text-crest tracking-[-0.01em] text-white"
  >
    {abbr}
  </span>
)
