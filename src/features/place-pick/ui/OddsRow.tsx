import { ODDS_FORMAT_LABELS, useFormatOdds, useOddsFormat } from '@/shared/lib/odds'

export const OddsRow = ({ odds }: { odds: number }) => {
  const formatOdds = useFormatOdds()
  const { format } = useOddsFormat()

  return (
    <div className="flex items-center justify-between rounded-md border border-divider bg-neutral-200 px-3.5 py-3">
      <span className="text-[10px] font-semibold tracking-[.12em] text-ink/70 uppercase">
        Odds · {ODDS_FORMAT_LABELS[format]}
      </span>
      <span className="type-heading text-[18px]">{formatOdds(odds)}</span>
    </div>
  )
}
