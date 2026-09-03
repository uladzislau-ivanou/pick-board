import type { ReactNode } from 'react'

/** The shared head shape on both screens: kicker over title, with an aside on the right. */
export const PageHeader = ({
  kicker,
  title,
  aside,
}: {
  kicker: string
  title: string
  aside?: ReactNode
}) => (
  <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-divider pb-3.5">
    <div>
      <p className="mb-1.5 text-[10px] font-semibold tracking-[.14em] text-pb-brand uppercase">
        {kicker}
      </p>
      <h1 className="text-[34px] tracking-[-0.02em]">{title}</h1>
    </div>
    {aside}
  </div>
)
