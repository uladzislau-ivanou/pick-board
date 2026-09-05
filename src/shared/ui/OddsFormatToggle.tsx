import {
  ODDS_FORMAT_LABELS,
  ODDS_FORMAT_SHORT,
  useOddsFormat,
  type OddsFormat,
} from '@/shared/lib/odds'

const NEXT: Record<OddsFormat, OddsFormat> = { decimal: 'american', american: 'decimal' }

export const OddsFormatToggle = () => {
  const { format, select } = useOddsFormat()
  const next = NEXT[format]
  const label = `Odds in ${ODDS_FORMAT_LABELS[format].toLowerCase()} — switch to ${ODDS_FORMAT_LABELS[next].toLowerCase()}`

  return (
    <button
      type="button"
      onClick={() => select(next)}
      aria-label={label}
      title={label}
      className="flex h-9 min-w-11 items-center justify-center rounded-md border border-divider px-2 type-heading text-[11px] tracking-[.06em] text-ink/70 transition-colors hover:border-pb-brand hover:bg-pb-brand-tint hover:text-pb-brand"
    >
      {ODDS_FORMAT_SHORT[format]}
    </button>
  )
}
