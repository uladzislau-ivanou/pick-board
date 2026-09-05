export type MarketType = 'Moneyline' | 'Spread' | 'Over/Under'

export const MARKET_TYPES: readonly MarketType[] = ['Moneyline', 'Spread', 'Over/Under']

export const MARKET_COLUMN_LABELS: Record<MarketType, { short: string; full: string }> = {
  Moneyline: { short: 'ML', full: 'Moneyline' },
  Spread: { short: 'Spread', full: 'Spread' },
  'Over/Under': { short: 'Total', full: 'Total' },
}
