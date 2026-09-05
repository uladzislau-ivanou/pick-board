export type OddsFormat = 'decimal' | 'american'

const MINUS = '−'

const toAmerican = (odds: number) => {
  if (odds <= 1) return odds.toFixed(2)
  return odds >= 2 ? `+${Math.round((odds - 1) * 100)}` : `${MINUS}${Math.round(100 / (odds - 1))}`
}

export const formatOdds = (odds: number, format: OddsFormat = 'decimal') =>
  format === 'american' ? toAmerican(odds) : odds.toFixed(2)

export const ODDS_FORMAT_LABELS: Record<OddsFormat, string> = {
  decimal: 'Decimal',
  american: 'American',
}

export const ODDS_FORMAT_SHORT: Record<OddsFormat, string> = {
  decimal: 'DEC',
  american: 'US',
}
