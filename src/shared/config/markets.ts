/** In `shared` because both entities need it: `Market.type` and `Pick.market`. */
export type MarketType = 'Moneyline' | 'Spread' | 'Over/Under'

export const MARKET_TYPES: readonly MarketType[] = ['Moneyline', 'Spread', 'Over/Under']
